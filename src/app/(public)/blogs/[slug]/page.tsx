"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Blog } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";
import {
  Clock, Eye, ArrowLeft, Share2, Twitter,
  Facebook, Link2, BookOpen
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/blogs?slug=${slug}`)
      .then((r) => r.json())
      .then(async (data) => {
        if (!data || data.error) {
          setBlog(null);
          setLoading(false);
          return;
        }
        setBlog(data);
        setLoading(false);
        if (data?.category) {
          const rel = await fetch(`/api/blogs?category=${data.category}`)
            .then((r) => r.json());
          const relList = Array.isArray(rel) ? rel : [];
          setRelated(relList.filter((b: Blog) => b.slug !== slug).slice(0, 3));
        }
      })
      .catch(() => {
        setBlog(null);
        setLoading(false);
      });
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const category = BLOG_CATEGORIES.find((c) => c.value === blog?.category);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kokan-cream/20">
        <div className="w-10 h-10 border-4 border-kokan-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-kokan-earth/60">Blog not found</p>
        <Link href="/blogs" className="text-kokan-green underline text-sm">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kokan-cream/20">
      <div className="bg-white border-b border-kokan-sand/40 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-kokan-earth/60 hover:text-kokan-earth transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog.title}`)}
              className="p-2 rounded-lg hover:bg-kokan-sand/20 text-kokan-earth/40 hover:text-kokan-earth transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)}
              className="p-2 rounded-lg hover:bg-kokan-sand/20 text-kokan-earth/40 hover:text-kokan-earth transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-kokan-sand text-xs text-kokan-earth/60 hover:bg-kokan-sand/10 transition-colors"
            >
              <Link2 className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-kokan-green/10 text-kokan-green text-xs font-medium px-3 py-1 rounded-full">
            {category?.emoji} {category?.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-kokan-earth/40">
            <Clock className="w-3.5 h-3.5" /> {blog.readTime} min read
          </span>
          <span className="flex items-center gap-1 text-xs text-kokan-earth/40">
            <Eye className="w-3.5 h-3.5" /> {blog.views} views
          </span>
        </div>

        <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-kokan-earth leading-tight mb-4">
          {blog.title}
        </h1>

        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-kokan-sand/40">
          <div className="w-10 h-10 rounded-full bg-kokan-green/10 flex items-center justify-center text-kokan-green font-bold">
            {blog.authorName?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-kokan-earth">{blog.authorName}</p>
            <p className="text-xs text-kokan-earth/40 capitalize">{blog.authorRole} · {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>

        {blog.coverImage && (
          <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        <p className="text-lg text-kokan-earth/70 leading-relaxed mb-6 font-medium border-l-4 border-kokan-green pl-4">
          {blog.excerpt}
        </p>

        <div className="prose prose-sm max-w-none text-kokan-earth/80 leading-relaxed space-y-4">
          {blog.content.split("\n").map((para, i) =>
            para.trim() ? (
              <p key={i} className="text-base leading-relaxed">{para}</p>
            ) : (
              <br key={i} />
            )
          )}
        </div>

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-kokan-sand/40">
            {blog.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-kokan-sand/20 text-kokan-earth/60 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 p-6 bg-kokan-green/5 border border-kokan-green/20 rounded-2xl text-center">
          <Share2 className="w-6 h-6 text-kokan-green mx-auto mb-2" />
          <p className="font-semibold text-kokan-earth mb-1">Enjoyed this story?</p>
          <p className="text-sm text-kokan-earth/50 mb-4">Share it with fellow Kokan lovers</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog.title}`)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-xl text-sm font-medium hover:bg-[#1DA1F2]/20 transition-colors"
            >
              <Twitter className="w-4 h-4" /> Twitter
            </button>
            <button
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1877F2]/10 text-[#1877F2] rounded-xl text-sm font-medium hover:bg-[#1877F2]/20 transition-colors"
            >
              <Facebook className="w-4 h-4" /> Facebook
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 bg-kokan-sand/20 text-kokan-earth rounded-xl text-sm font-medium hover:bg-kokan-sand/30 transition-colors"
            >
              <Link2 className="w-4 h-4" /> {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-kokan-green" />
            <h2 className="font-playfair text-xl font-bold text-kokan-earth">Related Stories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}