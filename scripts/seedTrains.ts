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

const trains = [
    {
        slug: "tutari-express",
        name: "Tutari Express",
        number: "10103",
        days: "Daily",
        from: "Mumbai CSMT",
        to: "Madgaon",
        stops: [
            { station: "Mumbai CSMT", code: "CSMT", arrival: null, departure: "23:05" },
            { station: "Thane", code: "TNA", arrival: "23:35", departure: "23:37" },
            { station: "Panvel", code: "PNVL", arrival: "00:15", departure: "00:17" },
            { station: "Roha", code: "ROHA", arrival: "01:15", departure: "01:17" },
            { station: "Mangaon", code: "MNG", arrival: "02:10", departure: "02:12" },
            { station: "Khed", code: "KHED", arrival: "03:30", departure: "03:32" },
            { station: "Chiplun", code: "CHI", arrival: "04:45", departure: "04:50" },
            { station: "Sangameshwar", code: "SRGM", arrival: "05:30", departure: "05:32" },
            { station: "Ratnagiri", code: "RN", arrival: "06:15", departure: "06:20" },
            { station: "Kankavli", code: "KKW", arrival: "07:30", departure: "07:32" },
            { station: "Kudal", code: "KUDL", arrival: "08:15", departure: "08:17" },
            { station: "Sawantwadi Road", code: "SWV", arrival: "08:45", departure: "08:47" },
            { station: "Madgaon", code: "MAO", arrival: "10:30", departure: null },
        ],
        konkanStops: ["Roha", "Khed", "Chiplun", "Ratnagiri", "Kankavli", "Kudal", "Sawantwadi Road"],
    },
    {
        slug: "jan-shatabdi-express",
        name: "Jan Shatabdi Express",
        number: "12051",
        days: "Daily except Sunday",
        from: "Mumbai CSMT",
        to: "Madgaon",
        stops: [
            { station: "Mumbai CSMT", code: "CSMT", arrival: null, departure: "05:25" },
            { station: "Thane", code: "TNA", arrival: "05:52", departure: "05:54" },
            { station: "Panvel", code: "PNVL", arrival: "06:28", departure: "06:30" },
            { station: "Roha", code: "ROHA", arrival: "07:15", departure: "07:17" },
            { station: "Mangaon", code: "MNG", arrival: "08:05", departure: "08:07" },
            { station: "Khed", code: "KHED", arrival: "09:20", departure: "09:22" },
            { station: "Chiplun", code: "CHI", arrival: "10:20", departure: "10:25" },
            { station: "Ratnagiri", code: "RN", arrival: "11:45", departure: "11:50" },
            { station: "Kankavli", code: "KKW", arrival: "13:55", departure: "13:57" },
            { station: "Kudal", code: "KUDL", arrival: "14:35", departure: "14:37" },
            { station: "Sawantwadi Road", code: "SWV", arrival: "15:05", departure: "15:07" },
            { station: "Madgaon", code: "MAO", arrival: "16:45", departure: null },
        ],
        konkanStops: ["Roha", "Khed", "Chiplun", "Ratnagiri", "Kankavli", "Kudal", "Sawantwadi Road"],
    },
    {
        slug: "matsyagandha-express",
        name: "Matsyagandha Express",
        number: "11093",
        days: "Daily",
        from: "Mumbai LTT",
        to: "Mangaluru",
        stops: [
            { station: "Mumbai LTT", code: "LTT", arrival: null, departure: "11:35" },
            { station: "Panvel", code: "PNVL", arrival: "12:40", departure: "12:42" },
            { station: "Roha", code: "ROHA", arrival: "13:45", departure: "13:47" },
            { station: "Khed", code: "KHED", arrival: "15:10", departure: "15:12" },
            { station: "Chiplun", code: "CHI", arrival: "16:15", departure: "16:20" },
            { station: "Ratnagiri", code: "RN", arrival: "17:40", departure: "17:45" },
            { station: "Kankavli", code: "KKW", arrival: "20:15", departure: "20:17" },
            { station: "Kudal", code: "KUDL", arrival: "21:00", departure: "21:02" },
            { station: "Sawantwadi Road", code: "SWV", arrival: "21:35", departure: "21:37" },
            { station: "Madgaon", code: "MAO", arrival: "23:15", departure: "23:20" },
        ],
        konkanStops: ["Roha", "Khed", "Chiplun", "Ratnagiri", "Kankavli", "Kudal", "Sawantwadi Road"],
    },
    {
        slug: "netravati-express",
        name: "Netravati Express",
        number: "16345",
        days: "Daily",
        from: "Mumbai LTT",
        to: "Thiruvananthapuram",
        stops: [
            { station: "Mumbai LTT", code: "LTT", arrival: null, departure: "11:40" },
            { station: "Panvel", code: "PNVL", arrival: "12:45", departure: "12:47" },
            { station: "Roha", code: "ROHA", arrival: "13:50", departure: "13:52" },
            { station: "Khed", code: "KHED", arrival: "15:20", departure: "15:22" },
            { station: "Chiplun", code: "CHI", arrival: "16:25", departure: "16:30" },
            { station: "Ratnagiri", code: "RN", arrival: "17:50", departure: "17:55" },
            { station: "Kankavli", code: "KKW", arrival: "20:30", departure: "20:32" },
            { station: "Kudal", code: "KUDL", arrival: "21:15", departure: "21:17" },
            { station: "Sawantwadi Road", code: "SWV", arrival: "21:50", departure: "21:52" },
            { station: "Madgaon", code: "MAO", arrival: "23:30", departure: "23:35" },
        ],
        konkanStops: ["Roha", "Khed", "Chiplun", "Ratnagiri", "Kankavli", "Kudal", "Sawantwadi Road"],
    },
    {
        slug: "konkan-kanya-express",
        name: "Konkan Kanya Express",
        number: "10111",
        days: "Daily",
        from: "Mumbai CSMT",
        to: "Madgaon",
        stops: [
            { station: "Mumbai CSMT", code: "CSMT", arrival: null, departure: "23:00" },
            { station: "Thane", code: "TNA", arrival: "23:30", departure: "23:32" },
            { station: "Panvel", code: "PNVL", arrival: "00:10", departure: "00:12" },
            { station: "Roha", code: "ROHA", arrival: "01:10", departure: "01:12" },
            { station: "Khed", code: "KHED", arrival: "03:25", departure: "03:27" },
            { station: "Chiplun", code: "CHI", arrival: "04:40", departure: "04:45" },
            { station: "Ratnagiri", code: "RN", arrival: "06:10", departure: "06:15" },
            { station: "Kankavli", code: "KKW", arrival: "07:25", departure: "07:27" },
            { station: "Kudal", code: "KUDL", arrival: "08:10", departure: "08:12" },
            { station: "Sawantwadi Road", code: "SWV", arrival: "08:40", departure: "08:42" },
            { station: "Madgaon", code: "MAO", arrival: "10:15", departure: null },
        ],
        konkanStops: ["Roha", "Khed", "Chiplun", "Ratnagiri", "Kankavli", "Kudal", "Sawantwadi Road"],
    },
    {
        slug: "mandovi-express",
        name: "Mandovi Express",
        number: "10103",
        days: "Daily",
        from: "Mumbai CSMT",
        to: "Madgaon",
        stops: [
            { station: "Mumbai CSMT", code: "CSMT", arrival: null, departure: "07:10" },
            { station: "Thane", code: "TNA", arrival: "07:40", departure: "07:42" },
            { station: "Panvel", code: "PNVL", arrival: "08:20", departure: "08:22" },
            { station: "Roha", code: "ROHA", arrival: "09:20", departure: "09:22" },
            { station: "Khed", code: "KHED", arrival: "10:50", departure: "10:52" },
            { station: "Chiplun", code: "CHI", arrival: "11:55", departure: "12:00" },
            { station: "Ratnagiri", code: "RN", arrival: "13:20", departure: "13:25" },
            { station: "Kankavli", code: "KKW", arrival: "15:45", departure: "15:47" },
            { station: "Kudal", code: "KUDL", arrival: "16:30", departure: "16:32" },
            { station: "Sawantwadi Road", code: "SWV", arrival: "17:05", departure: "17:07" },
            { station: "Madgaon", code: "MAO", arrival: "18:45", departure: null },
        ],
        konkanStops: ["Roha", "Khed", "Chiplun", "Ratnagiri", "Kankavli", "Kudal", "Sawantwadi Road"],
    },
];

async function seed() {
    console.log("🚂 Seeding Konkan Railway trains...\n");

    const existing = await db.collection("trains").get();
    const existingSlugs = new Set(existing.docs.map((d) => d.data().slug));

    let added = 0;
    let skipped = 0;
    const now = new Date().toISOString();

    for (const train of trains) {
        if (existingSlugs.has(train.slug)) {
            console.log(`⏭️  Skipped: ${train.name}`);
            skipped++;
            continue;
        }

        await db.collection("trains").add({
            ...train,
            createdAt: now,
            updatedAt: now,
        });
        console.log(`✅ Added: ${train.name} (${train.number})`);
        added++;
    }

    console.log(`\n🎉 Done! Added ${added}, Skipped ${skipped}`);
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
});