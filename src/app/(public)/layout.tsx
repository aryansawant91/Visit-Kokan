"use client";

import PublicTopBar from "@/components/layout/PublicTopBar";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <PublicTopBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}