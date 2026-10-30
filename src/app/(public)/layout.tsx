"use client";

import PublicTopBar from "@/components/layout/PublicTopBar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that provide their own rich, dedicated sticky navigation header:
  const isCustomHeaderPage =
    pathname === "/destinations" ||
    pathname === "/treks" ||
    pathname === "/products" ||
    (pathname?.startsWith("/destinations/") && pathname.split("/").filter(Boolean).length >= 2) ||
    (pathname?.startsWith("/treks/") && pathname.split("/").filter(Boolean).length >= 2);

  // Detail pages with their own bottom action bars:
  const isFullBleedDetailPage =
    (pathname?.startsWith("/destinations/") && pathname.split("/").filter(Boolean).length >= 2) ||
    (pathname?.startsWith("/treks/") && pathname.split("/").filter(Boolean).length >= 2);

  return (
    <>
      {!isCustomHeaderPage && <PublicTopBar />}
      <main className={!isFullBleedDetailPage ? "pb-16 md:pb-0" : ""}>{children}</main>
      {!isFullBleedDetailPage && <Footer />}
      {!isFullBleedDetailPage && <MobileNav />}
    </>
  );
}
