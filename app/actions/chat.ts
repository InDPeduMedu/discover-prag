"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function sendMessage(message: string) {
    if (!apiKey) {
        return { error: "API key not configured" };
    }

    try {
        console.log(`[Chat Inquiry]: ${message}`);
        const systemInstruction = `
You are a friendly, expert local guide for Prague, Czech Republic. 
Your task is to help users plan their trip to Prague using your comprehensive knowledge of the city.

**CRITICAL GUARDRAILS:**
1.  **PRAGUE ONLY**: You MUST define yourself as a Prague expert. If the user asks about other cities (e.g., Paris, London) or general topics (math, coding, life advice), politely REFUSE and steer the conversation back to Prague.
    *   Example: "I specialize only in Prague! I can't help with Paris, but I can tell you about Prague's Little Paris in Mala Strana."
2.  **EXPERT KNOWLEDGE**: Provide detailed, accurate, and helpful information about sights, restaurants, hidden gems, and transportation in Prague.
3.  **NO HALLUCINATIONS**: If you are unsure about very specific details (like current temporary closures), advise the user to check the official website.

When answering:
-   Be concise and helpful.
-   Use Markdown for formatting (bold names, lists).
-   Offer to help plan specific routes or suggest personalized spots based on their interests.
`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction,
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        return { text };
    } catch (error) {
        console.error("Error calling Gemini:", error);
        return { error: "Failed to generate response. Please try again." };
    }
}
