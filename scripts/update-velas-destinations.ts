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

const destinationsData = [
  {
    name: "Velas Beach",
    slug: "velas-beach",
    tagline: "Where tiny lives begin their journey to the ocean, and nature teaches us hope",
    shortDescription: "A serene coastal village in Ratnagiri renowned for its untouched natural shoreline, community-led Olive Ridley sea turtle conservation, the annual Velas Turtle Festival, and authentic Konkani village homestays.",
    description: "Tucked away along the northern Ratnagiri coastline, Velas is one of Maharashtra's most inspiring eco-tourism havens. Here, the gentle tides of the Arabian Sea provide critical nesting grounds for vulnerable Olive Ridley sea turtles. Through dedicated community conservation, protected hatcheries ensure turtle hatchlings make their first supervised march into the waves. Beyond the turtle season, Velas enchants visitors with wide golden sands, betel nut orchards, rustic Konkani homestays, and wholesome home-cooked coastal meals.",
    category: "beach",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Olive_Ridley_Sea_Turtle_Hatchlings.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e1/Hatchlings_of_Olive_Ridley.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/79/Kelshi_Village_-_panoramio.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/fd/Olive_Ridley_hatchlings_in_Chennai.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Olive_Ridley_Sea_Turtle_Hatchlings.jpg",
    highlights: [
      "Primary nesting and conservation sanctuary for Olive Ridley sea turtles in Maharashtra",
      "Famous annual Velas Turtle Festival with supervised morning & evening hatchling releases",
      "Warm Konkani village hospitality with community-run eco-homestays",
      "Scenic and uncrowded natural beach fringed by casuarinas and coconut palms",
      "Historic Bankot Fort and Savitri River estuary just 12 km away"
    ],
    bestSeason: "November to March — Pleasant coastal weather. Turtle nesting occurs Dec–Feb, and hatchling releases typically take place between February and April.",
    howToReach: {
      byRoad: "220 km from Mumbai via NH66 (Mangaon - Mandangad - Velas, 5.5 hrs); 190 km from Pune via Tamhini Ghat (5 hrs).",
      byTrain: "Mangaon Railway Station (60 km) or Khed (75 km) on Konkan Railway. State transport buses and private jeeps run to Mandangad and Velas.",
      byFerry: "Local vehicle-passenger ferry connects Bagmandla (Harihareshwar side) to Bankot/Velas across the Savitri River in 15 minutes.",
      tip: "Book homestays well in advance for peak Turtle Festival weekends (Feb–April). Always carry cash as cellular data can be patchy."
    },
    thingsToDo: [
      "Witness baby Olive Ridley turtles emerging and scurrying to the sea during supervised releases",
      "Stay at a traditional Konkani village homestay and experience authentic rural life",
      "Take a quiet sunset walk along the wide, pristine sands of Velas Beach",
      "Visit historic Bankot Fort (Himmatgad) for sweeping views of the Savitri River estuary",
      "Take the scenic ferry across to Harihareshwar Temple and rocky headlands",
      "Support local conservationists and learn about marine biodiversity protection"
    ],
    foodToTry: [
      "Malvani Surmai Fry — Fresh coastal fish marinated in fiery regional spices and rava crusted",
      "Traditional Konkani Veg Thali — Homemade pithla-bhakri, valache birda, and steaming rice",
      "Solkadhi — Tangy and cooling digestive drink made of fresh coconut milk and kokum",
      "Ukadiche Modak — Steamed fragrant rice dumplings stuffed with freshly grated coconut and jaggery",
      "Ghavane with Chutney — Soft, lacy Konkani rice crepes served hot for breakfast"
    ],
    nearbyPlaces: [
      {
        name: "Bankot Fort",
        distance: "12 km",
        why: "Historic hilltop fortress overlooking the Savitri River mouth, offering sweeping panoramic ocean views.",
        slug: "bankot-fort"
      },
      {
        name: "Harihareshwar Beach & Temple",
        distance: "28 km (via ferry)",
        why: "Ancient cliffside Shiva temple and scenic rocky headlands known as Dakshin Kashi.",
        slug: "harihareshwar"
      },
      {
        name: "Kelshi Beach",
        distance: "18 km",
        why: "Tranquil sandy beach famous for natural sand dunes and the 17th-century Mahalaxmi Temple.",
        slug: "kelshi-beach"
      },
      {
        name: "Anjarle Beach",
        distance: "30 km",
        why: "Scenic palm-fringed shore home to the revered cliff-top Kadyavarcha Ganpati Temple.",
        slug: "anjarle"
      },
      {
        name: "Mandangad",
        distance: "22 km",
        why: "Charming taluka hub nestled amidst green hills with historic fort ruins.",
        slug: "mandangad"
      },
      {
        name: "Diveagar Beach",
        distance: "45 km",
        why: "Sprawling white-sand beach lined with surfing waves, water sports, and casuarina groves.",
        slug: "diveagar"
      }
    ],
    stayOptions: "Authentic community-run homestays hosted by local village families with clean rooms and freshly prepared home-cooked Konkani meals. For resort-style amenities, stay in nearby Harihareshwar or Dapoli.",
    entryFee: "Beach access is free. Turtle festival viewing is managed by local conservation groups.",
    timings: "Beach open during daylight hours. Supervised turtle hatchling releases occur at 7:00 AM and 5:30 PM during nesting season.",
    bestTimeToVisit: "Early mornings (6:30 AM–8:00 AM) and late afternoons (5:00 PM–6:30 PM) for hatchling sessions and peaceful sunsets.",
    warnings: [
      "🐢 Wildlife Protection: Never touch, handle, or shine flashlights at sea turtles or hatchlings.",
      "⚠️ Sea Conditions: Strong undercurrents make swimming risky; swimming during high tide is strictly discouraged.",
      "💵 Limited Connectivity: ATMs and digital payments are scarce; carry adequate cash for homestays and transport.",
      "🌿 Eco-Sensitivity: Velas is a zero-litter zone; carry all plastic waste back with you."
    ],
    tags: ["beach", "turtle-festival", "eco-tourism", "wildlife", "ratnagiri", "homestay", "village", "peaceful", "family"],
    featured: true,
    approved: true
  },
  {
    name: "Harihareshwar",
    slug: "harihareshwar",
    tagline: "Where sacred temple bells meet the roar of the Arabian Sea",
    shortDescription: "Known as 'Dakshin Kashi', Harihareshwar is a spiritually blessed coastal town in Raigad district, famed for its ancient cliffside Shiva temple, rugged rocky pradakshina path, and serene beaches.",
    description: "Harihareshwar is a unique sanctuary where profound spirituality meets raw coastal drama. Nestled between four scenic hills and the Arabian Sea, this revered pilgrimage center is dominated by the centuries-old Harihareshwar Temple, where Lord Shiva is worshipped alongside Brahma, Vishnu, and Maheshwar. A highlight of the visit is the dramatic pradakshina (circumambulation) route carved directly into sea-sculpted laterite cliffs, where crashing waves spray against rock formations. Complemented by peaceful black-sand beaches, Harihareshwar offers a deeply restorative blend of devotion and seaside tranquility.",
    category: "temple",
    region: "Raigad",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/4/47/Harihareshwar_beach.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Harihareshwar_Temple.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/85/Harihareshwar_beach2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/eb/Harihareshwar_Mandir.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/4/47/Harihareshwar_beach.jpg",
    highlights: [
      "Ancient 16th-century Harihareshwar Temple, venerated as 'Dakshin Kashi' (Kashi of the South)",
      "Dramatic coastal Pradakshina path carved through cliff rocks along the crashing Arabian Sea",
      "Peaceful crescent beach with dark sands and scenic hill backdrops",
      "Scenic Bagmandla-Bankot ferry gateway connecting Raigad and Ratnagiri districts",
      "Authentic Brahmin-style vegetarian cuisine and Konkani seafood specialties"
    ],
    bestSeason: "October to March — Cool, breezy coastal weather with calm seas. Pradakshina walk is safest during winter low tides.",
    howToReach: {
      byRoad: "200 km from Mumbai via Mangaon–Mhasla (4.5–5 hrs); 170 km from Pune via Tamhini Ghat.",
      byTrain: "Mangaon Railway Station (65 km) on Konkan Railway. Frequent state transport buses and private taxis ply to Harihareshwar.",
      byFerry: "Dighi to Agardanda ferry connects to Janjira/Alibaug; Bagmandla ferry connects south across the river to Bankot & Velas.",
      tip: "Check local tide tables before undertaking the rocky Pradakshina walk; only proceed during low tide when rocks are dry."
    },
    thingsToDo: [
      "Offer prayers at the ancient Harihareshwar Temple and seek blessings at the Kalbhairav shrine",
      "Complete the spectacular cliffside sea-walk Pradakshina during low tide",
      "Relax on Harihareshwar beach and photograph the rugged coastal rock formations",
      "Take the local vehicle ferry across to Bankot Fort and Velas turtle village",
      "Visit nearby Shrivardhan Beach for scenic promenades and fresh seafood"
    ],
    foodToTry: [
      "Pithla Bhakri & Thecha — Warm gram-flour curry with rustic jowar bhakri and spicy garlic-chilli chutney",
      "Ukadiche Modak — Steamed fragrant rice dumplings stuffed with fresh coconut and jaggery",
      "Solkadhi — Refreshing pink digestive cooler prepared from fresh coconut milk and wild kokum",
      "Fresh Surmai Curry — Traditional coastal fish curry served with hot steamed rice",
      "Kaju Usal — Fresh tender cashew nut curry cooked in mild coconut gravy"
    ],
    nearbyPlaces: [
      {
        name: "Shrivardhan Beach",
        distance: "18 km",
        why: "Historic coastal town with a manicured seaside promenade and water sports.",
        slug: "shrivardhan"
      },
      {
        name: "Diveagar Beach",
        distance: "32 km",
        why: "Vast white-sand beach known for watersports, seagulls, and Suvarna Ganesh Temple.",
        slug: "diveagar"
      },
      {
        name: "Bankot Fort",
        distance: "25 km (via ferry)",
        why: "Historic fort guarding the Savitri river mouth with grand panoramic vistas.",
        slug: "bankot-fort"
      },
      {
        name: "Velas Beach",
        distance: "28 km",
        why: "Community turtle conservation village famous for the seasonal Olive Ridley festival.",
        slug: "velas-beach"
      }
    ],
    stayOptions: "MTDC Resort Harihareshwar right on the clifftop, numerous cozy beach homestays, and family-run lodges near the temple complex.",
    entryFee: "Free entry to both the temple and the beach. Nominal parking fees apply.",
    timings: "Temple: 5:00 AM to 9:00 PM daily. Beach: Open 24 hours. Pradakshina path: Daylight hours only during low tide.",
    bestTimeToVisit: "Early morning (6:00 AM to 9:00 AM) for tranquil temple darshan and low-tide pradakshina walk.",
    warnings: [
      "⚠️ High Tide Hazard: Never attempt the cliffside Pradakshina walk during high tide or heavy monsoon waves.",
      "🪨 Slippery Rocks: Laterite rocks along the sea path have sharp edges and wet moss; wear shoes with good rubber grip.",
      "👕 Temple Etiquette: Modest attire is required within the sanctum sanctorum."
    ],
    tags: ["temple", "beach", "pilgrimage", "raigad", "spiritual", "cliff-walk", "family", "sunset"],
    featured: true,
    approved: true
  },
  {
    name: "Kelshi Beach",
    slug: "kelshi-beach",
    tagline: "Untouched sandy shores, whispers of casuarinas, and timeless village serenity",
    shortDescription: "A tranquil coastal hideaway in Ratnagiri district featuring a wide uncrowded beach, natural sand dunes, the historic 17th-century Mahalaxmi Temple, and traditional Konkan village charms.",
    description: "Kelshi Beach is a peaceful antidote to bustling tourist circuits. Located in northern Ratnagiri near Dapoli, this tranquil coastal village boasts a pristine 3-kilometer stretch of soft sand shaded by tall casuarina and coconut groves. Kelshi is geographically famous for its unusual coastal sand dunes formed by a historic tsunami, as well as the historic 17th-century Mahalaxmi Temple and the Yakub Baba Dargah. Travellers come to Kelshi to listen to the whisper of the ocean breeze, stroll undisturbed along the water's edge, and savour authentic Konkani home hospitality.",
    category: "beach",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/7/79/Kelshi_Village_-_panoramio.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/29/Bridge_Near_kelshi_Village_-_panoramio.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/19/Anjarle_beach_in_Konkan_near_Dapoli_%2C_Maharashtra%2CIndia.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/7/79/Kelshi_Village_-_panoramio.jpg",
    highlights: [
      "3 km long pristine, uncrowded shoreline perfect for quiet barefoot walks",
      "Unique natural coastal sand dunes with fossil deposits",
      "Historic 17th-century Shri Mahalaxmi Temple built during the Peshwa era",
      "Scenic arched stone bridge and tranquil estuary lined with traditional fishing boats",
      "Peaceful village homestays offering genuine rural Konkani warmth"
    ],
    bestSeason: "October to March — Pleasant, breezy weather with clear skies and calm waters ideal for quiet beach vacations.",
    howToReach: {
      byRoad: "230 km from Mumbai via NH66 (5.5 hrs); 200 km from Pune via Bhor-Varandha Ghat or Tamhini (5 hrs). 32 km from Dapoli.",
      byTrain: "Khed Railway Station (65 km) on Konkan Railway. State transport buses and private taxis connect Khed to Kelshi via Dapoli.",
      byFerry: "Connected northwards via local ferries to Harihareshwar / Bagmandla and Bankot.",
      tip: "Combine Kelshi with nearby Anjarle (14 km) and Velas (18 km) for an unforgettable coastal trail."
    },
    thingsToDo: [
      "Take leisurely strolls along the silent, tree-shaded shores of Kelshi Beach",
      "Visit the historic Mahalaxmi Temple and admire its intricate wooden architecture",
      "Explore the ancient coastal sand dunes and estuary bridge for sunset photography",
      "Savour homemade Malvani seafood prepared by local village homestay hosts",
      "Drive along the scenic coastal route to Anjarle's Kadyavarcha Ganpati Temple"
    ],
    foodToTry: [
      "Malvani Pomfret Thali — Freshly caught pomfret spiced with roasted Malvani masala and served with rice",
      "Solkadhi — Soothing pink cooler infused with fresh coconut milk, kokum, and green chillies",
      "Ghavane with Sweet Coconut Milk — Delicate lace rice pancakes served with sweetened cardamom milk",
      "Fish Fry (Surmai / Bangda) — Crisp shallow-fried coastal catch with traditional spices",
      "Ukadiche Modak — Steamed rice flour modaks filled with freshly scraped coconut and organic jaggery"
    ],
    nearbyPlaces: [
      {
        name: "Anjarle Beach",
        distance: "14 km",
        why: "Scenic palm-fringed beach and the cliff-top Kadyavarcha Ganpati Temple.",
        slug: "anjarle"
      },
      {
        name: "Velas Beach",
        distance: "18 km",
        why: "Renowned eco-village celebrated for its Olive Ridley turtle conservation festival.",
        slug: "velas-beach"
      },
      {
        name: "Bankot Fort",
        distance: "28 km",
        why: "Historic Maratha bastion overlooking the Savitri River estuary.",
        slug: "bankot-fort"
      },
      {
        name: "Harnai Beach & Fish Market",
        distance: "26 km",
        why: "Vibrant fishing port with the famous Suvarnadurg Sea Fort and daily beach fish auction.",
        slug: "harnai"
      },
      {
        name: "Dapoli",
        distance: "32 km",
        why: "Major hill and coastal hub known for agricultural universities, markets, and cool climate.",
        slug: "dapoli"
      },
      {
        name: "Mandangad",
        distance: "35 km",
        why: "Scenic inland hill town connecting coastal trails to the highway.",
        slug: "mandangad"
      }
    ],
    stayOptions: "Cozy local homestays and family guesthouses in Kelshi village offering home-cooked meals and peaceful village surroundings. Beach resorts are available in nearby Dapoli (32 km).",
    entryFee: "Free access to beach, sand dunes, and temples.",
    timings: "Open 24/7. Daytime visits (6:30 AM to 6:30 PM) recommended.",
    bestTimeToVisit: "Late afternoons (4:30 PM to 6:30 PM) for cool ocean breezes and colorful coastal sunsets.",
    warnings: [
      "⚠️ Sea Depth: Kelshi has sudden drop-offs; avoid venturing deep into the water.",
      "🚫 Eco Respect: The sand dunes are fragile geological features; do not litter or disturb the natural formations.",
      "💵 Cash Essential: Village shops and homestays rarely have card terminals; keep sufficient cash."
    ],
    tags: ["beach", "sand-dunes", "peaceful", "ratnagiri", "homestay", "temple", "sunset", "village"],
    approved: true,
    featured: false
  },
  {
    name: "Anjarle Beach",
    slug: "anjarle",
    tagline: "Golden shores guarded by the cliff-top Kadyavarcha Ganpati",
    shortDescription: "A picturesque coastal jewel in Ratnagiri near Dapoli, famous for its sweeping palm-fringed shoreline, fishing boats on the Jog River creek, and the legendary cliff-top Kadyavarcha Ganpati Temple.",
    description: "Anjarle is an enchanting coastal destination where dense coconut groves tumble down to meet golden sands and the sparkling Arabian Sea. Situated near Dapoli at the mouth of the Jog River, Anjarle is most renowned for the ancient 'Kadyavarcha Ganpati' temple, perched high on a laterite hill with breath-taking aerial panoramas of the coastline and river estuary. The beach itself is vast, peaceful, and clean, lined with swaying betel nut palms and traditional fishing canoes. With friendly homestays, mouth-watering Malvani seafood, and untouched natural beauty, Anjarle is a favorite for nature lovers and pilgrims alike.",
    category: "beach",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/19/Anjarle_beach_in_Konkan_near_Dapoli_%2C_Maharashtra%2CIndia.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Parked_boats_at_Anjarle_Creek.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/da/Anjarle_Beach.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/1/19/Anjarle_beach_in_Konkan_near_Dapoli_%2C_Maharashtra%2CIndia.jpg",
    highlights: [
      "Famed Kadyavarcha Ganpati Temple perched on an ocean cliff with panoramic sea views",
      "Wide, clean crescent beach fringed by dense coconut plantations and casuarina trees",
      "Picturesque Jog river creek where traditional wooden trawlers dock",
      "Peaceful village homestays serving authentic Konkani coastal cuisine",
      "Proximity to Harnai's Suvarnadurg Sea Fort and daily beach fish auctions"
    ],
    bestSeason: "October to March — Cool, breezy coastal weather with calm seas. Ganesh Chaturthi and Maghi Ganeshotsav bring vibrant temple celebrations.",
    howToReach: {
      byRoad: "225 km from Mumbai via Mangaon–Khed–Dapoli (5.5 hrs); 195 km from Pune via Tamhini or Bhor Ghat (5 hrs). 22 km from Dapoli town.",
      byTrain: "Khed Railway Station (50 km) on Konkan Railway. Frequent taxis and state buses connect Khed to Dapoli and Anjarle.",
      byFerry: "Ferries across Dabhol and Bankot connect surrounding coastal routes.",
      tip: "Visit Kadyavarcha Ganpati in the morning for calm temple darshan and ascend the temple tower for a panoramic coastal photo."
    },
    thingsToDo: [
      "Climb up to the Kadyavarcha Ganpati Temple and admire sweeping views of the Arabian Sea and Jog River",
      "Walk along the expansive sands of Anjarle Beach during sunset",
      "Cross the scenic Anjarle bridge and watch fishermen mend colorful nets at the creek",
      "Take a 15-minute drive to Harnai beach to witness the legendary 4:00 PM open-air fish auction",
      "Savor home-cooked Malvani fish thalis and fresh sweet coconut water at local village stays"
    ],
    foodToTry: [
      "Malvani Surmai / Pomfret Thali — Fresh local catch served with spicy coconut curry, solkadhi, and rice",
      "Solkadhi — Authentic digestive drink made of freshly squeezed coconut milk and sour wild kokum",
      "Kaju Malvani Curry — Rich coconut gravy simmered with freshly harvested tender cashews",
      "Rice Bhakri with Kalva (Clams) Curry — Fresh coastal shellfish cooked in traditional Konkani spices",
      "Ukadiche Modak — Steamed fragrant rice dumplings stuffed with freshly grated coconut and organic jaggery"
    ],
    nearbyPlaces: [
      {
        name: "Kelshi Beach",
        distance: "14 km",
        why: "Secluded beach known for sand dunes, casuarina groves, and 17th-century Mahalaxmi temple.",
        slug: "kelshi-beach"
      },
      {
        name: "Harnai Beach & Suvarnadurg",
        distance: "16 km",
        why: "Historic offshore sea fort, lighthouse, and Maharashtra's most vibrant beachside fish auction.",
        slug: "harnai"
      },
      {
        name: "Dapoli",
        distance: "22 km",
        why: "Charming hill-coastal hub known for pleasant climate, cashew processing, and markets.",
        slug: "dapoli"
      },
      {
        name: "Velas Beach",
        distance: "30 km",
        why: "Olive Ridley turtle conservation sanctuary and annual hatchling festival.",
        slug: "velas-beach"
      },
      {
        name: "Bankot Fort",
        distance: "40 km",
        why: "Historic hilltop fortress overlooking the Savitri River estuary.",
        slug: "bankot-fort"
      }
    ],
    stayOptions: "Beachside cottage resorts, welcoming village homestays, and MTDC-associated farmstays nestled within coconut groves.",
    entryFee: "Free access to beach and temple.",
    timings: "Beach: Open 24/7. Kadyavarcha Ganpati Temple: 6:00 AM to 8:30 PM.",
    bestTimeToVisit: "Early morning (7:00 AM to 9:30 AM) for temple darshan; late afternoon (4:30 PM to 6:30 PM) for sunset walks.",
    warnings: [
      "⚠️ Creek Currents: Currents near the Jog River mouth can be deceptive; stay away from the confluence during high tide.",
      "🚗 Winding Hill Roads: The road to Kadyavarcha Ganpati is steep and winding; drive carefully.",
      "🐢 Turtle Protection: Respect seasonal turtle nesting zones marked on the beach."
    ],
    tags: ["beach", "temple", "ganesh-temple", "ratnagiri", "dapoli", "family", "sunset", "peaceful", "seafood"],
    approved: true,
    featured: false
  },
  {
    name: "Mandangad",
    slug: "mandangad",
    tagline: "Discover the quiet verdant heart of inland Konkan",
    shortDescription: "A tranquil hill-country taluka in Ratnagiri district, renowned for its cool breezes, historic triangular Mandangad Fort, lush valleys, and gateway access to coastal turtle sanctuaries and river forts.",
    description: "Mandangad is a peaceful hill haven tucked into the northern ridges of the Konkan region in Ratnagiri district. Acting as the geographical crossroads between the Sahyadri foothills and the Arabian Sea, Mandangad is crowned by the historic Mandangad Fort (dating back to the 12th century), famous for its unusual triangular layout and double ramparts. Surrounded by dense deciduous forests, betel nut plantations, and rolling laterite plateaus, Mandangad offers travellers a serene inland sanctuary with refreshing breezes, traditional weekly haats (bazaars), and the unhurried warmth of authentic rural Maharashtra.",
    category: "village",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/32/Kokan_village_School_Drone_Shot_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Kokan_village_School_Drone_Shot_5.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Bankot_Fort.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/3/32/Kokan_village_School_Drone_Shot_2.jpg",
    highlights: [
      "Historic 12th-century triangular Mandangad Fort with ancient water cisterns and cannon points",
      "Sweeping valley panoramas of the lush Sahyadri foothills and northern Konkan plains",
      "Cool, pleasant hill climate offering a refreshing contrast to coastal humidity",
      "Central gateway connecting travelers to Velas turtle sanctuary and Bankot Fort",
      "Authentic rural Konkan town life with traditional weekly farmers' markets"
    ],
    bestSeason: "October to March — Crisp, cool breezes and clear skies. Monsoon (July–September) turns the entire surrounding plateau into an emerald paradise with seasonal waterfalls.",
    howToReach: {
      byRoad: "180 km from Mumbai via NH66 (Mangaon–Mandangad, 4.5 hrs); 160 km from Pune via Bhor Ghat (4 hrs).",
      byTrain: "Khed Railway Station (45 km) or Mangaon (50 km) on the Konkan Railway. State transport buses and shared jeeps connect directly.",
      byFerry: "Inland town, but connects to Bankot ferry (20 km) for crossing towards Harihareshwar.",
      tip: "Mandangad is the best fuel and cash replenishment stop before heading into the smaller coastal villages of Velas and Kelshi."
    },
    thingsToDo: [
      "Trek up to Mandangad Fort and explore its historic ramparts, cannons, and Lord Ganesha shrine",
      "Enjoy birdwatching and photography across the mist-shrouded hill valleys",
      "Experience the lively local weekly bazaar for regional spices, kokum, and wild honey",
      "Use Mandangad as a scenic base for road-tripping to Bankot Fort, Velas, and Kelshi",
      "Sample rustic rural Konkani delicacies prepared with fresh local seasonal produce"
    ],
    foodToTry: [
      "Pithla Bhakri with Thecha — Hearty gram flour curry with hot jowar or rice flatbread and fiery green chilli relish",
      "Valache Birda — Sprouted field bean curry cooked in a fragrant coconut and tamarind gravy",
      "Solkadhi — Refreshing pink digestif made of fresh coconut milk and wild kokum",
      "Kombdi Vade — Authentic rural Malvani chicken curry served with fluffy fried multigrain puris",
      "Fresh Kokum Sharbat — Sweet and tangy traditional cooler made with indigenous wild kokum"
    ],
    nearbyPlaces: [
      {
        name: "Velas Beach",
        distance: "22 km",
        why: "Community-led Olive Ridley sea turtle sanctuary and festival village.",
        slug: "velas-beach"
      },
      {
        name: "Bankot Fort",
        distance: "20 km",
        why: "Historic coastal bastion overlooking the scenic Savitri River mouth.",
        slug: "bankot-fort"
      },
      {
        name: "Kelshi Beach",
        distance: "35 km",
        why: "Peaceful beach with ancient sand dunes and historic Mahalaxmi Temple.",
        slug: "kelshi-beach"
      },
      {
        name: "Anjarle Beach",
        distance: "45 km",
        why: "Picturesque beach and the famous cliffside Kadyavarcha Ganpati Temple.",
        slug: "anjarle"
      },
      {
        name: "Harihareshwar",
        distance: "38 km (via ferry)",
        why: "Sacred coastal town with ancient Shiva temple and cliffside pradakshina walk.",
        slug: "harihareshwar"
      }
    ],
    stayOptions: "Budget town lodges, rural agri-tourism farmstays, and local guesthouses. Ideal as an overnight stop before touring the northern Ratnagiri coast.",
    entryFee: "No entry fee for the town or fort.",
    timings: "Town accessible 24/7. Fort trek recommended during daylight hours (6:00 AM to 6:00 PM).",
    bestTimeToVisit: "Early morning for the fort hike; late afternoons for valley breeze and sunset views.",
    warnings: [
      "🥾 Uneven Fort Trails: Wear sturdy trekking shoes for the fort ascent as laterite paths can be slippery.",
      "🌧️ Monsoon Caution: Heavy rains can cause mist and slippery road conditions on ghat passes.",
      "💵 Essential Hub: Withdraw cash here as coastal villages further west have very few working ATMs."
    ],
    tags: ["village", "fort", "hill-station", "history", "ratnagiri", "nature", "trekking", "rural", "offbeat"],
    approved: true,
    featured: false
  },
  {
    name: "Bankot Fort",
    slug: "bankot-fort",
    tagline: "Where Maratha cannons guarded the Savitri estuary and the vast Arabian Sea",
    shortDescription: "An imposing historic sea-and-river fort in Ratnagiri district, towering over the Savitri River mouth with panoramic ocean views, laterite bastions, a secret water gate, and rich coastal history.",
    description: "Perched atop a commanding hill overlooking the confluence of the Savitri River and the Arabian Sea, Bankot Fort (also known as Himmatgad) is a landmark of maritime strategy along the Konkan coast. Believed to have ancient trading origins, the fort was captured by the Portuguese, heavily reinforced by the Maratha naval armada, and later became the first fort in Maharashtra ceded to the British East India Company (renamed Fort Victoria). Today, its weathered laterite battlements, grand arched gateway, secret escape tunnel (Chor Darwaza), and old graveyard offer a captivating journey into coastal history, framed by 360-degree views of river estuaries and open sea.",
    category: "fort",
    region: "Ratnagiri",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Bankot_Fort.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Bankot_Fort_Panorama.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Bankot_chor_darwaza.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/48/View_of_the_Arabian_Sea_from_Bankot_Fort.jpg"
    ],
    coverImage: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Bankot_Fort.jpg",
    highlights: [
      "Commanding laterite fort with 360-degree vistas of the Savitri River estuary and Arabian Sea",
      "Historic Maratha bastion with surviving bastions, ramparts, and ancient cannons",
      "Mysterious 'Chor Darwaza' (secret escape gate) carved into the southern cliffside",
      "Historic colonial cemetery from the British East India Company era (Fort Victoria)",
      "Scenic passenger-vehicle ferry link across the river to Bagmandla and Harihareshwar"
    ],
    bestSeason: "October to March — Pleasant coastal winds and clear visibility over the ocean. Winter sunsets from the ramparts are spectacular.",
    howToReach: {
      byRoad: "215 km from Mumbai via Mangaon–Mandangad–Bankot (5 hrs); 185 km from Pune via Tamhini Ghat. Good motorable road up to the fort base.",
      byTrain: "Mangaon Railway Station (55 km) or Khed (70 km). Local buses and taxis connect to Bankot village.",
      byFerry: "Regular passenger & vehicle ferry runs across the Savitri River between Bankot and Bagmandla (Harihareshwar side) in 15 minutes.",
      tip: "Take the ferry crossing from Harihareshwar/Bagmandla to Bankot for an unforgettable scenic river journey with views of the fort above."
    },
    thingsToDo: [
      "Explore the intact laterite ramparts, watchtowers, and cannon bastions of Bankot Fort",
      "Photograph the sweeping panoramic confluence of the Savitri River and the open ocean",
      "Walk down to the historic Chor Darwaza and see the rock-cut steps leading to the river",
      "Visit nearby Velas Beach (12 km) for turtle conservation and rural village homestays",
      "Take the Bagmandla ferry across to Harihareshwar temple and rocky pradakshina trail"
    ],
    foodToTry: [
      "Malvani Surmai Fry — Fresh river-sea catch marinated in red spices and rava-crusted",
      "Fish Curry with Steamed Rice — Traditional Konkani fish curry flavored with kokum and coconut",
      "Solkadhi — Tangy digestive cooler freshly prepared from coconut milk and kokum",
      "Pithla Bhakri — Comforting hot gram-flour curry served with rustic jowar flatbread",
      "Fresh Coconut Water — Sweet, hydrating water straight from local coastal palms"
    ],
    nearbyPlaces: [
      {
        name: "Velas Beach",
        distance: "12 km",
        why: "Community-led Olive Ridley sea turtle sanctuary and turtle festival village.",
        slug: "velas-beach"
      },
      {
        name: "Harihareshwar Beach & Temple",
        distance: "25 km (via ferry)",
        why: "Historic clifftop Shiva temple, rocky headlands, and peaceful beach.",
        slug: "harihareshwar"
      },
      {
        name: "Kelshi Beach",
        distance: "28 km",
        why: "Tranquil sandy beach famous for natural sand dunes and Mahalaxmi Temple.",
        slug: "kelshi-beach"
      },
      {
        name: "Mandangad",
        distance: "20 km",
        why: "Quiet hill town with historic triangular fort and valley views.",
        slug: "mandangad"
      },
      {
        name: "Diveagar Beach",
        distance: "40 km",
        why: "Popular white-sand beach with casuarina woods and water sports.",
        slug: "diveagar"
      }
    ],
    stayOptions: "Homestays in Bankot and Velas village (12 km), or hotels and MTDC resorts across the ferry in Harihareshwar and Shrivardhan.",
    entryFee: "Free entry to the fort.",
    timings: "Open daily from 6:00 AM to 6:30 PM. Daylight visits strongly recommended.",
    bestTimeToVisit: "Late afternoon (4:00 PM to 6:00 PM) for golden-hour photography and cooler breeze on the ramparts.",
    warnings: [
      "⚠️ Steep Bastion Edges: The fort ramparts do not have safety railings; stay away from loose walls and steep edges.",
      "⛴️ Ferry Timings: The Bagmandla-Bankot ferry usually operates from 6:30 AM to 9:30 PM; check evening timings beforehand.",
      "💧 Carry Water: There are no shops inside the fort premises; bring drinking water and sun protection."
    ],
    tags: ["fort", "history", "maratha-history", "savitri-river", "ratnagiri", "panoramic-view", "photography", "heritage"],
    approved: true,
    featured: false
  }
];

async function updateDestinations() {
  const now = new Date().toISOString();

  for (const item of destinationsData) {
    const snap = await db.collection("destinations").where("slug", "==", item.slug).get();

    if (!snap.empty) {
      const doc = snap.docs[0];
      await doc.ref.update({
        ...item,
        updatedAt: now,
      });
      console.log(`✅ Updated existing destination: ${item.name} (${item.slug}) -> doc ID: ${doc.id}`);
    } else {
      const ref = await db.collection("destinations").add({
        ...item,
        createdAt: now,
        updatedAt: now,
        addedBy: "curated",
        addedByAdmin: true,
      });
      console.log(`✨ Created new destination: ${item.name} (${item.slug}) -> doc ID: ${ref.id}`);
    }
  }

  console.log("\n🎉 All 6 destinations successfully saved and enriched in Firestore!");
  process.exit(0);
}

updateDestinations().catch((err) => {
  console.error("❌ Error updating destinations:", err);
  process.exit(1);
});
