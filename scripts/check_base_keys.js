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

async function checkOverlaps() {
  const snap = await db.collection('treks').get();
  const treks = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const map = {};
  for (const t of treks) {
    // Extract base fort name
    const clean = t.slug.replace(/-trek$/, '').replace(/-fort$/, '').replace(/-coastal$/, '');
    console.log(`[${t.slug}] -> base key: ${clean} | Name: ${t.name}`);
  }
}

checkOverlaps().then(() => process.exit(0));

