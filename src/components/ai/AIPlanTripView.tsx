"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Compass,
  ArrowRight,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Send,
  Loader2,
  ChevronRight,
  Download,
  ExternalLink,
  ShieldAlert,
  Info,
  Train,
  Car,
  Waves,
  Ticket
} from "lucide-react";
import { ItineraryData } from "./ItineraryModal";

const POPULAR_PRESETS = [
  {
    id: "raigad",
    title: "Weekend Raigad Fort Trek",
    subtitle: "By Train from Mumbai (Mangaon Station)",
    emoji: "🏰",
    origin: "Mumbai",
    region: "Raigad",
    days: "1 Day",
    prompt: "I want to plan a 1-day weekend trek to Raigad Fort from Mumbai by train, leaving Saturday night by Tutari Express to Mangaon and returning Sunday night.",
    badge: "Most Popular Trek"
  },
  {
    id: "malvan",
    title: "Malvan & Tarkarli Scuba Tour",
    subtitle: "Water Sports + Sindhudurg Sea Fort",
    emoji: "🤿",
    origin: "Mumbai",
    region: "Sindhudurg",
    days: "2 Days",
    prompt: "Plan a 2-day trip to Malvan and Tarkarli from Mumbai with scuba diving, Sindhudurg Fort visit, and authentic Malvani fish thali.",
    badge: "Beach & Adventure"
  },
  {
    id: "alibaug",
    title: "Alibaug & Kashid Family Escape",
    subtitle: "Gateway Ferry + Sea Forts",
    emoji: "🏖️",
    origin: "Mumbai",
    region: "Raigad",
    days: "2 Days",
    prompt: "Plan a relaxing 2-day family trip to Alibaug and Kashid from Mumbai taking the Ro-Pax ferry from Bhaucha Dhakka to Mandwa with beach homestays.",
    badge: "Family Friendly"
  },
  {
    id: "ganpatipule",
    title: "Ganpatipule & Ratnagiri Coast",
    subtitle: "Swayambhu Ganesh Temple & Aare Ware",
    emoji: "🛕",
    origin: "Pune",
    region: "Ratnagiri",
    days: "2 Days",
    prompt: "Plan a 2-day scenic coastal drive from Pune to Ganpatipule Temple, Aare Ware beach, and Ratnagiri lighthouse.",
    badge: "Scenic Coastal Drive"
  }
];

const ORIGINS = ["Mumbai", "Pune", "Rest of Maharashtra", "Goa"];
const REGIONS = [
  { id: "all", label: "Anywhere in Konkan", emoji: "🌊" },
  { id: "raigad", label: "Raigad (Alibaug, Murud, Raigad Fort)", emoji: "🏰" },
  { id: "ratnagiri", label: "Ratnagiri (Ganpatipule, Dapoli, Guhagar)", emoji: "🏖️" },
  { id: "sindhudurg", label: "Sindhudurg (Malvan, Tarkarli, Vengurla)", emoji: "🤿" },
];
const DURATIONS = ["1 Day", "2 Days (Weekend)", "3 Days", "4+ Days"];
const VIBES = [
  { id: "forts", label: "Fort Treks & History", emoji: "🧗" },
  { id: "beaches", label: "Beaches & Water Sports", emoji: "🏄" },
  { id: "food", label: "Authentic Food & Homestays", emoji: "🍛" },
  { id: "relaxed", label: "Relaxed Scenic Tour", emoji: "🌴" },
];

export default function AIPlanTripView() {
  const searchParams = useSearchParams();

  // Form State
  const [origin, setOrigin] = useState("Mumbai");
  const [region, setRegion] = useState("all");
  const [duration, setDuration] = useState("2 Days (Weekend)");
  const [vibe, setVibe] = useState("beaches");
  const [customText, setCustomText] = useState("");

  // AI & Conversation State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [refineInput, setRefineInput] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const itineraryRef = useRef<HTMLDivElement>(null);

  // Auto-fill from query params (e.g. ?dest=raigad-fort or ?q=...)
  useEffect(() => {
    const dest = searchParams.get("dest") || searchParams.get("destination");
    const q = searchParams.get("q") || searchParams.get("prompt");
    if (dest) {
      const cleanDest = dest.replace(/-/g, " ");
      setCustomText(`Plan a trip to ${cleanDest} from ${origin}`);
    } else if (q) {
      setCustomText(q);
    }
  }, [searchParams, origin]);

  // Loading indicator messages
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingStep((s) => (s + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const LOADING_MESSAGES = [
    "Consulting verified Konkan Railway timetables & station gateways...",
    "Matching realistic trekking pacing & fort exploration hours...",
    "Finding authentic local Khanavals, Malvani thalis & homestays...",
    "Generating Google Maps routes and day-by-day itinerary...",
  ];

  // Call the AI trip planner
  const generateItinerary = async (promptText: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    const userMessage = { role: "user" as const, content: promptText };
    const messagesPayload = [...chatMessages, userMessage];

    try {
      const res = await fetch("/api/ai/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesPayload,
          pageContext: "Trip Planner full page. User expects structured itinerary JSON with verified train, road, or ferry routes and realistic human pacing.",
        }),
      });

      const data = await res.json();

      if (data.itinerary) {
        setErrorMsg(null);
        setItinerary(data.itinerary);
        setActiveDay(0);
        setChatMessages([
          ...messagesPayload,
          { role: "assistant" as const, content: data.message || "Here is your Konkan itinerary! 🌊" },
        ]);
        setTimeout(() => {
          itineraryRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else if (data.message) {
        // Fallback if returned as raw text
        setErrorMsg("Received itinerary overview. Let's build the full details!");
      } else if (data.error) {
        const err = String(data.error);
        if (err.includes("rate_limit") || err.includes("413") || err.includes("TPM") || err.includes("tokens") || err.includes("json_validate_failed")) {
          setErrorMsg("Kokan Mitra was generating a very detailed plan. Please tap 'Generate' again to finalize!");
        } else {
          setErrorMsg(err);
        }
      }
    } catch (err: any) {
      setErrorMsg("Network error. Please try generating again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const regionLabel = REGIONS.find((r) => r.id === region)?.label || "Konkan";
    const vibeLabel = VIBES.find((v) => v.id === vibe)?.label || "Explore";

    let prompt = `Plan a ${duration} trip from ${origin} to ${regionLabel}. Travel style: ${vibeLabel}.`;
    if (customText.trim()) {
      prompt += ` Special preferences: ${customText.trim()}`;
    }
    generateItinerary(prompt);
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineInput.trim() || isLoading) return;
    const text = refineInput.trim();
    setRefineInput("");
    generateItinerary(text);
  };

  const handlePresetClick = (preset: typeof POPULAR_PRESETS[0]) => {
    setOrigin(preset.origin);
    setCustomText(preset.prompt);
    generateItinerary(preset.prompt);
  };

  // WhatsApp formatted share text
  const getFormattedItineraryText = () => {
    if (!itinerary) return "";
    let text = `🌊 *${itinerary.title}*\n${itinerary.subtitle ? `📍 _${itinerary.subtitle}_\n` : ""}`;
    if (itinerary.totalBudget) text += `💰 *Est. Budget:* ${itinerary.totalBudget}\n`;

    if (itinerary.transportSummary) {
      const t = itinerary.transportSummary;
      text += `\n${t.type === "train" ? "🚂" : t.type === "ferry" ? "⛴️" : "🚗"} *Transport:* ${t.name || t.type} ${t.number ? `(#${t.number})` : ""}\n`;
      text += `   ${t.from} (${t.departs || "--"}) ➔ ${t.to} (${t.arrives || "--"})\n`;
      if (t.cost) text += `   Fare: ${t.cost}\n`;
    }

    text += `\n━━━━━━━━━━━━━━━━━━━━\n`;

    itinerary.days.forEach((d) => {
      text += `\n📅 *Day ${d.day} — ${d.title}*\n`;
      d.stops.forEach((s) => {
        text += `• ${s.time ? `*${s.time}* ` : ""}${s.place}${s.cost ? ` (💰 ${s.cost})` : ""}\n`;
        if (s.description) text += `  ${s.description}\n`;
      });
    });

    if (itinerary.tips && itinerary.tips.length > 0) {
      text += `\n💡 *Local Konkan Tips:*\n`;
      itinerary.tips.forEach((tip) => {
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

  const handleCopyPlan = () => {
    const text = getFormattedItineraryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDay = itinerary?.days?.[activeDay] || itinerary?.days?.[0];

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-gray-900">
      {/* ── Top Hero ── */}
      <div className="bg-gradient-to-b from-[#1E4D38] via-[#2D6A4F] to-[#1E4D38] text-white pt-8 pb-12 px-4 border-b border-emerald-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-kokan-sand backdrop-blur-md text-xs font-semibold mb-4 border border-white/20">
            <Sparkles size={14} className="text-yellow-300 animate-pulse" />
            <span>Powered by Kokan Mitra AI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold leading-tight tracking-tight">
            Plan Your Konkan Journey with AI
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            Real Konkan railway timetables, ferry gateways, authentic coastal food spots, and realistic trek durations — all customized in seconds.
          </p>

          {/* Quick Preset Cards */}
          <div className="mt-6 flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide text-left">
            {POPULAR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                className="flex-shrink-0 bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md rounded-2xl p-3 w-64 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl">{preset.emoji}</span>
                  <span className="text-[10px] font-bold bg-[#B7895A] text-white px-2 py-0.5 rounded-full">
                    {preset.badge}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs group-hover:text-kokan-sand transition-colors line-clamp-1">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">
                  {preset.subtitle}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Planner Container ── */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 -mt-6">

        {/* ── Form Card ── */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 mb-8">
          <form onSubmit={handleFormSubmit} className="space-y-4">

            {/* Row 1: Origin & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#2D6A4F]" /> Starting From
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {ORIGINS.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setOrigin(city)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        origin === city
                          ? "bg-emerald-50 text-[#2D6A4F] border-emerald-500 shadow-2xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#2D6A4F]" /> Duration
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {DURATIONS.map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        duration === dur
                          ? "bg-emerald-50 text-[#2D6A4F] border-emerald-500 shadow-2xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Region Preference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                <Compass size={13} className="text-[#2D6A4F]" /> Destination or Region
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {REGIONS.map((reg) => (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => setRegion(reg.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all ${
                      region === reg.id
                        ? "bg-emerald-50 text-[#2D6A4F] border-emerald-500 shadow-2xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-1">{reg.emoji}</span>
                    <span>{reg.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Travel Vibe */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#B7895A]" /> Travel Style & Interests
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {VIBES.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVibe(v.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all ${
                      vibe === v.id
                        ? "bg-emerald-50 text-[#2D6A4F] border-emerald-500 shadow-2xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-1">{v.emoji}</span>
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 4: Custom Details */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Special Requests or Specific Places (Optional)
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Leave Saturday 11pm by train, budget ₹3,000/person, need vegetarian food..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <ShieldAlert size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Generate Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#2D6A4F] via-[#245740] to-[#1E4D38] hover:brightness-105 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Planning with Kokan Mitra AI...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-yellow-300" />
                  <span>Generate My Personalized Itinerary</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Loading step animation */}
            {isLoading && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-center">
                <p className="text-xs font-semibold text-[#2D6A4F] animate-pulse">
                  {LOADING_MESSAGES[loadingStep]}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* ── Generated Itinerary Presentation ── */}
        <div ref={itineraryRef}>
          {itinerary && currentDay && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12">

              {/* Itinerary Banner Header */}
              <div className="bg-gradient-to-r from-[#1E4D38] to-[#2D6A4F] text-white p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                      Verified AI Itinerary
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold font-display mt-1 text-white">
                      {itinerary.title}
                    </h2>
                    {itinerary.subtitle && (
                      <p className="text-xs sm:text-sm text-emerald-100/80 mt-0.5">
                        {itinerary.subtitle}
                      </p>
                    )}
                    {itinerary.totalBudget && (
                      <p className="text-xs font-bold text-yellow-300 mt-2 flex items-center gap-1">
                        <span>💰</span> Estimated Cost: {itinerary.totalBudget}
                      </p>
                    )}
                  </div>

                  {/* Actions: WhatsApp / PDF / Copy */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={itinerary.transportSummary?.type === "ferry" ? "https://m2mferries.com" : "https://www.irctc.co.in/nget/train-search"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-[#B7895A] hover:bg-[#a37546] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                    >
                      <Ticket size={13} />
                      <span>Book Tickets</span>
                      <ExternalLink size={11} />
                    </a>
                    <button
                      onClick={handleWhatsAppShare}
                      className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Share2 size={13} />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download size={13} />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={handleCopyPlan}
                      className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Day Tabs */}
                <div className="flex gap-2 mt-5 overflow-x-auto pb-1 scrollbar-hide">
                  {itinerary.days.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveDay(i)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                        activeDay === i
                          ? "bg-white text-[#2D6A4F] shadow-sm"
                          : "bg-white/15 text-white/90 hover:bg-white/25 border border-white/10"
                      }`}
                    >
                      Day {day.day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Details Bar */}
              <div className="px-5 py-3 bg-[#f5f8f5] border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-gray-800 text-xs sm:text-sm">
                  📅 Day {currentDay.day}: {currentDay.title}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {currentDay.stops.length} stops scheduled
                </span>
              </div>

              {/* Content Area */}
              <div className="p-4 sm:p-6 space-y-4">

                {/* Transport Card — Shown on Day 1 */}
                {activeDay === 0 && itinerary.transportSummary && (
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-sm">
                          {itinerary.transportSummary.type === "train" ? <Train size={16} /> : itinerary.transportSummary.type === "ferry" ? <Waves size={16} /> : <Car size={16} />}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">
                            {itinerary.transportSummary.name || "Recommended Transport"}
                            {itinerary.transportSummary.number && (
                              <span className="ml-1 text-xs text-gray-500 font-normal">
                                #{itinerary.transportSummary.number}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-500">{itinerary.transportSummary.duration}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Verified Route
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-y border-emerald-200/60 text-xs font-semibold text-gray-700">
                      <div>
                        <span className="text-gray-400 block text-[10px]">DEPARTS</span>
                        <span>{itinerary.transportSummary.departs || "--"}</span>
                        <span className="block text-[10px] text-gray-500 font-normal">{itinerary.transportSummary.from}</span>
                      </div>
                      <div className="text-gray-400 text-xs">➔</div>
                      <div className="text-right">
                        <span className="text-gray-400 block text-[10px]">ARRIVES</span>
                        <span>{itinerary.transportSummary.arrives || "--"}</span>
                        <span className="block text-[10px] text-gray-500 font-normal">{itinerary.transportSummary.to}</span>
                      </div>
                    </div>

                    {itinerary.transportSummary.cost && (
                      <p className="text-xs text-[#2D6A4F] font-bold mt-2">
                        💰 Fare Estimate: {itinerary.transportSummary.cost}
                      </p>
                    )}

                    {/* Quick Booking & Navigation Bar */}
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-emerald-200/60 flex-wrap">
                      {itinerary.transportSummary.type === "train" ? (
                        <>
                          <a
                            href="https://www.irctc.co.in/nget/train-search"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 bg-[#2D6A4F] hover:bg-[#245740] text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                          >
                            <Ticket size={12} />
                            <span>Book IRCTC Train</span>
                            <ExternalLink size={11} />
                          </a>
                          <a
                            href="https://konkanrailway.com/VisualTrain/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>Live Map</span>
                          </a>
                          <a
                            href="https://www.railyatri.in/pnr-status"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-medium transition-colors"
                          >
                            <span>📋 PNR Status</span>
                          </a>
                        </>
                      ) : itinerary.transportSummary.type === "ferry" ? (
                        <>
                          <a
                            href="https://m2mferries.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 bg-[#2D6A4F] hover:bg-[#245740] text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                          >
                            <Ticket size={12} />
                            <span>Book Ferry Tickets</span>
                            <ExternalLink size={11} />
                          </a>
                          <a
                            href="https://book.pnpferries.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold transition-colors"
                          >
                            <span>PNP Speedboat</span>
                          </a>
                        </>
                      ) : (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(itinerary.transportSummary.from)}&destination=${encodeURIComponent(itinerary.transportSummary.to)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 bg-[#2D6A4F] hover:bg-[#245740] text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                        >
                          <Compass size={12} />
                          <span>Open Driving Route</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline Stops */}
                <div className="space-y-3">
                  {currentDay.stops.map((stop, idx) => {
                    const directionsUrl = stop.mapsQuery
                      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stop.mapsQuery)}`
                      : null;

                    return (
                      <div
                        key={idx}
                        className="p-3.5 sm:p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 bg-white hover:shadow-xs transition-all flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#2D6A4F] flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {stop.time && (
                              <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                                🕐 {stop.time}
                              </span>
                            )}
                            <span className="text-[10px] uppercase font-bold text-[#2D6A4F] bg-emerald-50 px-2 py-0.5 rounded-full">
                              {stop.type}
                            </span>
                            {stop.duration && (
                              <span className="text-[11px] text-gray-400">
                                ~{stop.duration}
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-gray-900 text-sm">{stop.place}</h4>
                          {stop.description && (
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              {stop.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 flex-wrap gap-2">
                            {stop.cost ? (
                              <span className="text-xs font-semibold text-emerald-700">
                                💰 {stop.cost}
                              </span>
                            ) : (
                              <span />
                            )}

                            {directionsUrl && (
                              <a
                                href={directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-[#2D6A4F] hover:underline flex items-center gap-1"
                              >
                                <span>Directions</span>
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Local Tips (Last Day) */}
                {activeDay === itinerary.days.length - 1 && itinerary.tips && itinerary.tips.length > 0 && (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
                    <h4 className="font-bold text-amber-900 text-xs sm:text-sm mb-2 flex items-center gap-1.5">
                      <Info size={14} className="text-amber-700" /> Local Konkan Travel Tips
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-800">
                      {itinerary.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span>•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ── Refine with Kokan Mitra Chat Box ── */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#2D6A4F]" /> Want to customize or tweak this plan?
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Ask Kokan Mitra to adjust timings, make it vegetarian, change the transport, or add a specific stop.
                  </p>

                  <form onSubmit={handleRefineSubmit} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={refineInput}
                      onChange={(e) => setRefineInput(e.target.value)}
                      placeholder="e.g. Make Day 1 lunch pure vegetarian, or leave 2 hours later..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !refineInput.trim()}
                      className="px-4 py-2.5 bg-[#2D6A4F] hover:bg-[#245740] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Send size={13} />
                      <span className="hidden sm:inline">Refine</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
