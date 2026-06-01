"use client";

import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, Star, StarOff,
  X, Loader2, ChevronDown, ChevronUp, Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface Trek {
  id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  category: string;
  difficulty: "easy" | "moderate" | "hard" | "expert";
  duration: string;
  distance: string;
  price: number;
  startPoint: string;
  endPoint: string;
  maxAltitude: string;
  bestSeason: string;
  groupSize: string;
  highlights: string[];
  thingsToBring: string[];
  itinerary: ItineraryDay[];
  images: string[];
  featured: boolean;
  approved: boolean;
  createdAt: string;
}

// ─── Blank trek ───────────────────────────────────────────────────────────────
const blankTrek = (): Omit<Trek, "id" | "approved" | "featured" | "createdAt"> => ({
  name: "",
  slug: "",
  description: "",
  region: "",
  category: "coastal",
  difficulty: "moderate",
  duration: "",
  distance: "",
  price: 0,
  startPoint: "",
  endPoint: "",
  maxAltitude: "",
  bestSeason: "",
  groupSize: "",
  highlights: [""],
  thingsToBring: [""],
  itinerary: [{ day: 1, title: "", description: "" }],
  images: [""],
});

// ─── Slug generator ───────────────────────────────────────────────────────────
const toSlug = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ─── Constants ────────────────────────────────────────────────────────────────
const REGIONS = ["Ratnagiri", "Sindhudurg", "Raigad", "Thane", "Palghar"];
const CATEGORIES = [
  { value: "coastal",  label: "🏖️ Coastal"  },
  { value: "fort",     label: "🏰 Fort"      },
  { value: "waterfall",label: "💧 Waterfall" },
  { value: "forest",   label: "🌲 Forest"    },
  { value: "night",    label: "🌙 Night"     },
];
const DIFFICULTIES = ["easy", "moderate", "hard", "expert"];

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  title, open, onToggle, children,
}: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="font-semibold text-kokan-earth text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="px-4 py-4 space-y-3">{children}</div>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminTreksPage() {
  const [treks, setTreks]           = useState<Trek[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  // form state
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [form, setForm]             = useState(blankTrek());
  const [errors, setErrors]         = useState<string[]>([]);

  // section open/close
  const [sections, setSections] = useState({
    basic: true, details: false, lists: false, itinerary: false, images: false,
  });
  const toggleSection = (key: keyof typeof sections) =>
    setSections((s) => ({ ...s, [key]: !s[key] }));

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchTreks = async () => {
    setLoading(true);
    const res = await fetch("/api/treks?all=true");
    const data = await res.json();
    setTreks(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchTreks(); }, []);

  // ── Open form ──────────────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(blankTrek());
    setEditingId(null);
    setErrors([]);
    setSections({ basic: true, details: false, lists: false, itinerary: false, images: false });
    setShowForm(true);
    setTimeout(() => document.getElementById("trek-form-top")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const openEdit = (trek: Trek) => {
    setForm({
      name:          trek.name,
      slug:          trek.slug,
      description:   trek.description,
      region:        trek.region,
      category:      trek.category,
      difficulty:    trek.difficulty,
      duration:      trek.duration,
      distance:      trek.distance,
      price:         trek.price,
      startPoint:    trek.startPoint,
      endPoint:      trek.endPoint,
      maxAltitude:   trek.maxAltitude ?? "",
      bestSeason:    trek.bestSeason ?? "",
      groupSize:     trek.groupSize ?? "",
      highlights:    trek.highlights?.length ? trek.highlights : [""],
      thingsToBring: trek.thingsToBring?.length ? trek.thingsToBring : [""],
      itinerary:     trek.itinerary?.length ? trek.itinerary : [{ day: 1, title: "", description: "" }],
      images:        trek.images?.length ? trek.images : [""],
    });
    setEditingId(trek.id);
    setErrors([]);
    setSections({ basic: true, details: true, lists: true, itinerary: true, images: true });
    setShowForm(true);
    setTimeout(() => document.getElementById("trek-form-top")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); };

  // ── Field helpers ──────────────────────────────────────────────────────────
  const setField = (key: keyof typeof form, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setListItem = (key: "highlights" | "thingsToBring" | "images", idx: number, val: string) =>
    setForm((f) => {
      const arr = [...(f[key] as string[])];
      arr[idx] = val;
      return { ...f, [key]: arr };
    });

  const addListItem = (key: "highlights" | "thingsToBring" | "images") =>
    setForm((f) => ({ ...f, [key]: [...(f[key] as string[]), ""] }));

  const removeListItem = (key: "highlights" | "thingsToBring" | "images", idx: number) =>
    setForm((f) => {
      const arr = (f[key] as string[]).filter((_, i) => i !== idx);
      return { ...f, [key]: arr.length ? arr : [""] };
    });

  const setItineraryField = (idx: number, key: keyof ItineraryDay, val: string | number) =>
    setForm((f) => {
      const arr = f.itinerary.map((d, i) => i === idx ? { ...d, [key]: val } : d);
      return { ...f, itinerary: arr };
    });

  const addDay = () =>
    setForm((f) => ({
      ...f,
      itinerary: [...f.itinerary, { day: f.itinerary.length + 1, title: "", description: "" }],
    }));

  const removeDay = (idx: number) =>
    setForm((f) => {
      const arr = f.itinerary
        .filter((_, i) => i !== idx)
        .map((d, i) => ({ ...d, day: i + 1 }));
      return { ...f, itinerary: arr.length ? arr : [{ day: 1, title: "", description: "" }] };
    });

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs: string[] = [];
    if (!form.name.trim())        errs.push("Trek name is required");
    if (!form.slug.trim())        errs.push("Slug is required");
    if (!form.description.trim()) errs.push("Description is required");
    if (!form.region)             errs.push("Region is required");
    if (!form.duration.trim())    errs.push("Duration is required");
    if (!form.distance.trim())    errs.push("Distance is required");
    if (form.price <= 0)          errs.push("Price must be greater than 0");
    if (!form.startPoint.trim())  errs.push("Start point is required");
    if (!form.endPoint.trim())    errs.push("End point is required");
    setErrors(errs);
    return errs.length === 0;
  };

  // ── Save (create or update) ────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) {
      setSections((s) => ({ ...s, basic: true, details: true }));
      return;
    }
    setSaving(true);

    const payload = {
      ...form,
      highlights:    form.highlights.filter(Boolean),
      thingsToBring: form.thingsToBring.filter(Boolean),
      images:        form.images.filter(Boolean),
      itinerary:     form.itinerary.filter((d) => d.title || d.description),
      price:         Number(form.price),
    };

    try {
      if (editingId) {
        // EDIT
        await fetch("/api/treks", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        // CREATE
        await fetch("/api/treks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await fetchTreks();
      closeForm();
    } catch (err) {
      alert("Failed to save. Check console.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle featured ────────────────────────────────────────────────────────
  const toggleFeatured = async (trek: Trek) => {
    await fetch("/api/treks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: trek.id, featured: !trek.featured }),
    });
    fetchTreks();
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch("/api/treks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTreks();
  };

  // ── Difficulty badge ───────────────────────────────────────────────────────
  const diffColor: Record<string, string> = {
    easy:     "bg-green-100 text-green-700",
    moderate: "bg-yellow-100 text-yellow-700",
    hard:     "bg-orange-100 text-orange-700",
    expert:   "bg-red-100 text-red-700",
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between" id="trek-form-top">
        <div>
          <h1 className="text-2xl font-bold text-kokan-earth">🥾 Treks</h1>
          <p className="text-sm text-gray-500 mt-0.5">{treks.length} trek{treks.length !== 1 ? "s" : ""} total</p>
        </div>
        {!showForm && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-kokan-green text-white rounded-xl font-semibold text-sm hover:bg-kokan-green/90 transition-colors"
          >
            <Plus size={16} /> Add Trek
          </button>
        )}
      </div>

      {/* ── Form ──────────────────────────────────────────────────────────── */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Form header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-bold text-kokan-earth text-base">
              {editingId ? "✏️ Edit Trek" : "➕ New Trek"}
            </h2>
            <button onClick={closeForm}>
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="p-5 space-y-4">

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1">
                {errors.map((e, i) => (
                  <p key={i} className="text-xs text-red-600 flex items-center gap-1.5">
                    <span>•</span> {e}
                  </p>
                ))}
              </div>
            )}

            {/* ── BASIC INFO ── */}
            <Section title="Basic Info" open={sections.basic} onToggle={() => toggleSection("basic")}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Trek Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => {
                      setField("name", e.target.value);
                      if (!editingId) setField("slug", toSlug(e.target.value));
                    }}
                    placeholder="Vijaydurg Fort Trek"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Slug *</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setField("slug", toSlug(e.target.value))}
                    placeholder="vijaydurg-fort-trek"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={3}
                  placeholder="A scenic coastal trek through..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Region *</label>
                  <select
                    value={form.region}
                    onChange={(e) => setField("region", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  >
                    <option value="">Select region</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setField("category", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  >
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setField("difficulty", e.target.value as Trek["difficulty"])}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Section>

            {/* ── DETAILS ── */}
            <Section title="Trek Details" open={sections.details} onToggle={() => toggleSection("details")}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Duration *</label>
                  <input
                    value={form.duration}
                    onChange={(e) => setField("duration", e.target.value)}
                    placeholder="2 Days / 1 Night"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Distance *</label>
                  <input
                    value={form.distance}
                    onChange={(e) => setField("distance", e.target.value)}
                    placeholder="14 km"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Price (₹) *</label>
                  <input
                    type="number" min="0"
                    value={form.price || ""}
                    onChange={(e) => setField("price", Number(e.target.value))}
                    placeholder="1499"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Start Point *</label>
                  <input
                    value={form.startPoint}
                    onChange={(e) => setField("startPoint", e.target.value)}
                    placeholder="Vijaydurg Village"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">End Point *</label>
                  <input
                    value={form.endPoint}
                    onChange={(e) => setField("endPoint", e.target.value)}
                    placeholder="Vijaydurg Fort"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Max Altitude</label>
                  <input
                    value={form.maxAltitude}
                    onChange={(e) => setField("maxAltitude", e.target.value)}
                    placeholder="320m"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Best Season</label>
                  <input
                    value={form.bestSeason}
                    onChange={(e) => setField("bestSeason", e.target.value)}
                    placeholder="Oct – Feb"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Group Size</label>
                  <input
                    value={form.groupSize}
                    onChange={(e) => setField("groupSize", e.target.value)}
                    placeholder="5 – 20 people"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                </div>
              </div>
            </Section>

            {/* ── LISTS ── */}
            <Section title="Highlights & Packing List" open={sections.lists} onToggle={() => toggleSection("lists")}>

              {/* Highlights */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Highlights</label>
                <div className="space-y-2">
                  {form.highlights.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={h}
                        onChange={(e) => setListItem("highlights", i, e.target.value)}
                        placeholder={`Highlight ${i + 1}`}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem("highlights", i)}
                        className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addListItem("highlights")}
                    className="text-xs font-semibold text-kokan-green flex items-center gap-1 hover:underline"
                  >
                    <Plus size={12} /> Add highlight
                  </button>
                </div>
              </div>

              {/* Things to bring */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Things to Bring</label>
                <div className="space-y-2">
                  {form.thingsToBring.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={item}
                        onChange={(e) => setListItem("thingsToBring", i, e.target.value)}
                        placeholder={`Item ${i + 1}`}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem("thingsToBring", i)}
                        className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addListItem("thingsToBring")}
                    className="text-xs font-semibold text-kokan-green flex items-center gap-1 hover:underline"
                  >
                    <Plus size={12} /> Add item
                  </button>
                </div>
              </div>
            </Section>

            {/* ── ITINERARY ── */}
            <Section title="Day-by-Day Itinerary" open={sections.itinerary} onToggle={() => toggleSection("itinerary")}>
              <div className="space-y-3">
                {form.itinerary.map((day, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-kokan-green">Day {day.day}</span>
                      {form.itinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDay(i)}
                          className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <input
                      value={day.title}
                      onChange={(e) => setItineraryField(i, "title", e.target.value)}
                      placeholder="Day title e.g. Arrival & Base Camp"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 bg-white"
                    />
                    <textarea
                      value={day.description}
                      onChange={(e) => setItineraryField(i, "description", e.target.value)}
                      rows={2}
                      placeholder="What happens on this day..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-kokan-green/30 bg-white"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDay}
                  className="text-xs font-semibold text-kokan-green flex items-center gap-1 hover:underline"
                >
                  <Plus size={12} /> Add day
                </button>
              </div>
            </Section>

            {/* ── IMAGES ── */}
            <Section title="Image URLs" open={sections.images} onToggle={() => toggleSection("images")}>
              <p className="text-xs text-gray-400">Paste direct image URLs (Unsplash, Firebase Storage, etc.). First image is the hero.</p>
              <div className="space-y-2 mt-2">
                {form.images.map((url, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={url}
                      onChange={(e) => setListItem("images", i, e.target.value)}
                      placeholder={i === 0 ? "Hero image URL *" : `Image ${i + 1} URL`}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                    />
                    {url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeListItem("images", i)}
                      className="p-2 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("images")}
                  className="text-xs font-semibold text-kokan-green flex items-center gap-1 hover:underline"
                >
                  <Plus size={12} /> Add image
                </button>
              </div>
            </Section>

            {/* Save / Cancel */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-kokan-green text-white rounded-xl font-bold text-sm hover:bg-kokan-green/90 disabled:opacity-60 transition-colors"
              >
                {saving
                  ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                  : <><Check size={15} /> {editingId ? "Save Changes" : "Create Trek"}</>}
              </button>
              <button
                onClick={closeForm}
                disabled={saving}
                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Trek list ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : treks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🥾</p>
          <p className="font-medium">No treks yet. Add the first one above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Treks</p>
          </div>
          <div className="divide-y divide-gray-100">
            {treks.map((trek) => (
              <div key={trek.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">

                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {trek.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={trek.images[0]} alt={trek.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🥾</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-kokan-earth text-sm truncate">{trek.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${diffColor[trek.difficulty] ?? "bg-gray-100 text-gray-600"}`}>
                      {trek.difficulty}
                    </span>
                    <span className="text-[11px] text-gray-400">{trek.region}</span>
                    <span className="text-[11px] text-gray-400">{trek.duration}</span>
                    <span className="text-[11px] font-semibold text-kokan-earth">₹{trek.price?.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Featured toggle */}
                  <button
                    onClick={() => toggleFeatured(trek)}
                    title={trek.featured ? "Remove from featured" : "Mark as featured"}
                    className={`p-2 rounded-lg transition-colors ${trek.featured ? "text-amber-500 bg-amber-50" : "text-gray-300 hover:text-amber-400"}`}
                  >
                    {trek.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEdit(trek)}
                    className="p-2 rounded-lg text-gray-400 hover:text-kokan-green hover:bg-kokan-green/5 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(trek.id, trek.name)}
                    className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}