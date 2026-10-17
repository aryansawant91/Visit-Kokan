"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@/types/banner";

export default function PromoBannerScroller() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => setBanners(Array.isArray(data) ? data : []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-banner-card]") as HTMLElement | null;
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 pt-4">
        <div className="h-36 sm:h-48 rounded-2xl bg-kokan-sand/20 animate-pulse" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-3 pt-4 relative">
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            data-banner-card
            className="relative flex-shrink-0 w-full sm:w-[85%] lg:w-[90%] h-36 sm:h-48 rounded-2xl overflow-hidden snap-start bg-kokan-earth"
          >
            {banner.imageUrl && (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="relative h-full flex items-center px-6 sm:px-10">
              <div className="min-w-0">
                <h2 className="text-white font-display font-bold text-xl sm:text-3xl leading-tight">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="text-white/80 text-xs sm:text-sm mt-1 hidden sm:block">
                    {banner.subtitle}
                  </p>
                )}
                {banner.ctaText && banner.ctaLink && (
                  <Link
                    href={banner.ctaLink}
                    className="inline-block mt-3 px-4 py-1.5 bg-kokan-green text-white text-xs sm:text-sm font-bold rounded-full hover:opacity-90 transition-opacity"
                  >
                    {banner.ctaText} →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={() => scrollByCard(-1)}
            className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-md rounded-full items-center justify-center hover:bg-kokan-cream transition-colors"
          >
            <ChevronLeft size={16} className="text-kokan-earth" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-md rounded-full items-center justify-center hover:bg-kokan-cream transition-colors"
          >
            <ChevronRight size={16} className="text-kokan-earth" />
          </button>
        </>
      )}
    </div>
  );
}