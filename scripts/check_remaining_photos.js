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

async function checkRemaining() {
  const snap = await db.collection('treks').get();
  const unsplash = [];
  const local = [];

  snap.docs.forEach(d => {
    const data = d.data();
    const img = data.images?.[0] || '';
    if (img.startsWith('/images/treks/')) {
      local.push({ slug: data.slug, name: data.name, img });
    } else {
      unsplash.push({ id: d.id, slug: data.slug, name: data.name, img });
    }
  });

  console.log(`\n✅ Treks with local authentic photos: ${local.length}`);
  console.log(`⚠️ Treks still needing authentic photos: ${unsplash.length}`);
  unsplash.forEach((t, i) => {
    console.log(`${i + 1}. [${t.slug}] "${t.name}"`);
  });
}

checkRemaining().then(() => process.exit(0));

