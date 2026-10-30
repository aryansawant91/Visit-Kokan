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

const TREKS_FULL_DATA = [
  // ── 1. TORNA FORT ──
  {
    slug: "torna-fort-trek",
    name: "Torna Fort Trek Expedition (Prachandagad)",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "210 km from Mumbai",
    maxAltitude: "1,403 m (4,603 ft)",
    startPoint: "Velhe Base Village",
    endPoint: "Velhe Base Village",
    baseVillage: "Velhe (वेल्हे, Pune)",
    category: "fort",
    difficulty: "moderate",
    images: [
      "/images/treks/torna-fort-trek/1.jpg",
      "/images/treks/torna-fort-trek/2.jpg",
      "/images/treks/torna-fort-trek/3.jpg"
    ],
    coordinates: { lat: 18.2758, lng: 73.6231 },
    weatherStats: {
      temp: "23°C",
      wind: "19 km/h Wind",
      rainProb: "15% Rain (24h)",
      uv: "UV 5",
      visibility: "16.5 km Visibility"
    },
    baseVillages: [
      {
        name: "Velhe",
        marathiName: "वेल्हे (मुख्य मार्ग)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "6.0 km",
        trailDuration: "3.5 - 4 Hours",
        popularFor: "Most popular & scenic route via Bini Darwaja with village parking & food",
        routeDescription: "Starts from Velhe bus stop near the police post. A well-trodden mud and rock trail climbs through grassy slopes, passing small waterfalls in monsoon and ascending stone stairs up to Bini Darwaja.",
        coordinates: { lat: 18.2758, lng: 73.6231 }
      },
      {
        name: "Bhattipada",
        marathiName: "भट्टीपाडा",
        isPrimary: false,
        difficulty: "Moderate",
        distanceFromBase: "5.5 km",
        trailDuration: "3 Hours",
        popularFor: "Peaceful offbeat trail ascending the western ridge",
        routeDescription: "Approaches the fort from the western side, climbing through quiet teak forests and connecting towards Budhla Machi.",
        coordinates: { lat: 18.2912, lng: 73.6087 }
      },
      {
        name: "Rajgad to Torna (Ridge Traverse)",
        marathiName: "राजगड ते तोरणा (रेंज ट्रेक)",
        isPrimary: false,
        difficulty: "Challenging",
        distanceFromBase: "14.0 km",
        trailDuration: "6 - 7 Hours",
        popularFor: "Legendary Sahyadri high-altitude mountain range traverse",
        routeDescription: "Traverses from Sanjeevani Machi of Rajgad across a windswept mountain saddle with stunning 360° views, entering Torna via Budhla Machi.",
        coordinates: { lat: 18.2464, lng: 73.6823 }
      }
    ],
    highlights: [
      "🚩 First Fort Captured by Chhatrapati Shivaji Maharaj in 1646 at age 16",
      "🦅 Thrilling Zunjar Machi & Budhla Machi Narrow Ridges",
      "🏰 Bini Darwaja & Centuries-Old Stone Fortifications",
      "🌄 Panoramic 360° Views of Rajgad, Sinhagad & Bhatghar Dam",
      "🍛 Authentic Maharashtrian Village Feast at Velhe Base"
    ],
    fortAttractions: [
      "Bini Darwaja & Kothi Darwaja",
      "Zunjar Machi (Slender Cliff Ridge)",
      "Budhla Machi (Towering Rock Mass)",
      "Mengai Devi Temple",
      "Kokan Darwaja",
      "Toraneshwar Mahadev Temple",
      "Amrut Kunda (Ancient Water Cisterns)"
    ],
    history: "Torna Fort, historically revered as Prachandagad (literally 'The Huge Fort'), stands majestically at 4,603 ft in the Sahyadris. It holds a sacred place in Maratha history as the first fort captured by Chhatrapati Shivaji Maharaj in 1646 at the tender age of 16, striking the first triumph of Hindavi Swarajya ('स्वराज्याचं तोरण'). Captured from the Adil Shahi sultanate without bloodshed, the treasure found during repairs was used to construct neighboring Rajgad Fort. In 1704, Mughal Emperor Aurangzeb besieged Torna and renamed it 'Futulgaib', but Maratha warriors under Sarsenapati Shankar Narayan Gandekar heroically recaptured it in 1707.",
    howToReach: {
      byTrain: "Nearest major railway station is Pune Junction (65 km from Velhe). Frequent local buses and private cabs run from Pune Swargate Bus Stand directly to Velhe.",
      byBus: "MSRTC State Transport buses depart Swargate (Pune) for Velhe every hour starting at 06:00 AM.",
      byRoad: "From Mumbai (210 km): Drive along Mumbai-Pune Expressway ➔ Katraj Bypass ➔ NH48 towards Satara ➔ Turn right at Nasrapur Phata onto SH65 ➔ Velhe base village (~4.5 hrs). Dedicated parking available near Velhe police chowki."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Transit",
        description: "Board private AC trekking bus from Mumbai. Pickups: Borivali (National Park) 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli / Panvel 11:55 PM. Overnight scenic journey via Mumbai-Pune Expressway & NH48 towards Velhe."
      },
      {
        day: 2,
        title: "04:30 AM – Velhe Base, Summit Ascent & Return",
        description: "04:30 AM: Reach Velhe base village (210 km from Mumbai). Freshen up & enjoy hot Kanda Poha / Misal Pav with tea. 05:30 AM: Trek briefing and begin ascent in cool dawn air. 08:30 AM: Cross Bini Darwaja and Kothi Darwaja to reach Torna summit. 08:30 AM – 12:30 PM: In-depth exploration of Menghai Devi Temple, Zunjar Machi, Budhla Machi, and panoramic valleys. 12:30 PM: Start descent to Velhe. 02:30 PM: Traditional Maharashtrian village lunch (Pithla Bhakri, Thecha & Solkadhi). 03:45 PM: Start return journey to Mumbai. 09:30 PM – 10:30 PM: Arrive back in Mumbai."
      }
    ]
  },

  // ── 2. RAIGAD FORT ──
  {
    slug: "raigad-fort-heritage-climb",
    name: "Raigad Fort Sovereign Citadel Climb",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "165 km from Mumbai",
    maxAltitude: "820 m (2,700 ft)",
    startPoint: "Pachad Base Village",
    endPoint: "Pachad Base Village",
    baseVillage: "Pachad (पाचाड, Mahad)",
    category: "fort",
    difficulty: "moderate",
    images: [
      "/images/treks/raigad-fort-heritage-climb/1.jpg",
      "/images/treks/raigad-fort-heritage-climb/2.jpg",
      "/images/treks/raigad-fort-heritage-climb/3.jpg"
    ],
    coordinates: { lat: 18.2356, lng: 73.4475 },
    weatherStats: {
      temp: "26°C",
      wind: "14 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 6",
      visibility: "18.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Pachad",
        marathiName: "पाचाड (मुख्य मार्ग)",
        isPrimary: true,
        difficulty: "Moderate (Steps) or Ropeway",
        distanceFromBase: "5.0 km (1,737 Steps)",
        trailDuration: "2.5 - 3 Hours",
        popularFor: "Main base for 1,737 stone steps & Raigad Ropeway station, plus Jijabai's Palace",
        routeDescription: "Starts at Pachad base. Broad stone stairs flanked by ancient stone walls pass through Nana Darwaja, Chor Darwaja, and the colossal Maha Darwaja. Features rest spots, fresh lime juice stalls, and ropeway.",
        coordinates: { lat: 18.2356, lng: 73.4475 }
      },
      {
        name: "Chitta Darwaja",
        marathiName: "चित्ता दरवाजा",
        isPrimary: false,
        difficulty: "Moderate",
        distanceFromBase: "5.5 km",
        trailDuration: "3 Hours",
        popularFor: "Traditional stone staircase ascending from western foot",
        routeDescription: "Historical secondary approach with ancient stone water cisterns along the trail, meeting the main pathway near Nana Darwaja.",
        coordinates: { lat: 18.2390, lng: 73.4380 }
      },
      {
        name: "Nane Darwaja / Singapur",
        marathiName: "नाणे दरवाजा / सिंगापूर",
        isPrimary: false,
        difficulty: "Moderate",
        distanceFromBase: "6.0 km",
        trailDuration: "3.5 Hours",
        popularFor: "Gentler forest trail on the eastern spur",
        routeDescription: "Gentle natural slope ascending from the Singapur side through shaded woods, entering the lower fortifications via Nane Darwaja.",
        coordinates: { lat: 18.2250, lng: 73.4580 }
      }
    ],
    highlights: [
      "👑 The Sovereign Capital of the Maratha Empire",
      "🏛️ Grand Coronation Site (Rajyabhishek) & Royal Court",
      "🏰 Impenetrable Maha Darwaja & 1,737 Stone Steps",
      "⚔️ Takmak Tok & Chhatrapati Shivaji Maharaj Samadhi",
      "🍲 Authentic Konkani Village Lunch at Pachad Base"
    ],
    fortAttractions: [
      "Maha Darwaja (Main Fort Portal)",
      "Rajbhavan (Royal Court of Shivaji Maharaj)",
      "Nagarkhana & Sacred Throne Site",
      "Takmak Tok (Execution Point & Cliff View)",
      "Jagdishwar Temple",
      "Chhatrapati Shivaji Maharaj Samadhi",
      "Bhavani Tok & Ganga Sagar Sacred Lake"
    ],
    history: "Raigad Fort, originally known as Rairi, was chosen by Chhatrapati Shivaji Maharaj as the glorious sovereign capital of the Maratha Empire in 1674 for his grand coronation (Rajyabhishek). Designed by master architect Hiroji Indulkar, the vast 2.5 km plateau featured over 300 stone structures, royal palaces, queens' chambers, granaries, and mints. Guarded by vertical 1,000-foot precipices on all three sides, Raigad stood as an impregnable natural fortress until British bombardment in 1818.",
    howToReach: {
      byTrain: "Nearest station is Mangaon (45 km) via Jan Shatabdi Express or Tutari Express. Local shared cabs and autos run from Mangaon station directly to Mahad and Pachad base village.",
      byBus: "Direct MSRTC buses depart Mumbai Central, Borivali, and Pune for Mahad ST stand. Connecting local buses run from Mahad to Pachad every 45 mins.",
      byRoad: "From Mumbai (165 km): Drive via NH66 Mumbai-Goa highway passing Pen, Nagothane, and Mangaon ➔ Turn left towards Pachad at Mahad bypass (~3.5 hrs). Fully tarred road leading to base parking & ropeway."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Transit",
        description: "Board the AC trekking bus from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Smooth overnight cruise along NH66 highway via Pen and Mangaon."
      },
      {
        day: 2,
        title: "04:00 AM – Pachad Base, Citadel Exploration & Return",
        description: "04:00 AM: Arrive at Pachad base village (165 km from Mumbai). Freshen up & rest at base lodge. 05:30 AM: Enjoy hot Poha and tea. 06:15 AM: Begin sunrise climb up 1,737 stone steps via Nana Darwaja and Maha Darwaja. 08:45 AM: Reach the vast fort plateau. 08:45 AM – 01:30 PM: Comprehensive guided tour of Nagarkhana, Rajbhavan, Throne site, Takmak Tok, Jagdishwar Temple, and Shivaji Maharaj Samadhi. 01:30 PM: Descend to Pachad base. 03:00 PM: Delicious authentic Konkani village lunch (Pithla Bhakri & Thecha). 04:15 PM: Depart Pachad for Mumbai. 09:30 PM: Return to Mumbai."
      }
    ]
  },

  // ── 3. HARISHCHANDRAGAD ──
  {
    slug: "harishchandragad-trek",
    name: "Harishchandragad Trek (Kokan Kada & Kedareshwar)",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "195 km from Mumbai",
    maxAltitude: "1,422 m (4,665 ft)",
    startPoint: "Pachnai / Khireshwar Base",
    endPoint: "Pachnai / Khireshwar Base",
    baseVillage: "Pachnai / Khireshwar (Malshej)",
    category: "fort",
    difficulty: "moderate",
    images: [
      "/images/treks/harishchandragad-trek/1.jpg",
      "/images/treks/harishchandragad-trek/2.jpg",
      "/images/treks/harishchandragad-trek/3.jpg"
    ],
    coordinates: { lat: 19.4001, lng: 73.7915 },
    weatherStats: {
      temp: "21°C",
      wind: "22 km/h Wind",
      rainProb: "25% Rain (24h)",
      uv: "UV 4",
      visibility: "14.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Pachnai",
        marathiName: "पाचनाई (सोपा व लोकप्रिय मार्ग)",
        isPrimary: true,
        difficulty: "Easy to Moderate",
        distanceFromBase: "3.5 km",
        trailDuration: "2.5 - 3 Hours",
        popularFor: "Shortest, most popular and easiest route suitable for all hikers",
        routeDescription: "Starts from Pachnai village. Beautiful trail winds alongside mountain streams and features sturdy iron ladders installed on rocky sections, leading straight to Harishchandreshwar temple.",
        coordinates: { lat: 19.4001, lng: 73.7915 }
      },
      {
        name: "Khireshwar",
        marathiName: "खिरेश्वर (टोलार खिंड मार्ग)",
        isPrimary: false,
        difficulty: "Moderate to Challenging",
        distanceFromBase: "8.0 km",
        trailDuration: "4.5 - 5 Hours",
        popularFor: "The classic scenic route via Tolar Khind and 7 Sahyadri hillocks",
        routeDescription: "Starts from Khireshwar village near Pimpalgaon Joga Dam. Ascends through dense forest into Tolar Khind, rocky cliff carvings with safety railings, and traverses across open ridges to the temple complex.",
        coordinates: { lat: 19.3871, lng: 73.7761 }
      },
      {
        name: "Belpada / Walhivali",
        marathiName: "बेलपाडा (नळीची वाट - अत्यंत थरारक)",
        isPrimary: false,
        difficulty: "Extreme Rock Scramble",
        distanceFromBase: "9.0 km",
        trailDuration: "7 - 9 Hours",
        popularFor: "Famous Nalichi Vaat: Vertical gorge scramble directly below Kokan Kada",
        routeDescription: "Technical, adrenaline-pumping ascent up a dry waterfall gorge with massive boulders and vertical chimney climbs directly underneath the 1,800 ft Kokan Kada amphitheater.",
        coordinates: { lat: 19.3512, lng: 73.7420 }
      }
    ],
    highlights: [
      "🌊 Kokan Kada: Colossal 1,800 ft Vertical Curved Amphitheater Cliff",
      "🛕 Kedareshwar Cave: Huge Monolithic Shiva Linga Surrounded by Water",
      "🕉️ 11th-century Harishchandreshwar Temple & Hemadpanthi Architecture",
      "🌄 Taramati Peak: Spectacular Views of Sahyadris & Malshej Ghat",
      "🍛 Freshly Cooked Hot Village Meal at Base Village"
    ],
    fortAttractions: [
      "Kokan Kada (1,800 ft Vertical Curved Cliff)",
      "Kedareshwar Cave & Monolithic Shiva Linga",
      "Harishchandreshwar 11th-century Temple",
      "Taramati Peak (Highest Summit)",
      "Saptatirtha Pushkarni (Sacred Pool)",
      "Ancient Rock-Cut Buddhist Caves",
      "Tolarkhind Ancient Trade Pass"
    ],
    history: "Harishchandragad dates back to the 6th century Kalachuri dynasty, with ancient rock caves sculpted between the 10th and 11th centuries. Great saint Changdev meditated here in the 14th century. The fort was later under Maratha rule from 1747 after being liberated from the Mughals. Its crowning wonder is Kokan Kada, a massive overhang cliff dropping 1,800 feet into the Konkan plains, celebrated for vertical updrafts and rare circular rainbow phenomena (Broken Spectre).",
    howToReach: {
      byTrain: "Suburban train to Kalyan Junction. From Kalyan ST Bus Depot, board any ST bus heading towards Alephata / Ahmednagar via Malshej Ghat and alight at Khubi Phata (5 km from Khireshwar base).",
      byBus: "MSRTC buses from Kalyan to Malshej Ghat and Khubi Phata depart every 45 mins from early morning.",
      byRoad: "From Mumbai (195 km): Mumbai ➔ Thane ➔ Kalyan ➔ Murbad ➔ Saralgaon ➔ Malshej Ghat ➔ Khubi Phata ➔ Turn left along the dam to Khireshwar village (~4.5 hrs). Dedicated parking at base."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Malshej Transit",
        description: "Board the AC trekking bus from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Thane Teen Hath Naka 11:00 PM, Kalyan 11:45 PM. Overnight scenic drive through Murbad and the misty ghats of Malshej to the base village."
      },
      {
        day: 2,
        title: "04:45 AM – Base Village, Kokan Kada & Return",
        description: "04:45 AM: Reach base village (195 km from Mumbai). Freshen up & enjoy hot village Poha with tea. 05:45 AM: Start trek under early dawn sky through forest trails. 09:15 AM: Reach Harishchandreshwar Temple complex & Kedareshwar Cave with its 4 pillars. 10:30 AM – 12:30 PM: Experience the breathtaking amphitheater cliff of Kokan Kada and reverse wind phenomenon. 12:45 PM: Start descent. 02:45 PM: Wholesome village feast at base (Bhakri, Thecha, Dal & Rice). 04:00 PM: Board bus back to Mumbai. 10:00 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 4. KALAVANTIN DURG ──
  {
    slug: "kalavantin-durg-trek",
    name: "Kalavantin Durg Pinnacle Expedition",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "55 km from Mumbai",
    maxAltitude: "686 m (2,250 ft)",
    startPoint: "Thakurwadi Base Village",
    endPoint: "Thakurwadi Base Village",
    baseVillage: "Thakurwadi (ठाकूरवाडी, Panvel)",
    category: "fort",
    difficulty: "moderate",
    images: [
      "/images/treks/kalavantin-durg-trek/1.jpg",
      "/images/treks/kalavantin-durg-trek/2.jpg",
      "/images/treks/kalavantin-durg-trek/3.jpg"
    ],
    coordinates: { lat: 18.9768, lng: 73.1974 },
    weatherStats: {
      temp: "27°C",
      wind: "16 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 7",
      visibility: "17.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Thakurwadi",
        marathiName: "ठाकूरवाडी (मुख्य पायथा)",
        isPrimary: true,
        difficulty: "Moderate to Steep Pinnacle",
        distanceFromBase: "3.5 km",
        trailDuration: "2.5 - 3 Hours",
        popularFor: "Main trailhead from Panvel with official parking and village eateries",
        routeDescription: "Starts at Thakurwadi base parking. Well-marked trail ascends gently to the midway plateau of Prabalmachi (1.5 hrs), followed by the thrilling 80-degree stone-cut stairs up the pinnacle.",
        coordinates: { lat: 18.9768, lng: 73.1974 }
      },
      {
        name: "Prabalmachi (Mid-Station Plateau)",
        marathiName: "प्रबळमाची पठार (मध्य मुक्काम)",
        isPrimary: false,
        difficulty: "Challenging Final Spire",
        distanceFromBase: "1.5 km to Top",
        trailDuration: "1 - 1.5 Hours to Summit",
        popularFor: "Famous high-altitude campsite with stunning views of Kalavantin needle",
        routeDescription: "Elevated plateau village at 1,200 ft with rustic camping huts, village food stalls, and the base for the final rock-cut staircase ascent to the pinnacle.",
        coordinates: { lat: 18.9815, lng: 73.2102 }
      },
      {
        name: "Vardoli / Shedung",
        marathiName: "वरडोली / शेडुंग",
        isPrimary: false,
        difficulty: "Moderate",
        distanceFromBase: "6.0 km",
        trailDuration: "4 Hours",
        popularFor: "Alternate rural route through paddy fields",
        routeDescription: "Climbs up the southern ridge of Prabalgad from near Shedung, meeting the Prabalmachi plateau through dense green canopy.",
        coordinates: { lat: 18.9620, lng: 73.2050 }
      }
    ],
    highlights: [
      "🪜 World-Famous 80-degree Rock-Cut Steps Carved on Narrow Ridge",
      "🧗 Thrilling Pinnacle Summit Ascent with Safety Briefing",
      "🏕️ Prabalmachi Plateau Campsite & Panoramic Sahyadri Views",
      "👁️ 360-degree Lookout over Prabalgad, Irshalgad, and Matheran",
      "🍲 Delicious Village Lunch & Authentic Rural Hospitality"
    ],
    fortAttractions: [
      "80-degree Hand-Carved Rock Stairs",
      "Kalavantin Top Pinnacle & Flagpost",
      "Prabalmachi Plateau Campsite",
      "Views of Prabalgad & Irshalgad",
      "Cave Shelter midway on stairs",
      "Thrilling Ridge Walk"
    ],
    history: "Kalavantin Durg is a dramatic 2,250-foot monolithic rock needle adjacent to Prabalgad. Constructed around 500 BC, folklore recounts that it was named by a local ruler in honour of Queen Kalavantin. The fortress was designed as a strategic surveillance pinnacle to monitor ancient trade routes linking Kalyan port with the Deccan plateau, featuring rock-cut steps carved directly into the vertiginous volcanic ridge without handrails.",
    howToReach: {
      byTrain: "Harbour line suburban train to Panvel Railway Station. From Panvel station (east), local shared autos and ST buses connect to Thakurwadi base village (16 km, 30 mins).",
      byBus: "Direct ST buses connect Panvel ST stand with Thakurwadi base village every 45 mins.",
      byRoad: "From Mumbai (55 km): Sion-Panvel Expressway ➔ Shedung Phata ➔ Panvel-Matheran road ➔ Thakurwadi base village (~1.5 hrs). Paved roads with dedicated parking space."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Base Transit",
        description: "Board private AC vehicle from Mumbai. Pickups: Borivali 10:00 PM, Dadar 10:45 PM, Chembur 11:15 PM, Vashi 11:40 PM, Panvel 12:15 AM. Quick transit to Thakurwadi base village. Rest at Prabalmachi base plateau under starry sky."
      },
      {
        day: 2,
        title: "05:00 AM – Prabalmachi, Pinnacle Stairs & Return",
        description: "05:00 AM: Wake up to crisp mountain air at Prabalmachi. Freshen up and enjoy Misal Pav with hot tea. 06:00 AM: Safety briefing and begin ascending the steep zig-zag stone stairs carved out of the mountain ridge. 07:45 AM: Reach the rocky crown of Kalavantin Durg for 360-degree views of Prabalgad and Sahyadri valleys. 09:30 AM: Carefully descend back to Prabalmachi. 12:30 PM: Savor a delicious home-cooked village lunch (Bhakri, Chicken/Veg curries, Solkadhi). 02:30 PM: Walk down to Thakurwadi base. 03:30 PM: Board vehicle for Mumbai. 06:30 PM – 07:30 PM: Reach Mumbai safely."
      }
    ]
  },

  // ── 5. SUDHAGAD FORT ──
  {
    slug: "sudhagad-fort-trek",
    name: "Sudhagad Fort Historic Expedition (Bhorapgad)",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "110 km from Mumbai",
    maxAltitude: "590 m (1,935 ft)",
    startPoint: "Thakurwadi (Pali) Base",
    endPoint: "Thakurwadi (Pali) Base",
    baseVillage: "Thakurwadi / Dhondse (ठाकूरवाडी, Pali)",
    category: "fort",
    difficulty: "moderate",
    images: [
      "/images/treks/sudhagad-fort-trek/1.jpg",
      "/images/treks/sudhagad-fort-trek/2.jpg",
      "/images/treks/sudhagad-fort-trek/3.jpg"
    ],
    coordinates: { lat: 18.5447, lng: 73.3039 },
    weatherStats: {
      temp: "25°C",
      wind: "15 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 6",
      visibility: "18.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Thakurwadi (Pali)",
        marathiName: "ठाकूरवाडी (मुख्य शिडी मार्ग)",
        isPrimary: true,
        difficulty: "Easy to Moderate",
        distanceFromBase: "4.5 km",
        trailDuration: "2 - 2.5 Hours",
        popularFor: "Most popular approach with iron ladders installed in rock clefts",
        routeDescription: "Starts at Thakurwadi village near Pali. Path winds through shaded deciduous woods and climbs sturdy iron ladders installed on steep rock steps leading to the grand Maha Darwaja.",
        coordinates: { lat: 18.5447, lng: 73.3039 }
      },
      {
        name: "Dhondse",
        marathiName: "धोंडसे (दिंडी दरवाजा मार्ग)",
        isPrimary: false,
        difficulty: "Moderate",
        distanceFromBase: "5.5 km",
        trailDuration: "3 Hours",
        popularFor: "Scenic forested trail entering through historic Dindi Darwaja",
        routeDescription: "Approaches the fort from the north-western side through dense foliage and rocky paths, entering via the secret Dindi Darwaja (sally port).",
        coordinates: { lat: 18.5580, lng: 73.2950 }
      },
      {
        name: "Pachhapur / Vavoshi",
        marathiName: "पाछापूर / वावोशी",
        isPrimary: false,
        difficulty: "Easy",
        distanceFromBase: "6.0 km",
        trailDuration: "3.5 Hours",
        popularFor: "Gentle historical trail passing ancient water tanks",
        routeDescription: "Gradual countryside trail through rustic farmlands and forested knolls, ideal for beginners and birdwatching enthusiasts.",
        coordinates: { lat: 18.5350, lng: 73.3150 }
      }
    ],
    highlights: [
      "🚪 Grand Maha Darwaja (Architectural Twin of Raigad's Gate)",
      "🛕 Ancient Bhorai Devi Temple & Intact Pant Sachiv Royal Palace",
      "🪜 Adventurous Iron Ladder Ascent through Rocky Clefts",
      "🌊 Hathitak & Secret Freshwater Lakes atop Plateau",
      "🙏 Optional Darshan at Ballaleshwar Pali Ganpati (Ashtavinayak)"
    ],
    fortAttractions: [
      "Maha Darwaja (Twin of Raigad's Grand Portal)",
      "Bhorai Devi Ancient Temple",
      "Pant Sachiv Wada (Historic Royal Palace)",
      "Hathitak (Secret Water Lake)",
      "Dindi Darwaja (Steep Secret Sally Port)",
      "Takmak Tok Viewpoint",
      "Two Intact Stone Tombs"
    ],
    history: "Sudhagad, formerly known as Bhorapgad after patron goddess Bhorai Devi, was conquered by Chhatrapati Shivaji Maharaj from the Nizamshahi in 1657 and named Sudhagad ('The Pure Fort'). Shivaji Maharaj was so taken by its defensive qualities and expansive table-top plateau that he considered it for the Maratha capital before ultimately choosing Raigad. The fort later served as an administrative center under the Pant Sachiv of Bhor.",
    howToReach: {
      byTrain: "Suburban train to Khopoli or Konkan railway to Roha. From Khopoli/Roha, take an ST bus to Pali town (30 km), then a shared auto to Thakurwadi / Dhondse base village (11 km).",
      byBus: "Direct MSRTC buses ply from Mumbai (Parel / Borivali) to Pali Ganpati. From Pali, autos take you to Thakurwadi base in 20 minutes.",
      byRoad: "From Mumbai (110 km): Mumbai-Pune Expressway ➔ Exit at Khopoli / Khalapur ➔ Khopoli-Pali highway ➔ Near Pali turn towards Dhondse/Thakurwadi (~2.5 hrs). Easy parking at base."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Pali Transit",
        description: "Board the AC trekking bus from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Smooth overnight ride via Mumbai-Pune Expressway and Khopoli-Pali Highway."
      },
      {
        day: 2,
        title: "04:00 AM – Thakurwadi Base, Plateau Tour & Return",
        description: "04:00 AM: Reach Thakurwadi (Pali) base village (110 km from Mumbai). Freshen up at local villager's home. 05:30 AM: Enjoy hot Poha, Upma, and ginger chai. 06:15 AM: Begin trek through lush foothills and climb the sturdy iron ladders on rock clefts. 08:30 AM: Enter the grand Maha Darwaja. 08:30 AM – 01:00 PM: Explore Bhorai Devi Temple, Pant Sachiv Wada palace, Dindi Darwaja, and two serene freshwater lakes. 01:00 PM: Descend to base village. 02:45 PM: Wholesome rustic lunch (Bhakri, Pithla, Thecha & Sabzi). 03:45 PM: Optional quick darshan at Ballaleshwar Pali Ganpati. 04:45 PM: Depart for Mumbai. 09:00 PM: Arrive in Mumbai."
      }
    ]
  }
];

async function updateFullTreks() {
  console.log('Writing comprehensive Durg data with multiple base villages & real photos to Firestore...');
  for (const trek of TREKS_FULL_DATA) {
    const snap = await db.collection('treks').where('slug', '==', trek.slug).get();
    if (!snap.empty) {
      const docRef = snap.docs[0].ref;
      await docRef.set({
        ...snap.docs[0].data(),
        ...trek,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`✅ Fully updated ${trek.slug} with multiple base villages & real photos!`);
    } else {
      console.warn(`⚠️ Slug not found: ${trek.slug}`);
    }
  }
  console.log('All 5 treks successfully updated in Firestore with rich photos & multiple base villages!');
}

updateFullTreks().catch(console.error);
