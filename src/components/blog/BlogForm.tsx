"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";
import { Send, Eye, X } from "lucide-react";

export default function BlogForm() {
  const { profile } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "travel-tips",
    tags: "",
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!profile) return;
    if (!form.title || !form.content || !form.excerpt) {
      alert("Please fill title, excerpt and content.");
      return;
    }

    setSubmitting(true);
    try {
      await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          authorId: profile.uid,
          authorName: profile.displayName,
          authorRole: profile.role,
        }),
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit blog. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-10 text-center border border-kokan-sand/30">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-playfair text-2xl font-bold text-kokan-earth mb-2">
          Blog Submitted!
        </h2>
        <p className="text-kokan-earth/50 text-sm mb-6">
          {profile?.role === "admin"
            ? "Your blog is now live on the blogs page."
            : "Your blog is under review. Admin will approve it shortly."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setSuccess(false); setForm({ title: "", excerpt: "", content: "", coverImage: "", category: "travel-tips", tags: "" }); }}
            className="px-5 py-2.5 border border-kokan-sand rounded-xl text-sm text-kokan-earth hover:bg-kokan-sand/10"
          >
            Write Another
          </button>
          <button
            onClick={() => router.push("/blogs")}
            className="px-5 py-2.5 bg-kokan-green text-white rounded-xl text-sm font-semibold hover:bg-kokan-green/90"
          >
            View Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-kokan-earth">Write a Blog</h1>
          <p className="text-kokan-earth/50 text-sm mt-1">
            {profile?.role === "admin" ? "Published immediately." : "Submitted for admin review."}
          </p>
        </div>
        <button
          onClick={() => setPreview(!preview)}
          className="flex items-center gap-2 px-4 py-2 border border-kokan-sand rounded-xl text-sm text-kokan-earth/60 hover:bg-kokan-sand/10 transition-colors"
        >
          {preview ? <><X className="w-4 h-4" /> Edit</> : <><Eye className="w-4 h-4" /> Preview</>}
        </button>
      </div>

      {preview ? (
        <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 space-y-4">
          <h2 className="font-playfair text-2xl font-bold text-kokan-earth">{form.title || "Your title here"}</h2>
          <p className="text-kokan-earth/70 border-l-4 border-kokan-green pl-4 italic">{form.excerpt || "Your excerpt here"}</p>
          {form.coverImage && (
            <img src={form.coverImage} alt="cover" className="w-full h-48 object-cover rounded-xl" />
          )}
          <div className="text-kokan-earth/80 whitespace-pre-wrap text-sm leading-relaxed">
            {form.content || "Your content here"}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-kokan-sand/30 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Title <span className="text-red-400">*</span></label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Hidden Beaches of Sindhudurg You Must Visit"
              className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Excerpt <span className="text-red-400">*</span></label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="A short summary of your blog (shown on cards)"
              rows={2}
              className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 resize-none"
            />
          </div>

          {/* Category + Cover image */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Cover Image URL</label>
              <input
                value={form.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="https://..."
                className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Content <span className="text-red-400">*</span></label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Write your blog content here... Use blank lines to separate paragraphs."
              rows={12}
              className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30 resize-none"
            />
            <p className="text-xs text-kokan-earth/30 mt-1">
              {form.content.split(" ").filter(Boolean).length} words · ~{Math.max(1, Math.ceil(form.content.split(" ").filter(Boolean).length / 200))} min read
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-kokan-earth/60 mb-1.5">Tags <span className="text-kokan-earth/30 font-normal">(comma separated)</span></label>
            <input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="beaches, travel, kokan, summer"
              className="w-full border border-kokan-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kokan-green/30"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-kokan-green text-white rounded-xl font-semibold text-sm hover:bg-kokan-green/90 transition-colors disabled:opacity-60"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Send className="w-4 h-4" /> {profile?.role === "admin" ? "Publish Blog" : "Submit for Review"}</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}