import { z } from "zod";

const envSchema = z.object({
    GOOGLE_API_KEY: z.string().min(1, "GOOGLE_API_KEY is required"),
    TELEGRAM_BOT_TOKEN: z.string().min(1, "TELEGRAM_BOT_TOKEN is required"),
    KV_REST_API_URL: z.string().url("KV_REST_API_URL must be a valid URL").optional(),
    KV_REST_API_TOKEN: z.string().min(1).optional(),
    TELEGRAM_SECRET_TOKEN: z.string().min(1, "TELEGRAM_SECRET_TOKEN is required"),
});

export const env = envSchema.parse(process.env);
