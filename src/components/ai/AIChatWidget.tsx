"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MapPin, Compass, Sparkles, MessageCircle, ArrowRight, ExternalLink } from "lucide-react";
import { getPageContext } from "@/lib/ai/pageContext";
import ItineraryModal, { ItineraryData } from "./ItineraryModal";
import { ALL_WEBSITE_TREKS, ALL_WEBSITE_DESTINATIONS, PLATFORM_INFO } from "@/lib/ai/kokanWebsiteData";

interface Message {
    role: "user" | "assistant";
    content: string;
    itinerary?: ItineraryData;
}

const DESTINATION_IMAGES: Record<string, string> = {
    "tarkarli": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    "tarkarli-beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    "ganpatipule": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    "ganpatipule-beach": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    "alibaug": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    "alibaug-beach": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    "murud-janjira": "https://images.unsplash.com/photo-1590053303666-4e55e8d3568c?w=800&q=80",
    "kashid": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    "kashid-beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    "velas": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    "velas-beach": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    "devbag": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    "devbag-beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    "chiplun": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    "guhagar": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    "guhagar-beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
};

interface EntityCardData {
    type: "trek" | "destination";
    name: string;
    image: string;
    badge: string;
    priceOrRating: string;
    location: string;
    highlights: string[];
    href?: string;
    slug?: string;
}

function getEntityForItinerary(itinerary: ItineraryData): EntityCardData {
    const query = `${itinerary.title} ${itinerary.subtitle || ""}`.toLowerCase();

    // 1. Check if matches a trek
    const matchedTrek = ALL_WEBSITE_TREKS.find(t =>
        query.includes(t.slug) ||
        query.includes(t.name.toLowerCase()) ||
        t.slug.split("-").some(part => part.length > 3 && query.includes(part))
    );

    if (matchedTrek) {
        return {
            type: "trek",
            name: matchedTrek.name,
            image: `/images/treks/${matchedTrek.slug}/1.jpg`,
            badge: `🥾 ${matchedTrek.difficulty.toUpperCase()} TREK`,
            priceOrRating: `₹1,499 / person`,
            location: `${matchedTrek.baseVillage || matchedTrek.region} • ${matchedTrek.elevation || "Sahyadri"}`,
            highlights: matchedTrek.highlights
                ? matchedTrek.highlights.split(";").map(h => h.trim().replace(/^[^a-zA-Z0-9]+/, "")).slice(0, 3)
                : ["Guided Expedition", "Safety Briefing"],
            href: `/treks/${matchedTrek.slug}`,
            slug: matchedTrek.slug,
        };
    }

    // 2. Check if matches a destination
    const matchedDest = ALL_WEBSITE_DESTINATIONS.find(d =>
        query.includes(d.slug) ||
        query.includes(d.name.toLowerCase()) ||
        d.slug.split("-").some(part => part.length > 3 && query.includes(part))
    );

    if (matchedDest) {
        const destImg = DESTINATION_IMAGES[matchedDest.slug] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
        return {
            type: "destination",
            name: matchedDest.name,
            image: destImg,
            badge: `📍 ${matchedDest.category.toUpperCase()} • ${matchedDest.region}`,
            priceOrRating: `⭐ 4.8 Rating`,
            location: `${matchedDest.region}, Konkan`,
            highlights: matchedDest.highlights
                ? matchedDest.highlights.split(";").map(h => h.trim()).slice(0, 3)
                : ["Scenic Views", "Coastal Culture"],
            href: `/destinations/${matchedDest.slug}`,
            slug: matchedDest.slug,
        };
    }

    return {
        type: "destination",
        name: itinerary.title,
        image: "/images/banners/coastal-getaways.jpg",
        badge: "✨ CURATED KONKAN PLAN",
        priceOrRating: itinerary.totalBudget ? `Est. ${itinerary.totalBudget}` : "⭐ Verified Plan",
        location: itinerary.subtitle || "Konkan Coast & Sahyadris",
        highlights: ["Detailed Timeline", "Verified Transit", "Local Food"],
    };
}

function extractMentionedEntitiesFromText(content: string): EntityCardData[] {
    if (!content) return [];
    const results: EntityCardData[] = [];
    const seen = new Set<string>();

    // Treks: /treks/[slug]
    const trekMatches = Array.from(content.matchAll(/\/treks\/([a-z0-9-]+)/g));
    for (const m of trekMatches) {
        const slug = m[1];
        if (seen.has(slug)) continue;
        seen.add(slug);
        const trek = ALL_WEBSITE_TREKS.find(t => t.slug === slug);
        if (trek) {
            results.push({
                type: "trek",
                name: trek.name,
                image: `/images/treks/${trek.slug}/1.jpg`,
                badge: `🥾 ${trek.difficulty.toUpperCase()} TREK`,
                priceOrRating: `₹1,499 / person`,
                location: `${trek.baseVillage || trek.region} • ${trek.elevation || "Sahyadri"}`,
                highlights: trek.highlights
                    ? trek.highlights.split(";").map(h => h.trim().replace(/^[^a-zA-Z0-9]+/, "")).slice(0, 3)
                    : ["Guided Expedition", "Safety Briefing"],
                href: `/treks/${trek.slug}`,
                slug: trek.slug,
            });
        }
    }

    // Name keyword fallback for treks
    if (results.length === 0) {
        const lower = content.toLowerCase();
        for (const trek of ALL_WEBSITE_TREKS) {
            const cleanName = trek.name.toLowerCase().replace(/trek|expedition|trail|fort|pinnacle/g, "").trim();
            if (cleanName.length > 3 && lower.includes(cleanName) && !seen.has(trek.slug)) {
                seen.add(trek.slug);
                results.push({
                    type: "trek",
                    name: trek.name,
                    image: `/images/treks/${trek.slug}/1.jpg`,
                    badge: `🥾 ${trek.difficulty.toUpperCase()} TREK`,
                    priceOrRating: `₹1,499 / person`,
                    location: `${trek.baseVillage || trek.region} • ${trek.elevation || "Sahyadri"}`,
                    highlights: trek.highlights
                        ? trek.highlights.split(";").map(h => h.trim().replace(/^[^a-zA-Z0-9]+/, "")).slice(0, 3)
                        : ["Guided Expedition", "Safety Briefing"],
                    href: `/treks/${trek.slug}`,
                    slug: trek.slug,
                });
                break;
            }
        }
    }

    // Destinations: /destinations/[slug]
    const destMatches = Array.from(content.matchAll(/\/destinations\/([a-z0-9-]+)/g));
    for (const m of destMatches) {
        const slug = m[1];
        if (seen.has(slug)) continue;
        seen.add(slug);
        const dest = ALL_WEBSITE_DESTINATIONS.find(d => d.slug === slug);
        if (dest) {
            const destImg = DESTINATION_IMAGES[dest.slug] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
            results.push({
                type: "destination",
                name: dest.name,
                image: destImg,
                badge: `📍 ${dest.category.toUpperCase()} • ${dest.region}`,
                priceOrRating: `⭐ 4.8 Rating`,
                location: `${dest.region}, Konkan`,
                highlights: dest.highlights
                    ? dest.highlights.split(";").map(h => h.trim()).slice(0, 3)
                    : ["Scenic Views", "Coastal Culture"],
                href: `/destinations/${dest.slug}`,
                slug: dest.slug,
            });
        }
    }

    return results.slice(0, 2);
}

function getStopCategoryIcon(type: string, place: string = ""): string {
    const p = place.toLowerCase();
    if (p.includes("climb") || p.includes("ascent") || p.includes("trek") || p.includes("ridge")) return "🥾";
    if (p.includes("descent") || p.includes("downhill")) return "🚶‍♂️";
    if (p.includes("fort") || p.includes("machi") || p.includes("darwaza") || p.includes("bastion") || p.includes("temple")) return "🏰";
    if (p.includes("food") || p.includes("breakfast") || p.includes("lunch") || p.includes("feast") || p.includes("bhakri") || type === "food") return "🍛";
    if (p.includes("drive") || p.includes("mumbai") || p.includes("pune") || p.includes("expressway") || p.includes("cab") || type === "transport") return "🚗";
    if (p.includes("beach") || p.includes("sea") || p.includes("coast")) return "🌊";
    return "📍";
}

function VisualCardItem({
    card,
    itinerary,
    onOpenItinerary,
}: {
    card: EntityCardData;
    itinerary?: ItineraryData;
    onOpenItinerary?: () => void;
}) {
    return (
        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200/80 bg-[#0d1f13] text-white w-full transition-all">
            {/* Background Image Container with Gradient */}
            <div
                className="relative h-36 sm:h-40 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${card.image})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f13] via-black/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
                    <span className="px-2.5 py-0.5 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/20 truncate max-w-[65%]">
                        {card.badge}
                    </span>
                    <span className="px-2 py-0.5 bg-[#b8dc26] text-[#122e1b] text-[10px] font-black rounded-full shadow-xs whitespace-nowrap">
                        {card.priceOrRating}
                    </span>
                </div>

                {/* Bottom Info on the Image */}
                <div className="absolute bottom-2 left-3 right-3 z-10">
                    <p className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1 mb-0.5 drop-shadow-xs truncate">
                        <MapPin size={11} className="flex-shrink-0" />
                        <span>{card.location}</span>
                    </p>
                    <h4 className="font-bold text-sm text-white leading-tight drop-shadow-md truncate">
                        {card.name}
                    </h4>
                </div>
            </div>

            {/* Highlights */}
            {card.highlights && card.highlights.length > 0 && (
                <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1">
                    {card.highlights.slice(0, 3).map((h, i) => (
                        <span
                            key={i}
                            className="text-[9px] bg-white/10 text-emerald-100/90 px-2 py-0.5 rounded-md border border-white/10"
                        >
                            {h}
                        </span>
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            <div className="p-2.5 pt-1.5 flex items-center gap-1.5 flex-wrap">
                {itinerary && onOpenItinerary && (
                    <button
                        onClick={onOpenItinerary}
                        className="flex-1 min-w-[110px] py-1.5 px-2 bg-[#b8dc26] hover:bg-[#aed422] text-[#122e1b] font-black text-[11px] rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                        <span>🗺️ Full Itinerary</span>
                        <ArrowRight size={12} />
                    </button>
                )}
                {card.href && (
                    <Link
                        href={card.href}
                        className="flex-1 min-w-[90px] py-1.5 px-2 bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1 text-center"
                    >
                        <span>🧭 Details</span>
                        <ArrowRight size={12} />
                    </Link>
                )}
                <a
                    href={`https://wa.me/918432587706?text=${encodeURIComponent(
                        `Hi Visit Kokan, I want to enquire about ${card.name}!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1"
                    title="Enquire on WhatsApp"
                >
                    <MessageCircle size={12} />
                    <span>WhatsApp</span>
                </a>
            </div>
        </div>
    );
}

function VisualStopCards({
    itinerary,
    onOpenItinerary,
}: {
    itinerary: ItineraryData;
    onOpenItinerary: () => void;
}) {
    const day1 = itinerary.days?.[0];
    if (!day1 || !day1.stops || day1.stops.length === 0) return null;

    return (
        <div className="mt-2 space-y-1.5 w-full">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-800 px-1 pt-1">
                <span className="flex items-center gap-1.5 text-teal-900">
                    <Compass size={13} className="text-teal-600" />
                    <span>{day1.title || "Day 1 Mountain Itinerary"}</span>
                </span>
                <span className="text-[10px] bg-teal-50 text-teal-800 font-semibold px-2 py-0.5 rounded-full border border-teal-100">
                    {day1.stops.length} Stops
                </span>
            </div>

            <div className="space-y-1.5">
                {day1.stops.slice(0, 4).map((stop, sIdx) => (
                    <div
                        key={sIdx}
                        className="bg-white rounded-xl p-2.5 border border-gray-200/80 shadow-xs hover:border-teal-300 transition-all flex items-start gap-2.5"
                    >
                        <div className="flex flex-col items-center flex-shrink-0">
                            <span className="text-base leading-none">
                                {getStopCategoryIcon(stop.type, stop.place)}
                            </span>
                            <span className="text-[9px] font-black text-teal-800 bg-teal-50 px-1 py-0.5 rounded mt-1 whitespace-nowrap">
                                {stop.time}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                                <h5 className="font-bold text-xs text-gray-900 truncate">
                                    {stop.place}
                                </h5>
                                {stop.cost && (
                                    <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded flex-shrink-0">
                                        {stop.cost}
                                    </span>
                                )}
                            </div>
                            {stop.description && (
                                <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-snug">
                                    {stop.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {day1.stops.length > 4 && (
                <button
                    onClick={onOpenItinerary}
                    className="w-full text-center py-1.5 text-[11px] text-teal-700 font-bold hover:text-teal-900 bg-teal-50/70 hover:bg-teal-100/70 rounded-xl transition-colors cursor-pointer"
                >
                    + View all {day1.stops.length} stops & transit directions →
                </button>
            )}
        </div>
    );
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
                        content: "🌊 Kokan Mitra is taking a quick breather due to high demand. Please tap send again in a moment, or connect directly on WhatsApp (+91 84325 87706) for instant assistance!",
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
                    <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 bg-gray-50">
                        {messages.map((msg, i) => {
                            const mentionedEntities = msg.role === "assistant" && !msg.itinerary
                                ? extractMentionedEntitiesFromText(msg.content)
                                : [];

                            return (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    {msg.role === "assistant" && (
                                        <span className="text-lg mr-1.5 mt-1 flex-shrink-0">🌊</span>
                                    )}
                                    <div className={`flex flex-col gap-2 ${msg.role === "user" ? "max-w-[85%]" : "max-w-[92%] w-full"}`}>
                                        <div
                                            className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                                    ? "bg-teal-600 text-white rounded-tr-sm self-end"
                                                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm"
                                                }`}
                                        >
                                            {renderFormattedContent(msg.content, msg.role === "user")}
                                        </div>

                                        {/* Rich Destination/Trek Hero Card & Timeline for Itineraries */}
                                        {msg.itinerary && (
                                            <div className="space-y-2 w-full animate-fadeIn">
                                                <VisualCardItem
                                                    card={getEntityForItinerary(msg.itinerary)}
                                                    itinerary={msg.itinerary}
                                                    onOpenItinerary={() => setActiveItinerary(msg.itinerary!)}
                                                />
                                                <VisualStopCards
                                                    itinerary={msg.itinerary}
                                                    onOpenItinerary={() => setActiveItinerary(msg.itinerary!)}
                                                />
                                            </div>
                                        )}

                                        {/* Auto-detected Destination or Trek Cards in Conversational Text */}
                                        {mentionedEntities.length > 0 && (
                                            <div className="space-y-2 w-full pt-1 animate-fadeIn">
                                                {mentionedEntities.map((card, cIdx) => (
                                                    <VisualCardItem
                                                        key={cIdx}
                                                        card={card}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

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
