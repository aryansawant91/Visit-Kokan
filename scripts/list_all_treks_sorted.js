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

async function listAllTreks() {
  const snap = await db.collection('treks').get();
  const treks = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log(`Total treks: ${treks.length}`);
  treks.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  treks.forEach((t, i) => {
    console.log(`${(i + 1).toString().padStart(2, ' ')}. [${t.slug}] (ID: ${t.id})`);
    console.log(`    Name: "${t.name}" | Region: "${t.region}" | Category: "${t.category}"`);
  });
}

listAllTreks().catch(console.error).finally(() => process.exit(0));

