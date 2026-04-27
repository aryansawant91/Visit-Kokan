"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LISTING_CATEGORIES, LISTING_REGIONS, PRICE_UNITS } from "@/constants/listingConstants";
import { Upload, X, Plus } from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase";

const AMENITY_SUGGESTIONS = [
  "WiFi", "Parking", "AC", "Hot Water", "Kitchen", "Sea View",
  "Breakfast Included", "Pool", "Pet Friendly", "Wheelchair Accessible",
];

export default function VendorNewListingPage() {
  const { user } = useAuth();
  const router   = useRouter();
  const [submitting, setSubmitting]     = useState(false);
  const [imageFiles, setImageFiles]     = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [success, setSuccess]           = useState(false);
  const [amenity, setAmenity]           = useState("");

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

  const set = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addAmenity = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed || form.amenities.includes(trimmed)) return;
    set("amenities", [...form.amenities, trimmed]);
    setAmenity("");
  };

  const removeAmenity = (i: number) =>
    set("amenities", form.amenities.filter((_, idx) => idx !== i));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...files].slice(0, 5));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImagePreviews((prev) => [...prev, ev.target?.result as string].slice(0, 5));
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.name || !form.description || !form.address) {
      alert("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const storage   = getStorage(app);
      const imageUrls: string[] = [];

      for (const file of imageFiles) {
        const storageRef = ref(storage, `listings/vendor/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      const slug =
        form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") +
        "-" + Date.now();

      await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? Number(form.price) : null,
          images: imageUrls,
          slug,
          vendorId: user.uid,
          vendorName: user.displayName ?? "Vendor",
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

  if (success) {
    return (
      <div className="min-h-screen bg-kokan-cream/30 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md shadow-sm border border-kokan-sand/30">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-kokan-earth font-playfair mb-2">Listing Submitted!</h2>
          <p className="text-kokan-earth/60 text-sm mb-6">
            Your listing is under review. Admin will approve it shortly.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setSuccess(false); setForm({ name: "", description: "", category: "homestay", region: "Ratnagiri", address: "", price: "", priceUnit: "per night", phone: "", website: "", amenities: [] }); setImageFiles([]); setImagePreviews([]); }}
              className="flex-1 border border-kokan-sand rounded-xl py-2 text-sm text-kokan-earth hover:bg-kokan-sand/10"
            >
              Add Another
            </button>
            <button
              onClick={() => router.push("/vendor/listings")}
              className="flex-1 bg-kokan-green text-white rounded-xl py-2 text-sm hover:bg-kokan-green/90"
            >
              My Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kokan-cream/30">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-kokan-earth font-playfair mb-2">Submit a Listing</h1>
        <p className="text-kokan-earth/50 text-sm mb-8">Fill in your business details. Admin will review and approve.</p>

        <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Business Name <span className="text-red-400">*</span></label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Sunset Homestay" className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30" />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Description <span className="text-red-400">*</span></label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe your business..." rows={4} className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 resize-none" />
          </div>

          {/* Category + Region */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30">
                {LISTING_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Region</label>
              <select value={form.region} onChange={(e) => set("region", e.target.value)} className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30">
                {LISTING_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Address <span className="text-red-400">*</span></label>
            <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Full address including landmark" className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30" />
          </div>

          {/* Price + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="Leave blank if on request" className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Price Unit</label>
              <select value={form.priceUnit} onChange={(e) => set("priceUnit", e.target.value)} className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30">
                {PRICE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Phone + Website */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Phone</label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Website</label>
              <input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://..." className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30" />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Amenities</label>
            <div className="flex gap-2 mb-2">
              <input
                value={amenity}
                onChange={(e) => setAmenity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity(amenity))}
                placeholder="Type an amenity..."
                className="flex-1 border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
              <button onClick={() => addAmenity(amenity)} type="button" className="px-4 py-2.5 bg-kokan-green/10 text-kokan-green rounded-xl text-sm font-medium hover:bg-kokan-green/20">
                Add
              </button>
            </div>
            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {AMENITY_SUGGESTIONS.filter((a) => !form.amenities.includes(a)).map((a) => (
                <button key={a} onClick={() => addAmenity(a)} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-kokan-green/10 hover:text-kokan-green transition-colors">
                  + {a}
                </button>
              ))}
            </div>
            {form.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.amenities.map((a, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-kokan-sand/20 text-kokan-earth text-xs px-3 py-1.5 rounded-full">
                    {a}
                    <button onClick={() => removeAmenity(i)}><X className="w-3 h-3 hover:text-red-400" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Photos (max 5)</label>
            <div className="flex gap-3 flex-wrap">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-kokan-sand">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-kokan-sand flex flex-col items-center justify-center cursor-pointer hover:border-kokan-green transition-colors">
                  <Plus className="w-5 h-5 text-kokan-earth/40" />
                  <span className="text-xs text-kokan-earth/40 mt-1">Add</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
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
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
            ) : (
              <><Upload className="w-4 h-4" /> Submit for Review</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}