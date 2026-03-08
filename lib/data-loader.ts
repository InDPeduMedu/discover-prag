import fs from "fs";
import path from "path";

export interface POI {
    id: string;
    name: string;
    district: string;
    category: string;
    description: string;
    vibe: string;
}

export interface ItineraryItem {
    poi_id: string;
    action?: string;
    estimated_minutes: number;
}

export interface Itinerary {
    id: string;
    title: string;
    ideal_for: string;
    total_minutes: number;
    sequence: ItineraryItem[];
}

export type PragueData = {
    pois: POI[];
    itineraries: Itinerary[];
};

let cachedData: PragueData | null = null;

// Simple CSV parser that handles quoted fields
function parseCSV(text: string): Record<string, string>[] {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) return [];

    const headers = parseCSVLine(lines[0]);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i];
        if (!currentLine.trim()) continue;

        const values = parseCSVLine(currentLine);
        const entry: Record<string, string> = {};

        headers.forEach((header, index) => {
            entry[header.trim()] = values[index]?.trim() || "";
        });

        result.push(entry);
    }
    return result;
}

function parseCSVLine(line: string): string[] {
    const values = [];
    let currentValue = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            values.push(currentValue);
            currentValue = "";
        } else {
            currentValue += char;
        }
    }
    values.push(currentValue);
    return values;
}

export function getPragueData(): PragueData {
    if (cachedData) return cachedData;

    try {
        const dataDir = path.join(process.cwd(), "data");

        // Load POIs
        const poisPath = path.join(dataDir, "pack_big_pois.csv");
        const poisRaw = fs.readFileSync(poisPath, "utf-8");
        const poisParsed = parseCSV(poisRaw).map(row => ({
            id: row.id,
            name: row.name,
            district: row.district,
            category: row.category,
            description: row.short_description_en,
            vibe: row.vibe
        }));

        // Load Itineraries
        const itinerariesPath = path.join(dataDir, "pack_medium_itineraries.json");
        const itinerariesRaw = fs.readFileSync(itinerariesPath, "utf-8");
        const parsedJson = JSON.parse(itinerariesRaw) as Array<Record<string, unknown>>;

        const itinerariesParsed = parsedJson.map((item) => ({
            id: item.itinerary_id as string,
            title: item.title_en as string,
            ideal_for: item.ideal_for_en as string,
            total_minutes: item.total_estimated_minutes as number,
            sequence: item.sequence as ItineraryItem[]
        }));

        cachedData = {
            pois: poisParsed,
            itineraries: itinerariesParsed
        };

        return cachedData;

    } catch (error) {
        console.error("Error loading Prague data:", error);
        // Fallback empty data so the app doesn't crash
        return { pois: [], itineraries: [] };
    }
}
