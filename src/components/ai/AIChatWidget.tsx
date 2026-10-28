"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getPageContext } from "@/lib/ai/tripPlanner";
import ItineraryModal, { ItineraryData } from "./ItineraryModal";

interface Message {
    role: "user" | "assistant";
    content: string;
    itinerary?: ItineraryData;
}

export default function AIChatWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasGreeted, setHasGreeted] = useState(false);
    const [activeItinerary, setActiveItinerary] = useState<ItineraryData | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { context, suggestions, greeting } = getPageContext(pathname);

    useEffect(() => {
        if (isOpen && !hasGreeted) {
            setMessages([{ role: "assistant", content: greeting }]);
            setHasGreeted(true);
        }
    }, [isOpen, hasGreeted, greeting]);

    useEffect(() => {
        setHasGreeted(false);
        setMessages([]);
    }, [pathname]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: text };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/ai/trip-planner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages,
                    pageContext: context,
                }),
            });

            const data = await res.json();

            if (data.message !== undefined) {
                const assistantMessage: Message = {
                    role: "assistant",
                    content: data.message || "Here's your Konkan itinerary! 🌊",
                    itinerary: data.itinerary ?? undefined,
                };
                setMessages((prev) => [...prev, assistantMessage]);

                if (data.itinerary) {
                    setTimeout(() => setActiveItinerary(data.itinerary), 300);
                }
            } else {
                throw new Error("No response");
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Oops, something went wrong 🌊 Please try again!",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/vendor") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register")
    ) {
        return null;
    }

    return (
        <>
            {/* Itinerary Modal */}
            {activeItinerary && (
                <ItineraryModal
                    data={activeItinerary}
                    onClose={() => setActiveItinerary(null)}
                />
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-4 z-50 w-[360px] sm:w-[400px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    style={{ height: "520px" }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🌊</span>
                            <div>
                                <p className="text-white font-semibold text-sm">Kokan Mitra</p>
                                <p className="text-teal-100 text-xs">Your local travel guide</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-teal-200 transition-colors p-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                {msg.role === "assistant" && (
                                    <span className="text-lg mr-2 mt-1 flex-shrink-0">🌊</span>
                                )}
                                <div className="flex flex-col gap-2 max-w-[80%]">
                                    <div
                                        className={`rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user"
                                                ? "bg-teal-600 text-white rounded-tr-sm"
                                                : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>

                                    {/* View Itinerary Button */}
                                    {msg.itinerary && (
                                        <button
                                            onClick={() => setActiveItinerary(msg.itinerary!)}
                                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl px-4 py-2.5 transition-colors shadow-sm"
                                        >
                                            <span>🗺️</span>
                                            <span>View Full Itinerary</span>
                                            <span className="ml-auto">→</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <span className="text-lg mr-2 mt-1">🌊</span>
                                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                                    <div className="flex gap-1 items-center">
                                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestion Chips */}
                    {messages.length <= 1 && (
                        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto flex-shrink-0">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(s)}
                                    className="flex-shrink-0 text-xs bg-white border border-teal-200 text-teal-700 rounded-full px-3 py-1.5 hover:bg-teal-50 hover:border-teal-400 transition-colors whitespace-nowrap"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 items-center flex-shrink-0">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything about Konkan..."
                            className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 bg-gray-50"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => sendMessage(input)}
                            disabled={!input.trim() || isLoading}
                            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white rounded-full p-2.5 transition-colors flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Bubble */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-4 z-50 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center"
            >
                {isOpen ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <span className="text-2xl">🌊</span>
                )}
            </button>
        </>
    );
}