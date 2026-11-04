// Client-safe page context helper for AIChatWidget
// Decoupled from server prompts to ensure zero client bundle bloat or hydration issues

import { TREK_TRANSIT_GATEWAYS } from "@/lib/ai/kokanWebsiteData";

export interface PageContextResult {
  context: string;
  suggestions: string[];
  greeting: string;
}

export function getPageContext(pathname?: string | null): PageContextResult {
  const path = (pathname || "").toLowerCase();

  // 1. Specific Trek page: /treks/[slug]
  if (path.startsWith("/treks/") && path !== "/treks") {
    const slug = path.replace("/treks/", "").split("?")[0].replace(/\/$/, "");
    const formattedName = slug
      .replace(/-trek$/, "")
      .replace(/-fort$/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const transit = TREK_TRANSIT_GATEWAYS[slug];
    const transitDetails = transit
      ? ` Base Village: ${transit.baseVillage}. Nearest Railway Station: ${transit.nearestStation}. Road Route: ${transit.roadRoute}. CRITICAL TRAVEL DIRECTIVE: When asked how to reach, ALWAYS provide this verified station (${transit.nearestStation}) and route. NEVER recommend Kankavli or any other wrong station!`
      : "";

    return {
      context: `User is viewing trek page for: ${formattedName} (slug: ${slug}). Official trek price is ₹1,499 per trekker (₹750 advance deposit to confirm slot). Status: Coming Soon, open for WhatsApp enquiry.${transitDetails}`,
      suggestions: [
        "Difficulty & trail info?",
        "How to reach base?",
        "Enquire on WhatsApp",
        "What to pack?",
      ],
      greeting: `Looking to explore ${formattedName}? 🥾 Want to know about the trail difficulty, how to reach the base, or upcoming batch dates?`,
    };
  }

  // 2. Treks Catalog: /treks
  if (path === "/treks" || path.startsWith("/treks?")) {
    return {
      context:
        "User is browsing the Visit Kokan Treks catalog (59 authentic Sahyadri and coastal treks across Raigad, Ratnagiri, Sindhudurg, and Pune).",
      suggestions: [
        "Easy beginner treks",
        "Top fort climbs",
        "Treks in Ratnagiri",
        "How to enquire/book",
      ],
      greeting:
        "Welcome to Visit Kokan Treks! 🥾 We have 59 authentic Sahyadri and coastal treks. Looking for a breezy sea-fort walk, an iconic climb, or want to know upcoming batch dates?",
    };
  }

  // 3. Specific Destination page: /destinations/[slug]
  if (path.startsWith("/destinations/") && path !== "/destinations") {
    const slug = path
      .replace("/destinations/", "")
      .split("?")[0]
      .replace(/\/$/, "");
    const formattedName = slug
      .replace(/-beach$/, "")
      .replace(/-fort$/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      context: `User is viewing destination page for: ${formattedName} (slug: ${slug}).`,
      suggestions: [
        "2 day weekend plan",
        "How to reach",
        "Where to stay",
        "Best local food",
      ],
      greeting: `Exploring ${formattedName}? 🌊 It's one of Konkan's premier coastal spots. Want a weekend itinerary, stay recommendations, or travel directions?`,
    };
  }

  // 4. Destinations Catalog: /destinations
  if (path === "/destinations" || path.startsWith("/destinations?")) {
    return {
      context: "User is exploring destinations across Raigad, Ratnagiri, and Sindhudurg.",
      suggestions: [
        "Best white sand beaches",
        "Historic sea forts",
        "Quiet offbeat towns",
        "Temple circuits",
      ],
      greeting:
        "Exploring Konkan's destinations? 🏖️ From virgin beaches to majestic sea forts and ancient temples, what kind of place are you looking for?",
    };
  }

  // 5. Homestays & Stays: /listings
  if (path.startsWith("/listings")) {
    return {
      context: "User is viewing verified coastal homestays and wadas on Visit Kokan.",
      suggestions: [
        "Beachfront homestays",
        "Budget stays in Malvan",
        "Homestays in Dapoli",
        "Family wadas",
      ],
      greeting:
        "Looking for an authentic Konkan homestay? 🏡 We feature verified coastal homestays with home-cooked Malvani meals. Where are you planning to stay?",
    };
  }

  // 6. Products Store: /products
  if (path.startsWith("/products")) {
    return {
      context: "User is browsing authentic Konkan local products (Hapus mangoes, cashews, kokum, spices).",
      suggestions: [
        "Original Hapus mangoes",
        "Malvani masala",
        "Organic kokum syrup",
        "Cashew nuts",
      ],
      greeting:
        "Craving authentic Konkan flavours? 🥭 We bring direct-from-farm Devgad & Ratnagiri Alphonso mangoes, cashews, and homemade spices. Looking for something specific?",
    };
  }

  // 7. Travel Blogs: /blogs
  if (path.startsWith("/blogs")) {
    return {
      context: "User is reading Konkan travel stories and guides.",
      suggestions: [
        "Turn blog into itinerary",
        "Monsoon travel tips",
        "Best seafood in Malvan",
        "Budget weekend tips",
      ],
      greeting:
        "Enjoying the Konkan travel stories? 📖 I can turn any blog or destination you read about into a concrete day-by-day itinerary. Just ask!",
    };
  }

  // 8. Search page: /search
  if (path.startsWith("/search")) {
    return {
      context: "User is searching the Visit Kokan platform.",
      suggestions: [
        "Top 5 beaches",
        "Trek recommendations",
        "Best season to visit",
        "Trip from Mumbai",
      ],
      greeting:
        "Searching for something special in Konkan? 🔍 Tell me what you're dreaming of — sea forts, scuba diving, waterfall trails, or quiet beaches!",
    };
  }

  // 9. Default / Homepage
  return {
    context: "User is on the Visit Kokan homepage.",
    suggestions: [
      "Weekend from Mumbai",
      "Best Sahyadri treks",
      "Top beaches in Sindhudurg",
      "Food to try in Malvan",
    ],
    greeting:
      "Namaskar! 🙏 I'm Kokan Mitra, your local guide on Visit Kokan. Where are you dreaming of heading, or would you like me to suggest the perfect trip?",
  };
}

