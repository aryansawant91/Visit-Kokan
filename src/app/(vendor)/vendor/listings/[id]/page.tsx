"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  ExternalLink,
  Plus,
  X,
  Eye,
} from "lucide-react";
import { LISTING_CATEGORIES, LISTING_REGIONS, PRICE_UNITS } from "@/constants/listingConstants";

export default function VendorListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [listing, setListing] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "homestay",
    region: "Ratnagiri",
    address: "",
    price: "",
    priceUnit: "per night",
    phone: "",
    website: "",
    amenities: [] as string[],
  });

  const [newAmenity, setNewAmenity] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "listings", id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setListing({ id: snap.id, ...data });
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          category: data.category ?? "homestay",
          region: data.region ?? "Ratnagiri",
          address: data.address ?? "",
          price: data.price ? String(data.price) : "",
          priceUnit: data.priceUnit ?? "per night",
          phone: data.phone ?? "",
          website: data.website ?? "",
          amenities: Array.isArray(data.amenities) ? data.amenities : [],
        });
      } else {
        setError("Listing not found.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to load listing details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const docRef = doc(db, "listings", id as string);
      await updateDoc(docRef, {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        region: form.region,
        address: form.address.trim(),
        price: form.price ? Number(form.price) : null,
        priceUnit: form.priceUnit,
        phone: form.phone.trim(),
        website: form.website.trim(),
        amenities: form.amenities,
        updatedAt: serverTimestamp(),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addAmenity = () => {
    const val = newAmenity.trim();
    if (!val || form.amenities.includes(val)) return;
    setForm((prev) => ({ ...prev, amenities: [...prev.amenities, val] }));
    setNewAmenity("");
  };

  const removeAmenity = (index: number) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-white/40 text-sm">
        Loading property details…
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-white/60 text-sm">{error || "Property not found."}</p>
        <Link
          href="/vendor/listings"
          className="text-[#2ecc71] hover:underline text-xs font-bold"
        >
          ← Return to My Listings
        </Link>
      </div>
    );
  }

  const isLive = listing.approved || listing.status === "approved";

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/vendor/listings"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{listing.name}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isLive
                    ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-950 text-amber-300 border-amber-500/40"
                }`}
              >
                {isLive ? "🟢 Live" : "🟡 Under Review"}
              </span>
            </h1>
            <p className="text-xs text-white/40">
              Edit property rates, description, and contact info
            </p>
          </div>
        </div>

        {listing.slug && isLive && (
          <Link
            href={`/listings/${listing.slug}`}
            target="_blank"
            className="px-3.5 py-2 bg-white/5 hover:bg-[#2ecc71]/20 text-[#2ecc71] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Eye size={14} />
            <span>View on Site</span>
            <ExternalLink size={12} />
          </Link>
        )}
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>Listing successfully updated!</span>
        </div>
      )}

      {/* ── Photo Gallery Preview ── */}
      {listing.images && listing.images.length > 0 && (
        <div className="bg-[#141414] p-4 rounded-3xl border border-white/5 space-y-2">
          <p className="text-xs font-medium text-white/50">Current Photos</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {listing.images.map((img: string, i: number) => (
              <div
                key={i}
                className="relative w-32 h-24 rounded-2xl overflow-hidden shrink-0 bg-black/40 border border-white/10"
              >
                <Image src={img} alt="Property" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Edit Form ── */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#141414] rounded-3xl p-6 sm:p-7 border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3">
            Property Details &amp; Pricing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Property Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                >
                  {LISTING_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Region
                </label>
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                >
                  {LISTING_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Price (₹)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 2500"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Price Unit
              </label>
              <select
                value={form.priceUnit}
                onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              >
                {PRICE_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Contact Phone for Bookings
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Address / Location
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Property Description &amp; House Rules
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">
              Amenities &amp; Features
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.amenities.map((am, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white/10 text-xs text-white flex items-center gap-1.5"
                >
                  <span>{am}</span>
                  <button
                    type="button"
                    onClick={() => removeAmenity(i)}
                    className="hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add feature e.g. Free Breakfast, Beach Access"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ecc71]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/vendor/listings"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white/60 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
