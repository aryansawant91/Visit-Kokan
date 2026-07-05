"use client";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const publicPaths = [
    "/destinations",
    "/products",
    "/treks",
    "/blogs",
    "/listings",
    "/search",
    "/about",
    "/contact",
  ];

  if (
    pathname === "/" ||
    publicPaths.some((p) => pathname.startsWith(p))
  ) {
    return null;
  }

  return (
    <nav>
      {/* Your navbar JSX */}
    </nav>
  );
}