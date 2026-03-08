"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { logUserQuery, aiRateLimit } from "@/lib/rate-limit";
import { redis } from "@/lib/redis";

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function sendMessage(
    message: string,
    source: "web" | "telegram" = "web",
    history: { role: "user" | "model", text: string }[] = []
) {
    if (!apiKey) {
        return { error: "API key not configured" };
    }

    try {
        console.log(`[Chat Inquiry from ${source}]: ${message}`);

        // 1. Log the query for research
        await logUserQuery(message, source);

        // 2. Rate Limiting (10 requests per 10 seconds per IP/Source)
        const identifier = source === "telegram" ? "telegram_bot" : "web_user";
        const { success } = await aiRateLimit.limit(identifier);

        if (!success) {
            return { error: "Too many requests. Please slow down and try again in a moment." };
        }

        // 3. Check Cache (Only cache initial, history-less requests to avoid complex state caching bugs)
        const cacheKey = `discover_prag:cache:${message.toLowerCase().trim()}`;
        if (history.length === 0) {
            const cachedResponse = await redis.get<string>(cacheKey);
            if (cachedResponse) {
                console.log("Serving response from Redis Cache");
                return { text: cachedResponse };
            }
        }

        // 4. Generate Content using Gemini
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
-   **CRITICAL FORMATTING**: When recommending a specific place (a restaurant, museum, park, sight, etc.), you MUST format its name as a Markdown link pointing to a Google Maps search query. 
    *   Example: "[Charles Bridge](https://www.google.com/maps/search/?api=1&query=Charles+Bridge+Prague)"`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction,
        });

        // Convert our UI history format to Gemini's expected format
        const formattedHistory = history.map((msg) => ({
            role: msg.role === "model" ? "model" : "user",
            parts: [{ text: msg.text }],
        }));

        const chat = model.startChat({
            history: formattedHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        // 5. Store in Cache (Only for initial requests)
        if (history.length === 0) {
            await redis.setex(cacheKey, 86400, text);
        }

        return { text };
    } catch (error) {
        console.error("Error calling Gemini:", error);
        return { error: "Failed to generate response. Please try again." };
    }
}
