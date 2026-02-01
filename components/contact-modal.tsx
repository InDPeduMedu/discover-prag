"use client";

import { useContact } from "@/context/contact-context";
import { X, PaperPlaneRight, CircleNotch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming we have or will use standard textarea or just raw HTML
import { useState, useTransition } from "react";
import { submitContact } from "@/app/actions/contact"; // We'll make sure this import works

export function ContactModal() {
    const { isOpen, closeContact } = useContact();
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});

    if (!isOpen) return null;

    const handleSubmit = async (formData: FormData) => {
        setFieldErrors({}); // Clear previous errors

        startTransition(async () => {
            const result = await submitContact({}, formData);

            if (result.success) {
                setIsSuccess(true);
                setTimeout(() => {
                    closeContact();
                    setIsSuccess(false); // Reset for next time
                }, 2000);
            } else if (result.validationErrors) {
                setFieldErrors(result.validationErrors);
            } else {
                // General error handling
                alert("Something went wrong. Please try again.");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div
                className="w-full max-w-md bg-card border text-card-foreground rounded-xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                {/* Close Button */}
                <button
                    onClick={closeContact}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={20} />
                    <span className="sr-only">Close</span>
                </button>

                {/* Content */}
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                            <PaperPlaneRight size={32} weight="fill" />
                        </div>
                        <h3 className="text-2xl font-bold">Message Sent!</h3>
                        <p className="text-muted-foreground">Thanks for reaching out. We'll get back to you soon.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">Contact Support</h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Send us a message and we'll reply to your email.
                            </p>
                        </div>

                        <form action={handleSubmit} className="space-y-4">
                            {/* Honeypot Field - Hidden from humans */}
                            <div className="hidden" aria-hidden="true">
                                <label htmlFor="website_url">Website</label>
                                <input type="text" name="website_url" id="website_url" tabIndex={-1} autoComplete="off" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                                <Input id="name" name="name" placeholder="Your name" disabled={isPending} required />
                                {fieldErrors.name && <p className="text-xs text-destructive font-medium">{fieldErrors.name[0]}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                                <Input id="email" name="email" type="email" placeholder="you@example.com" disabled={isPending} required />
                                {fieldErrors.email && <p className="text-xs text-destructive font-medium">{fieldErrors.email[0]}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                    placeholder="How can we help?"
                                    disabled={isPending}
                                    required
                                />
                                {fieldErrors.message && <p className="text-xs text-destructive font-medium">{fieldErrors.message[0]}</p>}
                            </div>

                            <div className="pt-2">
                                <Button type="submit" className="w-full" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Message"
                                    )}
                                </Button>
                            </div>

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                Securely sent via server. Your email is safe.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
