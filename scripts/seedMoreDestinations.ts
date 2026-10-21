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
    shortDescription: string;
    description: string;
    category: "beach" | "fort" | "waterfall" | "temple" | "village" | "island" | "trek" | "other";
    region: string;
    images: string[];
    highlights: string[];
    bestSeason: string;
    howToReach: string;
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
        name: "Shrivardhan",
        slug: "shrivardhan",
        shortDescription: "A heritage coastal town, ancestral home of the Peshwas, with a calm beach.",
        description:
            "Shrivardhan is a small coastal town in Raigad and the ancestral place of the Peshwa family. It combines a calm, uncrowded beach with old Konkan houses, temples and fresh seafood, and is easy to combine with neighbouring Diveagar and Harihareshwar.",
        category: "beach",
        region: "Raigad",
        images: IMG.beachB,
        highlights: ["Shrivardhan Beach", "Peshwa Heritage", "Old Konkan Houses", "Fresh Seafood", "Temple Visits"],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway station is Mangaon on the Konkan Railway, from where taxis and buses run to Shrivardhan. By road it is reached via NH66 and the Mangaon–Shrivardhan road.",
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
        name: "Devbag",
        slug: "devbag",
        shortDescription: "Where the Karli river meets the sea, with a sandbar called Tsunami Island.",
        description:
            "Devbag lies at the confluence of the Karli river and the Arabian Sea near Malvan, creating a calm estuary beach with spectacular views. A sandbar nearby, known locally as Tsunami Island, is a popular boat-ride stop, and Devbag is a hub for water sports and diving close to Tarkarli.",
        category: "beach",
        region: "Sindhudurg",
        images: IMG.beachA,
        highlights: ["Karli River Sangam", "Tsunami Island", "Water Sports", "Scuba & Snorkeling", "Sunset Views"],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway station is Kudal on the Konkan Railway. From Kudal take a taxi or bus to Malvan and continue to Devbag.",
    },
    {
        name: "Sindhudurg Fort",
        slug: "sindhudurg-fort",
        shortDescription: "Shivaji Maharaj's island sea fort off Malvan, reached by a short boat ride.",
        description:
            "Sindhudurg Fort was built by Chhatrapati Shivaji Maharaj in the 1660s on a rocky island just off Malvan to guard the Konkan coast. A short boat ride from Malvan jetty brings you to massive sea-facing walls, a temple dedicated to Shivaji Maharaj inside the fort, and handprint and footprint imprints traditionally attributed to him.",
        category: "fort",
        region: "Sindhudurg",
        images: IMG.fortB,
        highlights: ["Boat Ride from Malvan Jetty", "Shivaji Maharaj Temple", "Sea-Facing Bastions", "Historic Imprints", "Panoramic Sea Views"],
        bestSeason: "October to March",
        howToReach:
            "Nearest railway station is Kudal on the Konkan Railway. Reach Malvan by taxi or bus, then take a short boat from Malvan jetty to the fort.",
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