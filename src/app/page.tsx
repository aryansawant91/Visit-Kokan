import HomeTopBar from "@/components/home/HomeTopBar";
import HomeTabs from "@/components/home/HomeTabs";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visit Kokan — Discover the Konkan Coast",
  description:
    "Explore pristine beaches, lush forests, ancient forts and rich Konkani culture. Book treks, homestays and local experiences on the Konkan coast.",
  openGraph: {
    images: ["/images/og-default.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      <HomeTopBar />
      <main>
        <HomeTabs />
      </main>
      <Footer />
    </>
  );
}