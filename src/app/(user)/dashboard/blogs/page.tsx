"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Blog } from "@/types/blog";
import { PenSquare, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import Link from "next/link";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";

export default function UserBlogsPage() {
  const { profile } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.uid) return;
    fetch(`/api/blogs?authorId=${profile.uid}`)
      .then((r) => r.json())
      .then((data) => { setBlogs(data); setLoading(false); });
  }, [profile]);

  const statusConfig = {
    approved: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-kokan-green bg-kokan-green/10" },
    pending: { icon: <Clock className="w-3.5 h-3.5" />, color: "text-amber-600 bg-amber-50" },
    rejected: { icon: <XCircle className="w-3.5 h-3.5" />, color: "text-red-500 bg-red-50" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-kokan-earth">My Blogs</h1>
          <p className="text-kokan-earth/50 text-sm mt-1">{blogs.length} blogs written</p>
        </div>
        <Link
          href="/dashboard/blogs/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-kokan-green text-white rounded-xl text-sm font-semibold hover:bg-kokan-green/90 transition-colors"
        >
          <PenSquare className="w-4 h-4" /> Write New
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-kokan-sand/30" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-kokan-sand/30 text-center">
          <div className="text-4xl mb-3">📝</div>
          <p className="font-semibold text-kokan-earth mb-1">No blogs yet</p>
          <p className="text-sm text-kokan-earth/50 mb-4">Share your Kokan experiences with the world</p>
          <Link href="/dashboard/blogs/new" className="inline-flex items-center gap-2 px-4 py-2 bg-kokan-green text-white rounded-xl text-sm font-medium">
            <PenSquare className="w-4 h-4" /> Write your first blog
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => {
            const category = BLOG_CATEGORIES.find((c) => c.value === blog.category);
            const status = statusConfig[blog.status] ?? statusConfig.pending;
            return (
              <div key={blog.id} className="bg-white rounded-2xl p-5 border border-kokan-sand/30 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-kokan-earth truncate">{blog.title}</h3>
                  <p className="text-xs text-kokan-earth/50 mt-1 truncate">{blog.excerpt}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-kokan-earth/40">{category?.emoji} {category?.label}</span>
                    <span className="text-xs text-kokan-earth/40">{blog.readTime} min read</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}>
                    {status.icon} {blog.status}
                  </span>
                  {blog.approved && (
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="p-2 rounded-xl border border-kokan-sand/40 hover:bg-kokan-sand/10 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-kokan-earth/50" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}