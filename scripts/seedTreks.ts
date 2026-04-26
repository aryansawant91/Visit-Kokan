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

const treks = [
  {
    name: "Rajmachi Fort Trek",
    slug: "rajmachi-fort-trek",
    description: "Rajmachi is one of the most popular overnight treks near Mumbai and Pune. The trail winds through dense Sahyadri forests before opening up to the twin forts of Shrivardhan and Manaranjan perched dramatically above the Konkan coastline. On clear days you can see the entire Konkan plains stretching to the sea.",
    category: "fort",
    region: "Raigad",
    difficulty: "moderate",
    duration: "2 Days 1 Night",
    distance: "28 km",
    maxAltitude: "925m",
    startPoint: "Lonavala",
    endPoint: "Udhewadi Village",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    ],
    highlights: ["Twin Fort Ruins", "Konkan Viewpoint", "Village Homestay", "Waterfall en Route", "Sunrise from Fort"],
    itinerary: [
      { day: 1, title: "Lonavala to Udhewadi Base Village", description: "Start early from Lonavala station. The trail descends through a narrow gorge and passes through dense forests before reaching Udhewadi village. Set up camp or stay in local homestay.", distance: "14 km", duration: "6–7 hours" },
      { day: 2, title: "Summit to Shrivardhan & Manaranjan Forts", description: "Early morning climb to both forts. Watch the sunrise over the Konkan plains. Explore the fort ruins, cisterns, and ancient cannons. Descend back to Lonavala via the same trail.", distance: "14 km", duration: "7–8 hours" },
    ],
    thingsToBring: ["Trekking shoes", "Rain jacket", "Headlamp", "2L water bottle", "Energy bars", "First aid kit", "Warm layer for night", "Sleeping bag"],
    bestSeason: "June to September",
    price: 1200,
    groupSize: "4-20 people",
    featured: true,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Kalavantin Durg Trek",
    slug: "kalavantin-durg-trek",
    description: "Kalavantin Durg is one of Maharashtra's most thrilling treks — a nearly vertical climb up ancient steps carved directly into a rocky pinnacle. The summit offers jaw-dropping 360-degree views of the Sahyadris and on clear days, the Arabian Sea glittering in the distance.",
    category: "fort",
    region: "Raigad",
    difficulty: "hard",
    duration: "1 Day",
    distance: "8 km",
    maxAltitude: "2300m",
    startPoint: "Panvel",
    endPoint: "Panvel",
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    highlights: ["Vertical Rock Steps", "360° Panoramic Views", "Sea View on Clear Days", "Prabalgad Nearby", "Adrenaline Summit"],
    itinerary: [
      { day: 1, title: "Panvel to Kalavantin Summit and Back", description: "Start at 5 AM from Panvel. Trek through Thakurwadi village to the base of the pinnacle. The final ascent involves climbing ancient rock-cut steps — exhilarating but requires caution. Summit, enjoy views, and descend carefully. Return to Panvel by evening.", distance: "8 km", duration: "8–9 hours" },
    ],
    thingsToBring: ["Good grip trekking shoes", "Gloves", "Headlamp", "2L water", "Light snacks", "Sunscreen", "Camera"],
    bestSeason: "October to March",
    price: 800,
    groupSize: "2-12 people",
    featured: true,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Tamhini Ghat Waterfall Trek",
    slug: "tamhini-ghat-waterfall-trek",
    description: "Tamhini Ghat transforms into a paradise of cascading waterfalls during monsoon. This easy trail winds through dense forests and grasslands, passing multiple seasonal waterfalls. Perfect for first-time trekkers and families looking for a scenic monsoon experience.",
    category: "waterfall",
    region: "Raigad",
    difficulty: "easy",
    duration: "1 Day",
    distance: "6 km",
    startPoint: "Tamhini Ghat Checkpoint",
    endPoint: "Tamhini Ghat Checkpoint",
    images: [
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    highlights: ["Multiple Waterfalls", "Dense Forest Cover", "Bird Watching", "Scenic Grasslands", "Family Friendly"],
    itinerary: [
      { day: 1, title: "Forest & Waterfall Loop", description: "Start from the Tamhini checkpoint. The trail enters dense forest immediately, crossing multiple streams. Three major waterfalls are reachable within 3 km. Return via the same route. Pack a picnic lunch.", distance: "6 km", duration: "4–5 hours" },
    ],
    thingsToBring: ["Waterproof sandals", "Change of clothes", "Waterproof bag", "Snacks", "Insect repellent"],
    bestSeason: "June to September",
    price: 500,
    groupSize: "2-30 people",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Sindhudurg Coastal Trek",
    slug: "sindhudurg-coastal-trek",
    description: "Walk along the untouched coastline of Sindhudurg — past hidden coves, rocky headlands, fishing villages, and coconut groves with the Arabian Sea constantly beside you. This low-difficulty coastal trail is perfect for those who want scenic beauty without the climb.",
    category: "coastal",
    region: "Sindhudurg",
    difficulty: "easy",
    duration: "1 Day",
    distance: "10 km",
    startPoint: "Tarkarli Beach",
    endPoint: "Malvan Town",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    ],
    highlights: ["Sea Views Throughout", "Fishing Villages", "Hidden Coves", "Sindhudurg Fort View", "Fresh Coconut Stops"],
    itinerary: [
      { day: 1, title: "Tarkarli to Malvan Coast Walk", description: "Start at Tarkarli beach at sunrise. Walk north along the coast, stopping at fishing hamlets for chai. The midpoint overlooks Sindhudurg Fort on its island. Finish in Malvan town for a traditional Malvani lunch.", distance: "10 km", duration: "5–6 hours" },
    ],
    thingsToBring: ["Comfortable walking shoes", "Sunhat", "Sunscreen", "2L water", "Camera", "Light snack"],
    bestSeason: "October to March",
    price: 600,
    groupSize: "2-25 people",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Harishchandragad Trek",
    slug: "harishchandragad-trek",
    description: "Harishchandragad is one of the most majestic treks in the Western Ghats — home to the dramatic Konkan Kada cliff face, ancient cave temples, and the stunning Taramati peak. The Konkan Kada overhang is one of Maharashtra's most photographed viewpoints, offering a sheer drop of over 1000 metres.",
    category: "forest",
    region: "Raigad",
    difficulty: "hard",
    duration: "2 Days 1 Night",
    distance: "24 km",
    maxAltitude: "1429m",
    startPoint: "Khireshwar Village",
    endPoint: "Khireshwar Village",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    highlights: ["Konkan Kada Overhang", "Ancient Cave Temple", "Taramati Peak", "Kedareshwar Cave", "Stargazing at Camp"],
    itinerary: [
      { day: 1, title: "Khireshwar to Harishchandragad Plateau", description: "Trek through dense forest and rocky terrain. Cross several streams. Reach the plateau by afternoon. Visit the ancient Harishchandreshwar temple. Camp on the plateau.", distance: "12 km", duration: "7–8 hours" },
      { day: 2, title: "Konkan Kada & Summit", description: "Early morning visit to Konkan Kada for sunrise. Trek to Taramati peak — highest point. Explore Kedareshwar cave with the Shivling. Descend back to Khireshwar village.", distance: "12 km", duration: "7 hours" },
    ],
    thingsToBring: ["Trekking poles", "Sleeping bag", "Warm layers", "Headlamp", "3L water", "High energy food", "First aid", "Rain gear"],
    bestSeason: "October to March",
    price: 1800,
    groupSize: "4-15 people",
    featured: true,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Bankot Fort Coastal Trek",
    slug: "bankot-fort-coastal-trek",
    description: "Bankot Fort (also called Fort Himmatgad) sits at the confluence of the Savitri river and the Arabian Sea near Dapoli. This easy coastal trek from Harne fishing village to the fort rewards trekkers with stunning sea views, a historic Portuguese-era fort, and the sight of the Savitri river meeting the ocean.",
    category: "coastal",
    region: "Dapoli",
    difficulty: "easy",
    duration: "1 Day",
    distance: "7 km",
    startPoint: "Harne Village",
    endPoint: "Harne Village",
    images: [
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    highlights: ["River Meets Sea", "Portuguese Fort Ruins", "Fishing Village", "Sea Views", "Bird Watching"],
    itinerary: [
      { day: 1, title: "Harne to Bankot Fort and Back", description: "Start from Harne fishing village. Walk along the coastal path with the sea to your left. Climb to Bankot Fort — explore the bastions and cannons. Spectacular views of the river delta. Return to Harne for fresh fish lunch.", distance: "7 km", duration: "4 hours" },
    ],
    thingsToBring: ["Comfortable shoes", "Water", "Sunhat", "Camera", "Light snack"],
    bestSeason: "October to May",
    price: 400,
    groupSize: "2-20 people",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Amboli Sunset Night Trek",
    slug: "amboli-sunset-night-trek",
    description: "Experience the magic of Amboli's misty forests after dark. This guided night trek through the dense Western Ghats forest of Amboli is famous for glowing bioluminescent fungi, endemic frogs calling in the darkness, and the dramatic Amboli viewpoint lit by stars. A unique experience unlike any other trek in Maharashtra.",
    category: "night",
    region: "Sindhudurg",
    difficulty: "moderate",
    duration: "1 Night",
    distance: "5 km",
    startPoint: "Amboli Viewpoint",
    endPoint: "Amboli Viewpoint",
    images: [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    ],
    highlights: ["Bioluminescent Fungi", "Endemic Frogs", "Stargazing", "Misty Forest", "Night Bird Calls"],
    itinerary: [
      { day: 1, title: "Sunset to Midnight Forest Trail", description: "Assemble at Amboli viewpoint at 6 PM. Watch the sunset over the Konkan plains far below. As darkness falls, enter the forest. Spot glowing fungi, hear endemic frogs, watch the Milky Way. Return by midnight. Guide mandatory.", distance: "5 km", duration: "5–6 hours" },
    ],
    thingsToBring: ["Headlamp + spare batteries", "Warm jacket", "Insect repellent", "Waterproof shoes", "No phone torch — use headlamp only"],
    bestSeason: "June to September",
    price: 900,
    groupSize: "4-12 people",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Kokan Kada Ridge Walk",
    slug: "kokan-kada-ridge-walk",
    description: "A breathtaking ridge walk along the edge of the Western Ghats where the mountains drop vertically into the Konkan plains below. This moderate trek follows the escarpment edge with constant panoramic views over the entire Konkan coastline. On clear winter mornings you can see the Arabian Sea from the ridge.",
    category: "forest",
    region: "Ratnagiri",
    difficulty: "moderate",
    duration: "1 Day",
    distance: "14 km",
    maxAltitude: "1050m",
    startPoint: "Kashedi Ghat",
    endPoint: "Kashedi Ghat",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    highlights: ["Ridge Top Views", "Konkan Plains Panorama", "Sea View", "Wild Flowers", "Forest Birds"],
    itinerary: [
      { day: 1, title: "Ridge Walk with Konkan Views", description: "Start at dawn from Kashedi Ghat. Climb to the ridge in 2 hours. Walk north along the ridge edge for 5 km with constant views. Lunch at the highest point. Return via the forest trail on the plateau side.", distance: "14 km", duration: "7–8 hours" },
    ],
    thingsToBring: ["Trekking shoes", "Windcheater", "3L water", "Packed lunch", "Binoculars", "Sunscreen"],
    bestSeason: "October to February",
    price: 700,
    groupSize: "2-18 people",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Ratnagiri Village Heritage Walk",
    slug: "ratnagiri-village-heritage-walk",
    description: "A slow, immersive walk through traditional Konkan villages near Ratnagiri — past red-roofed houses, mango orchards, temples with carved wooden doors, and paddy fields. Stop at a local home for a traditional Malvani lunch. This is less a trek and more a cultural journey through the living heritage of the Konkan coast.",
    category: "village",
    region: "Ratnagiri",
    difficulty: "easy",
    duration: "1 Day",
    distance: "8 km",
    startPoint: "Ratnagiri Town",
    endPoint: "Ratnagiri Town",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    ],
    highlights: ["Traditional Konkan Houses", "Mango Orchards", "Local Malvani Lunch", "Temple Architecture", "Meet Local Artisans"],
    itinerary: [
      { day: 1, title: "Village to Village Cultural Trail", description: "Start at Ratnagiri's old market at 8 AM. Walk through three traditional villages. Visit the 17th century Bhagavati temple. Stop at a Kokani farmer's home for fresh coconut water. Traditional lunch at a local family. Evening stroll to Ratnadurg Fort.", distance: "8 km", duration: "6 hours" },
    ],
    thingsToBring: ["Comfortable walking shoes", "Camera", "Small gift for host family", "Notebook for sketching / journaling"],
    bestSeason: "October to March",
    price: 850,
    groupSize: "2-15 people",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Devkund Waterfall Trek",
    slug: "devkund-waterfall-trek",
    description: "Devkund is Dapoli's crown jewel — a pristine natural pool at the base of a 80-foot waterfall deep in the Bhira forest. The trail follows the Kundalika river through dense forest, crossing streams multiple times before reaching the emerald-green pool. Swimming is permitted and the water is crystal clear.",
    category: "waterfall",
    region: "Dapoli",
    difficulty: "moderate",
    duration: "1 Day",
    distance: "10 km",
    startPoint: "Bhira Village",
    endPoint: "Bhira Village",
    images: [
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    ],
    highlights: ["80-foot Waterfall", "Natural Swimming Pool", "River Crossings", "Dense Forest", "Crystal Clear Water"],
    itinerary: [
      { day: 1, title: "Bhira to Devkund Waterfall", description: "Start from Bhira village. The trail immediately enters thick forest and follows the river. Multiple stream crossings — waterproof shoes essential. The waterfall appears suddenly around a bend. Swim in the natural pool. Return before 4 PM.", distance: "10 km", duration: "6–7 hours" },
    ],
    thingsToBring: ["Waterproof shoes", "Swimwear", "Dry bag", "2L water", "Energy bars", "Towel", "Insect repellent"],
    bestSeason: "June to October",
    price: 650,
    groupSize: "4-20 people",
    featured: false,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log("🥾 Seeding Kokan treks...\n");

  const existing = await db.collection("treks").get();
  const existingSlugs = new Set(existing.docs.map((d) => d.data().slug));

  let added = 0;
  let skipped = 0;

  for (const trek of treks) {
    if (existingSlugs.has(trek.slug)) {
      console.log(`⏭️  Skipped (already exists): ${trek.name}`);
      skipped++;
      continue;
    }
    await db.collection("treks").add(trek);
    console.log(`✅ Added: ${trek.name} (${trek.difficulty} — ${trek.duration})`);
    added++;
  }

  console.log(`\n🎉 Done! Added ${added}, Skipped ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});