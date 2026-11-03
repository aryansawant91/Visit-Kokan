const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

async function run() {
  console.log("Fetching Treks and Destinations from Firestore...");

  const treksSnap = await db.collection('treks').get();
  const treks = treksSnap.docs.map(d => {
    const data = d.data();
    return {
      slug: data.slug,
      name: data.name,
      difficulty: data.difficulty || 'moderate',
      duration: data.duration || '1 day',
      region: data.region || 'Konkan',
      elevation: data.elevation || '',
      baseVillage: data.startingPoint || data.baseVillage || '',
      highlights: (data.highlights || []).slice(0, 2).map(h => h.replace(/["\\]/g, '')).join('; ')
    };
  });

  const destsSnap = await db.collection('destinations').get();
  const dests = destsSnap.docs.map(d => {
    const data = d.data();
    return {
      slug: data.slug,
      name: data.name,
      region: data.region || 'Konkan',
      category: data.category || 'beach',
      highlights: (data.tagline || data.shortDescription || (data.highlights || []).slice(0, 2).join('; ')).replace(/["\\]/g, '')
    };
  });

  console.log(`Loaded ${treks.length} treks and ${dests.length} destinations.`);

  const tsContent = `// -------------------------------------------------------------
// AUTO-GENERATED FROM FIRESTORE - VISIT KOKAN PLATFORM KNOWLEDGE
// -------------------------------------------------------------

export interface WebsiteTrekInfo {
  slug: string;
  name: string;
  difficulty: "easy" | "moderate" | "hard" | "expert" | "challenging" | string;
  duration: string;
  region: string;
  elevation: string;
  baseVillage: string;
  highlights: string;
}

export interface WebsiteDestinationInfo {
  slug: string;
  name: string;
  region: string;
  category: string;
  highlights: string;
}

export const PLATFORM_INFO = {
  name: "Visit Kokan",
  domain: "https://visitkokan.in",
  whatsappNumber: "+91 84325 87706",
  whatsappUrl: "https://wa.me/918432587706",
  callNumber: "+918432587706",
  trekBatchPrice: 1499,
  trekAdvanceDeposit: 750,
  pricingPolicy: "Uniform ₹1,499 per trekker with ₹750 advance deposit to confirm batch slot.",
  enquiryProcess: "Treks are currently opening for upcoming weekend batches with 'Coming Soon' enquiry status. Visitors can tap 'Enquire on WhatsApp' or submit the lead form on the trek page.",
  productsAvailable: "Alphonso Mangoes (Ratnagiri/Devgad Hapus), Organic Kokum, Cashew nuts, Malvani masala, Traditional Chivda.",
  homestayService: "Verified coastal homestays and heritage wadas across Alibaug, Dapoli, Ganpatipule, Tarkarli, and Malvan."
};

export const ALL_WEBSITE_TREKS: WebsiteTrekInfo[] = ${JSON.stringify(treks, null, 2)};

export const ALL_WEBSITE_DESTINATIONS: WebsiteDestinationInfo[] = ${JSON.stringify(dests, null, 2)};

/**
 * Filter and rank treks matching a user query or region
 */
export function findMatchingTreks(query: string, limit = 6): WebsiteTrekInfo[] {
  const lower = query.toLowerCase();
  
  // Exact name or slug matching
  const exact = ALL_WEBSITE_TREKS.filter(t => 
    t.slug.includes(lower) || 
    t.name.toLowerCase().includes(lower) ||
    lower.includes(t.slug.replace(/-/g, ' '))
  );
  if (exact.length > 0) return exact.slice(0, limit);

  // Region matching
  const regionMatches: Record<string, string[]> = {
    ratnagiri: ["ratnagiri", "khed", "guhagar", "chiplun"],
    raigad: ["raigad", "alibaug", "mangaon", "mahad", "karjat", "panvel"],
    sindhudurg: ["sindhudurg", "malvan", "tarkarli", "devgad", "sawantwadi", "vengurla"],
    pune: ["pune", "lonavala", "bhor", "velhe"],
  };

  for (const [reg, aliases] of Object.entries(regionMatches)) {
    if (aliases.some(a => lower.includes(a))) {
      const byReg = ALL_WEBSITE_TREKS.filter(t => 
        t.region.toLowerCase().includes(reg) || 
        aliases.some(a => t.region.toLowerCase().includes(a) || t.baseVillage.toLowerCase().includes(a))
      );
      if (byReg.length > 0) return byReg.slice(0, limit);
    }
  }

  // Difficulty matching
  if (lower.includes("easy") || lower.includes("beginner") || lower.includes("family")) {
    return ALL_WEBSITE_TREKS.filter(t => t.difficulty === "easy").slice(0, limit);
  }
  if (lower.includes("hard") || lower.includes("tough") || lower.includes("extreme") || lower.includes("difficult")) {
    return ALL_WEBSITE_TREKS.filter(t => t.difficulty === "hard" || t.difficulty === "expert").slice(0, limit);
  }
  if (lower.includes("moderate") || lower.includes("medium")) {
    return ALL_WEBSITE_TREKS.filter(t => t.difficulty === "moderate").slice(0, limit);
  }

  // General keyword matching
  const scored = ALL_WEBSITE_TREKS.map(t => {
    let score = 0;
    const words = lower.split(/\\s+/).filter(w => w.length > 3);
    for (const w of words) {
      if (t.name.toLowerCase().includes(w)) score += 3;
      if (t.baseVillage.toLowerCase().includes(w)) score += 2;
      if (t.highlights.toLowerCase().includes(w)) score += 1;
    }
    return { t, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

  if (scored.length > 0) return scored.slice(0, limit).map(x => x.t);

  // Default featured variety
  const featuredSlugs = [
    "torna-fort-trek",
    "raigad-fort-heritage-climb",
    "harishchandragad-trek",
    "mahipatgad-forest-fort-trek",
    "kalavantin-durg-trek",
    "gopalgad-anjanvel-lighthouse-trek"
  ];
  return ALL_WEBSITE_TREKS.filter(t => featuredSlugs.includes(t.slug));
}

/**
 * Filter destinations matching user query
 */
export function findMatchingDestinations(query: string, limit = 5): WebsiteDestinationInfo[] {
  const lower = query.toLowerCase();

  const exact = ALL_WEBSITE_DESTINATIONS.filter(d => 
    d.slug.includes(lower) || 
    d.name.toLowerCase().includes(lower)
  );
  if (exact.length > 0) return exact.slice(0, limit);

  if (lower.includes("beach") || lower.includes("sea")) {
    return ALL_WEBSITE_DESTINATIONS.filter(d => d.category === "beach").slice(0, limit);
  }
  if (lower.includes("fort")) {
    return ALL_WEBSITE_DESTINATIONS.filter(d => d.category === "fort").slice(0, limit);
  }
  if (lower.includes("temple")) {
    return ALL_WEBSITE_DESTINATIONS.filter(d => d.category === "temple").slice(0, limit);
  }

  const regionMatches: Record<string, string[]> = {
    ratnagiri: ["ratnagiri", "dapoli", "ganpatipule", "guhagar"],
    raigad: ["raigad", "alibaug", "murud", "kashid"],
    sindhudurg: ["sindhudurg", "tarkarli", "malvan", "devgad", "amboli"],
  };

  for (const [reg, aliases] of Object.entries(regionMatches)) {
    if (aliases.some(a => lower.includes(a))) {
      return ALL_WEBSITE_DESTINATIONS.filter(d => 
        d.region.toLowerCase().includes(reg) || aliases.some(a => d.slug.includes(a))
      ).slice(0, limit);
    }
  }

  return ALL_WEBSITE_DESTINATIONS.slice(0, limit);
}

/**
 * Generates rich, laser-focused website grounding context for Groq / LLM
 */
export function getWebsiteGroundingContext(
  userQuery: string,
  pageContext?: string,
  pathname?: string
): string {
  const lowerQuery = (userQuery + " " + (pageContext || "")).toLowerCase();

  const isTrekTopic = 
    lowerQuery.includes("trek") || 
    lowerQuery.includes("fort") || 
    lowerQuery.includes("climb") || 
    lowerQuery.includes("hike") || 
    lowerQuery.includes("gad") || 
    lowerQuery.includes("kille") ||
    lowerQuery.includes("enquire") ||
    lowerQuery.includes("book") ||
    (pathname && pathname.includes("/treks"));

  const isDestinationTopic =
    lowerQuery.includes("beach") ||
    lowerQuery.includes("temple") ||
    lowerQuery.includes("stay") ||
    lowerQuery.includes("homestay") ||
    lowerQuery.includes("water sports") ||
    lowerQuery.includes("scuba") ||
    lowerQuery.includes("itinerary") ||
    lowerQuery.includes("visit") ||
    (pathname && pathname.includes("/destinations"));

  const matchedTreks = findMatchingTreks(lowerQuery, isTrekTopic ? 6 : 3);
  const matchedDests = findMatchingDestinations(lowerQuery, isDestinationTopic ? 5 : 3);

  let out = \`
=== VISIT KOKAN (visitkokan.in) OFFICIAL PLATFORM KNOWLEDGE ===
- Platform Name: Visit Kokan
- Trek Batches Pricing: ₹1,499 per trekker (Advance: ₹750 deposit to confirm slot).
- Trek Enquiry Method: All treks are opening for upcoming weekend batches with 'Coming Soon' enquiry status. Visitors can click 'Enquire on WhatsApp' on the trek page or message directly at \${PLATFORM_INFO.whatsappNumber} (\${PLATFORM_INFO.whatsappUrl}).
- Stays & Homestays: Authentic Konkan homestays available at [/listings](/listings).
- Kokan Products: Alphonso Mangoes, Cashews, Kokum syrup, Malvani spices at [/products](/products).

CRITICAL CONCIERGE LINKING DIRECTIVES:
1. You are Kokan Mitra, the resident expert on the Visit Kokan website (visitkokan.in).
2. Whenever you mention a trek, ALWAYS format it as a clickable markdown internal link: [Trek Name](/treks/slug). Example: [Torna Fort Trek](/treks/torna-fort-trek) or [Mahipatgad Dense Forest Expedition](/treks/mahipatgad-forest-fort-trek).
3. Whenever you mention a destination, ALWAYS format it as: [Destination Name](/destinations/slug). Example: [Tarkarli](/destinations/tarkarli) or [Ganpatipule Beach](/destinations/ganpatipule-beach).
4. NEVER invent fake companies (e.g. "Sagar Adventure"), fake phone numbers (e.g. "022-xxxx-xxxx"), or fake tour operators.
5. If the user asks how to book or enquire, guide them to our website: "You can view full details on [Visit Kokan Treks](/treks) and tap 'Enquire on WhatsApp' (or chat with our trek coordinator at +91 84325 87706)!".
6. If the user asks in Marathi or Hinglish, answer in fluent, warm, natural Marathi with authentic Konkani warmth!
\`;

  if (matchedTreks.length > 0) {
    out += \`
VERIFIED TREKS ON VISIT KOKAN (USE EXACT SLUGS AND DETAILS):
\${matchedTreks.map(t => \`- [\${t.name}](/treks/\${t.slug}) | Region: \${t.region} | Difficulty: \${t.difficulty} | Duration: \${t.duration} | Base: \${t.baseVillage} | Highlights: \${t.highlights}\`).join("\\n")}
\`;
  }

  if (matchedDests.length > 0) {
    out += \`
VERIFIED DESTINATIONS ON VISIT KOKAN:
\${matchedDests.map(d => \`- [\${d.name}](/destinations/\${d.slug}) | Region: \${d.region} | Category: \${d.category} | Highlights: \${d.highlights}\`).join("\\n")}
\`;
  }

  return out.trim();
}
`;

  const targetPath = path.join(process.cwd(), 'src', 'lib', 'ai', 'kokanWebsiteData.ts');
  fs.writeFileSync(targetPath, tsContent, 'utf8');
  console.log(`Generated ${targetPath} successfully!`);
}

run().catch(console.error).finally(() => process.exit(0));
