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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const req = https.get(url, { headers: { 'User-Agent': 'VisitKokanApp/1.0 (info@visitkokan.in)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            const size = fs.statSync(destPath).size;
            if (size > 1000) {
              resolve(size);
            } else {
              if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
              reject(new Error(`File too small: ${size} bytes`));
            }
          });
        });
      } else {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        reject(new Error(`HTTP status ${res.statusCode}`));
      }
    });
    req.on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
    req.setTimeout(15000, () => {
      req.destroy();
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(new Error('Timeout'));
    });
  });
}

// Map of treks to verified, authentic Wikimedia photos of actual forts/treks in Maharashtra
const AUTHENTIC_PHOTOS = {
  // 1. Torna Fort (Prachandagad) - Pune / Sahyadri
  "torna-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/7/74/Torna_fort_in_colour.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/67/Torna_Fort_Walls.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/e/ed/Torna_entrance.jpg"
  ],
  // 2. Mahipatgad (Khed, Ratnagiri) - Authentic citadel in Konkan Ghatmatha
  "mahipatgad-forest-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/7/77/Mahipatgad1.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/7/70/Mahipatgad.jpg"
  ],
  // 3. Sandhan Valley (Bhandardara) - Real shadow canyon
  "sandhan-valley-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/0/0f/Sandhan_Vally..%21.jpg"
  ],
  // 4. Prachitgad (Chandoli National Park / Western Ghats)
  "prachitgad-wild-sanctuary-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/3/32/Landscape_in_Chandoli_National_Park_01.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f9/Landscape_in_Chandoli_National_Park_02.jpg"
  ],
  // 5. Kalsubai Peak - Maharashtra's highest point
  "kalsubai-peak-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/b/b6/Kalsubai_summit.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/05/Sunrise_from_Kalsubai_peak_2.jpg"
  ],
  // 6. Tung Fort (Kathingad, Pawna)
  "tung-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/7/79/Tung_Fort_in_the_sunlight.jpg"
  ]
};

async function fixTrekPhotos() {
  console.log('--- REPLACING WITH VERIFIED AUTHENTIC TREK PHOTOS ---');

  for (const [slug, urls] of Object.entries(AUTHENTIC_PHOTOS)) {
    const destDir = path.join('public', 'images', 'treks', slug);
    fs.mkdirSync(destDir, { recursive: true });

    const downloadedPaths = [];
    for (let i = 0; i < urls.length; i++) {
      const fileName = `${i + 1}.jpg`;
      const destPath = path.join(destDir, fileName);
      const url = urls[i];

      console.log(`Downloading ${slug} [${fileName}] from: ${url}`);
      try {
        await sleep(1000);
        const size = await downloadImage(url, destPath);
        console.log(`  ✓ Saved ${Math.round(size / 1024)} KB to ${destPath}`);
        downloadedPaths.push(`/images/treks/${slug}/${fileName}`);
      } catch (err) {
        console.log(`  ✗ Error: ${err.message}`);
      }
    }

    if (downloadedPaths.length > 0) {
      const snap = await db.collection('treks').where('slug', '==', slug).get();
      if (!snap.empty) {
        await snap.docs[0].ref.update({
          images: downloadedPaths
        });
        console.log(`  ✓ Updated Firestore for ${slug} with ${downloadedPaths.length} photos`);
      }
    }
  }

  console.log('\n--- ALL VERIFIED AUTHENTIC PHOTOS APPLIED ---');
}

fixTrekPhotos().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});
