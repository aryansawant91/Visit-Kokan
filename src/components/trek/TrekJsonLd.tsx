interface Props {
  name: string;
  description?: string;
  image?: string;
  region: string;
  slug: string;
  price?: number;
}

export default function TrekJsonLd({ name, description, image, region, slug, price }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description: description ?? "",
    url: `https://visitkokan.in/treks/${slug}`,
    image: image ?? "",
    touristType: "Adventure",
    offers: price ? {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    } : undefined,
    itinerary: {
      "@type": "ItemList",
      name: `${name} Itinerary`,
    },
    locationCreated: {
      "@type": "Place",
      name: region,
      address: {
        "@type": "PostalAddress",
        addressRegion: region,
        addressLocality: "Konkan",
        addressCountry: "IN",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
