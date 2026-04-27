interface Props {
  name: string;
  description: string;
  image?: string;
  address: string;
  region: string;
  slug: string;
  price?: number;
  priceUnit?: string;
  rating?: number;
  reviewCount?: number;
}

export default function ListingJsonLd({
  name, description, image, address, region,
  slug, price, priceUnit, rating, reviewCount,
}: Props) {
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url: `https://visitkokan.in/listings/${slug}`,
    image: image ?? "",
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressRegion: region,
      addressLocality: "Konkan",
      addressCountry: "IN",
    },
  };

  if (price) {
    jsonLd.priceRange = `₹${price} ${priceUnit ?? ""}`;
  }

  if (rating && reviewCount) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}