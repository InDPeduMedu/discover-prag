import { redis } from './redis'
import { Ratelimit } from '@upstash/ratelimit'

// --- RATE LIMITING ---
// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const aiRateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
})

// --- QUERY LOGGING ---
// Append user inquiries to a list in Redis for later review
export async function logUserQuery(query: string, source: "web" | "telegram") {
    try {
        const entry = JSON.stringify({
            query: query,
            source: source,
            timestamp: new Date().toISOString()
        })

        await redis.rpush('discover_prag:queries', entry)
    } catch (error) {
        console.error("Failed to log query to Redis:", error)
        // We don't want a logging failure to crash the chat
    }
}
