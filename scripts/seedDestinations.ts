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

const destinations = [
  {
    name: "Tarkarli Beach",
    slug: "tarkarli",
    tagline: "Discover the Turquoise Beauty of Konkan",
    shortDescription: "A celebrated Konkan beach known for crystal-clear coastal waters, scuba diving and snorkelling, soft white sands, and authentic Malvani hospitality.",
    description: "Tarkarli Beach is one of the premier coastal destinations in Sindhudurg district, Maharashtra. Located just 6 km south of Malvan, it is famous for its long sandy shoreline, remarkably clear waters, and thrilling marine adventures. The nearby Karli River estuary adds to the region's distinctive coastal beauty. Visitors can experience certified scuba diving and snorkelling excursions when conditions permit, enjoy backwater boat rides, sample world-renowned Malvani seafood, and explore nearby historic landmarks including Sindhudurg Fort and Devbag Sangam. Its harmonious blend of natural coastal charm, water sports, and warm local hospitality makes Tarkarli a top Konkan getaway.",
    category: "beach",
    region: "Sindhudurg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d3/Tarkarli_beach.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/8/8b/Tarkarli_Beach.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/5/55/HOUSE_BOAT_TARKARLI_%282%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a6/Tarkarli_Beach%2C_Malvan.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Tarkarli_beach.JPG",
    highlights: [
      "Crystal-clear turquoise waters with rich marine life and coral beds",
      "Premier destination for beginner & certified scuba diving and snorkelling",
      "Expansive stretch of soft white sand lined with shady shuru and coconut trees",
      "Houseboat stays and scenic backwater cruising along the Karli River",
      "Authentic Malvani coastal cuisine including fresh catch and Solkadhi"
    ],
    bestSeason: "October to March",
    howToReach: {
      byRoad: "Around 6 km south of Malvan town. Well connected from Mumbai (~510 km) and Pune (~390 km) via Kolhapur–Gaganbawda or NH66 Kudal.",
      byTrain: "Kudal Railway Station (KR) is ~32 km away; Kankavli is ~48 km. Readily available cabs and buses link stations to Tarkarli.",
      byFerry: "Local boats operate for dolphin safaris, scuba transfers, and Karli backwater sightseeing.",
      tip: "Book scuba diving and water activities with certified operators possessing valid safety gear and MTDC licenses. Early mornings have the clearest water visibility."
    },
    thingsToDo: [
      "Experience guided scuba diving to explore Konkan corals and marine life",
      "Snorkel in shallow coastal waters near the rocky reef",
      "Take an exhilarating banana ride, bumper ride, or jet ski session",
      "Stay in an MTDC houseboat gently floating on the Karli River backwaters",
      "Taste authentic Malvani seafood thali at rustic beach shacks"
    ],
    foodToTry: [
      "Fresh Pomfret & Surmai Rawa Fry",
      "Authentic Malvani Crab & Prawn Curry",
      "Kombdi Vade (Spiced Chicken with Multi-grain Poori)",
      "Solkadhi (Kokum & Coconut Milk digestive drink)",
      "Traditional Konkani Ukdiche Modak"
    ],
    nearbyPlaces: [
      {
        name: "Sindhudurg Fort",
        distance: "Approximately 8–10 km (road + jetty)",
        why: "Magnificent 17th-century island fortress built by Chhatrapati Shivaji Maharaj."
      },
      {
        name: "Devbag Beach",
        distance: "Approximately 5–7 km",
        why: "Peaceful coastal sand spit where the Karli River meets the Arabian Sea."
      },
      {
        name: "Malvan",
        distance: "Approximately 6 km",
        why: "Bustling coastal hub known for fish markets, seafood, and historic harbour."
      },
      {
        name: "Bhogwe Beach",
        distance: "Approximately 18–22 km",
        why: "Secluded and pristine beach across the river backwaters, ideal for sunset lovers."
      }
    ],
    stayOptions: "MTDC Resort right on the beach, boutique beach resorts, cozy Konkani homestays, and river houseboats.",
    entryFee: "Free beach entry. Scuba diving packages typically range from ₹1,200 to ₹2,500 depending on package and underwater photography.",
    timings: "Accessible all day. Water sports and scuba operations run 7:00 AM to 5:30 PM (October to May).",
    bestTimeToVisit: "October to March provides optimal underwater visibility and pleasant weather. Heavy monsoons (June to September) suspend water sports.",
    warnings: [
      "Do not venture into deep waters without life jackets; check daily red flag warnings.",
      "Ensure scuba diving guides are PADI / SSI / MTDC certified with proper emergency oxygen on board.",
      "Avoid water activities during high swell or sudden storm conditions.",
      "Help protect marine coral reefs; do not stand on or touch underwater coral formations."
    ],
    tags: [
      "tarkarli",
      "tarkarli-beach",
      "beach",
      "sindhudurg",
      "malvan",
      "konkan",
      "scuba-diving",
      "snorkelling",
      "water-sports"
    ],
    featured: true,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
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
    featured: true,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Ganpatipule Beach",
    slug: "ganpatipule-beach",
    tagline: "Where the sacred Swayambhu Ganpati meets the azure waves of Konkan",
    shortDescription: "A picturesque coastal destination in Ratnagiri, famous for its 400-year-old Swayambhu Ganpati Temple on the shore, pristine golden beaches, lush coastal greenery, and thrilling cliffside marine drives.",
    description: "Ganpatipule is one of Maharashtra's most cherished coastal retreats, gracefully uniting profound spiritual heritage with untouched seaside beauty. Perched along the Arabian Sea in Ratnagiri, the shoreline is watched over by the revered Swayambhu Ganpati Temple, where a naturally formed Ganesha idol faces west towards the ocean. The beach features clean golden sand, palm-fringed hills, and tranquil waters perfect for evening strolls and sunset contemplation. Nearby, the dramatic curves of the Aare-Ware marine drive, the open-air Prachin Konkan cultural museum, and the historic battlements of Jaigad Fort offer enriching day trips. Complemented by authentic Malvani seafood, refreshing Solkadhi, and world-famous Alphonso mangoes in summer, Ganpatipule provides an idyllic escape for families, couples, and road-trippers alike.",
    category: "beach",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/6/60/GANPATIPULE_BEACH_%281%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/9b/Shree_Ganpatipule_Mandir_%2852533543261%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/aa/A_Beach_at_GanapatiPule.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/89/MTDCResortBeach_Ganpatipule.JPG"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/6/60/GANPATIPULE_BEACH_%281%29.jpg",
    highlights: [
      "Ancient Swayambhu Ganpati Temple right on the shoreline",
      "Broad golden-sand beach with breathtaking sunset views",
      "Aare-Ware coastal drive with dramatic ocean cliff views",
      "Historic Jaigad Fort & 18th-century British lighthouse",
      "Prachin Konkan open-air cultural & heritage museum",
      "Authentic Malvani cuisine, fresh seafood & Alphonso mangoes"
    ],
    bestSeason: "October to March — Pleasant, breezy weather ideal for temple darshan, beach walks, and sightseeing. April–May is warm but prime season for fresh Ratnagiri Alphonso mangoes.",
    howToReach: {
      byRoad: "340 km from Mumbai via NH66 (7–8 hrs). 290 km from Pune via Satara-Karad (6–7 hrs). Smooth coastal roads connect directly from Ratnagiri city.",
      byTrain: "Ratnagiri Railway Station (30 km) is the primary railhead on the Konkan Railway with frequent express trains. MSRTC buses and prepaid taxis connect to Ganpatipule in 45 minutes.",
      byFerry: "No direct passenger ferry. Coastal ferries can be integrated into broader Konkan road trips via Mandwa or Dighi.",
      tip: "Take the coastal Aare-Ware road route when arriving from Ratnagiri for stunning clifftop sea panoramas."
    },
    thingsToDo: [
      "Seek blessings at the Swayambhu Ganpati Temple as temple bells echo with the sound of breaking waves",
      "Stroll the wide golden sands of Ganpatipule Beach during the magical golden hour sunset",
      "Drive the scenic clifftop curves of the Aare-Ware coastal road with panoramic Arabian Sea lookouts",
      "Walk through recreated ancient Konkan village life and crafts at the Prachin Konkan Museum",
      "Explore the stone bastions of Jaigad Fort and the nearby historic lighthouse overlooking the creek"
    ],
    foodToTry: [
      "Ukdiche Modak — Steamed rice dumplings packed with fresh coconut, cardamom, and jaggery",
      "Surmai & Pomfret Fry — Fresh coastal catch crisped to perfection with spicy red Malvani masala",
      "Solkadhi — A soothing digestive cooler made with wild kokum fruit and fresh coconut milk",
      "Malvani Fish Thali — Hearty regional platter with coastal fish curry, steamed rice, and hot Ghavane",
      "Ratnagiri Aamras & Mangoes — 100% pure seasonal Alphonso mango pulp served with soft puris"
    ],
    nearbyPlaces: [
      {
        name: "Bhandarpule Beach",
        distance: "4 km",
        why: "A peaceful, secluded crescent of soft sand nestled between lush green headlands with minimal crowds."
      },
      {
        name: "Aare-Ware Beach",
        distance: "9 km",
        why: "Breathtaking twin beaches connected by Maharashtra's most scenic clifftop coastal road."
      },
      {
        name: "Prachin Konkan Museum",
        distance: "2 km",
        why: "A 3-acre open-air museum depicting traditional Konkan rural occupations, heritage, and sculpture."
      },
      {
        name: "Jaigad Fort & Lighthouse",
        distance: "20 km",
        why: "Historic coastal bastion built at the confluence of the Shastri River and Arabian Sea."
      },
      {
        name: "Malgund Village",
        distance: "3 km",
        why: "Birthplace of renowned Marathi poet Keshavsut, featuring a preserved ancestral home and memorial."
      },
      {
        name: "Ratnagiri Town",
        distance: "30 km",
        why: "District capital famous for Ratnadurg Fort, Thibaw Palace, seafood markets, and mango orchards."
      }
    ],
    stayOptions: "Ganpatipule offers diverse stays: MTDC Beach Resort sits right on the shoreline with prime sea-facing cottages. Luxury travelers can choose boutique cliffside resorts along the Aare-Ware road. For authentic hospitality, family-run Konkani homestays in Malgund and Ganpatipule town provide clean rooms with delicious home-cooked Malvani meals. Budget dharamshalas and lodges are available near the temple.",
    entryFee: "Free access to the beach. Temple darshan is free. Prachin Konkan Museum has a nominal entry fee (~₹40). Water sports, when active, are charged separately by authorized operators.",
    timings: "Beach is accessible 24/7 (daylight visits recommended). Swayambhu Ganpati Mandir darshan is typically open 5:00 AM to 9:00 PM with daily aartis at 5:00 AM, 12:00 PM, and 7:00 PM.",
    bestTimeToVisit: "Early mornings for peaceful temple darshan; late afternoons (4 PM to 7 PM) for coastal drives and golden sunsets. October through March is the most comfortable season.",
    warnings: [
      "⚠️ Strong underwater currents and steep seabed drop-offs: Swimming is hazardous. Only enter water where lifeguards permit.",
      "🌧️ Monsoon Caution: Heavy swells and rough seas from June to September. Water activities are suspended.",
      "🛕 Temple Etiquette: Modest attire is required for Swayambhu Mandir. Photography is prohibited inside the inner sanctum.",
      "💵 Cash & Connectivity: Keep adequate cash handy as mobile network and card machines can be erratic near the beach."
    ],
    tags: [
      "beach",
      "temple",
      "spiritual",
      "family",
      "sunset",
      "photography",
      "weekend-getaway",
      "ratnagiri",
      "malvani-food",
      "seafood",
      "nature",
      "road-trip"
    ],
    featured: true,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Malvan",
    slug: "malvan",
    description: "Malvan is the culinary and cultural heart of Sindhudurg — famous for authentic Malvani cuisine, the majestic Sindhudurg Fort built by Chhatrapati Shivaji Maharaj, and some of the best scuba diving spots on the western coast of India.",
    category: "fort",
    region: "Sindhudurg",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
    highlights: ["Sindhudurg Fort", "Malvani Cuisine", "Scuba Diving", "Rock Garden Beach", "Tsunami Island"],
    bestSeason: "October to March",
    howToReach: "Nearest railway station is Kudal (38 km). Regular buses connect Kudal to Malvan. By road, Malvan is 550 km from Mumbai via the coastal NH66.",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Dapoli",
    slug: "dapoli",
    description: "Dapoli is Konkan's best-kept secret — a serene hill station by the sea with red-roofed villages, mango orchards, empty beaches, and ancient temples. Often called the 'Mahabaleshwar of Konkan', it offers a peaceful retreat far from the crowds.",
    category: "beach",
    region: "Ratnagiri",
    images: [
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    ],
    highlights: ["Keshavraj Temple", "Murud Beach", "Anjarle Beach", "Dolphin Watching", "Mango Orchards"],
    bestSeason: "October to May",
    howToReach: "Nearest railway station is Khed (30 km). From Mumbai, take the Konkan Railway to Khed then a local bus or taxi. By road it is 215 km from Mumbai.",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Harihareshwar",
    slug: "harihareshwar",
    description: "Known as the 'Kashi of the South', Harihareshwar is a sacred town where three rivers meet the Arabian Sea. The ancient Harihareshwar temple dedicated to Lord Shiva sits dramatically on a cliff overlooking the sea, making it one of the most spiritual destinations on the Konkan coast.",
    category: "temple",
    region: "Raigad",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
      "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800&q=80",
      "https://images.unsplash.com/photo-1561016444-14f747499547?w=800&q=80",
    ],
    highlights: ["Harihareshwar Temple", "Confluence of Rivers", "Black Sand Beach", "Srivardhan Beach", "Cliff Views"],
    bestSeason: "October to March",
    howToReach: "Take the ferry from Dighi or drive via NH66. From Mumbai it is 200 km via Alibaug and Shrivardhan. Nearest railway station is Mangaon (65 km).",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Vengurla",
    slug: "vengurla",
    description: "Vengurla is a tranquil town at the southern tip of Maharashtra's coastline, known for its coconut groves, cashew plantations, and the beautiful Vengurla Rocks — a group of islets teeming with wildlife. The town has a distinct Portuguese influence visible in its architecture.",
    category: "beach",
    region: "Vengurla",
    images: [
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&q=80",
      "https://images.unsplash.com/photo-1533760881669-80db4d7b341c?w=800&q=80",
      "https://images.unsplash.com/photo-1490077476659-095159692ab5?w=800&q=80",
    ],
    highlights: ["Vengurla Rocks", "Savantwadi Palace", "Cashew Plantations", "Shiroda Beach", "Portuguese Architecture"],
    bestSeason: "November to February",
    howToReach: "Nearest railway station is Kudal (20 km) or Sawantwadi (22 km) on the Konkan Railway. By road it is 600 km from Mumbai via NH66.",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Guhagar",
    slug: "guhagar",
    description: "Guhagar is one of the most unspoiled beaches in Maharashtra — an 8 km stretch of golden sand backed by casuarina trees with barely a tourist in sight. The town is known for its Vyakeshwar temple, traditional Konkan houses, and exceptional sunsets over the Arabian Sea.",
    category: "beach",
    region: "Guhagar",
    images: [
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1527489377706-5bf97e608852?w=800&q=80",
    ],
    highlights: ["8 km Empty Beach", "Vyakeshwar Temple", "Sunset Views", "Traditional Villages", "Turtle Nesting"],
    bestSeason: "October to March",
    howToReach: "Nearest railway station is Chiplun (45 km). By road from Mumbai it is 270 km via NH66 and then the coastal road through Chiplun.",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Murud-Janjira",
    slug: "murud-janjira",
    description: "Murud-Janjira is home to the most formidable sea fort in Asia — the Janjira Fort, which was never conquered by the Marathas, Mughals, Portuguese, or British. The fort stands on an island 90 metres from the shore and is accessible only by boat, making it a truly dramatic historical experience.",
    category: "fort",
    region: "Raigad",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    ],
    highlights: ["Janjira Sea Fort", "Boat Rides", "Murud Beach", "Dattatreya Temple", "Nawab Palace"],
    bestSeason: "October to March",
    howToReach: "From Mumbai take a bus to Alibaug or Roha, then connect to Murud. The total journey is around 165 km by road. Ferries run from Rajpuri to the fort.",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Ratnagiri",
    slug: "ratnagiri",
    description: "Ratnagiri is the land of Alphonso mangoes and the birthplace of Lokmanya Bal Gangadhar Tilak. This vibrant port city offers a rich blend of history, culture, and natural beauty — from the imposing Ratnadurg Fort to the stunning Bhatye Beach and the famous Thibaw Palace.",
    category: "other",
    region: "Ratnagiri",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
      "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&q=80",
    ],
    highlights: ["Alphonso Mangoes", "Ratnadurg Fort", "Thibaw Palace", "Bhatye Beach", "Tilak Museum"],
    bestSeason: "October to May",
    howToReach: "Well connected by Konkan Railway — Ratnagiri is a major station. By road it is 350 km from Mumbai via NH66. Regular MSRTC buses run from Mumbai.",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Amboli",
    slug: "amboli",
    description: "Amboli is a misty hill station perched at 690 metres on the edge of the Western Ghats — the last hill station before the Konkan coast drops to the sea. Famous for its spectacular waterfalls, endemic wildlife, and the dramatic viewpoint where you can see the entire Konkan coastline stretching below.",
    category: "waterfall",
    region: "Sindhudurg",
    images: [
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    ],
    highlights: ["Amboli Waterfalls", "Sunset Viewpoint", "Endemic Wildlife", "Hiranyakeshi Temple", "Fog & Mist"],
    bestSeason: "June to September",
    howToReach: "Nearest railway station is Sawantwadi (30 km). By road from Mumbai it is 490 km via Kolhapur. MSRTC buses connect Belgaum and Kolhapur to Amboli.",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Devgad Fort",
    slug: "devgad-fort",
    tagline: "Where ancient laterite ramparts guard the Arabian Sea and Devgad harbour",
    shortDescription: "A historic coastal fort in Sindhudurg perched dramatically above Devgad harbour and the Arabian Sea. Renowned for its weathering laterite fortifications, historic cannons, Devgad Lighthouse, and panoramic coastal sunsets.",
    description: "Devgad Fort is an evocative coastal fortress perched high on a rocky promontory in Sindhudurg, where the serene waters of Devgad harbour open into the vast Arabian Sea. Built with weathered laterite stone and guarded by historic Maratha cannons, the fort played a vital role in coastal defense and maritime trade along Maharashtra's Konkan coastline. Within its walls stands the active Devgad Lighthouse, guiding ships through coastal shipping channels. Visitors are treated to breathtaking 360-degree panoramas of the fishing harbour, turquoise waters, and undulating green coastline. Perfectly combined with Devgad Beach, the sacred Kunkeshwar Temple, and local Malvani seafood, Devgad Fort offers a captivating blend of heritage and coastal tranquility.",
    category: "fort",
    region: "Sindhudurg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/c/c9/Devgad_fort.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Devgad_fort_entrance.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/9/90/A_cannon_on_fort_Devgad.JPG"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Devgad_fort.JPG",
    highlights: [
      "Panoramic 360° views of the Arabian Sea and busy Devgad fishing harbour",
      "Historic laterite stone ramparts, arched gateways & centuries-old Maratha cannons",
      "Devgad Lighthouse situated within the fort complex with maritime displays",
      "Spectacular golden-hour coastal sunset photography over rocky cliffs",
      "Close to clean Devgad Beach, Kunkeshwar Temple & world-famous Alphonso orchards"
    ],
    bestSeason: "October to March — Pleasant coastal breezes and clear horizons. Monsoon (June–Sept) brings dramatic sea swells and lush green cliffs, but rampart paths become slippery.",
    howToReach: {
      byRoad: "480 km from Mumbai via NH66 (8–9 hrs); 390 km from Pune via Kolhapur-Gaganbawda Ghat (7–8 hrs). Good motorable roads connect directly to the fort gate.",
      byTrain: "Kankavli Railway Station (55 km) or Nandgaon Road (45 km) on the Konkan Railway. Frequent MSRTC buses and taxis connect to Devgad town in 1 hour.",
      byFerry: "No direct commercial passenger ferry. Local boat crossings operate for nearby fishing hamlets.",
      tip: "Visit between 4:00 PM and 6:30 PM to catch both the operational lighthouse opening and the sunset over Devgad harbour."
    },
    thingsToDo: [
      "Walk along the laterite stone ramparts and explore centuries-old iron cannons overlooking the sea",
      "Climb up to the Devgad Lighthouse gallery for sweeping aerial views of the coastline and harbour",
      "Capture sunset photography as fishing trawlers return with the evening catch through the harbour mouth",
      "Relax at the nearby Devgad Beach with peaceful coastal strolls and coconut water",
      "Savor authentic Malvani Surmai fry, Solkadhi, and seasonal Devgad Alphonso mangoes in town"
    ],
    foodToTry: [
      "Malvani Surmai or Pomfret Fry — Fresh harbor catch crisped with spicy Malvani coastal masala",
      "Solkadhi — Traditional digestive cooler pressed from wild kokum and freshly grated coconut milk",
      "Devgad Alphonso Mangoes — World-famous GI-tagged Hapus mangoes harvested fresh from March to May",
      "Malvani Fish Thali — Wholesome platter of spicy fish curry, steamed rice, and soft Ghavane",
      "Ukdiche Modak — Steamed fragrant rice dumplings stuffed with fresh coconut and jaggery"
    ],
    nearbyPlaces: [
      {
        name: "Devgad Beach",
        distance: "3 km",
        why: "Clean, scenic sandy shoreline ideal for relaxing walks after touring the fort.",
        slug: "devgad"
      },
      {
        name: "Kunkeshwar Temple & Beach",
        distance: "16 km",
        why: "Ancient coastal Shiva temple dubbed the 'Kashi of South Konkan' right on the sea.",
        slug: "kunkeshwar-beach"
      },
      {
        name: "Vijaydurg Fort",
        distance: "32 km",
        why: "Magnificent Maratha sea fort surrounded on three sides by the Arabian Sea.",
        slug: "vijaydurg"
      },
      {
        name: "Devgad Harbour",
        distance: "1 km",
        why: "Bustling coastal fishing harbour showcasing local maritime and fishermen life.",
        slug: "devgad"
      },
      {
        name: "Mithmumbari Beach",
        distance: "12 km",
        why: "Peaceful coastal village beach framed by emerald hills and calm waters.",
        slug: "devgad"
      }
    ],
    stayOptions: "Devgad town offers family-run guesthouses, MTDC-approved homestays, and comfortable coastal lodges within 3 km of the fort. For seaside resorts, explore beachside stays near Kunkeshwar Beach (16 km) or Vijaydurg.",
    entryFee: "Fort entry is free. Devgad Lighthouse charges a nominal ticket (~₹10–₹20 per adult).",
    timings: "Fort is open daily from 6:00 AM to 6:30 PM. Devgad Lighthouse is generally accessible to visitors from 4:00 PM to 5:30 PM (subject to port authority).",
    bestTimeToVisit: "Late afternoons (4:00 PM to 6:30 PM) for comfortable weather, lighthouse visit, and sunset over the harbour.",
    warnings: [
      "⚠️ High clifftop edges without railings: Exercise strict caution near rampart drops, especially on windy evenings.",
      "👟 Uneven laterite steps: Wear sturdy walking shoes or sneakers with good traction.",
      "🌊 Sea swimming restriction: Waters below the fort have dangerous submerged rocks and strong undercurrents.",
      "💵 Cash recommended: Carry sufficient cash for local taxis and auto-rickshaws as network can fluctuate."
    ],
    tags: ["fort", "heritage", "lighthouse", "sindhudurg", "devgad", "sunset", "photography", "malvani-food", "maratha-history"],
    approved: true,
    featured: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Jaigad Fort",
    slug: "jaigad-fort",
    tagline: "Where the Shastri River meets the Arabian Sea atop dramatic coastal battlements",
    shortDescription: "A commanding 16th-century coastal fortress in Ratnagiri, perched on a cliff where the Shastri River flows into the Arabian Sea. Celebrated for its deep moats, massive stone bastions, and the nearby 1899 British lighthouse.",
    description: "Dramatically situated on a rocky headland in Ratnagiri district, Jaigad Fort guards the strategic confluence of the Shastri River and the Arabian Sea. Constructed in the 16th century and later fortified by Maratha naval commander Kanhoji Angre, the fort features formidable stone ramparts, a deep defensive moat carved into laterite rock, and expansive bastions that once commanded coastal shipping channels. Within walking distance stands the historic Jaigad Lighthouse, built in 1899, offering panoramic ocean vistas. Just 20 km north of Ganpatipule, Jaigad Fort pairs seamlessly with the pristine Aare-Ware coastal drive and authentic Malvani culinary stops.",
    category: "fort",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/f/f0/Jaigad_Fort.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/07/Jaigad_Fort_-_panoramio_%281%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Jaigad_outerwall1.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Jaigad_Fort.jpg",
    highlights: [
      "Strategic cliffside fortress overlooking the Shastri River estuary & Arabian Sea",
      "Surviving 16th-century stone ramparts, laterite moat, and high bastions",
      "Historic 1899 Jaigad Lighthouse with cast-iron spiral staircase and sea views",
      "Picturesque ferry crossing between Jaigad and Tawsal connecting toward Guhagar",
      "Panoramic vistas of fishing fleets and passing ships along Konkan maritime routes"
    ],
    bestSeason: "October to February — Cool coastal air and clear skies ideal for exploring fortifications. Post-monsoon (September–October) showcases lush green coastal plateaus.",
    howToReach: {
      byRoad: "330 km from Mumbai via NH66 (7–8 hrs); 290 km from Pune via Karad-Chiplun (6–7 hrs). 20 km scenic drive from Ganpatipule.",
      byTrain: "Ratnagiri Railway Station (45 km) is the primary railhead. Taxis and MSRTC buses connect via Ganpatipule.",
      byFerry: "Car and passenger ferry connects Jaigad jetty to Tawsal across the estuary, saving 80 km toward Guhagar.",
      tip: "Take the scenic coastal road from Ganpatipule to Jaigad, and pair it with the Tawsal ferry if continuing north."
    },
    thingsToDo: [
      "Walk the perimeter of the ancient outer ramparts and inspect the deep laterite dry moat",
      "Climb the bastions to watch river waters merge with the waves of the Arabian Sea",
      "Visit the historic Jaigad Lighthouse and take in bird's-eye views of the estuary",
      "Board the Tawsal-Jaigad vehicle ferry across the creek for a scenic water crossing",
      "Stop at Ganpatipule Beach and Swayambhu Temple on your return route"
    ],
    foodToTry: [
      "Malvani Prawns Masala — Succulent coastal prawns simmered in coconut gravy and roasted spices",
      "Fresh Surmai Fry — Crispy fried kingfish seasoned with Konkani chili-garlic marinade",
      "Solkadhi — Chilled kokum and coconut milk nectar infused with garlic and fresh coriander",
      "Ghavane with Coconut Chutney — Lacy steamed rice crepes served hot for breakfast",
      "Ratnagiri Alphonso Mango Pulp (Aamras) — Pure sweet seasonal pulp served with warm puris"
    ],
    nearbyPlaces: [
      {
        name: "Ganpatipule Beach",
        distance: "18 km",
        why: "Iconic beach destination with the 400-year-old seaside Swayambhu Ganpati Temple.",
        slug: "ganpatipule-beach"
      },
      {
        name: "Prachin Konkan Museum",
        distance: "17 km",
        why: "Open-air heritage museum depicting traditional rural Konkan life and crafts.",
        slug: "prachin-konkan"
      },
      {
        name: "Aare-Ware Beach",
        distance: "25 km",
        why: "Stunning twin crescent beaches connected by a clifftop ocean road.",
        slug: "aare-ware-beach"
      },
      {
        name: "Malgund Village",
        distance: "15 km",
        why: "Birthplace of famed Marathi poet Keshavsut, with a dedicated memorial.",
        slug: "malgund"
      },
      {
        name: "Guhagar Beach",
        distance: "35 km",
        why: "Expansive white-sand beach accessed quickly via the Jaigad–Tawsal ferry.",
        slug: "guhagar"
      }
    ],
    stayOptions: "Jaigad offers quaint village homestays and small coastal inns. For upscale resorts, beachfront cottages, and MTDC resort stays, stay in nearby Ganpatipule (18 km) or along the Aare-Ware coastline.",
    entryFee: "Fort entry is free. Jaigad Lighthouse entry is ~₹10–₹20 per visitor.",
    timings: "Fort is open 6:00 AM to 6:30 PM daily. Jaigad Lighthouse is open 4:00 PM to 5:00 PM for public access.",
    bestTimeToVisit: "Late afternoon (3:30 PM to 6:00 PM) for comfortable exploration of the ramparts and the lighthouse golden hour.",
    warnings: [
      "⚠️ Deep dry moat and sheer cliff drops: Keep close watch on children; avoid sitting on outer parapets.",
      "👟 Rough stone pathways: Wear supportive sports shoes as the fort interior has wild grass and loose stone.",
      "⛴️ Ferry schedules: Check Tawsal–Jaigad ferry timing in advance if planning to cross north towards Guhagar.",
      "💧 Water & snacks: Few shops exist near the fort gate; carry drinking water."
    ],
    tags: ["fort", "heritage", "ratnagiri", "lighthouse", "ganpatipule", "maratha-history", "coastal-views", "ferry"],
    approved: true,
    featured: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Korlai Fort",
    slug: "korlai-fort",
    tagline: "Where 16th-century Portuguese battlements meet the Arabian Sea and Revdanda Creek",
    shortDescription: "A dramatic Portuguese-era hilltop sea fort in Raigad district, built on an island-like coastal ridge (Morro de Chaul). Renowned for its stone ramparts, historic church ruins, vibrant red-and-white lighthouse, and the rare Indo-Portuguese Creole culture of Korlai village.",
    description: "Korlai Fort (historically Morro de Chaul) is a striking 16th-century Portuguese fortress occupying a dramatic rocky ridge near Revdanda in Raigad district. Surrounded on three sides by the Arabian Sea and the Kundalika river estuary, the fort once guarded the vital maritime approach to the historic port city of Chaul. Today, visitors can explore weathered stone ramparts, battery bastions, arched doorways, and the ruins of an ancient chapel. On the slope of the hill stands the operational Korlai Lighthouse, offering stunning coastal vistas. At the base of the fort lies Korlai fishing village, home to a unique community that has preserved Kristi (an Indo-Portuguese Creole language) and maritime traditions for five centuries.",
    category: "fort",
    region: "Raigad",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/5/50/Korlai4.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d4/Korlai.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/68/Korlai_fort_entrance.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/5/50/Korlai4.jpg",
    highlights: [
      "16th-century Portuguese fortress perched on a scenic ridge surrounded by sea",
      "Well-preserved stone ramparts, bastion lookouts & historic chapel ruins",
      "Active red-and-white Korlai Lighthouse offering panoramic ocean views",
      "Cultural heritage of Korlai village, where residents speak a 500-year-old Portuguese Creole",
      "Spectacular viewpoint over Revdanda Creek, Chaul harbour, and Arabian Sea beaches"
    ],
    bestSeason: "October to March — Pleasant coastal temperatures and breezy walks up the fort trail. Monsoon brings lush green landscapes and dramatic crashing surf, but stairs get slippery.",
    howToReach: {
      byRoad: "125 km from Mumbai via Panvel-Pen-Alibaug route (3–3.5 hrs). 160 km from Pune via Khopoli-Pen (4 hrs). Drive directly to the lighthouse parking lot.",
      byFerry: "Speedboats and passenger catamarans operate from Gateway of India (Mumbai) to Mandwa Jetty (60 mins), followed by a 45-minute connecting bus or cab through Alibaug.",
      byTrain: "Roha Railway Station (40 km) or Panvel (85 km). Taxis and MSRTC buses connect via Revdanda.",
      tip: "Park near the Korlai Lighthouse and take the short 15-minute stone staircase hike to the fort summit."
    },
    thingsToDo: [
      "Hike the scenic stone trail from the lighthouse up through the historic Portuguese arched gateways",
      "Explore the central battery bastion and surviving walls of the 16th-century chapel",
      "Visit the Korlai Lighthouse (open late afternoon) and climb to its viewing gallery",
      "Stroll through Korlai fishing village to observe traditional wooden trawlers and unique cultural architecture",
      "Combine with Revdanda Fort ruins and relaxing sunset walks along Revdanda Beach"
    ],
    foodToTry: [
      "Alibaug-style Pomfret Tawa Fry — Fresh catch crusted with semolina (rava) and spicy coastal marinade",
      "Crab or Prawns Masala — Sweet coastal crustaceans stewed in a thick roasted coconut and onion gravy",
      "Solkadhi — Pink digestive cooler pressed from wild kokum petals and fresh coconut milk",
      "Konkani Fish Curry & Rice — Homestyle spicy curry served with steaming hot Indrayani rice",
      "Ukdiche Modak — Melt-in-mouth steamed modaks filled with freshly grated coconut and melted jaggery"
    ],
    nearbyPlaces: [
      {
        name: "Revdanda Fort & Beach",
        distance: "6 km",
        why: "Historic Portuguese coastal fort ruins embedded into a tranquil black-sand beach.",
        slug: "revdanda-fort-beach"
      },
      {
        name: "Kashid Beach",
        distance: "16 km",
        why: "Famous white-sand beach framed by casuarina groves with popular water sports.",
        slug: "kashid"
      },
      {
        name: "Murud-Janjira Fort",
        distance: "42 km",
        why: "Impregnable sea fort built on an island in the Arabian Sea with 19 bastions.",
        slug: "murud-janjira"
      },
      {
        name: "Nagaon Beach",
        distance: "18 km",
        why: "Lively family-friendly flat beach known for water sports and coastal homestays.",
        slug: "alibaug-beach"
      },
      {
        name: "Alibaug Beach",
        distance: "22 km",
        why: "Popular coastal hub with direct views of the historic Kolaba sea fort.",
        slug: "alibaug-beach"
      }
    ],
    stayOptions: "Charming seaside homestays and heritage villas operate in Korlai village and Revdanda (5–10 min drive). Luxury beach resorts and boutique hotels are located in nearby Kashid (16 km) and Alibaug (22 km).",
    entryFee: "Fort entry is free. Korlai Lighthouse entry is ₹10 for adults, ₹5 for children (cameras may attract a nominal fee).",
    timings: "Fort is accessible 6:00 AM to 6:00 PM. Korlai Lighthouse is open to visitors from 4:00 PM to 5:30 PM daily.",
    bestTimeToVisit: "Early morning (7 AM–9:30 AM) for a cool uphill hike; late afternoon (4 PM–6 PM) for lighthouse access and ocean sunset.",
    warnings: [
      "🧗 Uneven rock steps: Wear shoes with firm grip; the uphill climb has exposed stone and no shade.",
      "☀️ Sun exposure: Very little canopy on the fort plateau; carry drinking water, sunglasses, and a sun hat.",
      "⚠️ Steep drop-offs: Watch children carefully around un-railed cliff ramparts over the sea.",
      "🌊 Sea currents: Shoreline around Korlai headland is rocky with dangerous undertows; do not swim here."
    ],
    tags: ["fort", "heritage", "portuguese-history", "raigad", "alibaug", "lighthouse", "hiking", "coastal-views", "sunset"],
    approved: true,
    featured: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Revdanda Fort and Beach",
    slug: "revdanda-fort-beach",
    tagline: "Where weathered Portuguese fort ruins meet tranquil tides and swaying palm groves",
    shortDescription: "A unique coastal destination in Raigad district near Alibaug, where 16th-century Portuguese fortress walls merge seamlessly with a serene black-sand beach, betel nut plantations, and traditional fishing village life.",
    description: "Revdanda Fort and Beach offer one of Konkan's most romantic and historic coastal escapes. Built by the Portuguese in 1558 at the mouth of the Kundalika River (historically known as Agarkot), Revdanda Fort was once an imposing citadel with towering stone walls, cannon bastions, and a 4-storey watchtower (Saat Khamb). Today, portions of the ancient fortifications stand intertwined with coastal greenery and sandy shoreline. Stretching beside the ruins is Revdanda Beach, a peaceful, wide expanse of soft dark sand known for calm waves, palm-shaded shores, and mesmerizing Arabian Sea sunsets. Unlike commercialized beaches, Revdanda retains an authentic coastal rhythm with local fishermen, coastal camping, and fresh Malvani seafood.",
    category: "beach",
    region: "Raigad",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Revdanda_Fort_outer_walls_01.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/4/43/Revdanda_Fort_03.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Revdanda_Fort_04.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/5/51/Revdanda_Fort_outer_walls_01.JPG",
    highlights: [
      "16th-century Portuguese fort ruins directly adjoining the sandy beach",
      "Saat Khamb (Seven Pillars) watchtower ruins and ancient stone gun ports",
      "Expansive, peaceful black-sand beach ideal for long walks and quiet relaxation",
      "Lush background of betel-nut (supari) groves and coconut palm orchards",
      "Popular beachside camping under starry skies with evening bonfires",
      "Convenient location between Alibaug, Korlai Fort, and Kashid Beach"
    ],
    bestSeason: "October to February — Cool sea breezes, pleasant daytime weather, and ideal conditions for beach strolls and camping. Monsoon offers dramatic dark surf and lush surroundings.",
    howToReach: {
      byRoad: "120 km from Mumbai via Panvel and Pen (3 hrs); 155 km from Pune via Khopoli-Pen route (3.5–4 hrs). Smooth coastal highways connect directly to Revdanda.",
      byFerry: "Ferry from Gateway of India to Mandwa Jetty (50 mins), then connecting MSRTC bus or cab (40 mins) to Revdanda.",
      byTrain: "Roha Railway Station (35 km) or Pen (45 km). Connecting local buses and auto-rickshaws run frequently.",
      tip: "Visit during late afternoon when the tide recedes to explore both the fort ruins and the beach on foot."
    },
    thingsToDo: [
      "Wander among the ancient Portuguese stone arches and bastions embedded right in the beach sand",
      "Photograph the iconic Saat Khamb tower ruins framed against the Arabian Sea",
      "Walk barefoot along the wide, quiet black sands during golden hour sunset",
      "Experience beachfront camping with authorized operators under starlit skies",
      "Savor home-style Malvani fish curries and hot Poha at village beachfront shacks"
    ],
    foodToTry: [
      "Surmai Rava Fry — Thick fillets of fresh kingfish coated in semolina and pan-fried crisp",
      "Malvani Prawns Masala — Coastal prawns cooked with freshly roasted spices and grated coconut",
      "Solkadhi — Refreshing pink cooler of wild kokum and freshly extracted coconut milk",
      "Ghavane with Chutney — Soft, lacy rice-flour crepes served with sweet or spicy coconut chutney",
      "Fresh Tender Coconut — Refreshing sweet coconut water cut fresh at seaside village stands"
    ],
    nearbyPlaces: [
      {
        name: "Korlai Fort & Lighthouse",
        distance: "6 km",
        why: "Portuguese hill fortress with stunning views across the creek and an active lighthouse.",
        slug: "korlai-fort"
      },
      {
        name: "Kashid Beach",
        distance: "15 km",
        why: "Pristine white-sand bay famous for watersports and casuarina trees.",
        slug: "kashid"
      },
      {
        name: "Alibaug Beach & Kolaba Fort",
        distance: "18 km",
        why: "Lively coastal town with low-tide walking access to the historic Kolaba sea fort.",
        slug: "alibaug-beach"
      },
      {
        name: "Nagaon Beach",
        distance: "12 km",
        why: "Flat sandy beach known for parasailing, jet-skis, and family homestays.",
        slug: "alibaug-beach"
      },
      {
        name: "Murud-Janjira Fort",
        distance: "45 km",
        why: "Unconquered island sea fort located a scenic drive south past Kashid.",
        slug: "murud-janjira"
      }
    ],
    stayOptions: "Revdanda offers tranquil beachside homestays, agro-tourism farms in coconut wadis, and licensed coastal tent camping sites. For resort amenities and pools, Kashid (15 km) and Alibaug (18 km) provide boutique hotels and villas.",
    entryFee: "Free access to both the beach and the historic fort ruins.",
    timings: "Accessible 24/7. Daytime visits (7:00 AM to 6:30 PM) recommended for exploring the fort ruins safely.",
    bestTimeToVisit: "Late afternoons (4:00 PM to 6:30 PM) for comfortable temperatures, magical sunset light, and safe tides.",
    warnings: [
      "⚠️ Weathered masonry: Do not climb broken or crumbling fort walls; watch for loose laterite stones.",
      "🌊 Tidal awareness: Check high tide timings; some fort sections and rocks get submerged during peak tide.",
      "⛺ Camping safety: Only camp with verified, licensed local operators who provide security and basic facilities.",
      "💵 Carry cash: Many village food stalls and auto drivers have limited digital payment connectivity."
    ],
    tags: ["beach", "fort", "heritage", "portuguese-history", "raigad", "alibaug", "revdanda", "camping", "sunset", "malvani-food"],
    approved: true,
    featured: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Devgad Beach",
    slug: "devgad-beach",
    tagline: "Golden sands, whispering casuarinas, and gentle Arabian Sea sunsets",
    shortDescription: "A serene crescent of soft golden sand in Sindhudurg, offering tranquil coastal walks, sweeping sea views, local fishing boats, and close proximity to Devgad Fort and world-famous Alphonso mango groves.",
    description: "Devgad Beach is an idyllic coastal haven in Sindhudurg where the gentle waves of the Arabian Sea lap against a broad curve of golden sand. Sheltered between rolling laterite headlands, the beach offers a peaceful escape from crowded tourist hubs. Visitors can take peaceful barefoot walks along the tide line, watch traditional wooden fishing trawlers glide across the horizon, and take in glorious Konkan sunsets. Just 3 km from historic Devgad Fort and the active fishing harbour, Devgad Beach is the perfect spot to unwind, sip sweet coconut water, and enjoy fresh Malvani seafood.",
    category: "beach",
    region: "Sindhudurg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9a/Deogad_Beach_in_Sindhudurg_district_%2CKonkan_region_Maharashtra%2C_India.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/5/55/Devgad_Beach_from_a_Hill.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Devgad_beach%2C_Maharashtra.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Deogad_Beach_in_Sindhudurg_district_%2CKonkan_region_Maharashtra%2C_India.JPG",
    highlights: [
      "Broad crescent beach with calm waters and soft golden sand",
      "Spectacular sunset views over the open Arabian Sea horizon",
      "Traditional wooden fishing boats dotting the peaceful shoreline",
      "Within 3 km of Devgad Fort, Lighthouse, and fishing harbour",
      "Surrounded by world-famous Devgad Alphonso mango orchards"
    ],
    bestSeason: "October to March — Pleasant coastal breezes and calm seas ideal for walking. April–May is warm but prime season for fresh Devgad Alphonso mangoes.",
    howToReach: {
      byRoad: "480 km from Mumbai via NH66 (8–9 hrs); 390 km from Pune via Kolhapur-Gaganbawda (7–8 hrs). Good motorable road directly to the beach.",
      byTrain: "Kankavli Railway Station (55 km) or Nandgaon Road (45 km). Regular state buses and private taxis connect to Devgad town in 1 hour.",
      byFerry: "No regular passenger ferry. Road access from Devgad town is the most convenient.",
      tip: "Pair a morning walk on Devgad Beach with an afternoon visit to Devgad Fort and the lighthouse gallery."
    },
    thingsToDo: [
      "Take a relaxing barefoot walk along the firm golden sands at low tide",
      "Capture glowing sunset photos with fishing boats in the silhouette",
      "Explore historic Devgad Fort and its panoramic clifftop lighthouse (3 km away)",
      "Visit the bustling Devgad fishing harbour and sample fresh catch at local shacks",
      "Taste authentic GI-tagged Devgad Alphonso mangoes during harvest season (March–May)"
    ],
    foodToTry: [
      "Surmai or Pomfret Fry — Fresh local catch marinated in fiery Malvani masala and rava-crusted",
      "Malvani Fish Thali — Wholesome plate with spicy fish curry, steamed rice, and solkadhi",
      "Solkadhi — Pink digestive cooler made of fresh coconut milk and wild kokum",
      "Ghavane with Chutney — Soft, lacy steamed rice crepes served hot for breakfast",
      "Devgad Alphonso Mangoes — World-renowned fragrant mangoes available fresh in summer"
    ],
    nearbyPlaces: [
      {
        name: "Devgad Fort",
        distance: "3 km",
        why: "Historic laterite sea fort featuring Maratha cannons, panoramic views, and a lighthouse.",
        slug: "devgad-fort"
      },
      {
        name: "Devgad Harbour",
        distance: "2 km",
        why: "Vibrant fishing harbour showcasing traditional boats and coastal maritime trade.",
        slug: "devgad-harbour"
      },
      {
        name: "Mithmumbari Beach",
        distance: "12 km",
        why: "Secluded pristine beach nestled beside green hills and tranquil village backdrops.",
        slug: "mithmumbari-beach"
      },
      {
        name: "Kunkeshwar Temple & Beach",
        distance: "16 km",
        why: "Ancient seaside Shiva temple with grand coastal architecture dubbed the Kashi of South Konkan.",
        slug: "kunkeshwar-beach"
      },
      {
        name: "Vijaydurg Fort",
        distance: "32 km",
        why: "Imposing sea fort surrounded on three sides by the Arabian Sea, fortified by Shivaji Maharaj.",
        slug: "vijaydurg-fort"
      }
    ],
    stayOptions: "Devgad town offers family-run homestays, MTDC-approved guesthouses, and beachfront lodges within 2 km of the sand. For luxury resort stays, choose beachfront cottages near Kunkeshwar Beach (16 km).",
    entryFee: "Free public access to the beach.",
    timings: "Open 24/7. Daylight hours (6:00 AM to 6:30 PM) recommended for swimming and strolling.",
    bestTimeToVisit: "Early mornings for peaceful walks; late afternoon (4:30 PM to 6:30 PM) for sunset views.",
    warnings: [
      "⚠️ Strong undercurrents: Swimming during high tide or rough monsoon swells is strictly discouraged.",
      "🚫 Do not drive vehicles onto soft beach sand to avoid getting stuck.",
      "💵 Limited card machines: Carry sufficient cash for local refreshments and auto rides."
    ],
    tags: ["beach", "sunset", "sindhudurg", "devgad", "malvani-food", "family", "alphonso-mango", "peaceful"],
    approved: true,
    featured: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Devgad Harbour",
    slug: "devgad-harbour",
    tagline: "The vibrant maritime pulse of Konkan where colorful trawlers meet the morning tide",
    shortDescription: "A bustling working fishing harbour in Devgad, Sindhudurg, offering travelers a vibrant glimpse into maritime coastal traditions, vibrant wooden trawlers, daily fish auctions, and authentic Malvani coastal livelihoods.",
    description: "Devgad Harbour is the beating heart of maritime life in southern Konkan. Positioned in a protected natural bay beneath the promontory of Devgad Fort, this lively port hosts hundreds of colorful wooden fishing trawlers, fiber canoes, and traditional net-menders. Every morning and late afternoon, the harbor springs into action as fishermen unload glistening silver catches of pomfret, kingfish, prawns, and crabs destined for regional markets and home kitchens. For cultural travelers and photographers, Devgad Harbour presents a rare, unfiltered perspective on traditional coastal industry, framed by the backdrop of laterite hills and the deep blue Arabian Sea.",
    category: "harbour",
    region: "Sindhudurg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Canoe_boat_arriving_on_Chivla_beach_in_Malvan.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/a/ad/Leaving_Malvan_jetty_for_Sindhudurg_fort_%285363541711%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/12/Harvesting_fishing_nets.JPG"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Canoe_boat_arriving_on_Chivla_beach_in_Malvan.JPG",
    highlights: [
      "Bustling natural harbour with hundreds of traditional wooden fishing trawlers",
      "Authentic morning fish auction showcasing the freshest coastal catch",
      "Vibrant photography of boats, docks, nets, and coastal seafaring life",
      "Directly overlooked by the towering ramparts of Devgad Fort",
      "Gateway to the finest fresh seafood delicacies in Devgad town"
    ],
    bestSeason: "October to March — Peak fishing season with bustling harbour activity and comfortable morning weather. Commercial sea fishing is restricted during monsoon (June–August) for breeding.",
    howToReach: {
      byRoad: "Located right below Devgad town, easily reached by auto-rickshaw or personal vehicle (1.5 km from town center).",
      byTrain: "Kankavli Railway Station (56 km), connected by regular state transport buses and private cabs.",
      byFerry: "No commercial passenger ferry. Local boat crossings operate for fishermen.",
      tip: "Visit between 7:00 AM and 9:00 AM to witness the arrival of fishing trawlers and the lively dockside catch auctions."
    },
    thingsToDo: [
      "Watch fishermen skillfully dock trawlers and unload the morning catch of fresh seafood",
      "Capture colorful documentary photography of fishing nets, painted boats, and seafaring crews",
      "Explore the morning wholesale seafood market to see rare coastal fish and crabs",
      "Walk up the scenic winding road to Devgad Fort for an aerial view of the harbour bay",
      "Enjoy fresh seafood dishes prepared at family restaurants in Devgad town"
    ],
    foodToTry: [
      "Prawns Masala — Fresh harbor prawns simmered in aromatic roasted coconut gravy",
      "Tawa Fried Pomfret — Whole fresh pomfret coated with spicy coastal masala and lemon",
      "Bombil (Bombay Duck) Fry — Crispy semolina-coated fish fillets served piping hot",
      "Solkadhi — Authentic digestive drink made of pressed kokum and freshly grated coconut",
      "Ghavane — Traditional soft rice crepes paired with coconut chutney"
    ],
    nearbyPlaces: [
      {
        name: "Devgad Beach",
        distance: "2 km",
        why: "Calm golden-sand beach perfect for relaxing walks after observing the busy docks.",
        slug: "devgad-beach"
      },
      {
        name: "Devgad Fort",
        distance: "1.5 km",
        why: "Historic coastal fort overlooking the harbour with cannons and a maritime lighthouse.",
        slug: "devgad-fort"
      },
      {
        name: "Mithmumbari Beach",
        distance: "11 km",
        why: "Tranquil coastal hideaway with lush green surroundings and gentle waves.",
        slug: "mithmumbari-beach"
      },
      {
        name: "Kunkeshwar Temple & Beach",
        distance: "15 km",
        why: "Grand 11th-century coastal Shiva temple built right beside the Arabian Sea.",
        slug: "kunkeshwar-beach"
      },
      {
        name: "Vijaydurg Fort",
        distance: "30 km",
        why: "Legendary Maratha sea citadel surrounded on three sides by ocean waves.",
        slug: "vijaydurg-fort"
      }
    ],
    stayOptions: "Stay in Devgad town (1 km away) where homestays, lodges, and guesthouses offer convenient access. Beachfront resort accommodations are available 15 km away in Kunkeshwar.",
    entryFee: "Free public access to harbour viewing points.",
    timings: "Open 24/7. Best visited between 6:30 AM and 10:00 AM or 4:00 PM and 6:00 PM for fishing activity.",
    bestTimeToVisit: "Morning hours (7:00 AM to 9:30 AM) for morning catch auctions and boat movement.",
    warnings: [
      "⚠️ Working port: Watch your footing on wet, slippery dock edges and keep clear of moving cranes and nets.",
      "🚫 Do not board private fishing vessels without explicit permission from captains.",
      "👟 Wear slip-resistant footwear with good traction."
    ],
    tags: ["harbour", "fishing", "culture", "maritime", "seafood", "photography", "sindhudurg", "devgad"],
    approved: true,
    featured: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Vijaydurg Fort",
    slug: "vijaydurg-fort",
    tagline: "The invincible 'Eastern Gibraltar' of the Maratha naval empire",
    shortDescription: "A legendary sea fortress in Sindhudurg, Maharashtra, encircled on three sides by the Arabian Sea and Vaghotan Creek. Famous for its triple-layered defensive walls, 29 bastions, underwater defensive walls, and deep Maratha maritime history.",
    description: "Vijaydurg Fort is widely considered one of the most formidable coastal sea forts in Indian military history. Situated on a rocky peninsula in Sindhudurg where the Arabian Sea meets Vaghotan Creek, Vijaydurg was originally constructed during the Shilahara dynasty and later extensively fortified by Chhatrapati Shivaji Maharaj in 1653 into the primary naval stronghold of the Maratha Navy under Admiral Kanhoji Angre. Enclosed by triple-layered laterite ramparts and 29 towering bastions, the fort also featured a subterranean tunnel and an ingenious submerged masonry wall that sabotaged approaching enemy warships. Today, visitors can walk the massive sea-facing ramparts, inspect historic cannons, and take in panoramic ocean horizons where British, Portuguese, and Maratha naval fleets once clashed.",
    category: "fort",
    region: "Sindhudurg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Vijaydurg_Fort.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d8/Vijaydurg_fort_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Vijaydurg_Fort_20.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Vijaydurg_Fort.jpg",
    highlights: [
      "Triple-layered laterite defensive walls & 29 massive bastions surrounded by sea",
      "Primary naval base of Kanhoji Angre, famous as the 'Eastern Gibraltar'",
      "Ingenious 200m submerged underwater wall built to wreck hostile warships",
      "Historic Khalbatkhana (secret council chamber), cannons & Sadar courthouse",
      "Panoramic 300° vistas of the Arabian Sea and Vaghotan Creek estuary"
    ],
    bestSeason: "October to March — Pleasant cool weather ideal for exploring the extensive 17-acre fort grounds. Monsoon brings dramatic crashing waves against the sea walls.",
    howToReach: {
      byRoad: "460 km from Mumbai via NH66 (8–9 hrs); 375 km from Pune via Kolhapur-Gaganbawda (7 hrs); 32 km from Devgad town.",
      byTrain: "Kankavli Railway Station (70 km) or Rajapur Road (55 km). Regular state buses and private taxis connect directly to Vijaydurg jetty.",
      byFerry: "No regular passenger ferry. Approachable via road from Devgad or Rajapur.",
      tip: "Hire an authorized local guide at the entrance gate to fully appreciate the military engineering and naval history."
    },
    thingsToDo: [
      "Walk along the outer sea-facing ramparts and admire the engineering of the triple walls",
      "Inspect ancient iron and bronze cannons mounted on the bastions pointing out to sea",
      "Explore the Khalbatkhana (secret strategy room) and the ancient water storage cisterns",
      "Observe Vaghotan Creek where ancient Maratha war galleys were safely docked",
      "Savor authentic Malvani seafood at local village eateries near the fort entrance"
    ],
    foodToTry: [
      "Vijaydurg Fish Thali — Fresh local catch curry served with rice, solkadhi, and fried fish",
      "Malvani Surmai Fry — Kingfish fillet marinated with red chili, turmeric, and garlic",
      "Solkadhi — A soothing pink digestive cooler made from wild kokum and fresh coconut milk",
      "Prawns Sukka — Dry spicy coastal prawns tossed with fresh coconut and coriander",
      "Ukdiche Modak — Steamed fragrant dumplings filled with sweet jaggery and grated coconut"
    ],
    nearbyPlaces: [
      {
        name: "Devgad Fort",
        distance: "32 km",
        why: "Laterite fort overlooking Devgad harbour with an active lighthouse.",
        slug: "devgad-fort"
      },
      {
        name: "Devgad Beach",
        distance: "30 km",
        why: "Scenic crescent beach known for golden sunsets and Alphonso orchards.",
        slug: "devgad-beach"
      },
      {
        name: "Devgad Harbour",
        distance: "30 km",
        why: "Bustling fishing harbour with colorful trawlers and fresh catch auctions.",
        slug: "devgad-harbour"
      },
      {
        name: "Kunkeshwar Temple",
        distance: "42 km",
        why: "Ancient coastal Shiva temple on the shoreline known as Kashi of South Konkan.",
        slug: "kunkeshwar-beach"
      },
      {
        name: "Mithmumbari Beach",
        distance: "36 km",
        why: "Quiet, unspoiled beach with lush green hills and pristine sands.",
        slug: "mithmumbari-beach"
      }
    ],
    stayOptions: "Local family homestays and heritage lodges operate in Vijaydurg village near the fort gate. For hotels with wider amenities and mango agro-resorts, stay in Devgad town (30 km).",
    entryFee: "Free entry to Vijaydurg Fort.",
    timings: "Open daily from 8:00 AM to 6:00 PM.",
    bestTimeToVisit: "Morning hours (8 AM to 11 AM) or late afternoon (3:30 PM to 6 PM) for comfortable exploration of the ramparts.",
    warnings: [
      "👟 Extensive walking: The fort complex spans 17 acres with uneven steps; wear comfortable walking shoes.",
      "☀️ Sun protection: Large sections are open to the sun; carry drinking water, sunglasses, and a hat.",
      "⚠️ Sheer bastion drops: Keep children close and avoid sitting on outer wall parapets."
    ],
    tags: ["fort", "sea-fort", "heritage", "maratha-history", "sindhudurg", "vijaydurg", "architecture", "history"],
    approved: true,
    featured: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Mithmumbari Beach",
    slug: "mithmumbari-beach",
    tagline: "Where lush emerald hills gently touch the silent tides of Konkan",
    shortDescription: "A secluded coastal paradise in Devgad, Sindhudurg, known for its pristine golden shoreline, verdant green hills, tranquil village atmosphere, and calm Arabian Sea waters far away from commercial crowds.",
    description: "Mithmumbari Beach is one of Sindhudurg's best-kept secrets, tucked away in Devgad taluka between rolling emerald hills and the azure Arabian Sea. Free from commercial stalls and noisy crowds, the beach features a clean, wide expanse of soft sand fringed by dense coconut wadis and casuarina groves. The tranquil waters make it a wonderful spot for morning meditation, beachcombing, and watching white seabirds gather along the shoreline. Located halfway between Devgad and Kunkeshwar, Mithmumbari provides a soothing retreat for travelers seeking raw nature and authentic Konkani tranquility.",
    category: "beach",
    region: "Sindhudurg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/Kunkeshwar_Beach.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/92/Kunkeshwar_seashore_kokan.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Early_Moorning_on_Kunkeshwar_Beach.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Kunkeshwar_Beach.jpg",
    highlights: [
      "Untouched, peaceful crescent beach with pristine sands and clear waters",
      "Lush backdrop of verdant Konkan hills and swaying coconut groves",
      "Minimal crowds offering an authentic escape into coastal solitude",
      "Gentle morning sea breezes and stunning golden sunset vistas",
      "Ideally situated along the scenic coastal drive between Devgad and Kunkeshwar"
    ],
    bestSeason: "October to March — Mild sunny days and cool evening breezes. Monsoon (June–Sept) turns the surrounding hills an intense emerald green.",
    howToReach: {
      byRoad: "12 km south of Devgad town via scenic coastal village roads; 14 km north of Kunkeshwar Temple.",
      byTrain: "Kankavli Railway Station (58 km). Hired auto-rickshaws or taxis connect via Devgad.",
      byFerry: "No passenger ferry service. Accessible via coastal roads from Devgad or Kunkeshwar.",
      tip: "Take the scenic rural coastal road connecting Devgad, Mithmumbari, and Kunkeshwar for stunning panoramic sea views."
    },
    thingsToDo: [
      "Enjoy a quiet, unhurried walk along the soft sandy shoreline",
      "Watch sunsets over the Arabian Sea in peaceful, uncrowded serenity",
      "Photograph the contrast of emerald green hill slopes meeting the turquoise ocean",
      "Relax under the natural shade of casuarina and coconut palms",
      "Combine with morning temple visits to Kunkeshwar and an afternoon at Devgad Fort"
    ],
    foodToTry: [
      "Authentic Malvani Fish Curry — Traditional homestyle curry prepared with freshly ground coastal spices",
      "Crispy Surmai Fry — Local kingfish seasoned with kokum and red chili paste",
      "Fresh Tender Coconut Water — Sweet and hydrating, plucked straight from village wadis",
      "Solkadhi — Pink digestive cooler pressed from wild kokum petals and coconut milk",
      "Ghavane with Coconut Chutney — Lacy rice crepes served warm with fresh chutney"
    ],
    nearbyPlaces: [
      {
        name: "Devgad Beach",
        distance: "12 km",
        why: "Popular town beach with golden sand and mango orchards.",
        slug: "devgad-beach"
      },
      {
        name: "Devgad Fort",
        distance: "13 km",
        why: "Historic laterite sea fort with old cannons and panoramic coastal views.",
        slug: "devgad-fort"
      },
      {
        name: "Devgad Harbour",
        distance: "11 km",
        why: "Vibrant fishing harbour with colorful trawlers and morning markets.",
        slug: "devgad-harbour"
      },
      {
        name: "Kunkeshwar Temple & Beach",
        distance: "8 km",
        why: "Sacred seaside temple dedicated to Lord Shiva with breathtaking architecture.",
        slug: "kunkeshwar-beach"
      },
      {
        name: "Vijaydurg Fort",
        distance: "38 km",
        why: "Invincible 17-acre Maratha naval sea fortress surrounded by waves.",
        slug: "vijaydurg-fort"
      }
    ],
    stayOptions: "Intimate village homestays and rural agro-tourism farms operate in Mithmumbari village. For beach resorts with dining, stay in Kunkeshwar (8 km) or Devgad town (12 km).",
    entryFee: "Free public access to the beach.",
    timings: "Accessible 24/7. Daylight hours recommended (6:00 AM to 6:30 PM).",
    bestTimeToVisit: "Early morning for peaceful walks; late afternoon (4:30 PM to 6:30 PM) for tranquil sunsets.",
    warnings: [
      "⚠️ Strong undertows: Swimming alone or venturing deep into the sea is not advised.",
      "🏪 Limited commercial shops: Carry drinking water and light snacks.",
      "🚗 Narrow village roads: Drive carefully on coastal curves and respect village residents."
    ],
    tags: ["beach", "peaceful", "nature", "sindhudurg", "devgad", "sunset", "photography", "hidden-gem"],
    approved: true,
    featured: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Velas Beach",
    slug: "velas-beach",
    tagline: "Where tiny lives begin their journey to the ocean, and nature teaches us hope",
    shortDescription: "A serene coastal village in Ratnagiri renowned for its untouched natural shoreline, community-led Olive Ridley sea turtle conservation, the annual Velas Turtle Festival, and authentic Konkani village homestays.",
    description: "Tucked away along the northern Ratnagiri coastline, Velas is one of Maharashtra's most inspiring eco-tourism havens. Here, the gentle tides of the Arabian Sea provide critical nesting grounds for vulnerable Olive Ridley sea turtles. Through dedicated community conservation, protected hatcheries ensure turtle hatchlings make their first supervised march into the waves. Beyond the turtle season, Velas enchants visitors with wide golden sands, betel nut orchards, rustic Konkani homestays, and wholesome home-cooked coastal meals.",
    category: "beach",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Olive_Ridley_Sea_Turtle_Hatchlings.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e1/Hatchlings_of_Olive_Ridley.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/79/Kelshi_Village_-_panoramio.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/fd/Olive_Ridley_hatchlings_in_Chennai.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Olive_Ridley_Sea_Turtle_Hatchlings.jpg",
    highlights: [
      "Primary nesting and conservation sanctuary for Olive Ridley sea turtles in Maharashtra",
      "Famous annual Velas Turtle Festival with supervised morning & evening hatchling releases",
      "Warm Konkani village hospitality with community-run eco-homestays",
      "Scenic and uncrowded natural beach fringed by casuarinas and coconut palms",
      "Historic Bankot Fort and Savitri River estuary just 12 km away"
    ],
    bestSeason: "November to March — Pleasant coastal weather. Turtle nesting occurs Dec–Feb, and hatchling releases typically take place between February and April.",
    howToReach: {
      byRoad: "220 km from Mumbai via NH66 (Mangaon - Mandangad - Velas, 5.5 hrs); 190 km from Pune via Tamhini Ghat (5 hrs).",
      byTrain: "Mangaon Railway Station (60 km) or Khed (75 km) on Konkan Railway. State transport buses and private jeeps run to Mandangad and Velas.",
      byFerry: "Local vehicle-passenger ferry connects Bagmandla (Harihareshwar side) to Bankot/Velas across the Savitri River in 15 minutes.",
      tip: "Book homestays well in advance for peak Turtle Festival weekends (Feb–April). Always carry cash as cellular data can be patchy."
    },
    thingsToDo: [
      "Witness baby Olive Ridley turtles emerging and scurrying to the sea during supervised releases",
      "Stay at a traditional Konkani village homestay and experience authentic rural life",
      "Take a quiet sunset walk along the wide, pristine sands of Velas Beach",
      "Visit historic Bankot Fort (Himmatgad) for sweeping views of the Savitri River estuary",
      "Take the scenic ferry across to Harihareshwar Temple and rocky headlands",
      "Support local conservationists and learn about marine biodiversity protection"
    ],
    foodToTry: [
      "Malvani Surmai Fry — Fresh coastal fish marinated in fiery regional spices and rava crusted",
      "Traditional Konkani Veg Thali — Homemade pithla-bhakri, valache birda, and steaming rice",
      "Solkadhi — Tangy and cooling digestive drink made of fresh coconut milk and kokum",
      "Ukadiche Modak — Steamed fragrant rice dumplings stuffed with freshly grated coconut and jaggery",
      "Ghavane with Chutney — Soft, lacy Konkani rice crepes served hot for breakfast"
    ],
    nearbyPlaces: [
      {
        name: "Bankot Fort",
        distance: "12 km",
        why: "Historic hilltop fortress overlooking the Savitri River mouth, offering sweeping panoramic ocean views.",
        slug: "bankot-fort"
      },
      {
        name: "Harihareshwar Beach & Temple",
        distance: "28 km (via ferry)",
        why: "Ancient cliffside Shiva temple and scenic rocky headlands known as Dakshin Kashi.",
        slug: "harihareshwar"
      },
      {
        name: "Kelshi Beach",
        distance: "18 km",
        why: "Tranquil sandy beach famous for natural sand dunes and the 17th-century Mahalaxmi Temple.",
        slug: "kelshi-beach"
      },
      {
        name: "Anjarle Beach",
        distance: "30 km",
        why: "Scenic palm-fringed shore home to the revered cliff-top Kadyavarcha Ganpati Temple.",
        slug: "anjarle"
      },
      {
        name: "Mandangad",
        distance: "22 km",
        why: "Charming taluka hub nestled amidst green hills with historic fort ruins.",
        slug: "mandangad"
      },
      {
        name: "Diveagar Beach",
        distance: "45 km",
        why: "Sprawling white-sand beach lined with surfing waves, water sports, and casuarina groves.",
        slug: "diveagar"
      }
    ],
    stayOptions: "Authentic community-run homestays hosted by local village families with clean rooms and freshly prepared home-cooked Konkani meals. For resort-style amenities, stay in nearby Harihareshwar or Dapoli.",
    entryFee: "Beach access is free. Turtle festival viewing is managed by local conservation groups.",
    timings: "Beach open during daylight hours. Supervised turtle hatchling releases occur at 7:00 AM and 5:30 PM during nesting season.",
    bestTimeToVisit: "Early mornings (6:30 AM–8:00 AM) and late afternoons (5:00 PM–6:30 PM) for hatchling sessions and peaceful sunsets.",
    warnings: [
      "🐢 Wildlife Protection: Never touch, handle, or shine flashlights at sea turtles or hatchlings.",
      "⚠️ Sea Conditions: Strong undercurrents make swimming risky; swimming during high tide is strictly discouraged.",
      "💵 Limited Connectivity: ATMs and digital payments are scarce; carry adequate cash for homestays and transport.",
      "🌿 Eco-Sensitivity: Velas is a zero-litter zone; carry all plastic waste back with you."
    ],
    tags: ["beach", "turtle-festival", "eco-tourism", "wildlife", "ratnagiri", "homestay", "village", "peaceful", "family"],
    featured: true,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Kelshi Beach",
    slug: "kelshi-beach",
    tagline: "Untouched sandy shores, whispers of casuarinas, and timeless village serenity",
    shortDescription: "A tranquil coastal hideaway in Ratnagiri district featuring a wide uncrowded beach, natural sand dunes, the historic 17th-century Mahalaxmi Temple, and traditional Konkan village charms.",
    description: "Kelshi Beach is a peaceful antidote to bustling tourist circuits. Located in northern Ratnagiri near Dapoli, this tranquil coastal village boasts a pristine 3-kilometer stretch of soft sand shaded by tall casuarina and coconut groves. Kelshi is geographically famous for its unusual coastal sand dunes formed by a historic tsunami, as well as the historic 17th-century Mahalaxmi Temple and the Yakub Baba Dargah. Travellers come to Kelshi to listen to the whisper of the ocean breeze, stroll undisturbed along the water's edge, and savour authentic Konkani home hospitality.",
    category: "beach",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/7/79/Kelshi_Village_-_panoramio.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/29/Bridge_Near_kelshi_Village_-_panoramio.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/19/Anjarle_beach_in_Konkan_near_Dapoli_%2C_Maharashtra%2CIndia.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/7/79/Kelshi_Village_-_panoramio.jpg",
    highlights: [
      "3 km long pristine, uncrowded shoreline perfect for quiet barefoot walks",
      "Unique natural coastal sand dunes with fossil deposits",
      "Historic 17th-century Shri Mahalaxmi Temple built during the Peshwa era",
      "Scenic arched stone bridge and tranquil estuary lined with traditional fishing boats",
      "Peaceful village homestays offering genuine rural Konkani warmth"
    ],
    bestSeason: "October to March — Pleasant, breezy weather with clear skies and calm waters ideal for quiet beach vacations.",
    howToReach: {
      byRoad: "230 km from Mumbai via NH66 (5.5 hrs); 200 km from Pune via Bhor-Varandha Ghat or Tamhini (5 hrs). 32 km from Dapoli.",
      byTrain: "Khed Railway Station (65 km) on Konkan Railway. State transport buses and private taxis connect Khed to Kelshi via Dapoli.",
      byFerry: "Connected northwards via local ferries to Harihareshwar / Bagmandla and Bankot.",
      tip: "Combine Kelshi with nearby Anjarle (14 km) and Velas (18 km) for an unforgettable coastal trail."
    },
    thingsToDo: [
      "Take leisurely strolls along the silent, tree-shaded shores of Kelshi Beach",
      "Visit the historic Mahalaxmi Temple and admire its intricate wooden architecture",
      "Explore the ancient coastal sand dunes and estuary bridge for sunset photography",
      "Savour homemade Malvani seafood prepared by local village homestay hosts",
      "Drive along the scenic coastal route to Anjarle's Kadyavarcha Ganpati Temple"
    ],
    foodToTry: [
      "Malvani Pomfret Thali — Freshly caught pomfret spiced with roasted Malvani masala and served with rice",
      "Solkadhi — Soothing pink cooler infused with fresh coconut milk, kokum, and green chillies",
      "Ghavane with Sweet Coconut Milk — Delicate lace rice pancakes served with sweetened cardamom milk",
      "Fish Fry (Surmai / Bangda) — Crisp shallow-fried coastal catch with traditional spices",
      "Ukadiche Modak — Steamed rice flour modaks filled with freshly scraped coconut and organic jaggery"
    ],
    nearbyPlaces: [
      {
        name: "Anjarle Beach",
        distance: "14 km",
        why: "Scenic palm-fringed beach and the cliff-top Kadyavarcha Ganpati Temple.",
        slug: "anjarle"
      },
      {
        name: "Velas Beach",
        distance: "18 km",
        why: "Renowned eco-village celebrated for its Olive Ridley turtle conservation festival.",
        slug: "velas-beach"
      },
      {
        name: "Bankot Fort",
        distance: "28 km",
        why: "Historic Maratha bastion overlooking the Savitri River estuary.",
        slug: "bankot-fort"
      },
      {
        name: "Harnai Beach & Fish Market",
        distance: "26 km",
        why: "Vibrant fishing port with the famous Suvarnadurg Sea Fort and daily beach fish auction.",
        slug: "harnai"
      },
      {
        name: "Dapoli",
        distance: "32 km",
        why: "Major hill and coastal hub known for agricultural universities, markets, and cool climate.",
        slug: "dapoli"
      },
      {
        name: "Mandangad",
        distance: "35 km",
        why: "Scenic inland hill town connecting coastal trails to the highway.",
        slug: "mandangad"
      }
    ],
    stayOptions: "Cozy local homestays and family guesthouses in Kelshi village offering home-cooked meals and peaceful village surroundings. Beach resorts are available in nearby Dapoli (32 km).",
    entryFee: "Free access to beach, sand dunes, and temples.",
    timings: "Open 24/7. Daytime visits (6:30 AM to 6:30 PM) recommended.",
    bestTimeToVisit: "Late afternoons (4:30 PM to 6:30 PM) for cool ocean breezes and colorful coastal sunsets.",
    warnings: [
      "⚠️ Sea Depth: Kelshi has sudden drop-offs; avoid venturing deep into the water.",
      "🚫 Eco Respect: The sand dunes are fragile geological features; do not litter or disturb the natural formations.",
      "💵 Cash Essential: Village shops and homestays rarely have card terminals; keep sufficient cash."
    ],
    tags: ["beach", "sand-dunes", "peaceful", "ratnagiri", "homestay", "temple", "sunset", "village"],
    approved: true,
    featured: false,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Mandangad",
    slug: "mandangad",
    tagline: "Discover the quiet verdant heart of inland Konkan",
    shortDescription: "A tranquil hill-country taluka in Ratnagiri district, renowned for its cool breezes, historic triangular Mandangad Fort, lush valleys, and gateway access to coastal turtle sanctuaries and river forts.",
    description: "Mandangad is a peaceful hill haven tucked into the northern ridges of the Konkan region in Ratnagiri district. Acting as the geographical crossroads between the Sahyadri foothills and the Arabian Sea, Mandangad is crowned by the historic Mandangad Fort (dating back to the 12th century), famous for its unusual triangular layout and double ramparts. Surrounded by dense deciduous forests, betel nut plantations, and rolling laterite plateaus, Mandangad offers travellers a serene inland sanctuary with refreshing breezes, traditional weekly haats (bazaars), and the unhurried warmth of authentic rural Maharashtra.",
    category: "village",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/32/Kokan_village_School_Drone_Shot_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Kokan_village_School_Drone_Shot_5.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Bankot_Fort.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/3/32/Kokan_village_School_Drone_Shot_2.jpg",
    highlights: [
      "Historic 12th-century triangular Mandangad Fort with ancient water cisterns and cannon points",
      "Sweeping valley panoramas of the lush Sahyadri foothills and northern Konkan plains",
      "Cool, pleasant hill climate offering a refreshing contrast to coastal humidity",
      "Central gateway connecting travelers to Velas turtle sanctuary and Bankot Fort",
      "Authentic rural Konkan town life with traditional weekly farmers' markets"
    ],
    bestSeason: "October to March — Crisp, cool breezes and clear skies. Monsoon (July–September) turns the entire surrounding plateau into an emerald paradise with seasonal waterfalls.",
    howToReach: {
      byRoad: "180 km from Mumbai via NH66 (Mangaon–Mandangad, 4.5 hrs); 160 km from Pune via Bhor Ghat (4 hrs).",
      byTrain: "Khed Railway Station (45 km) or Mangaon (50 km) on the Konkan Railway. State transport buses and shared jeeps connect directly.",
      byFerry: "Inland town, but connects to Bankot ferry (20 km) for crossing towards Harihareshwar.",
      tip: "Mandangad is the best fuel and cash replenishment stop before heading into the smaller coastal villages of Velas and Kelshi."
    },
    thingsToDo: [
      "Trek up to Mandangad Fort and explore its historic ramparts, cannons, and Lord Ganesha shrine",
      "Enjoy birdwatching and photography across the mist-shrouded hill valleys",
      "Experience the lively local weekly bazaar for regional spices, kokum, and wild honey",
      "Use Mandangad as a scenic base for road-tripping to Bankot Fort, Velas, and Kelshi",
      "Sample rustic rural Konkani delicacies prepared with fresh local seasonal produce"
    ],
    foodToTry: [
      "Pithla Bhakri with Thecha — Hearty gram flour curry with hot jowar or rice flatbread and fiery green chilli relish",
      "Valache Birda — Sprouted field bean curry cooked in a fragrant coconut and tamarind gravy",
      "Solkadhi — Refreshing pink digestif made of fresh coconut milk and wild kokum",
      "Kombdi Vade — Authentic rural Malvani chicken curry served with fluffy fried multigrain puris",
      "Fresh Kokum Sharbat — Sweet and tangy traditional cooler made with indigenous wild kokum"
    ],
    nearbyPlaces: [
      {
        name: "Velas Beach",
        distance: "22 km",
        why: "Community-led Olive Ridley sea turtle sanctuary and festival village.",
        slug: "velas-beach"
      },
      {
        name: "Bankot Fort",
        distance: "20 km",
        why: "Historic coastal bastion overlooking the scenic Savitri River mouth.",
        slug: "bankot-fort"
      },
      {
        name: "Kelshi Beach",
        distance: "35 km",
        why: "Peaceful beach with ancient sand dunes and historic Mahalaxmi Temple.",
        slug: "kelshi-beach"
      },
      {
        name: "Anjarle Beach",
        distance: "45 km",
        why: "Picturesque beach and the famous cliffside Kadyavarcha Ganpati Temple.",
        slug: "anjarle"
      },
      {
        name: "Harihareshwar",
        distance: "38 km (via ferry)",
        why: "Sacred coastal town with ancient Shiva temple and cliffside pradakshina walk.",
        slug: "harihareshwar"
      }
    ],
    stayOptions: "Budget town lodges, rural agri-tourism farmstays, and local guesthouses. Ideal as an overnight stop before touring the northern Ratnagiri coast.",
    entryFee: "No entry fee for the town or fort.",
    timings: "Town accessible 24/7. Fort trek recommended during daylight hours (6:00 AM to 6:00 PM).",
    bestTimeToVisit: "Early morning for the fort hike; late afternoons for valley breeze and sunset views.",
    warnings: [
      "🥾 Uneven Fort Trails: Wear sturdy trekking shoes for the fort ascent as laterite paths can be slippery.",
      "🌧️ Monsoon Caution: Heavy rains can cause mist and slippery road conditions on ghat passes.",
      "💵 Essential Hub: Withdraw cash here as coastal villages further west have very few working ATMs."
    ],
    tags: ["village", "fort", "hill-station", "history", "ratnagiri", "nature", "trekking", "rural", "offbeat"],
    approved: true,
    featured: false,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Bankot Fort",
    slug: "bankot-fort",
    tagline: "Where Maratha cannons guarded the Savitri estuary and the vast Arabian Sea",
    shortDescription: "An imposing historic sea-and-river fort in Ratnagiri district, towering over the Savitri River mouth with panoramic ocean views, laterite bastions, a secret water gate, and rich coastal history.",
    description: "Perched atop a commanding hill overlooking the confluence of the Savitri River and the Arabian Sea, Bankot Fort (also known as Himmatgad) is a landmark of maritime strategy along the Konkan coast. Believed to have ancient trading origins, the fort was captured by the Portuguese, heavily reinforced by the Maratha naval armada, and later became the first fort in Maharashtra ceded to the British East India Company (renamed Fort Victoria). Today, its weathered laterite battlements, grand arched gateway, secret escape tunnel (Chor Darwaza), and old graveyard offer a captivating journey into coastal history, framed by 360-degree views of river estuaries and open sea.",
    category: "fort",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Bankot_Fort.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Bankot_Fort_Panorama.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Bankot_chor_darwaza.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/48/View_of_the_Arabian_Sea_from_Bankot_Fort.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Bankot_Fort.jpg",
    highlights: [
      "Commanding laterite fort with 360-degree vistas of the Savitri River estuary and Arabian Sea",
      "Historic Maratha bastion with surviving bastions, ramparts, and ancient cannons",
      "Mysterious 'Chor Darwaza' (secret escape gate) carved into the southern cliffside",
      "Historic colonial cemetery from the British East India Company era (Fort Victoria)",
      "Scenic passenger-vehicle ferry link across the river to Bagmandla and Harihareshwar"
    ],
    bestSeason: "October to March — Pleasant coastal winds and clear visibility over the ocean. Winter sunsets from the ramparts are spectacular.",
    howToReach: {
      byRoad: "215 km from Mumbai via Mangaon–Mandangad–Bankot (5 hrs); 185 km from Pune via Tamhini Ghat. Good motorable road up to the fort base.",
      byTrain: "Mangaon Railway Station (55 km) or Khed (70 km). Local buses and taxis connect to Bankot village.",
      byFerry: "Regular passenger & vehicle ferry runs across the Savitri River between Bankot and Bagmandla (Harihareshwar side) in 15 minutes.",
      tip: "Take the ferry crossing from Harihareshwar/Bagmandla to Bankot for an unforgettable scenic river journey with views of the fort above."
    },
    thingsToDo: [
      "Explore the intact laterite ramparts, watchtowers, and cannon bastions of Bankot Fort",
      "Photograph the sweeping panoramic confluence of the Savitri River and the open ocean",
      "Walk down to the historic Chor Darwaza and see the rock-cut steps leading to the river",
      "Visit nearby Velas Beach (12 km) for turtle conservation and rural village homestays",
      "Take the Bagmandla ferry across to Harihareshwar temple and rocky pradakshina trail"
    ],
    foodToTry: [
      "Malvani Surmai Fry — Fresh river-sea catch marinated in red spices and rava-crusted",
      "Fish Curry with Steamed Rice — Traditional Konkani fish curry flavored with kokum and coconut",
      "Solkadhi — Tangy digestive cooler freshly prepared from coconut milk and kokum",
      "Pithla Bhakri — Comforting hot gram-flour curry served with rustic jowar flatbread",
      "Fresh Coconut Water — Sweet, hydrating water straight from local coastal palms"
    ],
    nearbyPlaces: [
      {
        name: "Velas Beach",
        distance: "12 km",
        why: "Community-led Olive Ridley sea turtle sanctuary and turtle festival village.",
        slug: "velas-beach"
      },
      {
        name: "Harihareshwar Beach & Temple",
        distance: "25 km (via ferry)",
        why: "Historic clifftop Shiva temple, rocky headlands, and peaceful beach.",
        slug: "harihareshwar"
      },
      {
        name: "Kelshi Beach",
        distance: "28 km",
        why: "Tranquil sandy beach famous for natural sand dunes and Mahalaxmi Temple.",
        slug: "kelshi-beach"
      },
      {
        name: "Mandangad",
        distance: "20 km",
        why: "Quiet hill town with historic triangular fort and valley views.",
        slug: "mandangad"
      },
      {
        name: "Diveagar Beach",
        distance: "40 km",
        why: "Popular white-sand beach with casuarina woods and water sports.",
        slug: "diveagar"
      }
    ],
    stayOptions: "Homestays in Bankot and Velas village (12 km), or hotels and MTDC resorts across the ferry in Harihareshwar and Shrivardhan.",
    entryFee: "Free entry to the fort.",
    timings: "Open daily from 6:00 AM to 6:30 PM. Daylight visits strongly recommended.",
    bestTimeToVisit: "Late afternoon (4:00 PM to 6:00 PM) for golden-hour photography and cooler breeze on the ramparts.",
    warnings: [
      "⚠️ Steep Bastion Edges: The fort ramparts do not have safety railings; stay away from loose walls and steep edges.",
      "⛴️ Ferry Timings: The Bagmandla-Bankot ferry usually operates from 6:30 AM to 9:30 PM; check evening timings beforehand.",
      "💧 Carry Water: There are no shops inside the fort premises; bring drinking water and sun protection."
    ],
    tags: ["fort", "history", "maratha-history", "savitri-river", "ratnagiri", "panoramic-view", "photography", "heritage"],
    approved: true,
    featured: false,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log("🌊 Seeding Kokan destinations...\n");

  // Check existing slugs to avoid duplicates
  const existing = await db.collection("destinations").get();
  const existingSlugs = new Set(existing.docs.map((d) => d.data().slug));

  let added = 0;
  let skipped = 0;

  for (const dest of destinations) {
    if (existingSlugs.has(dest.slug)) {
      console.log(`⏭️  Skipped (already exists): ${dest.name}`);
      skipped++;
      continue;
    }

    await db.collection("destinations").add(dest);
    console.log(`✅ Added: ${dest.name} (${dest.region})`);
    added++;
  }

  console.log(`\n🎉 Done! Added ${added}, Skipped ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});