import { usePathname } from "next/navigation";

// inside Navbar component, before the return:
const pathname = usePathname();
const publicPaths = ["/destinations", "/products", "/treks", "/blogs", "/listings", "/search", "/about", "/contact"];
if (pathname === "/" || publicPaths.some((p) => pathname.startsWith(p))) return null;// homepage has its own top bar