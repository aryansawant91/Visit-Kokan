import { getTravelLogistics } from "@/lib/travelLogistics";

interface Props {
  name: string;
  description?: string;
  image?: string;
  region: string;
  slug: string;
  price?: number;
  difficulty?: string;
  duration?: string;
  bestSeason?: string;
}

export default function TrekJsonLd({
  name,
  description,
  image,
  region,
  slug,
  price,
  difficulty,
  duration,
  bestSeason,
}: Props) {
  const logistics = getTravelLogistics(slug, name, region);
  const url = `https://visitkokan.in/treks/${slug}`;

  const faqItems = [
    {
      "@type": "Question",
      name: `How difficult is the ${name} trek and how long does it take?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${name} in ${region} is rated ${difficulty || "Moderate"} difficulty and typically takes ${duration || "1 day"} to complete.`,
      },
    },
    {
      "@type": "Question",
      name: `How to reach ${name} from Mumbai and Pune?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${name} is approximately ${logistics.fromMumbai} from Mumbai and ${logistics.fromPune} from Pune by road or rail.`,
      },
    },
    {
      "@type": "Question",
      name: `What is the best season to trek ${name}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: bestSeason
          ? `The ideal season for the ${name} trek is ${bestSeason}.`
          : `Post-monsoon and winter (October to February) offer the clearest Sahyadri ridge views and pleasant trekking conditions for ${name}.`,
      },
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name,
        description: description ?? "",
        url,
        image: image ?? "",
        touristType: "Adventure",
        offers: price
          ? {
              "@type": "Offer",
              price: price.toString(),
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            }
          : undefined,
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
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://visitkokan.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Treks",
            item: "https://visitkokan.in/treks",
          },
          {
            "@type": "ListItem",
            position: 3,
            name,
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
