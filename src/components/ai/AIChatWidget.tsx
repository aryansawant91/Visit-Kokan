"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getPageContext } from "@/lib/ai/pageContext";
import ItineraryModal, { ItineraryData } from "./ItineraryModal";

interface Message {
    role: "user" | "assistant";
    content: string;
    itinerary?: ItineraryData;
}

function parseInlineTokens(rawText: string, lineIdx: number): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    let keyCounter = 0;
    // 1: **[label](url)** | 2: [**label**](url) | 3: [label](url) | 4: **bold** | 5: *italic* | 6: `code`
    const tokenRegex = /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\[\*\*([^*]+)\*\*\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = tokenRegex.exec(rawText)) !== null) {
        if (match.index > lastIndex) {
            parts.push(rawText.substring(lastIndex, match.index));
        }

        // Branch 1: **[label](url)**
        if (match[1] && match[2]) {
            const label = match[1];
            const url = match[2];
            const isInternal = url.startsWith("/");
            parts.push(
                isInternal ? (
                    <Link
                        key={`link-${lineIdx}-${keyCounter++}`}
                        href={url}
                        className="inline-flex items-center gap-0.5 text-teal-800 font-bold underline decoration-teal-400 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-1.5 py-0.5 rounded transition-colors text-xs"
                    >
                        {label}
                    </Link>
                ) : (
                    <a
                        key={`ext-${lineIdx}-${keyCounter++}`}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-teal-800 font-bold underline decoration-teal-400 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-1.5 py-0.5 rounded transition-colors text-xs"
                    >
                        {label}
                    </a>
                )
            );
        }
        // Branch 2: [**label**](url)
        else if (match[3] && match[4]) {
            const label = match[3];
            const url = match[4];
            const isInternal = url.startsWith("/");
            parts.push(
                isInternal ? (
                    <Link
                        key={`link-${lineIdx}-${keyCounter++}`}
                        href={url}
                        className="inline-flex items-center gap-0.5 text-teal-800 font-bold underline decoration-teal-400 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-1.5 py-0.5 rounded transition-colors text-xs"
                    >
                        {label}
                    </Link>
                ) : (
                    <a
                        key={`ext-${lineIdx}-${keyCounter++}`}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-teal-800 font-bold underline decoration-teal-400 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-1.5 py-0.5 rounded transition-colors text-xs"
                    >
                        {label}
                    </a>
                )
            );
        }
        // Branch 3: [label](url)
        else if (match[5] && match[6]) {
            const label = match[5];
            const url = match[6];
            const isInternal = url.startsWith("/");
            parts.push(
                isInternal ? (
                    <Link
                        key={`link-${lineIdx}-${keyCounter++}`}
                        href={url}
                        className="inline-flex items-center gap-0.5 text-teal-800 font-bold underline decoration-teal-400 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-1.5 py-0.5 rounded transition-colors text-xs"
                    >
                        {label}
                    </Link>
                ) : (
                    <a
                        key={`ext-${lineIdx}-${keyCounter++}`}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-teal-800 font-bold underline decoration-teal-400 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-1.5 py-0.5 rounded transition-colors text-xs"
                    >
                        {label}
                    </a>
                )
            );
        }
        // Branch 4: **bold**
        else if (match[7]) {
            const innerLink = match[7].match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (innerLink) {
                const label = innerLink[1];
                const url = innerLink[2];
                const isInternal = url.startsWith("/");
                parts.push(
                    isInternal ? (
                        <Link
                            key={`bold-link-${lineIdx}-${keyCounter++}`}
                            href={url}
                            className="inline-flex items-center gap-0.5 text-teal-800 font-bold underline decoration-teal-400 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-1.5 py-0.5 rounded transition-colors text-xs"
                        >
                            {label}
                        </Link>
                    ) : (
                        <a
                            key={`bold-ext-${lineIdx}-${keyCounter++}`}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-teal-800 font-bold underline decoration-teal-400 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-1.5 py-0.5 rounded transition-colors text-xs"
                        >
                            {label}
                        </a>
                    )
                );
            } else {
                parts.push(
                    <strong key={`bold-${lineIdx}-${keyCounter++}`} className="font-semibold text-gray-900">
                        {match[7]}
                    </strong>
                );
            }
        }
        // Branch 5: *italic*
        else if (match[8]) {
            parts.push(
                <em key={`italic-${lineIdx}-${keyCounter++}`} className="italic">
                    {match[8]}
                </em>
            );
        }
        // Branch 6: `code`
        else if (match[9]) {
            parts.push(
                <code key={`code-${lineIdx}-${keyCounter++}`} className="bg-gray-100 text-teal-800 px-1 py-0.5 rounded text-xs">
                    {match[9]}
                </code>
            );
        }

        lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < rawText.length) {
        parts.push(rawText.substring(lastIndex));
    }

    return parts;
}

function renderFormattedContent(content: string | undefined | null, isUser: boolean) {
    if (isUser) {
        return <span className="whitespace-pre-wrap">{content || ""}</span>;
    }

    if (!content || typeof content !== "string") {
        return <span>{String(content || "")}</span>;
    }

    // Replace literal <br> or <br/> tags with newlines
    const cleanContent = content.replace(/<br\s*\/?>/gi, "\n");
    const lines = cleanContent.split("\n");

    return (
        <div className="space-y-1.5 leading-relaxed text-sm">
            {lines.map((line, lineIdx) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={lineIdx} className="h-1.5" />;

                // Skip markdown table separator lines like | --- | --- | or |:---|:---|
                if (/^\|[\s\-:]+(\|[\s\-:]+)+\|?$/.test(trimmed)) {
                    return null;
                }

                // Check for table rows like | Key | Value |
                if (trimmed.startsWith("|") && trimmed.includes("|", 1)) {
                    const cols = trimmed.split("|").map(c => c.trim()).filter(Boolean);
                    if (cols.length >= 2) {
                        return (
                            <div key={lineIdx} className="my-1.5 p-2 bg-teal-50/70 border border-teal-100/80 rounded-xl text-xs space-y-0.5">
                                <span className="font-bold text-teal-900 block">
                                    {parseInlineTokens(cols[0], lineIdx)}
                                </span>
                                <span className="text-gray-700 block">
                                    {parseInlineTokens(cols.slice(1).join(" — "), lineIdx)}
                                </span>
                            </div>
                        );
                    }
                }

                const isH3 = line.startsWith("### ");
                const isH2 = line.startsWith("## ");
                const isBullet = line.startsWith("- ") || line.startsWith("* ");
                const rawLine = isH3 ? line.slice(4) : isH2 ? line.slice(3) : isBullet ? line.slice(2) : line;

                const parts = parseInlineTokens(rawLine, lineIdx);

                if (isH2) {
                    return (
                        <p key={lineIdx} className="font-bold text-sm text-gray-900 pt-1">
                            {parts.length > 0 ? parts : rawLine}
                        </p>
                    );
                }
                if (isH3) {
                    return (
                        <p key={lineIdx} className="font-semibold text-xs text-teal-800 uppercase tracking-wide pt-1">
                            {parts.length > 0 ? parts : rawLine}
                        </p>
                    );
                }
                if (isBullet) {
                    return (
                        <div key={lineIdx} className="flex items-start gap-1.5 pl-1">
                            <span className="text-teal-500 text-xs mt-0.5">•</span>
                            <div className="flex-1">{parts.length > 0 ? parts : rawLine}</div>
                        </div>
                    );
                }

                return (
                    <p key={lineIdx}>
                        {parts.length > 0 ? parts : rawLine}
                    </p>
                );
            })}
        </div>
    );
}

export default function AIChatWidget() {
    const rawPathname = usePathname();
    const pathname = rawPathname || "";
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
                    pathname: pathname,
                }),
            });

            const data = await res.json();

            if (data.message !== undefined) {
                const assistantMessage: Message = {
                    role: "assistant",
                    content: data.message || "Here's your Konkan plan! 🌊",
                    itinerary: data.itinerary ?? undefined,
                };
                setMessages((prev) => [...prev, assistantMessage]);

                if (data.itinerary) {
                    setTimeout(() => setActiveItinerary(data.itinerary), 300);
                }
            } else if (data.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `⚠️ ${data.error}. Please tap send again to retry.`,
                    },
                ]);
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
                                <p className="text-teal-100 text-xs">Your local travel concierge</p>
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
                                <div className="flex flex-col gap-2 max-w-[85%]">
                                    <div
                                        className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                                ? "bg-teal-600 text-white rounded-tr-sm"
                                                : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm"
                                            }`}
                                    >
                                        {renderFormattedContent(msg.content, msg.role === "user")}
                                    </div>

                                    {/* Dynamic Luxury Itinerary Preview Card */}
                                    {msg.itinerary && (
                                        <div className="rounded-2xl bg-gradient-to-br from-[#102818] via-[#1a4227] to-[#122e1b] text-white p-3.5 shadow-md border border-emerald-900/40 space-y-2">
                                            <div className="flex items-center justify-between gap-1">
                                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B7895A] flex items-center gap-1">
                                                    <span>✨</span> Curated Plan
                                                </span>
                                                {msg.itinerary.totalBudget && (
                                                    <span className="text-[10px] font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded-full">
                                                        Est. {msg.itinerary.totalBudget}
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="font-black text-sm text-white leading-tight">
                                                {msg.itinerary.title}
                                            </h4>

                                            {msg.itinerary.subtitle && (
                                                <p className="text-[11px] text-emerald-100/80 line-clamp-1 leading-snug">
                                                    {msg.itinerary.subtitle}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px] text-emerald-200">
                                                <span className="bg-white/10 px-2 py-0.5 rounded-md font-semibold">
                                                    📅 {msg.itinerary.days.length} {msg.itinerary.days.length === 1 ? "Day" : "Days"}
                                                </span>
                                                {msg.itinerary.transportSummary && (
                                                    <span className="bg-white/10 px-2 py-0.5 rounded-md font-semibold">
                                                        🚂 {msg.itinerary.transportSummary.name || msg.itinerary.transportSummary.type}
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => setActiveItinerary(msg.itinerary!)}
                                                className="w-full mt-1 py-2 px-3 bg-[#b8dc26] hover:bg-[#aed422] active:scale-[0.98] text-[#142607] font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <span>🗺️ View Full Dynamic Itinerary</span>
                                                <span>→</span>
                                            </button>
                                        </div>
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
