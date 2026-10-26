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
    tagline: "Where the divine meets the deep blue sea, and Konkan unfolds its timeless magic",
    shortDescription: "A spectacular coastal destination in Ratnagiri district, famous for its bright sandy beach, the sacred Swayambhu Ganpati Temple, lush green hills, and the timeless beauty of the Konkan coastline.",
    description: "Ganpatipule is a captivating coastal destination in Ratnagiri district, Maharashtra, where spirituality, nature, and traditional Konkani life come together beside the Arabian Sea. Its beautiful shoreline is overlooked by the revered Swayambhu Ganpati Temple, home to a naturally formed idol of Lord Ganesha that draws devotees from across India. The temple's unique seaside setting creates an atmosphere where the sound of waves accompanies prayers and the coastal breeze drifts through the surrounding greenery. Beyond the sacred shrine, Ganpatipule welcomes travellers with scenic sunsets, coconut plantations, traditional Malvani kitchens, and winding coastal roads that reveal the quieter beauty of rural Konkan. Visitors can explore the open-air Prachin Konkan Museum, discover the historic Jaigad Fort, admire the sweeping curves of Aare-Ware Beach, or wander through the neighbouring village of Malgund, birthplace of Marathi poet Keshavsut. From peaceful morning darshan to golden-hour beach walks and plates of freshly prepared Konkani food, Ganpatipule offers a memorable escape for families, couples, pilgrims, photographers, and road-trippers seeking a deeper connection with the coast.",
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
      "Sacred Swayambhu Ganpati Temple, featuring a naturally formed idol of Lord Ganesha near the Arabian Sea",
      "A beautiful sandy shoreline framed by green hills and coconut plantations",
      "Spectacular sunsets and coastal views ideal for photography and peaceful evening walks",
      "Prachin Konkan Museum, an open-air attraction showcasing traditional Konkan life, culture, and heritage",
      "Jaigad Fort, a historic coastal fort overlooking Jaigad Creek and the Arabian Sea",
      "Scenic Aare-Ware Beach and coastal road, offering panoramic sea views and beautiful photo stops",
      "Traditional Konkani and Malvani cuisine, including fish curry, Solkadhi, Ghavane, and Ukdiche Modak",
      "Mahashivratri-period and annual temple festivities that bring pilgrims and visitors to the region",
      "Nearby Malgund village, associated with Marathi poet Keshavsut and his memorial",
      "Seasonal boating, dolphin-watching trips, and beach activities where locally available and safe"
    ],
    bestSeason: "October to March — Pleasant weather for temple visits, beach walks, coastal sightseeing, and exploring nearby attractions. February and March can coincide with important temple festivities, depending on the Hindu calendar. April and May are warmer but offer opportunities to enjoy seasonal Alphonso mangoes.",
    howToReach: {
      byTrain: "Ratnagiri Railway Station is the main railway gateway for Ganpatipule, approximately 25–35 km away by road depending on the route and starting point. From the station, continue by MSRTC bus, shared vehicle, or private taxi. Check current onward bus services before travelling.",
      byRoad: "From Mumbai (approximately 340–375 km): Travel south via NH66 towards Ratnagiri and continue on the connecting coastal road to Ganpatipule. From Pune (approximately 280–330 km): Choose a suitable route via the Western Maharashtra highway network or the Konkan-bound roads towards Ratnagiri. Distances vary by route; allow additional time for winding roads and holiday traffic.",
      byFerry: "There is no regular direct passenger ferry to Ganpatipule. Road and rail connections through Ratnagiri are the most practical options. Ferry journeys elsewhere along the Konkan coast may require substantial additional road travel and should not be assumed to provide a direct connection.",
      tip: "For a relaxed trip, arrive in Ratnagiri with enough time to arrange onward transport. Combine Ganpatipule with Aare-Ware Beach, Malgund, Prachin Konkan Museum, and Jaigad Fort for a rewarding two-day coastal itinerary."
    },
    thingsToDo: [
      "Visit the Swayambhu Ganpati Temple and seek blessings at this revered coastal pilgrimage site",
      "Walk along Ganpatipule Beach in the early morning and enjoy the peaceful sea breeze",
      "Watch the sunset over the Arabian Sea and photograph the changing colours of the sky",
      "Explore Prachin Konkan Museum to discover traditional village life, occupations, tools, and cultural heritage",
      "Drive along the scenic Aare-Ware coastal road and stop at designated viewpoints for sea panoramas",
      "Visit Jaigad Fort and explore its historic fortifications overlooking the coast and creek",
      "Discover Malgund village and visit the memorial dedicated to Marathi poet Keshavsut",
      "Taste authentic Malvani fish thali, Solkadhi, Ghavane, and other regional specialities",
      "Enjoy a leisurely visit to Bhandarpule Beach, a quieter coastal alternative nearby",
      "Try authorised seasonal water sports or dolphin-watching trips only when available and safe",
      "Explore the temple surroundings and observe local traditions respectfully during festival periods"
    ],
    foodToTry: [
      "Malvani Fish Thali — Fresh local fish curry served with rice, fried fish, and traditional coastal masala",
      "Surmai or Pomfret Fry — Fish marinated with regional spices and fried until crisp",
      "Solkadhi — A refreshing kokum and coconut-milk drink traditionally served with meals",
      "Ghavane with Coconut Chutney — Soft rice-based pancakes popular in Konkani households",
      "Ukdiche Modak — Steamed rice-flour dumplings filled with coconut and jaggery, traditionally associated with Lord Ganesha",
      "Malvani Chicken Curry — A rich regional curry prepared with coconut and aromatic spices",
      "Konkani Vegetarian Thali — A traditional meal with seasonal vegetables, rice, dal, and regional accompaniments",
      "Alphonso Mangoes and Aamras — Seasonal favourites from the wider Ratnagiri and Konkan region",
      "Ambapoli — Traditional dried mango sheets enjoyed as a sweet regional treat",
      "Fresh Coconut Water and Kokum Sharbat — Refreshing drinks suited to warm coastal afternoons"
    ],
    nearbyPlaces: [
      {
        name: "Bhandarpule Beach",
        distance: "Approximately 4 km",
        why: "A quieter coastal beach known for its natural scenery, coconut groves, green surroundings, and relaxed atmosphere away from the main tourist area."
      },
      {
        name: "Malgund",
        distance: "Approximately 2 km",
        why: "The birthplace of Marathi poet Keshavsut, featuring a memorial and opportunities to explore local village culture."
      },
      {
        name: "Prachin Konkan Museum",
        distance: "Approximately 1–3 km",
        why: "An open-air heritage museum that recreates traditional Konkan life through displays of historical occupations, village customs, and cultural artefacts."
      },
      {
        name: "Aare-Ware Beach",
        distance: "Approximately 7–12 km",
        why: "A scenic coastal stretch famous for its winding seaside road, dramatic curves, green hills, and panoramic Arabian Sea views."
      },
      {
        name: "Jaigad Fort",
        distance: "Approximately 18–22 km",
        why: "A historic coastal fort overlooking Jaigad Creek and the Arabian Sea, offering insight into the region's maritime heritage and beautiful coastal views."
      },
      {
        name: "Jaigad Lighthouse",
        distance: "Approximately 18–22 km",
        why: "A coastal landmark near Jaigad Fort, providing a glimpse of the area's maritime navigation heritage. Access and visiting arrangements should be checked locally."
      },
      {
        name: "Ratnagiri",
        distance: "Approximately 25–35 km",
        why: "A major coastal town known for its historic sites, markets, seafood, Ratnadurg Fort, and the famous Alphonso mango trade."
      },
      {
        name: "Pawas",
        distance: "Approximately 35–45 km",
        why: "A spiritual destination associated with Swami Swaroopanand, attracting devotees seeking a peaceful religious excursion."
      },
      {
        name: "Guhagar Beach",
        distance: "Approximately 45–60 km by road, depending on the route",
        why: "A long and scenic sandy beach known for its quieter atmosphere, traditional coastal surroundings, and nearby pilgrimage attractions."
      },
      {
        name: "Velneshwar Beach",
        distance: "Approximately 55–70 km by road, depending on the route",
        why: "A peaceful coastal destination associated with the historic Velneshwar Shiva Temple and the natural beauty of the wider Konkan coastline."
      }
    ],
    stayOptions: "Budget to premium — Ganpatipule offers MTDC accommodation, family-run homestays, budget lodges, guesthouses, boutique properties, and sea-view resorts. Staying near the temple and main beach is convenient for pilgrims and first-time visitors, while properties along the Aare-Ware road suit travellers looking for scenic coastal views. Book well in advance during weekends, school holidays, and major temple festivals. Confirm room amenities, meal arrangements, parking, and the actual distance to the beach before booking.",
    entryFee: "Ganpatipule Beach is generally free to access. Temple darshan is ordinarily free, though specific religious services and offerings may involve separate contributions. Prachin Konkan Museum and some seasonal activities have separate charges. Water sports, boating, and dolphin-watching prices vary by operator, season, and availability.",
    timings: "Beach access is generally possible throughout the day, although daylight visits are recommended. The temple's official visitor information lists darshan from approximately 5:00 AM to 9:00 PM, with aarti at around 5:00 AM, 12:00 PM, and 7:00 PM. Timings can change during festivals and special occasions. Prachin Konkan Museum is commonly listed as open during daytime hours; confirm current timings before visiting.",
    bestTimeToVisit: "Early morning for peaceful temple darshan and a quiet beach walk; late afternoon for scenic coastal drives and sunset photography. October to March is generally the most comfortable period for sightseeing. Summer is particularly appealing to mango lovers, while monsoon visits offer lush greenery but require extra caution near the sea.",
    warnings: [
      "Ganpatipule Beach can have steep underwater slopes, strong currents, and sudden waves. Do not assume the water is safe for swimming; follow local safety instructions and avoid entering the sea during rough conditions.",
      "Avoid swimming during the monsoon and whenever local authorities or lifeguards advise against entering the water.",
      "Water sports and dolphin-watching trips may not operate every day. Confirm availability, weather conditions, operator permissions, and safety equipment before paying.",
      "The temple and beach can become very crowded during weekends, school holidays, and major religious festivals. Plan additional time for darshan, parking, and local travel.",
      "Carry cash for small local vendors and transport, as digital payment connectivity may be inconsistent in some areas.",
      "The roads through the Konkan region can be winding, and some journeys take longer than their map distance suggests. Avoid rushing, particularly after sunset or during heavy rain.",
      "Respect temple customs, including local rules on footwear, dress, photography, and offerings. Follow posted restrictions inside religious premises.",
      "Do not litter on the beach or in surrounding villages. Dispose of waste responsibly and avoid disturbing local wildlife.",
      "Confirm return transport in advance if travelling by public bus, especially for nearby attractions outside the main Ganpatipule village."
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
      "konkan-culture",
      "heritage",
      "road-trip",
      "nature",
      "peaceful",
      "watersports"
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