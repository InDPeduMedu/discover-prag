"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function sendMessage(message: string) {
    if (!apiKey) {
        return { error: "API key not configured" };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
