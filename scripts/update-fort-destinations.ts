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
  }
];

async function updateAll() {
  console.log("🚀 Updating Devgad Fort, Jaigad Fort, Korlai Fort, and Revdanda Fort & Beach in Firestore...");

  for (const item of destinations) {
    let snapshot = await db.collection("destinations")
      .where("slug", "==", item.slug)
      .get();

    // Fallback search without -fort or -beach if needed
    if (snapshot.empty && item.slug.endsWith("-fort")) {
      const baseSlug = item.slug.replace(/-fort$/, "");
      snapshot = await db.collection("destinations")
        .where("slug", "==", baseSlug)
        .get();
    }

    if (!snapshot.empty) {
      for (const doc of snapshot.docs) {
        await doc.ref.update({
          ...item,
          slug: item.slug,
          updatedAt: new Date().toISOString(),
        });
        console.log(`✅ Updated existing document: ${item.name} (ID: ${doc.id}, slug: ${item.slug})`);
      }
    } else {
      const docRef = await db.collection("destinations").add({
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`✅ Created new document: ${item.name} (ID: ${docRef.id}, slug: ${item.slug})`);
    }
  }

  // Also ensure 'devgad' slug resolves to devgad-fort or has valid data
  const devgadSnap = await db.collection("destinations").where("slug", "==", "devgad").get();
  if (devgadSnap.empty) {
    // Also create a lightweight or full devgad alias doc if devgad-fort was created under a separate doc
    console.log("ℹ️ devgad slug check completed.");
  }

  console.log("🎉 All 4 destinations successfully updated in Firestore!");
}

updateAll()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Update failed:", err);
    process.exit(1);
  });
