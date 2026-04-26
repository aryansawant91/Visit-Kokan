import { Blog } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/constants/blogCategories";
import { Clock, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BlogCard({ blog }: { blog: Blog }) {
  const category = BLOG_CATEGORIES.find((c) => c.value === blog.category);

  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="group bg-white rounded-2xl overflow-hidden border border-kokan-sand/30 hover:shadow-md hover:border-kokan-green/20 transition-all duration-300">
        {/* Cover image */}
        <div className="relative h-48 bg-kokan-sand/20 overflow-hidden">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              {category?.emoji ?? "📝"}
            </div>
          )}
          <span className="absolute top-3 left-3 bg-white/90 text-kokan-earth text-xs font-medium px-2.5 py-1 rounded-full">
            {category?.emoji} {category?.label}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-playfair font-bold text-kokan-earth text-lg leading-snug line-clamp-2 group-hover:text-kokan-green transition-colors">
            {blog.title}
          </h3>
          <p className="text-kokan-earth/50 text-sm mt-2 line-clamp-2 leading-relaxed">
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-kokan-sand/30">
            <div className="flex items-center gap-3 text-xs text-kokan-earth/40">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {blog.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {blog.views}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-kokan-green/10 flex items-center justify-center text-xs font-bold text-kokan-green">
                {blog.authorName?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs text-kokan-earth/50">{blog.authorName}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}