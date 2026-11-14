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

async function main() {
  console.log("--- Checking Destinations for Raigad Fort ---");
  const destSnap = await db.collection("destinations").get();
  let foundDest = false;
  for (const doc of destSnap.docs) {
    const data = doc.data();
    if (data.slug === "raigad-fort" || (data.name && data.name.toLowerCase().includes("raigad"))) {
      console.log(`Found destination: [${doc.id}] slug: "${data.slug}" name: "${data.name}" featured: ${data.featured} approved: ${data.approved}`);
      await doc.ref.update({
        featured: true,
        approved: true,
        updatedAt: new Date().toISOString(),
      });
      console.log(`✅ Updated destination [${doc.id}] to featured: true, approved: true`);
      foundDest = true;
    }
  }

  console.log("\n--- Checking Treks for Raigad Fort ---");
  const trekSnap = await db.collection("treks").get();
  let foundTrek = false;
  for (const doc of trekSnap.docs) {
    const data = doc.data();
    if (data.slug?.includes("raigad") || (data.name && data.name.toLowerCase().includes("raigad"))) {
      console.log(`Found trek: [${doc.id}] slug: "${data.slug}" name: "${data.name}" featured: ${data.featured} approved: ${data.approved} isBookable: ${data.isBookable} bookingStatus: "${data.bookingStatus}"`);
      await doc.ref.update({
        featured: true,
        approved: true,
        isBookable: true,
        bookingStatus: "open",
        updatedAt: new Date().toISOString(),
      });
      console.log(`✅ Updated trek [${doc.id}] to featured: true, approved: true, isBookable: true, bookingStatus: "open"`);
      foundTrek = true;
    }
  }

  console.log(`\nSummary: foundDest=${foundDest}, foundTrek=${foundTrek}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
