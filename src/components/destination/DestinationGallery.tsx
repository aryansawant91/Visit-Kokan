"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  name: string;
}

export default function DestinationGallery({ images, name }: Props) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setCurrent((i) => (i + 1) % images.length),
    [images.length]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    touchStartX.current = null;
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* ── Carousel — fully inside card, no overlap ── */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative",
          width: "100%",
          height: 210,
          borderRadius: 20,
          overflow: "hidden",   /* clips image to rounded corners */
          background: "#c4d9c6",
        }}
      >
        {/* All images stacked, only current is visible */}
        {images.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              inset: 0,
              opacity: idx === current ? 1 : 0,
              transition: "opacity 0.3s ease",
              zIndex: idx === current ? 1 : 0,
            }}
            onClick={() => setLightbox(true)}
          >
            <Image
              src={img}
              alt={`${name} ${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="(max-width: 640px) 90vw, 500px"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}

        {/* Count badge — top right */}
        {images.length > 1 && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(6px)",
              borderRadius: 99,
              padding: "2px 10px",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {current + 1} / {images.length}
          </div>
        )}

        {/* Desktop arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              style={{
                position: "absolute", left: 8, top: "50%",
                transform: "translateY(-50%)", zIndex: 10,
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff",
              }}
              className="hidden sm:flex"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              style={{
                position: "absolute", right: 8, top: "50%",
                transform: "translateY(-50%)", zIndex: 10,
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff",
              }}
              className="hidden sm:flex"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* ── Dots — below carousel, inside card ── */}
      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: 10,
          }}
        >
          {images.slice(0, 8).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Photo ${i + 1}`}
              style={{ background: "none", border: "none", padding: 2, cursor: "pointer" }}
            >
              <div
                style={{
                  height: 6,
                  width: i === current ? 22 : 6,
                  borderRadius: 99,
                  background: i === current ? "#2D6A4F" : "#b8cdb9",
                  transition: "width 0.25s ease, background 0.25s ease",
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 60,
            background: "rgba(0,0,0,0.96)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: "absolute", top: 20, right: 20,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.1)", border: "none",
              cursor: "pointer", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>

          <p style={{
            position: "absolute", top: 20, left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.4)", fontSize: 12,
          }}>
            {current + 1} / {images.length}
          </p>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{
              position: "absolute", left: 16,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.1)", border: "none",
              cursor: "pointer", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <div
            style={{ position: "relative", width: "100%", maxWidth: 480, margin: "0 64px", height: "75vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[current]}
              alt={`${name} ${current + 1}`}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            style={{
              position: "absolute", right: 16,
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.1)", border: "none",
              cursor: "pointer", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Thumbnail strip */}
          <div style={{
            position: "absolute", bottom: 20,
            left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 6,
          }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                style={{
                  position: "relative",
                  width: i === current ? 48 : 36,
                  height: i === current ? 48 : 36,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: `2px solid ${i === current ? "#fff" : "transparent"}`,
                  opacity: i === current ? 1 : 0.35,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Image src={img} alt="" fill style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}