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

const curatedData = {
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
  approved: true,
  featured: true,
};

async function updateDestination() {
  console.log("🔍 Updating Ganpatipule with curated, high-quality structured content...");

  let snapshot = await db.collection("destinations")
    .where("slug", "==", curatedData.slug)
    .get();

  if (snapshot.empty) {
    const baseSlug = curatedData.slug.replace(/-beach$/, "");
    snapshot = await db.collection("destinations")
      .where("slug", "==", baseSlug)
      .get();
  }

  if (!snapshot.empty) {
    for (const doc of snapshot.docs) {
      await doc.ref.update({
        ...curatedData,
        slug: curatedData.slug,
        updatedAt: new Date().toISOString(),
      });
      console.log(`✅ Updated existing document: ${curatedData.name} (ID: ${doc.id})`);
    }
  } else {
    const docRef = await db.collection("destinations").add({
      ...curatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`✅ Created: ${curatedData.name} (ID: ${docRef.id})`);
  }
}

updateDestination()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Update failed:", err);
    process.exit(1);
  });
