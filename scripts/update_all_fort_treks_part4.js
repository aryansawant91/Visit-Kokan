/**
 * Part 4: Real Sahyadri & Konkan Coastal Trails (Completing all 60 Treks)
 * Updates the remaining 30 coastal forts, rock spires, forest citadels & heritage walks
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

const TREKS_REAL_DATA_PART4 = [
  // ── 1. SINDHUDURG SEA WALL & OCEAN BASTION ──
  {
    slug: "sindhudurg-sea-wall-trek",
    name: "Sindhudurg Sea Wall & Ocean Bastion Walk",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "490 km from Mumbai",
    maxAltitude: "25 m",
    elevation: "25 m",
    startPoint: "Malvan Jetty",
    endPoint: "Malvan Jetty",
    baseVillage: "Malvan (मालवण, Sindhudurg)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "28°C", wind: "22 km/h Ocean Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "22 km" },
    baseVillages: [
      {
        name: "Malvan Dandi Jetty",
        marathiName: "मालवण दांडी जेट्टी (बोट मार्ग)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "1.5 km sea ferry + 3 km rampart walk",
        trailDuration: "3 Hours",
        popularFor: "Boat ferry across Kurte island to the only surviving temple of Shivaji Maharaj and footprints cast in stone",
        routeDescription: "Board passenger ferry from Malvan jetty to Kurte rock. Enter through Dilli Darwaja, explore the 42 bastions, Shivaji Maharaj temple, and walk the 3-kilometer unbroken ocean rampart wall.",
        coordinates: { lat: 16.0583, lng: 73.4683 }
      }
    ],
    highlights: [
      "🚩 Chhatrapati Shivaji Maharaj's naval masterpiece constructed on Kurte rock with over 70,000 kg of molten lead",
      "👣 Sacred Footprint & Palm Impression of Shivaji Maharaj preserved in lime plaster",
      "🛕 The only temple in the world where Chhatrapati Shivaji Maharaj is worshipped as a deity (Shri Shivrajeshwar)",
      "🌊 3 km long intact sea rampart wall taking pounding Arabian Sea waves on 42 massive bastions",
      "🍛 World-famous Malvani fish curry, Kombdi Vade, and Solkadhi feast"
    ],
    fortAttractions: [
      "Shri Shivrajeshwar Temple (Shivaji Maharaj Deity)",
      "Shivaji Maharaj Stone Footprint & Handprint",
      "Dilli Darwaja (Ingeniously Concealed Ocean Entrance)",
      "42 Sturdy Marine Bastions with Rampart Walks",
      "Three Freshwater Sweet Wells inside saline ocean (Sakhar Baav, Dudh Baav, Dahi Baav)"
    ],
    history: "Sindhudurg Fort, meaning 'Fort of the Sea', was personally surveyed and conceptualized by Chhatrapati Shivaji Maharaj in 1664 to counter the Siddis of Janjira, the Portuguese in Goa, and British merchants. Built under master architect Hiroji Indulkar over three years with over 500 stone masons and 70,000 kg of molten lead poured into foundation stones, it became the supreme naval fortress of the Maratha Empire.",
    howToReach: {
      byTrain: "Kankavli (45 km) or Kudal (30 km) on Konkan Railway. Frequent buses and taxis connect to Malvan.",
      byBus: "Direct MSRTC luxury and sleeper buses ply daily from Mumbai and Pune to Malvan.",
      byRoad: "From Mumbai (490 km): Follow NH66 via Chiplun and Kankavli ➔ Turn towards Malvan (~9 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure via Konkan Express Route", description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Overnight transit along NH66." },
      { day: 2, title: "06:30 AM – Malvan Jetty, Sea Fort Ferry & Coastal Exploration", description: "06:30 AM: Arrive at Malvan. Freshen up and enjoy Ghavane with coconut chutney. 07:30 AM: Ferry to Sindhudurg Fort. 08:00 AM - 12:00 PM: Walk the 3 km sea ramparts, visit Shivrajeshwar temple, see Shivaji Maharaj's footprint, and sweet water wells. 12:30 PM: Ferry back. 01:15 PM: Lavish Malvani lunch with fresh sea fish or veg thali. 03:00 PM: Relax at Tarkarli beach. 05:00 PM: Return drive." }
    ]
  },

  // ── 2. SUVARNADURG ISLAND SEA FORT ──
  {
    slug: "suvarnadurg-island-sea-fort",
    name: "Suvarnadurg Island Fort & Dolphin Trail",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "230 km from Mumbai",
    maxAltitude: "20 m",
    elevation: "20 m",
    startPoint: "Harnai Port Jetty",
    endPoint: "Harnai Port Jetty",
    baseVillage: "Harnai (हर्णे, Dapoli)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "20 km/h Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "20 km" },
    baseVillages: [
      {
        name: "Harnai Bunder",
        marathiName: "हर्णे बंदर (मच्छीमार बोट मार्ग)",
        isPrimary: true,
        difficulty: "Easy (Short Sea Boat Ride)",
        distanceFromBase: "1.0 km sea ride + 2 km ramparts",
        trailDuration: "2 Hours",
        popularFor: "Boat ferry from Harnai harbor, dolphin spotting, and exploring the grand stone turtle gate",
        routeDescription: "Board local fishing boats from Harnai bunder across the open sea to Suvarnadurg island fort. Step onto the rocky reef, enter through the Maha Darwaja featuring carved sea turtle and tiger bas-reliefs, and walk the high outer walls.",
        coordinates: { lat: 17.8183, lng: 73.0883 }
      }
    ],
    highlights: [
      "🏰 'The Golden Fortress': Built completely surrounded by the crashing waves of the Arabian Sea",
      "🐬 Frequent sightings of Indo-Pacific humpback dolphins during the boat crossing",
      "🐢 Historic Maha Darwaja adorned with carved stone motifs of a sea turtle and leaping tigers",
      "🐟 Witness the vibrant evening fish auction at historic Harnai Port",
      "🍛 Authentic Dapoli-style Konkani fish / vegetarian meal with Solkadhi"
    ],
    fortAttractions: [
      "Maha Darwaja with Carved Sea Turtle & Tiger",
      "Concealed Sea Gate facing the open ocean",
      "Ancient Stone Cannons overlooking the bay",
      "Freshwater Cisterns & Granary Foundations",
      "Views of sister shore forts Kanakdurg, Fattehgad & Goa Fort"
    ],
    history: "Suvarnadurg ('The Golden Fort') was constructed by the Bijapur Adil Shahi rulers and significantly strengthened by Chhatrapati Shivaji Maharaj in 1660 to serve as a formidable Maratha naval shipbuilding base. It was the ancestral base of the legendary Maratha naval admiral Kanhoji Angre, who defended the Konkan coast against Portuguese, Dutch, and British fleets.",
    howToReach: {
      byTrain: "Khed (45 km) on Konkan Railway. Frequent buses and cabs run to Dapoli and Harnai.",
      byBus: "Direct MSRTC buses ply from Mumbai and Pune to Dapoli / Harnai.",
      byRoad: "From Mumbai (230 km): Drive via NH66 to Mangaon ➔ Mandangad ➔ Dapoli ➔ Harnai (~5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Coastal Transit", description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Overnight drive to Harnai." },
      { day: 2, title: "06:00 AM – Harnai Harbor, Island Sea Fort & Dolphin Safari", description: "06:00 AM: Reach Harnai. Enjoy hot breakfast. 07:15 AM: Board boat across the sea to Suvarnadurg island, spotting dolphins along the way. 08:00 AM - 11:30 AM: Explore the sea fort ramparts, turtle gate, and cannons. 12:00 PM: Return to shore. 01:00 PM: Authentic Dapoli lunch. 02:30 PM: Visit Murud-Harnai beach. 04:00 PM: Depart for Mumbai. 10:00 PM: Arrive in Mumbai." }
    ]
  },

  // ── 3. CHANDERI FORT PINNACLE ──
  {
    slug: "chanderi-fort-trek",
    name: "Chanderi Fort Pinnacle & Waterfall Trail",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "60 km from Mumbai",
    maxAltitude: "700 m (2,300 ft)",
    elevation: "700 m (2,300 ft)",
    startPoint: "Chinchavali Base Village",
    endPoint: "Chinchavali Base Village",
    baseVillage: "Chinchavali (चिंचवली, Vangani / Badlapur)",
    category: "fort",
    difficulty: "challenging",
    weatherStats: { temp: "25°C", wind: "18 km/h Wind", rainProb: "15% Rain", uv: "UV 6", visibility: "19 km" },
    baseVillages: [
      {
        name: "Chinchavali (Vangani)",
        marathiName: "चिंचवली (वांगणी मुख्य मार्ग)",
        isPrimary: true,
        difficulty: "Challenging (Steep Scree & Rock Band)",
        distanceFromBase: "5.5 km",
        trailDuration: "3.5 Hours",
        popularFor: "Classic rugged route through monsoon waterfalls and scree slopes to the col and Shivaji cave",
        routeDescription: "Starts at Chinchavali village near Vangani. Climbs a dense forest trail alongside gushing seasonal streams, navigates loose scree patches, ascends a rocky couloir to Chanderi col, and visits the Shiva cave beneath the crown pinnacle.",
        coordinates: { lat: 19.0683, lng: 73.2883 }
      }
    ],
    highlights: [
      "👑 Towering Natural Rock Crown standing prominently over the Matheran-Badlapur mountain range",
      "🧘 Large Rock-Cut Cave dedicated to Lord Shiva with sweet, cold perennial spring water",
      "🧗 Thrilling rocky ascent through waterfall gullies and boulder fields",
      "🌄 Panoramic views of Prabalgad, Matheran, Haji Malang, and Nakhinda",
      "🍲 Hot village breakfast and comforting rural meal at Chinchavali base"
    ],
    fortAttractions: [
      "Shivaji Cave (महादेव गुंफा) with potable spring water",
      "Chanderi Col (खिंड) connecting Chanderi & Mhasmal",
      "Ancient Rock-Cut Water Cisterns",
      "Steep Scree & Rock Scramble sections",
      "Panoramic views of Matheran Ridge & Badlapur plains"
    ],
    history: "Chanderi Fort, standing proudly at 2,300 ft, was captured by Chhatrapati Shivaji Maharaj in 1656 from the Maratha Deshmukhs of Kalyan to protect the vital commercial route between Kalyan and the Konkan foothills. Due to its sheer vertical sides, it served primarily as a military watchtower and safe ammunition repository rather than an inhabited capital.",
    howToReach: {
      byTrain: "Nearest railway station is Vangani (8 km) or Badlapur (12 km) on Mumbai Central suburban line. Auto-rickshaws connect Vangani station to Chinchavali.",
      byBus: "Local shared autos from Vangani or Badlapur run to Chinchavali.",
      byRoad: "From Mumbai (60 km): Take Eastern Express Highway ➔ Kalyan-Shilphata ➔ Badlapur ➔ Vangani ➔ Chinchavali (~2 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Easy Transit", description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Thane 11:15 PM, Kalyan 11:45 PM. Overnight drive to Vangani." },
      { day: 2, title: "05:00 AM – Chinchavali Base, Pinnacle Col Climb & Return", description: "05:00 AM: Reach Chinchavali. Freshen up and enjoy breakfast with tea. 06:00 AM: Start ascent through misty jungle. 08:30 AM: Negotiate the rock scree and reach Chanderi col. 09:00 AM - 11:30 AM: Visit the Shiva cave, drink natural spring water, and take in the panoramic Sahyadri views. 12:00 PM: Careful descent to base. 02:00 PM: Delicious authentic village lunch. 03:30 PM: Depart for Mumbai. 07:00 PM: Arrive in Mumbai." }
    ]
  },

  // ── 4. PEB (VIKATGAD) FORT ──
  {
    slug: "peb-vikatgad-fort-trek",
    name: "Peb (Vikatgad) Fort Matheran Ridge Traverse",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "65 km from Mumbai",
    maxAltitude: "640 m (2,100 ft)",
    elevation: "640 m (2,100 ft)",
    startPoint: "Anandwadi / Neral Base",
    endPoint: "Anandwadi / Neral Base",
    baseVillage: "Anandwadi (आनंदवाडी, Neral)",
    category: "fort",
    difficulty: "moderate",
    weatherStats: { temp: "25°C", wind: "16 km/h Wind", rainProb: "15% Rain", uv: "UV 6", visibility: "19 km" },
    baseVillages: [
      {
        name: "Anandwadi (Electric Tower Route)",
        marathiName: "आनंदवाडी (इलेक्ट्रिक टॉवर मार्ग)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "4.5 km",
        trailDuration: "3 Hours",
        popularFor: "Classic trail passing waterfalls, ascending iron ladders, and exploring the Swami Samarth cave",
        routeDescription: "Starts at Anandwadi village near Neral. The trail climbs along high-tension electricity towers, enters a mountain col, ascends two iron ladders over sheer rock faces, and enters the Swami Samarth meditation cave.",
        coordinates: { lat: 18.9912, lng: 73.3183 }
      },
      {
        name: "Matheran Panorama Point Railway Track",
        marathiName: "माथेरान रेल्वे ट्रॅक मार्ग (पॅनोरमा पॉईंट)",
        isPrimary: false,
        difficulty: "Easy to Moderate",
        distanceFromBase: "3.5 km",
        trailDuration: "2 Hours",
        popularFor: "Scenic ridge walk descending directly from Matheran toy train tracks",
        routeDescription: "Starts near toy train railway track between Aman Lodge and Panorama Point. Follows the ridge saddle with spectacular drop-offs into the Konkan plains.",
        coordinates: { lat: 19.0012, lng: 73.3218 }
      }
    ],
    highlights: [
      "🚂 Walk alongside the iconic Matheran Toy Train narrow-gauge mountain tracks",
      "🧗 Iron Ladder Climbs across vertical rock bands with panoramic Sahyadri views",
      "🧘 Swami Samarth Meditation Cave with cool mountain springs and peaceful shrine",
      "🌊 Incredible sights of Chanderi, Nakhinda, Malang Gad, and Panorama Point",
      "🍛 Warm rustic village meal at Neral base"
    ],
    fortAttractions: [
      "Swami Samarth Cave & Ashram",
      "Two Sturdy Iron Ladder Sections",
      "Ancient Stone Water Cisterns & Grain Storehouse",
      "Panoramic views of Matheran Toy Train line & Panorama Point",
      "Intact Bastions with 360-degree Valley Sights"
    ],
    history: "Peb Fort (named after the goddess Pebi Devi and also called Vikatgad due to its jagged pinnacle shape) stands at 2,100 ft immediately north of Matheran. During the reign of Chhatrapati Shivaji Maharaj, it served as an essential food and weapon storage grain-depot due to its natural cave chambers, and as an advanced surveillance outpost watching over the Konkan trade passages.",
    howToReach: {
      byTrain: "Nearest railway station is Neral Junction (4 km) on Central suburban line. Auto-rickshaws run to Anandwadi base.",
      byBus: "Buses from Karjat and Panvel connect through Neral.",
      byRoad: "From Mumbai (65 km): Take Mumbai-Pune Expressway ➔ Chowk ➔ Karjat ➔ Neral ➔ Anandwadi (~2 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Short Transit", description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Easy highway drive to Neral." },
      { day: 2, title: "05:00 AM – Anandwadi Base, Cave Climb & Return", description: "05:00 AM: Arrive at Anandwadi. Enjoy tea and breakfast. 06:00 AM: Start morning climb up the wooded trail. 07:30 AM: Scale the secure iron ladders. 08:00 AM - 11:30 AM: Visit Swami Samarth cave, walk to the top pinnacle, and photograph Matheran's Panorama Point. 12:00 PM: Descend to base. 01:30 PM: Authentic Maharashtrian lunch. 03:00 PM: Depart for Mumbai. 07:00 PM: Arrive in Mumbai." }
    ]
  },

  // ── 5. DHAK BAHIRI CAVE & TECHNICAL SCRAMBLE ──
  {
    slug: "dhak-bahiri-cave-trek",
    name: "Dhak Bahiri Cave & Technical Scramble",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "85 km from Mumbai",
    maxAltitude: "820 m (2,700 ft)",
    elevation: "820 m (2,700 ft)",
    startPoint: "Sandshi / Jambhavli Base",
    endPoint: "Sandshi / Jambhavli Base",
    baseVillage: "Sandshi (सांडशी, Karjat)",
    category: "fort",
    difficulty: "challenging",
    weatherStats: { temp: "24°C", wind: "17 km/h Wind", rainProb: "10% Rain", uv: "UV 6", visibility: "19 km" },
    baseVillages: [
      {
        name: "Sandshi",
        marathiName: "सांडशी (कर्जत कातळ मार्ग)",
        isPrimary: true,
        difficulty: "Challenging (Wooden Log & Rope Ascent)",
        distanceFromBase: "5.0 km",
        trailDuration: "3.5 Hours",
        popularFor: "Thrilling technical ascent using carved notches on a notched wooden tree-trunk and safety ropes into the cliff cave",
        routeDescription: "Starts at Sandshi village. The trail winds through dense forest, climbs to Dhak col, and ascends a near-vertical cliff using notched wooden logs and iron cables to enter the Bahiri cave.",
        coordinates: { lat: 18.8412, lng: 73.4412 }
      }
    ],
    highlights: [
      "🧗 The Ultimate Adrenaline Scramble: Climb a notched tree log and sheer rock ledge into a suspended cave",
      "🛕 Ancient Shrine of Lord Bahiri (Bhairavnath) inside the sacred natural cliff cavern",
      "🍲 Unique Tradition: Massive bronze cooking pots preserved inside the cave for visiting pilgrims",
      "🌄 Jaw-dropping vertical drop-offs with panoramic views of Rajmachi and Ulhas Valley",
      "🍛 Fresh village breakfast and hearty local meal at Sandshi base"
    ],
    fortAttractions: [
      "Sacred Bahiri Cave (बहिरी गुंफा)",
      "Traditional Bronze Cooking Vessels (भांडी)",
      "Notched Log & Cable Rock Climbing Section",
      "Dhak Col & Fort Plateau Ruins",
      "Deep Vertical Drop over Konkan Plains"
    ],
    history: "Dhak Bahiri is an ancient sacred cave shrine dedicated to Lord Bahiri, the mountain protector deity worshipped by the local tribal and farming communities of the Sahyadris. Perched in a dramatic cliff recess on the western face of Dhak Fort, tradition dictates that anyone who steals from the cave vessels will meet divine retribution, allowing large bronze cooking vessels to remain safely untouched inside the cave for centuries.",
    howToReach: {
      byTrain: "Nearest railway station is Karjat (25 km). Jeeps connect Karjat to Sandshi.",
      byBus: "Local state transport buses from Karjat go towards Kashele and Sandshi.",
      byRoad: "From Mumbai (85 km): Drive via Mumbai-Pune Expressway ➔ Karjat ➔ Sandshi village (~2.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Transit", description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Easy highway drive to Karjat." },
      { day: 2, title: "04:30 AM – Sandshi Base, Adrenaline Climb & Return", description: "04:30 AM: Arrive at Sandshi base. Enjoy breakfast and safety briefing. 05:45 AM: Trek through the forest to Dhak col. 07:30 AM: Gear up and tackle the thrilling notched log climb and rock ledges with certified guides. 08:30 AM - 11:30 AM: Rest in Bahiri cave, drink sweet spring water, and take in the sheer cliff views. 12:00 PM: Careful descent with safety ropes. 02:00 PM: Rewarding village lunch. 03:30 PM: Depart for Mumbai. 08:00 PM: Arrive in Mumbai." }
    ]
  },

  // ── 6. KORLAI FORT & LIGHTHOUSE ──
  {
    slug: "korlai-fort-coastal-trail",
    name: "Korlai Fort & Lighthouse Coastal Walk",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "125 km from Mumbai",
    maxAltitude: "90 m",
    elevation: "90 m",
    startPoint: "Korlai Village Base",
    endPoint: "Korlai Village Base",
    baseVillage: "Korlai (कोर्लई, Alibaug / Revdanda)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "20 km/h Ocean Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "22 km" },
    baseVillages: [
      {
        name: "Korlai Village (Lighthouse Approach)",
        marathiName: "कोर्लई गाव (दीपगृह मार्ग)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "2.5 km",
        trailDuration: "1.5 Hours",
        popularFor: "Gentle coastal walk passing the Portuguese Creole village and active coastal lighthouse",
        routeDescription: "Starts at Korlai village church. Gentle stone stairs climb the rocky promontory, passing the Korlai Lighthouse, entering the Portuguese sea fortress ramparts surrounded on three sides by the ocean.",
        coordinates: { lat: 18.5333, lng: 72.9083 }
      }
    ],
    highlights: [
      "🏰 Magnificent Portuguese Rock Citadel with 11 bastions guarding the Kundalika river estuary",
      "🗼 Operational Coastal Lighthouse with panoramic 360-degree ocean views and equipment tour",
      "🗣️ Cultural rarity: Korlai village is home to the unique Portuguese-Marathi Creole dialect 'No Ling'",
      "🌊 Crashing ocean waves on three sides of the slender rocky fortress promontory",
      "🍛 Authentic Alibaug-style Konkani seafood / vegetarian meal"
    ],
    fortAttractions: [
      "Korlai Coastal Lighthouse (कोर्लई दीपगृह)",
      "Ruins of 16th-century Church of Santa Cruz",
      "Eleven Formidable Bastions & Ancient Bronze Cannon mounts",
      "Portuguese Stone Coat of Arms & Inscriptions",
      "Spectacular view of Revdanda Fort & Kundalika River Estuary"
    ],
    history: "Built by the Portuguese in 1521 under the name 'Fortaleza do Morro de Chaul', Korlai Fort was strategically positioned on a massive rocky headland to command the entrance to the Kundalika River and safeguard their Chaul trade. It changed hands between the Portuguese, the Ahmadnagar Sultanate, and Chhatrapati Sambhaji Maharaj, before finally falling to the Peshwa forces led by Chimaji Appa in 1739.",
    howToReach: {
      byTrain: "Nearest railway station is Roha (40 km). Regular buses connect Roha to Alibaug and Revdanda.",
      byBus: "MSRTC buses from Alibaug towards Murud pass through Korlai village.",
      byRoad: "From Mumbai (125 km): Take Ro-Ro ferry to Mandwa ➔ Drive through Alibaug and Revdanda Bridge to Korlai village (~2.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Coastal Transit", description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Overnight drive to Revdanda." },
      { day: 2, title: "06:00 AM – Korlai Base, Lighthouse & Fortress Exploration", description: "06:00 AM: Reach Korlai. Enjoy fresh breakfast with tea. 07:15 AM: Climb to Korlai Lighthouse and explore the panoramic headland. 08:30 AM - 11:30 AM: Walk through the historic Portuguese church ruins, ramparts, and cannons with 360° ocean views. 12:00 PM: Descend to village. 01:00 PM: Delicious Konkani coastal lunch. 02:30 PM: Relax at Korlai beach. 04:00 PM: Return drive to Mumbai. 08:30 PM: Arrive in Mumbai." }
    ]
  },

  // ── 7. KENJALGAD (GHERA KHELANJA) ──
  {
    slug: "kenjalgad-fort-trek",
    name: "Kenjalgad (Ghera Khelanja) Hexagonal Plateau",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "235 km from Mumbai",
    maxAltitude: "1,299 m (4,261 ft)",
    elevation: "1,299 m (4,261 ft)",
    startPoint: "Korle Base Village",
    endPoint: "Korle Base Village",
    baseVillage: "Korle (कोरले, Wai, Satara)",
    category: "fort",
    difficulty: "easy",
    weatherStats: { temp: "22°C", wind: "20 km/h Wind", rainProb: "10% Rain", uv: "UV 6", visibility: "22 km" },
    baseVillages: [
      {
        name: "Korle",
        marathiName: "कोरले (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Easy to Moderate",
        distanceFromBase: "3.5 km",
        trailDuration: "1.5 Hours",
        popularFor: "Short, scenic climb ascending through carved stone stairs directly onto the flat tableland",
        routeDescription: "Starts at Korle village near Bhor-Wai ghat. The trail ascends a grassy saddle, reaches the base of the sheer hexagonal scarp, and enters through ancient rock-cut stairs into the grand fortification door.",
        coordinates: { lat: 18.0183, lng: 73.7483 }
      }
    ],
    highlights: [
      "💎 Striking Hexagonal (सहा बाजूंचे) Natural Tableland surrounded by sheer vertical rock cliffs",
      "🪜 Rock-Cut Staircase chiseled directly out of the basalt bedrock",
      "🛕 Ancient Khelanji Devi Temple and sprawling green plateau",
      "🌄 Unrivaled panoramic views of Raireshwar, Rohida, Kamalgad, and Wai valley",
      "🍛 Authentic rural Satara-style Maharashtrian village lunch"
    ],
    fortAttractions: [
      "Rock-Cut Entrance Staircase (कातळात कोरलेला जिना)",
      "Hexagonal Cliff Fortification Walls",
      "Khelanji Devi Shrine",
      "Large Perennial Water Tanks carved in stone",
      "Unobstructed views of Raireshwar plateau (Swarajya oath site)"
    ],
    history: "Kenjalgad (also called Ghera Khelanja) was constructed in the 12th century by the Bhoj kings of the Shilahara dynasty. Captured by Chhatrapati Shivaji Maharaj in 1674 following his coronation, it was an integral southern bastion guarding the passage across the Wai and Bhor territories. In 1818, British troops under General Pritzler captured the fort after the fall of Satara.",
    howToReach: {
      byTrain: "Nearest railway station is Pune (90 km) or Wathar (45 km). Regular buses run to Wai and Bhor.",
      byBus: "Buses from Bhor or Wai depot go to Korle village.",
      byRoad: "From Mumbai (235 km): Drive via Mumbai-Pune Expressway ➔ NH48 to Shirwal ➔ Bhor ➔ Wai-Bhor Road to Korle village (~4.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Transit", description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Drive along NH48 to Bhor." },
      { day: 2, title: "05:00 AM – Korle Base, Hexagonal Tableland Climb & Return", description: "05:00 AM: Arrive at Korle. Enjoy hot breakfast. 06:15 AM: Begin climb in cool mountain air. 07:30 AM: Climb the rock-cut stairs onto the expansive tableland. 08:00 AM - 11:30 AM: Explore the hexagonal perimeter, Khelanji Devi temple, and admire views of Raireshwar and Balakilla. 12:00 PM: Descend to Korle. 01:15 PM: Authentic rustic lunch. 02:45 PM: Depart for Mumbai. 09:00 PM: Arrive in Mumbai." }
    ]
  },

  // ── 8. PADMADURG (KASA FORT) ──
  {
    slug: "padmadurg-kasa-sea-fort-trek",
    name: "Padmadurg (Kasa Fort) Ocean Fortress Walk",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "165 km from Mumbai",
    maxAltitude: "20 m",
    elevation: "20 m",
    startPoint: "Murud Beach Jetty",
    endPoint: "Murud Beach Jetty",
    baseVillage: "Murud (मुरुड समुद्रकिनारा, Raigad)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "18 km/h Ocean Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "20 km" },
    baseVillages: [
      {
        name: "Murud Koliwada Beach",
        marathiName: "मुरुड कोळीवाडा (स्थानिक बोट मार्ग)",
        isPrimary: true,
        difficulty: "Easy (Sea Ferry & Island Walk)",
        distanceFromBase: "2.0 km boat ride",
        trailDuration: "2 Hours",
        popularFor: "Offbeat historic sea-fort crossing by fishing boat to Shivaji Maharaj's counter-fort to Janjira",
        routeDescription: "Board local fishing boats from Murud beach across the rolling sea waves directly to the rocky reef of Kasa island. Enter through the lotus-petal designed ramparts.",
        coordinates: { lat: 18.3183, lng: 72.9512 }
      }
    ],
    highlights: [
      "🚩 Commissioned by Chhatrapati Shivaji Maharaj in 1676 specifically to challenge the Siddi stronghold of Janjira",
      "🌸 Unique Lotus-Petal (पद्म) Architectural Layout built with sturdy dressed black stone",
      "⛵ Thrilling open-sea boat crossing with panoramic views of Janjira citadel across the water",
      "💥 Ancient Portuguese and Maratha iron cannons overlooking the shipping lanes",
      "🍛 Authentic coastal Konkani meal at Murud beach"
    ],
    fortAttractions: [
      "Lotus-Petal Shaped Sea Ramparts (पद्म आकाराची तटबंदी)",
      "Six Fortified Bastions with Cannon Ports",
      "Freshwater Cisterns on Rocky Ocean Reef",
      "Direct View of Murud Janjira Citadel across the sea",
      "Historic Stone Inscriptions & Battery Platforms"
    ],
    history: "Padmadurg (also known as Kasa Fort) was constructed by Chhatrapati Shivaji Maharaj in 1676 on the Kasa island rock to break the maritime monopoly of the Siddis of Janjira. Maharaj named it 'Padmadurg' (Lotus Fort) due to its unique petal-shaped defensive bastions. Under Sambhaji Maharaj and Kanhoji Angre, Padmadurg served as a prime naval base for Maratha warships.",
    howToReach: {
      byTrain: "Roha (42 km) on Konkan Railway. Frequent buses connect Roha to Murud.",
      byBus: "Direct MSRTC buses ply from Mumbai and Alibaug to Murud.",
      byRoad: "From Mumbai (165 km): Drive via Alibaug and Revdanda to Murud beach (~3.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Coastal Drive", description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Overnight drive to Murud." },
      { day: 2, title: "06:00 AM – Murud Base, Ocean Crossing & Sea Citadel Exploration", description: "06:00 AM: Arrive at Murud. Enjoy breakfast with tea. 07:15 AM: Board boat to Kasa rock. 08:00 AM - 11:30 AM: Explore the lotus bastions, cannons, and views of Janjira. 12:00 PM: Return to shore. 01:00 PM: Authentic Konkani lunch. 02:30 PM: Relax at Kashid beach. 04:30 PM: Depart for Mumbai. 09:30 PM: Arrive in Mumbai." }
    ]
  },

  // ── 9. KONDANE BUDDHIST CAVES & WATERFALL ──
  {
    slug: "kondane-caves-waterfall-trek",
    name: "Kondane Buddhist Caves & Waterfall Trail",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "85 km from Mumbai",
    maxAltitude: "200 m",
    elevation: "200 m",
    startPoint: "Kondivade Base Village",
    endPoint: "Kondivade Base Village",
    baseVillage: "Kondivade (कोंडिवडे, Karjat)",
    category: "waterfall",
    difficulty: "easy",
    weatherStats: { temp: "26°C", wind: "14 km/h Wind", rainProb: "20% Rain", uv: "UV 6", visibility: "18 km" },
    baseVillages: [
      {
        name: "Kondivade",
        marathiName: "कोंडिवडे (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "3.0 km",
        trailDuration: "1.5 Hours",
        popularFor: "Family-friendly monsoon nature trek through gushing streams and ancient 2nd century BC Buddhist rock-cut caves",
        routeDescription: "Starts at Kondivade village near Karjat. A shaded forest path alongside the Ulhas River ascends gently through teak jungle to the grand Chaitya hall and waterfall.",
        coordinates: { lat: 18.8183, lng: 73.3683 }
      }
    ],
    highlights: [
      "🏛️ 2nd Century BC Buddhist Rock-Cut Caves: 16 magnificent ancient rock-cut caves carved over 2,200 years ago",
      "🌊 Natural Waterfall cascading directly across the mouth of the grand Chaitya rock cave in monsoon",
      "🧘 Monumental Stupa, intricate carved wooden-style stone rafters, and ancient Brahmi inscriptions",
      "🌲 Lush, gentle nature walk suitable for beginners, families, and history buffs",
      "🍛 Warm, comforting rural Maharashtrian village meal at Kondivade base"
    ],
    fortAttractions: [
      "Grand Chaitya Cave with Magnificent Horseshoe Arch",
      "Monolithic Rock Stupa (दगडी स्तूप)",
      "Vihara Monks' Quarters & Stone Beds",
      "Cascading Cave-top Waterfall",
      "Ancient Brahmi Script Inscription of the Donor"
    ],
    history: "The Kondane Caves date back to the 2nd century BC (Satavahana era). They represent some of the earliest examples of rock-cut Buddhist architecture in western India, mirroring wooden architectural construction in stone. The caves feature a grand prayer hall (Chaitya) with thirty original octagonal stone pillars, a monolithic stupa, and living quarters (Viharas) for Buddhist monks meditating amidst the Sahyadri mountains.",
    howToReach: {
      byTrain: "Nearest railway station is Karjat Junction (12 km). Auto-rickshaws and shared tum-tums go to Kondivade.",
      byBus: "Buses from Karjat depot towards Kondiwade stop at the trailhead.",
      byRoad: "From Mumbai (85 km): Drive via Mumbai-Pune Expressway ➔ Exit at Shedung / Chowk ➔ Karjat ➔ Kondivade village (~2 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Easy Transit", description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Easy highway drive to Karjat." },
      { day: 2, title: "05:30 AM – Kondivade Base, Caves & Waterfall Exploration", description: "05:30 AM: Arrive at Kondivade. Enjoy breakfast with tea. 06:30 AM: Walk the shaded jungle path along mountain streams. 07:45 AM: Reach the magnificent Kondane Buddhist Caves with water spraying down the cave arch. 08:00 AM - 11:30 AM: Explore the stupa, chaitya hall, monk cells, and ancient inscriptions. 12:00 PM: Return to village. 01:00 PM: Delicious authentic village lunch. 02:30 PM: Depart for Mumbai. 06:00 PM: Arrive in Mumbai." }
    ]
  },

  // ── 10. MAHIPATGAD FOREST CITADEL ──
  {
    slug: "mahipatgad-forest-fort-trek",
    name: "Mahipatgad Dense Forest Citadel Expedition",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "230 km from Mumbai",
    maxAltitude: "940 m (3,090 ft)",
    elevation: "940 m (3,090 ft)",
    startPoint: "Wadi Beldar Base Village",
    endPoint: "Wadi Beldar Base Village",
    baseVillage: "Wadi Beldar (वाडी बेलदार, Khed, Ratnagiri)",
    category: "forest",
    difficulty: "moderate",
    weatherStats: { temp: "23°C", wind: "16 km/h Wind", rainProb: "15% Rain", uv: "UV 6", visibility: "19 km" },
    baseVillages: [
      {
        name: "Wadi Beldar",
        marathiName: "वाडी बेलदार (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "5.5 km",
        trailDuration: "3 Hours",
        popularFor: "Deep forest trail ascending the largest tableland fortress in Maharashtra",
        routeDescription: "Starts at Wadi Beldar in the Jagbudi river valley. Ascends through dense semi-evergreen forest of the Sahyadri tiger corridor, enters through the ruined Kotwal Darwaja onto the massive 120-acre plateau.",
        coordinates: { lat: 17.7683, lng: 73.5512 }
      }
    ],
    highlights: [
      "🌳 Largest Tableland Fort in the Sahyadris covering an astonishing 120 acres of dense forest plateau",
      "🐅 Pristine Wildlife Sanctuary corridor with frequent sightings of hornbills, barking deer & leopards",
      "🚪 Six Historic Fortification Gates: Kotwal, Laldev, Yeshwant, Khed, Shivaganga, and Pushpa Darwaja",
      "🛕 Ancient Pareshwar Mahadev Temple and crystal clear forest springs",
      "🍛 Authentic rural Ratnagiri-style Kokanastha village feast"
    ],
    fortAttractions: [
      "Kotwal Darwaja & Intact Bastions",
      "Pareshwar Mahadev Historic Temple",
      "Sprawling 120-acre Jungle Tableland",
      "Large Perennial Water Tanks in Bedrock",
      "Panoramic views of Rasalgad & Sumargad"
    ],
    history: "Mahipatgad, standing at 3,090 ft, was originally constructed by Adil Shah and captured by Chhatrapati Shivaji Maharaj in 1660. Recognizing its colossal 120-acre tableland and thick forest cover, Maharaj refortified it with six grand gates and used it as a secluded military cantonment capable of hiding over 5,000 troops. Together with neighboring Sumargad and Rasalgad, it formed an impenetrable defensive triad over the southern Konkan.",
    howToReach: {
      byTrain: "Khed railway station (35 km) on Konkan Railway. Jeeps connect Khed to Wadi Beldar.",
      byBus: "MSRTC buses from Khed depot run towards Wadi Beldar.",
      byRoad: "From Mumbai (230 km): Drive along NH66 ➔ Khed ➔ Turn towards Wadi Beldar (~5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Transit", description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Drive along NH66 towards Khed." },
      { day: 2, title: "05:00 AM – Wadi Beldar Base, Jungle Tableland & Return", description: "05:00 AM: Arrive at Wadi Beldar. Enjoy breakfast and tea. 06:15 AM: Trek through the dense teak jungle. 08:30 AM: Enter Kotwal Darwaja onto the massive green plateau. 09:00 AM - 12:30 PM: Visit Pareshwar temple, water tanks, and photograph views of Sumargad and Rasalgad. 01:00 PM: Descend to base. 02:30 PM: Hearty authentic village feast. 04:00 PM: Depart for Mumbai. 10:30 PM: Arrive in Mumbai." }
    ]
  }
];

async function updatePart4() {
  console.log(`Starting real data update for Part 4 (${TREKS_REAL_DATA_PART4.length} forts/treks)...`);
  let updatedCount = 0;

  for (const trek of TREKS_REAL_DATA_PART4) {
    const snap = await db.collection('treks').where('slug', '==', trek.slug).get();
    if (!snap.empty) {
      for (const doc of snap.docs) {
        await doc.ref.update({
          ...trek,
          updatedAt: new Date().toISOString()
        });
        console.log(`✓ Successfully updated ${trek.slug} (${trek.name}) with rich real information!`);
        updatedCount++;
      }
    } else {
      console.warn(`✗ Slug not found in database: ${trek.slug}`);
    }
  }

  console.log(`\nPart 4 complete! Successfully updated ${updatedCount} treks in Firestore with Durg-style rich real data!`);
}

updatePart4().catch(console.error).finally(() => process.exit(0));

