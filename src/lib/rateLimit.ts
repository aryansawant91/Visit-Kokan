import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

/**
 * In-memory token bucket / sliding window rate limiter.
 * Provides instant sub-millisecond burst protection.
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
  lastRequestAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up expired in-memory records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    if (now > record.resetAt + 60_000) {
      memoryStore.delete(key);
    }
  }
}, 60_000).unref?.();

/**
 * Extract client IP address from proxy headers or connection socket.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // Standard format: client, proxy1, proxy2...
    const client = forwarded.split(",")[0].trim();
    if (client) return client;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();

  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp?.trim()) return cfIp.trim();

  return "127.0.0.1";
}

/**
 * Fast in-memory rate check.
 */
export function checkMemoryRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  minIntervalMs: number = 0
): { allowed: boolean; remaining: number; resetInMs: number; errorReason?: string } {
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || now >= record.resetAt) {
    memoryStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
      lastRequestAt: now,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInMs: windowMs,
    };
  }

  // Check rapid-fire interval cooldown
  if (minIntervalMs > 0 && now - record.lastRequestAt < minIntervalMs) {
    const waitSecs = Math.ceil((minIntervalMs - (now - record.lastRequestAt)) / 1000);
    return {
      allowed: false,
      remaining: Math.max(0, maxRequests - record.count),
      resetInMs: minIntervalMs - (now - record.lastRequestAt),
      errorReason: `Please wait ${waitSecs} second${waitSecs > 1 ? "s" : ""} before requesting another OTP.`,
    };
  }

  if (record.count >= maxRequests) {
    const remainingMs = Math.max(0, record.resetAt - now);
    const remainingMins = Math.ceil(remainingMs / 60_000);
    return {
      allowed: false,
      remaining: 0,
      resetInMs: remainingMs,
      errorReason: `Too many requests from your IP. Please try again in ${remainingMins} minute${remainingMins > 1 ? "s" : ""}.`,
    };
  }

  record.count += 1;
  record.lastRequestAt = now;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetInMs: Math.max(0, record.resetAt - now),
  };
}

/**
 * Multi-tier IP Rate Limiter:
 * 1. Checks fast in-memory rate limiter
 * 2. Checks persistent Firestore rate limiter for cross-serverless resilience
 */
export async function checkIpRateLimit(
  prefix: string,
  ip: string,
  maxRequests: number,
  windowMs: number,
  minIntervalMs: number = 20_000
): Promise<{ allowed: boolean; remaining: number; resetInMs: number; errorReason?: string }> {
  const safeKey = `${prefix}_${ip.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

  // 1. Tier 1: Check in-memory store first
  const memCheck = checkMemoryRateLimit(safeKey, maxRequests, windowMs, minIntervalMs);
  if (!memCheck.allowed) {
    return memCheck;
  }

  // In test mode, in-memory check is authoritative and 0ms fast
  if (process.env.IS_TEST === "true" || process.env.NODE_ENV === "test") {
    return memCheck;
  }

  // 2. Tier 2: Firestore persistent check with 1.5s timeout resilience
  try {
    if (!adminDb) return memCheck;

    const timeoutPromise = new Promise<{ isTimeout: true }>((resolve) =>
      setTimeout(() => resolve({ isTimeout: true }), 1500)
    );

    const docRef = adminDb.collection("rate_limits").doc(safeKey);
    const snapResult = await Promise.race([docRef.get(), timeoutPromise]);

    if ("isTimeout" in snapResult) {
      return memCheck;
    }

    const snap = snapResult;
    const now = Date.now();

    if (!snap.exists) {
      await docRef.set({
        count: 1,
        resetAt: now + windowMs,
        lastRequestAt: now,
        ip,
        updatedAt: new Date().toISOString(),
      });
      return memCheck;
    }

    const data = snap.data();
    const resetAt = Number(data?.resetAt || 0);
    const currentCount = Number(data?.count || 0);
    const lastRequestAt = Number(data?.lastRequestAt || 0);

    // If window expired, reset counter
    if (now >= resetAt) {
      await docRef.set({
        count: 1,
        resetAt: now + windowMs,
        lastRequestAt: now,
        ip,
        updatedAt: new Date().toISOString(),
      });
      return memCheck;
    }

    // Check cooldown
    if (minIntervalMs > 0 && now - lastRequestAt < minIntervalMs) {
      const waitSecs = Math.ceil((minIntervalMs - (now - lastRequestAt)) / 1000);
      return {
        allowed: false,
        remaining: Math.max(0, maxRequests - currentCount),
        resetInMs: minIntervalMs - (now - lastRequestAt),
        errorReason: `Please wait ${waitSecs} second${waitSecs > 1 ? "s" : ""} before requesting another OTP.`,
      };
    }

    // Check limit
    if (currentCount >= maxRequests) {
      const remainingMs = Math.max(0, resetAt - now);
      const remainingMins = Math.ceil(remainingMs / 60_000);
      return {
        allowed: false,
        remaining: 0,
        resetInMs: remainingMs,
        errorReason: `Too many requests from your IP. Please try again in ${remainingMins} minute${remainingMins > 1 ? "s" : ""}.`,
      };
    }

    // Increment count
    await docRef.update({
      count: currentCount + 1,
      lastRequestAt: now,
      updatedAt: new Date().toISOString(),
    });

    return {
      allowed: true,
      remaining: maxRequests - (currentCount + 1),
      resetInMs: Math.max(0, resetAt - now),
    };
  } catch (err) {
    // If Firestore fails (e.g. offline/network glitch), gracefully trust in-memory check
    console.warn("Persistent rate limiter fallback to in-memory:", err);
    return memCheck;
  }
}
