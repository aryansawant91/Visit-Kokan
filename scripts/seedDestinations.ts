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
    name: "Tarkarli",
    slug: "tarkarli",
    description: "Tarkarli is a pristine coastal village in Sindhudurg known for its crystal-clear waters, coral reefs, and world-class scuba diving. The Karli backwaters offer stunning houseboat experiences while the beach remains one of the cleanest in Maharashtra.",
    category: "beach",
    region: "Sindhudurg",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
      "https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=800&q=80",
    ],
    highlights: ["Scuba Diving", "Snorkeling", "Karli Backwaters", "Houseboat Stay", "Coral Reefs"],
    bestSeason: "October to March",
    howToReach: "Nearest railway station is Kudal (35 km). From Kudal take a local bus or auto to Malvan, then a short ride to Tarkarli. By road, it is 530 km from Mumbai via NH66.",
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
    name: "Kashid",
    slug: "kashid",
    description: "Kashid Beach is a 3 km arc of brilliant white sand — one of the few truly white-sand beaches on the Maharashtra coast. Backed by casuarina forests and with calm turquoise waters, it is a favourite weekend escape from Mumbai and Pune, offering beach camping and water sports.",
    category: "beach",
    region: "Alibaug",
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
      "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800&q=80",
    ],
    highlights: ["White Sand Beach", "Beach Camping", "Water Sports", "Casuarina Forest", "Clear Waters"],
    bestSeason: "October to February",
    howToReach: "From Mumbai take a ferry to Mandwa or drive via Pune-Alibaug road. Kashid is 145 km from Mumbai by road and 30 km from Alibaug town.",
    featured: false,
    approved: true,
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