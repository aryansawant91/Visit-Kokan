import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

const enrichedData = {
  name: "Alibaug Beach",
  slug: "alibaug-beach",
  tagline: "Where the tides tell Maratha stories and every sunset feels like an escape",
  shortDescription: "A popular coastal destination in Raigad district, Maharashtra, known for its Arabian Sea views, the historic Kolaba Sea Fort, colourful beachside stalls, and relaxed coastal atmosphere just a short journey from Mumbai.",
  description: "Alibaug Beach is one of Maharashtra's most beloved coastal getaways, where the Arabian Sea meets a landscape shaped by maritime history, fishing traditions, and the easy rhythm of Konkan life. Located near Alibaug town in Raigad district, the beach is famous for its striking view of Kolaba Fort, a historic sea fort associated with Chhatrapati Shivaji Maharaj and the Maratha naval legacy. At low tide, visitors can walk across the exposed shoreline towards the fort when access is safe and permitted; at other times, access may depend on boats and local conditions. The beach comes alive in the evenings as families stroll along the sand, vendors serve local snacks, and the sky turns shades of orange and gold. Beyond the shoreline, the surrounding region offers coconut groves, seafood restaurants, heritage sites, and quieter beaches such as Varsoli, Akshi, and Kihim. With convenient connections from Mumbai by road and ferry, Alibaug is an appealing escape for families, couples, groups of friends, history enthusiasts, and travellers looking to experience the coastal character of Maharashtra.",
  category: "beach",
  region: "Raigad",
  images: [
    "https://upload.wikimedia.org/wikipedia/commons/2/26/Alibag_Beach.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/e/e6/Kolaba_Fort_-_Alibag.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Beach_in_alibaug.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/0b/Alibaug_Fort_South_CauseWay.JPG"
  ],
  coverImage: "https://upload.wikimedia.org/wikipedia/commons/2/26/Alibag_Beach.JPG",
  highlights: [
    "Panoramic Arabian Sea views and memorable evening sunsets",
    "Kolaba Fort, a historic sea fort associated with the Maratha naval legacy, visible just offshore",
    "A broad tidal shoreline that changes dramatically between low tide and high tide",
    "Lively beachside food stalls offering local snacks, refreshments, and seasonal treats",
    "Easy access to nearby beaches including Varsoli, Akshi, Kihim, and Nagaon",
    "Traditional Konkani and Malvani cuisine, with seafood specialities available in the surrounding town",
    "A convenient weekend destination for visitors travelling from Mumbai and Pune",
    "Opportunities for coastal photography, heritage exploration, relaxed walks, and family outings"
  ],
  bestSeason: "October to March — Generally pleasant weather for beach walks, sightseeing, fort exploration, and coastal drives. Weekdays are often preferable for a quieter experience, while weekends and public holidays can be crowded.",
  howToReach: {
    byTrain: "Pen is a useful railway connection for the Alibaug region, while local rail and road options vary depending on the starting point. Alibaug does not have a railway station in the town centre. From Pen or another suitable railhead, continue by MSRTC bus, shared vehicle, or taxi. Check current train services and onward connections before travelling.",
    byRoad: "From Mumbai (approximately 95–110 km by road, depending on the starting point and route): Travel via Panvel and Pen towards Alibaug. From Pune (approximately 140–170 km by road): Travel via the Mumbai–Pune Expressway or an appropriate connecting route towards Khopoli, Pen, and Alibaug. Journey times vary with traffic, particularly on weekends.",
    byFerry: "From Mumbai, passenger ferry services commonly operate from the Gateway of India area to Mandwa, subject to season, operator schedules, and weather. From Mandwa Jetty, continue by the operator's connecting bus where offered, or take a taxi or other local transport to Alibaug town and the beach. Ferry services and departure points can change, so verify the current timetable before departure.",
    tip: "For a convenient Mumbai day trip, compare the ferry-plus-road journey with the direct road route. Check Kolaba Fort's tide-dependent access before travelling, and allow additional time on weekends and holidays."
  },
  thingsToDo: [
    "Enjoy a leisurely walk along Alibaug Beach and admire the Arabian Sea",
    "Photograph Kolaba Fort from the shoreline, especially in the softer light of early morning or late afternoon",
    "Explore Kolaba Fort when access is safe, permitted, and consistent with tide conditions",
    "Watch the sunset and enjoy the lively atmosphere of the beach promenade",
    "Sample local street food, roasted corn, seasonal snacks, and refreshments from beachside vendors",
    "Explore Alibaug town's markets and try traditional Konkani and Malvani cuisine",
    "Take a short excursion to Varsoli or Akshi Beach for a quieter coastal experience",
    "Plan a longer beach-hopping trip to Kihim, Awas, or Nagaon",
    "Visit nearby heritage attractions and learn about the region's historic maritime connections",
    "Enjoy horse rides or other beach activities only where currently permitted and operated in accordance with local rules"
  ],
  foodToTry: [
    "Malvani Fish Thali — A regional seafood meal featuring fish curry, rice, fried fish, and traditional coastal spices",
    "Surmai or Pomfret Fry — A popular coastal seafood speciality seasoned with a spicy masala",
    "Solkadhi — A refreshing kokum-based drink, often prepared with coconut milk",
    "Bombil Fry — A much-loved coastal fish preparation available at selected local restaurants",
    "Prawns Masala — Prawns cooked with traditional Malvani spices and coconut",
    "Ghavane with Coconut Chutney — A traditional rice-based Konkani breakfast",
    "Vada Pav, Bhel Puri, and Roasted Corn — Convenient beachside snacks for an evening stroll",
    "Ukdiche Modak — Steamed rice-flour dumplings filled with coconut and jaggery",
    "Seasonal Alphonso Mangoes — A regional favourite during the summer mango season"
  ],
  nearbyPlaces: [
    {
      name: "Kolaba Fort",
      distance: "Approximately 1–2 km offshore from the beach",
      why: "A historic sea fort associated with the Maratha naval legacy, featuring old fortifications, gateways, and views across the Arabian Sea. Access depends on tides, weather, and local arrangements."
    },
    {
      name: "Varsoli Beach",
      distance: "Approximately 2–4 km",
      why: "A quieter coastal stretch near Alibaug town, popular for peaceful walks, coastal scenery, and a more relaxed atmosphere."
    },
    {
      name: "Akshi Beach",
      distance: "Approximately 5–7 km",
      why: "A scenic beach south of Alibaug, known for its relatively peaceful setting, coastal vegetation, and opportunities for long walks."
    },
    {
      name: "Nagaon Beach",
      distance: "Approximately 8–10 km",
      why: "A lively beach destination known for family outings, local food, and seasonal adventure activities offered by local operators."
    },
    {
      name: "Kihim Beach",
      distance: "Approximately 10–12 km",
      why: "A coastal destination surrounded by greenery, with shaded areas, natural scenery, and opportunities for birdwatching and photography."
    },
    {
      name: "Awas Beach",
      distance: "Approximately 7–10 km",
      why: "A quieter stretch of coastline suited to travellers seeking a slower pace, natural scenery, and fewer commercial activities."
    },
    {
      name: "Kankeshwar Temple",
      distance: "Approximately 12–15 km",
      why: "A hilltop Shiva temple reached by a forested uphill walk, offering a spiritual excursion and views of the surrounding landscape."
    },
    {
      name: "Revdanda Fort and Beach",
      distance: "Approximately 18–22 km",
      why: "A heritage and coastal excursion featuring the remains of a historic fort and a beach known for its long shoreline and relaxed village surroundings."
    },
    {
      name: "Kashid Beach",
      distance: "Approximately 30–35 km",
      why: "A popular coastal destination known for its scenic sandy shoreline, coastal greenery, and seasonal beach activities."
    }
  ],
  stayOptions: "Budget to premium — Alibaug offers budget lodges, family-run homestays, guesthouses, boutique hotels, and private villas. Beachside stays are also available in nearby areas such as Varsoli, Kihim, and Nagaon. Rates vary substantially by season, location, amenities, and weekend demand, so confirm availability and the exact property location before booking.",
  entryFee: "General access to Alibaug Beach is usually free. Kolaba Fort may have separate entry arrangements or charges, which should be confirmed locally. Beach activities and rides, where available and permitted, are charged separately by their operators; prices and availability vary.",
  timings: "Alibaug Beach is generally accessible throughout the day, although daylight visits are recommended. Kolaba Fort access is tide-dependent and may be restricted by weather, safety conditions, or local administration. Check local access information before visiting.",
  bestTimeToVisit: "Early morning for a quieter walk and coastal photography; late afternoon through sunset for sea views and the lively beach atmosphere. Plan a Kolaba Fort visit around verified tide and access conditions rather than relying on a fixed daily schedule.",
  warnings: [
    "Do not attempt to walk to Kolaba Fort during rising tides or when waves cover the route. Check tide timings, local guidance, and access restrictions before setting out.",
    "Avoid swimming during rough sea conditions, the monsoon, or whenever local authorities restrict water access.",
    "The beach can become crowded on weekends, public holidays, and during peak tourist periods. Arrive early and plan parking or transport in advance.",
    "Ferry services can be affected by weather, operational changes, and seasonal schedules. Confirm return services before starting your trip.",
    "Do not assume every advertised water sport or beach ride is available or authorised at Alibaug Beach. Check local permissions and operator safety arrangements.",
    "Carry sufficient cash for small vendors and local transport, while checking whether your accommodation and restaurants accept digital payments.",
    "Avoid littering, respect local residents and fishing activities, and follow restrictions around protected or operational areas.",
    "Keep an eye on children near the water, rocky sections, and tidal channels."
  ],
  tags: [
    "beach",
    "family",
    "heritage",
    "kolaba-fort",
    "sunset",
    "photography",
    "weekend-getaway",
    "mumbai-getaway",
    "ferry-trip",
    "malvani-food",
    "seafood",
    "coastal-drive",
    "watersports",
    "konkan"
  ],
  approved: true,
  featured: true,
};

async function updateDestination() {
  console.log("🔍 Checking Firestore for destination with slug:", enrichedData.slug);

  // Look for exact slug 'alibaug-beach' or base slug 'alibaug'
  let snapshot = await db.collection("destinations")
    .where("slug", "==", enrichedData.slug)
    .get();

  if (snapshot.empty) {
    const baseSlug = enrichedData.slug.replace(/-beach$/, "");
    console.log(`ℹ️ Checking alternate base slug: "${baseSlug}"`);
    snapshot = await db.collection("destinations")
      .where("slug", "==", baseSlug)
      .get();
  }

  if (!snapshot.empty) {
    for (const doc of snapshot.docs) {
      await doc.ref.update({
        ...enrichedData,
        // Also keep slug alias or set slug
        slug: enrichedData.slug,
        updatedAt: new Date().toISOString(),
      });
      console.log(`✅ Updated existing document: ${enrichedData.name} (ID: ${doc.id})`);
    }
  } else {
    console.log("ℹ️ No existing document found. Creating new document in Firestore...");
    const docRef = await db.collection("destinations").add({
      ...enrichedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`✅ Created: ${enrichedData.name} (ID: ${docRef.id})`);
  }
}

updateDestination()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Update failed:", err);
    process.exit(1);
  });
