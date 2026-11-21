import { NextRequest } from "next/server";
import crypto from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || process.env.RAZORPAY_KEY_SECRET || "vk_session_secret_kokan_2024";

export interface SessionData {
  uid?: string;
  role?: string;
  vendorStatus?: string | null;
}

export function createSignedSessionCookie(payload: SessionData): string {
  const data = JSON.stringify(payload);
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
  const b64 = Buffer.from(data, "utf-8").toString("base64url");
  return `${b64}.${signature}`;
}

export function verifySessionCookie(raw: string | undefined): SessionData | null {
  if (!raw) return null;

  try {
    if (raw.includes(".")) {
      const [b64, signature] = raw.split(".");
      if (b64 && signature) {
        const payload = Buffer.from(b64, "base64url").toString("utf-8");
        const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
        if (signature === expected) {
          return JSON.parse(payload) as SessionData;
        }
      }
    }

    // Fallback for legacy unsigned cookies (strictly disallow forged admin roles)
    const decoded = raw.startsWith("%7B") ? decodeURIComponent(raw) : raw;
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === "object") {
      if (parsed.role === "admin") {
        // Reject unverified unsigned admin claims
        return null;
      }
      return parsed as SessionData;
    }
  } catch {}

  return null;
}

export function getSession(req: NextRequest): SessionData | null {
  const cookie = req.cookies.get("vk_session")?.value;
  return verifySessionCookie(cookie);
}

export function isAuthorizedAdmin(req: NextRequest): boolean {
  const session = getSession(req);
  return session?.role === "admin";
}

export function isValidUid(uid: unknown): uid is string {
  return typeof uid === "string" && /^[a-zA-Z0-9_\-\.]{1,128}$/.test(uid);
}
