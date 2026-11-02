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

async function check() {
  const snap = await db.collection('treks').get();
  console.log('Total Treks:', snap.size);
  const withoutHistory = [];
  const withHistory = [];

  snap.docs.forEach((doc, idx) => {
    const data = doc.data();
    const item = {
      index: idx + 1,
      id: doc.id,
      slug: data.slug,
      name: data.name,
      category: data.category,
      region: data.region,
      difficulty: data.difficulty,
      hasHistory: !!data.history,
      hasBaseVillages: !!(data.baseVillages && data.baseVillages.length > 0)
    };
    if (item.hasHistory && item.hasBaseVillages) {
      withHistory.push(item);
    } else {
      withoutHistory.push(item);
    }
  });

  console.log('\n--- ALREADY FULLY UPDATED (' + withHistory.length + ') ---');
  withHistory.forEach(t => console.log(`${t.index}. [${t.slug}] ${t.name}`));

  console.log('\n--- NEEDS REAL INFO UPDATE (' + withoutHistory.length + ') ---');
  withoutHistory.forEach(t => console.log(`${t.index}. [${t.slug}] ${t.name} (${t.category})`));
}

check().catch(console.error).finally(() => process.exit(0));

