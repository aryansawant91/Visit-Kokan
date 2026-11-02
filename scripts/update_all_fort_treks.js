/**
 * Comprehensive real Sahyadri Fort & Trek data script
 * Updates all remaining treks in Firestore with Durg-style rich information:
 * - Real History
 * - Multiple Base Villages (Primary & Alternate trails, distance, duration, route description, GPS)
 * - How to reach (by Road, by Train, by Bus)
 * - Fort Attractions & Highlights
 * - Mountain Weather Stats
 * - 10:00 PM Mumbai Departure Itinerary
 * - Standard ₹1,499 pricing with ₹750 advance
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

const TREKS_REAL_DATA = [
  // ── 1. RAJGAD FORT ──
  {
    slug: "rajgad-fort-trek",
    name: "Rajgad Fort Sovereign Citadel (King of Forts)",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "215 km from Mumbai",
    maxAltitude: "1,376 m (4,514 ft)",
    elevation: "1,376 m (4,514 ft)",
    startPoint: "Gunjavane Base Village",
    endPoint: "Gunjavane Base Village",
    baseVillage: "Gunjavane (गुंजवणे, Pune)",
    category: "fort",
    difficulty: "moderate",
    weatherStats: {
      temp: "22°C",
      wind: "18 km/h Wind",
      rainProb: "15% Rain (24h)",
      uv: "UV 6",
      visibility: "18.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Gunjavane",
        marathiName: "गुंजवणे (चोर दरवाजा मार्ग)",
        isPrimary: true,
        difficulty: "Moderate to Challenging",
        distanceFromBase: "5.5 km",
        trailDuration: "3.5 - 4 Hours",
        popularFor: "Most popular trekking route ascending directly to Padmavati Machi via Chor Darwaja",
        routeDescription: "Starts from Gunjavane village temple. A steep, scenic ascent climbs along a mountain ridge through teak forests, followed by a thrilling rock patch with iron railings leading directly into Chor Darwaja of Padmavati Machi.",
        coordinates: { lat: 18.2562, lng: 73.6821 }
      },
      {
        name: "Pali",
        marathiName: "पाली (पाली दरवाजा राजवाट मार्ग)",
        isPrimary: false,
        difficulty: "Easy to Moderate",
        distanceFromBase: "4.5 km",
        trailDuration: "2.5 - 3 Hours",
        popularFor: "Historic royal road (Rajmarga) with wide stone steps, suitable for families and beginners",
        routeDescription: "Starts from Pali base village. A gradual, well-paved stone staircase passes through ancient bastions and enters through the massive, fortified Pali Darwaja.",
        coordinates: { lat: 18.2618, lng: 73.6554 }
      },
      {
        name: "Bhutonde",
        marathiName: "भुतोंडे (आळू दरवाजा मार्ग)",
        isPrimary: false,
        difficulty: "Moderate",
        distanceFromBase: "6.0 km",
        trailDuration: "3.5 Hours",
        popularFor: "Offbeat peaceful trail climbing to Sanjeevani Machi",
        routeDescription: "Approaches the fort from the southern valley, ascending through quiet forests and reaching the double-walled fortifications of Sanjeevani Machi.",
        coordinates: { lat: 18.2312, lng: 73.6678 }
      }
    ],
    highlights: [
      "🚩 Capital of Hindavi Swarajya for over 26 glorious years under Chhatrapati Shivaji Maharaj",
      "🏰 Majestic Balekilla with ancient Maha Darwaja perched at 4,514 ft",
      "🦅 Spectacular Suvela Machi with natural rock hole (Nedhe) & elephant-trunk bastion",
      "🛡️ Impenetrable double-walled defensive architecture of Sanjeevani Machi",
      "🍛 Traditional Maharashtrian village lunch (Pithla Bhakri & Thecha) at base"
    ],
    fortAttractions: [
      "Padmavati Temple & Padmavati Lake",
      "Balekilla (Supreme Citadel) & Maha Darwaja",
      "Suvela Machi & Nedhe (Rock Needle Hole)",
      "Sanjeevani Machi (Double-layered Bastions)",
      "Chor Darwaja & Pali Darwaja",
      "Saibai's Memorial Tomb",
      "Alu Darwaja & Gunjavane Darwaja"
    ],
    history: "Rajgad, rightfully hailed as 'The King of Forts' (दुर्गांचा राजा, राजांचा दुर्ग), served as the first sovereign capital of the Maratha Empire under Chhatrapati Shivaji Maharaj for more than 26 years before shifting to Raigad. Shivaji Maharaj personally oversaw the redesign and fortification of its three grand plateaus: Padmavati Machi, Suvela Machi, and Sanjeevani Machi, crowned by the soaring Balekilla. It was from Rajgad that Shivaji Maharaj planned his famous military campaigns, celebrated the birth of Rajaram Maharaj, and returned victoriously after escaping from Agra in 1666.",
    howToReach: {
      byTrain: "Nearest major railway station is Pune Junction (60 km). From Pune, take an MSRTC bus from Swargate to Nasrapur/Velhe or Gunjavane.",
      byBus: "MSRTC buses ply regularly from Swargate Bus Stand (Pune) towards Velhe and Gunjavane.",
      byRoad: "From Mumbai (215 km): Drive via Mumbai-Pune Expressway ➔ Katraj Bypass ➔ NH48 towards Satara ➔ Turn right at Nasrapur Phata ➔ Drive towards Gunjavane or Pali base village (~4.5 hrs). Dedicated parking available at Gunjavane base."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Transit",
        description: "Board private AC trekking bus from Mumbai. Pickups: Borivali (National Park) 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli / Panvel 11:55 PM. Overnight scenic cruise via Mumbai-Pune Expressway & NH48 towards Gunjavane."
      },
      {
        day: 2,
        title: "04:30 AM – Gunjavane Base, Summit Ascent & Return",
        description: "04:30 AM: Arrive at Gunjavane base village (215 km from Mumbai). Freshen up & enjoy hot Kanda Poha / Misal Pav with ginger tea. 05:30 AM: Trek briefing and start ascent via Chor Darwaja route. 08:30 AM: Reach Padmavati Machi and explore Padmavati Temple, Lake & Saibai's Tomb. 09:30 AM - 12:30 PM: Climb Balekilla and traverse to Suvela Machi to witness Nedhe. 12:30 PM: Start descent back to Gunjavane. 02:45 PM: Relish authentic village lunch (Pithla Bhakri, Thecha & Solkadhi). 03:45 PM: Start return journey to Mumbai. 09:30 PM - 10:30 PM: Reach Mumbai."
      }
    ]
  },

  // ── 2. KALSUBAI PEAK ──
  {
    slug: "kalsubai-peak-trek",
    name: "Kalsubai Peak Trek (Everest of Maharashtra)",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "155 km from Mumbai",
    maxAltitude: "1,646 m (5,400 ft)",
    elevation: "1,646 m (5,400 ft)",
    startPoint: "Bari Base Village",
    endPoint: "Bari Base Village",
    baseVillage: "Bari (बारी, Igatpuri)",
    category: "fort",
    difficulty: "moderate",
    weatherStats: {
      temp: "19°C",
      wind: "22 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 7",
      visibility: "22.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Bari",
        marathiName: "बारी (मुख्य शिडी मार्ग)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "6.6 km",
        trailDuration: "3.5 - 4 Hours",
        popularFor: "Standard, secure route equipped with four sturdy steel ladders over vertical rock patches",
        routeDescription: "Starts from Bari village temple. The path passes through fertile paddy fields, ascends through a stream bed and forest, and reaches four well-engineered iron ladder sections anchored into sheer rock cliffs before reaching the peak.",
        coordinates: { lat: 19.5991, lng: 73.7124 }
      },
      {
        name: "Udadhawane",
        marathiName: "उदाधवणे (वन्य मार्ग)",
        isPrimary: false,
        difficulty: "Challenging",
        distanceFromBase: "7.5 km",
        trailDuration: "4.5 Hours",
        popularFor: "Offbeat forest ridge route for seasoned trekkers seeking solitude",
        routeDescription: "Approaches the massif from the southern ridge, ascending through dense deciduous forest and connecting to the main ridgeline below the summit.",
        coordinates: { lat: 19.5784, lng: 73.7291 }
      }
    ],
    highlights: [
      "🏔️ Highest Peak in Maharashtra standing tall at an iconic 1,646 m (5,400 ft)",
      "🧗 Thrilling Iron Ladder Climbs across near-vertical Sahyadri rock steps",
      "🛕 Historic Kalsubai Devi Temple and panoramic 360° summit views",
      "🌅 Breathtaking sight of Bhandardara Arthur Lake, Alang-Madan-Kulang & Ratangad",
      "🍛 Hearty local Maharashtrian breakfast & lunch at Bari village"
    ],
    fortAttractions: [
      "Kalsubai Devi Temple at the Summit",
      "Four Sturdy Iron Ladder Sections",
      "Panoramic Views of Bhandardara (Arthur Lake)",
      "Views of AMK Forts, Ratangad, Ajoba & Harishchandragad",
      "Natural Fresh Mountain Springs",
      "Traditional Bari Village Stalls with Nimbu Pani & Tea"
    ],
    history: "Kalsubai Peak is named after Kalsu, a revered tribal girl from the local Mahadeo Koli community. According to folklore, Kalsu fled to the summit to escape servitude, meditated on the high peak, and attained spiritual liberation. Today, a sacred stone shrine dedicated to Kalsu Bai crowns the very pinnacle of Maharashtra. British colonial surveyors in the 19th century used Kalsubai as a prime trigonometrical station across the Western Ghats because of its unparalleled line of sight over 50 kilometers in every direction.",
    howToReach: {
      byTrain: "Nearest major railway station is Igatpuri (32 km) or Kasara (60 km) on the Central Railway line. Local sharing jeeps and buses run directly from Kasara and Igatpuri to Bari village.",
      byBus: "MSRTC buses from Kasara, Igatpuri, and Akole halt at Bari village on the Ghoti-Bhandardara road.",
      byRoad: "From Mumbai (155 km): Take NH160 (Mumbai-Nashik Highway) ➔ Cross Kasara Ghat ➔ Turn right at Ghoti onto the Ghoti-Bhandardara Road ➔ Reach Bari village (~3.5 hrs). Dedicated vehicle parking is available at the village school."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Drive",
        description: "Board AC trekking bus from Mumbai. Pickups: Borivali (National Park) 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Thane (Teen Hath Naka) 11:15 PM, Kalyan Bypass 11:45 PM. Overnight scenic drive along NH160 via Kasara Ghat to Bari base village."
      },
      {
        day: 2,
        title: "03:30 AM – Bari Base, Summit Sunrise & Return",
        description: "03:30 AM: Arrive at Bari base village (155 km from Mumbai). Freshen up and enjoy steaming hot Poha & tea. 04:30 AM: Start ascent under the stars with headlamps. 06:45 AM: Reach the summit to witness an unforgettable golden sunrise over Bhandardara Dam and the Sahyadri sea of clouds. 08:30 AM: Pay respects at Kalsubai Devi Temple and photograph surrounding peaks. 09:30 AM: Begin careful descent via ladder sections. 12:30 PM: Reach Bari village. 01:30 PM: Authentic rustic lunch (Bhakri, Pithla, Thecha, Dal & Rice). 03:00 PM: Depart for Mumbai. 08:30 PM - 09:30 PM: Arrive back in Mumbai."
      }
    ]
  },

  // ── 3. PRATAPGAD FORT ──
  {
    slug: "pratapgad-fort-trek",
    name: "Pratapgad Fort Battlefield & Heritage Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "220 km from Mumbai",
    maxAltitude: "1,080 m (3,540 ft)",
    elevation: "1,080 m (3,540 ft)",
    startPoint: "Kumbhroshi Base Village",
    endPoint: "Kumbhroshi Base Village",
    baseVillage: "Kumbhroshi (कुंभ्रोशी, Mahabaleshwar)",
    category: "fort",
    difficulty: "easy",
    weatherStats: {
      temp: "21°C",
      wind: "12 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 5",
      visibility: "20.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Kumbhroshi",
        marathiName: "कुंभ्रोशी (मुख्य पायथा)",
        isPrimary: true,
        difficulty: "Easy (Paved Stone Steps)",
        distanceFromBase: "3.5 km",
        trailDuration: "2 Hours",
        popularFor: "Primary gateway with parking, souvenir shops, and well-maintained stairs to the Lower and Upper Fort",
        routeDescription: "Starts at the Kumbhroshi fort parking ground. Broad stone stairs pass through Mahadarwaja, Bhavani Mata Temple, and climb to the Balekilla and equestrian statue of Shivaji Maharaj.",
        coordinates: { lat: 17.9333, lng: 73.5833 }
      },
      {
        name: "Tehbaji",
        marathiName: "तेहबाजी (जंगल पायवाट)",
        isPrimary: false,
        difficulty: "Moderate",
        distanceFromBase: "5.0 km",
        trailDuration: "2.5 Hours",
        popularFor: "Historic jungle trail ascending through the dense Jawali forest valley",
        routeDescription: "Traverses through the thick, pristine semi-evergreen canopy of Jawali, approaching the eastern ramparts and entering near the water cisterns.",
        coordinates: { lat: 17.9412, lng: 73.5714 }
      }
    ],
    highlights: [
      "🚩 Iconic site of the historic Battle of Pratapgad (1659) where Shivaji Maharaj vanquished Afzal Khan",
      "🛕 Sacred Bhavani Mata Temple enshrining the original deity brought by Shivaji Maharaj",
      "⚔️ Magnificent Equestrian Statue of Chhatrapati Shivaji Maharaj unveiled by Pt. Jawaharlal Nehru in 1957",
      "🌲 Dramatic views over the dense, mystical Jawali Valley and the Konkan coastline",
      "🍛 Authentic Mahabaleshwar strawberries & Konkani village feast"
    ],
    fortAttractions: [
      "Maha Darwaja (Grand Fort Entrance)",
      "Bhavani Mata Temple & Sacred Sword Hall",
      "Shivaji Maharaj Bronze Equestrian Statue",
      "Afzal Khan Tomb & Tower of Victory",
      "Balekilla & Kedareshwar Temple",
      "Redka Bastion & Deep Valley Lookouts",
      "Ancient Rainwater Reservoirs & Ramparts"
    ],
    history: "Commissioned by Chhatrapati Shivaji Maharaj and built in 1656 by his Prime Minister Moropant Trimbak Pingle, Pratapgad was strategically constructed to command the impenetrable Jawali forest and guard the Bhor Ghat. On 10 November 1659, Pratapgad witnessed one of the most famous encounters in Indian military history: Shivaji Maharaj met the towering Adil Shahi general Afzal Khan in a truce tent below the ramparts. When Afzal Khan attempted assassination, Maharaj slayed him using tiger claws (Wagh Nakh) and bichwa, completely routing the Adil Shahi army in the ensuing Battle of Pratapgad.",
    howToReach: {
      byTrain: "Nearest railway station is Veer (65 km) on Konkan Railway or Pune Junction (140 km). Regular buses and taxis connect Mahabaleshwar and Pratapgad.",
      byBus: "MSRTC state transport buses run directly to Pratapgad base from Mahabaleshwar (21 km) and Poladpur (24 km).",
      byRoad: "From Mumbai (220 km): Follow NH66 (Mumbai-Goa Highway) ➔ Mahad ➔ Poladpur ➔ Turn left onto SH72 towards Mahabaleshwar ➔ Reach Kumbhroshi village (~4.5 hrs). Large dedicated parking lot available at the fort base."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Highway Drive",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali (National Park) 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Panvel 11:55 PM. Overnight smooth transit along NH66 via Mangaon and Poladpur."
      },
      {
        day: 2,
        title: "05:00 AM – Kumbhroshi Base, Heritage Walk & Return",
        description: "05:00 AM: Arrive at Kumbhroshi base. Freshen up and relish piping hot Misal Pav, Poha, and tea. 06:15 AM: Begin climb up the scenic stone steps in crisp mountain air. 07:45 AM: Enter Maha Darwaja and take blessings at Bhavani Mata Temple. 08:30 AM - 12:30 PM: Comprehensive historical tour of Balekilla, the Shivaji Maharaj statue, the battlefield lookouts, and Afzal Khan's encounter site. 12:30 PM: Descend to base. 01:30 PM: Wholesome local lunch featuring fresh village delicacies and seasonal strawberries. 03:00 PM: Depart for Mumbai. 09:30 PM - 10:30 PM: Return to Mumbai."
      }
    ]
  },

  // ── 4. LOHAGAD FORT ──
  {
    slug: "lohagad-fort-trek",
    name: "Lohagad Fort & Vinchukata Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "95 km from Mumbai",
    maxAltitude: "1,033 m (3,389 ft)",
    elevation: "1,033 m (3,389 ft)",
    startPoint: "Malavali / Lohagadwadi Base",
    endPoint: "Malavali / Lohagadwadi Base",
    baseVillage: "Lohagadwadi (लोहगडवाडी, Maval, Pune)",
    category: "fort",
    difficulty: "easy",
    weatherStats: {
      temp: "24°C",
      wind: "16 km/h Wind",
      rainProb: "12% Rain (24h)",
      uv: "UV 6",
      visibility: "19.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Lohagadwadi",
        marathiName: "लोहगडवाडी (किल्ला पायथा)",
        isPrimary: true,
        difficulty: "Easy (Paved Stairs)",
        distanceFromBase: "2.5 km",
        trailDuration: "1.5 Hours",
        popularFor: "Direct paved staircase route starting from the hilltop village with parking and snack stalls",
        routeDescription: "Starts at Lohagadwadi village. A wide, secure stone staircase passes through Ganesh Darwaja, Narayan Darwaja, Hanuman Darwaja, and Maha Darwaja to reach the summit plateau.",
        coordinates: { lat: 18.7001, lng: 73.4792 }
      },
      {
        name: "Malavali",
        marathiName: "मळवली (रेल्वे स्टेशन पायवाट)",
        isPrimary: false,
        difficulty: "Moderate",
        distanceFromBase: "7.0 km",
        trailDuration: "3 Hours",
        popularFor: "Full classic trek starting from Malavali railway station via Bhaja Caves and Ghaat road",
        routeDescription: "Starts at Malavali railway station. Trekkers walk past ancient Bhaja Buddhist Caves, climb through scenic winding mud trails, reach Lohagadwadi plateau, and ascend to the fort.",
        coordinates: { lat: 18.7245, lng: 73.4981 }
      }
    ],
    highlights: [
      "🦂 Iconic Vinchukata (Scorpion's Tail) – a dramatic 1.5 km long knife-edge fortification ridge",
      "🚪 Four Grand, Intact Gates: Ganesh, Narayan, Hanuman, and Maha Darwaja",
      "🏛️ Ancient Laxmi Kothi Cave & underground Maratha treasury vault",
      "🌊 Panoramic vistas overlooking Pawna Lake, Visapur Fort, and the Maval valleys",
      "🍛 Authentic village lunch at Lohagadwadi base"
    ],
    fortAttractions: [
      "Vinchukata (Scorpion-tail Promontory)",
      "Maha Darwaja with intricate Maratha carvings",
      "Laxmi Kothi (Multi-roomed Rock Cave)",
      "Sixteen-sided Stepwell (Sola Koni Talav)",
      "Ganesh, Narayan & Hanuman Darwajas",
      "Tomb of Chhatrapati Shivaji's Officer",
      "Direct birds-eye view of sister fort Visapur"
    ],
    history: "Lohagad ('The Iron Fort') has a rich recorded history dating back over two millennia, having been occupied by the Satavahanas, Chalukyas, Rashtrakutas, and Bahmanis before its capture by Chhatrapati Shivaji Maharaj in 1648. Maharaj utilized Lohagad to secure the immense wealth obtained from the looting of Surat in 1670. Later during the Peshwa era, Nana Phadnavis refortified Lohagad, building the famous stepwell and using the secure fort as his primary treasury and monsoon residence.",
    howToReach: {
      byTrain: "Nearest railway station is Malavali (5 km), easily accessible by suburban local trains from Pune and Lonavala (just 2 stops from Lonavala).",
      byBus: "Local auto-rickshaws and jeeps connect Malavali Station and Lonavala to Lohagadwadi base.",
      byRoad: "From Mumbai (95 km): Drive via Mumbai-Pune Expressway ➔ Take Lonavala/Khandala Exit ➔ Drive towards Malavali & Bhaja Caves ➔ Ascend ghat road to Lohagadwadi parking (~2 hrs)."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Easy Expressway Drive",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali (National Park) 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Relaxed drive along Mumbai-Pune Expressway towards Lonavala."
      },
      {
        day: 2,
        title: "05:00 AM – Lohagadwadi Base, Vinchukata Walk & Return",
        description: "05:00 AM: Arrive at Lohagadwadi base. Enjoy refreshing morning tea and hot Kanda Poha. 06:00 AM: Start morning climb up the iconic stone gates. 07:15 AM: Reach the summit plateau. 07:30 AM - 11:30 AM: Walk the exhilarating 1.5 km Vinchukata ridge, explore Laxmi Kothi cave, and photograph Pawna Lake below. 12:00 PM: Descend to base. 01:15 PM: Traditional village lunch (Pithla Bhakri, Thecha & Rice). 02:45 PM: Optional stop at Bhaja Caves. 04:00 PM: Depart for Mumbai. 08:30 PM: Arrive back in Mumbai."
      }
    ]
  },

  // ── 5. RATANGAD FORT ──
  {
    slug: "ratangad-fort-trek",
    name: "Ratangad Fort (Jewel of the Sahyadris)",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "180 km from Mumbai",
    maxAltitude: "1,297 m (4,255 ft)",
    elevation: "1,297 m (4,255 ft)",
    startPoint: "Ratanwadi Base Village",
    endPoint: "Ratanwadi Base Village",
    baseVillage: "Ratanwadi (रतनवाडी, Ahmednagar)",
    category: "fort",
    difficulty: "moderate",
    weatherStats: {
      temp: "20°C",
      wind: "19 km/h Wind",
      rainProb: "15% Rain (24h)",
      uv: "UV 6",
      visibility: "21.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Ratanwadi",
        marathiName: "रतनवाडी (अमृतेश्वर मंदिर मार्ग)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "5.5 km",
        trailDuration: "3.5 Hours",
        popularFor: "Historic base home to the 1,200-year-old Amruteshwar Temple and the most scenic ladder trail",
        routeDescription: "Starts at the ancient Amruteshwar Temple in Ratanwadi. The trail winds through Pravara river streams, climbs through dense forest canopy, and features two iron ladder sections leading to the Ganesh Darwaja of Ratangad.",
        coordinates: { lat: 19.5083, lng: 73.7083 }
      },
      {
        name: "Samrad",
        marathiName: "साम्रद (त्र्यंबक दरवाजा मार्ग)",
        isPrimary: false,
        difficulty: "Challenging",
        distanceFromBase: "7.0 km",
        trailDuration: "4 Hours",
        popularFor: "Offbeat ridge trek connecting the Sandhan Valley region to Ratangad via Tryambak Darwaja",
        routeDescription: "Approaches the fort from the north-west, climbing along rocky terrain and entering the fort through the rock-cut Tryambak Darwaja.",
        coordinates: { lat: 19.5218, lng: 73.6912 }
      }
    ],
    highlights: [
      "🪡 'Nedhe' (Eye of the Needle) – a gigantic natural rock cavity carved into the mountain summit by winds",
      "🌊 Origin site of the sacred Pravara River (Amritvahini)",
      "🛕 Visit to the 1,200-year-old Hemadpanthi Amruteshwar Shiva Temple with exquisite stone carvings",
      "🪜 Sturdy iron ladder sections ascending through dramatic rock clefts",
      "🍲 Authentic rustic Maharashtrian feast cooked by Ratanwadi villagers"
    ],
    fortAttractions: [
      "Nedhe (Natural Wind-carved Rock Cavity)",
      "Ganesh Darwaja & Tryambak Darwaja",
      "Rani Mahal (Queen's Palace Ruins)",
      "Kalyan Darwaja with sweeping Konkan views",
      "Ancient Rock-Cut Water Cisterns",
      "1,200-year-old Amruteshwar Shiva Temple",
      "Arthur Lake & Bhandardara backwaters view"
    ],
    history: "Ratangad, meaning 'The Jewel of Forts', is an ancient 400-year-old fortress nestled at 4,255 ft in the Kalsubai-Harishchandragad wildlife reserve. It was captured by Chhatrapati Shivaji Maharaj from the Mughals, and Maharaj frequently rested here during his campaigns due to its natural water reservoirs and impregnable natural rock defenses. Its crowning feature, the 'Nedhe' (Eye of the Needle), is a natural hollow needle hole large enough for twenty people to sit inside, created by millions of years of howling wind erosion.",
    howToReach: {
      byTrain: "Nearest railway station is Igatpuri (45 km) or Kasara (75 km). From Igatpuri, local buses or private jeeps travel to Shendi (Bhandardara) and Ratanwadi.",
      byBus: "MSRTC buses ply from Igatpuri to Shendi / Ratanwadi. Boat ferries across Bhandardara lake are also available from Arthur Lake to Ratanwadi.",
      byRoad: "From Mumbai (180 km): Follow NH160 via Kasara Ghat to Ghoti ➔ Turn onto Ghoti-Bhandardara Road ➔ Cross Shendi around Arthur Lake ➔ Reach Ratanwadi base village (~4.5 hrs)."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Mountain Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali (National Park) 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Thane (Teen Hath Naka) 11:15 PM, Kalyan Bypass 11:45 PM. Overnight scenic drive along NH160 via Kasara Ghat towards Bhandardara."
      },
      {
        day: 2,
        title: "04:30 AM – Ratanwadi Base, Nedhe Exploration & Return",
        description: "04:30 AM: Arrive at Ratanwadi base. Freshen up and enjoy hot Poha and tea near Amruteshwar Temple. 05:30 AM: Start trek under early dawn sky through river beds and forest canopy. 08:30 AM: Ascend the iron ladders and enter through Ganesh Darwaja. 08:45 AM - 12:30 PM: Sit inside the miraculous Nedhe (Eye of the Needle) with mountain winds roaring through, explore Rani Mahal, water tanks, and Amruteshwar Temple. 12:30 PM: Start descent to Ratanwadi. 02:30 PM: Hearty village lunch (Bhakri, Thecha, Dal & seasonal sabzi). 03:45 PM: Depart for Mumbai. 09:30 PM - 10:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 6. SHIVNERI FORT ──
  {
    slug: "shivneri-fort-trek",
    name: "Shivneri Fort Sacred Birthplace Pilgrimage",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "160 km from Mumbai",
    maxAltitude: "1,067 m (3,500 ft)",
    elevation: "1,067 m (3,500 ft)",
    startPoint: "Junnar Base",
    endPoint: "Junnar Base",
    baseVillage: "Junnar (जुन्नर, Pune)",
    category: "fort",
    difficulty: "easy",
    weatherStats: {
      temp: "23°C",
      wind: "14 km/h Wind",
      rainProb: "8% Rain (24h)",
      uv: "UV 6",
      visibility: "20.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Junnar (Main Gate)",
        marathiName: "जुन्नर मुख्य पायऱ्यांचा मार्ग (सात दरवाजे)",
        isPrimary: true,
        difficulty: "Easy (Paved Stone Steps)",
        distanceFromBase: "3.5 km",
        trailDuration: "2 Hours",
        popularFor: "Grand royal approach passing through seven magnificent defensive gates to the birthplace memorial",
        routeDescription: "Starts at the southern base near Junnar town. Paved stone stairs pass consecutively through Maha Darwaja, Pir Darwaja, Parwangi Darwaja, Hathi Darwaja, Fatak Darwaja, Kulambkar Darwaja, and Shiva Darwaja.",
        coordinates: { lat: 19.1983, lng: 73.8583 }
      },
      {
        name: "Shakhai Path",
        marathiName: "साखळी मार्ग (खडा कातळ ट्रेक)",
        isPrimary: false,
        difficulty: "Moderate to Challenging",
        distanceFromBase: "3.0 km",
        trailDuration: "2 Hours",
        popularFor: "Thrilling iron chain and ladder climb up the western cliff face for adventure enthusiasts",
        routeDescription: "Starts from the western side of the hill, climbing a steep rock face equipped with sturdy iron chains and handholds, entering near Badami Talav.",
        coordinates: { lat: 19.2014, lng: 73.8512 }
      }
    ],
    highlights: [
      "🚩 Sacred Birthplace of Chhatrapati Shivaji Maharaj (born 19 February 1630)",
      "🚪 Seven Grand Historic Gates built with formidable Maratha defensive engineering",
      "🛕 Ancient Shivai Devi Temple after whom Shivaji Maharaj was named by Jijabai",
      "🏛️ Beautifully preserved Birthplace Hall & Badami Talav lake",
      "🍲 Authentic Junnar-style rural Maharashtrian feast"
    ],
    fortAttractions: [
      "Shivaji Maharaj Birthplace Hall (जन्मस्थान दालन)",
      "Shivai Devi Temple (शिवाई देवी मंदिर)",
      "Seven Grand Stone Gates (सात महादरवाजे)",
      "Badami Talav (Almond-shaped Water Reservoir)",
      "Amberkhana (Historic Grain Granary)",
      "Kadelot Point (Execution Cliff Lookout)",
      "Ganga-Jamuna Ancient Freshwater Cisterns"
    ],
    history: "Shivneri Fort holds the most sacred place in Maratha history as the revered birthplace of Chhatrapati Shivaji Maharaj, born on 19 February 1630. His mother, Rajmata Jijabai, prayed to the resident goddess Shivai Devi for a virtuous son, naming the child 'Shivaji' in her honor. The fort's triangular hill with near-vertical cliffs on all three sides made it practically invincible. It boasts seven consecutive fortified gateways, massive rock-cut Buddhist caves dating from the 1st century BC, and fresh perennial water springs.",
    howToReach: {
      byTrain: "Nearest railway station is Pune Junction (90 km) or Kalyan Junction (95 km). Direct buses and taxis operate between Kalyan/Pune and Junnar.",
      byBus: "MSRTC buses run frequently from Mumbai, Kalyan, Thane, and Pune (Shivajinagar) to Junnar Bus Stand (just 2 km from the fort).",
      byRoad: "From Mumbai (160 km): Take NH61 via Kalyan ➔ Murbad ➔ Malshej Ghat ➔ Alephata bypass ➔ Junnar (~4 hrs). Paved roads lead directly to the main foot of the fort with ample parking."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure via Scenic Malshej Route",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Thane 11:15 PM, Kalyan 11:45 PM. Overnight scenic drive through Kalyan, Murbad, and Malshej Ghat to Junnar."
      },
      {
        day: 2,
        title: "05:00 AM – Junnar Base, Pilgrimage Walk & Return",
        description: "05:00 AM: Arrive at Junnar base. Freshen up and enjoy breakfast with tea. 06:15 AM: Begin ascent through the seven majestic gates in the cool morning air. 07:45 AM: Pay homage at the sacred Birthplace Memorial of Shivaji Maharaj and take blessings at Shivai Devi Temple. 08:30 AM - 12:00 PM: Explore Badami Talav, Amberkhana granary, Kadelot Point, and Buddhist caves. 12:30 PM: Descend to base. 01:30 PM: Wholesome traditional Maharashtrian lunch. 03:00 PM: Return drive to Mumbai. 08:30 PM - 09:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 7. VISAPUR FORT ──
  {
    slug: "visapur-fort-trek",
    name: "Visapur Waterfall Steps Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "100 km from Mumbai",
    maxAltitude: "1,084 m (3,556 ft)",
    elevation: "1,084 m (3,556 ft)",
    startPoint: "Bhaje Base Village",
    endPoint: "Bhaje Base Village",
    baseVillage: "Bhaje (भाजे, Lonavala)",
    category: "waterfall",
    difficulty: "moderate",
    weatherStats: {
      temp: "23°C",
      wind: "17 km/h Wind",
      rainProb: "20% Rain (24h)",
      uv: "UV 6",
      visibility: "18.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Bhaje Waterfall Route",
        marathiName: "भाजे (धबधब्याच्या पायऱ्यांचा मार्ग)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "4.5 km",
        trailDuration: "2.5 - 3 Hours",
        popularFor: "Famous monsoon trail where fresh mountain streams flow down the stone staircase like a living waterfall",
        routeDescription: "Starts from Bhaje village near the Buddhist caves. The trail ascends through dense forest, enters a boulder-strewn stream bed, and climbs ancient stone stairs through cascading mountain water directly to the fort gate.",
        coordinates: { lat: 18.7183, lng: 73.4883 }
      },
      {
        name: "Patan",
        marathiName: "पाटण (जंगल पायवाट)",
        isPrimary: false,
        difficulty: "Moderate",
        distanceFromBase: "5.0 km",
        trailDuration: "3 Hours",
        popularFor: "Peaceful route ascending the southern slopes with scenic valley views",
        routeDescription: "Starts from Patan village near Pawna Lake. Climbs through quiet pastures and teak forest, connecting to the southern bastions of Visapur.",
        coordinates: { lat: 18.7012, lng: 73.4912 }
      }
    ],
    highlights: [
      "🌊 World-famous Waterfall Steps: Walk up centuries-old stone stairs as crystal mountain water gushes past your feet",
      "🏰 Massive, Expansive Plateau larger than neighboring Lohagad Fort",
      "💥 Ancient British & Maratha Cannons lying intact on high bastions",
      "🏛️ Ruins of the Peshwa's Palace, carved Hanuman bas-reliefs, and water tanks",
      "🍛 Warm village meal at Bhaje base after the wet trek"
    ],
    fortAttractions: [
      "Waterfall Staircase Trail (धबधबा पायऱ्या)",
      "Intact Stone Fortification Walls & Bastions",
      "Ancient British Iron Cannons",
      "Peshwa Palace Ruins (पेशवे वाडा अवशेष)",
      "Carved Rock-cut Hanuman Wall Relief",
      "Huge Freshwater Reservoirs & Lakes",
      "Direct birds-eye view of sister fort Lohagad"
    ],
    history: "Visapur Fort was built between 1713 and 1720 CE by Balaji Vishwanath, the first Peshwa of the Maratha Empire, as a strategic twin fortress to overlook and safeguard neighboring Lohagad. Situated at 3,556 ft, it is higher and much larger in plateau area than Lohagad. During the Third Anglo-Maratha War in 1818, British forces under Colonel Prother occupied Visapur first, mounting heavy cannons on its higher ramparts to bombard and force the surrender of Lohagad.",
    howToReach: {
      byTrain: "Nearest railway station is Malavali (2.5 km). Walkable or a short 5-minute auto-rickshaw ride from Malavali station to Bhaje base.",
      byBus: "Local buses and shared cabs run from Lonavala to Bhaje village.",
      byRoad: "From Mumbai (100 km): Take Mumbai-Pune Expressway ➔ Exit at Lonavala ➔ Drive to Malavali & Bhaje village (~2.5 hrs). Dedicated parking available at Bhaje."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Easy highway drive along Mumbai-Pune Expressway to Malavali."
      },
      {
        day: 2,
        title: "05:00 AM – Bhaje Base, Waterfall Climb & Return",
        description: "05:00 AM: Reach Bhaje base village. Freshen up and enjoy hot Poha and tea. 06:00 AM: Start ascent through the forest. 07:15 AM: Climb the famous waterfall steps as fresh stream water cascades down. 08:30 AM: Enter through the ancient gateway onto the sprawling plateau. 08:45 AM - 12:00 PM: Explore the fortification walls, cannons, Peshwa palace ruins, and enjoy birds-eye views of Lohagad. 12:15 PM: Begin descent. 02:00 PM: Hot village lunch (Pithla Bhakri, Thecha & Rice). 03:30 PM: Depart for Mumbai. 08:00 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 8. RAJMACHI FORT ──
  {
    slug: "rajmachi-fort-trek",
    name: "Rajmachi Fort Trek (Shrivardhan & Manaranjan)",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "115 km from Mumbai",
    maxAltitude: "825 m (2,710 ft)",
    elevation: "825 m (2,710 ft)",
    startPoint: "Udhewadi Base Village",
    endPoint: "Udhewadi Base Village",
    baseVillage: "Udhewadi (उधेवाडी, Lonavala)",
    category: "fort",
    difficulty: "moderate",
    weatherStats: {
      temp: "24°C",
      wind: "15 km/h Wind",
      rainProb: "15% Rain (24h)",
      uv: "UV 6",
      visibility: "19.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Udhewadi via Lonavala",
        marathiName: "उधेवाडी (लोणावळा मार्ग)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "15.0 km (or 4x4 Jeep path)",
        trailDuration: "3.5 Hours",
        popularFor: "Scenic, rolling forest path passing through Tungarli Lake and Kataldhar waterfall ridge",
        routeDescription: "Starts near Tungarli Dam in Lonavala. A scenic dirt trail through dense Western Ghats jungle reaches Udhewadi base village situated between the twin citadels.",
        coordinates: { lat: 18.8278, lng: 73.3983 }
      },
      {
        name: "Kondivade (Karjat)",
        marathiName: "कोंडिवडे (कर्जत / कोंढाणे लेणी मार्ग)",
        isPrimary: false,
        difficulty: "Challenging",
        distanceFromBase: "6.0 km",
        trailDuration: "3.5 - 4 Hours",
        popularFor: "Steep, rewarding mountain climb ascending from the Konkan plains past Kondane Buddhist Caves",
        routeDescription: "Starts from Kondivade village near Karjat. The trail passes ancient Kondane Caves and climbs a steep forest ridge to reach Udhewadi.",
        coordinates: { lat: 18.8145, lng: 73.3754 }
      }
    ],
    highlights: [
      "🏰 Twin Citadels: Shrivardhan Balekilla (higher watchtower) and Manaranjan Fort",
      "🌌 World-renowned Fireflies Sanctuary during pre-monsoon summer nights",
      "🛕 Ancient Kal Bhairavnath Temple in the quaint village of Udhewadi",
      "🌊 Spectacular views of the Ulhas River Valley and Kataldhar Waterfall canyon",
      "🍛 Authentic rural rustic feast served inside local villager homes"
    ],
    fortAttractions: [
      "Shrivardhan Balekilla (Highest Citadel)",
      "Manaranjan Fort & Intact Bastions",
      "Kal Bhairavnath Temple Complex",
      "Ancient Stone Water Cisterns & Lakes",
      "Panoramic Views of Duke's Nose & Ulhas Valley",
      "Deep Historic Moat & Ramparts",
      "Kondane Buddhist Caves (on Karjat route)"
    ],
    history: "Rajmachi Fort consists of two fortified peak citadels: Shrivardhan and Manaranjan, strategically positioned at 2,710 ft to guard the historic Borghat trade route connecting Mumbai to Pune. Originally built by the Satavahanas, it was fortified into an impregnable military outpost by Chhatrapati Shivaji Maharaj in 1657. In 1704, Mughal forces captured the fort, but it was recaptured by the Marathas in 1705 under Peshwa Balaji Vishwanath.",
    howToReach: {
      byTrain: "Nearest railway stations are Lonavala (16 km) on the Central Railway and Karjat (12 km to Kondivade base).",
      byBus: "Local jeeps and private cabs operate between Lonavala railway station and Udhewadi base.",
      byRoad: "From Mumbai (115 km): Drive along Mumbai-Pune Expressway ➔ Take Lonavala Exit ➔ Drive past Tungarli Dam onto the rustic forest route to Udhewadi (~3 hrs)."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Overnight Forest Cruise",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Drive along Mumbai-Pune Expressway towards Lonavala."
      },
      {
        day: 2,
        title: "04:30 AM – Udhewadi Base, Twin Fort Exploration & Return",
        description: "04:30 AM: Arrive at Udhewadi base village. Freshen up and enjoy hot tea with Kanda Poha. 05:30 AM: Start morning climb up Shrivardhan Balekilla for sunrise. 07:30 AM: Reach Shrivardhan summit and take in 360-degree views of the Sahyadri mountains. 09:00 AM: Cross over to explore Manaranjan Fort and ancient rock ramparts. 11:30 AM: Visit the historic Kal Bhairavnath Temple. 01:00 PM: Wholesome village lunch (Bhakri, Pithla, Thecha & Rice). 02:30 PM: Start return journey to Mumbai. 08:30 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 9. KOTHALIGAD (PETH FORT) ──
  {
    slug: "kothaligad-peth-fort-trek",
    name: "Kothaligad (Peth Fort) Lighthouse Spire",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "90 km from Mumbai",
    maxAltitude: "945 m (3,100 ft)",
    elevation: "945 m (3,100 ft)",
    startPoint: "Ambivali Base Village",
    endPoint: "Ambivali Base Village",
    baseVillage: "Ambivali (आंबिवली, Karjat)",
    category: "fort",
    difficulty: "moderate",
    weatherStats: {
      temp: "25°C",
      wind: "16 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 6",
      visibility: "20.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Ambivali",
        marathiName: "आंबिवली (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Moderate",
        distanceFromBase: "5.5 km",
        trailDuration: "3 Hours",
        popularFor: "Classic trekking route from the roadhead to Peth plateau and through the internal stone chimney staircase",
        routeDescription: "Starts at Ambivali village. A winding mud and gravel trail climbs the hill to Peth plateau village, from where a rocky path leads to the base of the pinnacle and the famous rock-cut spiral tunnel stairs.",
        coordinates: { lat: 18.9833, lng: 73.5333 }
      }
    ],
    highlights: [
      "🪜 Internal Rock-Cut Spiral Staircase: Climb inside an engineered chimney carved directly inside the vertical basalt pinnacle",
      "🗼 Unique 'Lighthouse' (कोथाळी) shaped natural pinnacle rising dramatically from the plateau",
      "🛕 Bhairoba Cave with carved pillars and cool fresh water reservoirs",
      "🌄 Stunning views of Bhimashankar range, Padargad, and the misty Konkan plains",
      "🍛 Authentic rural Karjat-style breakfast & village feast"
    ],
    fortAttractions: [
      "Internal Funnel Spiral Staircase (कातळात कोरलेला जिना)",
      "Bhairoba Cave Temple (भैरोबा गुंफा)",
      "Pinnacle Summit Cannon & Weapon Storage",
      "Perennial Freshwater Rock Cisterns",
      "Peth Plateau Village & Verdant Meadows",
      "Views of Padargad, Nakhinda, and Bhimashankar"
    ],
    history: "Kothaligad (also known as Peth Fort after the plateau village below) stands at 3,100 ft as an engineering marvel of the Western Ghats. It served primarily as a watchtower and ammunition depot for the Marathas. What makes it unique across all forts in India is its central volcanic pinnacle: ancient engineers carved a tunnel right into the core of the vertical stone tower, chiseling an internal spiral staircase that allowed defenders to reach the top without exposing themselves to enemy fire.",
    howToReach: {
      byTrain: "Nearest railway station is Karjat Junction (30 km). Frequent state transport buses and six-seater sharing rickshaws run from Karjat Station to Ambivali/Kashele.",
      byBus: "MSRTC buses from Karjat bus depot head towards Jambrung and halt at Ambivali base.",
      byRoad: "From Mumbai (90 km): Follow Sion-Panvel Highway ➔ Karjat ➔ Kashele ➔ Turn towards Ambivali village (~2.5 hrs). Vehicle parking available at Ambivali."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Easy Highway Transit",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Smooth overnight drive towards Karjat and Ambivali."
      },
      {
        day: 2,
        title: "04:30 AM – Ambivali Base, Spire Tunnel Climb & Return",
        description: "04:30 AM: Reach Ambivali base. Freshen up and enjoy village tea with hot Poha. 05:30 AM: Begin morning ascent through lush forest to Peth plateau. 07:15 AM: Reach Peth village and proceed to the central pinnacle. 08:00 AM: Climb the thrilling internal rock spiral stairs inside the pinnacle. 08:45 AM: Stand atop the peak with 360-degree views of Bhimashankar and Padargad. 10:30 AM: Descend to Peth plateau. 01:00 PM: Delicious Maharashtrian lunch in the village. 02:30 PM: Walk down to Ambivali. 04:00 PM: Depart for Mumbai. 08:00 PM: Arrive in Mumbai."
      }
    ]
  },

  // ── 10. KORIGAD FORT ──
  {
    slug: "korigad-fort-trek",
    name: "Korigad Fort Lake & Plateau Trek",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "105 km from Mumbai",
    maxAltitude: "923 m (3,028 ft)",
    elevation: "923 m (3,028 ft)",
    startPoint: "Peth Shahpur Base Village",
    endPoint: "Peth Shahpur Base Village",
    baseVillage: "Peth Shahpur (पेठ शहापूर, Aamby Valley)",
    category: "fort",
    difficulty: "easy",
    weatherStats: {
      temp: "22°C",
      wind: "14 km/h Wind",
      rainProb: "10% Rain (24h)",
      uv: "UV 6",
      visibility: "20.0 km Visibility"
    },
    baseVillages: [
      {
        name: "Peth Shahpur",
        marathiName: "पेठ शहापूर (मुख्य पायथा गाव)",
        isPrimary: true,
        difficulty: "Easy (Paved Stone Steps)",
        distanceFromBase: "3.0 km",
        trailDuration: "1.5 Hours",
        popularFor: "Broad, secure paved stone stairs directly leading to the Ganesh Darwaja of Korigad",
        routeDescription: "Starts from the village school at Peth Shahpur near Aamby Valley. The path climbs through a cool forest canopy via broad stone stairs and reaches the intact Ganesh Darwaja.",
        coordinates: { lat: 18.6183, lng: 73.3883 }
      }
    ],
    highlights: [
      "🚶 2-Kilometer Continuous Rampart Walk: You can walk around the entire intact outer fortification wall of the fort",
      "🌊 Two Pristine Natural Freshwater Lakes right on top of the expansive green plateau",
      "🛕 Korai Devi Temple honoring the goddess after whom the fort is named",
      "💥 Six Ancient Iron & Bronze Cannons (including the massive Laxmi Toph)",
      "🍛 Authentic village meal at Peth Shahpur base"
    ],
    fortAttractions: [
      "Ganesh Darwaja (Intact Fort Entrance)",
      "Korai Devi Temple & Deepstambha",
      "Laxmi Toph (Huge Bronze Cannon)",
      "Two Perennial Freshwater Summit Lakes",
      "Complete 2 km Intact Fortification Wall",
      "Panoramic views of Aamby Valley & Sudhagad"
    ],
    history: "Korigad Fort, situated at 3,028 ft near Lonavala, was incorporated into the Swarajya realm by Chhatrapati Shivaji Maharaj along with Lohagad and Visapur in 1657. In 1818, British forces under Colonel Prother besieged the fort for three days before a stray shell ignited the fort's ammunition magazine, leading to its surrender. Its 2 km long rampart wall is one of the best-preserved fortification walls in Maharashtra.",
    howToReach: {
      byTrain: "Nearest railway station is Lonavala (22 km). Regular local buses and shared cabs run from Lonavala to Aamby Valley and Peth Shahpur.",
      byBus: "MSRTC buses from Lonavala depot towards INS Shivaji and Aamby Valley stop at Peth Shahpur.",
      byRoad: "From Mumbai (105 km): Take Mumbai-Pune Expressway ➔ Exit at Lonavala ➔ Follow Aamby Valley City Road past Bushi Dam and Lion's Point ➔ Reach Peth Shahpur village (~2.5 hrs). Dedicated parking available."
    },
    itinerary: [
      {
        day: 1,
        title: "10:00 PM – Mumbai Departure & Easy Highway Drive",
        description: "Board private AC trekking coach from Mumbai. Pickups: Borivali 10:00 PM, Andheri 10:25 PM, Sion 10:50 PM, Chembur 11:10 PM, Vashi 11:35 PM, Kalamboli 11:55 PM. Easy highway drive along Mumbai-Pune Expressway."
      },
      {
        day: 2,
        title: "05:00 AM – Peth Shahpur Base, Rampart Walk & Return",
        description: "05:00 AM: Arrive at Peth Shahpur base. Enjoy morning tea and hot breakfast. 06:15 AM: Begin easy climb up stone stairs. 07:30 AM: Enter through Ganesh Darwaja. 07:45 AM - 11:45 AM: Walk the complete 2 km outer stone wall, explore the twin freshwater lakes, Korai Devi temple, and ancient cannons. 12:00 PM: Descend to base. 01:15 PM: Wholesome local village lunch. 02:45 PM: Scenic drive back with optional stops at Lion's Point. 07:30 PM: Arrive in Mumbai."
      }
    ]
  }
];

async function updateAll() {
  console.log(`Starting real data update for ${TREKS_REAL_DATA.length} major forts/treks...`);
  let updatedCount = 0;

  for (const trek of TREKS_REAL_DATA) {
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

  console.log(`\nAll done! Successfully updated ${updatedCount} treks in Firestore with Durg-style rich real data!`);
}

updateAll().catch(console.error).finally(() => process.exit(0));

