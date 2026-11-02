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

async function inspectTreks() {
  const snap = await db.collection('treks').get();
  console.log('Total trek documents in Firestore:', snap.size);

  const treks = [];
  const slugCount = {};
  const nameMap = {};

  snap.docs.forEach((doc) => {
    const data = doc.data();
    const t = {
      id: doc.id,
      slug: data.slug || '',
      name: data.name || '',
      category: data.category || '',
      region: data.region || '',
      images: data.images || [],
    };
    treks.push(t);

    slugCount[t.slug] = (slugCount[t.slug] || 0) + 1;

    // Normalised name for finding close duplicates
    const norm = t.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!nameMap[norm]) nameMap[norm] = [];
    nameMap[norm].push(t);
  });

  console.log('\n--- DUPLICATE SLUGS ---');
  let duplicateSlugsFound = false;
  for (const [slug, count] of Object.entries(slugCount)) {
    if (count > 1) {
      duplicateSlugsFound = true;
      console.log(`Slug "${slug}" occurs ${count} times:`);
      treks.filter(t => t.slug === slug).forEach(t => {
        console.log(`  - docId: ${t.id}, name: "${t.name}", images count: ${t.images.length}`);
      });
    }
  }
  if (!duplicateSlugsFound) {
    console.log('No exact duplicate slugs found.');
  }

  console.log('\n--- SIMILAR / DUPLICATE NAMES ---');
  let duplicateNamesFound = false;
  for (const [norm, list] of Object.entries(nameMap)) {
    if (list.length > 1) {
      duplicateNamesFound = true;
      console.log(`Normalized name "${norm}" matches ${list.length} treks:`);
      list.forEach(t => {
        console.log(`  - docId: ${t.id}, slug: "${t.slug}", name: "${t.name}"`);
      });
    }
  }
  if (!duplicateNamesFound) {
    console.log('No exact normalized duplicate names found.');
  }

  // Also search for substrings or common fort names appearing multiple times (e.g., "Torna", "Harishchandragad", "Rajgad", etc.)
  console.log('\n--- TREKS WITH POTENTIALLY OVERLAPPING FORTS ---');
  const fortKeywords = [
    'torna', 'harishchandra', 'rajgad', 'raigad', 'kalavantin', 'sudhagad',
    'kalsubai', 'pratapgad', 'lohagad', 'ratangad', 'shivneri', 'visapur',
    'janjira', 'vijaydurg', 'sindhudurg', 'devkund', 'sandhan', 'sinhagad',
    'tikona', 'panhala', 'mahipatgad', 'suvarnadurg', 'vasota', 'tung',
    'padargad', 'chanderi', 'alang', 'madangad', 'kulang', 'harihar'
  ];

  for (const kw of fortKeywords) {
    const matching = treks.filter(t => 
      t.slug.toLowerCase().includes(kw) || t.name.toLowerCase().includes(kw)
    );
    if (matching.length > 1) {
      console.log(`Keyword "${kw}" found in ${matching.length} treks:`);
      matching.forEach(t => {
        console.log(`  - docId: ${t.id}, slug: "${t.slug}", name: "${t.name}", images: ${JSON.stringify(t.images.slice(0, 1))}`);
      });
    }
  }

  console.log('\n--- ALL TREKS LIST & THEIR CURRENT IMAGE ---');
  treks.forEach((t, i) => {
    console.log(`${i + 1}. [${t.slug}] "${t.name}"`);
    console.log(`   Image[0]: ${t.images[0] || 'NONE'}`);
  });
}

inspectTreks().catch(console.error).finally(() => process.exit(0));

