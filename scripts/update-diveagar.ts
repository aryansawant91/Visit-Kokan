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
  "name": "Diveagar",
  "slug": "diveagar",
  "tagline": "Golden sands, whispering casuarinas, and the sacred abode of Suvarna Ganesh",
  "shortDescription": "A serene coastal hamlet in Raigad renowned for its 5-km stretch of untouched golden sands bordered by dense casuarina groves. It is equally celebrated as the sacred home of the historic Suvarna Ganesh Temple.",
  "description": "Diveagar is a tranquil coastal sanctuary located in the Shrivardhan taluka of Raigad district, celebrated for its expansive 5-kilometer shoreline of hard-packed sands where gentle waves meet dense casuarina and betel nut orchards. Historically renowned following the dramatic 1997 discovery of a pure gold Ganesha mask buried in a local wadi, the village combines deep spiritual heritage with unspoiled Konkani charm. Days here move at an unhurried coastal rhythm, whether you are enjoying quad biking and parasailing on the breezy flats or relishing authentic home-cooked Surmai thalis and hot Ukdiche Modak under coconut palms. It is an ideal escape for families seeking a wholesome seaside retreat, road-tripping couples, and spiritual travelers longing for uncommercialized serenity.",
  "category": "beach",
  "region": "Raigad",
  "images": [
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Diveagar_beach.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/68/Diveagar_Ganpati_Temple.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/2/25/Diveagar_beach_another_view.jpg"
  ],
  "coverImage": "https://upload.wikimedia.org/wikipedia/commons/8/89/Diveagar_beach.jpg",
  "highlights": [
    "Suvarna Ganesh idol adorned with intricate craftsmanship and gold leaf",
    "5-km wide shoreline with firm white sands perfect for sunset strolls",
    "Dense green canopy of coastal Suru (casuarina) and betel nut plantations",
    "12th-century Rupnarayan Temple featuring an intricately carved black-stone Vishnu idol",
    "Thrilling beach water sports including parasailing, jet skiing, and ATV quad rides",
    "Winter migratory bird sightings and occasional Olive Ridley sea turtle nesting"
  ],
  "bestSeason": "October to March — Pleasant coastal breeze, calm seas safe for water activities, and crisp evening sunsets",
  "howToReach": {
    "byTrain": "Nearest railway station is Mangaon (48 km) on the Konkan Railway; take an MSRTC bus or local shared/private taxi via Mhasla to Diveagar (approx. 1 hour 15 minutes).",
    "byRoad": "From Mumbai (180 km): Take NH66 via Vadkhal Naka and Mangaon, turning right at Lonere/Mangaon onto SH99 towards Mhasla and Diveagar; From Pune (160 km): Drive through the scenic Tamhini Ghat to Mangaon, then continue via Mhasla.",
    "byFerry": "Take the Ro-Ro or speed ferry from Ferry Wharf (Bhaucha Dhakka) / Gateway of India to Mandwa, drive via Alibaug to Agardanda Jetty, and take the vehicle ferry to Dighi Jetty (15 km drive to Diveagar).",
    "tip": "Taking the Agardanda-Dighi vehicle ferry saves over 45 km of winding ghat road when driving from Alibaug or Murud."
  },
  "thingsToDo": [
    "Seek blessings at the Suvarna Ganesh Temple and admire the restored sanctum sanctorum",
    "Walk barefoot along the sprawling 5-km shoreline during low tide when the flat sand resembles a mirror",
    "Experience beach adventure sports including parasailing, banana boat rides, and ATV quad rides",
    "Explore the ancient 12th-century Rupnarayan Temple nestled within betel nut wadis",
    "Spot seagulls and winter waders near the northern creek estuary during sunrise"
  ],
  "foodToTry": [
    "Authentic Surmai and Pomfret Thali at Patil Khanaval or Bapat Khanaval, accompanied by tangy Solkadhi",
    "Ukdiche Modak — freshly steamed rice-flour dumplings stuffed with coconut and jaggery, drenched in pure ghee",
    "Ghavane with spicy coconut chutney for an authentic Konkani breakfast",
    "Chilled Kokum Sharbat and sweet tender coconut water from local seaside stalls"
  ],
  "nearbyPlaces": [
    {
      "name": "Harihareshwar",
      "distance": "37 km",
      "why": "The 'Kashi of the South' featuring an ancient Shiva temple and dramatic sea-cliff pradakshina path"
    },
    {
      "name": "Shrivardhan",
      "distance": "20 km",
      "why": "Historic Peshwa town with a black-sand beach promenade and aromatic spice plantations"
    },
    {
      "name": "Murud-Janjira Fort",
      "distance": "25 km (via Dighi ferry)",
      "why": "Legendary unconquered sea fort rising dramatically from the Arabian Sea waves"
    },
    {
      "name": "Kondivli Beach",
      "distance": "12 km",
      "why": "Secluded pristine beach renowned for water sports and the cliff-side Shankar Temple"
    },
    {
      "name": "Arawali",
      "distance": "6 km",
      "why": "Charming village home to the ancient, peaceful Shri Vyaghreshwar Temple"
    }
  ],
  "stayOptions": "Budget to Mid-range — Authentic Konkani village homestays with betel nut gardens, MTDC-affiliated coastal cottages, and boutique beach retreats like Exotica by the Sea.",
  "entryFee": "Free entry to beach and temples; water sports range from ₹300 to ₹1,200 per activity; ATV rides ₹200-₹300.",
  "timings": "Beach open 24 hours; Water sports operate 8:00 AM to 6:30 PM; Suvarna Ganesh Temple open 6:00 AM to 8:30 PM",
  "bestTimeToVisit": "Early morning for tranquil beach walks and temple darshan; late afternoon to sunset for water sports and golden hour photography",
  "warnings": [
    "Strong undercurrents near the creek mouth (northern end) — avoid swimming during high tide or venturing deep into the water",
    "Do not drive private cars onto the soft sand at high tide as vehicles frequently get bogged down",
    "Limited bank ATMs in Diveagar village; mobile data and UPI can be erratic, so carry sufficient cash"
  ],
  "tags": [
    "beach",
    "family",
    "temple",
    "watersports",
    "photography",
    "weekend-getaway",
    "seafood",
    "peaceful"
  ]
};

async function updateDestination() {
  console.log("🔍 Enriched destination payload preview (Dry-Run):");
  console.log(JSON.stringify(enrichedData, null, 2));
  console.log("\n🚀 Initiating Firestore document update for slug:", enrichedData.slug);

  const snapshot = await db.collection("destinations")
    .where("slug", "==", enrichedData.slug)
    .get();

  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    await docRef.update({ ...enrichedData, updatedAt: new Date().toISOString() });
    console.log(`✅ Updated: ${enrichedData.name}`);
  } else {
    console.log(`❌ Not found: ${enrichedData.slug} — run seed first`);
  }
}

updateDestination()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Update failed:", err);
    process.exit(1);
  });
