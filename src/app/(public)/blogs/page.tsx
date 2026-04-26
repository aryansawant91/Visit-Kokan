"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Blog } from "@/types/blog";
import BlogCard from "@/components/blog/BlogCard";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";
import { Search, PenSquare, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BlogsPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filtered, setFiltered] = useState<Blog[]>([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];  // ← guard
        setBlogs(list);
        setFiltered(list);
        setLoading(false);
      })
      .catch(() => {
        setBlogs([]);
        setFiltered([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...blogs];
    if (category) result = result.filter((b) => b.category === category);
    if (search) result = result.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [blogs, category, search]);

  return (
    <div className="min-h-screen bg-kokan-cream/20">
      <div className="bg-kokan-green/5 border-b border-kokan-sand/30 py-14">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-kokan-green/10 text-kokan-green px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" /> Kokan Stories
          </div>
          <h1 className="font-playfair text-4xl font-bold text-kokan-earth mb-3">
            Explore the Konkan Coast
          </h1>
          <p className="text-kokan-earth/50 max-w-xl mx-auto text-sm leading-relaxed mb-6">
            Travel guides, food stories, trek diaries and local life — written by travellers, vendors and explorers.
          </p>

          <div className="max-w-md mx-auto relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-kokan-earth/40" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-kokan-sand bg-white focus:outline-none focus:ring-2 focus:ring-kokan-green/30 text-sm"
            />
          </div>

          <Link
            href={user ? "/dashboard/blogs/new" : "/login"}
            className="inline-flex items-center gap-2 bg-kokan-green text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-kokan-green/90 transition-colors"
          >
            <PenSquare className="w-4 h-4" /> Write a Blog
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === ""
                ? "bg-kokan-green text-white"
                : "bg-white border border-kokan-sand/40 text-kokan-earth/60 hover:border-kokan-green/40"
            }`}
          >
            All
          </button>
          {BLOG_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(category === c.value ? "" : c.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === c.value
                  ? "bg-kokan-green text-white"
                  : "bg-white border border-kokan-sand/40 text-kokan-earth/60 hover:border-kokan-green/40"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-kokan-earth/50 font-medium">No blogs found</p>
            <p className="text-sm text-kokan-earth/30 mt-1">Be the first to write one!</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-kokan-earth/40 mb-5">{filtered.length} stories</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}