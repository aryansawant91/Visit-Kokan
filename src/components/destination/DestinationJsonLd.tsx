import { getTravelLogistics } from "@/lib/travelLogistics";

interface Props {
  name: string;
  description: string;
  image?: string;
  region: string;
  slug: string;
  bestSeason?: string;
  highlights?: string[];
}

export default function DestinationJsonLd({
  name,
  description,
  image,
  region,
  slug,
  bestSeason,
  highlights,
}: Props) {
  const logistics = getTravelLogistics(slug, name, region);
  const url = `https://visitkokan.in/destinations/${slug}`;

  const faqItems = [
    {
      "@type": "Question",
      name: `What is the best time to visit ${name}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: bestSeason
          ? `The best time to visit ${name} in ${region}, Konkan is ${bestSeason}.`
          : `October to March offers the most pleasant coastal weather to visit ${name} in ${region}, Maharashtra.`,
      },
    },
    {
      "@type": "Question",
      name: `How far is ${name} from Mumbai and Pune?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${name} is approximately ${logistics.fromMumbai} from Mumbai and ${logistics.fromPune} from Pune.`,
      },
    },
    ...(logistics.ferryShortcut
      ? [
          {
            "@type": "Question",
            name: `Is there a Ro-Pax ferry shortcut to reach ${name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${logistics.ferryShortcut.title}: ${logistics.ferryShortcut.detail}`,
            },
          },
        ]
      : []),
    ...(highlights && highlights.length > 0
      ? [
          {
            "@type": "Question",
            name: `What are the top highlights at ${name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Top highlights at ${name} include ${highlights.slice(0, 5).join(", ")}.`,
            },
          },
        ]
      : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristDestination",
        name,
        description,
        url,
        image: image ?? "",
        touristType: "Leisure",
        ...(logistics.lat && logistics.lng
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: logistics.lat,
                longitude: logistics.lng,
              },
            }
          : {}),
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
            name: "Destinations",
            item: "https://visitkokan.in/destinations",
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
