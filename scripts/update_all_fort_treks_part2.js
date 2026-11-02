/**
 * Part 2: Real Sahyadri Forts & Pinnacles Update
 * Updates 15 more major Sahyadri forts & peaks in Firestore with Durg-style rich information
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

const TREKS_REAL_DATA_PART2 = [
  // ── 11. SARASGAD FORT ──
  {
    slug: "sarasgad-fort-trek",
    name: "Sarasgad Pinnacle Fort Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "110 km from Mumbai",
    maxAltitude: "490 m (1,608 ft)",
    elevation: "490 m (1,608 ft)",
    startPoint: "Pali Base Town",
    endPoint: "Pali Base Town",
    baseVillage: "Pali (पाली, Raigad)",
    category: "fort",
    difficulty: "moderate",
    weatherStats: {
      temp: "25°C",
      wind: "15 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 6",
      visibility: "19.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Pali Town (Ballaleshwar Ganpati)",
        marathiName: "पाली गाव (बल्लाळेश्वर गणपती पायथा)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "3.5 km",
        trailDuration: "2 Hours",
        popularFor: "Classic route starting from the sacred Ashta Vinayak temple of Ballaleshwar Pali",
        routeDescription: "Starts directly behind the Ballaleshwar Pali Ganpati Temple. The trail winds through hillside scrub, climbs a series of stone steps, and ascends a steep rock-cut cleft leading through Dindi Darwaja.",
        coordinates: { lat: 18.5375, lng: 73.2208 }
      }
    ],
    highlights: [
      "🪨 Towering natural stone tooth pinnacle rising majestically over the town of Pali",
      "🚪 Spectacular Dindi Darwaja carved directly into a narrow vertical rock cleft",
      "🛕 Darshan at the sacred Ballaleshwar Ganpati Temple (one of the 8 Ashta Vinayaks)",
      "🦅 Impressive panoramic views of sister fort Sudhagad and the Amba River valley",
      "🍛 Authentic Konkani Maharashtrian vegetarian feast in Pali"
    ],
    fortAttractions: [
      "Dindi Darwaja (Rock-cut Fort Gate)",
      "Shivaji Maharaj Historic Watchtower",
      "Kedareshwar Cave & Water Cisterns",
      "Shahpur Bastion with sweeping valley views",
      "Rock-cut Steps on Vertical Cliff",
      "Ballaleshwar Pali Ganpati Mandir"
    ],
    history: "Sarasgad Fort, resembling a sharp four-sided pyramidal stone tooth, was reconstructed and fortified by Chhatrapati Shivaji Maharaj in 1657 as a twin sentinel alongside Sudhagad Fort. Maharaj allocated 2,000 hons for its fortification to guard the vital Konkan-Ghats trade route and provide security to the holy temple town of Pali. During the Peshwa period, it was maintained as an active military watchtower.",
    howToReach: {
      byTrain: "Nearest railway station is Roha (30 km) or Khopoli (40 km). Regular buses and autos connect Khopoli and Roha to Pali.",
      byBus: "MSRTC state transport buses run frequently from Mumbai, Thane, and Pune directly to Pali Bus Stand.",
      byRoad: "From Mumbai (110 km): Drive along Mumbai-Pune Expressway ➔ Take Khopoli Exit ➔ Follow Khopoli-Pali Highway ➔ Pali town (~2.5 hrs). Dedicated parking near temple."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Overnight ride via Mumbai-Pune Expressway to Pali."
      },
      {
        day: 2,
        title: "05:00 AM – Pali Base, Pinnacle Climb & Return",
        description: "05:00 AM: Arrive at Pali base. Freshen up and enjoy breakfast with tea. 06:00 AM: Begin morning ascent up the stone steps behind the temple. 07:30 AM: Climb the thrilling rock-cut steps through Dindi Darwaja. 08:00 AM - 11:30 AM: Explore the summit plateau, caves, water cisterns, and views of Sudhagad. 12:00 PM: Descend to Pali. 01:00 PM: Visit Ballaleshwar Ganpati Temple and enjoy village lunch. 03:00 PM: Return drive to Mumbai. 07:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 12. TIKONA FORT ──
  {
    slug: "tikona-fort-trek",
    name: "Tikona Fort (Vitandgad) Pyramidal Hill Climb",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "120 km from Mumbai",
    maxAltitude: "1,060 m (3,478 ft)",
    elevation: "1,060 m (3,478 ft)",
    startPoint: "Tikona Peth Base Village",
    endPoint: "Tikona Peth Base Village",
    baseVillage: "Tikona Peth (तिकोना पेठ, Kamshet)",
    category: "fort",
    difficulty: "easy",
    weatherStats: {
      temp: "24°C",
      wind: "16 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 6",
      visibility: "22.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Tikona Peth",
        marathiName: "तिकोना पेठ (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Easy to Moderate",
        distanceFromBase: "3.5 km",
        trailDuration: "2 Hours",
        popularFor: "Standard, popular trail with safety railings, Buddhist caves, and the near-vertical stone staircase to the citadel",
        routeDescription: "Starts at Tikona Peth village. The trail gently ascends a scrub hill, passes ancient Buddhist rock-cut caves, reaches the first fortification wall, and climbs steep rock steps fitted with iron safety cables to the summit.",
        coordinates: { lat: 18.6318, lng: 73.5183 }
      }
    ],
    highlights: [
      "🔺 Distinctive 3-sided Triangular (Tikona) Pyramidal peak rising dramatically over Pawna Lake",
      "🪜 Thrilling near-vertical stone staircase with secure safety cables and handrails",
      "🛕 Ancient Trimbakeshwar Mahadev Temple & historic stone deepstambha",
      "🌊 Mesmerizing panoramic views of Pawna Dam, Tung Fort, Lohagad & Visapur",
      "🍛 Authentic rural Maharashtrian meal at Tikona Peth village"
    ],
    fortAttractions: [
      "Trimbakeshwar Mahadev Temple",
      "Steep Rock-Cut Staircase with Railings",
      "Vetal Darwaja & Main Fort Entrance",
      "Massive Stone Flour Grinder (Chuna Grinder)",
      "Large Perennial Water Tanks (Seven Cisterns)",
      "Buddhist Rock-cut Caves",
      "Panoramic 360-degree Pawna Lake View"
    ],
    history: "Tikona Fort (ancient name 'Vitandgad') stands at 3,478 ft in the Maval region, guarding the vital trade route from the Konkan coast to Pune. Captured by Malik Ahmad Nizam Shah I in 1485, it was brought into Swarajya by Chhatrapati Shivaji Maharaj in 1657. In 1665, it was surrendered to the Mughals under the Treaty of Purandar, but was swiftly recaptured by Maharaj in 1670. The fort features remarkable Buddhist caves and Satavahana-era water cisterns.",
    howToReach: {
      byTrain: "Nearest railway station is Kamshet (12 km) or Lonavala (22 km). Local shared jeeps and auto-rickshaws run from Kamshet to Tikona Peth.",
      byBus: "MSRTC buses from Kamshet depot go towards Pawnanagar and stop at Tikona Peth.",
      byRoad: "From Mumbai (120 km): Take Mumbai-Pune Expressway ➔ Exit at Lonavala or Kamshet ➔ Drive towards Pawna Dam via Kamshet-Pawnanagar Road ➔ Reach Tikona Peth (~2.5 hrs)."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Easy Highway Drive",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Easy highway drive along Mumbai-Pune Expressway towards Kamshet."
      },
      {
        day: 2,
        title: "05:00 AM – Tikona Peth Base, Pyramid Climb & Return",
        description: "05:00 AM: Arrive at Tikona Peth base. Refresh and enjoy hot Kanda Poha with tea. 06:15 AM: Begin climb up the scenic mountain path. 07:30 AM: Tackle the exhilarating steep rock steps with safety cables. 08:00 AM - 11:30 AM: Stand at the peak with stunning views over the glittering waters of Pawna Lake, explore Trimbakeshwar temple, water cisterns, and Buddhist caves. 12:00 PM: Descend to base. 01:15 PM: Wholesome village lunch. 02:45 PM: Relax by Pawna Lake shore. 04:00 PM: Return drive to Mumbai. 08:00 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 13. GORAKHGAD FORT ──
  {
    slug: "gorakhgad-fort-trek",
    name: "Gorakhgad Fort Vertical Spire & Saint Cave",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "95 km from Mumbai",
    maxAltitude: "650 m (2,132 ft)",
    elevation: "650 m (2,132 ft)",
    startPoint: "Dehri Base Village",
    endPoint: "Dehri Base Village",
    baseVillage: "Dehri (देहरी, Murbad)",
    category: "fort",
    difficulty: "moderate",
    weatherStats: {
      temp: "25°C",
      wind: "17 km/h Wind",
      rainProb: "12% Rain (24h)",
      uv: "UV 6",
      visibility: "19.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Dehri",
        marathiName: "देहरी (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Moderate to Challenging",
        distanceFromBase: "4.5 km",
        trailDuration: "3 Hours",
        popularFor: "Famous trekking route featuring steep rock-cut stairs and Saint Gorakhnath meditation cave",
        routeDescription: "Starts at Dehri village temple. Climbs through a lush forest path to the col between Gorakhgad and Machindragad, followed by near-vertical 80-degree rock-cut steps chiseled into the sheer rock spire leading to the meditation caves and summit.",
        coordinates: { lat: 19.1981, lng: 73.5412 }
      }
    ],
    highlights: [
      "🧗 Thrilling 80-degree Near-Vertical Rock-Cut Steps carved directly into the sheer stone cliff",
      "🧘 Ancient Meditation Cave of Saint Gorakhnath capable of sheltering over 40 people",
      "🗼 Striking monolith rock spire standing tall alongside sister pinnacle Machindragad",
      "🌅 Breathtaking vistas of Siddhagad, Ahupe Ghat, and the Murbad valley",
      "🍲 Hot village breakfast and authentic rustic meal at Dehri base"
    ],
    fortAttractions: [
      "Saint Gorakhnath Meditation Cave (गोरखनाथ गुंफा)",
      "Near-Vertical 80° Rock-Cut Staircase",
      "Summit Mahadev Shrine with Shiva Lingam",
      "Perennial Freshwater Rock Cisterns",
      "Col between Gorakhgad & Machindragad",
      "Views of Siddhagad, Padargad & Bhimashankar"
    ],
    history: "Gorakhgad Fort is named after Saint Gorakhnath, the legendary guru of the Nath Sampradaya who meditated in the cliff caves here centuries ago. During the reign of the Shilaharas and later the Marathas under Chhatrapati Shivaji Maharaj, Gorakhgad served as an impregnable military watchtower overseeing the ancient trade route connecting Junnar to the Konkan ports via Naneghat and Siddhagad.",
    howToReach: {
      byTrain: "Nearest railway station is Kalyan Junction (45 km). Regular ST buses and shared jeeps connect Kalyan to Murbad and Dehri.",
      byBus: "MSRTC buses from Kalyan Bus Stand go to Murbad, from where connecting buses or shared autos reach Dehri.",
      byRoad: "From Mumbai (95 km): Follow NH61 via Kalyan ➔ Murbad ➔ Turn towards Dehri village (~2.5 hrs). Dedicated parking near village temple."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Thane 11:15 PM, Kalyan 11:45 PM. Smooth transit via Kalyan-Murbad Road to Dehri base village."
      },
      {
        day: 2,
        title: "04:30 AM – Dehri Base, Vertical Spire Climb & Return",
        description: "04:30 AM: Arrive at Dehri base. Freshen up and enjoy village breakfast with hot tea. 05:30 AM: Start ascent through cool forest trail to the col. 07:15 AM: Reach the base of the spire and climb the thrilling vertical rock-cut stairs with firm handholds. 08:00 AM - 11:30 AM: Explore the spacious Saint Gorakhnath cave, drink crystal pure spring water, climb to the top pinnacle Mahadev shrine. 12:00 PM: Careful descent to Dehri. 01:30 PM: Authentic rustic village lunch. 03:00 PM: Depart for Mumbai. 07:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 14. BHIMASHANKAR JYOTIRLINGA & SHIDI GHAT ──
  {
    slug: "bhimashankar-jyotirlinga-trek",
    name: "Bhimashankar Jungle & Shidi Ghat Trail",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "110 km from Mumbai",
    maxAltitude: "1,005 m (3,300 ft)",
    elevation: "1,005 m (3,300 ft)",
    startPoint: "Khandas Base Village",
    endPoint: "Khandas Base Village",
    baseVillage: "Khandas (खंडास, Karjat)",
    category: "forest",
    difficulty: "moderate",
    weatherStats: {
      temp: "22°C",
      wind: "18 km/h Wind",
      rainProb: "20% Rain (24h)",
      uv: "UV 6",
      visibility: "18.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Khandas (Shidi Ghat Ladder Route)",
        marathiName: "खंडास (शिडी घाट थरारक मार्ग)",
        isPrimary: true,
        difficulty: "Challenging",
        distanceFromBase: "8.5 km",
        trailDuration: "4 Hours",
        popularFor: "Famous adventure trail with three vertical iron ladders anchored across thrilling rock cliffs",
        routeDescription: "Starts at Khandas base. Crosses river streams, climbs through dense forest, and scales three steep iron ladder sections over sheer rock bands, converging onto the higher plateau.",
        coordinates: { lat: 19.0683, lng: 73.5383 }
      },
      {
        name: "Khandas (Ganesh Ghat Route)",
        marathiName: "खंडास (गणेश घाट सोपा मार्ग)",
        isPrimary: false,
        difficulty: "Moderate",
        distanceFromBase: "12.0 km",
        trailDuration: "4.5 - 5 Hours",
        popularFor: "Longer, gradual and scenic forest walk passing the Ganesh temple and Padar Killa viewpoints",
        routeDescription: "A gentle, gradual route ascending through dense evergreen jungle and ridges, preferred for descent or for trekkers wanting to avoid vertical ladders.",
        coordinates: { lat: 19.0712, lng: 73.5412 }
      }
    ],
    highlights: [
      "🛕 Ancient 6th-century Bhimashankar Jyotirlinga Temple (one of the 12 sacred Jyotirlingas in India)",
      "🪜 Thrilling Shidi Ghat: Climb three sturdy iron ladders pinned against vertical rock faces",
      "🐿️ Dense Evergreen Wildlife Sanctuary home to the Indian Giant Squirrel (Shekru - Maharashtra state animal)",
      "🌊 Sacred origin of the Bhima River (Chandrabhaga) that flows to Pandharpur",
      "🍲 Authentic traditional temple prasadam and village meal"
    ],
    fortAttractions: [
      "Bhimashankar Jyotirlinga Ancient Stone Temple",
      "Shidi Ghat Three Ladder Rock Sections",
      "Shekru (Giant Squirrel) Wildlife Sanctuary",
      "Gupt Bhimashankar (Hidden River Origin in Forest)",
      "Nagphani (Cobra Hood) Viewpoint",
      "Bakareshwar & Hanuman Shrines",
      "Dense Sub-tropical Evergreen Jungle Canopy"
    ],
    history: "Bhimashankar is steeped in ancient legend and Maratha history. The Jyotirlinga temple features intricate Nagara-style architecture, with major stone construction sponsored by Chimaji Appa (brother of Peshwa Bajirao I) after his victory over the Portuguese at Vasai in 1739. The temple also enshrines a massive Portuguese bell gifted by Chimaji Appa. Surrounding the temple is a pristine wildlife sanctuary preserving ancient Western Ghats biodiversity.",
    howToReach: {
      byTrain: "Nearest railway station is Karjat Junction (35 km) or Neral (32 km). Regular auto-rickshaws and shared jeeps connect Karjat to Khandas base village.",
      byBus: "MSRTC buses from Karjat bus depot run to Kashele and Khandas.",
      byRoad: "From Mumbai (110 km): Take Sion-Panvel Highway ➔ Karjat ➔ Kashele ➔ Turn towards Khandas village (~2.5 hrs). Dedicated vehicle parking available."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Easy highway drive to Karjat and Khandas."
      },
      {
        day: 2,
        title: "04:30 AM – Khandas Base, Shidi Ghat Climb & Return",
        description: "04:30 AM: Arrive at Khandas base. Freshen up and enjoy breakfast with tea. 05:30 AM: Begin trek into the misty jungle. 07:00 AM: Climb the famous Shidi Ghat ladders with rock handholds. 09:30 AM: Reach the Bhimashankar plateau and visit the sacred 1,200-year-old Jyotirlinga Temple. 11:00 AM: Explore Gupt Bhimashankar and Nagphani viewpoint looking for the Shekru giant squirrel. 12:30 PM: Start descent via scenic Ganesh Ghat. 03:30 PM: Reach Khandas base and enjoy hot village lunch. 04:30 PM: Depart for Mumbai. 08:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 15. KARNALA FORT & BIRD SANCTUARY ──
  {
    slug: "karnala-fort-trek",
    name: "Karnala Fort & Bird Sanctuary Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "55 km from Mumbai",
    maxAltitude: "475 m (1,558 ft)",
    elevation: "475 m (1,558 ft)",
    startPoint: "Karnala Bird Sanctuary Gate",
    endPoint: "Karnala Bird Sanctuary Gate",
    baseVillage: "Karnala (कर्नाळा, Panvel)",
    category: "forest",
    difficulty: "easy",
    weatherStats: {
      temp: "26°C",
      wind: "14 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 6",
      visibility: "18.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Karnala Bird Sanctuary Main Gate",
        marathiName: "कर्नाळा पक्षी अभयारण्य मुख्य प्रवेशद्वार",
        isPrimary: true,
        difficulty: "Easy to Moderate",
        distanceFromBase: "3.5 km",
        trailDuration: "2 Hours",
        popularFor: "Scenic nature trail passing through dense bird sanctuary with marked trails and rest shelters",
        routeDescription: "Starts at the Forest Department gate on NH66. The trail climbs through dense moist deciduous forest teeming with birds, reaching the outer stone ramparts and the base of the basalt thumb pinnacle.",
        coordinates: { lat: 18.8912, lng: 73.1183 }
      }
    ],
    highlights: [
      "👍 Distinctive 125-ft tall Basalt 'Thumbs Up' Funnel Rock Pinnacle (Pandu's Tower)",
      "🦜 Rich Bird Sanctuary teeming with over 150 resident and migratory bird species",
      "🛕 Ancient Bhavani Temple and sacred freshwater rock cisterns",
      "🌊 Panoramic vistas of Mumbai Harbour, Prabalgad, and the Patalganga River",
      "🍛 Authentic rustic Konkani meal at Panvel base"
    ],
    fortAttractions: [
      "Basalt Funnel Pinnacle (पिकनिक सुळका)",
      "Ancient Bhavani Mata Temple",
      "Fort Gate & Persian/Marathi Inscriptions",
      "Over 150 Bird Species in Wildlife Sanctuary",
      "Multiple Perennial Water Cisterns",
      "Panoramic views of Mumbai Harbour & JNPT"
    ],
    history: "Karnala Fort was constructed before the 14th century, commanding the vital Borghat trade route connecting the Konkan coast to peninsular Maharashtra. It was controlled successively by the Devagiri Yadavas, Tughlaqs, Gujarat Sultanate, Nizam Shahs, and Portuguese before Chhatrapati Shivaji Maharaj captured it in 1670. The fort has bilingual inscriptions in Marathi and Persian from the 16th century on its ancient gates.",
    howToReach: {
      byTrain: "Nearest railway station is Panvel (12 km) on Central/Harbour Railway. Autos, shared vans, and local buses ply continuously along NH66 past the sanctuary gate.",
      byBus: "MSRTC buses from Panvel towards Pen, Alibaug, and Roha halt right in front of the Karnala Sanctuary gate.",
      byRoad: "From Mumbai (55 km): Drive via Sion-Panvel Expressway ➔ Cross Panvel city ➔ Follow NH66 (Mumbai-Goa Highway) for 12 km to Karnala Sanctuary entrance (~1.5 hrs)."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Short Highway Drive",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Short, comfortable transit to Panvel base camp."
      },
      {
        day: 2,
        title: "05:30 AM – Sanctuary Gate, Bird Walk & Pinnacle Climb",
        description: "05:30 AM: Arrive at Karnala Bird Sanctuary gate. Enjoy morning tea and breakfast. 06:15 AM: Enter forest trail listening to the dawn chorus of migratory and resident birds. 08:00 AM: Reach the historic ramparts of Karnala and explore the ancient water cisterns and Bhavani temple. 09:30 AM: Stand at the base of the majestic basalt thumb pinnacle. 11:30 AM: Descend to the sanctuary nature center. 01:00 PM: Delicious Konkani lunch at base. 02:30 PM: Return drive to Mumbai. 05:00 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 16. IRSHALGAD PINNACLE ──
  {
    slug: "irshalgad-pinnacle-trek",
    name: "Irshalgad Pinnacle & Needle Hole Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "65 km from Mumbai",
    maxAltitude: "670 m (2,200 ft)",
    elevation: "670 m (2,200 ft)",
    startPoint: "Nanivali / Irshalwadi Base",
    endPoint: "Nanivali / Irshalwadi Base",
    baseVillage: "Nanivali (नानिवली, Chowk, Panvel)",
    category: "fort",
    difficulty: "moderate",
    weatherStats: {
      temp: "25°C",
      wind: "17 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 6",
      visibility: "20.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Nanivali (via Chowk)",
        marathiName: "नानिवली (चौक मार्ग)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "4.5 km",
        trailDuration: "2.5 Hours",
        popularFor: "Standard trekking path climbing to the needle hole rock formation and water cisterns",
        routeDescription: "Starts at Nanivali village near Chowk. The trail ascends a winding forest path to the plateau, passing the rock-cut cave of Irshalsuli and leading through a thrilling rock chimney to the natural needle hole (Nedhe).",
        coordinates: { lat: 18.9183, lng: 73.2383 }
      }
    ],
    highlights: [
      "🪡 'Nedhe' (Natural Needle Hole) – an astonishing wind-carved rock cavity right through the mountain crest",
      "🗼 Striking jagged pinnacle twin to neighboring Prabalgad and Kalavantin Durg",
      "🌊 Breathtaking birds-eye views of Morbe Dam, Matheran, and the Mumbai-Pune Expressway",
      "🧗 Thrilling rock scrambling sections with incredible Sahyadri drop-offs",
      "🍛 Warm village hospitality and authentic Maharashtrian breakfast & lunch"
    ],
    fortAttractions: [
      "Natural Needle Hole Cavity (नेढे)",
      "Rock-Cut Water Tanks with Perennial Sweet Water",
      "Irshaldevi Cave Shrine",
      "Views of Morbe Dam, Prabalgad & Matheran",
      "Thrilling Rock Ridge and Chimney Scramble"
    ],
    history: "Irshalgad, towering at 2,200 ft, is the sister fortress to Prabalgad. Unlike traditional fortified palaces, Irshalgad served as an impenetrable watchtower to detect enemy movements along the trade routes between Panvel and Kalyan. During Chhatrapati Shivaji Maharaj's campaign to secure Kalyan and Bhiwandi in 1657, Irshalgad was brought under Maratha control along with Prabalgad.",
    howToReach: {
      byTrain: "Nearest railway station is Panvel (20 km) or Karjat (18 km). Chowk railway station is just 4 km away.",
      byBus: "Buses running from Panvel to Karjat pass Chowk phata, from where shared autos go to Nanivali.",
      byRoad: "From Mumbai (65 km): Drive via Mumbai-Pune Expressway ➔ Exit at Shedung / Chowk ➔ Drive to Nanivali village (~1.5 hrs). Dedicated parking available."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Easy Highway Drive",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Easy drive along Mumbai-Pune Expressway to Chowk."
      },
      {
        day: 2,
        title: "05:00 AM – Nanivali Base, Needle Hole Climb & Return",
        description: "05:00 AM: Arrive at Nanivali base. Enjoy fresh village breakfast with tea. 06:00 AM: Start morning climb up the wooded trail. 07:30 AM: Scramble through the rock chimney section to reach the natural needle hole (Nedhe). 08:00 AM - 11:30 AM: Sit inside the cool breezy needle hole with panoramic views over Morbe Dam, explore water cisterns and Irshaldevi shrine. 12:00 PM: Descend to base. 01:15 PM: Authentic Maharashtrian village lunch. 02:45 PM: Depart for Mumbai. 06:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 17. PURANDAR FORT ──
  {
    slug: "purandar-fort-trek",
    name: "Purandar Fort & Vajragad Citadel Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "205 km from Mumbai",
    maxAltitude: "1,387 m (4,550 ft)",
    elevation: "1,387 m (4,550 ft)",
    startPoint: "Purandar Base / Narayanpur",
    endPoint: "Purandar Base / Narayanpur",
    baseVillage: "Narayanpur (नारायणपूर, Saswad, Pune)",
    category: "fort",
    difficulty: "moderate",
    weatherStats: {
      temp: "22°C",
      wind: "19 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 6",
      visibility: "22.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Narayanpur (Purandar Foot)",
        marathiName: "नारायणपूर (मुख्य पायथा)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "4.5 km",
        trailDuration: "2.5 Hours",
        popularFor: "Historic approach ascending from the ancient Datta Mandir of Narayanpur to Bini Darwaja",
        routeDescription: "Starts at Narayanpur village. Winding trails climb through forest and grasslands, entering through Bini Darwaja to the lower machi and up to Kedareshwar Temple at the summit.",
        coordinates: { lat: 18.2833, lng: 73.9667 }
      }
    ],
    highlights: [
      "🚩 Sacred Birthplace of Chhatrapati Sambhaji Maharaj (born 16 January 1657)",
      "⚔️ Site of Murarbaji Deshpande's legendary heroic defense against Mughal general Diler Khan",
      "🏰 Twin Citadels of Purandar and Vajragad standing at an imposing 4,550 ft",
      "🛕 Historic Kedareshwar Temple & Bini Darwaja",
      "🍛 Authentic Saswad-style Maharashtrian feast at base"
    ],
    fortAttractions: [
      "Sambhaji Maharaj Birth Memorial (संभाजी महाराज जन्मस्थान)",
      "Statue & Memorial of Braveheart Murarbaji Deshpande",
      "Kedareshwar Mahadev Temple at Summit",
      "Bini Darwaja & Delhi Darwaja",
      "Twin Citadel of Vajragad (Rudra Mahal)",
      "Padmavati Lake & Historic Granary",
      "Panoramic views of Sinhagad, Rajgad & Torna"
    ],
    history: "Purandar Fort holds immense emotional weight in Maratha history. It is the birthplace of Chhatrapati Sambhaji Maharaj (1657). In 1665, Mughal general Diler Khan laid siege with a massive army; the Maratha fort commander Murarbaji Deshpande led a legendary counter-charge with 700 brave mavale, dying a martyr's death on the slopes. To prevent further bloodshed, Shivaji Maharaj signed the historic Treaty of Purandar with Raja Jai Singh I in 1665, surrendering 23 forts, which Maharaj famously recaptured within five years.",
    howToReach: {
      byTrain: "Nearest major railway station is Pune Junction (45 km). Regular buses connect Swargate to Saswad and Narayanpur.",
      byBus: "MSRTC buses ply from Swargate (Pune) to Saswad and Narayanpur village.",
      byRoad: "From Mumbai (205 km): Drive via Mumbai-Pune Expressway ➔ Katraj Bypass ➔ Saswad Road ➔ Narayanpur (~4.5 hrs). Dedicated parking available."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Overnight drive along Mumbai-Pune Expressway towards Saswad."
      },
      {
        day: 2,
        title: "04:30 AM – Narayanpur Base, Purandar Citadel & Return",
        description: "04:30 AM: Arrive at Narayanpur base. Freshen up and enjoy breakfast with tea. 05:30 AM: Begin morning climb. 07:30 AM: Enter through Bini Darwaja onto the machi. 08:00 AM - 12:00 PM: Pay respects at Murarbaji Deshpande memorial and Sambhaji Maharaj birthplace hall, ascend to Kedareshwar Temple at 4,550 ft, and explore Vajragad. 12:30 PM: Descend to base. 01:30 PM: Authentic local village feast. 03:00 PM: Depart for Mumbai. 09:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 18. ROHIDA (VICHITRAGAD) ──
  {
    slug: "rohida-vichitragad-trek",
    name: "Rohida (Vichitragad) Windswept Bastions",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "210 km from Mumbai",
    maxAltitude: "1,116 m (3,660 ft)",
    elevation: "1,116 m (3,660 ft)",
    startPoint: "Bajarwadi Base Village",
    endPoint: "Bajarwadi Base Village",
    baseVillage: "Bajarwadi (बाजारवाडी, Bhor, Pune)",
    category: "fort",
    difficulty: "easy",
    weatherStats: {
      temp: "23°C",
      wind: "24 km/h Wind",
      rainProb: "12% Rain (24h)",
      uv: "UV 6",
      visibility: "20.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Bajarwadi",
        marathiName: "बाजारवाडी (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Easy to Moderate",
        distanceFromBase: "3.5 km",
        trailDuration: "2 Hours",
        popularFor: "Standard, scenic trail ascending through three consecutive grand stone doorways",
        routeDescription: "Starts at Bajarwadi village school near Bhor. A well-trodden mud trail ascends grassy ridges, reaching the first fortification gate and passing through two more defensive doorways to reach the summit.",
        coordinates: { lat: 18.1018, lng: 73.8183 }
      }
    ],
    highlights: [
      "🚪 Three Formidable Historic Stone Gates with intact Ganesh and Sharabha stone carvings",
      "🌬️ Famous Howling Mountain Winds whistling continuously through the stone bastions",
      "🛕 Ancient Rohideshwar Temple where young Shivaji Maharaj took early Swarajya oaths",
      "🌊 Incredible panoramic views over Bhatghar Dam backwaters, Kenjalgad, and Raireshwar",
      "🍛 Authentic rural Bhor-style Maharashtrian village lunch"
    ],
    fortAttractions: [
      "Three Consecutive Stone Gates (तीन महादरवाजे)",
      "Rohideshwar Temple Complex",
      "Six Interconnected Water Cisterns with crystal clear water",
      "Windswept Bastions (बुरांडे बुरुज & शिरवले बुरुज)",
      "Intact Rampart Walks with loopholes for muskets",
      "Panoramic views of Bhatghar Dam & Raireshwar Plateau"
    ],
    history: "Rohida Fort (also known as Vichitragad) was constructed during the Yadava dynasty and subsequently fortified by Chhatrapati Shivaji Maharaj in 1656 after the conquest of Jawali and Bhor. Rohida was one of the prime defense forts guarding the southern boundary of the Maval region. It was among the forts surrendered to Mughals under the Treaty of Purandar (1665) and recaptured by Shivaji Maharaj in 1670.",
    howToReach: {
      byTrain: "Nearest railway station is Pune Junction (65 km). Buses run from Pune to Bhor.",
      byBus: "MSRTC buses from Swargate (Pune) reach Bhor, from where local shared autos/jeeps reach Bajarwadi (7 km).",
      byRoad: "From Mumbai (210 km): Drive along Mumbai-Pune Expressway ➔ NH48 past Shirwal ➔ Turn right towards Bhor ➔ Reach Bajarwadi base village (~4.5 hrs). Dedicated parking available."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Overnight drive along NH48 via Shirwal to Bhor."
      },
      {
        day: 2,
        title: "05:00 AM – Bajarwadi Base, Three Gates Climb & Return",
        description: "05:00 AM: Reach Bajarwadi base village. Freshen up and enjoy morning tea with Poha. 06:15 AM: Begin climb in cool mountain breeze. 07:45 AM: Pass through the three majestic stone gates with ancient carvings. 08:30 AM - 12:00 PM: Explore the windy bastions, Rohideshwar temple, six rock cisterns, and views of Bhatghar Dam. 12:15 PM: Descend to Bajarwadi. 01:30 PM: Wholesome local village lunch. 03:00 PM: Depart for Mumbai. 09:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 19. TUNG FORT (KATHINGAD) ──
  {
    slug: "tung-fort-trek",
    name: "Tung Fort (Kathingad) Pawna Lake Watchtower",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "115 km from Mumbai",
    maxAltitude: "1,075 m (3,526 ft)",
    elevation: "1,075 m (3,526 ft)",
    startPoint: "Tungi Base Village",
    endPoint: "Tungi Base Village",
    baseVillage: "Tungi (तुंगी, Pawna Lake, Pune)",
    category: "fort",
    difficulty: "easy",
    weatherStats: {
      temp: "24°C",
      wind: "18 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 6",
      visibility: "21.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Tungi",
        marathiName: "तुंगी (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Easy to Moderate",
        distanceFromBase: "3.0 km",
        trailDuration: "1.5 Hours",
        popularFor: "Short and scenic trail surrounded on three sides by the backwaters of Pawna Lake",
        routeDescription: "Starts at Tungi village near the lake. The trail climbs through wooded slopes, crosses Hanuman Darwaja, and ascends steep rock-cut steps directly to the narrow peak shrine.",
        coordinates: { lat: 18.6583, lng: 73.4683 }
      }
    ],
    highlights: [
      "🏝️ Unique conical peak surrounded on three sides by the shimmering blue waters of Pawna Lake",
      "🚪 Hanuman Darwaja and intact stone fortification bastions",
      "🛕 Ancient Tungi Devi Shrine and Mahadev Temple perched at the razor-sharp peak",
      "🌊 Unrivaled 360-degree vistas of Tikona Fort, Lohagad, Visapur, and Pawna Dam",
      "🍛 Fresh village meal with stunning lakeside views at Tungi base"
    ],
    fortAttractions: [
      "Hanuman Darwaja (Fort Entrance)",
      "Tungi Devi Temple Shrine",
      "Mahadev Temple at Summit Peak",
      "Rock-Cut Water Tanks & Caves",
      "Narrow Sharp Ridge Promenade",
      "Unsurpassed 360-degree Pawna Lake Panorama"
    ],
    history: "Tung Fort (also named Kathingad, meaning 'The Difficult Fort') was built before 1600 CE by the Adil Shahi dynasty and was captured by Chhatrapati Shivaji Maharaj in 1657. Because of its sharp conical profile, it could not support a large garrison (maximum 200 troops), but served as an invaluable watchtower alerting surrounding forts like Tikona, Lohagad, and Visapur about enemy movements across the Pawna valley.",
    howToReach: {
      byTrain: "Nearest railway station is Lonavala (24 km) or Kamshet (20 km). Shared cabs and autos go to Pawna Lake and Tungi.",
      byBus: "Buses from Lonavala to Pawnanagar connect towards Tungi village.",
      byRoad: "From Mumbai (115 km): Drive via Mumbai-Pune Expressway ➔ Exit at Lonavala ➔ Follow Aamby Valley road ➔ Turn towards Pawna Dam ➔ Reach Tungi village (~2.5 hrs). Vehicle parking available."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Easy Highway Drive",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Easy highway drive along Mumbai-Pune Expressway."
      },
      {
        day: 2,
        title: "05:00 AM – Tungi Base, Lakeside Climb & Return",
        description: "05:00 AM: Arrive at Tungi base beside Pawna Lake. Enjoy morning tea and hot breakfast. 06:15 AM: Begin climb up the steep conical trail. 07:30 AM: Enter through Hanuman Darwaja and ascend to the peak. 07:45 AM - 11:00 AM: Marvel at the endless 360° blue water views of Pawna Dam, explore water tanks and Mahadev temple. 11:30 AM: Descend to Tungi. 01:00 PM: Wholesome local village lunch. 02:30 PM: Relax by Pawna Lake shore. 04:00 PM: Depart for Mumbai. 08:00 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 20. SONDAI FORT ──
  {
    slug: "sondai-fort-trek",
    name: "Sondai Fort Monsoon Ladder Climb",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "65 km from Mumbai",
    maxAltitude: "365 m (1,200 ft)",
    elevation: "365 m (1,200 ft)",
    startPoint: "Sondewadi Base Village",
    endPoint: "Sondewadi Base Village",
    baseVillage: "Sondewadi (सोंडेवाडी, Karjat)",
    category: "fort",
    difficulty: "easy",
    weatherStats: {
      temp: "26°C",
      wind: "15 km/h Wind",
      rainProb: "15% Rain (24h)",
      uv: "UV 6",
      visibility: "19.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Sondewadi",
        marathiName: "सोंडेवाडी (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Easy",
        distanceFromBase: "2.5 km",
        trailDuration: "1.5 Hours",
        popularFor: "Beginner-friendly monsoon trek with beautiful green hills and sturdy steel ladders",
        routeDescription: "Starts at Sondewadi village near Karjat. A gentle trail through lush fields climbs the mountain ridge, with two securely anchored steel ladder sections overcoming the rock patches directly to the summit.",
        coordinates: { lat: 18.9618, lng: 73.3183 }
      }
    ],
    highlights: [
      "🪜 Two Sturdy Steel Ladder Climbs that make the rocky summit easily accessible for beginners and families",
      "🌊 Incredible panoramic view of the vast Morbe Dam reservoir and water channels",
      "🛕 Sacred Sondai Devi Idol sheltered beneath a solitary hilltop tree",
      "🌄 Picturesque vistas of Songiri Fort, Rajmachi, and Matheran mountain ranges",
      "🍲 Delicious rustic Maharashtrian breakfast & lunch at Sondewadi base"
    ],
    fortAttractions: [
      "Two Sturdy Steel Ladder Sections",
      "Sondai Devi Hilltop Shrine under Sacred Tree",
      "Four Rock-Cut Perennial Water Cisterns",
      "Birds-eye view of Morbe Dam & Karjat plains",
      "Panoramic sights of Prabalgad, Irshalgad & Songiri"
    ],
    history: "Sondai Fort, standing at 1,200 ft near Karjat, served as a military watchtower during the Maratha era to oversee the trade routes along the Ulhas River and the passage through the Bhor Ghat. Rather than a royal citadel, it was engineered as a high surveillance post with rock-cut water cisterns that maintain fresh potable water throughout the entire year.",
    howToReach: {
      byTrain: "Nearest railway station is Karjat Junction (9 km). Frequent shared auto-rickshaws connect Karjat Station to Sondewadi / Borgaon.",
      byBus: "MSRTC buses from Karjat towards Chowk stop near the Sondai phata.",
      byRoad: "From Mumbai (65 km): Drive via Sion-Panvel Expressway ➔ Follow Karjat-Chowk Road ➔ Turn towards Sondewadi village (~1.5 hrs). Dedicated parking available."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Short Highway Drive",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Easy highway transit to Karjat."
      },
      {
        day: 2,
        title: "05:30 AM – Sondewadi Base, Ladder Ascent & Return",
        description: "05:30 AM: Arrive at Sondewadi base. Enjoy hot Poha with village tea. 06:30 AM: Start morning climb through verdant green trails. 07:30 AM: Ascend the two secure steel ladder sections onto the top pinnacle. 08:00 AM - 11:00 AM: Pay respects at Sondai Devi shrine, explore rock-cut water tanks, and take in the panoramic blue view of Morbe Dam. 11:30 AM: Descend to Sondewadi. 01:00 PM: Delicious authentic village lunch. 02:30 PM: Depart for Mumbai. 05:30 PM: Arrive in Mumbai."
      }
    ]
  }
];

async function updatePart2() {
  console.log(`Starting real data update for Part 2 (${TREKS_REAL_DATA_PART2.length} forts/treks)...`);
  let updatedCount = 0;

  for (const trek of TREKS_REAL_DATA_PART2) {
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

  console.log(`\nPart 2 complete! Successfully updated ${updatedCount} treks in Firestore with Durg-style rich real data!`);
}

updatePart2().catch(console.error).finally(() => process.exit(0));

