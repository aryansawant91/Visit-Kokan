/**
 * One-time script: Set approved = true for the Raigad Fort destination in Firestore.
 * Run with: ts-node --project tsconfig.node.json scripts/approveRaigadFort.ts
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

async function approveRaigadFort() {
  const snap = await db
    .collection("destinations")
    .where("slug", "==", "raigad-fort")
    .limit(1)
    .get();

  if (snap.empty) {
    console.log("❌ Raigad Fort destination not found in Firestore.");
    console.log("   Make sure you have run the seed script first:");
    console.log("   npm run seed:more-destinations");
    process.exit(1);
  }

  const doc = snap.docs[0];
  await doc.ref.update({ approved: true, updatedAt: new Date().toISOString() });
  console.log(`✅ Raigad Fort (id: ${doc.id}) is now visible to the public (approved = true).`);
  process.exit(0);
}

approveRaigadFort().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
