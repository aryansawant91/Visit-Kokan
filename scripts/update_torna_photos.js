const https = require('https');
const fs = require('fs');
const path = require('path');
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

function dl(url, dest) {
  return new Promise((resolve, reject) => {
    const f = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'VisitKokanApp/1.0 (info@visitkokan.in)' } }, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        dl(r.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (r.statusCode === 200) {
        r.pipe(f);
        f.on('finish', () => {
          f.close();
          resolve(fs.statSync(dest).size);
        });
      } else {
        f.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(new Error(`Status ${r.statusCode}`));
      }
    }).on('error', (err) => {
      f.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function run() {
  const dir = path.join('public', 'images', 'treks', 'torna-fort-trek');
  fs.mkdirSync(dir, { recursive: true });

  console.log('Downloading 1.jpg (Torna Fort Walls)...');
  const s1 = await dl('https://upload.wikimedia.org/wikipedia/commons/6/67/Torna_Fort_Walls.JPG', path.join(dir, '1.jpg'));
  console.log('Saved 1.jpg:', Math.round(s1 / 1024), 'KB');

  console.log('Downloading 2.jpg (Torna Entrance)...');
  const s2 = await dl('https://upload.wikimedia.org/wikipedia/commons/e/ed/Torna_entrance.jpg', path.join(dir, '2.jpg'));
  console.log('Saved 2.jpg:', Math.round(s2 / 1024), 'KB');

  console.log('Downloading 3.jpg (Budhla Machi)...');
  const s3 = await dl('https://upload.wikimedia.org/wikipedia/commons/1/16/Budhla_Machi.jpg', path.join(dir, '3.jpg'));
  console.log('Saved 3.jpg:', Math.round(s3 / 1024), 'KB');

  const snap = await db.collection('treks').where('slug', '==', 'torna-fort-trek').get();
  if (!snap.empty) {
    await snap.docs[0].ref.update({
      coverImage: '/images/treks/torna-fort-trek/1.jpg',
      images: [
        '/images/treks/torna-fort-trek/1.jpg',
        '/images/treks/torna-fort-trek/2.jpg',
        '/images/treks/torna-fort-trek/3.jpg'
      ]
    });
    console.log('Updated Firestore for torna-fort-trek!');
  }
}

run().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
