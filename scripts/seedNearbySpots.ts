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

const nearbySpots = [
  {
    name: "Bhandarpule Beach",
    slug: "bhandarpule-beach",
    tagline: "A tranquil crescent of golden sand framed by lush green hills",
    shortDescription: "A serene, less-crowded beach situated just 4 km south of Ganpatipule, known for its pristine waters, lush coconut groves, and spectacular clifftop sunset views.",
    description: "Bhandarpule Beach is a peaceful coastal treasure nestled between two green headlands just a few minutes south of Ganpatipule. Unlike the busy main temple beach, Bhandarpule offers an unspoiled, calm retreat where the Arabian Sea crashes gently onto soft golden sand. Backed by towering coconut palms and casuarina trees, it is a favored destination for travelers seeking peaceful beach walks, solitude, and photography away from commercial crowds.",
    category: "beach",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/8/88/Beach_at_Ganpatipule_%282809904525%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/aa/A_Beach_at_GanapatiPule.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/60/GANPATIPULE_BEACH_%281%29.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/8/88/Beach_at_Ganpatipule_%282809904525%29.jpg",
    highlights: [
      "Peaceful secluded crescent beach with minimal crowds",
      "Spectacular sunset viewpoints from the surrounding headlands",
      "Lush backdrop of coconut groves and undulating green hills",
      "Soft golden sand ideal for coastal walking and relaxation"
    ],
    bestSeason: "October to March — Pleasant cool sea breezes and ideal walking weather.",
    howToReach: {
      byRoad: "4 km south of Ganpatipule town along the scenic coastal route to Ratnagiri.",
      byTrain: "Ratnagiri Railway Station (32 km) followed by taxi or auto-rickshaw.",
      tip: "Visit around 5:00 PM to catch golden light reflecting on the beach and cliffs."
    },
    thingsToDo: [
      "Take a peaceful barefoot stroll along the unspoiled shoreline",
      "Watch the sun dip beneath the Arabian Sea from the southern headland",
      "Enjoy a quiet beachside picnic under the shade of coastal palms"
    ],
    foodToTry: [
      "Fresh tender coconut water from local seaside stalls",
      "Authentic Malvani thali and Solkadhi at nearby village eateries"
    ],
    warnings: [
      "⚠️ Underwater drop-offs and strong undercurrents: Swimming is not advised.",
      "No active lifeguards on duty; stay close to the shoreline."
    ],
    stayOptions: "Stay in Ganpatipule (4 km away) or in cliffside boutique resorts along the Aare-Ware coastal road.",
    entryFee: "Free public access.",
    timings: "Open 24/7 (Daylight visits recommended).",
    approved: true,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Prachin Konkan Museum",
    slug: "prachin-konkan",
    tagline: "A vibrant open-air journey through ancient Konkani life and heritage",
    shortDescription: "An expansive 3-acre open-air cultural museum in Ganpatipule that recreates historical Konkan village life, traditional craftsmanship, occupations, and biodiversity.",
    description: "Prachin Konkan is a captivating life-size open-air museum set across three acres of verdant greenery in Ganpatipule. Conceived to preserve and celebrate the centuries-old cultural heritage of the Konkan coast, the park features detailed dioramas portraying traditional occupations such as fishing, farming, pottery, and carpentry, alongside historic weaponry from the Maratha era. Guided walking tours take visitors through shaded nature pathways rich in indigenous herbal plants and native trees.",
    category: "heritage",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1a/PrachinKonkan-Museum-Entrance%2C_Ganpatipule.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/3/30/Ganpatipule-Temple.JPG"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/1/1a/PrachinKonkan-Museum-Entrance%2C_Ganpatipule.JPG",
    highlights: [
      "3-acre shaded open-air cultural village walkthrough",
      "Life-size models of ancient Konkan traditions, homes, and trades",
      "Maratha-era weapon museum and historic artifacts",
      "Herbal garden with medicinal coastal plant species"
    ],
    bestSeason: "October to March — Cool shaded pathways make the outdoor walk pleasant.",
    howToReach: {
      byRoad: "Located just 1.5 km from Ganpatipule Mandir, easily reached by auto or a 15-minute walk.",
      byTrain: "Ratnagiri Railway Station (30 km).",
      tip: "Guided tours take about 45 minutes; morning or late afternoon visits avoid midday heat."
    },
    thingsToDo: [
      "Take the guided walking tour to understand ancient Konkan village customs",
      "Explore the Maratha armor and weaponry exhibition",
      "Shop for local Konkan handicraft souvenirs and organic spices at the museum store"
    ],
    foodToTry: [
      "Fresh Kokum Sharbat served cold at the museum entrance",
      "Traditional Aam Papad (Ambapoli) and cashew treats"
    ],
    entryFee: "Nominal entry ticket (~₹40 per person).",
    timings: "Open daily from 8:30 AM to 6:00 PM.",
    approved: true,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Malgund",
    slug: "malgund",
    tagline: "Birthplace of legendary poet Keshavsut amid coastal coconut groves",
    shortDescription: "A charming Konkan village just 3 km north of Ganpatipule, famous as the home of revered modern Marathi poet Keshavsut and renowned for quiet rural beaches and homestays.",
    description: "Malgund is a peaceful, scenic village situated along the coastline barely 3 km from Ganpatipule. It holds a cherished place in Maharashtra's cultural history as the birthplace of Krishnaji Keshav Damle, known popularly as 'Keshavsut', the father of modern Marathi poetry. Visitors can tour the poet's preserved ancestral home and the Keshavsut Smarak memorial library, or wander through quiet village lanes surrounded by betel-nut palms and uncrowded coastal sand.",
    category: "heritage",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Malgund_creek%2C_Ganpatipule_%2852535141946%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/60/GANPATIPULE_BEACH_%281%29.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Malgund_creek%2C_Ganpatipule_%2852535141946%29.jpg",
    highlights: [
      "Keshavsut Smarak — Memorial and library of Marathi literature",
      "Preserved ancestral home of poet Keshavsut",
      "Serene, quiet Malgund beach and picturesque tidal creek",
      "Authentic family-run Konkani homestays"
    ],
    bestSeason: "October to March.",
    howToReach: {
      byRoad: "3 km north of Ganpatipule on the road towards Jaigad.",
      tip: "Combine with a visit to Jaigad Fort for a scenic day excursion."
    },
    thingsToDo: [
      "Visit the Keshavsut Memorial and explore literary exhibits",
      "Walk along the peaceful Malgund creek at sunset",
      "Enjoy an authentic home-cooked Malvani lunch at a local homestay"
    ],
    foodToTry: [
      "Ghavane with spicy coconut chutney",
      "Homemade Malvani fish curry thali with steaming rice"
    ],
    entryFee: "Free entry to the village and beach; nominal fee for the memorial library.",
    timings: "Open daily.",
    approved: true,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Kolaba Fort",
    slug: "kolaba-fort",
    tagline: "An imposing 17th-century sea fort standing defiant amid the Arabian tides",
    shortDescription: "A historic sea fortress constructed by Chhatrapati Shivaji Maharaj located 1-2 km off the shore of Alibaug Beach, accessible on foot or horse carriage during low tide.",
    description: "Kolaba Fort (also known as Alibaug Fort) is one of Maharashtra's most celebrated maritime fortresses. Chosen by Chhatrapati Shivaji Maharaj in 1680 as a major naval battle station and fortified by Kanhoji Angre, the fort sits right in the sea off the coast of Alibaug. During low tide, the sea recedes, allowing visitors to walk or take horse-drawn carriages across the wet sands directly into the fortified gates. The interior retains historic cannons, freshwater wells, temple shrines, and massive stone bastions facing the open ocean.",
    category: "fort",
    region: "Raigad",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/Kolaba_Fort_-_Alibag.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/0/0b/Alibaug_Fort_South_CauseWay.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/2/26/Alibag_Beach.JPG"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Kolaba_Fort_-_Alibag.JPG",
    highlights: [
      "Historic sea fortress engineered by Chhatrapati Shivaji Maharaj",
      "Thrilling low-tide walk across the ocean floor to enter the fort",
      "Massive stone ramparts, seaward bastions, and ancient cannons",
      "Freshwater temple tank inside an ocean fortress"
    ],
    bestSeason: "October to May — Clear sunny weather and predictable tide cycles.",
    howToReach: {
      byRoad: "1-2 km offshore from Alibaug Beach. Reach Alibaug via Panvel/Pen or ferry from Gateway of India to Mandwa.",
      tip: "Always check local daily tide charts before starting the walk across the sand to the fort."
    },
    thingsToDo: [
      "Walk across the exposed seabed at low tide to enter the main gate",
      "Inspect historic artillery and cannons along the western sea bastions",
      "Explore the Siddhivinayak temple inside the fort enclosure"
    ],
    foodToTry: [
      "Alibaug special Surmai fry and seafood thali after returning to the beach",
      "Hot roasted corn and Solkadhi on the Alibaug beach promenade"
    ],
    warnings: [
      "⚠️ Never attempt to cross back during rising high tide. Return before the water level begins to rise.",
      "Wear sturdy footwear as wet sand and tidal rocks can be slippery."
    ],
    entryFee: "Nominal ASI entry ticket (~₹25 for adults).",
    timings: "Access is strictly tide-dependent; typically 9:30 AM to 5:30 PM during low tide windows.",
    approved: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

async function seedSpots() {
  console.log("🌊 Seeding nearby spots into Firestore...");

  for (const spot of nearbySpots) {
    const snap = await db.collection("destinations").where("slug", "==", spot.slug).get();
    if (!snap.empty) {
      console.log(`ℹ️ Updating existing spot: ${spot.name}`);
      await snap.docs[0].ref.update({ ...spot, updatedAt: new Date().toISOString() });
    } else {
      console.log(`✅ Adding new spot: ${spot.name}`);
      await db.collection("destinations").add(spot);
    }
  }

  console.log("🎉 All nearby spots seeded successfully!");
}

seedSpots()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
