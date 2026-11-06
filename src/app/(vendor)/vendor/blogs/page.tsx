"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  RefreshCw,
  ExternalLink,
  Clock,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function VendorBlogsPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    fetchBlogs();
  }, [user?.uid]);

  const fetchBlogs = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs?authorId=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch vendor blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="text-[#2ecc71]" size={24} />
            <span>My Travel Stories &amp; Guides</span>
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Publish stories about your local village, hidden beaches, and Konkan culture to attract travelers
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchBlogs}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            href="/vendor/blogs/new"
            className="px-4 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>Write New Story</span>
          </Link>
        </div>
      </div>

      {/* ── List ── */}
      {loading ? (
        <div className="py-20 text-center text-white/40 text-sm">
          Loading your travel articles…
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#141414] border border-white/5 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#2ecc71]/10 text-[#2ecc71] flex items-center justify-center mx-auto text-3xl">
            ✍️
          </div>
          <h3 className="text-base font-bold text-white">
            No Travel Stories Published Yet
          </h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Share local recommendations (e.g. &ldquo;Top 5 Hidden Beaches Near Malvan&rdquo;) to inspire tourists and feature your homestay.
          </p>
          <Link
            href="/vendor/blogs/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2ecc71] text-black font-bold text-xs rounded-xl hover:bg-[#27ae60] transition-colors"
          >
            <Plus size={15} /> Write Your First Story
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog) => {
            const isLive = blog.approved === true;
            return (
              <div
                key={blog.id}
                className="bg-[#141414] rounded-3xl overflow-hidden border border-white/5 hover:border-white/15 transition-all flex flex-col group shadow-lg"
              >
                <div className="relative h-44 w-full bg-black/40">
                  {blog.coverImage ? (
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      📖
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-md backdrop-blur-md ${
                        isLive
                          ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/40"
                          : "bg-amber-950/90 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      {isLive ? "🟢 Published" : "🟡 Under Review"}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-white tracking-tight line-clamp-2">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-xs text-white/50 line-clamp-2 mt-1 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-white/40">
                      {blog.category || "Konkan Travel"}
                    </span>
                    {blog.slug && isLive && (
                      <Link
                        href={`/blogs/${blog.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#2ecc71]/20 text-[#2ecc71] text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Eye size={13} />
                        <span>Read</span>
                        <ExternalLink size={11} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
