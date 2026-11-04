"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Star,
  Check,
  Heart,
  Package,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  images: string[];
  name: string;
  backHref?: string;
  fromPage?: string;
  category?: { emoji: string; label: string; value: string } | null;
  region: string;
  slug: string;
  rating?: number;
}

export default function ProductHeroCarousel({
  images,
  name,
  backHref = "/products",
  fromPage,
  category,
  region,
  slug,
  rating = 4.8,
}: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const fallbackImages = [
    "/images/banners/alphonso-mangoes.jpg",
    "/images/banners/kokum-sherbet.jpg",
    "/images/banners/konkan-cashews.jpg",
  ];
  const displayImages = images && images.length > 0 ? images : fallbackImages;

  // Restore wishlist state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`visitkokan_wishlist_${slug}`);
      if (saved === "true") setIsWishlist(true);
    } catch {}
  }, [slug]);

  const toggleWishlist = () => {
    const nextState = !isWishlist;
    setIsWishlist(nextState);
    try {
      localStorage.setItem(`visitkokan_wishlist_${slug}`, nextState ? "true" : "false");
    } catch {}

    if (nextState) {
      toast.success("Saved to your Wishlist! ❤️", {
        icon: "❤️",
        style: {
          borderRadius: "9999px",
          background: "#122617",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 600,
        },
      });
    } else {
      toast("Removed from Wishlist", {
        icon: "ℹ️",
        style: {
          borderRadius: "9999px",
          background: "#2a3a2d",
          color: "#fff",
          fontSize: "13px",
        },
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${name} — Visit Kokan`,
      text: `Order authentic ${name} directly from ${region}, Konkan on Visit Kokan!`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      toast.success("Product link copied! 📋", {
        style: {
          borderRadius: "9999px",
          background: "#122617",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 600,
        },
      });
    } catch {
      toast.error("Could not copy link");
    }
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      setCurrent((i) => (i + 1) % displayImages.length);
    } else if (diff < -40) {
      setCurrent((i) => (i - 1 + displayImages.length) % displayImages.length);
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative h-[340px] sm:h-[390px] rounded-b-[36px] sm:rounded-b-[44px] overflow-hidden shadow-md select-none bg-emerald-950/20"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Toaster position="top-center" />

      {/* Images Slider */}
      {displayImages.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <Image
            src={img}
            alt={`${name} photo ${idx + 1}`}
            fill
            priority={idx === 0}
            unoptimized={Boolean(img && !img.startsWith("/"))}
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Top Gradient Shadow for Action Buttons */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-20 pointer-events-none" />

      {/* Bottom Subtle Gradient for indicators */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20 pointer-events-none" />

      {/* Floating Header Actions (Back & Share/Wishlist) */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-30">
        {/* Back Button */}
        <button
          onClick={() => {
            if (fromPage) {
              router.push(`/products?page=${fromPage}`);
            } else if (backHref) {
              router.push(backHref);
            } else {
              router.back();
            }
          }}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all shadow-md"
          aria-label="Back to products"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all shadow-md"
            aria-label="Add to Wishlist"
          >
            <Heart
              size={18}
              className={`transition-colors ${
                isWishlist ? "fill-rose-500 text-rose-500" : "text-white"
              }`}
            />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all shadow-md"
            aria-label="Share product"
          >
            <Share2 size={17} />
          </button>
        </div>
      </div>

      {/* Bottom Floating Information Capsule */}
      <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-30 pointer-events-auto">
        {/* Category Pill Tag */}
        <div className="bg-white/90 backdrop-blur-md text-[#142607] font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md border border-white/60 flex items-center gap-1.5">
          <span>{category?.emoji ?? "🥥"}</span>
          <span className="capitalize">{category?.label ?? "Konkan Specialty"}</span>
        </div>

        {/* Carousel Dots Pill */}
        {displayImages.length > 1 && (
          <div className="bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5 border border-white/10 shadow-xs">
            {displayImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-4 h-1.5 bg-[#b8dc26]" : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Rating Star Badge */}
        <div className="bg-white/90 backdrop-blur-md text-[#142607] font-black text-xs px-2.5 py-1 rounded-full shadow-md border border-white/60 flex items-center gap-1">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

