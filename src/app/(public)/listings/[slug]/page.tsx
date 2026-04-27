import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Sparkles, ArrowLeft } from "lucide-react";
import { LISTING_CATEGORIES } from "@/constants/listingConstants";
import { adminDb } from "@/lib/firebaseAdmin";
import ListingGallery from "@/components/listing/ListingGallery";
import ListingMap from "@/components/listing/ListingMap";
import ListingReviews from "@/components/listing/ListingReviews";
import VendorInfo from "@/components/listing/VendorInfo";
import BookingWidget from "@/components/listing/BookingWidget";
import ListingJsonLd from "@/components/listing/ListingJsonLd";

async function getListing(slug: string) {
  try {
    const snap = await adminDb
      .collection("listings")
      .where("slug", "==", slug)
      .where("approved", "==", true)
      .limit(1)
      .get();

    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() } as any;
  } catch (err: any) {
    console.error("getListing error:", err.message);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const listing = await getListing(params.slug);
  if (!listing) return { title: "Listing Not Found" };
  return {
    title: `${listing.name} — Visit Kokan`,
    description: listing.description,
    openGraph: { images: listing.images?.[0] ? [listing.images[0]] : [] },
  };
}

export default async function ListingPage({ params }: { params: { slug: string } }) {
  const listing = await getListing(params.slug);
  if (!listing) notFound();

  const category = LISTING_CATEGORIES.find((c) => c.value === listing.category);
  const heroImage = listing.images?.[0] ??
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80";

  return (
    <div className="min-h-screen bg-white">

      <ListingJsonLd
        name={listing.name}
        description={listing.description}
        image={listing.images?.[0]}
        address={listing.address}
        region={listing.region}
        slug={listing.slug}
        price={listing.price}
        priceUnit={listing.priceUnit}
        rating={listing.rating}
        reviewCount={listing.reviewCount}
      />

      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image src={heroImage} alt={listing.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/listings"
            className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/20 hover:bg-white/25 transition-colors"
          >
            <ArrowLeft size={15} /> All Listings
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <div className="max-w-6xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/20 mb-4">
              {category?.emoji} {category?.label}
            </span>
            <h1 className="text-4xl md:text-6xl font-display text-white font-bold leading-tight">
              {listing.name}
            </h1>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-1 text-white/70 text-sm">
                <MapPin size={15} /> {listing.region}, Maharashtra
              </div>
              {listing.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star size={15} className="text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold text-sm">{listing.rating.toFixed(1)}</span>
                  <span className="text-white/60 text-sm">({listing.reviewCount} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {listing.images?.length > 1 && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
          <ListingGallery images={listing.images} name={listing.name} />
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            <div>
              <h2 className="text-2xl font-display font-bold text-kokan-earth mb-4">About</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-kokan-earth mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-kokan-sand" /> Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {listing.amenities.map((a: string) => (
                    <div key={a} className="flex items-center gap-3 p-3 bg-kokan-cream/40 rounded-xl border border-kokan-sand/20">
                      <span className="text-kokan-green text-sm">✓</span>
                      <span className="text-kokan-earth text-sm font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {listing.address && (
              <div>
                <h2 className="text-2xl font-display font-bold text-kokan-earth mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-kokan-sand" /> Location
                </h2>
                <ListingMap name={listing.name} address={listing.address} />
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-display font-bold text-kokan-earth mb-6 flex items-center gap-2">
                <Star size={20} className="text-kokan-sand" /> Reviews
              </h2>
              <ListingReviews
                listingId={listing.id}
                rating={listing.rating}
                reviewCount={listing.reviewCount}
              />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <BookingWidget
              listingName={listing.name}
              price={listing.price}
              priceUnit={listing.priceUnit}
              phone={listing.phone}
              category={listing.category}
            />

            <VendorInfo
              vendorName={listing.vendorName}
              phone={listing.phone}
              website={listing.website}
              region={listing.region}
              addedByAdmin={listing.addedByAdmin}
            />

            <div className="p-5 bg-kokan-earth rounded-2xl text-center">
              <p className="text-white/70 text-sm mb-3">Planning a trip to {listing.region}?</p>
              <Link
                href="/trip-planner"
                className="block w-full py-3 bg-kokan-sand text-white rounded-xl font-semibold hover:bg-kokan-sand/90 transition-colors text-sm"
              >
                Plan My Trip ✨
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}