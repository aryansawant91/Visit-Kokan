"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PRODUCT_CATEGORIES, PRODUCT_REGIONS } from "@/constants/productCategories";
import { Upload, X, Plus, ShieldCheck } from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase";

export default function AdminNewProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "fruits",
    price: "",
    unit: "per kg",
    region: "Ratnagiri",
    stock: "",
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...files].slice(0, 4));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImagePreviews((prev) =>
          [...prev, ev.target?.result as string].slice(0, 4)
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
    if (!form.name || !form.price || !form.description) {
      alert("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const storage = getStorage(app);
      const imageUrls: string[] = [];

      for (const file of imageFiles) {
        // admin/ subfolder keeps admin uploads separate from vendor uploads
        const storageRef = ref(storage, `products/admin/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      const slug =
        form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") +
        "-" +
        Date.now();

      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          images: imageUrls,
          slug,
          vendorId: null,
          vendorName: "Visit Kokan Team",   // shown as seller name on product page
          addedBy: user.uid,                // admin's uid for audit trail
          isAdmin: true,                    // tells API to auto-approve
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
      category: "fruits",
      price: "",
      unit: "per kg",
      region: "Ratnagiri",
      stock: "",
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-kokan-cream/30 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md shadow-sm border border-kokan-sand/30">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-kokan-earth font-playfair mb-2">
            Product is Live!
          </h2>
          <p className="text-kokan-earth/60 text-sm mb-6">
            The product has been added and is immediately visible to all users on the products page.
          </p>
          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 border border-kokan-sand rounded-xl py-2 text-sm text-kokan-earth hover:bg-kokan-sand/10"
            >
              Add Another
            </button>
            <button
              onClick={() => router.push("/admin/products")}
              className="flex-1 bg-kokan-green text-white rounded-xl py-2 text-sm hover:bg-kokan-green/90"
            >
              All Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kokan-cream/30">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-kokan-earth font-playfair">
            Add Product
          </h1>
          <span className="flex items-center gap-1 bg-kokan-green/10 text-kokan-green text-xs font-medium px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin — Auto Approved
          </span>
        </div>
        <p className="text-kokan-earth/50 text-sm mb-8">
          Products added by admin go live immediately without review.
        </p>

        <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Alphonso Mango Box"
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
              placeholder="Describe the product — origin, quality, packaging, etc."
              rows={4}
              className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 resize-none"
            />
          </div>

          {/* Category + Region */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Region</label>
              <select
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              >
                {PRODUCT_REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price + Unit + Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">
                Price (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="500"
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              >
                {["per kg", "per box", "per dozen", "per piece", "per night", "per person"].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-kokan-earth mb-1.5 block">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="50"
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-medium text-kokan-earth mb-1.5 block">
              Product Images (max 4)
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
              {imagePreviews.length < 4 && (
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
                <ShieldCheck className="w-4 h-4" />
                Publish Product
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}