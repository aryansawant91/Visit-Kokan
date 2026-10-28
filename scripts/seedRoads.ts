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

const roads = [
    {
        slug: "mumbai-raigad-fort",
        from: "Mumbai",
        to: "Raigad Fort",
        distance: "140 km",
        duration: "3.5-4 hrs",
        via: "NH66 via Panvel, Pen bypass, Mangaon, Mahad, Pachad",
        ferryOption: null,
        tip: "Start early (5:30 AM) via NH66. Turn off at Mahad towards Pachad for Raigad ropeway.",
        tollApprox: "₹150",
        fuelApprox: "₹750",
        mapsQuery: "Raigad Fort Maharashtra",
        bestDepartTime: "5:00 AM - 6:00 AM",
        breakpoints: [
            { place: "Vadkhal Naka", km: 65, note: "Breakfast stop for poha & chai" },
            { place: "Mangaon", km: 115, note: "Nearest Konkan Railway hub" },
            { place: "Mahad", km: 135, note: "Turn off NH66 towards Pachad (Raigad base)" },
        ],
    },
    {
        slug: "mumbai-alibaug",
        from: "Mumbai",
        to: "Alibaug",
        distance: "95 km",
        duration: "2.5-3 hrs",
        via: "NH66 via Pen bypass",
        ferryOption: "Ferry from Gateway of India → Mandwa (1 hr) then 15 min auto",
        tip: "Ferry is scenic and saves time. Last ferry 6 PM.",
        tollApprox: "₹150",
        fuelApprox: "₹400",
        mapsQuery: "Mumbai to Alibaug",
        bestDepartTime: "Before 8 AM or after 7 PM to avoid traffic",
    },
    {
        slug: "mumbai-tarkarli",
        from: "Mumbai",
        to: "Tarkarli",
        distance: "490 km",
        duration: "8-9 hrs",
        via: "NH66 via Mahad, Chiplun, Ratnagiri, Kankavli",
        ferryOption: null,
        tip: "Start by 4-5 AM to avoid Pune traffic. Stop at Chiplun for lunch.",
        tollApprox: "₹600",
        fuelApprox: "₹2,500",
        mapsQuery: "Mumbai to Tarkarli Beach",
        bestDepartTime: "4:00 AM - 5:00 AM",
        breakpoints: [
            { place: "Khopoli", km: 80, note: "Breakfast stop" },
            { place: "Chiplun", km: 260, note: "Lunch stop, famous for Parshuram Temple" },
            { place: "Ratnagiri", km: 330, note: "Fuel stop" },
            { place: "Kankavli", km: 450, note: "Last major town before Tarkarli" },
        ],
    },
    {
        slug: "mumbai-ganpatipule",
        from: "Mumbai",
        to: "Ganpatipule",
        distance: "375 km",
        duration: "6-7 hrs",
        via: "NH66 via Mahad, Poladpur, Chiplun, Ratnagiri",
        ferryOption: null,
        tip: "Stop at Chiplun for the famous Parshuram Temple and lunch.",
        tollApprox: "₹450",
        fuelApprox: "₹1,800",
        mapsQuery: "Mumbai to Ganpatipule",
        bestDepartTime: "5:00 AM - 6:00 AM",
        breakpoints: [
            { place: "Mahad", km: 165, note: "Breakfast stop" },
            { place: "Chiplun", km: 250, note: "Temple visit + lunch" },
            { place: "Ratnagiri", km: 330, note: "Fuel + snacks" },
        ],
    },
    {
        slug: "mumbai-ratnagiri",
        from: "Mumbai",
        to: "Ratnagiri",
        distance: "330 km",
        duration: "5.5-6.5 hrs",
        via: "NH66 via Mahad, Poladpur, Chiplun",
        ferryOption: null,
        tip: "Smooth NH66 drive. Avoid Friday evenings.",
        tollApprox: "₹380",
        fuelApprox: "₹1,500",
        mapsQuery: "Mumbai to Ratnagiri",
        bestDepartTime: "6:00 AM",
    },
    {
        slug: "mumbai-murud-janjira",
        from: "Mumbai",
        to: "Murud Janjira",
        distance: "165 km",
        duration: "3.5-4 hrs",
        via: "NH66 via Alibag, Murud",
        ferryOption: "Ferry Gateway → Mandwa then drive 2 hrs",
        tip: "Weekend traffic on this route. Start early.",
        tollApprox: "₹200",
        fuelApprox: "₹700",
        mapsQuery: "Mumbai to Murud Janjira Fort",
        bestDepartTime: "6:00 AM",
    },
    {
        slug: "pune-tarkarli",
        from: "Pune",
        to: "Tarkarli",
        distance: "370 km",
        duration: "6-7 hrs",
        via: "NH48 to Kolhapur then NH166 to Kankavli",
        ferryOption: null,
        tip: "Kolhapur route is faster than coastal NH66 from Pune.",
        tollApprox: "₹400",
        fuelApprox: "₹2,000",
        mapsQuery: "Pune to Tarkarli",
        bestDepartTime: "5:00 AM",
        breakpoints: [
            { place: "Kolhapur", km: 228, note: "Breakfast + fuel. Famous for Kolhapuri misal." },
            { place: "Kankavli", km: 340, note: "Last ATM before Tarkarli" },
        ],
    },
    {
        slug: "pune-ganpatipule",
        from: "Pune",
        to: "Ganpatipule",
        distance: "330 km",
        duration: "5.5-6.5 hrs",
        via: "NH48 to Satara then NH166 to Chiplun then coastal",
        ferryOption: null,
        tip: "Beautiful ghat section after Satara. Drive carefully in monsoon.",
        tollApprox: "₹350",
        fuelApprox: "₹1,600",
        mapsQuery: "Pune to Ganpatipule",
        bestDepartTime: "5:00 AM",
    },
    {
        slug: "mumbai-alibaug-ferry",
        from: "Mumbai",
        to: "Alibaug",
        distance: "20 km by sea",
        duration: "1 hr ferry + 15 min auto",
        via: "Ferry from Gateway of India to Mandwa Jetty",
        ferryOption: "Ferry timings: 6 AM to 6 PM every hour",
        tip: "Book ferry tickets online at maharashtraferries.com. Carry cash.",
        tollApprox: "₹0",
        fuelApprox: "Ferry ₹250 per person",
        mapsQuery: "Gateway of India Ferry Mumbai",
        bestDepartTime: "First ferry 6:00 AM",
    },
];

async function seed() {
    console.log("🚗 Seeding road routes...\n");

    const existing = await db.collection("routes").get();
    const existingSlugs = new Set(existing.docs.map((d) => d.data().slug));

    let added = 0;
    let skipped = 0;
    const now = new Date().toISOString();

    for (const road of roads) {
        if (existingSlugs.has(road.slug)) {
            console.log(`⏭️  Skipped: ${road.from} → ${road.to}`);
            skipped++;
            continue;
        }

        await db.collection("routes").add({
            ...road,
            createdAt: now,
            updatedAt: now,
        });
        console.log(`✅ Added: ${road.from} → ${road.to}`);
        added++;
    }

    console.log(`\n🎉 Done! Added ${added}, Skipped ${skipped}`);
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
});