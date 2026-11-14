/**
 * One-time script: Publish Raigad Fort trek and open it for booking.
 * Run with: ts-node --project tsconfig.node.json scripts/approveRaigadFortTrek.ts
 */

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
  // Try multiple possible slugs the trek might be stored under
  const slugsToTry = [
    "raigad-fort-heritage-climb",
    "raigad-fort-sovereign-citadel-climb",
    "raigad-fort",
    "raigad-fort-trek",
  ];

  let found = false;

  for (const slug of slugsToTry) {
    const snap = await db
      .collection("treks")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (!snap.empty) {
      const doc = snap.docs[0];
      await doc.ref.update({
        approved: true,
        isBookable: true,
        bookingStatus: "open",
        updatedAt: new Date().toISOString(),
      });
      console.log(`✅ Raigad Fort Trek (slug: "${slug}", id: ${doc.id})`);
      console.log(`   → approved: true`);
      console.log(`   → isBookable: true`);
      console.log(`   → bookingStatus: "open"`);
      console.log(`   → Visible to public and open for booking!`);
      found = true;
      break;
    }
  }

  if (!found) {
    // List all treks so we can find the right slug
    console.log("❌ Raigad Fort Trek not found with known slugs. Listing all treks:");
    const all = await db.collection("treks").get();
    all.docs.forEach((d) => {
      const data = d.data();
      console.log(`  - slug: "${data.slug}" | name: "${data.name}" | approved: ${data.approved}`);
    });
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
