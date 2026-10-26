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
  approved: true,
  featured: true,
};

async function updateDestination() {
  console.log("🔍 Checking Firestore for destination with slug:", enrichedData.slug);

  // Look for exact slug 'ganpatipule-beach' or base slug 'ganpatipule'
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
