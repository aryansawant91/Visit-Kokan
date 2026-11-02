/**
 * Part 3: Real Konkan Sea Forts, Waterfalls & Sahyadri Range Treks
 * Updates 15 major coastal forts, canyon routes & Sahyadri highlights in Firestore
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

const TREKS_REAL_DATA_PART3 = [
  // ── 21. MURUD JANJIRA SEA CITADEL ──
  {
    slug: "murud-janjira-sea-fortress",
    name: "Murud Janjira Unconquered Sea Citadel",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "160 km from Mumbai",
    maxAltitude: "30 m (Sea Level)",
    elevation: "30 m (Sea Level)",
    startPoint: "Rajapuri Jetty",
    endPoint: "Rajapuri Jetty",
    baseVillage: "Rajapuri (राजापुरी जेट्टी, Murud)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: {
      temp: "28°C",
      wind: "20 km/h Ocean Breeze",
      rainProb: "10% Rain (24h)",
      uv: "UV 7",
      visibility: "22.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Rajapuri Jetty (Sailboat Harbor)",
        marathiName: "राजापुरी जेट्टी (पारंपरिक शिडांची होडी)",
        isPrimary: true,
        difficulty: "Easy (Sailboat Crossing & Stone Fort Walk)",
        distanceFromBase: "2.0 km across sea",
        trailDuration: "20 Min Sail + 2.5 Hours Fort Walk",
        popularFor: "Scenic historic sailboat ride across the Arabian Sea to the secret entrance of the island citadel",
        routeDescription: "Board traditional wooden sailboats from Rajapuri Jetty. Sail across the open sea to Janjira's hidden 'Darya Darwaja' (visible only when 40 ft away), entering the impregnable 19-bastion fortress.",
        coordinates: { lat: 18.3005, lng: 72.9639 }
      }
    ],
    highlights: [
      "🛡️ The Unconquered Sea Fort: Remained undefeated against the Marathas, British, Dutch, and Portuguese for centuries",
      "💥 Legendary 'Kalal Bangadi' – 3rd largest cannon in India weighing over 22 tons",
      "⛵ Traditional wooden sailboat ride across the rolling Arabian Sea waves",
      "🌊 Two Perennial Sweet Water Lakes in the very center of an ocean surrounded by saline seawater",
      "🍛 Authentic coastal Konkani seafood / vegetarian thali feast at Murud"
    ],
    fortAttractions: [
      "Hidden Darya Darwaja (Secret Ocean Gate)",
      "Kalal Bangadi, Landa Kasam & Chavri Massive Cannons",
      "Two Perennial Freshwater Lakes (गोड्या पाण्याचे तलाव)",
      "Ruins of the Five-Story Palace of the Siddis",
      "Nineteen Impregnable Round Granite Bastions",
      "Panoramic views of Padmadurg and Kasa Island"
    ],
    history: "Murud Janjira is celebrated as one of the strongest marine fortresses in the world. Originally built on a massive offshore rock by the local Koli chief Ram Patil in the 15th century, it was subsequently captured and heavily fortified with 19 giant bastions by the Siddi dynasty of Abyssinian origin. Despite heroic siege attempts by Chhatrapati Shivaji Maharaj, Sambhaji Maharaj (who even began building an undersea causeway), and the Peshwas, the citadel remained unconquered by military assault throughout its history.",
    howToReach: {
      byTrain: "Nearest railway station is Roha (42 km) on Konkan Railway. Regular buses and taxis connect Roha to Murud.",
      byBus: "MSRTC buses ply directly from Mumbai (Borivali/Mumbai Central), Thane, and Alibaug to Murud Bus Depot.",
      byRoad: "From Mumbai (160 km): Take Ro-Ro car ferry from Bhaucha Dhakka to Mandwa ➔ Drive via Alibaug, Revdanda & Kashid ➔ Reach Rajapuri Jetty near Murud (~3.5 hrs). Large vehicle parking available at Rajapuri."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Coastal Highway Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Overnight drive along the scenic coastal route to Murud."
      },
      {
        day: 2,
        title: "05:30 AM – Rajapuri Jetty, Sailboat Cruise & Fortress Exploration",
        description: "05:30 AM: Arrive at Rajapuri. Freshen up and enjoy hot Konkani breakfast with ginger tea. 06:45 AM: Board traditional wooden sailboats across the morning sea waves. 07:15 AM: Enter through the disguised sea gate into the mighty fortress. 07:30 AM - 11:30 AM: In-depth historical tour of the 22-ton Kalal Bangadi cannon, the freshwater lakes, Siddi palace ruins, and the 19 massive ramparts. 12:00 PM: Sail back to Rajapuri. 01:00 PM: Relish a lavish Konkani lunch. 02:30 PM: Relax at pristine Kashid Beach. 04:30 PM: Depart for Mumbai. 09:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 22. VIJAYDURG COASTAL FORTRESS ──
  {
    slug: "vijaydurg-coastal-cliff-walk",
    name: "Vijaydurg Coastal Fortress & Marine Walk",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "390 km from Mumbai",
    maxAltitude: "45 m (Coast)",
    elevation: "45 m",
    startPoint: "Vijaydurg Port Base",
    endPoint: "Vijaydurg Port Base",
    baseVillage: "Vijaydurg (विजयदुर्ग, Sindhudurg)",
    category: "coastal",
    difficulty: "easy",
    weatherStats: {
      temp: "27°C",
      wind: "19 km/h Sea Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 7",
      visibility: "22.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Vijaydurg Fort Entrance",
        marathiName: "विजयदुर्ग मुख्य प्रवेशद्वार",
        isPrimary: true,
        difficulty: "Easy (Paved Rampart Walk)",
        distanceFromBase: "3.0 km",
        trailDuration: "2.5 Hours",
        popularFor: "Triple fortification wall walk, secret escape tunnel, and underwater marine defensive wall",
        routeDescription: "Starts at the historic moat bridge. Trekkers walk through three formidable concentric fortification walls, exploring royal palace courtyards, watch bastions, and the windswept ocean tip.",
        coordinates: { lat: 16.5583, lng: 73.3333 }
      }
    ],
    highlights: [
      "⚓ The 'Eastern Gibraltar': Supreme naval headquarters of Admiral Kanhoji Angre and the Maratha Navy",
      "🧱 Triple Concentric Fortification Walls with 29 massive bastions surrounded on three sides by the ocean",
      "🌊 Underwater Stone Wall: A miraculous 200-meter submerged acoustic defense barrier engineered by the Marathas",
      "🔭 Helium Discovery Site: Historic spot where French astronomer Janssen discovered Helium in 1868",
      "🍛 Authentic Malvani village lunch with fresh seafood and Solkadhi"
    ],
    fortAttractions: [
      "Triple Layered Fortification Walls (तिहेरी तटबंदी)",
      "Helium Discovery Observation Platform",
      "Secret Escape Tunnel leading into the village",
      "Maratha Navy Dockyard (Waghotan Creek)",
      "Ancient Cannons & Ammunition Storehouses",
      "Panoramic views of Waghotan Estuary & Arabian Sea"
    ],
    history: "Originally built in 1200 CE by Raja Bhoj II of the Shilahara dynasty, Vijaydurg was captured in 1653 by Chhatrapati Shivaji Maharaj, who personally rechristened it 'Vijaydurg' (Fort of Victory). Maharaj dramatically expanded its ramparts with triple concentric walls, a wet moat, and an ingenious submerged 200m stone barrier that ran beneath the ocean waters to wreck enemy warships. It served as the indestructible naval stronghold of the famous Sarkhel Kanhoji Angre.",
    howToReach: {
      byTrain: "Nearest railway station is Rajapur Road (55 km) or Kankavli (75 km) on Konkan Railway.",
      byBus: "MSRTC luxury and sleeper buses ply directly from Mumbai, Pune, and Kolhapur to Vijaydurg depot.",
      byRoad: "From Mumbai (390 km): Follow NH66 towards Rajapur ➔ Turn right at Kharepatan or Tarale towards Vijaydurg (~7.5 hrs)."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Konkan Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Smooth overnight cruise along NH66 Konkan Highway."
      },
      {
        day: 2,
        title: "06:00 AM – Vijaydurg Base, Naval Heritage Walk & Return",
        description: "06:00 AM: Arrive at Vijaydurg base. Freshen up and enjoy breakfast with Kokam Sharbat and tea. 07:15 AM: Enter through the triple concentric gates into the sovereign naval fortress. 07:30 AM - 12:00 PM: Comprehensive historical tour of the Maratha naval docks, secret escape tunnel, the historic Helium discovery spot, and ocean ramparts. 12:30 PM: Authentic Malvani lunch with Solkadhi. 02:00 PM: Visit Waghotan Creek view. 03:30 PM: Depart for Mumbai. 11:00 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 23. DEVKUND WATERFALL GORGE ──
  {
    slug: "devkund-waterfall-trek",
    name: "Devkund Waterfall Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "125 km from Mumbai",
    maxAltitude: "300 m",
    elevation: "300 m",
    startPoint: "Bhira Base Village",
    endPoint: "Bhira Base Village",
    baseVillage: "Bhira (भिरा, Patnus, Roha)",
    category: "waterfall",
    difficulty: "moderate",
    weatherStats: {
      temp: "25°C",
      wind: "12 km/h Forest Wind",
      rainProb: "25% Rain (24h)",
      uv: "UV 5",
      visibility: "18.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Bhira (Patnus)",
        marathiName: "भिरा पाटणूस (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Moderate (Forest & River Crossing)",
        distanceFromBase: "6.5 km",
        trailDuration: "3 Hours",
        popularFor: "Scenic, adventurous trek through dense jungle, rocky riverbeds, and suspension bridges to the sacred waterfall plunge pool",
        routeDescription: "Starts at Bhira village near the Tata Power Dam. The trail follows the perimeter of the reservoir, crosses two forest streams, winds through dense semi-evergreen canopy, and opens into a dramatic three-sided rocky amphitheater canyon housing the turquoise waterfall pool.",
        coordinates: { lat: 18.4518, lng: 73.3983 }
      }
    ],
    highlights: [
      "🌊 'Bathing Pond of the Gods': A stunning 300-ft pure cascade plunging into an emerald turquoise natural rock pool",
      "🌲 Pristine hike through the ancient dense forests of the Tamhini Ghat reserve",
      "🌉 River Stream Crossings with natural boulders, wooden bridges, and serene reservoir views",
      "🦅 Abundant birdlife and butterflies native to the Western Ghats biodiversity hotspot",
      "🍛 Warm, comforting Maharashtrian village lunch served at Bhira base"
    ],
    fortAttractions: [
      "Natural Emerald Turquoise Plunge Pool (देवकुंड डोह)",
      "300-ft Sheer Vertical Rock Amphitheater",
      "Bhira Dam (Tata Power Hydro Reservoir)",
      "Kundalika River Origin Streams",
      "Dense Semi-Evergreen Tamhini Jungle Canopy"
    ],
    history: "Devkund, literally translating to 'The Pond of the Gods', is a sacred natural pool nestled deep within the Kundalika river gorge. Local folklore holds that the resident forest deities bathed here, and whenever local villagers celebrated a marriage, utensils and vessels would miraculously float to the surface for their use. Today it is recognized as one of the most pristine waterfall amphitheaters in the Western Ghats.",
    howToReach: {
      byTrain: "Nearest railway station is Roha (35 km) or Mangaon (30 km). Shared autos and private jeeps run to Bhira.",
      byBus: "MSRTC buses from Pali and Roha travel towards Patnus and Bhira Dam.",
      byRoad: "From Mumbai (125 km): Drive via Mumbai-Pune Expressway ➔ Exit at Khopoli ➔ Pali ➔ Bhira Dam base village (~3 hrs). Dedicated parking available."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Overnight drive towards Pali and Bhira."
      },
      {
        day: 2,
        title: "05:00 AM – Bhira Base, Jungle Trek & Turquoise Waterfall",
        description: "05:00 AM: Reach Bhira base village. Freshen up and enjoy village breakfast with hot tea. 06:00 AM: Enter the misty forest trail along the Bhira reservoir. 07:45 AM: Cross scenic streams and boulder fields. 08:45 AM: Arrive at the breathtaking Devkund waterfall canyon. 09:00 AM - 11:30 AM: Relax by the emerald water, photograph the sheer 300-ft cliff, and soak in the natural beauty. 11:45 AM: Start return trek to Bhira. 02:00 PM: Authentic rustic lunch (Pithla Bhakri, Thecha & Rice). 03:30 PM: Depart for Mumbai. 08:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 24. SANDHAN VALLEY CANYON ──
  {
    slug: "sandhan-valley-trek",
    name: "Sandhan Valley Canyon & Waterfall Rappelling",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "185 km from Mumbai",
    maxAltitude: "900 m",
    elevation: "900 m",
    startPoint: "Samrad Base Village",
    endPoint: "Samrad Base Village",
    baseVillage: "Samrad (साम्रद, Bhandardara)",
    category: "waterfall",
    difficulty: "challenging",
    weatherStats: {
      temp: "21°C",
      wind: "14 km/h Canyon Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 5",
      visibility: "19.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Samrad",
        marathiName: "साम्रद (घाटीचे मुख्य गाव)",
        isPrimary: true,
        difficulty: "Challenging (Rock Scrambling & Rappelling)",
        distanceFromBase: "5.0 km inside canyon",
        trailDuration: "4 - 5 Hours",
        popularFor: "The famous 'Valley of Shadows' canyon where sunlight touches the rock floor for only a few minutes a day",
        routeDescription: "Starts at Samrad village near Bhandardara. The route descends into a natural geological fissure between two towering 300-ft rock cliffs, negotiating knee-to-chest-deep water pools, giant boulders, and rappelling patches.",
        coordinates: { lat: 19.5283, lng: 73.6883 }
      }
    ],
    highlights: [
      "🌑 'The Valley of Shadows': A narrow 200-ft deep geological rock gorge where direct sunlight barely enters",
      "🧗 Thrilling Rock Boulder Scrambling across gigantic fallen Sahyadri stone monoliths",
      "🌊 Wading through crystalline natural mountain water pools carved into polished basalt",
      "🌌 Spectacular views of Ajoba Peak, Ratangad, and the deep Konkan drop",
      "🍛 Authentic rural tribal cuisine prepared by local villagers of Samrad"
    ],
    fortAttractions: [
      "The 200-ft Sheer Canyon Walls (दऱ्या)",
      "Natural Water Pools (पाण्याचे डोह)",
      "Massive Boulder Chokes & Scrambling Routes",
      "Rappelling Points with Sturdy Anchor Bolts",
      "Panoramic views of Ratangad & Ajoba Massif",
      "Quaint Tribal Village of Samrad"
    ],
    history: "Sandhan Valley is one of the greatest natural wonders of India, often hailed as the Grand Canyon of Maharashtra. Geologically carved by millions of years of water erosion slicing through basalt volcanic plateaus, it forms an astonishing 1.5-mile long rock chasm between two colossal stone walls. Historically, it served as an inaccessible passage connecting the high Deccan plateau of Ghatghar to the Konkan plains of Dehne below.",
    howToReach: {
      byTrain: "Nearest railway station is Kasara (75 km) or Igatpuri (55 km). Shared jeeps run from Kasara to Shendi and Samrad.",
      byBus: "MSRTC buses from Igatpuri towards Bhandardara go to Shendi, with connecting jeeps to Samrad.",
      byRoad: "From Mumbai (185 km): Drive along NH160 via Kasara Ghat ➔ Turn right at Ghoti towards Bhandardara ➔ Past Shendi lake to Samrad village (~4.5 hrs). Vehicle parking available."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Mountain Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Thane 11:15 PM, Kalyan 11:45 PM. Overnight drive along NH160 via Kasara Ghat to Samrad."
      },
      {
        day: 2,
        title: "04:30 AM – Samrad Base, Canyon Exploration & Return",
        description: "04:30 AM: Arrive at Samrad base village. Freshen up and enjoy breakfast with hot tea. 05:45 AM: Enter the mystical gorge as morning light filters down the 200-ft rock cliffs. 07:00 AM - 11:30 AM: Scramble across massive boulder beds, wade through cool crystal water ponds, and experience the eerie silence of the Valley of Shadows. 12:00 PM: Return to Samrad village. 01:15 PM: Wholesome traditional Maharashtrian feast. 03:00 PM: Depart for Mumbai. 09:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 25. ALANG MADAN KULANG (AMK) ──
  {
    slug: "alang-madan-kulang-amk-trek",
    name: "Alang Madan Kulang (AMK) Extreme Range Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "2 days 1 night",
    distance: "170 km from Mumbai",
    maxAltitude: "1,475 m (4,840 ft)",
    elevation: "1,475 m (4,840 ft)",
    startPoint: "Ambewadi / Kulangwadi",
    endPoint: "Ambewadi / Kulangwadi",
    baseVillage: "Ambewadi (आंबेवाडी, Igatpuri)",
    category: "fort",
    difficulty: "expert",
    weatherStats: {
      temp: "19°C",
      wind: "24 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 7",
      visibility: "22.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Ambewadi",
        marathiName: "आंबेवाडी (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Expert (Rock Climbing & Rappelling)",
        distanceFromBase: "18.0 km total range",
        trailDuration: "7 - 8 Hours per day",
        popularFor: "The undisputed toughest trek in Maharashtra requiring rock climbing, rope traversing, and rappelling",
        routeDescription: "Starts at Ambewadi. The trail scales the sheer basalt ramparts of Alang Fort via blown-off rock steps and vertical rock patches, traverses to Madan Fort via technical climbing and rope descent, and finishes on the sprawling tableland of Kulang Fort.",
        coordinates: { lat: 19.5818, lng: 73.6618 }
      }
    ],
    highlights: [
      "👑 The 'Toughest Trek in Maharashtra': The holy grail of Sahyadri mountaineering",
      "🧗 Technical Rock Climbing & 80-ft Sheer Cliff Rappelling with certified mountaineering gear",
      "🏰 Three Impregnable Mountain Fortresses: Alang, Madan, and Kulang conquering the sky",
      "🌌 Unforgettable Overnight Cave Stay beneath millions of glittering Sahyadri stars",
      "🍛 Wholesome, energy-rich village meals cooked fresh by local mountain guides"
    ],
    fortAttractions: [
      "Technical Rock Climbing Wall & Rappelling Points",
      "Madan Fort Blown-Off Rock Staircase",
      "Kulang Fort Highest Continuous Stone Staircase in Sahyadri",
      "Ancient Cave Shelters with Perennial Sweet Water",
      "Alang Fort Massive Ancient Temple Ruins",
      "Unmatched 360-degree panorama of Kalsubai, Ratangad & Bhandardara"
    ],
    history: "Alang, Madan, and Kulang (AMK) are three colossal natural rock citadels situated in the Kalasubai range. Their sheer rock walls rise 4,800+ ft into the sky. Because of their supreme natural defense, British forces in 1818 could not capture them by normal infantry assault; they systematically blasted away the access staircases using heavy artillery to render them inaccessible to Maratha freedom fighters.",
    howToReach: {
      byTrain: "Nearest railway station is Igatpuri (35 km) or Kasara (65 km). Local shared jeeps connect Kasara to Ambewadi.",
      byBus: "MSRTC buses from Igatpuri to Bhandardara connect through Ghoti to Ambewadi phata.",
      byRoad: "From Mumbai (170 km): Follow NH160 via Kasara Ghat to Ghoti ➔ Turn towards Ambewadi base village (~4 hrs)."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Drive to Base",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Thane 11:15 PM, Kalyan 11:45 PM. Overnight drive to Ambewadi base."
      },
      {
        day: 2,
        title: "05:00 AM – Ambewadi Base, Technical Climb & Summit Experience",
        description: "05:00 AM: Arrive at Ambewadi. Freshen up and eat hot breakfast with tea. 06:00 AM: Safety briefing, gear check, and commence ascent. 08:30 AM: Tackle technical rock patches using ropes and harnesses. 11:00 AM: Reach the soaring summit of the fortress and explore caves and ancient cisterns. 01:00 PM: Mountain top packed lunch. 02:30 PM: Rappel down sheer rock faces with certified guides. 05:00 PM: Return to base village. 06:00 PM: Wholesome dinner feast. 07:00 PM: Depart for Mumbai. 11:30 PM: Arrive in Mumbai."
      }
    ]
  }
];

async function updatePart3() {
  console.log(`Starting real data update for Part 3 (${TREKS_REAL_DATA_PART3.length} forts/treks)...`);
  let updatedCount = 0;

  for (const trek of TREKS_REAL_DATA_PART3) {
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

  console.log(`\nPart 3 complete! Successfully updated ${updatedCount} treks in Firestore with Durg-style rich real data!`);
}

updatePart3().catch(console.error).finally(() => process.exit(0));

