"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  ChevronRight,
  ArrowRight,
  Star,
  Compass,
  ShoppingCart,
  Package,
  Check,
  Lock,
} from "lucide-react";
import { Trek } from "@/types/trek";
import { Product } from "@/types/product";
import { Listing } from "@/types/listing";
import { useCart } from "@/context/CartContext";

const TRAVEL_CATEGORIES = [
  { label: "All", emoji: "🗺️", value: "all" },
  { label: "Destinations", emoji: "🏖️", value: "destinations" },
  { label: "Treks", emoji: "🧗", value: "treks" },
  { label: "Products", emoji: "🥥", value: "products" },
  { label: "Beaches", emoji: "🌊", value: "beaches" },
  { label: "Forts", emoji: "🏰", value: "forts" },
  { label: "Homestays", emoji: "🏡", value: "homestays" },
  { label: "Food & Spices", emoji: "🍛", value: "food" },
  { label: "Water Sports", emoji: "🤿", value: "water" },
  { label: "Temples", emoji: "🛕", value: "temples" },
];

export interface DestinationItem {
  name: string;
  region: string;
  tag: string;
  image: string;
  slug: string;
  rating: number;
  category?: string;
}

const FALLBACK_DESTINATIONS: DestinationItem[] = [
  {
    name: "Tarkarli",
    region: "Sindhudurg",
    tag: "Beach + Scuba",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Tarkarli_beach.JPG",
    slug: "tarkarli",
    rating: 4.8,
    category: "beach",
  },
  {
    name: "Alibaug",
    region: "Raigad",
    tag: "Forts + Beach",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/26/Alibag_Beach.JPG",
    slug: "alibaug-beach",
    rating: 4.6,
    category: "beach",
  },
  {
    name: "Ganpatipule",
    region: "Ratnagiri",
    tag: "Temple + Sea",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/60/GANPATIPULE_BEACH_%281%29.jpg",
    slug: "ganpatipule-beach",
    rating: 4.7,
    category: "beach",
  },
  {
    name: "Malvan",
    region: "Sindhudurg",
    tag: "Seafood + History",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Leaving_Malvan_jetty_for_Sindhudurg_fort_%285363541711%29.jpg",
    slug: "malvan",
    rating: 4.9,
    category: "beach",
  },
  {
    name: "Dapoli",
    region: "Ratnagiri",
    tag: "Offbeat + Serene",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/28/Dapoli_Village_Top_View.jpg",
    slug: "dapoli",
    rating: 4.5,
    category: "beach",
  },
  {
    name: "Harihareshwar",
    region: "Raigad",
    tag: "Spiritual + Coast",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/47/Harihareshwar_beach.jpg",
    slug: "harihareshwar",
    rating: 4.6,
    category: "beach",
  },
  {
    name: "Murud-Janjira",
    region: "Raigad",
    tag: "Sea Fort",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Murud_Janjira_Fort.jpg",
    slug: "murud-janjira-fort",
    rating: 4.8,
    category: "fort",
  },
  {
    name: "Raigad Fort",
    region: "Raigad",
    tag: "Heritage Fort",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Maha_Darwaja_Raigad_fort.jpg",
    slug: "raigad-fort",
    rating: 4.9,
    category: "fort",
  },
  {
    name: "Kashid",
    region: "Raigad",
    tag: "White Sand Beach",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Kashid_Beach.jpg",
    slug: "kashid-beach",
    rating: 4.7,
    category: "beach",
  },
  {
    name: "Velas",
    region: "Ratnagiri",
    tag: "Turtle Festival",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Olive_Ridley_Sea_Turtle_Hatchlings.jpg",
    slug: "velas-beach",
    rating: 4.7,
    category: "beach",
  },
];

const BANNERS = [
  {
    title: "Top Destinations",
    sub: "Explore 50+ Coastal Gems",
    cta: "Explore",
    href: "/destinations",
    image: "/images/banners/explore-destinations.jpg",
  },
  {
    title: "Trek Season is Here",
    sub: "Lush Sahyadri Forts & Trails",
    cta: "Explore",
    href: "/treks",
    image: "/images/banners/monsoon-treks.jpg",
  },
  {
    title: "Authentic Kokan Products",
    sub: "Pure Kokum, Hapus & Malvani Spices",
    cta: "Shop Now",
    href: "/products",
    image: "/images/banners/alphonso-mangoes.jpg",
  },
  {
    title: "Curated Konkan Homestays",
    sub: "Authentic Coastal Wadas & Village Stays",
    cta: "Request Stay",
    href: "/listings?category=homestay",
    image: "/images/banners/coastal-getaways.jpg",
  },
];

const difficultyColor: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  moderate: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
  expert: "bg-red-200 text-red-800",
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};

const PRODUCT_EMOJIS: Record<string, string> = {
  fruits: "🥭",
  beverages: "🥤",
  nuts: "🥜",
  spices: "🌶️",
  condiments: "🍯",
  pickles: "🥒",
  flour: "🌾",
  "gift-pack": "🎁",
};

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </div>
  );
}

function DestinationCard({ dest }: { dest: DestinationItem }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Link href={`/destinations/${dest.slug}`} className="flex-shrink-0 snap-start">
      <div className="w-40 sm:w-48 rounded-2xl overflow-hidden border border-kokan-sand/20 hover:shadow-md transition-all">
        <div className="relative h-28 bg-emerald-950/20">
          {!imgErr && dest.image ? (
            <Image
              src={dest.image}
              alt={dest.name}
              fill
              sizes="(max-width: 640px) 160px, 192px"
              unoptimized={dest.image.includes("wikimedia.org") || dest.image.includes("unsplash.com")}
              onError={() => setImgErr(true)}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B4332] to-[#081C15] text-2xl">
              🏖️
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-white font-semibold text-sm truncate">{dest.name}</p>
            <p className="text-white/70 text-xs flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 flex-shrink-0" /> {dest.region}
            </p>
          </div>
          <div className="absolute top-2 right-2 bg-white/90 text-xs font-bold text-yellow-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            {dest.rating}
          </div>
        </div>
        <div className="bg-white px-3 py-2">
          <span className="text-xs text-kokan-earth/60 bg-kokan-sand/20 px-2 py-0.5 rounded-full">
            {dest.tag}
          </span>
        </div>
      </div>
    </Link>
  );
}

function DestinationCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-40 sm:w-48 rounded-2xl overflow-hidden border border-kokan-sand/20">
      <div className="h-28 bg-kokan-sand/20 animate-pulse" />
      <div className="bg-white px-3 py-2 space-y-1">
        <div className="h-3 bg-kokan-sand/20 rounded animate-pulse w-3/4" />
      </div>
    </div>
  );
}

function TrekCard({ trek }: { trek: Trek }) {
  const [imgErr, setImgErr] = useState(false);
  const hasImg = !imgErr && Boolean(trek.images?.[0]);
  return (
    <Link href={`/treks/${trek.slug}`} className="flex-shrink-0 snap-start">
      <div className="w-48 sm:w-56 bg-white rounded-2xl overflow-hidden border border-kokan-sand/20 hover:shadow-md transition-all flex flex-col justify-between h-full">
        <div className="relative h-32 bg-emerald-950/20">
          {hasImg ? (
            <Image
              src={trek.images[0]}
              alt={trek.name}
              fill
              sizes="(max-width: 640px) 192px, 224px"
              unoptimized={trek.images[0].includes("wikimedia.org") || trek.images[0].includes("unsplash.com")}
              onError={() => setImgErr(true)}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1B4332] to-[#081C15] flex items-center justify-center text-3xl">
              🥾
            </div>
          )}
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-full shadow-xs">
              ⏳ Soon
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                difficultyColor[trek.difficulty] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {trek.difficulty}
            </span>
          </div>
        </div>
        <div className="p-3 flex flex-col justify-between flex-1">
          <div>
            <p className="font-semibold text-kokan-earth text-sm line-clamp-1">{trek.name}</p>
            <div className="flex items-center gap-3 text-xs text-kokan-earth/50 mt-1">
              {trek.duration && (
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" /> {trek.duration}
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> {trek.region}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-kokan-sand/15">
            <span className="text-kokan-green font-bold text-sm">
              ₹{trek.price?.toLocaleString("en-IN")}
              <span className="text-[11px] text-kokan-earth/40 font-normal"> / person</span>
            </span>
            <span className="text-xs font-bold text-kokan-green bg-kokan-green/10 px-2.5 py-1 rounded-md">
              Enquire
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function TrekCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-2xl overflow-hidden border border-kokan-sand/20">
      <div className="h-32 bg-kokan-sand/20 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-kokan-sand/20 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-kokan-sand/20 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-kokan-sand/20 rounded animate-pulse w-1/3" />
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [imgErr, setImgErr] = useState(false);
  const { addToCart, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = isInCart(product.id);
  const hasImg = !imgErr && Boolean(product.images?.[0]);
  const emoji = PRODUCT_EMOJIS[product.category] || "🥥";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.isComingSoon) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <Link href={`/products/${product.slug}`} className="flex-shrink-0 snap-start">
      <div className="w-48 sm:w-56 bg-white rounded-2xl overflow-hidden border border-kokan-sand/20 hover:shadow-md transition-all flex flex-col justify-between h-full">
        <div className="relative h-32 bg-emerald-950/10">
          {hasImg ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 192px, 224px"
              unoptimized={Boolean(product.images[0] && !product.images[0].startsWith("/"))}
              onError={() => setImgErr(true)}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-kokan-earth/80 flex items-center justify-center text-3xl">
              {emoji}
            </div>
          )}

          {/* Badges on product image */}
          <div className="absolute top-2 left-2 flex items-center gap-1">
            {product.isComingSoon ? (
              <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" /> Soon
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 capitalize shadow-xs">
                {product.category || "Konkan Special"}
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2 bg-white/90 text-xs font-bold text-yellow-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            {product.rating ? product.rating.toFixed(1) : "4.8"}
          </div>
        </div>

        <div className="p-3 flex flex-col justify-between flex-1">
          <div>
            <p className="font-semibold text-kokan-earth text-sm line-clamp-1">{product.name}</p>
            <div className="flex items-center gap-3 text-xs text-kokan-earth/50 mt-1">
              <span className="flex items-center gap-0.5">
                <Package className="w-3 h-3" /> {product.unit || "Pack"}
              </span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> {product.region || "Sindhudurg"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-kokan-sand/15">
            {product.hidePrice ? (
              <span className="text-kokan-earth/50 font-bold text-sm flex items-center gap-1">
                <Lock className="w-3 h-3" /> ₹***
              </span>
            ) : (
              <span className="text-kokan-green font-bold text-sm">
                ₹{product.price?.toLocaleString("en-IN")}
                <span className="text-[11px] text-kokan-earth/40 font-normal">
                  {" "}
                  / {product.unit || "pack"}
                </span>
              </span>
            )}

            {product.isComingSoon ? (
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md">
                Soon
              </span>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                  justAdded || inCart
                    ? "bg-kokan-green text-white shadow-xs"
                    : "text-kokan-green bg-kokan-green/10 hover:bg-kokan-green hover:text-white"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3 h-3" /> Added
                  </>
                ) : inCart ? (
                  <>
                    <ShoppingCart className="w-3 h-3" /> In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3" /> Add
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-2xl overflow-hidden border border-kokan-sand/20">
      <div className="h-32 bg-kokan-sand/20 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-kokan-sand/20 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-kokan-sand/20 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-kokan-sand/20 rounded animate-pulse w-1/3" />
      </div>
    </div>
  );
}

function HomestayCard({ listing }: { listing: Listing | Partial<Listing> }) {
  const image = listing.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";
  return (
    <Link
      href={`/listings/${listing.slug || ""}`}
      className="w-64 sm:w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group snap-start"
    >
      <div className="relative h-40 sm:h-44 overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={listing.name || "Homestay"}
          fill
          unoptimized={Boolean(image && !image.startsWith("/"))}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-kokan-earth rounded-full shadow-2xs">
            {listing.category === "hotel" ? "🏨 Resort" : "🏡 Homestay"}
          </span>
          {listing.featured && (
            <span className="px-2 py-0.5 bg-amber-400 text-amber-950 text-[10px] font-extrabold rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
          <span className="text-xs font-medium flex items-center gap-1 drop-shadow-sm">
            <MapPin className="w-3 h-3 text-emerald-300" /> {listing.region || "Konkan"}
          </span>
          <span className="text-[11px] font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
            <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
            {listing.rating ? listing.rating.toFixed(1) : "4.9"}
          </span>
        </div>
      </div>
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-kokan-earth text-sm line-clamp-1 group-hover:text-kokan-green transition-colors">
            {listing.name}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-sm font-black text-kokan-green">
              ₹{(listing.price || 1999).toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-gray-400 ml-1">
              {listing.priceUnit || "per night"}
            </span>
          </div>
          <span className="text-[11px] font-bold text-kokan-green flex items-center gap-0.5 group-hover:gap-1 transition-all">
            View <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function HomestayCardSkeleton() {
  return (
    <div className="w-64 sm:w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse snap-start">
      <div className="h-40 sm:h-44 bg-gray-200" />
      <div className="p-3.5 space-y-2">
        <div className="h-4 bg-gray-200 rounded-md w-3/4" />
        <div className="h-3 bg-gray-100 rounded-md w-full" />
        <div className="h-3 bg-gray-100 rounded-md w-1/2" />
        <div className="pt-2 flex justify-between">
          <div className="h-4 bg-gray-200 rounded-md w-1/3" />
          <div className="h-4 bg-gray-200 rounded-md w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function TravelTab() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [destinations, setDestinations] = useState<DestinationItem[]>(FALLBACK_DESTINATIONS);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [treks, setTreks] = useState<Trek[]>([]);
  const [treksLoading, setTreksLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => setActiveBanner((i) => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  // Fetch seeded destinations from Firestore via API
  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: DestinationItem[] = data.map((d: any) => ({
            name: d.name?.replace(/\s+(Beach|Fort|Museum)$/i, "") || d.name,
            region: d.region || "Konkan",
            tag:
              d.category === "beach"
                ? "Beach"
                : d.category === "fort"
                ? "Historic Fort"
                : d.category === "temple"
                ? "Temple"
                : "Explore",
            image:
              d.coverImage ||
              d.images?.[0] ||
              "https://upload.wikimedia.org/wikipedia/commons/d/d3/Tarkarli_beach.JPG",
            slug: d.slug,
            rating: d.rating ? Number(d.rating) : 4.8,
            category: d.category || "all",
          }));
          setDestinations(mapped);
        }
        setDestinationsLoading(false);
      })
      .catch(() => setDestinationsLoading(false));
  }, []);

  // Fetch seeded treks from Firestore via API
  useEffect(() => {
    fetch("/api/treks")
      .then((r) => r.json())
      .then((data) => {
        const raw = Array.isArray(data) ? data : [];
        const seen = new Set<string>();
        const unique = raw.filter((t: any) => {
          const key = t.slug || t.id;
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setTreks(unique.slice(0, 8));
        setTreksLoading(false);
      })
      .catch(() => setTreksLoading(false));
  }, []);

  // Fetch authentic products from Firestore via API
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const active = data.filter((p: any) => p.isActive !== false);
          setProducts(active.slice(0, 10));
        }
        setProductsLoading(false);
      })
      .catch(() => setProductsLoading(false));
  }, []);

  // Fetch verified homestays & listings from Firestore via API
  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data);
        }
        setListingsLoading(false);
      })
      .catch(() => setListingsLoading(false));
  }, []);

  const filteredDestinations = destinations.filter((dest) => {
    if (activeCategory === "all" || activeCategory === "destinations") return true;
    if (activeCategory === "beaches" || activeCategory === "beach") return dest.category === "beach";
    if (activeCategory === "forts" || activeCategory === "fort") return dest.category === "fort";
    if (activeCategory === "temples" || activeCategory === "temple") return dest.category === "temple";
    return true;
  });

  const showDestinations =
    activeCategory === "all" ||
    activeCategory === "destinations" ||
    activeCategory === "beaches" ||
    activeCategory === "forts" ||
    activeCategory === "temples";

  const showTreks = activeCategory === "all" || activeCategory === "treks";

  const showProducts =
    activeCategory === "all" || activeCategory === "products" || activeCategory === "food";

  const showHomestays = activeCategory === "all" || activeCategory === "homestays";

  return (
    <div className="bg-kokan-cream/20">
      {/* Category pills */}
      <div className="bg-white border-b border-kokan-sand/20 px-4 py-3 sticky top-[52px] z-30 shadow-xs">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {TRAVEL_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setActiveCategory(c.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === c.value
                  ? "bg-kokan-green text-white shadow-xs"
                  : "bg-kokan-sand/20 text-kokan-earth/70 hover:bg-kokan-sand/30"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 space-y-8">
        {/* Banner Carousel */}
        <div>
          <div
            className="relative h-48 sm:h-56 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm"
            style={{ minHeight: "192px", maxHeight: "224px", position: "relative", overflow: "hidden" }}
          >
            {BANNERS.map((banner, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  i === activeBanner ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{ position: "absolute", inset: 0, overflow: "hidden" }}
              >
                {/* Background image */}
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />

                {/* Left gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between items-start max-w-[70%] sm:max-w-sm">
                  <div>
                    <span className="text-amber-300/95 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] drop-shadow-sm block mb-1">
                      {banner.sub}
                    </span>
                    <h3 className="text-white font-display font-bold text-xl sm:text-3xl leading-[1.15] drop-shadow-md tracking-tight">
                      {banner.title}
                    </h3>
                  </div>

                  <Link
                    href={banner.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/35 shadow-sm transition-all hover:scale-105 active:scale-95"
                  >
                    {banner.cta} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5 mt-2.5">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                aria-label={`Go to banner ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeBanner
                    ? "w-5 h-1.5 bg-kokan-green"
                    : "w-1.5 h-1.5 bg-kokan-sand/40 hover:bg-kokan-sand/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 1. Destinations Section */}
        {showDestinations && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-kokan-earth flex items-center gap-2">
                🏖️ Top Destinations
              </h2>
              <Link
                href="/destinations"
                className="text-xs text-kokan-green flex items-center gap-1 font-medium hover:underline"
              >
                See all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <HorizontalScroll>
              {destinationsLoading ? (
                Array.from({ length: 6 }).map((_, i) => <DestinationCardSkeleton key={i} />)
              ) : filteredDestinations.length > 0 ? (
                filteredDestinations.map((dest) => <DestinationCard key={dest.slug} dest={dest} />)
              ) : (
                <p className="text-sm text-kokan-earth/40 py-4">
                  No destinations found for this category.
                </p>
              )}
            </HorizontalScroll>
          </div>
        )}

        {/* 2. Treks Section */}
        {showTreks && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-kokan-earth flex items-center gap-2">
                🧗 Popular Treks
              </h2>
              <Link
                href="/treks"
                className="text-xs text-kokan-green flex items-center gap-1 font-medium hover:underline"
              >
                See all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <HorizontalScroll>
              {treksLoading ? (
                Array.from({ length: 4 }).map((_, i) => <TrekCardSkeleton key={i} />)
              ) : treks.length > 0 ? (
                treks.map((trek) => <TrekCard key={trek.id} trek={trek} />)
              ) : (
                <p className="text-sm text-kokan-earth/40 py-4">No treks available right now.</p>
              )}
            </HorizontalScroll>
          </div>
        )}

        {/* 3. Products Section — matched layout with Destinations & Treks */}
        {showProducts && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-kokan-earth flex items-center gap-2">
                🥥 Authentic Konkan Products
              </h2>
              <Link
                href="/products"
                className="text-xs text-kokan-green flex items-center gap-1 font-medium hover:underline"
              >
                See all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <HorizontalScroll>
              {productsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              ) : products.length > 0 ? (
                products.map((product) => <ProductCard key={product.id} product={product} />)
              ) : (
                <p className="text-sm text-kokan-earth/40 py-4">No products available right now.</p>
              )}
            </HorizontalScroll>
          </div>
        )}

        {/* 4. Homestays Section — Verified Stays Discovery & Vendor/Host Onboarding */}
        {showHomestays && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-kokan-earth flex items-center gap-2">
                  🏡 Konkan Homestays & Coastal Wadas
                </h2>
                <p className="text-[11px] text-kokan-earth/60">
                  100% verified local hosts · Zero dummy listings
                </p>
              </div>
              <Link
                href="/listings?category=homestay"
                className="text-xs text-kokan-green flex items-center gap-1 font-medium hover:underline shrink-0"
              >
                View all stays <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* If real approved listings exist, show them */}
            {listings.length > 0 ? (
              <HorizontalScroll>
                {listingsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => <HomestayCardSkeleton key={i} />)
                ) : (
                  listings.map((listing) => (
                    <HomestayCard key={listing.id || listing.slug} listing={listing} />
                  ))
                )}
              </HorizontalScroll>
            ) : null}

            {/* Host Onboarding Hub — Directly integrated with Vendor Registration & Login (No fake dummy data & No WhatsApp redirect) */}
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#122b1c] via-[#1c3d28] to-[#0d1e13] text-white p-5 sm:p-7 shadow-sm border border-emerald-900/40 space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md text-amber-300 font-extrabold text-[10px] sm:text-[11px] rounded-full uppercase tracking-wider mb-2">
                    <span>🏡</span> Host Onboarding · Verified Stays Network
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-black leading-tight text-white mb-2">
                    Own a Homestay, Beach Cottage or Ancestral Wada in Konkan?
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-4">
                    We never show unverified dummy listings to travellers. We are actively enrolling genuine local hosts across Sindhudurg, Ratnagiri & Raigad. List your property with zero listing fees and manage bookings directly through your host dashboard.
                  </p>

                  <div className="flex flex-wrap gap-2 text-[11px] text-white/90 font-medium">
                    <span className="bg-white/10 px-2.5 py-1 rounded-full">✓ 0% Commission (First 3 Months)</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-full">✓ 100% Verified Guests</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-full">✓ Dedicated Host Dashboard</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 w-full md:w-auto shrink-0">
                  <Link
                    href="/register?tab=vendor"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-black bg-[#b8dc26] hover:bg-[#aed422] text-[#142607] shadow-sm transition-all whitespace-nowrap active:scale-95 text-center"
                  >
                    <span>List Your Homestay (Sign Up as Host)</span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    href="/login?redirect=/vendor/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all whitespace-nowrap active:scale-95 text-center"
                  >
                    <span>Already a Host? Sign In</span>
                  </Link>
                </div>
              </div>

              {/* Traveler Notice Box */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌊</span>
                  <span>Planning a trip? Kokan Mitra AI can curate verified local stays for your dates.</span>
                </div>
                <Link
                  href="/trip-planner"
                  className="font-bold text-amber-300 hover:text-amber-200 transition-colors shrink-0 flex items-center gap-1"
                >
                  Plan with Kokan Mitra AI →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick links grid */}
        <div>
          <h2 className="font-semibold text-kokan-earth mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-kokan-green" /> Explore by Type
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Beaches", emoji: "🏖️", href: "/destinations?category=beach" },
              { label: "Treks", emoji: "🧗", href: "/treks" },
              { label: "Products", emoji: "🥥", href: "/products" },
              { label: "Homestays", emoji: "🏡", href: "/listings?category=homestay" },
              { label: "Food Tours", emoji: "🍛", href: "/listings?category=food" },
              { label: "Forts", emoji: "🏰", href: "/destinations?category=fort" },
              { label: "Temples", emoji: "🛕", href: "/destinations?category=temple" },
              { label: "Water Sports", emoji: "🤿", href: "/listings?category=water" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-2xl border border-kokan-sand/30 hover:border-kokan-green/40 hover:bg-kokan-green/5 transition-all shadow-2xs"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs text-kokan-earth/70 text-center leading-tight font-medium">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Plan your trip CTA */}
        <div className="bg-kokan-green rounded-2xl p-6 text-center shadow-xs">
          <div className="text-4xl mb-3">🗺️</div>
          <h3 className="font-playfair font-bold text-white text-xl mb-2">Plan Your Kokan Trip</h3>
          <p className="text-white/70 text-sm mb-4">
            Tell us your dates and budget — Kokan Mitra builds your custom itinerary
          </p>
          <Link
            href="/trip-planner"
            className="inline-block bg-white text-kokan-green font-bold px-6 py-2.5 rounded-full text-sm hover:bg-kokan-cream transition-colors shadow-xs"
          >
            Start Planning →
          </Link>
        </div>

        {/* View all CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/destinations"
            className="flex items-center justify-center gap-2 py-3 border-2 border-kokan-green text-kokan-green rounded-2xl font-semibold text-sm hover:bg-kokan-green hover:text-white transition-colors"
          >
            All Destinations <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/treks"
            className="flex items-center justify-center gap-2 py-3 border-2 border-kokan-green text-kokan-green rounded-2xl font-semibold text-sm hover:bg-kokan-green hover:text-white transition-colors"
          >
            All Treks <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 py-3 bg-kokan-green text-white rounded-2xl font-semibold text-sm hover:bg-kokan-green/90 transition-colors shadow-xs"
          >
            All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
