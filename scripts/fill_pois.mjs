
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Error: GOOGLE_API_KEY or GEMINI_API_KEY not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const TARGET_FILE = path.join(__dirname, '../data/pack_big_pois.csv');
const SOURCE_DIR = path.join(__dirname, '../../_Resources/data');

// Helper to parse CSV line
function parseCSVLine(line) {
    const result = [];
    let start = 0;
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            result.push(line.substring(start, i).replace(/^"|"$/g, '').replace(/""/g, '"'));
            start = i + 1;
        }
    }
    result.push(line.substring(start).replace(/^"|"$/g, '').replace(/""/g, '"'));
    return result;
}

// Helper to escape CSV field
function escapeCSV(field) {
    if (field === undefined || field === null) return '';
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
}

async function main() {
    console.log("Starting POI filler script...");

    // 1. Read Target CSV
    console.log(`Reading target: ${TARGET_FILE}`);
    if (!fs.existsSync(TARGET_FILE)) {
        console.error(`Target file not found: ${TARGET_FILE}`);
        process.exit(1);
    }
    const targetContent = fs.readFileSync(TARGET_FILE, 'utf-8');
    const targetLines = targetContent.split('\n').filter(l => l.trim() !== '');
    const targetHeaderStr = targetLines[0];
    const targetHeader = parseCSVLine(targetHeaderStr);

    // Map column name to index
    const colMap = {};
    targetHeader.forEach((col, idx) => colMap[col] = idx);

    let targetData = targetLines.slice(1).map(line => {
        const parsed = parseCSVLine(line);
        const obj = {};
        targetHeader.forEach((col, idx) => obj[col] = parsed[idx] || '');
        return obj;
    });

    const existingNames = new Set(targetData.map(d => d.name));

    // 2. Read Source CSVs
    console.log(`Reading sources from: ${SOURCE_DIR}`);
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`Source directory not found: ${SOURCE_DIR}`);
        process.exit(1);
    }

    const sourceFiles = fs.readdirSync(SOURCE_DIR).filter(f => f.startsWith('pois_') && f.endsWith('.csv'));
    let newPOIs = [];

    for (const file of sourceFiles) {
        console.log(`Processing source: ${file}`);
        const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf-8');
        const lines = content.split('\n').filter(l => l.trim() !== '');
        if (lines.length < 2) continue;

        const header = parseCSVLine(lines[0]);

        const data = lines.slice(1).map(line => {
            const parsed = parseCSVLine(line);
            const obj = {};
            header.forEach((col, idx) => obj[col] = parsed[idx] || '');
            return obj;
        });

        for (const item of data) {
            if (existingNames.has(item.name)) continue;

            // Map fields
            // Create ID only if not present or needs normalization
            const id = item.id || `poi_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

            // Combine various potential theme/vibe fields
            const themesParts = [item.category, item.alcohol_focus, item.coffee_type, item.cuisine_tags, item.pastry_focus, item.scene_tags].filter(Boolean);
            const vibeParts = [item.vibe, item.vibe_night, item.vibe_coffee, item.mood].filter(Boolean);

            const newItem = {
                id: id,
                name: item.name,
                district: item.district || '',
                lat: item.lat || '',
                lon: item.lon || '',
                category: item.category || 'unknown',
                themes: themesParts.join(','),
                architectural_style: '', // Not usually in these files
                typical_visit_duration_min: item.typical_visit_duration_min || '60',
                opening_hours_note: '',
                ticket_info_note: '',
                short_description_en: item.short_description_en || '',
                area_tags: '',
                vibe: vibeParts.join(',')
            };
            newPOIs.push(newItem);
            existingNames.add(item.name);
        }
    }

    console.log(`Found ${newPOIs.length} new POIs from auxiliary files.`);

    // 3. Fill Placeholders with New Data from CSVs first
    let filledCount = 0;
    // We need to iterate over targetData carefully because we are modifying it in place or creating a new list.
    // Actually, let's substitute in place.

    // Find indices of placeholders
    const placeholderIndices = [];
    for (let i = 0; i < targetData.length; i++) {
        if (targetData[i].id && targetData[i].id.startsWith('poi_extra_') && targetData[i].name && targetData[i].name.startsWith('Extra Prague Place')) {
            placeholderIndices.push(i);
        }
    }

    const poisToInsert = [...newPOIs];

    for (let i = 0; i < placeholderIndices.length; i++) {
        if (poisToInsert.length === 0) break;
        const idx = placeholderIndices[i];
        const newPOI = poisToInsert.shift();

        // Merge
        const merged = { ...targetData[idx], ...newPOI };
        // Ensure we keep the target schema keys
        const cleanObj = {};
        targetHeader.forEach(col => {
            cleanObj[col] = merged[col] !== undefined ? merged[col] : '';
        });
        targetData[idx] = cleanObj;
        filledCount++;
    }

    console.log(`Filled ${filledCount} placeholders with local CSV data.`);

    // 4. Generate AI Data for a few remaining placeholders (LIMIT 5 for test)
    // Re-calculate remaining placeholders
    const remainingPlaceholders = targetData.filter(d => d.id.startsWith('poi_extra_') && d.name.startsWith('Extra Prague Place'));

    const toGenerateCount = Math.min(remainingPlaceholders.length, 5); // LIMIT 5 for test run

    if (toGenerateCount > 0) {
        console.log(`Generating ${toGenerateCount} completely new POIs using AI...`);

        // Create a context string of existing names to avoid duplicates
        // Using a random sample of 50 names to keep prompt size reasonable but diverse
        const allNames = Array.from(existingNames);
        const sampleNames = allNames.sort(() => 0.5 - Math.random()).slice(0, 50).join(', ');

        const prompt = `
      You are a travel expert for Prague.
      Generate ${toGenerateCount} UNIQUE points of interest (POIs) in Prague that are NOT in this list: ${sampleNames}.
      Focus on hidden gems, specific museums, parks, or interesting buildings.
      Return valid JSON (a list of objects) with these keys:
      name, district, lat (number), lon (number), category, themes (comma-separated string), architectural_style, typical_visit_duration_min (number), opening_hours_note, ticket_info_note, short_description_en, area_tags, vibe.
      Do not wrap the JSON in markdown code blocks. Just raw JSON.
    `;

        try {
            const result = await model.generateContent(prompt);
            let responseText = result.response.text();
            // clean valid JSON
            if (responseText.startsWith('```json')) {
                responseText = responseText.replace(/^```json/, '').replace(/```$/, '');
            } else if (responseText.startsWith('```')) {
                responseText = responseText.replace(/^```/, '').replace(/```$/, '');
            }
            responseText = responseText.trim();

            const generatedPOIs = JSON.parse(responseText);

            console.log(`AI returned ${generatedPOIs.length} items.`);

            let genIndex = 0;
            let pIndex = 0; // index into remainingPlaceholders is hard because we need index into targetData

            // Find indices again
            const stillPlaceholderIndices = [];
            for (let i = 0; i < targetData.length; i++) {
                if (targetData[i].id.startsWith('poi_extra_') && targetData[i].name.startsWith('Extra Prague Place')) {
                    stillPlaceholderIndices.push(i);
                }
            }

            for (let i = 0; i < stillPlaceholderIndices.length; i++) {
                if (genIndex >= generatedPOIs.length) break;

                const idx = stillPlaceholderIndices[i];
                const genItem = generatedPOIs[genIndex];
                const newId = `poi_${genItem.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

                targetData[idx] = {
                    id: newId,
                    name: genItem.name,
                    district: genItem.district || '',
                    lat: genItem.lat || '',
                    lon: genItem.lon || '',
                    category: genItem.category || '',
                    themes: genItem.themes || '',
                    architectural_style: genItem.architectural_style || '',
                    typical_visit_duration_min: genItem.typical_visit_duration_min || '',
                    opening_hours_note: genItem.opening_hours_note || '',
                    ticket_info_note: genItem.ticket_info_note || '',
                    short_description_en: genItem.short_description_en || '',
                    area_tags: genItem.area_tags || '',
                    vibe: genItem.vibe || ''
                };
                genIndex++;
            }
            console.log(`Generated and filled ${genIndex} items via AI.`);

        } catch (e) {
            console.error("AI Generation failed:", e);
            // Continue to save partial work
        }
    }

    // 5. Write back to file
    const outputLines = [targetHeader.map(escapeCSV).join(',')];
    targetData.forEach(row => {
        // Construct line in correct order
        const values = targetHeader.map(col => escapeCSV(row[col]));
        outputLines.push(values.join(','));
    });

    fs.writeFileSync(TARGET_FILE, outputLines.join('\n'));
    console.log(`Success! Updated ${TARGET_FILE} with total ${targetData.length} records.`);
}

main().catch(console.error);
