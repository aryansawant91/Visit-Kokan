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

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'VisitKokanBot/1.0 (info@visitkokan.in)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const req = https.get(url, { headers: { 'User-Agent': 'VisitKokanBot/1.0 (info@visitkokan.in)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
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
              fs.unlinkSync(destPath);
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

async function searchWikimediaForFort(searchTerm) {
  try {
    const enc = encodeURIComponent(searchTerm);
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${enc}&gsrlimit=8&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json`;
    const res = await fetchJson(searchUrl);
    if (!res.query || !res.query.pages) return null;
    const pages = Object.values(res.query.pages);
    for (const p of pages) {
      if (p.imageinfo && p.imageinfo[0] && p.imageinfo[0].mime.startsWith('image/')) {
        const u = p.imageinfo[0].url;
        if (!u.endsWith('.svg') && !u.endsWith('.ogg') && !u.endsWith('.tif') && !u.endsWith('.pdf')) {
          return u.replace(/\?.*$/, '');
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// Curated verified authentic primary search terms and candidate URLs
const TREK_SEARCH_TERMS = {
  "kalsubai-peak-trek": "Kalsubai summit peak",
  "lohagad-fort-trek": "Lohagad Fort bastions Maharashtra",
  "visapur-fort-trek": "Visapur Fort wall Maharashtra",
  "shivneri-fort-trek": "Shivneri Fort birthplace Shivaji",
  "pratapgad-fort-trek": "Pratapgad Fort Valour Mahabaleshwar",
  "murud-janjira-sea-fortress": "Murud Janjira Sea Fort",
  "devkund-waterfall-trek": "Devkund waterfalls Bhira",
  "sandhan-valley-trek": "Sandhan Valley canyon Samrad",
  "rajmachi-fort-trek": "Rajmachi Fort Shrivardhan",
  "tung-fort-trek": "Tung Fort Kathingad Pavana",
  "tikona-fort-trek": "Tikona Fort Vitandgad",
  "korigad-fort-trek": "Korigad Fort wall Lonavla",
  "kothaligad-peth-fort-trek": "Kothaligad Peth Fort Karjat",
  "bhimashankar-jyotirlinga-trek": "Bhimashankar temple Jyotirlinga",
  "karnala-fort-trek": "Karnala Fort pinnacle bird sanctuary",
  "ratangad-fort-trek": "Ratangad Fort Nedhe Ratanwadi",
  "vijaydurg-coastal-cliff-walk": "Vijaydurg Fort bastions sea face",
  "suvarnadurg-island-sea-fort": "Suvarnadurg Fort Harnai entrance",
  "korlai-fort-coastal-trail": "Korlai Fort church lighthouse",
  "padmadurg-kasa-sea-fort-trek": "Padmadurg Fort Murud Kasa",
  "irshalgad-pinnacle-trek": "Irshalgad pinnacle Panvel",
  "purandar-fort-trek": "Purandar Fort entrance Saswad",
  "rohida-vichitragad-trek": "Rohida Fort Vichitragad Bhor",
  "gorakhgad-fort-trek": "Gorakhgad pinnacle Murbad",
  "kenjalgad-fort-trek": "Kenjalgad Fort Ghera Khelanja",
  "sindhudurg-sea-wall-trek": "Sindhudurg Fort Malvan aerial",
  "kondane-caves-waterfall-trek": "Kondana Caves Karjat architecture",
  "bankot-fort-coastal-trek": "Bankot Fort entrance Himmatgad",
  "jaigad-fort-temple-trail": "Jaigad Fort outer wall Ratnagiri",
  "amboli-sunset-night-trek": "Amboli Ghat waterfall Sindhudurg",
  "manikgad-fort-trek": "Manikgad Raigad fort",
  "sarasgad-fort-trek": "Sarasgad Fort Pali",
  "sondai-fort-trek": "Sondai Fort ladder Karjat",
  "alang-madan-kulang-amk-trek": "Alang Fort Kulang Sahyadri",
  "mahipatgad-forest-fort-trek": "Mahipatgad Khed Ratnagiri",
  "rasalgad-hill-fort-trek": "Rasalgad Fort Khed",
  "sumargad-citadel-climb": "Sumargad Fort Khed",
  "prachitgad-wild-sanctuary-trek": "Prachitgad Fort Chandoli",
  "peb-vikatgad-fort-trek": "Peb Fort Vikatgad Matheran",
  "chanderi-fort-trek": "Chanderi Fort Badlapur pinnacle",
  "dhak-bahiri-cave-trek": "Dhak Bahiri cave Kamshet",
  "gopalgad-anjanvel-lighthouse-trek": "Gopalgad Fort Anjanvel lighthouse Guhagar",
  "purnagad-fort-coastal-trail": "Purnagad Fort Ratnagiri",
  "kanakdurg-fattehgad-coastal-walk": "Kanakdurg Fort Harnai",
  "nivti-beach-golden-rocks-trek": "Nivti Fort beach Vengurla",
  "kunkeshwar-cliffside-trail": "Kunkeshwar Temple beach Devgad",
  "harihareshwar-pradakshina-hill": "Harihareshwar beach rock pradakshina",
  "velas-coastal-hill-trail": "Velas beach turtle conservation",
  "devgad-windmill-cliff-trek": "Devgad Fort harbour lighthouse",
  "tamhini-ghat-waterfall-trek": "Tamhini Ghat waterfall monsoon",
  "revdanda-beach-ramparts-walk": "Revdanda Fort Agarkot Alibaug",
  "ratnagiri-village-heritage-walk": "Ratnagiri Fort Bhagwati temple",
  "kokan-kada-ridge-walk": "Konkan Kada Harishchandragad cliff"
};

async function run() {
  console.log('--- STARTING AUTHENTIC PHOTO DOWNLOAD & DATABASE UPDATE ---');
  
  // 1. Remove duplicate trek 'sindhudurg-coastal-trek'
  const dupDoc = await db.collection('treks').where('slug', '==', 'sindhudurg-coastal-trek').get();
  if (!dupDoc.empty) {
    for (const d of dupDoc.docs) {
      console.log(`Removing duplicate trek: ${d.data().name} (slug: ${d.data().slug}, ID: ${d.id})`);
      await db.collection('treks').doc(d.id).delete();
    }
  }

  // 2. Process all remaining treks
  const snap = await db.collection('treks').get();
  console.log(`Found ${snap.size} treks in database.`);

  for (const doc of snap.docs) {
    const data = doc.data();
    const slug = data.slug;
    const destDir = path.join('public', 'images', 'treks', slug);
    const localImgPath = path.join(destDir, '1.jpg');
    const localWebPath = `/images/treks/${slug}/1.jpg`;

    // Skip if already has existing local file > 50KB
    if (fs.existsSync(localImgPath)) {
      const stats = fs.statSync(localImgPath);
      if (stats.size > 50000) {
        console.log(`⏩ [${slug}] Already has local authentic photo (${Math.round(stats.size / 1024)} KB)`);
        if (!data.images || data.images[0] !== localWebPath) {
          await doc.ref.update({
            images: [localWebPath, ...(data.images || []).filter(img => img !== localWebPath)]
          });
        }
        continue;
      }
    }

    const term = TREK_SEARCH_TERMS[slug] || data.name;
    console.log(`\n🔍 [${slug}] Searching authentic Wikimedia photo for: "${term}"...`);
    
    let imgUrl = await searchWikimediaForFort(term);
    if (!imgUrl) {
      imgUrl = await searchWikimediaForFort(data.name.split('(')[0].trim());
    }

    if (imgUrl) {
      console.log(`  Found: ${imgUrl}`);
      fs.mkdirSync(destDir, { recursive: true });
      try {
        await sleep(1000); // Respect Wikimedia 1s rate limit
        const size = await downloadImage(imgUrl, localImgPath);
        console.log(`  ✅ Downloaded ${Math.round(size / 1024)} KB -> ${localWebPath}`);
        
        // Update Firestore
        await doc.ref.update({
          images: [localWebPath]
        });
        console.log(`  ✅ Updated Firestore trek doc for ${slug}`);
      } catch (err) {
        console.log(`  ❌ Download error for [${slug}]: ${err.message}`);
      }
    } else {
      console.log(`  ⚠️ No photo found for [${slug}]`);
    }

    await sleep(800);
  }

  console.log('\n--- ALL TREKS PROCESSED ---');
}

run().catch(console.error).finally(() => process.exit(0));

