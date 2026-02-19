"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Cookie, X } from "@phosphor-icons/react";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        updateConsent("granted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined");
        updateConsent("denied");
        setIsVisible(false);
    };

    const updateConsent = (value: "granted" | "denied") => {
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("consent", "update", {
                ad_storage: value,
                analytics_storage: value,
                ad_user_data: value,
                ad_personalization: value,
            });
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-full duration-500">
            <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="bg-primary/10 p-3 rounded-xl hidden md:block">
                    <Cookie weight="fill" className="h-8 w-8 text-primary" />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                        <Cookie weight="fill" className="h-5 w-5 text-primary md:hidden" />
                        Cookie Settings
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        We use Google Analytics to understand how visitors interact with Discover Prague.
                        By clicking &quot;Accept&quot;, you consent to our use of cookies for analytics and performance.
                        See our <a href="/privacy-notice" className="text-primary hover:underline font-medium">Privacy Notice</a> for details.
                    </p>
                </div>

                <div className="flex flex-row gap-3 w-full md:w-auto">
                    <Button
                        variant="outline"
                        onClick={handleDecline}
                        className="flex-1 md:flex-none h-11 px-6 rounded-xl hover:bg-secondary/50"
                    >
                        Decline
                    </Button>
                    <Button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none h-11 px-8 rounded-xl shadow-lg shadow-primary/20"
                    >
                        Accept
                    </Button>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-3 right-3 p-1 text-muted-foreground/50 hover:text-foreground transition-colors"
                    aria-label="Close"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
