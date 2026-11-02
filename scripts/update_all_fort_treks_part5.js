/**
 * Part 5: Final 20 Sahyadri & Konkan Trails (100% Complete Database)
 * Updates the remaining 20 coastal forts, rock towers, nature sanctuaries & heritage walks
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

const TREKS_REAL_DATA_PART5 = [
  // ── 1. RASALGAD FORT ──
  {
    slug: "rasalgad-hill-fort-trek",
    name: "Rasalgad Fort & Temple Trail",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "235 km from Mumbai",
    maxAltitude: "540 m (1,770 ft)",
    elevation: "540 m (1,770 ft)",
    startPoint: "Rasalwadi Base Village",
    endPoint: "Rasalwadi Base Village",
    baseVillage: "Rasalwadi (रसाळवाडी, Khed, Ratnagiri)",
    category: "fort",
    difficulty: "easy",
    weatherStats: { temp: "24°C", wind: "16 km/h Wind", rainProb: "10% Rain", uv: "UV 6", visibility: "20 km" },
    baseVillages: [
      {
        name: "Rasalwadi",
        marathiName: "रसाळवाडी (मुख्य पायथा)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "2.5 km",
        trailDuration: "1.5 Hours",
        popularFor: "Short and pleasant trail to intact stone gates, Zolambadevi temple, and deep valley views",
        routeDescription: "Starts at Rasalwadi village near Khed. A scenic mud path climbs through wooded hills, enters through two intact stone doorways, and reaches the expansive tableland.",
        coordinates: { lat: 17.7318, lng: 73.5383 }
      }
    ],
    highlights: [
      "🚪 Two Wonderfully Preserved Stone Gates with intact archways and defense bastions",
      "🛕 Ancient Zolambadevi Temple in the center of the peaceful fort plateau",
      "💥 Intact Bronze & Iron Cannons resting proudly on high ramparts",
      "🌄 Panoramic vistas of sister forts Mahipatgad and Sumargad across the valley",
      "🍛 Authentic rural Khed-style Maharashtrian feast"
    ],
    fortAttractions: ["Two Intact Stone Gateways", "Zolambadevi Temple", "Deep Rock Cisterns", "Ancient Cannons on Bastions", "Views of Mahipatgad & Sumargad"],
    history: "Rasalgad was constructed in the medieval era and fortified by Chhatrapati Shivaji Maharaj in 1660 to guard the trade routes passing from Khed to the Deccan plateau. It remained an active military storehouse under the Peshwas.",
    howToReach: {
      byTrain: "Khed (20 km) on Konkan Railway.",
      byBus: "Buses from Khed go to Rasalwadi.",
      byRoad: "From Mumbai (235 km): Follow NH66 to Khed ➔ Rasalwadi (~4.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Overnight transit to Khed." },
      { day: 2, title: "05:00 AM – Rasalwadi Base, Fort Exploration & Return", description: "05:00 AM: Arrive at base. Breakfast with tea. 06:15 AM: Climb to the fort. 07:30 AM - 11:30 AM: Explore gates, Zolambadevi temple, cannons, and views. 12:00 PM: Descend to base. 01:00 PM: Village lunch. 03:00 PM: Depart for Mumbai. 09:30 PM: Reach Mumbai." }
    ]
  },

  // ── 2. MANIKGAD FORT ──
  {
    slug: "manikgad-fort-trek",
    name: "Manikgad Fort Ruined Round Tower",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "75 km from Mumbai",
    maxAltitude: "570 m (1,878 ft)",
    elevation: "570 m (1,878 ft)",
    startPoint: "Vashivali Base Village",
    endPoint: "Vashivali Base Village",
    baseVillage: "Vashivali (वाशीवली, Rasayani, Panvel)",
    category: "fort",
    difficulty: "moderate",
    weatherStats: { temp: "26°C", wind: "14 km/h Wind", rainProb: "12% Rain", uv: "UV 6", visibility: "19 km" },
    baseVillages: [
      {
        name: "Vashivali",
        marathiName: "वाशीवली (मुख्य पायथा)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "4.5 km",
        trailDuration: "2.5 Hours",
        popularFor: "Scenic trail passing through dense scrub jungle to the distinctive round bastion citadel",
        routeDescription: "Starts at Vashivali village near Rasayani. The trail climbs through wooded hillside paths and rock steps, reaching the ruined circular stone tower overlooking Patalganga valley.",
        coordinates: { lat: 18.8418, lng: 73.2383 }
      }
    ],
    highlights: [
      "🏰 Distinctive Ruined Round Tower Bastion crowning the summit hill",
      "🚩 Rebuilt by Sarkhel Kanhoji Angre to guard the trade routes of Patalganga River",
      "🛕 Hanuman Rock Carving & deep perennial rock-cut water cisterns",
      "🌄 Panoramic views of Karnala, Prabalgad, and the coastal plains",
      "🍛 Warm village hospitality and authentic meal at base"
    ],
    fortAttractions: ["Circular Stone Tower Bastion", "Hanuman Rock Relief", "Water Cisterns", "Views of Patalganga River & Karnala"],
    history: "Manikgad was built by the Bahmani Sultanate and captured by the Marathas under Chhatrapati Shivaji Maharaj. It was later rebuilt by Admiral Kanhoji Angre in the early 18th century as an inland defense post.",
    howToReach: {
      byTrain: "Apta (8 km) or Panvel (25 km). Auto-rickshaws connect to Vashivali.",
      byBus: "Buses from Panvel to Pen pass near Rasayani.",
      byRoad: "From Mumbai (75 km): Drive via Mumbai-Pune Expressway ➔ Exit at Shedung ➔ Rasayani ➔ Vashivali (~1.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Short Highway Drive", description: "Board private AC trekking coach. Pickups across Mumbai. Drive to Rasayani." },
      { day: 2, title: "05:30 AM – Vashivali Base, Tower Climb & Return", description: "05:30 AM: Arrive at base. Breakfast with tea. 06:30 AM: Climb through forest trail. 08:30 AM - 11:30 AM: Explore circular tower, water tanks, and valley views. 12:00 PM: Descend. 01:15 PM: Village lunch. 02:45 PM: Depart for Mumbai. 06:00 PM: Arrive in Mumbai." }
    ]
  },

  // ── 3. JAIGAD FORT & CLIFF TEMPLE ──
  {
    slug: "jaigad-fort-temple-trail",
    name: "Jaigad Fort & Karhateshwar Cliff Temple",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "340 km from Mumbai",
    maxAltitude: "60 m",
    elevation: "60 m",
    startPoint: "Jaigad Port Base",
    endPoint: "Jaigad Port Base",
    baseVillage: "Jaigad (जयगड, Ratnagiri)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "21 km/h Sea Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "22 km" },
    baseVillages: [
      {
        name: "Jaigad Port",
        marathiName: "जयगड बंदर (मुख्य प्रवेशद्वार)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "2.5 km",
        trailDuration: "2 Hours",
        popularFor: "Deep sea estuary rampart walk, active lighthouse, and Karhateshwar wooden cliff temple",
        routeDescription: "Starts at Jaigad fort entrance. Walk along high stone ramparts overlooking Shastri River estuary, followed by a coastal cliff walk to ancient Karhateshwar Shiva Temple.",
        coordinates: { lat: 17.3018, lng: 73.2183 }
      }
    ],
    highlights: [
      "🌊 Guarding the mouth of the Shastri River where it flows into the Arabian Sea",
      "🛕 Ancient Karhateshwar Cliff Temple carved out of seaside black rocks",
      "🗼 Operational 1932 Jaigad Lighthouse with sweeping ocean horizon views",
      "🧱 Well-preserved moat and high stone fortification walls with cannon embrasures",
      "🍛 Authentic Ratnagiri seafood or vegetarian thali with freshly squeezed Solkadhi"
    ],
    fortAttractions: ["Shastri River Estuary Ramparts", "Karhateshwar Ocean Cliff Temple", "Jaigad Lighthouse", "Deep Dry Moat & Palace Ruins", "Freshwater Well inside Fort"],
    history: "Jaigad Fort ('Fort of Victory') was constructed in the 16th century by the Bijapur Sultanate and captured by the Maratha Navy under Admiral Kanhoji Angre in 1713. It guards the deep harbor and entrance to the Shastri River.",
    howToReach: {
      byTrain: "Ratnagiri (40 km) on Konkan Railway.",
      byBus: "Direct MSRTC buses from Ratnagiri to Jaigad.",
      byRoad: "From Mumbai (340 km): Follow NH66 to Sangameshwar ➔ Jaigad (~7 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive to Ratnagiri." },
      { day: 2, title: "06:00 AM – Jaigad Base, Estuary Ramparts & Cliff Temple", description: "06:00 AM: Arrive at Jaigad. Breakfast with tea. 07:15 AM: Explore fort walls and moat. 09:00 AM: Visit Jaigad lighthouse. 10:30 AM: Walk to Karhateshwar cliff temple. 12:30 PM: Authentic Konkani lunch. 02:00 PM: Relax at nearby beach. 03:30 PM: Depart for Mumbai. 11:00 PM: Reach Mumbai." }
    ]
  },

  // ── 4. PURNAGAD FORT COASTAL TRAIL ──
  {
    slug: "purnagad-fort-coastal-trail",
    name: "Purnagad Fort & Machi Ocean Lookout",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "360 km from Mumbai",
    maxAltitude: "45 m",
    elevation: "45 m",
    startPoint: "Purnagad Base Village",
    endPoint: "Purnagad Base Village",
    baseVillage: "Purnagad (पूर्णगड, Ratnagiri)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "18 km/h Sea Wind", rainProb: "10% Rain", uv: "UV 7", visibility: "22 km" },
    baseVillages: [
      {
        name: "Purnagad Village",
        marathiName: "पूर्णगड गाव (मुख्य पायथा)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "2.0 km",
        trailDuration: "1.5 Hours",
        popularFor: "Short and scenic coastal hill trek overlooking the confluence of Muchkundi River and the Arabian Sea",
        routeDescription: "Starts at Purnagad fishing village. Stone steps climb through coconut and betel nut groves onto the fort ramparts overlooking the turquoise ocean estuary.",
        coordinates: { lat: 16.8183, lng: 73.3083 }
      }
    ],
    highlights: [
      "🌊 Spectacular confluence view where the emerald Muchkundi River meets the Arabian Sea",
      "🚪 Intact East-facing Entrance Gate featuring carved stone lotus flowers and Hanuman reliefs",
      "🌴 Peaceful, uncrowded coastal fortress surrounded by lush coconut and areca nut groves",
      "💥 Historic iron cannons still pointing out across the river channel",
      "🍛 Authentic rural Ratnagiri seafood and Kokan home-style feast"
    ],
    fortAttractions: ["Carved East Entrance Gate", "Hanuman Rock Relief", "Ramparts overlooking Muchkundi River", "Historic Cannons", "Quiet Secluded Beach below"],
    history: "Purnagad Fort was built in 1705 by Admiral Kanhoji Angre to protect the mouth of the Muchkundi River from pirates and European trade ships. It spans a compact area with intact ramparts and stone bastion towers.",
    howToReach: {
      byTrain: "Ratnagiri (28 km) on Konkan Railway.",
      byBus: "MSRTC buses from Ratnagiri towards Pawas and Purnagad.",
      byRoad: "From Mumbai (360 km): Follow NH66 to Ratnagiri ➔ Coastal Highway to Pawas and Purnagad (~7 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive to Ratnagiri." },
      { day: 2, title: "06:00 AM – Purnagad Base, River Confluence Walk & Return", description: "06:00 AM: Arrive at Purnagad. Breakfast with tea. 07:15 AM: Climb to fort through coconut groves. 08:00 AM - 11:30 AM: Explore ramparts, cannons, and river confluence. 12:00 PM: Descend to village. 01:00 PM: Authentic Konkani lunch. 02:30 PM: Visit Swami Swaroopanand Ashram at Pawas. 04:00 PM: Return drive to Mumbai. 11:30 PM: Arrive in Mumbai." }
    ]
  },

  // ── 5. BANKOT FORT COASTAL TREK ──
  {
    slug: "bankot-fort-coastal-trek",
    name: "Bankot Fort Coastal Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "210 km from Mumbai",
    maxAltitude: "50 m",
    elevation: "50 m",
    startPoint: "Bankot Base Village",
    endPoint: "Bankot Base Village",
    baseVillage: "Bankot (बाणकोट, Mandangad / Velas)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "19 km/h Sea Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "21 km" },
    baseVillages: [
      {
        name: "Bankot Village",
        marathiName: "बाणकोट गाव (मुख्य पायथा)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "2.0 km",
        trailDuration: "1.5 Hours",
        popularFor: "Historic fort guarding Savitri River estuary, famous British cemetery, and proximity to Velas turtle beach",
        routeDescription: "Starts at Bankot village. Stone steps climb through betel orchards to the grand entrance of Fort Victoria (Bankot) overlooking the Savitri estuary and Bagmandla ferry.",
        coordinates: { lat: 17.9818, lng: 73.0512 }
      }
    ],
    highlights: [
      "🚩 First British Residency in Western India (named 'Fort Victoria' after 1756 treaty with Peshwa)",
      "🌊 Sweeping panoramic view of the Savitri River entering the Arabian Sea at Bagmandla",
      "🏛️ Beautifully preserved laterite stone ramparts and historic 18th-century British cemetery",
      "🐢 Located just 5 km from the famous Velas Olive Ridley Turtle Sanctuary",
      "🍛 Authentic rural Konkani vegetarian / seafood village feast"
    ],
    fortAttractions: ["Laterite Stone Ramparts", "Historic 18th-century European Cemetery", "Grand Entrance with Inscriptions", "Savitri River Estuary Panorama", "Ancient Deep Water Wells"],
    history: "Bankot Fort (ancient Himmatgad) commands the mouth of the sacred Savitri River. Captured by the Portuguese in 1548 and later brought into Swarajya by Chhatrapati Shivaji Maharaj, it was handed over to the British East India Company in 1756 under a treaty with Peshwa Balaji Baji Rao, becoming their first territorial possession in western India and renamed Fort Victoria.",
    howToReach: {
      byTrain: "Mangaon (60 km) on Konkan Railway.",
      byBus: "Buses from Mandangad to Bankot and Velas.",
      byRoad: "From Mumbai (210 km): Follow NH66 to Mangaon ➔ Mandangad ➔ Bankot (~4.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Coastal Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive towards Mandangad." },
      { day: 2, title: "05:30 AM – Bankot Base, Savitri Estuary & Turtle Beach", description: "05:30 AM: Arrive at Bankot. Breakfast with tea. 06:30 AM: Climb to Bankot Fort. 07:30 AM - 10:30 AM: Explore ramparts, cemetery, and river mouth. 11:00 AM: Visit Velas turtle beach. 01:00 PM: Delicious authentic Konkani village lunch. 02:30 PM: Relax by shore. 04:00 PM: Depart for Mumbai. 09:30 PM: Reach Mumbai." }
    ]
  },

  // ── 6. GOPALGAD & ANJANVEL LIGHTHOUSE ──
  {
    slug: "gopalgad-anjanvel-lighthouse-trek",
    name: "Gopalgad Fort & Anjanvel Lighthouse Walk",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "250 km from Mumbai",
    maxAltitude: "60 m",
    elevation: "60 m",
    startPoint: "Anjanvel Base Village",
    endPoint: "Anjanvel Base Village",
    baseVillage: "Anjanvel (अंजनवेल, Guhagar)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "20 km/h Sea Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "22 km" },
    baseVillages: [
      {
        name: "Anjanvel",
        marathiName: "अंजनवेल (मुख्य पायथा)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "2.5 km",
        trailDuration: "1.5 Hours",
        popularFor: "Coastal fortress walk guarding Vashishti river mouth and scenic cliff-top Anjanvel Lighthouse",
        routeDescription: "Starts at Anjanvel village near Guhagar. The path leads along coastal cliffs to Gopalgad Fort ramparts and onwards to the tall Anjanvel Lighthouse overlooking the open Arabian Sea.",
        coordinates: { lat: 17.5318, lng: 73.1883 }
      }
    ],
    highlights: [
      "🌊 Guarding the mouth of the Vashishti River leading inland to historic Chiplun port",
      "🗼 Operational Anjanvel Lighthouse perched high on laterite ocean cliffs",
      "🧱 Built by the Siddis and heavily refortified by Chhatrapati Shivaji Maharaj in 1660",
      "🌴 Picturesque, tranquil setting surrounded by mango orchards and virgin coastline",
      "🍛 Traditional Guhagar Kokanastha Brahmin vegetarian thali or coastal fish curry"
    ],
    fortAttractions: ["Ramparts over Vashishti Estuary", "Anjanvel Coastal Lighthouse", "Ancient Stone Moat", "Cannon Batteries", "Dhabdhaba Cliff Viewpoint"],
    history: "Gopalgad Fort was originally constructed by the Siddis of Janjira in the 16th century to control trade along the Vashishti River. In 1660, Chhatrapati Shivaji Maharaj captured the fortress, reinforcing its walls with stone and bastions. It was later maintained by Tulaji Angre before falling to the Peshwa forces.",
    howToReach: {
      byTrain: "Chiplun (45 km) on Konkan Railway.",
      byBus: "MSRTC buses from Guhagar and Chiplun to Anjanvel.",
      byRoad: "From Mumbai (250 km): Follow NH66 to Chiplun ➔ Guhagar ➔ Anjanvel (~5.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Coastal Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive towards Guhagar." },
      { day: 2, title: "06:00 AM – Anjanvel Base, Gopalgad & Lighthouse Walk", description: "06:00 AM: Arrive at Anjanvel. Breakfast with tea. 07:15 AM: Explore Gopalgad ramparts. 09:30 AM: Tour Anjanvel lighthouse. 11:30 AM: Relax at Guhagar beach. 01:00 PM: Delicious Guhagar lunch. 03:00 PM: Depart for Mumbai. 10:00 PM: Reach Mumbai." }
    ]
  },

  // ── 7. REVDANDA BEACH & COASTAL FORT RAMPARTS ──
  {
    slug: "revdanda-beach-ramparts-walk",
    name: "Revdanda Beach & Coastal Fort Ramparts",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "115 km from Mumbai",
    maxAltitude: "15 m",
    elevation: "15 m",
    startPoint: "Revdanda Beach Base",
    endPoint: "Revdanda Beach Base",
    baseVillage: "Revdanda (रेवदंडा, Alibaug)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "18 km/h Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "20 km" },
    baseVillages: [
      {
        name: "Revdanda Beach",
        marathiName: "रेवदंडा बीच (मुख्य प्रवेश)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "3.0 km beach & wall walk",
        trailDuration: "2 Hours",
        popularFor: "Black sand beach trail, Portuguese church ruins, and cannon battery walls on the beach",
        routeDescription: "Starts at Revdanda beach. Walk along the coastline where ancient Portuguese fortress walls meet the black sand and Arabian Sea waves, exploring historic church towers and bastions.",
        coordinates: { lat: 18.5583, lng: 72.9283 }
      }
    ],
    highlights: [
      "🏰 Massive Portuguese Chaul fortress whose stone ramparts plunge directly into the ocean waves",
      "🏛️ 4-story high Portuguese Bell Tower & church ruins hidden inside coastal coconut groves",
      "🏖️ Pristine Black Sand Revdanda Beach fringed by swaying betel nut and suru plantations",
      "🌉 Panoramic view of the Kundalika River bridge and Korlai Lighthouse",
      "🍛 Authentic Alibaug fish thali or vegetarian feast at Revdanda base"
    ],
    fortAttractions: ["Ocean-edge Fort Ramparts", "Four-Story Portuguese Church Tower", "Ancient Cannons in Sand", "Revdanda Black Sand Beach", "Kundalika River Estuary"],
    history: "Built by the Portuguese between 1521 and 1524 under the name 'Chaul Fort', Revdanda was one of the largest Portuguese fortified settlements on the Indian western coast. It had massive ramparts, seven church complexes, and hundreds of cannons. It was captured by the Marathas under Chimaji Appa in 1740.",
    howToReach: {
      byTrain: "Roha (35 km) on Konkan Railway.",
      byBus: "Regular buses from Alibaug to Revdanda (17 km).",
      byRoad: "From Mumbai (115 km): Ro-Ro ferry to Mandwa ➔ Alibaug ➔ Revdanda (~2.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Coastal Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive to Alibaug/Revdanda." },
      { day: 2, title: "06:00 AM – Revdanda Base, Ramparts & Beach Walk", description: "06:00 AM: Reach Revdanda. Breakfast with tea. 07:00 AM - 11:30 AM: Walk the ancient ocean ramparts, explore the bell tower, and stroll on the beach. 12:30 PM: Authentic Alibaug lunch. 02:30 PM: Relax at Kashid beach. 04:30 PM: Return drive to Mumbai. 08:30 PM: Arrive in Mumbai." }
    ]
  },

  // ── 8. HARIHARESHWAR ROCK TRAIL ──
  {
    slug: "harihareshwar-pradakshina-hill",
    name: "Harihareshwar Sacred Ocean Rock Trail",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "195 km from Mumbai",
    maxAltitude: "30 m",
    elevation: "30 m",
    startPoint: "Harihareshwar Temple Base",
    endPoint: "Harihareshwar Temple Base",
    baseVillage: "Harihareshwar (श्रीवर्धन, Raigad)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "18 km/h Ocean Wind", rainProb: "10% Rain", uv: "UV 7", visibility: "22 km" },
    baseVillages: [
      {
        name: "Harihareshwar Temple",
        marathiName: "हरिहरेश्वर मंदिर (प्रदक्षिणा मार्ग)",
        isPrimary: true,
        difficulty: "Easy (Rocky Coastal Trail)",
        distanceFromBase: "2.5 km pradakshina",
        trailDuration: "1.5 Hours",
        popularFor: "Sacred rocky cliff trail along the sea during low tide with dramatic natural rock carvings and wave-sculpted caves",
        routeDescription: "Starts at the 16th-century Harihareshwar Shiva Temple. The path climbs the holy Brahmagiri hill, descends stone stairs to the ocean edge, and traverses rocky geological rock arches and tide pools.",
        coordinates: { lat: 17.9983, lng: 73.0283 }
      }
    ],
    highlights: [
      "🕉️ 'Dakshin Kashi': Sacred 16th-century temple complex dedicated to Lord Shiva, Vishnu, and Brahma",
      "🪨 Miraculous Pradakshina Trail carved naturally into ocean-beaten rocky cliffs",
      "🌊 Walking through sea-sculpted rock arches and natural tide pools along crashing waves",
      "🏖️ Golden sand beaches of Harihareshwar and nearby Shrivardhan",
      "🍛 Authentic rural Konkani Kokanastha Brahmin feast with Ukadiche Modak"
    ],
    fortAttractions: ["Ancient Harihareshwar Shiva Temple", "Sea-cliff Pradakshina Trail", "Natural Rock-Cut Wave Arches & Geodes", "Brahmagiri Sacred Hill", "Harihareshwar Beach"],
    history: "Harihareshwar is an ancient temple pilgrimage town described in the Puranas as 'Dakshin Kashi'. The temple was patronized by the Peshwas, whose family originated from nearby Shrivardhan. The unique rocky coastal pradakshina circumambulates the entire holy hill along the ocean shelf.",
    howToReach: {
      byTrain: "Mangaon (65 km) on Konkan Railway.",
      byBus: "Direct MSRTC buses from Mumbai and Pune to Harihareshwar.",
      byRoad: "From Mumbai (195 km): Follow NH66 to Mangaon ➔ Mhasla ➔ Shrivardhan ➔ Harihareshwar (~4.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Highway Drive", description: "Board private AC trekking coach. Pickups across Mumbai. Drive to Harihareshwar." },
      { day: 2, title: "06:00 AM – Harihareshwar Base, Sacred Rock Trail & Return", description: "06:00 AM: Arrive at Harihareshwar. Breakfast with tea. 07:15 AM: Temple darshan. 08:30 AM: Walk the sacred sea rock pradakshina trail. 10:30 AM: Relax at the beach. 01:00 PM: Delicious lunch with Modak. 02:30 PM: Visit Shrivardhan beach. 04:00 PM: Depart for Mumbai. 09:30 PM: Reach Mumbai." }
    ]
  },

  // ── 9. KUNKESHWAR OCEAN CLIFF & BEACH WALK ──
  {
    slug: "kunkeshwar-cliffside-trail",
    name: "Kunkeshwar Ocean Cliff & Beach Walk",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "430 km from Mumbai",
    maxAltitude: "35 m",
    elevation: "35 m",
    startPoint: "Kunkeshwar Temple Base",
    endPoint: "Kunkeshwar Temple Base",
    baseVillage: "Kunkeshwar (कुणकेश्वर, Devgad, Sindhudurg)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "28°C", wind: "20 km/h Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "22 km" },
    baseVillages: [
      {
        name: "Kunkeshwar Beach & Temple",
        marathiName: "कुणकेश्वर मंदिर व किनारा",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "2.5 km",
        trailDuration: "1.5 Hours",
        popularFor: "Iconic South Konkan Shiva temple perched right above ocean waves and pristine white sand beach",
        routeDescription: "Starts at the grand 11th-century Kunkeshwar Temple. Walk along laterite sea cliffs and down to the pristine golden beach where dolphins are often spotted playing near the shore.",
        coordinates: { lat: 16.3318, lng: 73.2883 }
      }
    ],
    highlights: [
      "🛕 The 'Kashi of South Konkan': Magnificent 11th-century stone temple perched right over crashing ocean waves",
      "🐬 Frequent sightings of wild dolphins leaping in the clean waters right in front of the temple",
      "🏖️ Virgin Golden Sand Beach with sparkling water and lush coconut fringed shores",
      "🥭 Proximity to world-renowned Devgad Alphonso Mango orchards",
      "🍛 Authentic Malvani village meal with Solkadhi"
    ],
    fortAttractions: ["11th-century Yadav-era Shiva Temple", "Ocean Cliff Viewpoint & Dolphin Point", "Kunkeshwar Beach", "Ancient Stone Caves nearby", "Devgad Alphonso Orchards"],
    history: "Built around 1100 CE by the Yadava dynasty, legend states that a foreign sailor caught in a raging monsoon storm prayed to Lord Shiva and saw a light on this hill. Surviving the shipwreck, he funded the temple construction in gratitude. Chhatrapati Shivaji Maharaj renovated the shrine during his southern naval expeditions.",
    howToReach: {
      byTrain: "Kankavli (50 km) or Nandgaon on Konkan Railway.",
      byBus: "Direct buses from Devgad and Kankavli to Kunkeshwar.",
      byRoad: "From Mumbai (430 km): Follow NH66 via Chiplun to Kankavli ➔ Turn towards Devgad and Kunkeshwar (~8 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive along NH66 to Devgad." },
      { day: 2, title: "06:30 AM – Kunkeshwar Base, Cliff Walk & Beach Experience", description: "06:30 AM: Arrive at Kunkeshwar. Breakfast with tea. 07:30 AM: Temple darshan. 08:30 AM - 11:30 AM: Walk the sea cliff path, spot dolphins, and relax on the virgin beach. 12:30 PM: Authentic Malvani lunch. 02:00 PM: Visit Devgad windmill plateau. 03:30 PM: Return drive to Mumbai. 11:30 PM: Reach Mumbai." }
    ]
  },

  // ── 10. DEVGAD WINDMILL CLIFF TREK ──
  {
    slug: "devgad-windmill-cliff-trek",
    name: "Devgad Windmill Plateau & Cliff Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "420 km from Mumbai",
    maxAltitude: "75 m",
    elevation: "75 m",
    startPoint: "Devgad Lighthouse Base",
    endPoint: "Devgad Lighthouse Base",
    baseVillage: "Devgad (देवगड, Sindhudurg)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "24 km/h Coastal Wind", rainProb: "10% Rain", uv: "UV 7", visibility: "22 km" },
    baseVillages: [
      {
        name: "Devgad Plateau",
        marathiName: "देवगड पवनचक्की पठार",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "3.5 km",
        trailDuration: "2 Hours",
        popularFor: "Walking beneath colossal humming wind turbines on a high laterite tableland plunging into the ocean",
        routeDescription: "Starts at Devgad beach. Climbs to the windswept laterite plateau lined with giant white wind turbines, passes Devgad Fort ramparts and lighthouse, overlooking the harbor.",
        coordinates: { lat: 16.3818, lng: 73.3783 }
      }
    ],
    highlights: [
      "💨 Walk beneath giant whirling Wind Turbines on an expansive ocean-facing cliff plateau",
      "🏰 Historic Devgad Fort & 1915 coastal lighthouse with 360-degree marine horizon views",
      "🥭 Homeland of the King of Mangoes: Original GI-tagged Devgad Hapus (Alphonso)",
      "🌅 Mesmerizing Arabian Sea sunset over the natural harbor of Devgad",
      "🍛 Authentic coastal Malvani fish curry / vegetarian feast"
    ],
    fortAttractions: ["Windmill Farm on Tableland", "Devgad Fort Ramparts", "Devgad Lighthouse & Harbor", "Alphonso Mango Orchards", "Tara Mumbri Beach"],
    history: "Devgad Fort was constructed in 1705 by Dattaji Jivaji Prabhu on a high rocky headland to protect the natural deep-water bay of Devgad. It was captured by Kanhoji Angre, who turned it into an active naval outpost. Today, the high tableland hosts Maharashtra's famous coastal wind energy project.",
    howToReach: {
      byTrain: "Kankavli (50 km) on Konkan Railway.",
      byBus: "Direct MSRTC buses from Mumbai, Pune, and Kolhapur to Devgad.",
      byRoad: "From Mumbai (420 km): Follow NH66 via Chiplun ➔ Turn at Nandgaon towards Devgad (~8 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Drive", description: "Board private AC trekking coach. Pickups across Mumbai. Transit along NH66 to Devgad." },
      { day: 2, title: "06:30 AM – Devgad Base, Windmills & Coastal Fortress", description: "06:30 AM: Arrive at Devgad. Breakfast with tea. 07:30 AM - 11:30 AM: Walk the windmill plateau, tour the lighthouse and fort walls. 12:30 PM: Authentic Malvani lunch. 02:00 PM: Visit local mango cooperative or beach. 03:30 PM: Depart for Mumbai. 11:30 PM: Reach Mumbai." }
    ]
  },

  // ── 11. VELAS TURTLE SHORE & CLIFF TRAIL ──
  {
    slug: "velas-coastal-hill-trail",
    name: "Velas Turtle Shore & Cliff Trail",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "215 km from Mumbai",
    maxAltitude: "40 m",
    elevation: "40 m",
    startPoint: "Velas Village Base",
    endPoint: "Velas Village Base",
    baseVillage: "Velas (वेलास, Mandangad, Ratnagiri)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "18 km/h Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "21 km" },
    baseVillages: [
      {
        name: "Velas Village",
        marathiName: "वेलास गाव (कासव संवर्धन केंद्र)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "3.0 km",
        trailDuration: "2 Hours",
        popularFor: "Witnessing newly hatched Olive Ridley baby turtles crawling to the ocean at sunrise and cliff walks",
        routeDescription: "Starts at Velas village. Walk through picturesque betel nut groves to Velas beach hatchery for the morning turtle release, then climb the coastal hill towards Bankot Fort.",
        coordinates: { lat: 17.9618, lng: 73.0318 }
      }
    ],
    highlights: [
      "🐢 World-famous Olive Ridley Sea Turtle Conservation Village with guided sunrise hatchling releases",
      "🏛️ Birthplace of Nana Phadnavis, celebrated Prime Minister of the Maratha Empire",
      "🏖️ Unspoiled, peaceful golden sand beach completely free from commercial clutter",
      "🌲 Lush betel nut (सुपारी) and coconut orchards with traditional Konkani eco-homestays",
      "🍛 Wholesome, organic home-cooked Kokani village meals"
    ],
    fortAttractions: ["Olive Ridley Turtle Hatchery", "Nana Phadnavis Ancestral Memorial Wada", "Velas Beach & Estuary Walk", "Nearby Bankot Fort", "Bhairavnath Village Temple"],
    history: "Velas is a world-renowned ecological conservation village where villagers and the forest department protect the nesting grounds of endangered Olive Ridley sea turtles. It is also the historic ancestral birthplace of Nana Phadnavis (1742–1800), the legendary statesman who held the Maratha Empire together through diplomatic brilliance.",
    howToReach: {
      byTrain: "Mangaon (65 km) on Konkan Railway.",
      byBus: "MSRTC buses from Mandangad to Velas.",
      byRoad: "From Mumbai (215 km): NH66 to Mangaon ➔ Mandangad ➔ Velas (~5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Coastal Drive", description: "Board private AC trekking coach. Pickups across Mumbai. Drive towards Velas." },
      { day: 2, title: "06:00 AM – Velas Beach, Turtle Release & Heritage Trail", description: "06:00 AM: Arrive at Velas. 06:45 AM: Witness newly hatched baby turtles crawl into the ocean waves at sunrise. 08:30 AM: Traditional village breakfast. 09:30 AM - 12:00 PM: Visit Nana Phadnavis ancestral palace and coastal hill walk. 12:30 PM: Authentic home-cooked lunch. 02:30 PM: Visit Bankot Fort. 04:00 PM: Depart for Mumbai. 09:30 PM: Reach Mumbai." }
    ]
  },

  // ── 12. NIVTI FORT TO GOLDEN ROCK BEACH ──
  {
    slug: "nivti-beach-golden-rocks-trek",
    name: "Nivti Fort to Golden Rock Beach Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "510 km from Mumbai",
    maxAltitude: "55 m",
    elevation: "55 m",
    startPoint: "Kochra / Nivti Base",
    endPoint: "Kochra / Nivti Base",
    baseVillage: "Nivti (निवती, Vengurla, Sindhudurg)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "28°C", wind: "19 km/h Sea Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "22 km" },
    baseVillages: [
      {
        name: "Kochra (Nivti Beach)",
        marathiName: "कोचरा निवती (मुख्य पायथा)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "3.5 km",
        trailDuration: "2 Hours",
        popularFor: "Secluded headland fort walk, golden colored cliffs, dolphin spotting, and private beach lagoons",
        routeDescription: "Starts at Kochra-Nivti village. A trail across red laterite cliffs leads to ruined Nivti Fort ramparts overlooking the turquoise Bhogwe bay, descending to Golden Rock Beach.",
        coordinates: { lat: 15.9318, lng: 73.5383 }
      }
    ],
    highlights: [
      "🏝️ Secluded coastal fort ruins built by Chhatrapati Shivaji Maharaj on a dramatic ocean headland",
      "🌅 Golden Rocks: Mesmerizing golden-yellow sea cliffs glowing under the morning sun",
      "🐬 Regular dolphin sightings jumping in the quiet, sheltered turquoise bay",
      "🏖️ Hidden crescent beaches of Nivti and Bhogwe completely free from tourist crowds",
      "🍛 Authentic Vengurla Malvani home-style fish curry or vegetarian feast"
    ],
    fortAttractions: ["Nivti Fort Ocean Ramparts", "Golden Rock Sea Cliffs", "Bhogwe Beach Confluence View", "Ancient Stone Moat", "Natural Tide Pools"],
    history: "Nivti Fort was built by Chhatrapati Shivaji Maharaj in 1665 immediately after the construction of Sindhudurg Fort to secure the southern flank of the Maratha Navy and defend the trade passage to Vengurla and Goa.",
    howToReach: {
      byTrain: "Kudal (25 km) on Konkan Railway.",
      byBus: "Buses from Kudal to Kochra and Vengurla.",
      byRoad: "From Mumbai (510 km): Follow NH66 to Kudal ➔ Kochra-Nivti (~9 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Konkan Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive towards Kudal." },
      { day: 2, title: "06:30 AM – Nivti Base, Golden Rocks & Fort Walk", description: "06:30 AM: Arrive at Nivti. Breakfast with tea. 07:30 AM - 12:00 PM: Walk to Nivti fort ruins, admire golden cliffs, spot dolphins, and swim in calm lagoons. 12:30 PM: Authentic Malvani lunch. 02:00 PM: Relax at Bhogwe beach. 04:00 PM: Return drive to Mumbai. 11:30 PM: Arrive in Mumbai." }
    ]
  },

  // ── 13. KANAKDURG & FATTEHGAD ──
  {
    slug: "kanakdurg-fattehgad-coastal-walk",
    name: "Kanakdurg & Fattehgad Headland Watchtowers",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "230 km from Mumbai",
    maxAltitude: "30 m",
    elevation: "30 m",
    startPoint: "Harnai Lighthouse Base",
    endPoint: "Harnai Lighthouse Base",
    baseVillage: "Harnai (हर्णे, Dapoli)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "20 km/h Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "21 km" },
    baseVillages: [
      {
        name: "Harnai Port Promontory",
        marathiName: "हर्णे बंदर सुळका",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "2.0 km",
        trailDuration: "1.5 Hours",
        popularFor: "Twin headland watchtowers overlooking Suvarnadurg island and bustling fish market",
        routeDescription: "Starts at Harnai harbor. Walk along the rocky land bridge to the headland forts of Kanakdurg and Fattehgad, climbing to the lighthouse with birds-eye views of Suvarnadurg island.",
        coordinates: { lat: 17.8118, lng: 73.0912 }
      }
    ],
    highlights: [
      "🏰 Twin Shore Fortresses engineered by the Marathas to provide land-based cannon fire support to Suvarnadurg",
      "🗼 Harnai Coastal Lighthouse standing at the very tip of the rocky sea spur",
      "🌊 Incredible panoramic view of Suvarnadurg island fort surrounded by waves",
      "🐟 Experience the historic late afternoon beach fish auction at Harnai bunder",
      "🍛 Authentic Dapoli Konkani coastal meal with Solkadhi"
    ],
    fortAttractions: ["Kanakdurg Watch Bastions", "Fattehgad Ramparts", "Harnai Lighthouse", "Direct View of Suvarnadurg Island Fort", "Harnai Bunder Fish Market"],
    history: "Kanakdurg and Fattehgad are twin headland watchtowers constructed by the Marathas under Chhatrapati Shivaji Maharaj to form a synchronized defensive network protecting the naval shipyard of Suvarnadurg against foreign fleets.",
    howToReach: {
      byTrain: "Khed (45 km) on Konkan Railway.",
      byBus: "MSRTC buses from Khed to Dapoli and Harnai.",
      byRoad: "From Mumbai (230 km): Follow NH66 to Mangaon ➔ Mandangad ➔ Dapoli ➔ Harnai (~5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Coastal Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive to Harnai." },
      { day: 2, title: "06:00 AM – Harnai Base, Watchtowers & Coast Walk", description: "06:00 AM: Arrive at Harnai. Breakfast with tea. 07:15 AM - 11:30 AM: Tour Kanakdurg, Fattehgad, and the lighthouse with views of Suvarnadurg. 12:30 PM: Authentic Konkani lunch. 02:00 PM: Relax at Murud-Harnai beach. 04:00 PM: Depart for Mumbai. 10:00 PM: Reach Mumbai." }
    ]
  },

  // ── 14. TAMHINI GHAT WATERFALL TREK ──
  {
    slug: "tamhini-ghat-waterfall-trek",
    name: "Tamhini Ghat Waterfall Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "135 km from Mumbai",
    maxAltitude: "600 m",
    elevation: "600 m",
    startPoint: "Tamhini Village Base",
    endPoint: "Tamhini Village Base",
    baseVillage: "Tamhini (ताम्हिणी, Mulshi)",
    category: "waterfall",
    difficulty: "moderate",
    weatherStats: { temp: "22°C", wind: "18 km/h Mist Wind", rainProb: "30% Rain", uv: "UV 5", visibility: "16 km" },
    baseVillages: [
      {
        name: "Tamhini Ghat",
        marathiName: "ताम्हिणी घाट (धबधबा मार्ग)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "5.0 km",
        trailDuration: "3 Hours",
        popularFor: "Hiking along misty mountain streams, secret cascades, and the dramatic Plus Valley canyon rim",
        routeDescription: "Starts at Tamhini ridge. Trails pass through dense cloud forests, cross cascading streams, and lead to secret natural waterfall pools in the heart of the Western Ghats.",
        coordinates: { lat: 18.4818, lng: 73.4183 }
      }
    ],
    highlights: [
      "🌊 Hundreds of cascading silver monsoon waterfalls flowing through the misty Sahyadri valleys",
      "🌲 Deep subtropical rainforest canopy of the Tamhini Wildlife Sanctuary",
      "⛰️ Breathtaking viewpoints overlooking Plus Valley and the Kundalika river gorge",
      "🐸 Rich amphibian and butterfly biodiversity including endemic bush frogs",
      "🍛 Warm, comforting Maharashtrian village lunch with hot Bhakri and tea"
    ],
    fortAttractions: ["Secret Waterfall Plunge Pools", "Plus Valley Viewpoint", "Kundalika Gorge Valley", "Dense Cloud Forest Canopy", "Gushing Mountain Streams"],
    history: "Tamhini Ghat is one of the wettest places in India, receiving over 6,000 mm of annual monsoon rainfall. The mountain pass historically served as a rugged trade trail connecting the high Deccan plateau of Pune with the Konkan port of Mangaon.",
    howToReach: {
      byTrain: "Pune (65 km) or Mangaon (45 km).",
      byBus: "Buses from Pune (Swargate) towards Mangaon pass through Tamhini.",
      byRoad: "From Mumbai (135 km): Drive via Mumbai-Pune Expressway ➔ Chandani Chowk (Pune) ➔ Mulshi Dam ➔ Tamhini Ghat (~3 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive towards Mulshi/Tamhini." },
      { day: 2, title: "05:00 AM – Tamhini Base, Waterfall Trails & Return", description: "05:00 AM: Arrive at base. Hot breakfast with tea. 06:15 AM - 12:00 PM: Trek through misty mountain streams, swim in safe waterfall pools, and explore Plus Valley rim. 01:00 PM: Delicious village lunch. 03:00 PM: Return drive to Mumbai. 08:30 PM: Reach Mumbai." }
    ]
  },

  // ── 15. PRACHITGAD WILD SANCTUARY TREK ──
  {
    slug: "prachitgad-wild-sanctuary-trek",
    name: "Prachitgad Deep Forest Wildlife Trail",
    price: 1499,
    advanceAmount: 750,
    duration: "2 days 1 night",
    distance: "320 km from Mumbai",
    maxAltitude: "1,180 m (3,870 ft)",
    elevation: "1,180 m (3,870 ft)",
    startPoint: "Shringarpudur / Tivare Base",
    endPoint: "Shringarpudur / Tivare Base",
    baseVillage: "Shringarpudur (शृंगारपूर, Sangameshwar)",
    category: "forest",
    difficulty: "challenging",
    weatherStats: { temp: "21°C", wind: "16 km/h Wind", rainProb: "15% Rain", uv: "UV 6", visibility: "18 km" },
    baseVillages: [
      {
        name: "Shringarpudur (via Sangameshwar)",
        marathiName: "शृंगारपूर (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Challenging (Deep Forest & Mountain Ridge)",
        distanceFromBase: "12.0 km",
        trailDuration: "6 Hours",
        popularFor: "Wilderness expedition through the core of Koyna Wildlife Sanctuary & Sahyadri Tiger Reserve",
        routeDescription: "Starts at Shringarpudur village. Climbs through pristine, dense tiger-inhabited semi-evergreen forest and steep rock ridges, entering Prachitgad through ancient stone gates.",
        coordinates: { lat: 17.2318, lng: 73.7183 }
      }
    ],
    highlights: [
      "🐅 Core Wilderness Trail through the pristine Koyna Wildlife Sanctuary & Sahyadri Tiger Reserve",
      "🏰 Ancient fortress built by the Shilaharas and captured by Shivaji Maharaj in 1660",
      "🌊 Stunning birds-eye views of the backwaters of Koyna Dam (Shivsagar Lake) and the Konkan drop",
      "🚪 Formidable rock-cut bastions, cannon storehouses, and perennial water springs",
      "🍛 Authentic rural forest village feast cooked on wood fires"
    ],
    fortAttractions: ["Ancient Stone Fortification Walls", "Cannon Battery Bastions", "Deep Koyna Wildlife Sanctuary Forest", "Koyna Dam Backwaters Panorama", "Rock-cut Water Cisterns"],
    history: "Prachitgad (meaning 'Fort of Proof') was constructed in the 12th century by Raja Bhoj II. Captured by Chhatrapati Shivaji Maharaj in 1660 during the conquest of Sangameshwar and Prabhavali, Maharaj extensively repaired its ramparts to serve as an isolated mountain fortress deep within the Western Ghats jungle.",
    howToReach: {
      byTrain: "Sangameshwar Road (25 km) on Konkan Railway.",
      byBus: "Buses from Sangameshwar to Shringarpudur.",
      byRoad: "From Mumbai (320 km): Follow NH66 to Sangameshwar ➔ Shringarpudur (~6.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Drive", description: "Board private AC trekking coach. Pickups across Mumbai. Drive along NH66 to Sangameshwar." },
      { day: 2, title: "05:00 AM – Shringarpudur Base, Forest Expedition & Return", description: "05:00 AM: Reach base. Breakfast and safety briefing. 06:00 AM - 01:00 PM: Trek deep through the wildlife sanctuary, explore Prachitgad ruins and Koyna lake views. 02:00 PM: Mountain top packed lunch. 04:00 PM: Return to base. 06:00 PM: Village dinner. 07:00 PM: Depart for Mumbai. 02:00 AM: Arrive in Mumbai." }
    ]
  },

  // ── 16. SUMARGAD CITADEL CLIMB ──
  {
    slug: "sumargad-citadel-climb",
    name: "Sumargad Rock Citadel Ascent",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "235 km from Mumbai",
    maxAltitude: "880 m (2,887 ft)",
    elevation: "880 m (2,887 ft)",
    startPoint: "Wadi Beldar / Mahipatgad Col",
    endPoint: "Wadi Beldar / Mahipatgad Col",
    baseVillage: "Wadi Beldar (वाडी बेलदार, Khed)",
    category: "fort",
    difficulty: "challenging",
    weatherStats: { temp: "23°C", wind: "20 km/h Wind", rainProb: "15% Rain", uv: "UV 6", visibility: "19 km" },
    baseVillages: [
      {
        name: "Wadi Beldar",
        marathiName: "वाडी बेलदार (कातळ सुळका मार्ग)",
        isPrimary: true,
        difficulty: "Challenging (Narrow Knife-Edge Ridge)",
        distanceFromBase: "5.0 km",
        trailDuration: "3.5 Hours",
        popularFor: "Knife-edge ridge scramble to the sheer rocky citadel situated between Mahipatgad and Rasalgad",
        routeDescription: "Starts at Wadi Beldar. Traverses the ridge from Mahipatgad col, ascends an exposed rocky cleft with safety ropes, and enters onto the compact summit plateau of Sumargad.",
        coordinates: { lat: 17.7518, lng: 73.5412 }
      }
    ],
    highlights: [
      "🗡️ Dramatic Knife-Edge Ridge Scramble with sheer drops into the Konkan valleys on both sides",
      "🏰 Natural Rock Citadel serving as the central link between sister forts Mahipatgad and Rasalgad",
      "🛕 Rock-Cut Cave & cool perennial freshwater cisterns",
      "🦅 Breathtaking 360-degree vistas over the Jagbudi river valley and Sahyadri mountain folds",
      "🍛 Hearty local village meal at Wadi Beldar base"
    ],
    fortAttractions: ["Narrow Rock Ridge Trail", "Rock-Cut Cave Shelter", "Ancient Water Tanks", "Views of Mahipatgad & Rasalgad", "Exposed Rock Chimney Scramble"],
    history: "Sumargad was built as the central watchtower connecting the massive tableland of Mahipatgad with the lower fortress of Rasalgad. Because of its sheer, vertical drop-offs on all four sides, it was naturally inaccessible and required only a handful of Maratha guards to hold against an entire army.",
    howToReach: {
      byTrain: "Khed (35 km) on Konkan Railway.",
      byBus: "Buses from Khed depot to Wadi Beldar.",
      byRoad: "From Mumbai (235 km): Follow NH66 to Khed ➔ Wadi Beldar (~5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive to Khed." },
      { day: 2, title: "05:00 AM – Wadi Beldar Base, Citadel Climb & Return", description: "05:00 AM: Arrive at base. Breakfast with tea. 06:15 AM: Trek up the ridge. 08:30 AM: Scramble up the rock cleft to Sumargad summit. 09:00 AM - 11:30 AM: Explore cave, cisterns, and enjoy valley views. 12:00 PM: Descend to base. 01:30 PM: Authentic rustic village lunch. 03:30 PM: Return drive to Mumbai. 10:00 PM: Reach Mumbai." }
    ]
  },

  // ── 17. KOKAN KADA RIDGE WALK ──
  {
    slug: "kokan-kada-ridge-walk",
    name: "Kokan Kada Ridge Walk",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "165 km from Mumbai",
    maxAltitude: "1,424 m (4,670 ft)",
    elevation: "1,424 m (4,670 ft)",
    startPoint: "Pachnai Base Village",
    endPoint: "Pachnai Base Village",
    baseVillage: "Pachnai (पाचनाई, Akole, Ahmednagar)",
    category: "forest",
    difficulty: "moderate",
    weatherStats: { temp: "20°C", wind: "24 km/h Mountain Wind", rainProb: "15% Rain", uv: "UV 6", visibility: "22 km" },
    baseVillages: [
      {
        name: "Pachnai",
        marathiName: "पाचनाई (थेट कोकण कडा मार्ग)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "5.5 km",
        trailDuration: "3 Hours",
        popularFor: "Scenic route directly reaching the world-famous concave cliff of Kokan Kada",
        routeDescription: "Starts at Pachnai village. Climbs through waterfalls and iron ladders onto the high plateau, heading directly along the edge of the monumental concave cliff amphitheater.",
        coordinates: { lat: 19.3983, lng: 73.7818 }
      }
    ],
    highlights: [
      "🪂 World-Famous Concave Cliff: 1,800 ft sheer concave cliff hanging over the Konkan plains",
      "🌪️ The Reverse Waterfall Phenomenon: Powerful upward air currents blowing waterfall spray straight up into the sky",
      "🌈 Circular Rainbow (Brocken Spectre) frequently visible in the morning mist over the cliff",
      "🛕 Visit to 6th-century Kedareshwar Cave with its sacred four-pillar Shiva Lingam",
      "🍛 Warm, authentic village feast with local Pithla Bhakri and Thecha"
    ],
    fortAttractions: ["Kokan Kada 1,800-ft Concave Cliff", "Reverse Waterfall Wind Vent", "Kedareshwar Cave Temple", "Taramati Peak Summit View", "Ancient Stone Cisterns"],
    history: "Kokan Kada ('The Konkan Cliff') is one of the most astonishing geological wonders in Asia. A massive semicircular concave basalt cliff with an overhang that drops over 1,800 vertical feet, it creates a unique microclimate where updrafts from the Konkan plains throw mist and water hundreds of feet up into the air.",
    howToReach: {
      byTrain: "Kasara (80 km) or Igatpuri (70 km).",
      byBus: "Buses from Otur, Alephata, or Ghoti to Pachnai.",
      byRoad: "From Mumbai (165 km): Drive via NH61 via Malshej Ghat ➔ Otur ➔ Kotul ➔ Pachnai (~4.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Scenic Malshej Route", description: "Board private AC trekking coach. Pickups across Mumbai. Drive via Malshej Ghat." },
      { day: 2, title: "05:00 AM – Pachnai Base, Kokan Kada Ridge Walk & Return", description: "05:00 AM: Arrive at Pachnai. Breakfast with tea. 06:00 AM: Ascend to plateau. 08:30 AM - 12:00 PM: Experience the roaring updrafts of Kokan Kada cliff and visit Kedareshwar cave temple. 12:30 PM: Descend to Pachnai. 02:00 PM: Village feast. 03:30 PM: Depart for Mumbai. 09:30 PM: Reach Mumbai." }
    ]
  },

  // ── 18. SINDHUDURG COASTAL TREK ──
  {
    slug: "sindhudurg-coastal-trek",
    name: "Sindhudurg Coastal Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "490 km from Mumbai",
    maxAltitude: "20 m",
    elevation: "20 m",
    startPoint: "Tarkarli / Malvan",
    endPoint: "Tarkarli / Malvan",
    baseVillage: "Tarkarli (तारकर्ली, Malvan)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: { temp: "28°C", wind: "18 km/h Ocean Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "22 km" },
    baseVillages: [
      {
        name: "Tarkarli Beach",
        marathiName: "तारकर्ली बीच (तटीय मार्ग)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "5.0 km coastal walk",
        trailDuration: "2.5 Hours",
        popularFor: "Crystal clear water, Karli river estuary, white sand beach, and scuba/snorkeling marine walk",
        routeDescription: "Starts at Tarkarli beach. Follows the pristine coastline past Devbagh sangam, exploring marine tide pools, sand spits, and the Karli backwaters.",
        coordinates: { lat: 16.0318, lng: 73.4912 }
      }
    ],
    highlights: [
      "🌊 Crystal Clear White Sand Coast: Transparent waters revealing living coral reefs and marine life",
      "🏖️ Devbagh Sangam: Where the Karli River backwaters meet the rolling Arabian Sea",
      "🤿 Snorkeling and marine life discovery along pristine Konkan reefs",
      "⛵ Houseboat cruise through lush mangrove backwater lagoons",
      "🍛 World-renowned authentic Malvani seafood thali with Solkadhi"
    ],
    fortAttractions: ["Tarkarli White Sand Beach", "Devbagh River-Sea Sangam", "Tsunami Island Marine Spits", "Karli Mangrove Lagoon", "Nearby Sindhudurg Sea Fort"],
    history: "Tarkarli and the Karli creek have been central to Malvani coastal life and Maratha naval history for centuries, serving as a sheltered anchorage for small warships and trade vessels navigating the Konkan coast.",
    howToReach: {
      byTrain: "Kudal (32 km) or Kankavli (48 km) on Konkan Railway.",
      byBus: "Direct MSRTC buses from Mumbai and Pune to Malvan.",
      byRoad: "From Mumbai (490 km): Follow NH66 via Chiplun and Kankavli ➔ Malvan ➔ Tarkarli (~9 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive to Tarkarli." },
      { day: 2, title: "06:30 AM – Tarkarli Base, Coastal Trail & Sangam Walk", description: "06:30 AM: Arrive at Tarkarli. Breakfast with tea. 07:30 AM - 12:00 PM: Coastal beach walk to Devbagh Sangam, boat ride to Tsunami island, and coral reef exploration. 12:30 PM: Lavish Malvani lunch. 02:30 PM: Relax on beach. 04:30 PM: Return drive to Mumbai. 11:30 PM: Arrive in Mumbai." }
    ]
  },

  // ── 19. AMBOLI SUNSET & NIGHT TRAIL ──
  {
    slug: "amboli-sunset-night-trek",
    name: "Amboli Sunset Night Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "490 km from Mumbai",
    maxAltitude: "690 m (2,260 ft)",
    elevation: "690 m (2,260 ft)",
    startPoint: "Amboli Hill Station Base",
    endPoint: "Amboli Hill Station Base",
    baseVillage: "Amboli (आंबोली, Sawantwadi, Sindhudurg)",
    category: "night",
    difficulty: "easy",
    weatherStats: { temp: "21°C", wind: "14 km/h Mist Breeze", rainProb: "20% Rain", uv: "UV 6", visibility: "19 km" },
    baseVillages: [
      {
        name: "Amboli Village",
        marathiName: "आंबोली घाट (निसर्ग पायवाट)",
        isPrimary: true,
        difficulty: "Easy to Moderate",
        distanceFromBase: "4.0 km",
        trailDuration: "2 Hours",
        popularFor: "Queen of the Sahyadris, famous glowing bio-luminescent night walks, rare frogs, and sunset cliffs",
        routeDescription: "Starts at Amboli. Trails explore the dense rainforest, the source of Hiranyakeshi River, and the cliff-edge Sunset Point overlooking the Konkan drop.",
        coordinates: { lat: 15.9618, lng: 73.9983 }
      }
    ],
    highlights: [
      "🐸 Bio-Diversity Capital: Home to rare endemic Malabar Gliding Frogs, pit vipers, and bioluminescent fungi",
      "🌅 Golden Sunset Point with breathtaking views over the deep Western Ghats valleys",
      "🛕 Sacred Hiranyakeshi Shiva Temple in a cave at the origin of the Hiranyakeshi River",
      "🌊 Majestic Amboli Waterfall cascading down high roadside cliffs",
      "🍛 Authentic Malvani-Konkani hill station feast with local spices"
    ],
    fortAttractions: ["Amboli Waterfall", "Hiranyakeshi River Cave Temple", "Sunset Point & Valley Views", "Bioluminescent Forest Night Trail", "Mahadevgad Fort Ruins"],
    history: "Amboli is a tranquil hill station nestled at 2,260 ft in the southern Sahyadris. Known as the 'Cherrapunji of Maharashtra' due to its extreme annual rainfall (7,500 mm), it was established by the British as a convalescent outpost and preserves some of the richest biodiversity in the Western Ghats.",
    howToReach: {
      byTrain: "Sawantwadi Road (30 km) on Konkan Railway.",
      byBus: "Regular buses from Sawantwadi, Kolhapur, and Belgaum to Amboli.",
      byRoad: "From Mumbai (490 km): Drive along NH48 via Kolhapur ➔ Nipani ➔ Amboli Ghat (~9 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive via Kolhapur to Amboli." },
      { day: 2, title: "06:30 AM – Amboli Base, Rainforest Walks & Sunset Experience", description: "06:30 AM: Arrive at Amboli. Breakfast with tea. 07:30 AM - 12:00 PM: Explore Hiranyakeshi temple cave, forest waterfall, and Mahadevgad ruins. 01:00 PM: Authentic Malvani lunch. 03:00 PM - 06:30 PM: Guided biodiversity walk and sunset at Sunset Point. 07:30 PM: Village dinner. 08:30 PM: Depart for Mumbai. 05:00 AM: Reach Mumbai." }
    ]
  },

  // ── 20. RATNAGIRI VILLAGE HERITAGE WALK ──
  {
    slug: "ratnagiri-village-heritage-walk",
    name: "Ratnagiri Village Heritage Walk",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "330 km from Mumbai",
    maxAltitude: "50 m",
    elevation: "50 m",
    startPoint: "Ratnagiri Town Base",
    endPoint: "Ratnagiri Town Base",
    baseVillage: "Ratnagiri (रत्नागिरी, Konkan)",
    category: "village",
    difficulty: "easy",
    weatherStats: { temp: "27°C", wind: "16 km/h Breeze", rainProb: "10% Rain", uv: "UV 7", visibility: "22 km" },
    baseVillages: [
      {
        name: "Ratnagiri City",
        marathiName: "रत्नागिरी शहर व किल्ला",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "4.0 km heritage walk",
        trailDuration: "2.5 Hours",
        popularFor: "Historic walk through Ratnadurg fort, Thibaw Palace, Lokmanya Tilak memorial, and Bhatye beach",
        routeDescription: "Starts at Ratnadurg Fort on the coastal cliff. Walk along the horse-shoe shaped marine fortress, visit Bhagwati Temple, Thibaw Palace, and conclude at Bhatye beach.",
        coordinates: { lat: 16.9918, lng: 73.3018 }
      }
    ],
    highlights: [
      "🏰 Magnificent Horseshoe-shaped Ratnadurg Fort with three sides surrounded by the Arabian Sea",
      "🏛️ Historic Thibaw Palace: Royal exile palace of King Thibaw, the last king of Burma (Myanmar)",
      "🚩 Birthplace Memorial of Lokmanya Bal Gangadhar Tilak, father of the Indian freedom movement",
      "🏖️ Scenic sunset stroll on the vast black sand beach of Bhatye and Mandvi gate",
      "🍛 World-renowned Ratnagiri Alphonso mango delicacies and authentic coastal food"
    ],
    fortAttractions: ["Ratnadurg Horseshoe Fortress & Light Tower", "Bhagwati Mata Temple", "Thibaw Palace Museum", "Lokmanya Tilak Birthplace Memorial", "Bhatye Coastal Promenade"],
    history: "Ratnagiri is the cultural heart of the Konkan coast. Its coastal citadel Ratnadurg (Bhagwati Fort) was built by the Bahmanis and fortified by Chhatrapati Shivaji Maharaj in 1670. Ratnagiri holds deep historical significance as the birthplace of freedom fighter Lokmanya Tilak and the place of royal exile for King Thibaw of Burma.",
    howToReach: {
      byTrain: "Ratnagiri Junction on Konkan Railway (major railway halt).",
      byBus: "Regular luxury and state transport buses connect Mumbai and Pune to Ratnagiri.",
      byRoad: "From Mumbai (330 km): Follow NH66 via Chiplun to Ratnagiri (~6.5 hrs)."
    },
    itinerary: [
      { day: 1, title: "10:00 PM – Mumbai Departure & Overnight Transit", description: "Board private AC trekking coach. Pickups across Mumbai. Drive along NH66 to Ratnagiri." },
      { day: 2, title: "06:00 AM – Ratnagiri Base, Heritage Circuit & Return", description: "06:00 AM: Arrive at Ratnagiri. Breakfast with tea. 07:15 AM - 12:00 PM: Explore Ratnadurg fort, Bhagwati temple, Thibaw Palace, and Lokmanya Tilak memorial. 12:30 PM: Lavish authentic Ratnagiri lunch with Solkadhi. 02:00 PM: Relax at Bhatye beach. 03:30 PM: Depart for Mumbai. 10:30 PM: Reach Mumbai." }
    ]
  }
];

async function updatePart5() {
  console.log(`Starting real data update for Part 5 (${TREKS_REAL_DATA_PART5.length} forts/treks)...`);
  let updatedCount = 0;

  for (const trek of TREKS_REAL_DATA_PART5) {
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

  console.log(`\nPart 5 complete! Successfully updated ${updatedCount} treks in Firestore with Durg-style rich real data!`);
}

updatePart5().catch(console.error).finally(() => process.exit(0));

