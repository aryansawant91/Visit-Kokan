"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Link2,
  Star,
  MapPin,
  Check,
  Mountain,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  images: string[];
  name: string;
  backHref?: string;
  category?: { emoji: string; label: string; value: string } | null;
  difficulty?: string;
  region: string;
  slug: string;
}

export default function TrekHeroCarousel({
  images,
  name,
  backHref = "/treks",
  category,
  difficulty,
  region,
  slug,
}: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
  ];
  const displayImages = images && images.length > 0 ? images : fallbackImages;

  // Restore favorite state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`visitkokan_fav_trek_${slug}`);
      if (saved === "true") {
        setIsFavorite(true);
      }
    } catch {
      // localStorage may be disabled in private mode
    }
  }, [slug]);

  const toggleFavorite = () => {
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    try {
      localStorage.setItem(`visitkokan_fav_trek_${slug}`, nextState ? "true" : "false");
    } catch {
      // ignore
    }
    if (nextState) {
      toast.success("Saved trek to your favorites! ⭐", {
        icon: "⭐",
        style: {
          borderRadius: "9999px",
          background: "#122617",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 600,
        },
      });
    } else {
      toast("Removed from favorites", {
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
      title: `${name} Trek — Visit Kokan`,
      text: `Check out ${name} trek in ${region}, Maharashtra on Visit Kokan.`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or unsupported
      }
    }

    handleCopyLink();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!", {
        style: {
          borderRadius: "9999px",
          background: "#122617",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 600,
        },
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % displayImages.length);
  }, [displayImages.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) next();
    else if (diff < -45) prev();
    touchStartX.current = null;
  };

  return (
    <div className="relative w-full select-none">
      <Toaster position="top-center" />

      {/* ── Curved Hero Image Canvas ── */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative h-[52vh] min-h-[380px] max-h-[480px] w-full overflow-hidden shadow-md"
        style={{
          /* Convex downward curve matching destination hero exactly */
          borderRadius: "0 0 50% 50% / 0 0 42px 42px",
        }}
      >
        {/* Slides */}
        {displayImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              idx === current ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={img}
              alt={`${name} photo ${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, 540px"
              className="object-cover"
            />
          </div>
        ))}

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-10 pointer-events-none" />

        {/* ── Top Bar Controls: Frosted Glass Floating Buttons ── */}
        <div className="absolute top-5 inset-x-0 px-4 flex items-center justify-between z-20">
          {/* Back button */}
          <button
            onClick={() => router.push(backHref)}
            aria-label="Go back"
            className="w-11 h-11 rounded-full bg-black/25 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-black/40 active:scale-95 transition-all shadow-md"
          >
            <ArrowLeft size={18} className="stroke-[2.5]" />
          </button>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Share button */}
            <button
              onClick={handleShare}
              aria-label="Share trek"
              className="w-11 h-11 rounded-full bg-black/25 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-black/40 active:scale-95 transition-all shadow-md"
            >
              <Share2 size={17} className="stroke-[2.3]" />
            </button>

            {/* Link / Copy button */}
            <button
              onClick={handleCopyLink}
              aria-label="Copy link"
              className="w-11 h-11 rounded-full bg-black/25 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-black/40 active:scale-95 transition-all shadow-md"
            >
              {copied ? (
                <Check size={18} className="text-emerald-400 stroke-[2.5]" />
              ) : (
                <Link2 size={18} className="stroke-[2.3]" />
              )}
            </button>
          </div>
        </div>

        {/* ── Hero Text Overlay ── */}
        <div className="absolute bottom-11 inset-x-0 px-5 sm:px-6 z-20">
          {/* Top tag / badge */}
          <div className="flex items-center gap-1.5 text-white/90 text-xs font-semibold mb-1 drop-shadow flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-[#a8e6cf]" />
              {region}, Kokan
            </span>
            {category?.label && (
              <>
                <span className="text-white/40">·</span>
                <span>{category.emoji} {category.label}</span>
              </>
            )}
            {difficulty && (
              <>
                <span className="text-white/40">·</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/35 backdrop-blur-sm border border-white/20 text-amber-300">
                  {difficulty}
                </span>
              </>
            )}
          </div>

          {/* Hero Name (2 lines if naturally long) */}
          <h1 className="text-[28px] sm:text-[34px] font-black text-white leading-[1.08] tracking-tight drop-shadow-md">
            {name}
          </h1>
        </div>

        {/* ── Centered Dots Capsule (Bottom of Hero) ── */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20">
            {displayImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Show slide ${i + 1}`}
                className="transition-all duration-300 focus:outline-none"
              >
                <div
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-4 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Floating Action Button (Star FAB) ── */}
      {/* Overlaps the bottom-right curve between the photo and the mint canvas */}
      <button
        onClick={toggleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className="absolute -bottom-7 right-5 sm:right-6 z-30 w-14 h-14 rounded-full bg-[#101912] text-white flex items-center justify-center shadow-xl shadow-black/35 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer border border-white/10"
      >
        <Star
          size={24}
          className={`transition-all duration-200 ${
            isFavorite
              ? "fill-[#facc15] text-[#facc15] scale-110"
              : "text-white stroke-[2]"
          }`}
        />
      </button>
    </div>
  );
}
