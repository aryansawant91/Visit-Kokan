"use client";

import PublicTopBar from "@/components/layout/PublicTopBar";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // On destination detail pages, provide an immersive full-bleed app experience matching the mobile design
  const isDestinationDetail = pathname?.startsWith("/destinations/") && pathname.split("/").filter(Boolean).length >= 2;

  return (
    <>
      {!isDestinationDetail && <PublicTopBar />}
      <main>{children}</main>
      {!isDestinationDetail && <Footer />}
    </>
  );
}