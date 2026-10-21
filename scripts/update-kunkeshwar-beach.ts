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
  "name": "Kunkeshwar Beach",
  "slug": "kunkeshwar-beach",
  "tagline": "Where sacred stone meets the endless sea, and Konkan whispers its timeless stories",
  "shortDescription": "A beautiful coastal destination in Devgad taluka of Sindhudurg, famous for its serene Arabian Sea shoreline, the ancient Kunkeshwar Shiva Temple, and the timeless charm of traditional Malvani life.",
  "description": "Kunkeshwar is a peaceful coastal haven nestled along the Arabian Sea in Sindhudurg district, Maharashtra. Known as the 'Kashi of South Konkan', this destination brings together the raw beauty of the Konkan coastline and the spiritual grandeur of its historic Shiva temple. Believed to date back to the 11th or 12th century, the Kunkeshwar Temple stands close to the sea, its traditional stone architecture carrying centuries of devotion and coastal history. The surrounding beach invites visitors to slow down, walk along the shoreline, watch fishing boats move across the horizon, and experience sunsets painted in gold and amber. Coconut palms, nearby villages, and authentic Malvani kitchens add to its unhurried charm. Whether you are a spiritual traveler, a family seeking a peaceful coastal holiday, a couple exploring the Konkan coast, or a photography enthusiast chasing beautiful seascapes, Kunkeshwar offers a memorable blend of nature, heritage, and local culture.",
  "category": "beach",
  "region": "Sindhudurg",
  "images": [
    "https://upload.wikimedia.org/wikipedia/commons/b/b8/Kunakeshwar.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/9/92/Kunkeshwar_seashore_kokan.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/9a/Approaching_Kunkeshwar_%285363568029%29.jpg"
  ],
  "coverImage": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Kunakeshwar.JPG",
  "highlights": [
    "Historic Kunkeshwar Shiva Temple, an important pilgrimage site popularly known as the Kashi of South Konkan",
    "A scenic Arabian Sea shoreline ideal for peaceful walks, coastal photography, and sunset watching",
    "Traditional stone temple architecture reflecting historic Yadava-era influences",
    "Beautiful views of the temple and sea, creating a distinctive blend of spiritual heritage and coastal scenery",
    "Authentic Malvani cuisine featuring fresh seafood, coconut-based curries, and refreshing Solkadhi",
    "Convenient access to the coastal attractions of Devgad, including Devgad Fort, lighthouse, and nearby beaches",
    "Annual Mahashivratri celebrations and pilgrimage traditions that bring the village to life"
  ],
  "bestSeason": "October to March — Pleasant weather for exploring the beach, visiting the temple, enjoying coastal drives, and discovering nearby attractions. February is particularly significant for Mahashivratri, although festival dates vary each year.",
  "howToReach": {
    "byTrain": "Kankavli and Nandgaon are commonly used railway stations for reaching Kunkeshwar. Maharashtra Tourism lists Nandgaon at approximately 45 km and Kankavli at approximately 52 km. From either station, continue by local bus or taxi; confirm current transport availability and road distance before travelling.",
    "byRoad": "From Mumbai: Approximately 440–450 km, depending on the route, via NH66 and connecting roads towards Devgad and Kunkeshwar. From Pune: Travel via the Konkan-bound highway routes towards Kolhapur or the coastal highway network, then continue towards Devgad. Actual distance and journey time depend on the selected route and road conditions.",
    "byFerry": "There is no established direct ferry route to Kunkeshwar that should be relied upon for routine travel. The most practical option is road or rail followed by a local road transfer.",
    "tip": "For a convenient trip, check trains to Kankavli or Nandgaon and arrange onward transport in advance. If driving, consider combining Kunkeshwar with Devgad Fort, Devgad Beach, and nearby coastal villages."
  },
  "thingsToDo": [
    "Visit the ancient Kunkeshwar Shiva Temple and admire its traditional stone architecture and seaside setting",
    "Take a leisurely walk along Kunkeshwar Beach and enjoy the sound of the Arabian Sea",
    "Watch the sunrise or sunset over the coastline and capture the changing colours of the sea",
    "Explore the surrounding village, coconut groves, and traditional Konkani homes",
    "Taste authentic Malvani fish thali, Solkadhi, and other regional specialities at local eateries",
    "Visit during Mahashivratri to experience the area's important religious celebrations",
    "Plan a coastal day trip to Devgad Fort, Devgad Lighthouse, and nearby beaches",
    "Enjoy boating or water sports only when locally available, operated by authorised providers, and permitted by sea conditions"
  ],
  "foodToTry": [
    "Malvani Fish Thali — Fresh local fish curry, rice, fried fish, and traditional Malvani masala",
    "Surmai or Pomfret Fry — Fish coated with a spicy coastal masala and shallow-fried or fried until crisp",
    "Solkadhi — A refreshing kokum and coconut-milk drink traditionally served with seafood meals",
    "Ghavane with Coconut Chutney — Soft rice-based pancakes enjoyed as a traditional Konkani breakfast",
    "Ukdiche Modak — Steamed rice-flour dumplings filled with coconut and jaggery",
    "Malvani Chicken Curry — A richly spiced regional curry prepared with coconut and traditional Malvani masala",
    "Seasonal Alphonso Mangoes — A regional speciality of the wider Devgad area, especially during the summer harvest"
  ],
  "nearbyPlaces": [
    {
      "name": "Devgad",
      "distance": "Approximately 14–15 km",
      "why": "A coastal town known for its harbour, famous Alphonso mangoes, local markets, and access to several scenic attractions."
    },
    {
      "name": "Devgad Beach",
      "distance": "Approximately 7–10 km",
      "why": "A pleasant coastal stretch suitable for seaside walks, relaxation, and exploring the surroundings of Devgad town."
    },
    {
      "name": "Devgad Fort and Lighthouse",
      "distance": "Approximately 10–15 km",
      "why": "A historic coastal fortification and a lighthouse area offering views of the Arabian Sea and a glimpse into the maritime history of the Konkan coast."
    },
    {
      "name": "Mithmumbari Beach",
      "distance": "Approximately 3–6 km",
      "why": "A quieter neighbouring beach known for its scenic coastline, relaxed atmosphere, and coastal photography opportunities."
    },
    {
      "name": "Taramumbari Beach",
      "distance": "Approximately 5–8 km",
      "why": "A peaceful coastal destination suited to travellers who enjoy less-crowded beaches and exploring small Konkan villages."
    },
    {
      "name": "Vijaydurg Fort",
      "distance": "Approximately 40–45 km",
      "why": "A historically significant sea fort associated with Maratha naval history, offering impressive coastal views and a rewarding heritage excursion."
    },
    {
      "name": "Malvan",
      "distance": "Approximately 35–45 km",
      "why": "A popular coastal town celebrated for Malvani seafood, local culture, and access to Sindhudurg Fort and marine activities."
    }
  ],
  "stayOptions": "Budget to mid-range — Look for local homestays, family-run guesthouses, and small coastal accommodations in Kunkeshwar and the surrounding Devgad area. Additional hotel options are available in Devgad. Confirm current availability, amenities, meals, and beach access directly with the property before booking.",
  "entryFee": "Beach access is generally free. The temple is a place of worship; confirm any special arrangements during festivals. Water sports and boat rides, where available, are separately charged, and prices depend on the operator and activity.",
  "timings": "Beach access is generally possible throughout the day, but visiting during daylight is recommended. The Government of India tourism listing gives temple darshan hours of approximately 5:00 AM to 7:00 PM; confirm timings locally, especially during Mahashivratri and other festivals.",
  "bestTimeToVisit": "Early morning for a peaceful beach walk and temple darshan; late afternoon for coastal photography and sunset views. October to March is generally the most comfortable season for sightseeing.",
  "warnings": [
    "The Arabian Sea can have strong currents, sudden waves, and changing tides. Do not enter the water unless local conditions and safety guidance permit it.",
    "Avoid swimming during the monsoon and whenever warning flags, rough seas, or local restrictions are in place.",
    "Do not assume that water sports, scuba diving, parasailing, or boat rides operate daily at Kunkeshwar. Verify local availability and safety arrangements before planning activities.",
    "Mahashivratri can bring heavy crowds, traffic, and accommodation pressure. Book transport and lodging in advance if travelling during the festival.",
    "Public transport and onward connections may be limited, particularly outside peak travel hours. Arrange return transport before heading to the beach.",
    "Carry sufficient cash and essential supplies, as payment facilities and services may be limited in smaller villages.",
    "Respect temple customs, local residents, and the natural surroundings. Avoid littering and follow instructions around the temple and beach."
  ],
  "tags": [
    "beach",
    "temple",
    "spiritual",
    "family",
    "sunset",
    "photography",
    "weekend-getaway",
    "malvani-food",
    "seafood",
    "heritage",
    "peaceful",
    "konkan"
  ]
};

async function updateDestination() {
  console.log("🔍 Enriched destination payload preview (Dry-Run):");
  console.log(JSON.stringify(enrichedData, null, 2));
  console.log("\n🚀 Initiating Firestore document update for slug:", enrichedData.slug);

  // Look for exact slug or existing base slug 'kunkeshwar'
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
    const docRef = snapshot.docs[0].ref;
    await docRef.update({ ...enrichedData, updatedAt: new Date().toISOString() });
    console.log(`✅ Updated: ${enrichedData.name} (Document ID: ${docRef.id})`);
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
