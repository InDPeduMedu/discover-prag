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

    // 3. Send Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("Missing RESEND_API_KEY");
        return { success: false, error: "Server configuration error." };
    }

    try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);

        // For testing/free tier, 'from' must be 'onboarding@resend.dev' unless domain is verified.
        // 'to' must be your verified email address.
        const { data, error } = await resend.emails.send({
            from: 'Discover Prague <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL || "delivered@resend.dev"],
            reply_to: validatedFields.data.email,
            subject: `New Message from ${validatedFields.data.name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${validatedFields.data.name}</p>
                <p><strong>Email:</strong> ${validatedFields.data.email}</p>
                <p><strong>Message:</strong></p>
                <br/>
                <p>${validatedFields.data.message.replace(/\n/g, '<br>')}</p>
            `
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, error: "Failed to send email." };
        }

        return { success: true };

    } catch (e) {
        console.error("Email Sending Failed:", e);
        return { success: false, error: "Internal server error." };
    }
}
