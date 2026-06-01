"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PRODUCT_CATEGORIES, PRODUCT_REGIONS } from "@/constants/productCategories";
import {
  ArrowLeft, Check, ChevronDown, ChevronUp,
  Loader2, Plus, ShieldCheck, X,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProductForm {
  name:           string;
  slug:           string;
  description:    string;
  category:       string;
  region:         string;
  price:          string;
  unit:           string;
  stock:          string;
  discount:       string;
  features:       string[];
  specifications: string[];
  images:         string[];
}

const UNITS = ["per kg", "per box", "per dozen", "per piece", "per bottle", "per night", "per person"];

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
        {open
          ? <ChevronUp size={16} className="text-gray-400" />
          : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="px-4 py-4 space-y-3">{children}</div>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminProductEditPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errors, setErrors]     = useState<string[]>([]);

  const [form, setForm] = useState<ProductForm>({
    name: "", slug: "", description: "", category: "fruits",
    region: "Ratnagiri", price: "", unit: "per kg",
    stock: "", discount: "", features: [""], specifications: [""], images: [""],
  });

  const [sections, setSections] = useState({
    basic: true, pricing: true, images: true, details: false,
  });
  const toggle = (k: keyof typeof sections) =>
    setSections((s) => ({ ...s, [k]: !s[k] }));

  // ── Fetch existing product ─────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/admin?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data || data.error) { setNotFound(true); setLoading(false); return; }
        setForm({
          name:           data.name           ?? "",
          slug:           data.slug           ?? "",
          description:    data.description    ?? "",
          category:       data.category       ?? "fruits",
          region:         data.region         ?? "Ratnagiri",
          price:          String(data.price   ?? ""),
          unit:           data.unit           ?? "per kg",
          stock:          String(data.stock   ?? ""),
          discount:       String(data.discount ?? ""),
          features:       data.features?.length       ? data.features       : [""],
          specifications: data.specifications?.length ? data.specifications : [""],
          images:         data.images?.length          ? data.images          : [""],
        });
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  // ── Field helpers ──────────────────────────────────────────────────────────
  const setField = (k: keyof ProductForm, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setListItem = (k: "features" | "specifications" | "images", i: number, v: string) =>
    setForm((f) => { const a = [...f[k]]; a[i] = v; return { ...f, [k]: a }; });

  const addListItem = (k: "features" | "specifications" | "images") =>
    setForm((f) => ({ ...f, [k]: [...f[k], ""] }));

  const removeListItem = (k: "features" | "specifications" | "images", i: number) =>
    setForm((f) => {
      const a = f[k].filter((_, idx) => idx !== i);
      return { ...f, [k]: a.length ? a : [""] };
    });

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs: string[] = [];
    if (!form.name.trim())                       errs.push("Product name is required");
    if (!form.description.trim())                errs.push("Description is required");
    if (!form.price || Number(form.price) <= 0)  errs.push("Valid price is required");
    if (!form.images.filter(Boolean).length)     errs.push("At least one image URL is required");
    setErrors(errs);
    return errs.length === 0;
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) {
      setSections((s) => ({ ...s, basic: true, pricing: true, images: true }));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/products/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name:           form.name.trim(),
          slug:           form.slug.trim(),
          description:    form.description.trim(),
          category:       form.category,
          region:         form.region,
          price:          Number(form.price),
          unit:           form.unit,
          stock:          Number(form.stock) || 0,
          discount:       Number(form.discount) || 0,
          features:       form.features.filter(Boolean),
          specifications: form.specifications.filter(Boolean),
          images:         form.images.filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      alert("Failed to save. Check console.");
    } finally {
      setSaving(false);
    }
  };

  // ── States ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-kokan-cream/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-kokan-green" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-kokan-cream/30 flex flex-col items-center justify-center gap-4">
        <p className="text-kokan-earth font-semibold">Product not found</p>
        <Link href="/admin/products" className="text-sm text-kokan-green hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-kokan-cream/30">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-kokan-earth">Edit Product</h1>
            <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">{id}</p>
          </div>
          <Link
            href={`/products/${form.slug}`}
            target="_blank"
            className="text-xs font-semibold text-kokan-green border border-kokan-green/30 px-3 py-1.5 rounded-lg hover:bg-kokan-green/5 transition-colors"
          >
            Preview →
          </Link>
        </div>

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

        {/* Saved toast */}
        {saved && (
          <div className="flex items-center gap-2 bg-kokan-green/10 border border-kokan-green/20 text-kokan-green text-sm font-semibold px-4 py-2.5 rounded-xl mb-4">
            <Check size={15} /> Changes saved successfully
          </div>
        )}

        <div className="space-y-3">

          {/* ── BASIC INFO ── */}
          <Section title="Basic Info" open={sections.basic} onToggle={() => toggle("basic")}>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Product Name *
              </label>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
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
          <Section title="Pricing & Stock" open={sections.pricing} onToggle={() => toggle("pricing")}>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Price (₹) *</label>
                <input
                  type="number" min="0"
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
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
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Discount (%)</label>
                <input
                  type="number" min="0" max="90"
                  value={form.discount}
                  onChange={(e) => setField("discount", e.target.value)}
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
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
          </Section>

          {/* ── IMAGES ── */}
          <Section title="Image URLs *" open={sections.images} onToggle={() => toggle("images")}>
            <p className="text-xs text-gray-400">First URL is the hero image shown on product cards.</p>
            <div className="space-y-2 mt-1">
              {form.images.map((url, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={url}
                    onChange={(e) => setListItem("images", i, e.target.value)}
                    placeholder={i === 0 ? "Hero image URL *" : `Image ${i + 1} URL`}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                  />
                  {/* Live preview */}
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
                <Plus size={12} /> Add image URL
              </button>
            </div>
          </Section>

          {/* ── DETAILS ── */}
          <Section title="Features & Specifications (optional)" open={sections.details} onToggle={() => toggle("details")}>

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
                    <button type="button" onClick={() => removeListItem("features", i)} className="p-2 text-gray-300 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addListItem("features")} className="text-xs font-semibold text-kokan-green flex items-center gap-1 hover:underline">
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
                      placeholder={`Spec ${i + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
                    />
                    <button type="button" onClick={() => removeListItem("specifications", i)} className="p-2 text-gray-300 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addListItem("specifications")} className="text-xs font-semibold text-kokan-green flex items-center gap-1 hover:underline">
                  <Plus size={12} /> Add spec
                </button>
              </div>
            </div>
          </Section>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-kokan-green text-white py-3.5 rounded-xl font-bold text-sm hover:bg-kokan-green/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {saving
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
              : <><Check size={15} /> Save Changes</>}
          </button>

        </div>
      </div>
    </div>
  );
}