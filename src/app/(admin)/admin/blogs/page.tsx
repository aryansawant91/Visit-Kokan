"use client";

import { useEffect, useState } from "react";
import { Blog } from "@/types/blog";
import { Check, X, Eye, Trash2, Clock } from "lucide-react";
import Link from "next/link";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";

type Tab = "pending" | "approved" | "rejected";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/blogs");
    const data = await res.json();
    setBlogs(data);
    setLoading(false);
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    await fetch("/api/admin/blogs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    await fetchBlogs();
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog permanently?")) return;
    setActionLoading(id);
    await fetch("/api/admin/blogs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchBlogs();
    setActionLoading(null);
  };

  const filtered = blogs.filter((b) => b.status === tab);
  const counts = {
    pending: blogs.filter((b) => b.status === "pending").length,
    approved: blogs.filter((b) => b.status === "approved").length,
    rejected: blogs.filter((b) => b.status === "rejected").length,
  };

  const TABS: { key: Tab; label: string; color: string }[] = [
    { key: "pending", label: "Pending", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
    { key: "approved", label: "Approved", color: "text-green-600 bg-green-50 border-green-200" },
    { key: "rejected", label: "Rejected", color: "text-red-500 bg-red-50 border-red-200" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-xl font-semibold">Blog Approvals</h1>
        <p className="text-white/30 text-sm mt-0.5">Review and publish user blog submissions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              tab === t.key ? t.color : "bg-white/5 text-white/40 border-white/10"
            }`}
          >
            {t.label}
            <span className="ml-2 bg-black/10 px-1.5 py-0.5 rounded-full text-xs">
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#141414] border border-white/5 rounded-xl p-12 text-center">
          <Clock className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/25 text-sm">No {tab} blogs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((blog) => {
            const category = BLOG_CATEGORIES.find((c) => c.value === blog.category);
            return (
              <div key={blog.id} className="bg-[#141414] border border-white/5 rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white/80 font-medium truncate">{blog.title}</h3>
                  <p className="text-white/35 text-xs mt-0.5 truncate">{blog.excerpt}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-white/25 text-xs">{category?.emoji} {category?.label}</span>
                    <span className="text-white/25 text-xs">{blog.readTime} min</span>
                    <span className="text-white/25 text-xs">by {blog.authorName}</span>
                    <span className="text-xs capitalize bg-white/5 text-white/30 px-2 py-0.5 rounded-full">{blog.authorRole}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {blog.approved && (
                    <Link
                      href={`/blogs/${blog.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-white/40" />
                    </Link>
                  )}

                  {tab === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(blog.id, "reject")}
                        disabled={actionLoading === blog.id}
                        className="p-2 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                      <button
                        onClick={() => handleAction(blog.id, "approve")}
                        disabled={actionLoading === blog.id}
                        className="p-2 rounded-xl border border-[#2ecc71]/20 hover:bg-[#2ecc71]/10 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === blog.id
                          ? <div className="w-4 h-4 border-2 border-[#2ecc71] border-t-transparent rounded-full animate-spin" />
                          : <Check className="w-4 h-4 text-[#2ecc71]" />}
                      </button>
                    </>
                  )}

                  {tab === "approved" && (
                    <button
                      onClick={() => handleAction(blog.id, "reject")}
                      disabled={actionLoading === blog.id}
                      className="px-3 py-1.5 text-xs border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors"
                    >
                      Unpublish
                    </button>
                  )}

                  {tab === "rejected" && (
                    <button
                      onClick={() => handleAction(blog.id, "approve")}
                      disabled={actionLoading === blog.id}
                      className="px-3 py-1.5 text-xs border border-[#2ecc71]/20 hover:bg-[#2ecc71]/10 text-[#2ecc71] rounded-xl transition-colors"
                    >
                      Approve
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(blog.id)}
                    disabled={actionLoading === blog.id}
                    className="p-2 rounded-xl border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-white/30 hover:text-red-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}