interface Props {
  name: string;
  description: string;
  image?: string;
  region: string;
  slug: string;
}

export default function DestinationJsonLd({ name, description, image, region, slug }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name,
    description,
    url: `https://visitkokan.in/destinations/${slug}`,
    image: image ?? "",
    touristType: "Leisure",
    includesAttraction: {
      "@type": "TouristAttraction",
      name,
      description,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: region,
      addressLocality: "Konkan",
      addressCountry: "IN",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}