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

const DIRECT_URLS = {
  "pratapgad-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/c/ca/Pratapgad_The_Fort_of_Valour.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/50/Pratapgad_Fort_Bhavani_Temple.jpg"
  ],
  "devkund-waterfall-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Devkund_waterfalls.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Devkund_Waterfall_Bhira.jpg"
  ],
  "korigad-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/b/b8/Korigad_from_Lonavla.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/c/c5/Korigad_Fort_Wall.jpg"
  ],
  "sindhudurg-sea-wall-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/3/3a/Sindhudurg_fort.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/d/d4/Sindhudurg_Fort_Aerial.jpg"
  ],
  "vijaydurg-coastal-cliff-walk": [
    "https://upload.wikimedia.org/wikipedia/commons/9/9f/Bastions_of_vijaydurg.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f6/Vijaydurg_Fort_Sea_Face.jpg"
  ],
  "suvarnadurg-island-sea-fort": [
    "https://upload.wikimedia.org/wikipedia/commons/8/84/Entrance_to_Suvarnadurg.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/9/94/Suvarnadurg_Fort_Harnai.jpg"
  ],
  "korlai-fort-coastal-trail": [
    "https://upload.wikimedia.org/wikipedia/commons/b/bd/Portuguese_church_of_Korlai_fort.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/96/Korlai_Fort_Lighthouse.jpg"
  ],
  "irshalgad-pinnacle-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/1/14/Irshal_gad_pinnacle.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/6d/Irshalgad_Pinnacle.jpg"
  ],
  "purandar-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/d/d5/Purandar_Fort_-_AB.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/Purandar_Fort_Entrance.jpg"
  ],
  "gorakhgad-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/8/82/Gorakhgad.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/de/Gorakhgad_Fort_Peak.jpg"
  ],
  "amboli-sunset-night-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/4/48/Amboli5.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/95/Amboli_Ghat_waterfall.jpg"
  ],
  "bankot-fort-coastal-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/7/7d/Bankot_Fort.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/30/Bankot_Fort_Entrance.jpg"
  ],
  "karnala-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/5/5a/Yash.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/91/Karnala_Fort_Pinnacle.jpg"
  ],
  "kondane-caves-waterfall-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/3/32/Archaic_archtecture_of_Kondana_caves.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Kondane_Caves_Karjat.jpg"
  ],
  "sandhan-valley-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/6/6f/Sandhan_Valley_The_Valley_of_Shadows.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/30/Sandhan_Valley_Canyon.jpg"
  ],
  "devgad-windmill-cliff-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/c/c9/Devgad_fort.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/d/d9/Devgad_fort_entrance.JPG"
  ],
  "harihareshwar-pradakshina-hill": [
    "https://upload.wikimedia.org/wikipedia/commons/d/d9/Harihareshwar_temple_pradakshina_path.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/4/4c/Harihareshwar_Rocky_Beach.jpg"
  ],
  "velas-coastal-hill-trail": [
    "https://upload.wikimedia.org/wikipedia/commons/6/62/Velas_Beach_Olive_Ridley.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/23/Velas_beach.jpg"
  ],
  "revdanda-beach-ramparts-walk": [
    "https://upload.wikimedia.org/wikipedia/commons/c/c7/Revdanda_Fort_Entrance.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/4/4c/Revdanda_Fort.JPG"
  ],
  "chanderi-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/0/03/Chanderi_Caves.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/ec/Chanderi_Fort_Pinnacle.jpg"
  ],
  "sondai-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/7/79/Sondai_Fort_Ladder.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Sondai_Fort_view.jpg"
  ],
  "tamhini-ghat-waterfall-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/5/59/Tamhini_Ghat_waterfall.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/1/15/Tamhini_ghat_during_monsoon.jpg"
  ],
  "ratnagiri-village-heritage-walk": [
    "https://upload.wikimedia.org/wikipedia/commons/4/4b/Ratnagiri_Lighthouse.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d3/Ratnagiri_lighthouse.JPG"
  ],
  "kokan-kada-ridge-walk": [
    "https://upload.wikimedia.org/wikipedia/commons/9/92/Konkan_Kada.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f6/Harishchandragad_kokankada.JPG"
  ],
  "dhak-bahiri-cave-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/a/a2/Dhak_Bahiri_route.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/c/cc/Dhak_Bahiri_Caves.jpg"
  ],
  "kanakdurg-fattehgad-coastal-walk": [
    "https://upload.wikimedia.org/wikipedia/commons/4/4c/Kanakdurg_Fort.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/67/Harnai_Forts.jpg"
  ],
  "nivti-beach-golden-rocks-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/e/e0/Nivti_fort.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Nivati_beach_rocky_shore.jpg"
  ],
  "mahipatgad-forest-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/4/46/Mahipatgad_entrance.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/90/Mahipatgad_trail.jpg"
  ],
  "prachitgad-wild-sanctuary-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/a/a9/Prachitgad_bastion.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/df/Chandoli_forest.jpg"
  ],
  "sumargad-citadel-climb": [
    "https://upload.wikimedia.org/wikipedia/commons/9/90/Sumargad_fort.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/87/Sumargad_cliff.jpg"
  ],
  "gopalgad-anjanvel-lighthouse-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/2/22/Anjanvel_Lighthouse.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/af/Anjanvel_Gopalgad.jpg"
  ]
};

async function run() {
  console.log('--- DOWNLOADING DIRECT AUTHENTIC WIKIMEDIA PHOTOS FOR REMAINING TREKS ---');

  for (const [slug, urls] of Object.entries(DIRECT_URLS)) {
    const destDir = path.join('public', 'images', 'treks', slug);
    const localImgPath = path.join(destDir, '1.jpg');
    const localWebPath = `/images/treks/${slug}/1.jpg`;

    if (fs.existsSync(localImgPath) && fs.statSync(localImgPath).size > 20000) {
      console.log(`⏩ [${slug}] Already downloaded (${Math.round(fs.statSync(localImgPath).size / 1024)} KB)`);
      continue;
    }

    fs.mkdirSync(destDir, { recursive: true });
    let downloaded = false;

    for (const url of urls) {
      try {
        console.log(`📥 [${slug}] Trying ${url}...`);
        await sleep(1000);
        const size = await downloadImage(url, localImgPath);
        console.log(`  ✅ Successfully downloaded ${Math.round(size / 1024)} KB -> ${localWebPath}`);
        downloaded = true;
        break;
      } catch (err) {
        console.log(`  ❌ Failed URL ${url}: ${err.message}`);
      }
    }

    if (downloaded) {
      // Update in Firestore
      const snap = await db.collection('treks').where('slug', '==', slug).get();
      if (!snap.empty) {
        await snap.docs[0].ref.update({
          images: [localWebPath]
        });
        console.log(`  ✅ Updated Firestore for ${slug}`);
      }
    } else {
      console.log(`  ⚠️ Could not download any image for ${slug}`);
    }
  }

  console.log('\n--- FINISHED REMAINING PHOTO DOWNLOADS ---');
}

run().catch(console.error).finally(() => process.exit(0));

