"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { PaperPlaneRight, Plus, Spinner } from "@phosphor-icons/react"; // Assuming Spinner exists or use simplified loader
import { useState } from "react";
import { sendMessage } from "@/app/actions/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
    role: "user" | "model";
    text: string;
};

export default function ChatPage() {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue("");

        // Optimistic UI: Add user message immediately
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await sendMessage(userMessage);

            if (response.error) {
                // Handle error (could add a system message or toast)
                console.error(response.error);
                setMessages((prev) => [...prev, { role: "model", text: `Error: ${response.error}` }]);
            } else if (response.text) {
                setMessages((prev) => [...prev, { role: "model", text: response.text }]);
            }
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex flex-1 flex-col items-center p-4 md:p-8 w-full max-w-5xl mx-auto space-y-8 relative">

                {messages.length === 0 ? (
                    /* Hero Section / Empty State */
                    <div className="flex flex-1 flex-col items-center justify-center text-center space-y-6 px-4 mt-20">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent break-words max-w-full">
                            Discover Prague
                            <br className="hidden md:inline" />
                            <span className="text-primary italic block md:inline mt-2 md:mt-0">Tailored to YOU</span>
                        </h1>
                        <p className="text-lg text-muted-foreground md:text-2xl max-w-[800px] px-2">
                            Your personal AI guide to the Heart of Europe.
                        </p>
                    </div>
                ) : (
                    /* Message List */
                    <div className="w-full flex-1 space-y-6 pb-32">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-6 py-4 text-lg ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary/50 border border-border/50 backdrop-blur"
                                        }`}
                                >
                                    {msg.role === "user" ? (
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                    ) : (
                                        <div className="prose prose-lg dark:prose-invert max-w-none break-words leading-relaxed">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ node, ...props }: any) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                                                    h2: ({ node, ...props }: any) => <h2 className="text-xl font-bold mt-6 mb-3" {...props} />,
                                                    h3: ({ node, ...props }: any) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                                                    ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 space-y-2 mb-4" {...props} />,
                                                    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 space-y-2 mb-4" {...props} />,
                                                    li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
                                                    p: ({ node, ...props }: any) => <p className="mb-4 last:mb-0" {...props} />,
                                                    strong: ({ node, ...props }: any) => <strong className="font-bold text-primary/90" {...props} />,
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex w-full justify-start">
                                <div className="rounded-2xl px-6 py-4 bg-secondary/50 text-muted-foreground animate-pulse">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Chat Input Area - Fixed/Sticky at bottom if messages exist? 
            For now keeping it static in flow for empty state, but maybe fixed for chat?
            Let's keep the user's requested layout: Input at bottom.
            If messages > 0, we might want it fixed. 
            For this iteration, let's keep the layout simple: flex-col, input at bottom.
        */}
                <div className={`w-full max-w-3xl px-4 md:px-0 ${messages.length > 0 ? "fixed bottom-8 z-20" : ""}`}>
                    <div className="relative flex flex-col w-full rounded-[2rem] bg-secondary/30 border border-border/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all hover:border-primary/50 overflow-hidden backdrop-blur-md supports-[backdrop-filter]:bg-background/60">

                        {/* Top Level: Text Input */}
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Start your plan here, what would you like to do?"
                            className="w-full min-h-[80px] p-6 text-base md:text-xl bg-transparent border-none focus:outline-none resize-none placeholder:text-muted-foreground/70"
                            style={{ fieldSizing: "content" } as any}
                        />

                        {/* Bottom Level: CTAs & Tools */}
                        <div className="flex items-center justify-between px-4 pb-4 pt-2">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/50">
                                    <Plus className="h-6 w-6" />
                                    <span className="sr-only">Add attachment</span>
                                </Button>
                            </div>

                            <Button
                                size="icon"
                                onClick={handleSend}
                                className="h-12 w-12 rounded-xl shrink-0 transition-all"
                                disabled={!inputValue.trim() || isLoading}
                            >
                                <PaperPlaneRight weight="fill" className="h-5 w-5" />
                                <span className="sr-only">Send message</span>
                            </Button>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center mt-4">
                        AI can make mistakes. Check important info.
                    </p>
                </div>
            </main>

            {/* Hide Footer in chat mode to avoid clutter? Or keep it? keeping it for now but maybe pushed down */}
            {messages.length === 0 && <Footer />}
        </div>
    );
}
