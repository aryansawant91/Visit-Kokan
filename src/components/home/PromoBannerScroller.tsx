"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flame, Calendar } from "lucide-react";
import { Banner } from "@/types/banner";
import { FALLBACK_DESTINATION_IMAGE } from "@/lib/imageUtils";
import { trackGAEvent } from "@/lib/analytics";

export default function PromoBannerScroller() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
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
        <div className="h-40 sm:h-52 rounded-2xl bg-kokan-sand/20 animate-pulse" />
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
        {banners.map((banner) => {
          const imgSrc = failedImages[banner.id]
            ? FALLBACK_DESTINATION_IMAGE
            : banner.imageUrl || FALLBACK_DESTINATION_IMAGE;
          const isExternal = Boolean(banner.ctaLink?.startsWith("http"));

          const handleCtaClick = () => {
            trackGAEvent("banner_cta_click", {
              item_name: banner.title,
              batch_key: banner.batchKey || "promo",
              cta_link: banner.ctaLink || "",
            });
            if (banner.ctaLink?.includes("wa.me")) {
              trackGAEvent("whatsapp_enquiry_click", {
                source: "home_banner",
                item_name: banner.title,
              });
            }
          };

          return (
            <div
              key={banner.id}
              data-banner-card
              className="relative flex-shrink-0 w-full sm:w-[88%] lg:w-[92%] min-h-[175px] sm:min-h-[220px] rounded-3xl overflow-hidden snap-start bg-[#113822] shadow-lg border border-emerald-900/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt={banner.title}
                onError={() =>
                  setFailedImages((prev) => ({ ...prev, [banner.id]: true }))
                }
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

              <div className="relative h-full flex flex-col justify-center px-5 py-5 sm:px-10 sm:py-6">
                <div className="max-w-2xl space-y-2">
                  {/* Top Badges: Upcoming Batch + Seats Left */}
                  {(banner.badgeText || (banner.seatsLeft !== undefined && banner.seatsLeft > 0)) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {banner.badgeText && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-300/40 text-[#b8dc26] text-[10px] sm:text-[11px] font-black uppercase tracking-wider backdrop-blur-xs">
                          <Calendar size={11} />
                          <span>{banner.badgeText}</span>
                        </span>
                      )}
                      {banner.seatsLeft !== undefined && banner.seatsLeft > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/90 text-[#142607] text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
                          <Flame size={11} className="fill-current" />
                          <span>Only {banner.seatsLeft} Seats Left</span>
                        </span>
                      )}
                    </div>
                  )}

                  <h2 className="text-white font-display font-black text-xl sm:text-3xl leading-tight drop-shadow-sm">
                    {banner.title}
                  </h2>

                  {banner.subtitle && (
                    <p className="text-white/85 text-xs sm:text-sm leading-snug line-clamp-2">
                      {banner.subtitle}
                    </p>
                  )}

                  {banner.ctaText && banner.ctaLink && (
                    <div className="pt-1">
                      {isExternal ? (
                        <a
                          href={banner.ctaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleCtaClick}
                          className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-[#b8dc26] hover:bg-[#c8eb34] text-[#113822] text-xs sm:text-sm font-black rounded-full shadow-md transition-all active:scale-95"
                        >
                          <span>{banner.ctaText}</span>
                          <span>→</span>
                        </a>
                      ) : (
                        <Link
                          href={banner.ctaLink}
                          onClick={handleCtaClick}
                          className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-[#b8dc26] hover:bg-[#c8eb34] text-[#113822] text-xs sm:text-sm font-black rounded-full shadow-md transition-all active:scale-95"
                        >
                          <span>{banner.ctaText}</span>
                          <span>→</span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous banner"
            className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 shadow-lg rounded-full items-center justify-center hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} className="text-kokan-earth" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next banner"
            className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 shadow-lg rounded-full items-center justify-center hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronRight size={18} className="text-kokan-earth" />
          </button>
        </>
      )}
    </div>
  );
}
