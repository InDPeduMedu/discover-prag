"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPragueData } from "@/lib/data-loader";

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function sendMessage(message: string) {
    if (!apiKey) {
        return { error: "API key not configured" };
    }

    try {
        const { pois, itineraries } = getPragueData();

        const systemInstruction = `
You are a friendly, expert local guide for Prague, Czech Republic.
Your task is to help users plan their trip to Prague using ONLY the data provided below and your general knowledge of Prague.

**CRITICAL GUARDRAILS:**
1.  **PRAGUE ONLY**: You MUST define yourself as a Prague expert. If the user asks about other cities (e.g., Paris, London) or general topics (math, coding, life advice), politely REFUSE and steer the conversation back to Prague.
    *   Example: "I specialize only in Prague! I can't help with Paris, but I can tell you about Prague's Little Paris in Mala Strana."
2.  **USE PROVIDED DATA**: Prioritize the Proprietary Data below. If a user asks for recommendations, use specific POIs from the list.
3.  **NO HALLUCINATIONS**: Do not make up opening hours or prices if you aren't sure. Use the generic info or say you don't know.

**PROPRIETARY DATA:**

[POINTS OF INTEREST]
${pois.slice(0, 50).map(p => `- ${p.name} (${p.district}): ${p.description}. Vibe: ${p.vibe}`).join("\n")}
(And many more...)

[PRE-MADE ITINERARIES]
${itineraries.map(i => `- ${i.title}: ${i.ideal_for}`).join("\n")}

When answering:
-   Be concise and helpful.
-   Use Markdown for formatting (bold names, lists).
-   If suggesting an itinerary, mention the "Classic Icons" or "Offbeat" options if relevant.
`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction,
        });

        // Simple prompt for now, can be enhanced with system instructions later
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        return { text };
    } catch (error) {
        console.error("Error calling Gemini:", error);
        return { error: "Failed to generate response. Please try again." };
    }
}
