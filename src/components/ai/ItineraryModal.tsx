"use client";

import { useState } from "react";

interface Stop {
    time: string;
    place: string;
    type: "transport" | "sightseeing" | "food" | "stay" | "activity";
    description?: string;
    cost?: string;
    mapsQuery?: string;
    duration?: string;
    trainNumber?: string;
    trainName?: string;
    departStation?: string;
    arriveStation?: string;
    departTime?: string;
    arriveTime?: string;
}

interface Day {
    day: number;
    title: string;
    stops: Stop[];
}

export interface ItineraryData {
    title: string;
    subtitle: string;
    days: Day[];
    tips?: string[];
    totalBudget?: string;
    transportSummary?: {
        type: "train" | "road" | "ferry";
        name?: string;
        number?: string;
        from: string;
        to: string;
        duration: string;
        cost?: string;
        departs?: string;
        arrives?: string;
    };
}

const TYPE_ICONS: Record<Stop["type"], string> = {
    transport: "🚂",
    sightseeing: "🏛️",
    food: "🍽️",
    stay: "🏨",
    activity: "🏄",
};

const TYPE_COLORS: Record<Stop["type"], string> = {
    transport: "bg-blue-50 border-blue-100",
    sightseeing: "bg-amber-50 border-amber-100",
    food: "bg-green-50 border-green-100",
    stay: "bg-purple-50 border-purple-100",
    activity: "bg-teal-50 border-teal-100",
};

const TYPE_BADGE: Record<Stop["type"], string> = {
    transport: "bg-blue-100 text-blue-700",
    sightseeing: "bg-amber-100 text-amber-700",
    food: "bg-green-100 text-green-700",
    stay: "bg-purple-100 text-purple-700",
    activity: "bg-teal-100 text-teal-700",
};

function ActionButton({
    href,
    emoji,
    label,
    color = "default",
}: {
    href: string;
    emoji: string;
    label: string;
    color?: "default" | "red" | "green";
}) {
    const colors = {
        default: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
        red: "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100",
        green: "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100",
    };

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 font-medium transition-colors ${colors[color]}`}
        >
            <span>{emoji}</span>
            <span>{label}</span>
        </a>
    );
}

function TransportCard({ data }: { data: ItineraryData["transportSummary"] }) {
    if (!data) return null;

    const isRoad = data.type === "road";
    const isTrain = data.type === "train";

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(data.from)}&destination=${encodeURIComponent(data.to)}&travelmode=${isRoad ? "driving" : "transit"}`;

    const pnrUrl = isTrain
        ? `https://www.railyatri.in/pnr-status`
        : null;

    const liveMapUrl = isTrain
        ? `https://konkanrailway.com/VisualTrain/`
        : null;

    const timeTableUrl = isTrain
        ? `https://www.railyatri.in/time-table?from_code=${encodeURIComponent(data.from)}&to_code=${encodeURIComponent(data.to)}`
        : null;

    return (
        <div className={`rounded-2xl border-2 p-4 mb-4 ${isTrain ? "border-blue-200 bg-blue-50" : "border-orange-200 bg-orange-50"}`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{isTrain ? "🚂" : "🚗"}</span>
                <div>
                    <p className="font-bold text-gray-800 text-sm">
                        {isTrain ? data.name : "Road Journey"}
                        {data.number && (
                            <span className="ml-2 text-xs font-normal text-gray-500">
                                #{data.number}
                            </span>
                        )}
                    </p>
                    <p className="text-xs text-gray-500">{data.duration}</p>
                </div>
                {isTrain && (
                    <span className="ml-auto flex items-center gap-1 text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5 font-medium">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        LIVE
                    </span>
                )}
            </div>

            {/* Journey */}
            <div className="flex items-center gap-2 mb-3">
                <div className="text-center">
                    <p className="font-bold text-gray-800 text-sm">
                        {data.departs || "--"}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[80px]">
                        {data.from}
                    </p>
                </div>
                <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="text-gray-400 text-xs">→</span>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>
                <div className="text-center">
                    <p className="font-bold text-gray-800 text-sm">
                        {data.arrives || "--"}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[80px]">
                        {data.to}
                    </p>
                </div>
            </div>

            {/* Cost */}
            {data.cost && (
                <p className="text-xs text-green-700 font-medium mb-3">
                    💰 {data.cost}
                </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                {liveMapUrl && (
                    <ActionButton
                        href={liveMapUrl}
                        emoji="🔴"
                        label="Live Map"
                        color="red"
                    />
                )}
                {pnrUrl && (
                    <ActionButton
                        href={pnrUrl}
                        emoji="📋"
                        label="PNR Status"
                    />
                )}
                {timeTableUrl && (
                    <ActionButton
                        href={timeTableUrl}
                        emoji="🕐"
                        label="Timetable"
                    />
                )}
                <ActionButton
                    href={mapsUrl}
                    emoji="🗺️"
                    label="Directions"
                />
            </div>
        </div>
    );
}

function StopCard({ stop }: { stop: Stop }) {
    const mapsUrl = stop.mapsQuery
        ? `https://www.google.com/maps/search/${encodeURIComponent(stop.mapsQuery)}`
        : null;

    const directionsUrl = stop.mapsQuery
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.mapsQuery)}`
        : null;

    const contactSearchUrl = stop.mapsQuery
        ? `https://www.google.com/search?q=${encodeURIComponent(stop.place + " contact number phone")}`
        : null;

    const isTrainStop = stop.type === "transport";

    return (
        <div className={`rounded-xl border p-4 ${TYPE_COLORS[stop.type]}`}>
            <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">{TYPE_ICONS[stop.type]}</span>
                </div>
                <div className="flex-1 min-w-0">

                    {/* Time + Type Badge */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        {stop.time && (
                            <span className="text-xs font-bold text-gray-600 bg-white rounded-full px-2 py-0.5 border">
                                🕐 {stop.time}
                            </span>
                        )}
                        <span className={`text-xs rounded-full px-2 py-0.5 font-medium capitalize ${TYPE_BADGE[stop.type]}`}>
                            {stop.type}
                        </span>
                        {stop.duration && (
                            <span className="text-xs text-gray-400">
                                ~{stop.duration}
                            </span>
                        )}
                    </div>

                    {/* Place Name */}
                    <p className="font-bold text-gray-800 text-sm">{stop.place}</p>

                    {/* Description */}
                    {stop.description && (
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {stop.description}
                        </p>
                    )}

                    {/* Cost */}
                    {stop.cost && (
                        <p className="text-xs text-green-700 font-semibold mt-1.5">
                            💰 {stop.cost}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {directionsUrl && (
                            <ActionButton
                                href={directionsUrl}
                                emoji="📍"
                                label="Directions"
                            />
                        )}
                        {!isTrainStop && contactSearchUrl && (
                            <ActionButton
                                href={contactSearchUrl}
                                emoji="🔍"
                                label="Find Contact"
                            />
                        )}
                        {isTrainStop && (
                            <ActionButton
                                href="https://konkanrailway.com/VisualTrain/"
                                emoji="🔴"
                                label="Live Train"
                                color="red"
                            />
                        )}
                        {isTrainStop && (
                            <ActionButton
                                href="https://www.railyatri.in/pnr-status"
                                emoji="📋"
                                label="PNR Status"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ItineraryModal({
    data,
    onClose,
}: {
    data: ItineraryData;
    onClose: () => void;
}) {
    const [activeDay, setActiveDay] = useState(0);
    const [copied, setCopied] = useState(false);

    const getFormattedItineraryText = () => {
        let text = `🌊 *${data.title}*\n${data.subtitle ? `📍 _${data.subtitle}_\n` : ""}`;
        if (data.totalBudget) text += `💰 *Est. Budget:* ${data.totalBudget}\n`;

        if (data.transportSummary) {
            const t = data.transportSummary;
            text += `\n${t.type === "train" ? "🚂" : "🚗"} *Transport:* ${t.name || t.type} ${t.number ? `(#${t.number})` : ""}\n`;
            text += `   ${t.from} (${t.departs || "--"}) ➔ ${t.to} (${t.arrives || "--"})\n`;
            if (t.cost) text += `   Fare: ${t.cost}\n`;
        }

        text += `\n━━━━━━━━━━━━━━━━━━━━\n`;

        data.days.forEach((d) => {
            text += `\n📅 *Day ${d.day} — ${d.title}*\n`;
            d.stops.forEach((s) => {
                text += `• ${s.time ? `*${s.time}* ` : ""}${s.place}${s.cost ? ` (💰 ${s.cost})` : ""}\n`;
                if (s.description) text += `  ${s.description}\n`;
            });
        });

        if (data.tips && data.tips.length > 0) {
            text += `\n💡 *Local Konkan Tips:*\n`;
            data.tips.forEach((tip) => {
                text += `• ${tip}\n`;
            });
        }

        text += `\n🌴 Planned via Visit Kokan · https://visitkokan.in`;
        return text;
    };

    const handleWhatsAppShare = () => {
        const text = getFormattedItineraryText();
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(waUrl, "_blank");
    };

    const handleCopyPlan = async () => {
        const text = getFormattedItineraryText();
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePrintOrOffline = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            window.print();
            return;
        }

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${data.title} — Visit Kokan Offline Itinerary</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 760px; margin: 0 auto; line-height: 1.5; }
            h1 { color: #0d9488; margin-bottom: 4px; font-size: 24px; }
            .subtitle { color: #64748b; font-size: 14px; margin-bottom: 12px; }
            .badge { display: inline-block; background: #ccfbf1; color: #0f766e; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin-bottom: 16px; }
            .transport-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; font-size: 13px; }
            .day-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; }
            .day-header { font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 12px; }
            .stop { margin-bottom: 12px; }
            .stop-time { font-weight: bold; color: #0d9488; font-size: 12px; }
            .stop-place { font-weight: bold; font-size: 14px; }
            .stop-desc { font-size: 13px; color: #475569; margin-top: 2px; }
            .stop-cost { font-size: 12px; color: #15803d; font-weight: 600; margin-top: 2px; }
            .tips-box { background: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 12px; font-size: 13px; margin-top: 16px; }
            .footer { margin-top: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 16px; text-align: right;">
            <button onclick="window.print()" style="background:#0d9488;color:#fff;border:none;padding:8px 16px;border-radius:20px;font-weight:bold;cursor:pointer;">🖨️ Print / Save as PDF</button>
          </div>
          <h1>🌊 ${data.title}</h1>
          <div class="subtitle">${data.subtitle || "Konkan Coast Trip Plan"}</div>
          ${data.totalBudget ? `<div class="badge">💰 Est. Budget: ${data.totalBudget}</div>` : ""}

          ${data.transportSummary ? `
            <div class="transport-box">
              <strong>${data.transportSummary.type === "train" ? "🚂 Train" : "🚗 Road"}: ${data.transportSummary.name || ""} (${data.transportSummary.number || ""})</strong><br/>
              Route: ${data.transportSummary.from} (${data.transportSummary.departs || "--"}) ➔ ${data.transportSummary.to} (${data.transportSummary.arrives || "--"}) | Duration: ${data.transportSummary.duration || ""}<br/>
              ${data.transportSummary.cost ? `Estimated Fare: ${data.transportSummary.cost}` : ""}
            </div>
          ` : ""}

          ${data.days.map(d => `
            <div class="day-card">
              <div class="day-header">Day ${d.day} — ${d.title}</div>
              ${d.stops.map(s => `
                <div class="stop">
                  <span class="stop-time">${s.time || ""}</span>
                  <div class="stop-place">${s.place}</div>
                  ${s.description ? `<div class="stop-desc">${s.description}</div>` : ""}
                  ${s.cost ? `<div class="stop-cost">💰 ${s.cost}</div>` : ""}
                </div>
              `).join("")}
            </div>
          `).join("")}

          ${data.tips && data.tips.length ? `
            <div class="tips-box">
              <strong>💡 Local Tips:</strong>
              <ul>
                ${data.tips.map(t => `<li>${t}</li>`).join("")}
              </ul>
            </div>
          ` : ""}

          <div class="footer">
            Planned with Kokan Mitra · Visit Kokan (visitkokan.in) · Save this PDF for offline travel!
          </div>

          <script>
            setTimeout(() => window.print(), 500);
          </script>
        </body>
        </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    };

    const currentDay = data.days[activeDay];

    // Compute Google Maps multi-stop navigation route for current day
    const stopsList = currentDay.stops.map(s => s.mapsQuery || `${s.place}, Maharashtra`).filter(Boolean);
    const dayNavigationUrl = stopsList.length >= 2
        ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(stopsList[0])}&destination=${encodeURIComponent(stopsList[stopsList.length - 1])}${stopsList.length > 2 ? `&waypoints=${stopsList.slice(1, -1).map(w => encodeURIComponent(w)).join("|")}` : ""}&travelmode=driving`
        : stopsList.length === 1
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stopsList[0])}`
            : null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col"
                style={{ maxHeight: "92vh" }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-4 rounded-t-3xl flex-shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 mr-3">
                            <h2 className="text-white font-bold text-lg leading-tight">
                                {data.title}
                            </h2>
                            <p className="text-teal-100 text-sm mt-0.5">{data.subtitle}</p>
                            {data.totalBudget && (
                                <p className="text-teal-200 text-xs mt-1">
                                    💰 Est. {data.totalBudget}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            {/* WhatsApp Export */}
                            <button
                                onClick={handleWhatsAppShare}
                                title="Share to WhatsApp"
                                className="bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full px-2.5 py-1.5 text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                            >
                                <span>💬</span>
                                <span>WhatsApp</span>
                            </button>

                            {/* Close */}
                            <button
                                onClick={onClose}
                                className="bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors text-sm ml-1"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Quick Tools Row (Save Offline / Copy / Print) */}
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/20">
                        <button
                            onClick={handlePrintOrOffline}
                            className="text-xs bg-white/20 hover:bg-white/30 text-white rounded-full px-3 py-1 font-medium transition-colors flex items-center gap-1"
                        >
                            <span>📥</span>
                            <span>Save Offline (PDF)</span>
                        </button>
                        <button
                            onClick={handleCopyPlan}
                            className="text-xs bg-white/20 hover:bg-white/30 text-white rounded-full px-3 py-1 font-medium transition-colors flex items-center gap-1"
                        >
                            <span>{copied ? "✅ Copied" : "📋 Copy"}</span>
                        </button>
                    </div>

                    {/* Day Tabs */}
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                        {data.days.map((day, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveDay(i)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeDay === i
                                        ? "bg-white text-teal-700 font-bold shadow-sm"
                                        : "bg-white/20 text-white hover:bg-white/30"
                                    }`}
                            >
                                Day {day.day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Day Title & Navigation Toolbar */}
                <div className="px-5 py-3 border-b bg-gray-50 flex-shrink-0 flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-800 text-sm">
                        📅 Day {currentDay.day} — {currentDay.title}
                    </p>
                    {dayNavigationUrl && (
                        <a
                            href={dayNavigationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-full px-2.5 py-1 transition-colors flex items-center gap-1 shrink-0"
                        >
                            <span>🗺️</span>
                            <span>Navigate Day</span>
                        </a>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {/* Transport Card — only on Day 1 */}
                    {activeDay === 0 && data.transportSummary && (
                        <TransportCard data={data.transportSummary} />
                    )}

                    {/* Stop Cards */}
                    {currentDay.stops.map((stop, i) => (
                        <StopCard key={i} stop={stop} />
                    ))}

                    {/* Tips — last day */}
                    {activeDay === data.days.length - 1 &&
                        data.tips &&
                        data.tips.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <p className="font-semibold text-amber-800 mb-2 text-sm">
                                    💡 Local Tips
                                </p>
                                {data.tips.map((tip, i) => (
                                    <p key={i} className="text-xs text-amber-700 mt-1.5">
                                        • {tip}
                                    </p>
                                ))}
                            </div>
                        )}

                    {/* Disclaimer */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <p className="text-xs text-gray-500 text-center">
                            ⚠️ Verify timings, contacts and prices before visiting.
                            Train timings may change — check IRCTC for latest.
                        </p>
                    </div>

                    <div className="h-4" />
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t bg-white flex-shrink-0 rounded-b-3xl">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleWhatsAppShare}
                            className="text-xs text-emerald-700 hover:underline font-medium flex items-center gap-1"
                        >
                            <span>💬</span>
                            <span>Forward Itinerary to WhatsApp</span>
                        </button>
                        <a
                            href="https://www.irctc.co.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-teal-600 font-medium hover:underline"
                        >
                            Book Tickets →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}