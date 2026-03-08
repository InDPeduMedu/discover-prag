import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/app/actions/chat";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export async function POST(req: NextRequest) {
    if (!TELEGRAM_TOKEN) {
        console.error("TELEGRAM_BOT_TOKEN is not set");
        return NextResponse.json({ error: "Config error" }, { status: 500 });
    }

    try {
        const body = await req.json();

        // Telegram sends updates in various formats. We care about "message"
        if (!body.message || !body.message.text) {
            return NextResponse.json({ ok: true }); // Acknowledge other types of updates without action
        }

        const chatId = body.message.chat.id;
        const userText = body.message.text;

        console.log(`[Telegram Bot] Received message from ${chatId}: ${userText}`);

        // 1. Process with existing AI logic
        const aiResponse = await sendMessage(userText);

        const replyText = aiResponse.error
            ? `Sorry, I encountered an error: ${aiResponse.error}`
            : aiResponse.text || "I'm not sure how to respond to that.";

        // 2. Send response back to Telegram
        await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: replyText,
                parse_mode: "Markdown", // Our AI uses markdown, Telegram supports it
            }),
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("[Telegram Bot] Error processing webhook:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Optional: GET handler to verify the route is accessible
export async function GET() {
    return new Response("Telegram Bot Webhook is active.");
}
