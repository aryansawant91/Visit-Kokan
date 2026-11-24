/**
 * Utility to identify URLs that should bypass Next.js server-side image optimization (/_next/image).
 * - Wikimedia Commons (upload.wikimedia.org) aggressively blocks automated server-side optimizers with HTTP 429 (Too Many Requests).
 * - Setting unoptimized={true} allows the browser to request directly from the host with standard browser headers, completely bypassing the 429 rate limit.
 */
export function isUnoptimizedUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("wikimedia.org") ||
    lower.includes("wikipedia.org") ||
    lower.includes("drive.google.com")
  );
}

export const FALLBACK_DESTINATION_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80";

export const FALLBACK_TREK_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";

export const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=1200&q=80";
