import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/app/actions/chat";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
    const TELEGRAM_TOKEN = env.TELEGRAM_BOT_TOKEN;
    const SECRET_TOKEN = env.TELEGRAM_SECRET_TOKEN;

    // Check if the secret token matches the one Telegram sends
    const providedToken = req.headers.get("x-telegram-bot-api-secret-token");
    if (providedToken !== SECRET_TOKEN) {
        console.warn(`[Telegram Webhook] Unauthorized attempt with token: ${providedToken}`);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        const aiResponse = await sendMessage(userText, "telegram");

        const replyText = aiResponse.error
            ? `Sorry, I encountered an error: ${aiResponse.error}`
            : aiResponse.text || "I'm not sure how to respond to that.";

        // Sanitize the text for Telegram's strict MarkdownV2 requirements
        // We only want to preserve links [text](url) and bold **text**, everything else needs escaping
        const escapeTelegramText = (text: string) => {
            // A basic implementation to escape characters that break Telegram MarkdownV2
            // Note: A perfect markdown parser here is complex, but this handles most Gemini outputs safely.
            let escaped = text.replace(/([_\[\]()~`>#+\-=|{}.!])/g, '\\$1');

            // Re-enable bold
            escaped = escaped.replace(/\\\*\\\*(.*?)\\\*\\\*/g, '*$1*');

            // Re-enable links if they match the format \[text\]\(url\)
            // The regex looks for escaped brackets and parens
            escaped = escaped.replace(/\\\[(.*?)\\\]\\\(https?:\/\/(.*?)\\\)/g, '[$1](https://$2)');

            return escaped;
        };

        const safeReplyText = escapeTelegramText(replyText);

        // 2. Send response back to Telegram
        const tgResponse = await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: safeReplyText,
                parse_mode: "MarkdownV2",
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
