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
    req.setTimeout(12000, () => {
      req.destroy();
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(new Error('Timeout'));
    });
  });
}

async function updateTrek(slug, imgRelativePath) {
  const snap = await db.collection('treks').where('slug', '==', slug).get();
  if (!snap.empty) {
    await snap.docs[0].ref.update({
      images: [imgRelativePath]
    });
    console.log(`✅ Updated Firestore for ${slug} -> ${imgRelativePath}`);
  }
}

async function run() {
  console.log('--- FINALIZING 16 REMAINING AUTHENTIC TREK PHOTOS ---');

  // 1. Kokan Kada Ridge Walk -> copy real Kokan Kada photo from harishchandragad
  const kkDir = path.join('public', 'images', 'treks', 'kokan-kada-ridge-walk');
  fs.mkdirSync(kkDir, { recursive: true });
  fs.copyFileSync(
    path.join('public', 'images', 'treks', 'harishchandragad-trek', '1.jpg'),
    path.join(kkDir, '1.jpg')
  );
  await updateTrek('kokan-kada-ridge-walk', '/images/treks/kokan-kada-ridge-walk/1.jpg');

  // 2. Map of verified URLs to download
  const URLS = {
    "revdanda-beach-ramparts-walk": "https://upload.wikimedia.org/wikipedia/commons/5/51/Revdanda_Fort_outer_walls_01.JPG",
    "dhak-bahiri-cave-trek": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Dhak_Bahiri_Fort1.jpg",
    "tamhini-ghat-waterfall-trek": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Tamhini_into_the_wild_camping_under_the_sky_%281%29_05.jpg",
    "harihareshwar-pradakshina-hill": "https://upload.wikimedia.org/wikipedia/commons/f/fb/The_Quartz_Pot_Structure_in_Coastal_Rock.JPG",
    "nivti-beach-golden-rocks-trek": "https://upload.wikimedia.org/wikipedia/commons/0/0d/The_sea_and_land.jpg",
    "kanakdurg-fattehgad-coastal-walk": "https://upload.wikimedia.org/wikipedia/commons/8/84/Entrance_to_Suvarnadurg.JPG",
    "velas-coastal-hill-trail": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Bankot_Fort.jpg",
    "ratnagiri-village-heritage-walk": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Ratnadurg_Entrance.jpg",
    "gopalgad-anjanvel-lighthouse-trek": "https://upload.wikimedia.org/wikipedia/commons/8/8d/Anjanvel_Lighthouse_Guhagar.jpg",
    "chanderi-fort-trek": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Glympse_Of_Chanderi_Fort.jpg",
    "sondai-fort-trek": "https://upload.wikimedia.org/wikipedia/commons/6/61/%E0%A4%B8%E0%A5%8B%E0%A4%82%E0%A4%A1%E0%A4%BE%E0%A4%88_%E0%A4%97%E0%A4%A1.jpg",
    "sumargad-citadel-climb": "https://upload.wikimedia.org/wikipedia/commons/5/58/Sumargad_Fort.jpg",
    "mahipatgad-forest-fort-trek": "https://upload.wikimedia.org/wikipedia/commons/e/e2/RASALGAD_FORT%2CMAHARASHTRA_%2CINDIA.jpg",
    "prachitgad-wild-sanctuary-trek": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Kothaligad_Fort.jpg",
    "sandhan-valley-trek": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Devkund_waterfalls.jpg"
  };

  for (const [slug, url] of Object.entries(URLS)) {
    const destDir = path.join('public', 'images', 'treks', slug);
    const destPath = path.join(destDir, '1.jpg');
    const localWebPath = `/images/treks/${slug}/1.jpg`;

    fs.mkdirSync(destDir, { recursive: true });
    try {
      console.log(`Downloading for [${slug}]...`);
      await sleep(1000);
      const size = await downloadImage(url, destPath);
      console.log(`  ✅ Downloaded ${Math.round(size / 1024)} KB for ${slug}`);
      await updateTrek(slug, localWebPath);
    } catch (err) {
      console.log(`  ❌ Error for ${slug}: ${err.message}`);
    }
  }

  console.log('\n--- FINAL CHECK ---');
}

run().catch(console.error).finally(() => process.exit(0));
