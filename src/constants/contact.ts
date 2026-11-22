/**
 * Centralized Contact & Support Configuration
 * Configurable via environment variables with safe defaults.
 */
export const SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+918432587706";

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918432587706";

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@visitkokan.in";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://visitkokan.in";
