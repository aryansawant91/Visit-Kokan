"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PRODUCT_CATEGORIES, PRODUCT_REGIONS } from "@/constants/productCategories";
import { Plus, X, ShieldCheck, ChevronDown, ChevronUp, Check } from "lucide-react";

const toSlug = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
  "-" + Date.now();

export default function AdminNewProductPage() {
  const { user } = useAuth();
  const router   = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  // ── Sections ───────────────────────────────────────────────────────────────
  const [sections, setSections] = useState({
    basic: true, pricing: false, images: false, details: false,
  });
  const toggle = (k: keyof typeof sections) =>
    setSections((s) => ({ ...s, [k]: !s[k] }));

  // ── Form ───────────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name:        "",
    slug:        "",
    description: "",
    category:    "fruits",
    region:      "Ratnagiri",
    price:       "",
    unit:        "per kg",
    stock:       "",
    discount:    "",
    features:    [""],
    specifications: [""],
  });

  // Image URLs (array of strings, same as treks)
  const [imageUrls, setImageUrls] = useState<string[]>(["", "", "", ""]);

  const [errors, setErrors] = useState<string[]>([]);

  const setField = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setListItem = (k: "features" | "specifications", i: number, v: string) =>
    setForm((f) => { const a = [...f[k]]; a[i] = v; return { ...f, [k]: a }; });

  const addListItem = (k: "features" | "specifications") =>
    setForm((f) => ({ ...f, [k]: [...f[k], ""] }));

  const removeListItem = (k: "features" | "specifications", i: number) =>
    setForm((f) => {
      const a = f[k].filter((_, idx) => idx !== i);
      return { ...f, [k]: a.length ? a : [""] };
    });

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs: string[] = [];
    if (!form.name.trim())        errs.push("Product name is required");
    if (!form.description.trim()) errs.push("Description is required");
    if (!form.price || Number(form.price) <= 0) errs.push("Valid price is required");
    if (!imageUrls.filter(Boolean).length) errs.push("At least one image URL is required");
    setErrors(errs);
    return errs.length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!user) return;
    if (!validate()) {
      setSections((s) => ({ ...s, basic: true, pricing: true, images: true }));
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug:           form.slug.trim() || toSlug(form.name),
          price:          Number(form.price),
          stock:          Number(form.stock) || 0,
          discount:       Number(form.discount) || 0,
          images:         imageUrls.filter(Boolean),
          features:       form.features.filter(Boolean),
          specifications: form.specifications.filter(Boolean),
          vendorId:       null,
          vendorName:     "Visit Kokan Team",
          addedBy:        user.uid,
          isAdmin:        true,
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
      name: "", slug: "", description: "", category: "fruits",
      region: "Ratnagiri", price: "", unit: "per kg",
      stock: "", discount: "", features: [""], specifications: [""],
    });
    setImageUrls(["", "", "", ""]);
    setErrors([]);
    setSections({ basic: true, pricing: false, images: false, details: false });
  };

  // ── Section wrapper ────────────────────────────────────────────────────────
  function Section({
    id, title, open, children,
  }: { id: keyof typeof sections; title: string; open: boolean; children: React.ReactNode }) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggle(id)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        >
          <span className="font-semibold text-kokan-earth text-sm">{title}</span>
          {open
            ? <ChevronUp size={16} className="text-gray-400" />
            : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {open && <div className="px-4 py-4 space-y-3">{children}</div>}
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-kokan-cream/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md shadow-sm border border-kokan-sand/30">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-kokan-earth font-playfair mb-2">Product is Live!</h2>
          <p className="text-kokan-earth/60 text-sm mb-6">
            Added and immediately visible on the products page.
          </p>
          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 border border-kokan-sand rounded-xl py-2.5 text-sm text-kokan-earth hover:bg-kokan-sand/10"
            >
              Add Another
            </button>
            <button
              onClick={() => router.push("/admin/products")}
              className="flex-1 bg-kokan-green text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-kokan-green/90"
            >
              All Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-kokan-cream/30">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-kokan-earth font-playfair">Add Product</h1>
          <span className="flex items-center gap-1 bg-kokan-green/10 text-kokan-green text-xs font-medium px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin · Auto Approved
          </span>
        </div>
        <p className="text-kokan-earth/50 text-sm mb-6">
          Products added by admin go live immediately without review.
        </p>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 space-y-1">
            {errors.map((e, i) => (
              <p key={i} className="text-xs text-red-600 flex items-center gap-1.5">
                <span>•</span> {e}
              </p>
            ))}
          </div>
        )}

        <div className="space-y-3">

          {/* ── BASIC INFO ── */}
          <Section id="basic" title="Basic Info" open={sections.basic}>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Product Name *
              </label>
              <input
                value={form.name}
                onChange={(e) => {
                  setField("name", e.target.value);
                  if (!form.slug) setField("slug", toSlug(e.target.value));
                }}
                placeholder="Alphonso Mango Box"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Slug (auto-generated)
              </label>
              <input
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
                placeholder="alphonso-mango-box"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={3}
                placeholder="Describe the product — origin, quality, packaging..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Region</label>
                <select
                  value={form.region}
                  onChange={(e) => setField("region", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                >
                  {PRODUCT_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </Section>

          {/* ── PRICING ── */}
          <Section id="pricing" title="Pricing & Stock" open={sections.pricing}>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Price (₹) *</label>
                <input
                  type="number" min="0"
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                  placeholder="500"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Unit</label>
                <select
                  value={form.unit}
                  onChange={(e) => setField("unit", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                >
                  {["per kg", "per box", "per dozen", "per piece", "per bottle", "per night", "per person"].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Discount (%)</label>
                <input
                  type="number" min="0" max="90"
                  value={form.discount}
                  onChange={(e) => setField("discount", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Stock</label>
              <input
                type="number" min="0"
                value={form.stock}
                onChange={(e) => setField("stock", e.target.value)}
                placeholder="50"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
          </Section>

          {/* ── IMAGES ── */}
          <Section id="images" title="Image URLs *" open={sections.images}>
            <p className="text-xs text-gray-400">
              Paste direct image URLs (Unsplash, Firebase Storage, Cloudinary, etc.). First URL is the hero image.
            </p>
            <div className="space-y-2 mt-1">
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={url}
                    onChange={(e) => {
                      const next = [...imageUrls];
                      next[i] = e.target.value;
                      setImageUrls(next);
                    }}
                    placeholder={i === 0 ? "Hero image URL *" : `Image ${i + 1} URL (optional)`}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                  {/* Live preview thumbnail */}
                  {url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                      onLoad={(e)  => (e.currentTarget.style.display = "block")}
                    />
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* ── DETAILS (optional) ── */}
          <Section id="details" title="Features & Specifications (optional)" open={sections.details}>

            {/* Features */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Features</label>
              <div className="space-y-2">
                {form.features.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={f}
                      onChange={(e) => setListItem("features", i, e.target.value)}
                      placeholder={`Feature ${i + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem("features", i)}
                      className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("features")}
                  className="text-xs font-semibold text-kokan-green flex items-center gap-1 hover:underline"
                >
                  <Plus size={12} /> Add feature
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Specifications <span className="normal-case font-normal text-gray-300">(e.g. "Weight: 1kg")</span>
              </label>
              <div className="space-y-2">
                {form.specifications.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={s}
                      onChange={(e) => setListItem("specifications", i, e.target.value)}
                      placeholder={`Spec ${i + 1} e.g. Weight: 1kg`}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem("specifications", i)}
                      className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("specifications")}
                  className="text-xs font-semibold text-kokan-green flex items-center gap-1 hover:underline"
                >
                  <Plus size={12} /> Add spec
                </button>
              </div>
            </div>
          </Section>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-kokan-green text-white py-3.5 rounded-xl font-bold text-sm hover:bg-kokan-green/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publishing…</>
            ) : (
              <><ShieldCheck className="w-4 h-4" /> Publish Product</>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}