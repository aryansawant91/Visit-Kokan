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

const newDestinations = [
  {
    name: "Devgad Beach",
    slug: "devgad-beach",
    tagline: "Golden sands, whispering casuarinas, and gentle Arabian Sea sunsets",
    shortDescription: "A serene crescent of soft golden sand in Sindhudurg, offering tranquil coastal walks, sweeping sea views, local fishing boats, and close proximity to Devgad Fort and world-famous Alphonso mango groves.",
    description: "Devgad Beach is an idyllic coastal haven in Sindhudurg where the gentle waves of the Arabian Sea lap against a broad curve of golden sand. Sheltered between rolling laterite headlands, the beach offers a peaceful escape from crowded tourist hubs. Visitors can take peaceful barefoot walks along the tide line, watch traditional wooden fishing trawlers glide across the horizon, and take in glorious Konkan sunsets. Just 3 km from historic Devgad Fort and the active fishing harbour, Devgad Beach is the perfect spot to unwind, sip sweet coconut water, and enjoy fresh Malvani seafood.",
    category: "beach",
    region: "Sindhudurg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9a/Deogad_Beach_in_Sindhudurg_district_%2CKonkan_region_Maharashtra%2C_India.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/5/55/Devgad_Beach_from_a_Hill.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Devgad_beach%2C_Maharashtra.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Deogad_Beach_in_Sindhudurg_district_%2CKonkan_region_Maharashtra%2C_India.JPG",
    highlights: [
      "Broad crescent beach with calm waters and soft golden sand",
      "Spectacular sunset views over the open Arabian Sea horizon",
      "Traditional wooden fishing boats dotting the peaceful shoreline",
      "Within 3 km of Devgad Fort, Lighthouse, and fishing harbour",
      "Surrounded by world-famous Devgad Alphonso mango orchards"
    ],
    bestSeason: "October to March — Pleasant coastal breezes and calm seas ideal for walking. April–May is warm but prime season for fresh Devgad Alphonso mangoes.",
    howToReach: {
      byRoad: "480 km from Mumbai via NH66 (8–9 hrs); 390 km from Pune via Kolhapur-Gaganbawda (7–8 hrs). Good motorable road directly to the beach.",
      byTrain: "Kankavli Railway Station (55 km) or Nandgaon Road (45 km). Regular state buses and private taxis connect to Devgad town in 1 hour.",
      byFerry: "No regular passenger ferry. Road access from Devgad town is the most convenient.",
      tip: "Pair a morning walk on Devgad Beach with an afternoon visit to Devgad Fort and the lighthouse gallery."
    },
    thingsToDo: [
      "Take a relaxing barefoot walk along the firm golden sands at low tide",
      "Capture glowing sunset photos with fishing boats in the silhouette",
      "Explore historic Devgad Fort and its panoramic clifftop lighthouse (3 km away)",
      "Visit the bustling Devgad fishing harbour and sample fresh catch at local shacks",
      "Taste authentic GI-tagged Devgad Alphonso mangoes during harvest season (March–May)"
    ],
    foodToTry: [
      "Surmai or Pomfret Fry — Fresh local catch marinated in fiery Malvani masala and rava-crusted",
      "Malvani Fish Thali — Wholesome plate with spicy fish curry, steamed rice, and solkadhi",
      "Solkadhi — Pink digestive cooler made of fresh coconut milk and wild kokum",
      "Ghavane with Chutney — Soft, lacy steamed rice crepes served hot for breakfast",
      "Devgad Alphonso Mangoes — World-renowned fragrant mangoes available fresh in summer"
    ],
    nearbyPlaces: [
      {
        name: "Devgad Fort",
        distance: "3 km",
        why: "Historic laterite sea fort featuring Maratha cannons, panoramic views, and a lighthouse.",
        slug: "devgad-fort"
      },
      {
        name: "Devgad Harbour",
        distance: "2 km",
        why: "Vibrant fishing harbour showcasing traditional boats and coastal maritime trade.",
        slug: "devgad-harbour"
      },
      {
        name: "Mithmumbari Beach",
        distance: "12 km",
        why: "Secluded pristine beach nestled beside green hills and tranquil village backdrops.",
        slug: "mithmumbari-beach"
      },
      {
        name: "Kunkeshwar Temple & Beach",
        distance: "16 km",
        why: "Ancient seaside Shiva temple with grand coastal architecture dubbed the Kashi of South Konkan.",
        slug: "kunkeshwar-beach"
      },
      {
        name: "Vijaydurg Fort",
        distance: "32 km",
        why: "Imposing sea fort surrounded on three sides by the Arabian Sea, fortified by Shivaji Maharaj.",
        slug: "vijaydurg-fort"
      }
    ],
    stayOptions: "Devgad town offers family-run homestays, MTDC-approved guesthouses, and beachfront lodges within 2 km of the sand. For luxury resort stays, choose beachfront cottages near Kunkeshwar Beach (16 km).",
    entryFee: "Free public access to the beach.",
    timings: "Open 24/7. Daylight hours (6:00 AM to 6:30 PM) recommended for swimming and strolling.",
    bestTimeToVisit: "Early mornings for peaceful walks; late afternoon (4:30 PM to 6:30 PM) for sunset views.",
    warnings: [
      "⚠️ Strong undercurrents: Swimming during high tide or rough monsoon swells is strictly discouraged.",
      "🚫 Do not drive vehicles onto soft beach sand to avoid getting stuck.",
      "💵 Limited card machines: Carry sufficient cash for local refreshments and auto rides."
    ],
    tags: ["beach", "sunset", "sindhudurg", "devgad", "malvani-food", "family", "alphonso-mango", "peaceful"],
    approved: true,
    featured: true,
  },
  {
    name: "Devgad Harbour",
    slug: "devgad-harbour",
    tagline: "The vibrant maritime pulse of Konkan where colorful trawlers meet the morning tide",
    shortDescription: "A bustling working fishing harbour in Devgad, Sindhudurg, offering travelers a vibrant glimpse into maritime coastal traditions, vibrant wooden trawlers, daily fish auctions, and authentic Malvani coastal livelihoods.",
    description: "Devgad Harbour is the beating heart of maritime life in southern Konkan. Positioned in a protected natural bay beneath the promontory of Devgad Fort, this lively port hosts hundreds of colorful wooden fishing trawlers, fiber canoes, and traditional net-menders. Every morning and late afternoon, the harbor springs into action as fishermen unload glistening silver catches of pomfret, kingfish, prawns, and crabs destined for regional markets and home kitchens. For cultural travelers and photographers, Devgad Harbour presents a rare, unfiltered perspective on traditional coastal industry, framed by the backdrop of laterite hills and the deep blue Arabian Sea.",
    category: "harbour",
    region: "Sindhudurg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Canoe_boat_arriving_on_Chivla_beach_in_Malvan.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/a/ad/Leaving_Malvan_jetty_for_Sindhudurg_fort_%285363541711%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/12/Harvesting_fishing_nets.JPG"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Canoe_boat_arriving_on_Chivla_beach_in_Malvan.JPG",
    highlights: [
      "Bustling natural harbour with hundreds of traditional wooden fishing trawlers",
      "Authentic morning fish auction showcasing the freshest coastal catch",
      "Vibrant photography of boats, docks, nets, and coastal seafaring life",
      "Directly overlooked by the towering ramparts of Devgad Fort",
      "Gateway to the finest fresh seafood delicacies in Devgad town"
    ],
    bestSeason: "October to March — Peak fishing season with bustling harbour activity and comfortable morning weather. Commercial sea fishing is restricted during monsoon (June–August) for breeding.",
    howToReach: {
      byRoad: "Located right below Devgad town, easily reached by auto-rickshaw or personal vehicle (1.5 km from town center).",
      byTrain: "Kankavli Railway Station (56 km), connected by regular state transport buses and private cabs.",
      byFerry: "No commercial passenger ferry. Local boat crossings operate for fishermen.",
      tip: "Visit between 7:00 AM and 9:00 AM to witness the arrival of fishing trawlers and the lively dockside catch auctions."
    },
    thingsToDo: [
      "Watch fishermen skillfully dock trawlers and unload the morning catch of fresh seafood",
      "Capture colorful documentary photography of fishing nets, painted boats, and seafaring crews",
      "Explore the morning wholesale seafood market to see rare coastal fish and crabs",
      "Walk up the scenic winding road to Devgad Fort for an aerial view of the harbour bay",
      "Enjoy fresh seafood dishes prepared at family restaurants in Devgad town"
    ],
    foodToTry: [
      "Prawns Masala — Fresh harbor prawns simmered in aromatic roasted coconut gravy",
      "Tawa Fried Pomfret — Whole fresh pomfret coated with spicy coastal masala and lemon",
      "Bombil (Bombay Duck) Fry — Crispy semolina-coated fish fillets served piping hot",
      "Solkadhi — Authentic digestive drink made of pressed kokum and freshly grated coconut",
      "Ghavane — Traditional soft rice crepes paired with coconut chutney"
    ],
    nearbyPlaces: [
      {
        name: "Devgad Beach",
        distance: "2 km",
        why: "Calm golden-sand beach perfect for relaxing walks after observing the busy docks.",
        slug: "devgad-beach"
      },
      {
        name: "Devgad Fort",
        distance: "1.5 km",
        why: "Historic coastal fort overlooking the harbour with cannons and a maritime lighthouse.",
        slug: "devgad-fort"
      },
      {
        name: "Mithmumbari Beach",
        distance: "11 km",
        why: "Tranquil coastal hideaway with lush green surroundings and gentle waves.",
        slug: "mithmumbari-beach"
      },
      {
        name: "Kunkeshwar Temple & Beach",
        distance: "15 km",
        why: "Grand 11th-century coastal Shiva temple built right beside the Arabian Sea.",
        slug: "kunkeshwar-beach"
      },
      {
        name: "Vijaydurg Fort",
        distance: "30 km",
        why: "Legendary Maratha sea citadel surrounded on three sides by ocean waves.",
        slug: "vijaydurg-fort"
      }
    ],
    stayOptions: "Stay in Devgad town (1 km away) where homestays, lodges, and guesthouses offer convenient access. Beachfront resort accommodations are available 15 km away in Kunkeshwar.",
    entryFee: "Free public access to harbour viewing points.",
    timings: "Open 24/7. Best visited between 6:30 AM and 10:00 AM or 4:00 PM and 6:00 PM for fishing activity.",
    bestTimeToVisit: "Morning hours (7:00 AM to 9:30 AM) for morning catch auctions and boat movement.",
    warnings: [
      "⚠️ Working port: Watch your footing on wet, slippery dock edges and keep clear of moving cranes and nets.",
      "🚫 Do not board private fishing vessels without explicit permission from captains.",
      "👟 Wear slip-resistant footwear with good traction."
    ],
    tags: ["harbour", "fishing", "culture", "maritime", "seafood", "photography", "sindhudurg", "devgad"],
    approved: true,
    featured: true,
  },
  {
    name: "Vijaydurg Fort",
    slug: "vijaydurg-fort",
    tagline: "The invincible 'Eastern Gibraltar' of the Maratha naval empire",
    shortDescription: "A legendary sea fortress in Sindhudurg, Maharashtra, encircled on three sides by the Arabian Sea and Vaghotan Creek. Famous for its triple-layered defensive walls, 29 bastions, underwater defensive walls, and deep Maratha maritime history.",
    description: "Vijaydurg Fort is widely considered one of the most formidable coastal sea forts in Indian military history. Situated on a rocky peninsula in Sindhudurg where the Arabian Sea meets Vaghotan Creek, Vijaydurg was originally constructed during the Shilahara dynasty and later extensively fortified by Chhatrapati Shivaji Maharaj in 1653 into the primary naval stronghold of the Maratha Navy under Admiral Kanhoji Angre. Enclosed by triple-layered laterite ramparts and 29 towering bastions, the fort also featured a subterranean tunnel and an ingenious submerged masonry wall that sabotaged approaching enemy warships. Today, visitors can walk the massive sea-facing ramparts, inspect historic cannons, and take in panoramic ocean horizons where British, Portuguese, and Maratha naval fleets once clashed.",
    category: "fort",
    region: "Sindhudurg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Vijaydurg_Fort.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/d8/Vijaydurg_fort_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Vijaydurg_Fort_20.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Vijaydurg_Fort.jpg",
    highlights: [
      "Triple-layered laterite defensive walls & 29 massive bastions surrounded by sea",
      "Primary naval base of Kanhoji Angre, famous as the 'Eastern Gibraltar'",
      "Ingenious 200m submerged underwater wall built to wreck hostile warships",
      "Historic Khalbatkhana (secret council chamber), cannons & Sadar courthouse",
      "Panoramic 300° vistas of the Arabian Sea and Vaghotan Creek estuary"
    ],
    bestSeason: "October to March — Pleasant cool weather ideal for exploring the extensive 17-acre fort grounds. Monsoon brings dramatic crashing waves against the sea walls.",
    howToReach: {
      byRoad: "460 km from Mumbai via NH66 (8–9 hrs); 375 km from Pune via Kolhapur-Gaganbawda (7 hrs); 32 km from Devgad town.",
      byTrain: "Kankavli Railway Station (70 km) or Rajapur Road (55 km). Regular state buses and private taxis connect directly to Vijaydurg jetty.",
      byFerry: "No regular passenger ferry. Approachable via road from Devgad or Rajapur.",
      tip: "Hire an authorized local guide at the entrance gate to fully appreciate the military engineering and naval history."
    },
    thingsToDo: [
      "Walk along the outer sea-facing ramparts and admire the engineering of the triple walls",
      "Inspect ancient iron and bronze cannons mounted on the bastions pointing out to sea",
      "Explore the Khalbatkhana (secret strategy room) and the ancient water storage cisterns",
      "Observe Vaghotan Creek where ancient Maratha war galleys were safely docked",
      "Savor authentic Malvani seafood at local village eateries near the fort entrance"
    ],
    foodToTry: [
      "Vijaydurg Fish Thali — Fresh local catch curry served with rice, solkadhi, and fried fish",
      "Malvani Surmai Fry — Kingfish fillet marinated with red chili, turmeric, and garlic",
      "Solkadhi — A soothing pink digestive cooler made from wild kokum and fresh coconut milk",
      "Prawns Sukka — Dry spicy coastal prawns tossed with fresh coconut and coriander",
      "Ukdiche Modak — Steamed fragrant dumplings filled with sweet jaggery and grated coconut"
    ],
    nearbyPlaces: [
      {
        name: "Devgad Fort",
        distance: "32 km",
        why: "Laterite fort overlooking Devgad harbour with an active lighthouse.",
        slug: "devgad-fort"
      },
      {
        name: "Devgad Beach",
        distance: "30 km",
        why: "Scenic crescent beach known for golden sunsets and Alphonso orchards.",
        slug: "devgad-beach"
      },
      {
        name: "Devgad Harbour",
        distance: "30 km",
        why: "Bustling fishing harbour with colorful trawlers and fresh catch auctions.",
        slug: "devgad-harbour"
      },
      {
        name: "Kunkeshwar Temple",
        distance: "42 km",
        why: "Ancient coastal Shiva temple on the shoreline known as Kashi of South Konkan.",
        slug: "kunkeshwar-beach"
      },
      {
        name: "Mithmumbari Beach",
        distance: "36 km",
        why: "Quiet, unspoiled beach with lush green hills and pristine sands.",
        slug: "mithmumbari-beach"
      }
    ],
    stayOptions: "Local family homestays and heritage lodges operate in Vijaydurg village near the fort gate. For hotels with wider amenities and mango agro-resorts, stay in Devgad town (30 km).",
    entryFee: "Free entry to Vijaydurg Fort.",
    timings: "Open daily from 8:00 AM to 6:00 PM.",
    bestTimeToVisit: "Morning hours (8 AM to 11 AM) or late afternoon (3:30 PM to 6 PM) for comfortable exploration of the ramparts.",
    warnings: [
      "👟 Extensive walking: The fort complex spans 17 acres with uneven steps; wear comfortable walking shoes.",
      "☀️ Sun protection: Large sections are open to the sun; carry drinking water, sunglasses, and a hat.",
      "⚠️ Sheer bastion drops: Keep children close and avoid sitting on outer wall parapets."
    ],
    tags: ["fort", "sea-fort", "heritage", "maratha-history", "sindhudurg", "vijaydurg", "architecture", "history"],
    approved: true,
    featured: true,
  },
  {
    name: "Mithmumbari Beach",
    slug: "mithmumbari-beach",
    tagline: "Where lush emerald hills gently touch the silent tides of Konkan",
    shortDescription: "A secluded coastal paradise in Devgad, Sindhudurg, known for its pristine golden shoreline, verdant green hills, tranquil village atmosphere, and calm Arabian Sea waters far away from commercial crowds.",
    description: "Mithmumbari Beach is one of Sindhudurg's best-kept secrets, tucked away in Devgad taluka between rolling emerald hills and the azure Arabian Sea. Free from commercial stalls and noisy crowds, the beach features a clean, wide expanse of soft sand fringed by dense coconut wadis and casuarina groves. The tranquil waters make it a wonderful spot for morning meditation, beachcombing, and watching white seabirds gather along the shoreline. Located halfway between Devgad and Kunkeshwar, Mithmumbari provides a soothing retreat for travelers seeking raw nature and authentic Konkani tranquility.",
    category: "beach",
    region: "Sindhudurg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/Kunkeshwar_Beach.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/92/Kunkeshwar_seashore_kokan.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Early_Moorning_on_Kunkeshwar_Beach.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Kunkeshwar_Beach.jpg",
    highlights: [
      "Untouched, peaceful crescent beach with pristine sands and clear waters",
      "Lush backdrop of verdant Konkan hills and swaying coconut groves",
      "Minimal crowds offering an authentic escape into coastal solitude",
      "Gentle morning sea breezes and stunning golden sunset vistas",
      "Ideally situated along the scenic coastal drive between Devgad and Kunkeshwar"
    ],
    bestSeason: "October to March — Mild sunny days and cool evening breezes. Monsoon (June–Sept) turns the surrounding hills an intense emerald green.",
    howToReach: {
      byRoad: "12 km south of Devgad town via scenic coastal village roads; 14 km north of Kunkeshwar Temple.",
      byTrain: "Kankavli Railway Station (58 km). Hired auto-rickshaws or taxis connect via Devgad.",
      byFerry: "No passenger ferry service. Accessible via coastal roads from Devgad or Kunkeshwar.",
      tip: "Take the scenic rural coastal road connecting Devgad, Mithmumbari, and Kunkeshwar for stunning panoramic sea views."
    },
    thingsToDo: [
      "Enjoy a quiet, unhurried walk along the soft sandy shoreline",
      "Watch sunsets over the Arabian Sea in peaceful, uncrowded serenity",
      "Photograph the contrast of emerald green hill slopes meeting the turquoise ocean",
      "Relax under the natural shade of casuarina and coconut palms",
      "Combine with morning temple visits to Kunkeshwar and an afternoon at Devgad Fort"
    ],
    foodToTry: [
      "Authentic Malvani Fish Curry — Traditional homestyle curry prepared with freshly ground coastal spices",
      "Crispy Surmai Fry — Local kingfish seasoned with kokum and red chili paste",
      "Fresh Tender Coconut Water — Sweet and hydrating, plucked straight from village wadis",
      "Solkadhi — Pink digestive cooler pressed from wild kokum petals and coconut milk",
      "Ghavane with Coconut Chutney — Lacy rice crepes served warm with fresh chutney"
    ],
    nearbyPlaces: [
      {
        name: "Devgad Beach",
        distance: "12 km",
        why: "Popular town beach with golden sand and mango orchards.",
        slug: "devgad-beach"
      },
      {
        name: "Devgad Fort",
        distance: "13 km",
        why: "Historic laterite sea fort with old cannons and panoramic coastal views.",
        slug: "devgad-fort"
      },
      {
        name: "Devgad Harbour",
        distance: "11 km",
        why: "Vibrant fishing harbour with colorful trawlers and morning markets.",
        slug: "devgad-harbour"
      },
      {
        name: "Kunkeshwar Temple & Beach",
        distance: "8 km",
        why: "Sacred seaside temple dedicated to Lord Shiva with breathtaking architecture.",
        slug: "kunkeshwar-beach"
      },
      {
        name: "Vijaydurg Fort",
        distance: "38 km",
        why: "Invincible 17-acre Maratha naval sea fortress surrounded by waves.",
        slug: "vijaydurg-fort"
      }
    ],
    stayOptions: "Intimate village homestays and rural agro-tourism farms operate in Mithmumbari village. For beach resorts with dining, stay in Kunkeshwar (8 km) or Devgad town (12 km).",
    entryFee: "Free public access to the beach.",
    timings: "Accessible 24/7. Daylight hours recommended (6:00 AM to 6:30 PM).",
    bestTimeToVisit: "Early morning for peaceful walks; late afternoon (4:30 PM to 6:30 PM) for tranquil sunsets.",
    warnings: [
      "⚠️ Strong undertows: Swimming alone or venturing deep into the sea is not advised.",
      "🏪 Limited commercial shops: Carry drinking water and light snacks.",
      "🚗 Narrow village roads: Drive carefully on coastal curves and respect village residents."
    ],
    tags: ["beach", "peaceful", "nature", "sindhudurg", "devgad", "sunset", "photography", "hidden-gem"],
    approved: true,
    featured: true,
  }
];

async function updateAll() {
  console.log("🚀 Seeding & Updating Devgad Beach, Devgad Harbour, Vijaydurg Fort, and Mithmumbari Beach in Firestore...");

  // 1. Update Devgad Fort nearbyPlaces with accurate slugs
  const devgadFortSnap = await db.collection("destinations").where("slug", "==", "devgad-fort").get();
  if (!devgadFortSnap.empty) {
    for (const doc of devgadFortSnap.docs) {
      await doc.ref.update({
        nearbyPlaces: [
          {
            name: "Devgad Beach",
            distance: "3 km",
            why: "Clean, scenic sandy shoreline ideal for relaxing walks after touring the fort.",
            slug: "devgad-beach"
          },
          {
            name: "Devgad Harbour",
            distance: "1 km",
            why: "Bustling coastal fishing harbour showcasing local maritime and fishermen life.",
            slug: "devgad-harbour"
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
            slug: "vijaydurg-fort"
          },
          {
            name: "Mithmumbari Beach",
            distance: "12 km",
            why: "Peaceful coastal village beach framed by emerald hills and calm waters.",
            slug: "mithmumbari-beach"
          }
        ],
        updatedAt: new Date().toISOString(),
      });
      console.log("✅ Updated devgad-fort nearbyPlaces with exact distinct slugs!");
    }
  }

  // 2. Upsert each of the 4 destinations
  for (const item of newDestinations) {
    let snapshot = await db.collection("destinations").where("slug", "==", item.slug).get();

    // If vijaydurg-fort, also check 'vijaydurg'
    if (snapshot.empty && item.slug === "vijaydurg-fort") {
      snapshot = await db.collection("destinations").where("slug", "==", "vijaydurg").get();
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

  // Also make sure 'vijaydurg' slug document exists or points cleanly
  const vijaydurgSnap = await db.collection("destinations").where("slug", "==", "vijaydurg").get();
  if (vijaydurgSnap.empty) {
    const vFortSnap = await db.collection("destinations").where("slug", "==", "vijaydurg-fort").get();
    if (!vFortSnap.empty) {
      console.log("ℹ️ vijaydurg-fort is available in Firestore");
    }
  }

  console.log("🎉 All 4 destinations successfully created & updated in Firestore!");
}

updateAll()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Update failed:", err);
    process.exit(1);
  });
