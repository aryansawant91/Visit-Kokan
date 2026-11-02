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

async function findPotentialDuplicates() {
  const snap = await db.collection('treks').get();
  const treks = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log(`Analyzing ${treks.length} treks for content similarities...`);

  const duplicates = [];
  for (let i = 0; i < treks.length; i++) {
    for (let j = i + 1; j < treks.length; j++) {
      const t1 = treks[i];
      const t2 = treks[j];

      // Check word similarity in name
      const words1 = new Set(t1.name.toLowerCase().split(/\s+/).filter(w => w.length > 3));
      const words2 = new Set(t2.name.toLowerCase().split(/\s+/).filter(w => w.length > 3));
      let common = 0;
      for (const w of words1) {
        if (words2.has(w)) common++;
      }

      if (common >= 2) {
        duplicates.push({
          t1: { id: t1.id, slug: t1.slug, name: t1.name },
          t2: { id: t2.id, slug: t2.slug, name: t2.name },
          commonWords: common
        });
      }
    }
  }

  console.log(`Found ${duplicates.length} pairs with 2+ common words in name:`);
  duplicates.forEach(d => {
    console.log(`\nPair:`);
    console.log(`  1: [${d.t1.slug}] (ID: ${d.t1.id}) "${d.t1.name}"`);
    console.log(`  2: [${d.t2.slug}] (ID: ${d.t2.id}) "${d.t2.name}"`);
  });
}

findPotentialDuplicates().then(() => process.exit(0));

