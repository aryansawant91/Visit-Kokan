"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  DESTINATION_CATEGORIES,
  DESTINATION_REGIONS,
  BEST_SEASONS,
} from "@/constants/destinationConstants";
import { Upload, X, Plus, MapPin } from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase";

export default function AdminNewDestinationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [highlight, setHighlight] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "beach",
    region: "Ratnagiri",
    bestSeason: "October to March",
    howToReach: "",
    highlights: [] as string[],
  });

  const set = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addHighlight = () => {
    const trimmed = highlight.trim();
    if (!trimmed || form.highlights.includes(trimmed)) return;
    set("highlights", [...form.highlights, trimmed]);
    setHighlight("");
  };

  const removeHighlight = (i: number) =>
    set("highlights", form.highlights.filter((_, idx) => idx !== i));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...files].slice(0, 6));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImagePreviews((prev) =>
          [...prev, ev.target?.result as string].slice(0, 6)
        );
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.name || !form.description || !form.howToReach) {
      alert("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const storage = getStorage(app);
      const imageUrls: string[] = [];

      for (const file of imageFiles) {
        const storageRef = ref(
          storage,
          `destinations/${Date.now()}_${file.name}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      const slug =
        form.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") +
        "-" +
        Date.now();

      await fetch("/api/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          images: imageUrls,
          slug,
          addedBy: user.uid,
        }),
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setForm({
      name: "",
      description: "",
      category: "beach",
      region: "Ratnagiri",
      bestSeason: "October to March",
      howToReach: "",
      highlights: [],
    });
    setImageFiles([]);
    setImagePreviews([]);
    setHighlight("");
  };

  if (success) {
    return (
      <div className="min-h-screen bg-kokan-cream/30 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md shadow-sm border border-kokan-sand/30">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold text-kokan-earth font-playfair mb-2">
            Destination Added!
          </h2>
          <p className="text-kokan-earth/60 text-sm mb-6">
            The destination is now live and visible to all users.
          </p>
          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 border border-kokan-sand rounded-xl py-2 text-sm text-kokan-earth hover:bg-kokan-sand/10"
            >
              Add Another
            </button>
            <button
              onClick={() => router.push("/admin/destinations")}
              className="flex-1 bg-kokan-green text-white rounded-xl py-2 text-sm hover:bg-kokan-green/90"
            >
              All Destinations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kokan-cream/30">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-kokan-earth font-playfair">
            Add Destination
          </h1>
          <span className="flex items-center gap-1 bg-kokan-green/10 text-kokan-green text-xs font-medium px-2.5 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5" />
            Goes Live Immediately
          </span>
        </div>
        <p className="text-kokan-earth/50 text-sm mb-8">
          Destinations added by admin are published instantly.
        </p>

        <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">
              Destination Name <span className="text-red-400">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Tarkarli Beach"
              className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the destination — what makes it special, what to expect..."
              rows={4}
              className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 resize-none"
            />
          </div>

          {/* Category + Region */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              >
                {DESTINATION_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">
                Region
              </label>
              <select
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              >
                {DESTINATION_REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Best Season */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">
              Best Season to Visit
            </label>
            <select
              value={form.bestSeason}
              onChange={(e) => set("bestSeason", e.target.value)}
              className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
            >
              {BEST_SEASONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* How to Reach */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">
              How to Reach <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.howToReach}
              onChange={(e) => set("howToReach", e.target.value)}
              placeholder="e.g. Nearest railway station is Kudal. From there take a local bus or auto to Tarkarli (25 km)."
              rows={3}
              className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 resize-none"
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">
              Highlights
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                placeholder="e.g. Snorkeling, Sunset views..."
                className="flex-1 border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
              <button
                onClick={addHighlight}
                type="button"
                className="px-4 py-2.5 bg-kokan-green/10 text-kokan-green rounded-xl text-sm font-medium hover:bg-kokan-green/20 transition-colors"
              >
                Add
              </button>
            </div>
            {form.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 bg-kokan-sand/30 text-kokan-earth text-xs px-3 py-1.5 rounded-full"
                  >
                    {h}
                    <button onClick={() => removeHighlight(i)}>
                      <X className="w-3 h-3 text-kokan-earth/50 hover:text-red-400" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">
              Photos (max 6)
            </label>
            <div className="flex gap-3 flex-wrap">
              {imagePreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-kokan-sand"
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 6 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-kokan-sand flex flex-col items-center justify-center cursor-pointer hover:border-kokan-green transition-colors">
                  <Plus className="w-5 h-5 text-kokan-earth/40" />
                  <span className="text-xs text-kokan-earth/40 mt-1">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImages}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-kokan-green text-white py-3 rounded-xl font-semibold hover:bg-kokan-green/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading & Publishing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Publish Destination
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}