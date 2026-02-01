"use server";

import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    website_url: z.string().optional(), // Honeypot field
});

export type ContactState = {
    success?: boolean;
    error?: string;
    validationErrors?: {
        name?: string[];
        email?: string[];
        message?: string[];
    };
};

export async function submitContact(prevState: ContactState, formData: FormData): Promise<ContactState> {
    // 1. Honeypot Check
    const honeypot = formData.get("website_url");
    if (honeypot && honeypot.toString().length > 0) {
        // Silently fail for bots
        return { success: true };
    }

    // 2. Validate Input
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
        website_url: formData.get("website_url"),
    };

    const validatedFields = contactSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            validationErrors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // 3. "Send" Email
    // In a real app, you would use Resend/SendGrid here.
    // For this demo, we verify the secure env var exists and log it.

    // Security: The email is read from Server Environment ONLY.
    const destinationEmail = process.env.CONTACT_EMAIL || "contact@discoverprague.com";

    console.log(`[SECURE CONTACT] Message from ${validatedFields.data.email} to ${destinationEmail}`);
    console.log(`Content: ${validatedFields.data.message}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true };
}
