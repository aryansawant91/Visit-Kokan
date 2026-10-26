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

// Placeholder photos reused from your existing seeds (known to work).
// Replace with real photos of each place from the admin panel later.
const IMG = {
    beachA: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
        "https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=800&q=80",
    ],
    beachB: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
        "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    ],
    beachC: [
        "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        "https://images.unsplash.com/photo-1527489377706-5bf97e608852?w=800&q=80",
    ],
    beachD: [
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
        "https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800&q=80",
    ],
    fortA: [
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80",
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    ],
    fortB: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    ],
    waterfall: [
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    ],
    templeA: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
        "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800&q=80",
        "https://images.unsplash.com/photo-1561016444-14f747499547?w=800&q=80",
    ],
    templeB: [
        "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&q=80",
        "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    green: [
        "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=80",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    ],
    town: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
        "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
        "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&q=80",
    ],
};

interface Seed {
    name: string;
    slug: string;
    tagline?: string;
    shortDescription: string;
    description: string;
    category: "beach" | "fort" | "waterfall" | "temple" | "village" | "island" | "trek" | "other";
    region: string;
    images: string[];
    coverImage?: string;
    highlights: string[];
    bestSeason: string;
    howToReach: string | { byRoad?: string; byTrain?: string; byFerry?: string; tip?: string };
    thingsToDo?: string[];
    foodToTry?: string[];
    nearbyPlaces?: any[];
    stayOptions?: string;
    entryFee?: string;
    timings?: string;
    bestTimeToVisit?: string;
    warnings?: string[];
    tags?: string[];
    featured?: boolean;
    approved?: boolean;
}

const places: Seed[] = [
    // ───────────────────────────── RAIGAD ─────────────────────────────
    {
        name: "Diveagar",
        slug: "diveagar",
        shortDescription:
            "A serene coastal hamlet in Raigad renowned for its 5-km stretch of untouched golden sands bordered by dense casuarina groves, and home to the historic Suvarna Ganesh Temple.",
        description:
            "Diveagar is a tranquil coastal sanctuary located in the Shrivardhan taluka of Raigad district, celebrated for its expansive 5-kilometer shoreline of hard-packed sands where gentle waves meet dense casuarina and betel nut orchards. Historically renowned following the dramatic 1997 discovery of a pure gold Ganesha mask buried in a local wadi, the village combines deep spiritual heritage with unspoiled Konkani charm. Days here move at an unhurried coastal rhythm, whether you are enjoying quad biking and parasailing on the breezy flats or relishing authentic home-cooked Surmai thalis and hot Ukdiche Modak under coconut palms.",
        category: "beach",
        region: "Raigad",
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/8/89/Diveagar_beach.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/6/68/Diveagar_Ganpati_Temple.JPG",
            "https://upload.wikimedia.org/wikipedia/commons/2/25/Diveagar_beach_another_view.jpg",
        ],
        highlights: [
            "Suvarna Ganesh idol adorned with intricate craftsmanship and gold leaf",
            "5-km wide shoreline with firm white sands perfect for sunset strolls",
            "Dense green canopy of coastal Suru (casuarina) and betel nut plantations",
            "12th-century Rupnarayan Temple with black-stone Vishnu idol",
            "Thrilling beach water sports including parasailing, jet skiing, and ATV quad rides",
            "Winter migratory bird sightings and occasional Olive Ridley sea turtle nesting",
        ],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway station is Mangaon (48 km) on the Konkan Railway. By road via NH66 from Mumbai (180 km) or via Tamhini Ghat from Pune (160 km). Or take the vehicle ferry from Agardanda to Dighi Jetty (15 km from Diveagar).",
    },
    {
        name: "Shrivardhan Beach",
        slug: "shrivardhan",
        tagline: "Where golden shores meet the proud heritage of the Peshwas",
        shortDescription: "A historic coastal haven in Raigad district, famed for its sprawling palm-lined beach promenade, ancestral Maratha Peshwa legacy, water sports, and fresh coastal Malvani cuisine.",
        description:
            "Cradled along the Raigad coastline between gentle hills and the Arabian Sea, Shrivardhan is a historic beach getaway steeped in Maratha coastal lore. Renowned as the birthplace of Balaji Vishwanath, the first Peshwa, the town gracefully balances its rich past with a relaxed seaside atmosphere. A wide crescent shoreline of soft black and golden sand is lined with a modern paved beach promenade, making it ideal for peaceful barefoot walks, cycling, and stunning sunset views. Beyond the waves, ancient shrines like the historic Laxminarayan Temple and traditional betel nut wadis invite travellers to slow down and relish authentic Konkan hospitality.",
        category: "beach",
        region: "Raigad",
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/4/4b/Srivardhan_beach.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/8/8f/Shrivardhan_Beach_2.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/c/c1/Shrivardhan_Beach_4.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/0/0a/Peshwa_Balaji_Vishwanath.jpg"
        ],
        coverImage: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Srivardhan_beach.jpg",
        highlights: [
            "Long crescent beach with soft dark sands and a modern paved walking promenade",
            "Ancestral birthplace of the Maratha Peshwa dynasty, featuring the Balaji Vishwanath memorial",
            "Historic Laxminarayan Temple showcasing traditional Peshwa-era wooden architecture",
            "Exciting seasonal water sports including parasailing, banana rides, and jet skiing",
            "Convenient gateway connecting Diveagar (18 km) and sacred Harihareshwar (18 km)"
        ],
        bestSeason: "October to March",
        howToReach: {
            byRoad: "185 km from Mumbai via NH66 (Mangaon–Mhasla, 4.5 hrs); 160 km from Pune via Tamhini Ghat (4 hrs).",
            byTrain: "Mangaon Railway Station (48 km) on the Konkan Railway. Regular state buses and private taxis connect directly to Shrivardhan in 1 hour.",
            byFerry: "Dighi to Agardanda ferry connects north towards Murud-Janjira; Bagmandla ferry connects south towards Bankot and Velas.",
            tip: "Combine Shrivardhan with Diveagar and Harihareshwar for a complete 3-beach Konkan circuit."
        },
        thingsToDo: [
            "Stroll along the landscaped seaside promenade during sunrise and sunset",
            "Visit the historic Laxminarayan Temple and the Balaji Vishwanath Peshwa Smarak",
            "Enjoy beach water sports such as jet skiing, speed boating, and parasailing",
            "Take a scenic 20-minute coastal drive to Harihareshwar's cliffside Shiva shrine",
            "Feast on authentic home-cooked Malvani fish thalis and fresh solkadhi"
        ],
        foodToTry: [
            "Malvani Surmai & Pomfret Thali — Fresh local catch served with spicy coconut curry, solkadhi, and rice",
            "Prawn Masala Fry — Succulent Arabian Sea prawns tossed in fiery regional spices",
            "Solkadhi — Tangy pink digestive drink prepared from fresh coconut milk and wild kokum",
            "Rice Bhakri with Kalva (Clams) Sukka — Soft rice flatbread with spicy dry shellfish masala",
            "Ukadiche Modak — Traditional steamed rice dumplings with coconut and organic jaggery filling"
        ],
        nearbyPlaces: [
            {
                name: "Harihareshwar Beach & Temple",
                distance: "18 km",
                why: "Ancient cliffside Shiva shrine and dramatic rocky pradakshina trail known as Dakshin Kashi.",
                slug: "harihareshwar"
            },
            {
                name: "Diveagar Beach",
                distance: "18 km",
                why: "Vast white-sand beach known for watersports, seagulls, and the sacred Suvarna Ganesh Temple.",
                slug: "diveagar"
            },
            {
                name: "Bankot Fort",
                distance: "35 km (via ferry)",
                why: "Historic laterite fortress guarding the mouth of the Savitri River with sweeping ocean panoramas.",
                slug: "bankot-fort"
            },
            {
                name: "Velas Beach",
                distance: "38 km (via ferry)",
                why: "Protected eco-village celebrated for community Olive Ridley sea turtle conservation and festival.",
                slug: "velas-beach"
            }
        ],
        stayOptions: "MTDC resort, boutique coastal hotels, and welcoming family homestays nestled amidst betel nut orchards along the beach road.",
        entryFee: "Beach and temple access is free. Water sports and beach activities have separate operator charges.",
        timings: "Beach open 24/7. Water sports operate 8:00 AM to 6:30 PM. Temples open 6:00 AM to 8:30 PM.",
        bestTimeToVisit: "Early mornings for peaceful promenade walks; 4:30 PM to 6:30 PM for water sports and golden-hour sunsets.",
        warnings: [
            "⚠️ Sea Caution: Respect lifeguard flags and avoid deep swimming during sudden high swells.",
            "🏄 Water Sports: Verify safety lifejackets and licensed operators before taking water rides.",
            "💵 Payment Connectivity: Keep sufficient cash as local shacks and auto-rickshaws may face network glitches."
        ],
        tags: [
            "beach",
            "shrivardhan",
            "peshwa-history",
            "raigad",
            "sunset",
            "promenade",
            "family",
            "malvani-food",
            "weekend-getaway"
        ],
        featured: true,
        approved: true,
    },
    {
        name: "Kolad",
        slug: "kolad",
        shortDescription: "Monsoon white-water rafting on the Kundalika River.",
        description:
            "Kolad sits on the Kundalika River and is Maharashtra's best-known spot for white-water rafting, with rapids that run during the monsoon when the river is released from upstream. Riverside adventure camps offer rafting, river-crossing activities and overnight stays surrounded by the green Sahyadri foothills.",
        category: "other",
        region: "Raigad",
        images: IMG.waterfall,
        highlights: ["White-Water Rafting", "Kundalika River", "Riverside Camps", "Monsoon Greenery", "Adventure Activities"],
        bestSeason: "June to September",
        howToReach:
            "Kolad has its own station on the Konkan Railway. By road, it lies on NH66 south of Mumbai and is a common stop on the way to the coast.",
    },
    {
        name: "Korlai & Revdanda",
        slug: "korlai-revdanda",
        shortDescription: "Portuguese-era forts, a lighthouse and a rare Indo-Portuguese Creole village.",
        description:
            "Korlai and Revdanda, on the coast between Alibaug and Murud, preserve the Portuguese chapter of the Konkan. Korlai Fort sits on a rocky headland with a lighthouse and wide sea views, and the village of Korlai is known for its unique Indo-Portuguese Creole language. Nearby Revdanda has its own Portuguese fort ruins and a quiet beach.",
        category: "fort",
        region: "Raigad",
        images: IMG.fortA,
        highlights: ["Korlai Fort", "Korlai Lighthouse", "Portuguese Heritage", "Revdanda Fort Ruins", "Coastal Views"],
        bestSeason: "October to March",
        howToReach:
            "There is no railway station right at the site. Take a bus or ferry to Alibaug and continue by road towards Revdanda and Korlai, or come via Murud.",
    },
    {
        name: "Raigad Fort",
        slug: "raigad-fort",
        shortDescription: "Chhatrapati Shivaji Maharaj's capital and coronation site, reached by steps or ropeway.",
        description:
            "Raigad Fort in the Sahyadris near Mahad was the capital of Chhatrapati Shivaji Maharaj's kingdom and the site of his coronation. Visitors climb about 1,700 steps or take the ropeway from the base village of Pachad to explore the Jagdishwar Temple, the royal complex ruins, Hirkani Buruj and Shivaji Maharaj's samadhi. The fort is especially atmospheric in the misty monsoon, though steps become slippery.",
        category: "fort",
        region: "Raigad",
        images: IMG.fortB,
        highlights: ["Shivaji Maharaj Samadhi", "Ropeway Ride", "Jagdishwar Temple", "Royal Complex Ruins", "Hirkani Buruj"],
        bestSeason: "October to February",
        howToReach:
            "Reach Mahad by road (NH66), then take a bus or taxi to Pachad, the base village. Nearest Konkan Railway stations are Veer and Mangaon. The ropeway starts from Pachad.",
    },

    // ───────────────────────────── RATNAGIRI ─────────────────────────────
    {
        name: "Velneshwar",
        slug: "velneshwar",
        shortDescription: "A seaside Shiva temple village with a peaceful beach in Guhagar taluka.",
        description:
            "Velneshwar is a small, quiet village in Guhagar taluka centred on an old Shiva temple and its water tank, with a clean beach a short walk away. It is known for its Mahashivratri fair and makes a calm base for visiting nearby Guhagar and the Hedvi Ganesh temple.",
        category: "temple",
        region: "Ratnagiri",
        images: IMG.templeA,
        highlights: ["Velneshwar Temple", "Quiet Beach", "Mahashivratri Fair", "Hedvi Ganesh Temple Nearby", "Village Homestays"],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway station is Chiplun on the Konkan Railway. From there take a taxi or bus towards Guhagar and Velneshwar.",
    },
    {
        name: "Anjarle",
        slug: "anjarle",
        shortDescription: "A cliff-top Ganesh temple above an uncrowded beach near Dapoli.",
        description:
            "Anjarle, in Dapoli taluka, is known for the Kadyavarcha Ganpati temple perched on a cliff above the sea and for its long, empty beach. The coastal road and village homestays make it a relaxed, scenic stop for anyone slowing down on the Ratnagiri coast.",
        category: "beach",
        region: "Ratnagiri",
        images: IMG.beachD,
        highlights: ["Kadyavarcha Ganpati Temple", "Anjarle Beach", "Cliff Views", "Sunset Point", "Village Homestays"],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway station is Khed on the Konkan Railway. From Khed take a taxi or bus towards Dapoli and then on to Anjarle.",
    },
    {
        name: "Velas",
        slug: "velas",
        shortDescription: "A small village famous for its Olive Ridley turtle conservation and festival.",
        description:
            "Velas is a tiny coastal village in Mandangad taluka that has become well known for protecting nesting Olive Ridley sea turtles. Local villagers run an annual turtle festival, and visitors who time their trip right can watch hatchlings being released into the sea. Stays are mostly in simple village homestays.",
        category: "beach",
        region: "Ratnagiri",
        images: IMG.beachA,
        highlights: ["Olive Ridley Turtle Festival", "Hatchling Releases (seasonal)", "Quiet Beach", "Village Homestays", "Konkani Home Food"],
        bestSeason: "November to March",
        howToReach:
            "Nearest railway station is Khed on the Konkan Railway. From Khed take a taxi or bus towards Mandangad and Velas.",
    },
    {
        name: "Harnai",
        slug: "harnai",
        shortDescription: "A working fishing port with a morning fish auction, sea forts and dolphin trips.",
        description:
            "Harnai is a busy fishing harbour in Dapoli taluka where the day starts with a lively fish auction on the jetty. Offshore stand the sea fort Suvarnadurg and neighbouring forts such as Kanakdurg, and boat trips from the port often spot dolphins. It is a good stop for travellers interested in coastal life and history.",
        category: "beach",
        region: "Ratnagiri",
        images: IMG.beachB,
        highlights: ["Morning Fish Auction", "Dolphin Watching", "Suvarnadurg Fort", "Kanakdurg Fort", "Harnai Beach"],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway station is Khed on the Konkan Railway. From Khed take a taxi or bus towards Dapoli and Harnai.",
    },
    {
        name: "Aare-Ware Beach",
        slug: "aare-ware-beach",
        shortDescription: "Twin beaches along a scenic cliff-top coastal road near Ratnagiri.",
        description:
            "Aare and Ware are two adjoining beaches along the winding coastal road between Ratnagiri and Ganpatipule. The cliff-top drive with continuous views of the Arabian Sea is as much of an attraction as the beaches themselves, and sunsets here are especially good.",
        category: "beach",
        region: "Ratnagiri",
        images: IMG.beachC,
        highlights: ["Scenic Coastal Road", "Aare Beach", "Ware Beach", "Sunset Views", "Photography Spots"],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway station is Ratnagiri. The beaches lie on the Ratnagiri–Ganpatipule coastal road, reachable by taxi, state bus or your own vehicle.",
    },
    {
        name: "Jaigad Fort",
        slug: "jaigad-fort",
        shortDescription: "A coastal hill fort and lighthouse overlooking the Shastri river creek.",
        description:
            "Jaigad Fort stands on a rocky headland where the Shastri river meets the Arabian Sea, with thick bastions and a commanding view of the creek and coastline. A lighthouse and a small beach nearby make it an easy add-on to a Ganpatipule trip.",
        category: "fort",
        region: "Ratnagiri",
        images: IMG.fortB,
        highlights: ["Jaigad Fort", "Jaigad Lighthouse", "Shastri River Creek", "Sea Views", "Photography"],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway station is Ratnagiri. Jaigad is reachable by road from Ratnagiri or Ganpatipule using taxis or your own vehicle.",
    },
    {
        name: "Marleshwar",
        slug: "marleshwar",
        shortDescription: "A hill cave temple of Shiva with the Dhareshwar waterfall below.",
        description:
            "Marleshwar is a cave temple of Lord Shiva tucked into the Sahyadri foothills in Sangameshwar taluka, reached by a climb through green forest. Close by, the Dhareshwar waterfall is at its best in and just after the monsoon, making this a popular nature and pilgrimage stop.",
        category: "waterfall",
        region: "Ratnagiri",
        images: IMG.waterfall,
        highlights: ["Marleshwar Cave Temple", "Dhareshwar Waterfall", "Forest Walk", "Monsoon Greenery", "Mahashivratri Fair"],
        bestSeason: "June to October",
        howToReach:
            "Nearest railway station is Sangameshwar Road on the Konkan Railway. From there take a taxi or bus towards Devrukh and Marleshwar.",
    },
    {
        name: "Chiplun & Parshuram Temple",
        slug: "chiplun-parshuram",
        shortDescription: "A hill temple of Lord Parshuram and crocodile safaris on the Vashishti River.",
        description:
            "Chiplun is a major town on the Konkan route, known for the Parshuram Temple on a hill beside the highway, dedicated to the sixth avatar of Vishnu, who by legend reclaimed the Konkan from the sea. The Vashishti river nearby is known for boat safaris that offer sightings of marsh crocodiles.",
        category: "temple",
        region: "Ratnagiri",
        images: IMG.templeB,
        highlights: ["Parshuram Temple", "Vashishti River Crocodile Safari", "Konkan Railway Hub", "Konkani Markets"],
        bestSeason: "October to March",
        howToReach:
            "Chiplun is a major station on the Konkan Railway and sits directly on NH66, with frequent buses from Mumbai, Pune and Ratnagiri.",
    },

    // ───────────────────────────── SINDHUDURG ─────────────────────────────
    {
        name: "Devbag Beach",
        slug: "devbag",
        tagline: "Where the River Meets the Arabian Sea",
        shortDescription: "Discover a beautiful coastal paradise near Malvan, famous for its golden shoreline, Karli River confluence, seasonal dolphin boat rides, and tranquil Konkan charm.",
        description:
            "Devbag Beach is a scenic coastal destination near Malvan in Sindhudurg district, Maharashtra. Known for its peaceful shoreline and unique location between the Arabian Sea and the Karli River backwaters, Devbag offers an authentic Konkan experience filled with natural beauty, fishing traditions, and coastal adventures. One of its major attractions is Devbag Sangam Point, where the Karli River meets the Arabian Sea, creating a beautiful stretch of sand and water. Visitors can enjoy boat rides, seasonal dolphin-watching excursions, coastal photography, and water sports at nearby backwater spots.",
        category: "beach",
        region: "Sindhudurg",
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/d/db/Devbag_Beach.JPG",
            "https://upload.wikimedia.org/wikipedia/commons/4/41/Devbag_Backwaters.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/8/89/360_Degree_Panoramic_view_of_Devbag_-_Confluence_of_River_Karli_and_the_Arabian_Sea.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/b/b5/Sangam_at_devbagh_photo_by_Rahul_kharade_%28bhandup%29_-_panoramio_%281%29.jpg"
        ],
        coverImage: "https://upload.wikimedia.org/wikipedia/commons/d/db/Devbag_Beach.JPG",
        highlights: ["Karli River Sangam", "Seasonal Dolphin Cruises", "Karli Backwater Boating", "Malvani Seafood", "Sunset Views"],
        bestSeason: "November to May",
        howToReach: {
            byRoad: "Approximately 10–15 km from Malvan town via local coastal roads. Connected via NH66 through Kudal or Kankavli from Mumbai (~500 km) and Pune (~390 km).",
            byTrain: "Kudal Railway Station (KR) is the closest major railhead (~35–40 km). Local taxis, auto-rickshaws, and MSRTC buses connect Kudal to Malvan and Devbag.",
            byFerry: "Local boat transfers and river cruises operate across the Karli backwaters and to Sangam Point, subject to weather and tides.",
            tip: "Plan boat trips during morning high tide for the best water clarity and dolphin sighting opportunities. Check return boat timings with local boatmen."
        },
    },
    {
        name: "Sindhudurg Fort",
        slug: "sindhudurg-fort",
        tagline: "The Sea Fortress of Chhatrapati Shivaji Maharaj",
        shortDescription: "A majestic 17th-century island fortress built in the Arabian Sea by Chhatrapati Shivaji Maharaj, renowned for formidable laterite bastions, maritime history, and sweeping ocean panoramas.",
        description:
            "Sindhudurg Fort is one of Maharashtra's most celebrated historic sea fortresses, situated on Kurte Island just off the coast of Malvan in Sindhudurg district. Commissioned in 1664 by Chhatrapati Shivaji Maharaj to counter foreign naval powers and protect the Maratha maritime frontier, this engineering wonder spans over 48 acres surrounded by the roaring Arabian Sea. Its imposing 30-foot-high ramparts and 42 bastions were anchored using lead molten foundations that have withstood ocean waves for over 350 years. Visitors reach the fort via a 15-minute ferry boat from Malvan jetty.",
        category: "fort",
        region: "Sindhudurg",
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/0/0b/Sindhudurg_Fort_India.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/9/96/Entrance_of_Sindhudurg_fort_%285363545571%29.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/e/ec/Sindhudurg_Fort%2C_Back_Wall.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/6/6a/Sindhudurg_fort_interior.jpg"
        ],
        coverImage: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Sindhudurg_Fort_India.jpg",
        highlights: ["48-Acre Sea Fortress", "42 Laterite Bastions", "Shri Shivrajeshwar Temple", "Historic Hand & Footprints", "Ferry from Malvan Jetty"],
        bestSeason: "October to March",
        howToReach: {
            byRoad: "Reach Malvan town by road from Mumbai (~500 km), Pune (~385 km), or Goa (~140 km). Drive to Malvan Port / Bandar Jetty where ferry tickets are issued.",
            byTrain: "Kudal Railway Station (KR) is ~35 km from Malvan jetty. Regular ST buses and private cabs ply between Kudal and Malvan.",
            byFerry: "Passenger ferry boats run frequently from Malvan Jetty directly to the fort gate, taking ~15 minutes each way (subject to sea conditions).",
            tip: "Ferry services halt during high tide or heavy monsoon seas. Confirm the departure of the last return ferry (typically around 5:00 PM) before walking deep into the fort."
        },
    },
    {
        name: "Vijaydurg",
        slug: "vijaydurg",
        shortDescription: "A major Maratha naval fort on a creek, once nicknamed the Gibraltar of the East.",
        description:
            "Vijaydurg Fort in Devgad taluka was one of the most important bases of the Maratha navy, strategically placed on the Waghotan creek and protected by sturdy sea walls. It was once nicknamed the Gibraltar of the East. The creek and surrounding villages are also known for dolphin-spotting boat trips.",
        category: "fort",
        region: "Sindhudurg",
        images: IMG.fortA,
        highlights: ["Vijaydurg Fort", "Waghotan Creek", "Maratha Naval Heritage", "Dolphin Spotting", "Creek Views"],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway stations are Kankavli and Rajapur Road on the Konkan Railway. From there take a taxi towards Vijaydurg via Devgad.",
    },
    {
        name: "Devgad",
        slug: "devgad",
        shortDescription: "Home of the famous Devgad Alphonso mango, with a seaside fort and beach.",
        description:
            "Devgad is a coastal town in Sindhudurg famous across India for its Alphonso mangoes, which ripen on hillside orchards in the summer. The town also has an old sea fort and a clean beach, making it a rewarding stop for food lovers and history fans, particularly in mango season.",
        category: "fort",
        region: "Sindhudurg",
        images: IMG.green,
        highlights: ["Devgad Alphonso Mangoes", "Devgad Fort", "Devgad Beach", "Mango Orchards", "Seaside Views"],
        bestSeason: "October to May",
        howToReach:
            "Nearest railway station is Kankavli on the Konkan Railway. From Kankavli take a taxi or bus to Devgad.",
    },
    {
        name: "Kunkeshwar Beach",
        slug: "kunkeshwar-beach",
        shortDescription:
            "A beautiful coastal destination in Devgad taluka of Sindhudurg, famous for its serene Arabian Sea shoreline, the ancient Kunkeshwar Shiva Temple, and the timeless charm of traditional Malvani life.",
        description:
            "Kunkeshwar is a peaceful coastal haven nestled along the Arabian Sea in Sindhudurg district, Maharashtra. Known as the 'Kashi of South Konkan', this destination brings together the raw beauty of the Konkan coastline and the spiritual grandeur of its historic Shiva temple. Believed to date back to the 11th or 12th century, the Kunkeshwar Temple stands close to the sea, its traditional stone architecture carrying centuries of devotion and coastal history.",
        category: "beach",
        region: "Sindhudurg",
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/b/b8/Kunakeshwar.JPG",
            "https://upload.wikimedia.org/wikipedia/commons/9/92/Kunkeshwar_seashore_kokan.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/9/9a/Approaching_Kunkeshwar_%285363568029%29.jpg",
        ],
        highlights: [
            "Historic Kunkeshwar Shiva Temple, popularly known as the Kashi of South Konkan",
            "A scenic Arabian Sea shoreline ideal for peaceful walks and sunset watching",
            "Traditional stone temple architecture reflecting historic Yadava-era influences",
            "Beautiful views of the temple and sea",
            "Authentic Malvani cuisine featuring fresh seafood, coconut-based curries, and Solkadhi",
            "Convenient access to Devgad Fort, lighthouse, and nearby beaches",
            "Annual Mahashivratri celebrations and pilgrimage traditions",
        ],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway stations are Kankavli (52 km) and Nandgaon (45 km) on the Konkan Railway. By road via NH66 from Mumbai (440 km) or via Kolhapur from Pune.",
    },
    {
        name: "Sawantwadi",
        slug: "sawantwadi",
        shortDescription: "A royal town known for its palace, lake and traditional wooden toys.",
        description:
            "Sawantwadi is a historic town in Sindhudurg, once the seat of the Sawant Bhosale rulers and now famous for the Sawantwadi Palace, the central Moti Talao lake and its hand-painted lacquerware wooden toys and Ganjifa playing cards. It is the gateway to the Amboli hill station.",
        category: "other",
        region: "Sindhudurg",
        images: IMG.town,
        highlights: ["Sawantwadi Palace", "Moti Talao Lake", "Lacquerware Wooden Toys", "Ganjifa Cards", "Gateway to Amboli"],
        bestSeason: "October to February",
        howToReach:
            "Sawantwadi Road is a station on the Konkan Railway, about a short taxi or bus ride from town. By road it lies off NH66 near the Goa border.",
    },
    {
        name: "Achra",
        slug: "achra",
        shortDescription: "A peaceful village beach with the historic Rameshwar Temple.",
        description:
            "Achra is a quiet village on the Malvan coast with a long, shaded beach and the old Rameshwar Temple, a good example of traditional Konkan temple architecture. It offers a calm, uncrowded alternative to the busier Tarkarli and Malvan beaches nearby.",
        category: "beach",
        region: "Sindhudurg",
        images: IMG.beachD,
        highlights: ["Achra Beach", "Rameshwar Temple", "Quiet Shoreline", "Sunset Views", "Konkani Village Life"],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway station is Kudal on the Konkan Railway. From Kudal take a taxi or bus towards Malvan and then Achra.",
    },
];

async function seed() {
    console.log("🌊 Seeding more Kokan destinations...\n");

    const existing = await db.collection("destinations").get();
    const existingSlugs = new Set(existing.docs.map((d) => d.data().slug));

    let added = 0;
    let skipped = 0;
    const now = new Date().toISOString();

    for (const p of places) {
        if (existingSlugs.has(p.slug)) {
            console.log(`⏭️  Skipped (already exists): ${p.name}`);
            skipped++;
            continue;
        }

        await db.collection("destinations").add({
            ...p,
            coverImage: p.images[0],
            featured: false,
            approved: true,
            addedBy: "seed-script",
            addedByAdmin: true,
            createdAt: now,
            updatedAt: now,
        });
        console.log(`✅ Added: ${p.name} (${p.region})`);
        added++;
    }

    console.log(`\n🎉 Done! Added ${added}, Skipped ${skipped}`);
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
});