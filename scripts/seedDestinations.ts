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
    name: "Alibaug",
    slug: "alibaug",
    description: "Alibaug is the weekend capital of Mumbai — a charming coastal town with historic sea forts, clean beaches, and a relaxed vibe. The iconic Kolaba Fort stands in the middle of the sea and is accessible by foot during low tide.",
    category: "beach",
    region: "Alibaug",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    ],
    highlights: ["Kolaba Fort", "Beach Walks", "Ferry from Gateway", "Water Sports", "Fresh Seafood"],
    bestSeason: "October to February",
    howToReach: "Take a ferry from Gateway of India, Mumbai (1.5 hours) — the most scenic route. By road it is 95 km from Mumbai. MSRTC buses run frequently from Mumbai.",
    featured: true,
    approved: true,
    addedBy: "seed-script",
    addedByAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Ganpatipule",
    slug: "ganpatipule",
    description: "Ganpatipule is a sacred coastal town where the ancient Swayambhu Ganesh temple meets the Arabian Sea. The self-manifested idol of Lord Ganesha here is over 400 years old. The pristine beach stretching beside the temple is one of Maharashtra's most scenic.",
    category: "temple",
    region: "Ratnagiri",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80",
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80",
    ],
    highlights: ["Swayambhu Ganesh Temple", "Pristine Beach", "Sunrise Views", "MTDC Resort", "Jaigad Fort"],
    bestSeason: "October to March",
    howToReach: "Nearest railway station is Ratnagiri (25 km). MSRTC buses run from Ratnagiri to Ganpatipule. By road it is 375 km from Mumbai via NH66.",
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