import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Visit Kokan",
    default: "Sign in | Visit Kokan",
  },
  description: "Sign in or create an account to explore the Konkan coast.",
};

/**
 * Minimal layout for auth pages — no Navbar / Footer.
 * All auth pages share the dark coastal background via their own styles.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}