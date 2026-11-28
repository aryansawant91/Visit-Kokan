"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  Printer,
  Upload,
  Clock,
  MapPin,
  Utensils,
  Bed,
  CheckCircle2,
  XCircle,
  IndianRupee,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  Edit3,
  Phone,
  Globe,
  ShieldAlert,
  Download,
  ArrowUp,
  ArrowDown,
  Copy,
  Car,
  MessageCircle,
  Database,
} from "lucide-react";
import { FALLBACK_DESTINATION_IMAGE } from "@/lib/imageUtils";

interface PlaceVisit {
  id: string;
  name: string;
  tentativeTime: string; // Optional
  description: string;
  images: string[];
}

interface MealInfo {
  enabled: boolean;
  details: string;
  images: string[];
}

interface StayInfo {
  enabled: boolean;
  name: string;
  details: string;
  images: string[];
}

interface ItineraryDay {
  id: string;
  title: string;
  summary: string;
  places: PlaceVisit[];
  breakfast: MealInfo;
  lunch: MealInfo;
  dinner: MealInfo;
  stay: StayInfo;
}

interface CustomItineraryData {
  tripTitle: string;
  subtitle: string;
  clientName: string;
  durationLabel: string;
  departureFrom: string;
  vehicleInfo: string;
  coverImage: string;
  days: ItineraryDay[];
  packagePrice: string;
  priceNote: string;
  inclusions: string[];
  exclusions: string[];
  foodExpensePolicy: string;
  bookingTerms: string;
  closingStatement: string;
  contactPhone: string;
}

interface CatalogPlaceItem {
  id: string;
  kind: "Destination" | "Trek";
  name: string;
  region: string;
  description: string;
  images: string[];
}

interface CatalogStayItem {
  id: string;
  name: string;
  region: string;
  category: string;
  description: string;
  images: string[];
}

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_ITINERARY: CustomItineraryData = {
  tripTitle: "Enchanting Konkan Coastal & Malvan Escape",
  subtitle: "Curated Beaches, Sea Forts, Authentic Malvani Cuisine & Beachside Homestays",
  clientName: "Prepared for Guest Group",
  durationLabel: "3 Days / 2 Nights",
  departureFrom: "Mumbai / Pune",
  vehicleInfo: "AC Private Innova / Tempo Traveller",
  coverImage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80",
  days: [
    {
      id: uid(),
      title: "Arrival in Konkan, Coastal Drive & Sunset Beach",
      summary: "Scenic coastal journey along NH-66 with sea-facing sightseeing and traditional dinner.",
      places: [
        {
          id: uid(),
          name: "Ganpatipule Temple & Pristine Shoreline",
          tentativeTime: "11:30 AM",
          description:
            "Visit the 400-year-old Swayambhu Ganesh Temple situated right on the golden sands of Ganpatipule.",
          images: [
            "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1000&q=80",
          ],
        },
        {
          id: uid(),
          name: "Aare-Ware Twin Beaches Viewpoint",
          tentativeTime: "04:30 PM",
          description:
            "Breathtaking cliff-top coastal drive overlooking two untouched turquoise coves.",
          images: [
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1000&q=80",
          ],
        },
      ],
      breakfast: {
        enabled: false,
        details: "",
        images: [],
      },
      lunch: {
        enabled: true,
        details:
          "Authentic Konkani Veg & Surmai Fish Thali with Solkadhi, Bhakri, and Ukadiche Modak at a heritage coastal kitchen.",
        images: [
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
        ],
      },
      dinner: {
        enabled: true,
        details:
          "Homestyle Malvani Chicken / Paneer Masala, Ghavane, Dal Fry, and Steamed Indrayani Rice.",
        images: [],
      },
      stay: {
        enabled: true,
        name: "Kokum Breeze Coastal Homestay",
        details:
          "AC Deluxe Family Rooms surrounded by coconut & betel nut palms. Includes hot water, Wi-Fi & courtyard seating.",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80",
        ],
      },
    },
    {
      id: uid(),
      title: "Sindhudurg Sea Fort & Tarkarli Backwaters",
      summary: "Morning boat ride to Chhatrapati Shivaji Maharaj's sea fortress followed by leisure.",
      places: [
        {
          id: uid(),
          name: "Sindhudurg Sea Fort Expedition",
          tentativeTime: "09:30 AM",
          description:
            "Explore the 17th-century island sea fort built by Chhatrapati Shivaji Maharaj, featuring hidden entrances and freshwater wells.",
          images: [
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&q=80",
          ],
        },
      ],
      breakfast: {
        enabled: true,
        details: "Hot Kanda Poha / Amboli Chutney with Konkani Tea & Coffee at the homestay.",
        images: [],
      },
      lunch: {
        enabled: true,
        details: "Fresh coastal seafood / veg Malvani platter near Malvan Jetty.",
        images: [],
      },
      dinner: {
        enabled: true,
        details: "Bonfire dinner with Konkani Kombdi Vade / Veg Curry & Solkadhi.",
        images: [],
      },
      stay: {
        enabled: true,
        name: "Tarkarli Beachfront Cottage",
        details: "2-minute walk to Tarkarli Beach with private verandah and cozy beds.",
        images: [],
      },
    },
  ],
  packagePrice: "₹6,499 / person",
  priceNote: "Twin / Triple sharing · Customizable for private families & corporate groups",
  inclusions: [
    "AC Private Vehicle / Tempo Traveller from pickup to drop-off",
    "Comfortable verified Konkan Homestay / Beach Resort accommodation",
    "Daily Breakfast, Lunch & Dinner as mentioned in the day-wise plan",
    "All Toll, Parking, Driver Allowance & Fuel Charges",
    "Local Visit Kokan Trip Coordinator assistance throughout the tour",
  ],
  exclusions: [
    "Scuba diving, parasailing & optional water-sports fees",
    "Ferry boat tickets or fort entry / camera charges (unless specified)",
    "Personal expenses: bottled mineral water, snacks, soft drinks & laundry",
    "Any additional food orders outside the fixed thali/buffet menu",
  ],
  foodExpensePolicy:
    "Standard Veg / Non-Veg Konkani Thali meals are included as listed per day. Extra starters, seafood upgrades (crab/lobster/prawns), packaged beverages, café stops, and personal snacks are billed directly on actuals. Please inform us 48 hours prior for Jain or strict vegetarian kitchen preferences.",
  bookingTerms:
    "50% advance payment confirms your homestay rooms & transport. Remaining 50% balance is payable 48 hours before departure. Free rescheduling up to 7 days prior to travel.",
  closingStatement:
    "Thank you for choosing Visit Kokan! We look forward to hosting you along Maharashtra's scenic 720 km coastline. Reach out anytime to customize dates, group size, or stay upgrades.",
  contactPhone: "+91 84325 87706",
};

const STORAGE_KEY = "visitkokan_admin_custom_itinerary_v2";

function normalizeDay(day: Partial<ItineraryDay>): ItineraryDay {
  return {
    id: day.id || uid(),
    title: day.title || "",
    summary: day.summary || "",
    places: Array.isArray(day.places) ? day.places : [],
    breakfast: day.breakfast || { enabled: false, details: "", images: [] },
    lunch: day.lunch || { enabled: true, details: "", images: [] },
    dinner: day.dinner || { enabled: true, details: "", images: [] },
    stay: day.stay || { enabled: true, name: "", details: "", images: [] },
  };
}

export default function CustomItineraryBuilderPage() {
  const [data, setData] = useState<CustomItineraryData>(DEFAULT_ITINERARY);
  const [expandedDayId, setExpandedDayId] = useState<string>(
    DEFAULT_ITINERARY.days[0]?.id || ""
  );
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});

  // Auto-Fill Catalog from existing Visit Kokan Destinations, Treks & Stays
  const [catalogPlaces, setCatalogPlaces] = useState<CatalogPlaceItem[]>([]);
  const [catalogStays, setCatalogStays] = useState<CatalogStayItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(true);

  const previewRef = useRef<HTMLDivElement | null>(null);

  // Fetch existing Destinations, Treks & Listings for 1-click Auto-Fill
  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/destinations").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      fetch("/api/treks").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      fetch("/api/listings").then((r) => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([dests, treks, listings]) => {
      if (!active) return;

      const placeItems: CatalogPlaceItem[] = [];
      if (Array.isArray(dests)) {
        dests.forEach((d: any) => {
          const imgs = [
            ...(d.coverImage ? [d.coverImage] : []),
            ...(Array.isArray(d.images) ? d.images : []),
          ]
            .filter((x) => typeof x === "string" && x.trim().length > 0)
            .slice(0, 3);
          placeItems.push({
            id: `dest_${d.id}`,
            kind: "Destination",
            name: d.name || "",
            region: d.region || "Konkan",
            description: d.shortDescription || d.description || "",
            images: Array.from(new Set(imgs)),
          });
        });
      }
      if (Array.isArray(treks)) {
        treks.forEach((t: any) => {
          const imgs = (Array.isArray(t.images) ? t.images : [])
            .filter((x: unknown) => typeof x === "string" && x.trim().length > 0)
            .slice(0, 3);
          placeItems.push({
            id: `trek_${t.id}`,
            kind: "Trek",
            name: t.name || "",
            region: t.region || "Sahyadri",
            description: t.description || "",
            images: Array.from(new Set(imgs)),
          });
        });
      }
      setCatalogPlaces(placeItems.sort((a, b) => a.name.localeCompare(b.name)));

      if (Array.isArray(listings)) {
        const stayItems: CatalogStayItem[] = listings.map((l: any) => ({
          id: l.id,
          name: l.name || "",
          region: l.region || "Konkan",
          category: l.category || "Homestay",
          description: l.description || "",
          images: (Array.isArray(l.images) ? l.images : [])
            .filter((x: unknown) => typeof x === "string" && x.trim().length > 0)
            .slice(0, 2),
        }));
        setCatalogStays(stayItems.sort((a, b) => a.name.localeCompare(b.name)));
      }
      setCatalogLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  // Restore saved draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("visitkokan_admin_custom_itinerary_v1");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CustomItineraryData>;
        if (parsed && Array.isArray(parsed.days)) {
          const normalizedDays = parsed.days.map(normalizeDay);
          setData({
            ...DEFAULT_ITINERARY,
            ...parsed,
            days: normalizedDays,
          });
          if (normalizedDays[0]?.id) setExpandedDayId(normalizedDays[0].id);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
  }, [data]);

  // Continuous Single-Page PDF Export (Zero Page Breaks, Zero Scrollbars, Full Width)
  const handlePrintContinuousPdf = () => {
    if (typeof window === "undefined" || !previewRef.current) return;

    const previewEl = previewRef.current;
    const heightPx = previewEl.scrollHeight;
    const heightMm = Math.max(297, Math.ceil(heightPx * 0.264583 * 1.08) + 45);

    const existing = document.getElementById("continuous-itinerary-pdf-style");
    if (existing) existing.remove();

    const styleEl = document.createElement("style");
    styleEl.id = "continuous-itinerary-pdf-style";
    styleEl.innerHTML = `
      @media print {
        @page {
          size: 210mm ${heightMm}mm;
          margin: 0mm;
        }
        html, body {
          width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
          background: #ffffff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    const cleanup = () => {
      document.getElementById("continuous-itinerary-pdf-style")?.remove();
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);

    setTimeout(() => {
      window.print();
    }, 120);
  };

  const handleFileUpload = (
    files: FileList | null,
    onAddImages: (urls: string[]) => void
  ) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          onAddImages([result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrlImage = (key: string, onAdd: (url: string) => void) => {
    const val = (urlInputs[key] || "").trim();
    if (!val) return;
    onAdd(val);
    setUrlInputs((prev) => ({ ...prev, [key]: "" }));
  };

  // Day CRUD & Reorder
  const addDay = () => {
    const nextNum = data.days.length + 1;
    const newDay: ItineraryDay = {
      id: uid(),
      title: `Day ${nextNum} Coastal Exploration`,
      summary: "",
      places: [
        {
          id: uid(),
          name: "",
          tentativeTime: "",
          description: "",
          images: [],
        },
      ],
      breakfast: { enabled: false, details: "", images: [] },
      lunch: { enabled: true, details: "", images: [] },
      dinner: { enabled: true, details: "", images: [] },
      stay: { enabled: true, name: "", details: "", images: [] },
    };
    setData((prev) => ({ ...prev, days: [...prev.days, newDay] }));
    setExpandedDayId(newDay.id);
  };

  const duplicateDay = (dayId: string) => {
    const idx = data.days.findIndex((d) => d.id === dayId);
    if (idx === -1) return;
    const source = data.days[idx];
    const cloned: ItineraryDay = {
      ...JSON.parse(JSON.stringify(source)),
      id: uid(),
      title: `${source.title} (Copy)`,
      places: source.places.map((p) => ({ ...p, id: uid() })),
    };
    const nextDays = [...data.days];
    nextDays.splice(idx + 1, 0, cloned);
    setData((prev) => ({ ...prev, days: nextDays }));
    setExpandedDayId(cloned.id);
  };

  const moveDay = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= data.days.length) return;
    setData((prev) => {
      const next = [...prev.days];
      const temp = next[index];
      next[index] = next[targetIdx];
      next[targetIdx] = temp;
      return { ...prev, days: next };
    });
  };

  const removeDay = (dayId: string) => {
    if (data.days.length <= 1) return;
    setData((prev) => ({
      ...prev,
      days: prev.days.filter((d) => d.id !== dayId),
    }));
  };

  const updateDay = (dayId: string, updater: (day: ItineraryDay) => ItineraryDay) => {
    setData((prev) => ({
      ...prev,
      days: prev.days.map((d) => (d.id === dayId ? updater(d) : d)),
    }));
  };

  const movePlace = (dayId: string, pIdx: number, direction: "up" | "down") => {
    updateDay(dayId, (d) => {
      const targetIdx = direction === "up" ? pIdx - 1 : pIdx + 1;
      if (targetIdx < 0 || targetIdx >= d.places.length) return d;
      const nextPlaces = [...d.places];
      const temp = nextPlaces[pIdx];
      nextPlaces[pIdx] = nextPlaces[targetIdx];
      nextPlaces[targetIdx] = temp;
      return { ...d, places: nextPlaces };
    });
  };

  const resetToTemplate = () => {
    setData(DEFAULT_ITINERARY);
    if (DEFAULT_ITINERARY.days[0]?.id) setExpandedDayId(DEFAULT_ITINERARY.days[0].id);
  };

  const handleDownloadSamplePdf = () => {
    setData(DEFAULT_ITINERARY);
    if (DEFAULT_ITINERARY.days[0]?.id) setExpandedDayId(DEFAULT_ITINERARY.days[0].id);
    setMobileView("preview");
    setTimeout(() => {
      handlePrintContinuousPdf();
    }, 350);
  };

  // Share crisp WhatsApp Summary alongside PDF
  const handleSendWhatsAppSummary = () => {
    const dayLines = data.days
      .map((d, i) => {
        const placeNames = d.places
          .map((p) => p.name.trim())
          .filter(Boolean)
          .join(", ");
        return `*Day ${i + 1}:* ${d.title}${placeNames ? ` (${placeNames})` : ""}${
          d.stay.enabled && d.stay.name ? ` · Stay: ${d.stay.name}` : ""
        }`;
      })
      .join("\n");

    const msg = [
      `🌴 *${data.tripTitle}*`,
      data.clientName ? `_${data.clientName}_` : "",
      `⏱ Duration: ${data.durationLabel} | 📍 From: ${data.departureFrom}`,
      data.packagePrice ? `💰 *Package Price:* ${data.packagePrice}` : "",
      "",
      `*Itinerary Highlights:*`,
      dayLines,
      "",
      `Please find the detailed visual itinerary PDF attached!`,
      `📞 ${data.contactPhone} · visitkokan.in`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="print-root-page min-h-screen bg-[#f3f6f2]">
      {/* Global Print Rules to hide Admin Shell, remove scrollbars, & print full-width */}
      <style jsx global>{`
        @media print {
          ::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          aside,
          header,
          nav,
          .no-print {
            display: none !important;
          }
          html,
          body,
          main {
            padding: 0 !important;
            margin: 0 !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            background: #ffffff !important;
          }
          .print-root-page {
            background: #ffffff !important;
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-grid-container {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-preview-container {
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-preview-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
          }
        }
      `}</style>

      {/* ── TOP ACTION BAR (Hidden in Print) ── */}
      <div className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#dce7db] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-[#0f2416] flex items-center gap-2">
            <FileText size={20} className="text-emerald-700" />
            <span>Custom Itinerary PDF Builder</span>
          </h1>
          <p className="text-xs text-[#526b58]">
            Auto-fill from Visit Kokan places &amp; stays or add custom entries · Continuous zero-page-break PDF
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile View Toggle */}
          <div className="flex xl:hidden items-center bg-[#edf3eb] p-1 rounded-xl border border-[#d6e2d4]">
            <button
              type="button"
              onClick={() => setMobileView("editor")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                mobileView === "editor" ? "bg-white text-[#0f2416] shadow-xs" : "text-[#526b58]"
              }`}
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                mobileView === "preview" ? "bg-white text-[#0f2416] shadow-xs" : "text-[#526b58]"
              }`}
            >
              <Eye size={13} />
              <span>PDF Preview</span>
            </button>
          </div>

          <button
            type="button"
            onClick={resetToTemplate}
            className="px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-[#cadbc7] text-xs font-bold text-[#334637] flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset Sample</span>
          </button>

          <button
            type="button"
            onClick={handleSendWhatsAppSummary}
            className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <MessageCircle size={14} />
            <span className="hidden md:inline">WhatsApp Summary</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSamplePdf}
            className="px-3.5 py-2 rounded-xl bg-[#edf3eb] hover:bg-[#dce7da] border border-[#cadbc7] text-xs font-extrabold text-[#113822] flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Download size={14} className="text-emerald-700" />
            <span>Sample PDF</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileView("preview");
              setTimeout(() => handlePrintContinuousPdf(), 150);
            }}
            className="px-4 py-2 rounded-xl bg-[#113822] hover:bg-emerald-900 text-white text-xs sm:text-sm font-black shadow-md flex items-center gap-2 cursor-pointer active:scale-98 transition-all"
          >
            <Printer size={16} className="text-[#b8dc26]" />
            <span>Save Continuous PDF</span>
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: LEFT BUILDER FORM + RIGHT LIVE CONTINUOUS PDF PREVIEW ── */}
      <div className="print-grid-container max-w-[1600px] mx-auto p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* ══════════════════════════════════════════════════════
            LEFT COLUMN: INTERACTIVE ADMIN BUILDER (Hidden in Print)
           ══════════════════════════════════════════════════════ */}
        <div
          className={`no-print xl:col-span-5 space-y-5 ${
            mobileView === "preview" ? "hidden xl:block" : "block"
          }`}
        >
          {/* 1. TRIP HEADER DETAILS */}
          <div className="bg-white rounded-2xl border border-[#d6e2d4] shadow-xs p-5 space-y-4">
            <h2 className="text-sm font-black text-[#0f2416] uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={15} className="text-emerald-700" />
              <span>1. Trip Header &amp; Transport</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                  Package / Itinerary Title *
                </label>
                <input
                  type="text"
                  value={data.tripTitle}
                  onChange={(e) => setData({ ...data, tripTitle: e.target.value })}
                  placeholder="e.g. 3 Days Malvan & Tarkarli Coastal Escape"
                  className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-sm font-semibold text-[#0f2416] outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={data.subtitle}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="Beaches, Sea Forts, Authentic Seafood & Homestays"
                  className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs text-[#334637] outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                    Prepared For
                  </label>
                  <input
                    type="text"
                    value={data.clientName}
                    onChange={(e) => setData({ ...data, clientName: e.target.value })}
                    placeholder="Guest / Group Name"
                    className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={data.durationLabel}
                    onChange={(e) => setData({ ...data, durationLabel: e.target.value })}
                    placeholder="3 Days / 2 Nights"
                    className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                    Pickup / Start Hub
                  </label>
                  <input
                    type="text"
                    value={data.departureFrom}
                    onChange={(e) => setData({ ...data, departureFrom: e.target.value })}
                    placeholder="Mumbai / Pune"
                    className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                    Vehicle / Transport
                  </label>
                  <input
                    type="text"
                    value={data.vehicleInfo}
                    onChange={(e) => setData({ ...data, vehicleInfo: e.target.value })}
                    placeholder="AC Innova / Tempo Traveller"
                    className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Cover Photo */}
              <div>
                <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                  Hero Cover Image (URL or Upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.coverImage}
                    onChange={(e) => setData({ ...data, coverImage: e.target.value })}
                    placeholder="https://... image URL"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#cadbc7] text-xs outline-none focus:border-emerald-700"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#edf3eb] hover:bg-[#dce7da] border border-[#cadbc7] text-xs font-bold text-[#142e1b] flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload size={13} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e.target.files, (urls) =>
                          setData((prev) => ({ ...prev, coverImage: urls[0] }))
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 2. DAY-BY-DAY PLANNER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-[#0f2416] uppercase tracking-wider flex items-center gap-2">
                <MapPin size={15} className="text-emerald-700" />
                <span>2. Days, Places, Meals &amp; Stays ({data.days.length})</span>
              </h2>
              <button
                type="button"
                onClick={addDay}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Plus size={14} />
                <span>Add Day</span>
              </button>
            </div>

            {data.days.map((day, dayIdx) => {
              const isExpanded = expandedDayId === day.id;
              return (
                <div
                  key={day.id}
                  className="bg-white rounded-2xl border border-[#d6e2d4] shadow-xs overflow-hidden"
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => setExpandedDayId(isExpanded ? "" : day.id)}
                    className="p-4 bg-[#f7faf6] border-b border-[#e2ede0] flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2.5 py-1 rounded-lg bg-[#113822] text-[#b8dc26] text-xs font-black shrink-0">
                        DAY {dayIdx + 1}
                      </span>
                      <span className="text-sm font-bold text-[#0f2416] truncate">
                        {day.title || `Day ${dayIdx + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveDay(dayIdx, "up");
                        }}
                        disabled={dayIdx === 0}
                        className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-gray-600 cursor-pointer"
                        title="Move Day Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveDay(dayIdx, "down");
                        }}
                        disabled={dayIdx === data.days.length - 1}
                        className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 text-gray-600 cursor-pointer"
                        title="Move Day Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateDay(day.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 cursor-pointer"
                        title="Duplicate Day"
                      >
                        <Copy size={13} />
                      </button>
                      {data.days.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDay(day.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                          title="Delete Day"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 space-y-5">
                      {/* Day Title & Summary */}
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                            Day {dayIdx + 1} Headline
                          </label>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) =>
                              updateDay(day.id, (d) => ({ ...d, title: e.target.value }))
                            }
                            placeholder="e.g. Arrival & Coastal Sightseeing"
                            className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs font-bold outline-none focus:border-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                            Day Overview (Optional)
                          </label>
                          <input
                            type="text"
                            value={day.summary}
                            onChange={(e) =>
                              updateDay(day.id, (d) => ({ ...d, summary: e.target.value }))
                            }
                            placeholder="Brief summary of the day's vibe..."
                            className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs outline-none focus:border-emerald-700"
                          />
                        </div>
                      </div>

                      {/* Places to Visit (Supports BOTH Auto-Fill from DB & Custom Manual Entry) */}
                      <div className="space-y-3 pt-2 border-t border-[#edf3eb]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] flex items-center gap-1.5">
                            <MapPin size={13} /> Places to Visit
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateDay(day.id, (d) => ({
                                ...d,
                                places: [
                                  ...d.places,
                                  {
                                    id: uid(),
                                    name: "",
                                    tentativeTime: "",
                                    description: "",
                                    images: [],
                                  },
                                ],
                              }))
                            }
                            className="px-2.5 py-1 rounded-lg bg-[#edf3eb] hover:bg-[#dce7da] text-[#142e1b] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} /> Add Custom / Existing Place
                          </button>
                        </div>

                        {day.places.map((place, pIdx) => {
                          const urlKey = `place_${place.id}`;
                          return (
                            <div
                              key={place.id}
                              className="p-3 rounded-xl bg-[#f9fbf8] border border-[#e0e9df] space-y-2.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-black text-[#2D6A4F]">
                                  Place #{pIdx + 1}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => movePlace(day.id, pIdx, "up")}
                                    disabled={pIdx === 0}
                                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 text-gray-600 cursor-pointer"
                                    title="Move Place Up"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => movePlace(day.id, pIdx, "down")}
                                    disabled={pIdx === day.places.length - 1}
                                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 text-gray-600 cursor-pointer"
                                    title="Move Place Down"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                  {day.places.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateDay(day.id, (d) => ({
                                          ...d,
                                          places: d.places.filter((p) => p.id !== place.id),
                                        }))
                                      }
                                      className="text-rose-600 hover:underline text-[11px] font-bold ml-1 cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Auto-Fill from Existing Visit Kokan Destinations & Treks */}
                              <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-200 rounded-lg px-2.5 py-1.5">
                                <Database size={13} className="text-emerald-700 shrink-0" />
                                <select
                                  defaultValue=""
                                  onChange={(e) => {
                                    const picked = catalogPlaces.find((c) => c.id === e.target.value);
                                    if (!picked) return;
                                    updateDay(day.id, (d) => ({
                                      ...d,
                                      places: d.places.map((p) =>
                                        p.id === place.id
                                          ? {
                                              ...p,
                                              name: picked.name,
                                              description: picked.description.slice(0, 260),
                                              images:
                                                picked.images.length > 0
                                                  ? picked.images
                                                  : p.images,
                                            }
                                          : p
                                      ),
                                    }));
                                  }}
                                  className="w-full bg-transparent text-[11px] font-bold text-emerald-950 outline-none cursor-pointer"
                                >
                                  <option value="">
                                    {catalogLoading
                                      ? "Loading Visit Kokan Destinations & Treks..."
                                      : "✨ Auto-Fill from Existing Destinations / Treks (or edit below for Custom)"}
                                  </option>
                                  {catalogPlaces.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      [{item.kind}] {item.name} — {item.region}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div className="sm:col-span-2">
                                  <input
                                    type="text"
                                    value={place.name}
                                    onChange={(e) =>
                                      updateDay(day.id, (d) => ({
                                        ...d,
                                        places: d.places.map((p) =>
                                          p.id === place.id ? { ...p, name: e.target.value } : p
                                        ),
                                      }))
                                    }
                                    placeholder="Custom or Auto-filled Place Name"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#cadbc7] bg-white text-xs font-semibold outline-none"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    value={place.tentativeTime}
                                    onChange={(e) =>
                                      updateDay(day.id, (d) => ({
                                        ...d,
                                        places: d.places.map((p) =>
                                          p.id === place.id
                                            ? { ...p, tentativeTime: e.target.value }
                                            : p
                                        ),
                                      }))
                                    }
                                    placeholder="Time (Optional)"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#cadbc7] bg-white text-xs outline-none"
                                  />
                                </div>
                              </div>

                              <textarea
                                rows={2}
                                value={place.description}
                                onChange={(e) =>
                                  updateDay(day.id, (d) => ({
                                    ...d,
                                    places: d.places.map((p) =>
                                      p.id === place.id
                                        ? { ...p, description: e.target.value }
                                        : p
                                    ),
                                  }))
                                }
                                placeholder="Highlights / sightseeing notes..."
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#cadbc7] bg-white text-xs outline-none"
                              />

                              {/* Place Images */}
                              <div className="space-y-1.5">
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    value={urlInputs[urlKey] || ""}
                                    onChange={(e) =>
                                      setUrlInputs((prev) => ({ ...prev, [urlKey]: e.target.value }))
                                    }
                                    placeholder="Paste place image URL..."
                                    className="flex-1 px-2.5 py-1 rounded-lg border border-[#cadbc7] bg-white text-[11px] outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddUrlImage(urlKey, (url) =>
                                        updateDay(day.id, (d) => ({
                                          ...d,
                                          places: d.places.map((p) =>
                                            p.id === place.id
                                              ? { ...p, images: [...p.images, url] }
                                              : p
                                          ),
                                        }))
                                      )
                                    }
                                    className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                                  >
                                    Add URL
                                  </button>
                                  <label className="px-2.5 py-1 rounded-lg bg-white border border-[#cadbc7] text-[11px] font-bold text-[#142e1b] flex items-center gap-1 cursor-pointer">
                                    <Upload size={11} />
                                    <span>Photo</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      className="hidden"
                                      onChange={(e) =>
                                        handleFileUpload(e.target.files, (urls) =>
                                          updateDay(day.id, (d) => ({
                                            ...d,
                                            places: d.places.map((p) =>
                                              p.id === place.id
                                                ? { ...p, images: [...p.images, ...urls] }
                                                : p
                                            ),
                                          }))
                                        )
                                      }
                                    />
                                  </label>
                                </div>

                                {place.images.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 pt-1">
                                    {place.images.map((img, iIdx) => (
                                      <div
                                        key={iIdx}
                                        className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#cadbc7] group"
                                      >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={img}
                                          alt="Place preview"
                                          className="w-full h-full object-cover"
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            updateDay(day.id, (d) => ({
                                              ...d,
                                              places: d.places.map((p) =>
                                                p.id === place.id
                                                  ? {
                                                      ...p,
                                                      images: p.images.filter((_, x) => x !== iIdx),
                                                    }
                                                  : p
                                              ),
                                            }))
                                          }
                                          className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Breakfast, Lunch & Dinner Arrangement */}
                      <div className="space-y-3 pt-2 border-t border-[#edf3eb]">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#B7895A] flex items-center gap-1.5">
                          <Utensils size={13} /> Breakfast, Lunch &amp; Dinner Options
                        </span>

                        {(
                          [
                            { key: "breakfast", label: "Include Breakfast Details", placeholder: "e.g. Kanda Poha, Amboli Chutney, Tea & Coffee..." },
                            { key: "lunch", label: "Include Lunch Details", placeholder: "e.g. Authentic Veg/Fish Thali, Solkadhi..." },
                            { key: "dinner", label: "Include Dinner Details", placeholder: "e.g. Malvani Chicken/Paneer Masala, Bhakri, Rice..." },
                          ] as const
                        ).map((mealCfg) => {
                          const meal = day[mealCfg.key];
                          const uKey = `${mealCfg.key}_${day.id}`;
                          return (
                            <div
                              key={mealCfg.key}
                              className="p-3 rounded-xl bg-[#fcf9f5] border border-[#efe6dc] space-y-2"
                            >
                              <label className="flex items-center justify-between text-xs font-bold text-[#423326] cursor-pointer">
                                <span>{mealCfg.label}</span>
                                <input
                                  type="checkbox"
                                  checked={meal.enabled}
                                  onChange={(e) =>
                                    updateDay(day.id, (d) => ({
                                      ...d,
                                      [mealCfg.key]: { ...meal, enabled: e.target.checked },
                                    }))
                                  }
                                />
                              </label>
                              {meal.enabled && (
                                <>
                                  <textarea
                                    rows={2}
                                    value={meal.details}
                                    onChange={(e) =>
                                      updateDay(day.id, (d) => ({
                                        ...d,
                                        [mealCfg.key]: { ...meal, details: e.target.value },
                                      }))
                                    }
                                    placeholder={mealCfg.placeholder}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#e2d4c3] bg-white text-xs outline-none"
                                  />
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      value={urlInputs[uKey] || ""}
                                      onChange={(e) =>
                                        setUrlInputs((prev) => ({
                                          ...prev,
                                          [uKey]: e.target.value,
                                        }))
                                      }
                                      placeholder="Food image URL..."
                                      className="flex-1 px-2.5 py-1 rounded-lg border border-[#e2d4c3] bg-white text-[11px] outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAddUrlImage(uKey, (url) =>
                                          updateDay(day.id, (d) => ({
                                            ...d,
                                            [mealCfg.key]: {
                                              ...meal,
                                              images: [...meal.images, url],
                                            },
                                          }))
                                        )
                                      }
                                      className="px-2.5 py-1 rounded-lg bg-[#9c6b3b] text-white text-[11px] font-bold cursor-pointer"
                                    >
                                      Add URL
                                    </button>
                                    <label className="px-2.5 py-1 rounded-lg bg-white border border-[#e2d4c3] text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                                      <Upload size={11} />
                                      <span>Photo</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) =>
                                          handleFileUpload(e.target.files, (urls) =>
                                            updateDay(day.id, (d) => ({
                                              ...d,
                                              [mealCfg.key]: {
                                                ...meal,
                                                images: [...meal.images, ...urls],
                                              },
                                            }))
                                          )
                                        }
                                      />
                                    </label>
                                  </div>
                                  {meal.images.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                      {meal.images.map((img, iIdx) => (
                                        <div
                                          key={iIdx}
                                          className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#e2d4c3] group"
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={img} alt="Meal" className="w-full h-full object-cover" />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              updateDay(day.id, (d) => ({
                                                ...d,
                                                [mealCfg.key]: {
                                                  ...meal,
                                                  images: meal.images.filter((_, x) => x !== iIdx),
                                                },
                                              }))
                                            }
                                            className="absolute inset-0 bg-black/60 text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Homestay / Staying Arrangement (Auto-Fill + Custom) */}
                      <div className="space-y-2.5 pt-2 border-t border-[#edf3eb]">
                        <label className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-[#2D6A4F] cursor-pointer">
                          <span className="flex items-center gap-1.5">
                            <Bed size={13} /> Homestay / Staying Arrangement
                          </span>
                          <input
                            type="checkbox"
                            checked={day.stay.enabled}
                            onChange={(e) =>
                              updateDay(day.id, (d) => ({
                                ...d,
                                stay: { ...d.stay, enabled: e.target.checked },
                              }))
                            }
                          />
                        </label>

                        {day.stay.enabled && (
                          <div className="p-3 rounded-xl bg-[#f4f8f3] border border-[#dce7db] space-y-2">
                            {catalogStays.length > 0 && (
                              <div className="flex items-center gap-2 bg-white border border-[#cadbc7] rounded-lg px-2.5 py-1.5">
                                <Database size={13} className="text-emerald-700 shrink-0" />
                                <select
                                  defaultValue=""
                                  onChange={(e) => {
                                    const picked = catalogStays.find((s) => s.id === e.target.value);
                                    if (!picked) return;
                                    updateDay(day.id, (d) => ({
                                      ...d,
                                      stay: {
                                        ...d.stay,
                                        name: `${picked.name} (${picked.region})`,
                                        details: picked.description.slice(0, 220),
                                        images:
                                          picked.images.length > 0
                                            ? picked.images
                                            : d.stay.images,
                                      },
                                    }));
                                  }}
                                  className="w-full bg-transparent text-[11px] font-bold text-emerald-950 outline-none cursor-pointer"
                                >
                                  <option value="">
                                    ✨ Auto-Fill from Verified Homestays (or type custom below)
                                  </option>
                                  {catalogStays.map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.name} — {s.region} ({s.category})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            <input
                              type="text"
                              value={day.stay.name}
                              onChange={(e) =>
                                updateDay(day.id, (d) => ({
                                  ...d,
                                  stay: { ...d.stay, name: e.target.value },
                                }))
                              }
                              placeholder="Custom or Auto-filled Homestay / Resort Name"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#cadbc7] bg-white text-xs font-semibold outline-none"
                            />
                            <textarea
                              rows={2}
                              value={day.stay.details}
                              onChange={(e) =>
                                updateDay(day.id, (d) => ({
                                  ...d,
                                  stay: { ...d.stay, details: e.target.value },
                                }))
                              }
                              placeholder="Room type, amenities, check-in info..."
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#cadbc7] bg-white text-xs outline-none"
                            />
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={urlInputs[`stay_${day.id}`] || ""}
                                onChange={(e) =>
                                  setUrlInputs((prev) => ({
                                    ...prev,
                                    [`stay_${day.id}`]: e.target.value,
                                  }))
                                }
                                placeholder="Stay / room image URL..."
                                className="flex-1 px-2.5 py-1 rounded-lg border border-[#cadbc7] bg-white text-[11px] outline-none"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleAddUrlImage(`stay_${day.id}`, (url) =>
                                    updateDay(day.id, (d) => ({
                                      ...d,
                                      stay: { ...d.stay, images: [...d.stay.images, url] },
                                    }))
                                  )
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                              >
                                Add URL
                              </button>
                              <label className="px-2.5 py-1 rounded-lg bg-white border border-[#cadbc7] text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                                <Upload size={11} />
                                <span>Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(e.target.files, (urls) =>
                                      updateDay(day.id, (d) => ({
                                        ...d,
                                        stay: { ...d.stay, images: [...d.stay.images, ...urls] },
                                      }))
                                    )
                                  }
                                />
                              </label>
                            </div>
                            {day.stay.images.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {day.stay.images.map((img, iIdx) => (
                                  <div
                                    key={iIdx}
                                    className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#cadbc7] group"
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt="Stay" className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateDay(day.id, (d) => ({
                                          ...d,
                                          stay: {
                                            ...d.stay,
                                            images: d.stay.images.filter((_, x) => x !== iIdx),
                                          },
                                        }))
                                      }
                                      className="absolute inset-0 bg-black/60 text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3. CLOSING POINTS: PRICE, INCLUSIONS, EXCLUSIONS, POLICY & BOOKING TERMS */}
          <div className="bg-white rounded-2xl border border-[#d6e2d4] shadow-xs p-5 space-y-4">
            <h2 className="text-sm font-black text-[#0f2416] uppercase tracking-wider flex items-center gap-2">
              <IndianRupee size={15} className="text-emerald-700" />
              <span>3. Package Price, Policies &amp; Closing</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                  Package Price
                </label>
                <input
                  type="text"
                  value={data.packagePrice}
                  onChange={(e) => setData({ ...data, packagePrice: e.target.value })}
                  placeholder="e.g. ₹6,499 / person"
                  className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-sm font-black text-emerald-900 outline-none focus:border-emerald-700"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                  Price Note / Sharing Basis
                </label>
                <input
                  type="text"
                  value={data.priceNote}
                  onChange={(e) => setData({ ...data, priceNote: e.target.value })}
                  placeholder="Twin sharing · GST included"
                  className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs outline-none focus:border-emerald-700"
                />
              </div>
            </div>

            {/* What Package Includes */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-emerald-800 block">
                What Package Includes
              </label>
              <div className="space-y-1.5">
                {data.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={inc}
                      onChange={(e) => {
                        const next = [...data.inclusions];
                        next[i] = e.target.value;
                        setData({ ...data, inclusions: next });
                      }}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#cadbc7] text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setData({
                          ...data,
                          inclusions: data.inclusions.filter((_, idx) => idx !== i),
                        })
                      }
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newInclusion}
                  onChange={(e) => setNewInclusion(e.target.value)}
                  placeholder="Add inclusion point..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#cadbc7] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newInclusion.trim()) return;
                    setData({
                      ...data,
                      inclusions: [...data.inclusions, newInclusion.trim()],
                    });
                    setNewInclusion("");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* What Package Does NOT Include */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-rose-800 block">
                What Package Does NOT Include
              </label>
              <div className="space-y-1.5">
                {data.exclusions.map((exc, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={exc}
                      onChange={(e) => {
                        const next = [...data.exclusions];
                        next[i] = e.target.value;
                        setData({ ...data, exclusions: next });
                      }}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#cadbc7] text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setData({
                          ...data,
                          exclusions: data.exclusions.filter((_, idx) => idx !== i),
                        })
                      }
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newExclusion}
                  onChange={(e) => setNewExclusion(e.target.value)}
                  placeholder="Add exclusion point..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#cadbc7] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newExclusion.trim()) return;
                    setData({
                      ...data,
                      exclusions: [...data.exclusions, newExclusion.trim()],
                    });
                    setNewExclusion("");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Food & Additional Expense Policy */}
            <div>
              <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                Food &amp; Additional Expense Policy
              </label>
              <textarea
                rows={3}
                value={data.foodExpensePolicy}
                onChange={(e) => setData({ ...data, foodExpensePolicy: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs outline-none focus:border-emerald-700"
              />
            </div>

            {/* Booking & Payment Terms */}
            <div>
              <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                Booking &amp; Payment Terms
              </label>
              <textarea
                rows={2}
                value={data.bookingTerms}
                onChange={(e) => setData({ ...data, bookingTerms: e.target.value })}
                placeholder="Advance %, cancellation & rescheduling policy..."
                className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs outline-none focus:border-emerald-700"
              />
            </div>

            {/* Closing Statement & Contact */}
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                  Closing Statement
                </label>
                <textarea
                  rows={2}
                  value={data.closingStatement}
                  onChange={(e) => setData({ ...data, closingStatement: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs outline-none focus:border-emerald-700"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#3d5343] block mb-1">
                  Booking Contact Number
                </label>
                <input
                  type="text"
                  value={data.contactPhone}
                  onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#cadbc7] text-xs outline-none focus:border-emerald-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            RIGHT COLUMN: LIVE CONTINUOUS MODERN PDF PREVIEW
           ══════════════════════════════════════════════════════ */}
        <div
          className={`print-preview-container xl:col-span-7 flex justify-center ${
            mobileView === "editor" ? "hidden xl:flex" : "flex"
          }`}
        >
          <div
            ref={previewRef}
            className="print-preview-wrapper w-full max-w-[794px] bg-white rounded-3xl shadow-2xl border border-[#cadbc7] overflow-hidden text-[#122617]"
          >
            {/* ── 1. MODERN HERO COVER BANNER ── */}
            <div className="relative bg-gradient-to-br from-[#0d2818] via-[#154027] to-[#1e5a37] text-white overflow-hidden">
              {data.coverImage && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.coverImage}
                    alt={data.tripTitle}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_DESTINATION_IMAGE;
                    }}
                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b2315] via-[#0d2818]/75 to-[#0d2818]/45" />
                </>
              )}

              <div className="relative z-10 p-8 sm:p-10 space-y-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-extrabold tracking-wider uppercase">
                    <span className="w-2 h-2 rounded-full bg-[#b8dc26]" />
                    <span>Visit Kokan · Curated Travel Proposal</span>
                  </div>
                  {data.clientName && (
                    <span className="px-3.5 py-1.5 rounded-full bg-[#b8dc26] text-[#0f2416] text-xs font-black">
                      {data.clientName}
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-[1.12] text-white">
                    {data.tripTitle || "Custom Konkan Itinerary"}
                  </h1>
                  {data.subtitle && (
                    <p className="text-sm sm:text-base text-emerald-100/90 font-medium max-w-2xl">
                      {data.subtitle}
                    </p>
                  )}
                </div>

                {/* Quick Trip Metadata Strip */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-bold">
                  {data.durationLabel && (
                    <span className="px-3.5 py-2 rounded-xl bg-black/30 border border-white/15 flex items-center gap-1.5">
                      <Clock size={14} className="text-[#b8dc26]" />
                      <span>{data.durationLabel}</span>
                    </span>
                  )}
                  {data.departureFrom && (
                    <span className="px-3.5 py-2 rounded-xl bg-black/30 border border-white/15 flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#b8dc26]" />
                      <span>From {data.departureFrom}</span>
                    </span>
                  )}
                  {data.vehicleInfo && (
                    <span className="px-3.5 py-2 rounded-xl bg-black/30 border border-white/15 flex items-center gap-1.5">
                      <Car size={14} className="text-[#b8dc26]" />
                      <span>{data.vehicleInfo}</span>
                    </span>
                  )}
                  {data.packagePrice && (
                    <span className="px-3.5 py-2 rounded-xl bg-emerald-500/25 border border-emerald-400/40 text-[#d8f768] flex items-center gap-1.5">
                      <IndianRupee size={14} />
                      <span>{data.packagePrice}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── 2. CONTINUOUS DAY-BY-DAY TIMELINE ── */}
            <div className="p-6 sm:p-9 space-y-8 bg-[#f9fbf8]">
              {data.days.map((day, dIdx) => (
                <section
                  key={day.id}
                  className="bg-white rounded-3xl border border-[#dce7db] shadow-xs overflow-hidden"
                >
                  {/* Day Header */}
                  <div className="bg-gradient-to-r from-[#113822] to-[#1e5736] px-6 py-4 text-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-xl bg-[#b8dc26] text-[#113822] text-xs font-black tracking-wider">
                        DAY {String(dIdx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h2 className="text-base sm:text-lg font-black leading-snug">
                          {day.title || `Day ${dIdx + 1}`}
                        </h2>
                        {day.summary && (
                          <p className="text-xs text-emerald-100/80 mt-0.5">{day.summary}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Places to Visit */}
                    {day.places.some(
                      (p) => p.name.trim() || p.description.trim() || p.images.length > 0
                    ) && (
                      <div className="space-y-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#2D6A4F] flex items-center gap-1.5">
                          <MapPin size={13} /> Places to Visit
                        </p>

                        <div className="space-y-4">
                          {day.places.map((place, pIdx) => {
                            if (
                              !place.name.trim() &&
                              !place.description.trim() &&
                              place.images.length === 0
                            ) {
                              return null;
                            }
                            return (
                              <div
                                key={place.id}
                                className="p-4 rounded-2xl bg-[#f6faf5] border border-[#e2ede0] space-y-3"
                              >
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-6 h-6 rounded-full bg-[#113822] text-white text-xs font-black flex items-center justify-center shrink-0">
                                      {pIdx + 1}
                                    </span>
                                    <h3 className="text-sm sm:text-base font-black text-[#0f2416]">
                                      {place.name || "Sightseeing Stop"}
                                    </h3>
                                  </div>
                                  {place.tentativeTime.trim() && (
                                    <span className="px-2.5 py-1 rounded-full bg-white border border-[#cadbc7] text-[11px] font-bold text-[#2D6A4F] flex items-center gap-1 shrink-0">
                                      <Clock size={11} />
                                      <span>{place.tentativeTime}</span>
                                    </span>
                                  )}
                                </div>

                                {place.description.trim() && (
                                  <p className="text-xs sm:text-[13px] text-[#334637] leading-relaxed pl-8">
                                    {place.description}
                                  </p>
                                )}

                                {place.images.length > 0 && (
                                  <div
                                    className={`pl-8 grid gap-2.5 ${
                                      place.images.length === 1
                                        ? "grid-cols-1"
                                        : place.images.length === 2
                                        ? "grid-cols-2"
                                        : "grid-cols-3"
                                    }`}
                                  >
                                    {place.images.map((img, iIdx) => (
                                      <div
                                        key={iIdx}
                                        className="rounded-2xl overflow-hidden border border-[#dce7db] bg-slate-100 h-44 sm:h-48"
                                      >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={img}
                                          alt={place.name || "Place photo"}
                                          onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src =
                                              FALLBACK_DESTINATION_IMAGE;
                                          }}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Breakfast, Lunch & Dinner Arrangement */}
                    {(day.breakfast.enabled &&
                      (day.breakfast.details.trim() || day.breakfast.images.length > 0)) ||
                    (day.lunch.enabled &&
                      (day.lunch.details.trim() || day.lunch.images.length > 0)) ||
                    (day.dinner.enabled &&
                      (day.dinner.details.trim() || day.dinner.images.length > 0)) ? (
                      <div className="space-y-3 pt-2 border-t border-[#edf3eb]">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#B7895A] flex items-center gap-1.5">
                          <Utensils size={13} /> Dining &amp; Coastal Cuisine
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {(
                            [
                              {
                                key: "breakfast" as const,
                                badge: "🌅 Breakfast Menu",
                                badgeCls: "bg-[#fef3c7] text-[#92400e]",
                              },
                              {
                                key: "lunch" as const,
                                badge: "☀️ Lunch Menu",
                                badgeCls: "bg-[#f3e5d3] text-[#7c4d1e]",
                              },
                              {
                                key: "dinner" as const,
                                badge: "🌙 Dinner Menu",
                                badgeCls: "bg-[#e8dccb] text-[#5e3814]",
                              },
                            ] as const
                          ).map((m) => {
                            const meal = day[m.key];
                            if (!meal.enabled || (!meal.details.trim() && meal.images.length === 0)) {
                              return null;
                            }
                            return (
                              <div
                                key={m.key}
                                className="p-4 rounded-2xl bg-[#fcf9f5] border border-[#efe6dc] space-y-2.5"
                              >
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${m.badgeCls}`}
                                >
                                  {m.badge}
                                </span>
                                {meal.details.trim() && (
                                  <p className="text-xs text-[#3b2c1d] leading-relaxed font-medium">
                                    {meal.details}
                                  </p>
                                )}
                                {meal.images.length > 0 && (
                                  <div className="grid grid-cols-2 gap-2 pt-1">
                                    {meal.images.map((img, iIdx) => (
                                      <div
                                        key={iIdx}
                                        className={`rounded-xl overflow-hidden border border-[#eadbc8] h-28 ${
                                          meal.images.length === 1 ? "col-span-2 h-36" : ""
                                        }`}
                                      >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={img}
                                          alt={m.badge}
                                          onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src =
                                              FALLBACK_DESTINATION_IMAGE;
                                          }}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    {/* Homestay / Staying Arrangement */}
                    {day.stay.enabled &&
                      (day.stay.name.trim() ||
                        day.stay.details.trim() ||
                        day.stay.images.length > 0) && (
                        <div className="space-y-3 pt-2 border-t border-[#edf3eb]">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#2D6A4F] flex items-center gap-1.5">
                            <Bed size={13} /> Staying Arrangement
                          </p>
                          <div className="p-4 rounded-2xl bg-[#f3f8f2] border border-[#d6e4d5] space-y-3">
                            <div>
                              {day.stay.name.trim() && (
                                <h4 className="text-sm font-black text-[#0f2416]">
                                  🏡 {day.stay.name}
                                </h4>
                              )}
                              {day.stay.details.trim() && (
                                <p className="text-xs text-[#334637] leading-relaxed mt-1">
                                  {day.stay.details}
                                </p>
                              )}
                            </div>

                            {day.stay.images.length > 0 && (
                              <div
                                className={`grid gap-2.5 ${
                                  day.stay.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                                }`}
                              >
                                {day.stay.images.map((img, iIdx) => (
                                  <div
                                    key={iIdx}
                                    className="rounded-xl overflow-hidden border border-[#cadbc7] h-40"
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={img}
                                      alt={day.stay.name || "Homestay"}
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                          FALLBACK_DESTINATION_IMAGE;
                                      }}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </section>
              ))}

              {/* ── 3. PACKAGE PRICE HIGHLIGHT ── */}
              {data.packagePrice.trim() && (
                <div className="rounded-3xl bg-gradient-to-r from-[#113822] via-[#194c2f] to-[#246640] text-white p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#b8dc26] block">
                      All-Inclusive Package Investment
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black mt-1">
                      {data.packagePrice}
                    </h3>
                    {data.priceNote && (
                      <p className="text-xs text-emerald-100/85 mt-1">{data.priceNote}</p>
                    )}
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs font-bold text-emerald-50">
                    Visit Kokan Verified Experience
                  </div>
                </div>
              )}

              {/* ── 4. INCLUSIONS & EXCLUSIONS ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.inclusions.length > 0 && (
                  <div className="bg-white rounded-3xl p-5 border border-[#cce0ca] shadow-2xs space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <span>What Package Includes</span>
                    </h3>
                    <ul className="space-y-2">
                      {data.inclusions.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-[#253b2b] flex items-start gap-2 leading-relaxed"
                        >
                          <span className="text-emerald-600 font-black mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.exclusions.length > 0 && (
                  <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-2xs space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                      <XCircle size={15} className="text-rose-600" />
                      <span>What Package Does Not Include</span>
                    </h3>
                    <ul className="space-y-2">
                      {data.exclusions.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-[#3f292b] flex items-start gap-2 leading-relaxed"
                        >
                          <span className="text-rose-500 font-black mt-0.5">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* ── 5. FOOD & ADDITIONAL EXPENSE POLICY + BOOKING TERMS ── */}
              <div className="space-y-3">
                {data.foodExpensePolicy.trim() && (
                  <div className="bg-[#fefce8] rounded-3xl p-5 border border-[#f5e7a4] space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#854d0e] flex items-center gap-1.5">
                      <ShieldAlert size={15} className="text-[#a16207]" />
                      <span>Food &amp; Additional Expense Policy</span>
                    </h3>
                    <p className="text-xs text-[#5c3c0e] leading-relaxed">
                      {data.foodExpensePolicy}
                    </p>
                  </div>
                )}

                {data.bookingTerms.trim() && (
                  <div className="bg-white rounded-3xl p-5 border border-[#d6e2d4] space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#2D6A4F] flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-[#2D6A4F]" />
                      <span>Booking &amp; Cancellation Terms</span>
                    </h3>
                    <p className="text-xs text-[#334637] leading-relaxed">
                      {data.bookingTerms}
                    </p>
                  </div>
                )}
              </div>

              {/* ── 6. CLOSING STATEMENT & CONTACT FOOTER ── */}
              <div className="rounded-3xl bg-[#102618] text-white p-6 sm:p-7 space-y-4">
                {data.closingStatement.trim() && (
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
                    {data.closingStatement}
                  </p>
                )}
                <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="font-black text-[#b8dc26] tracking-wide">
                    VISIT KOKAN · COASTAL TRAVEL CONCIERGE
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-emerald-100 font-semibold">
                    {data.contactPhone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} className="text-[#b8dc26]" />
                        <span>{data.contactPhone}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Globe size={13} className="text-[#b8dc26]" />
                      <span>visitkokan.in</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
