import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/app/actions/chat";

export async function POST(req: NextRequest) {
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!TELEGRAM_TOKEN) {
        console.error("TELEGRAM_BOT_TOKEN is not set");
        return NextResponse.json({ error: "Config error" }, { status: 500 });
    }

    const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

    try {
        const body = await req.json();

        // Telegram sends updates in various formats. We care about "message"
        if (!body.message || !body.message.text) {
            return NextResponse.json({ ok: true }); // Acknowledge other types of updates without action
        }

        const chatId = body.message.chat.id;
        const userText = body.message.text;

        console.log(`[Telegram Bot] ${chatId}: ${userText}`);

        // 1. Process with existing AI logic
        const aiResponse = await sendMessage(userText);

        const replyText = aiResponse.error
            ? `Sorry, I encountered an error: ${aiResponse.error}`
            : aiResponse.text || "I'm not sure how to respond to that.";

        // 2. Send response back to Telegram
        const tgResponse = await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: replyText,
                // Removed parse_mode: 'Markdown' because Gemini output often breaks Telegram's strict Markdown parser resulting in silent failures
            }),
        });

        if (!tgResponse.ok) {
            const errorData = await tgResponse.text();
            console.error("[Telegram API Error]:", errorData);
            // We still return ok: true so Telegram doesn't keep retrying the same bad message
        }

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
