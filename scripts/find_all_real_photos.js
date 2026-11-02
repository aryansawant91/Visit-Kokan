const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request(u, { method: 'HEAD', headers: { 'User-Agent': 'VisitKokan/1.0' } }, (res) => {
        resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
      });
      req.on('error', () => resolve({ url, status: 500, ok: false }));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ url, status: 408, ok: false });
      });
      req.end();
    } catch (e) {
      resolve({ url, status: 400, ok: false });
    }
  });
}

// Map of all treks to authentic, real Sahyadri photos from Wikimedia Commons
const REAL_PHOTOS_CANDIDATES = {
  "rajgad-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/4/49/Suvela_machi%2CRajgad_fort%2C_Maharashtra%2CIndia_July2015.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/ec/Rajgad_Fort_view_from_Sanjeevani_Machi.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/9f/Padmavati_Machi%2C_Rajgad_Fort.jpg"
  ],
  "kalsubai-peak-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/b/b6/Kalsubai_summit.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/0a/Peak_of_Kalsubai_in_late_evening.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f1/Kalasubai_from_base.jpg"
  ],
  "lohagad-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/5/55/Panoramic_view_of_the_bastions_of_Lohagad_Fort_2.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/aa/Bastions_of_Lohagad_Fort_3.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/6e/Lohagad_Fort_Narayan_Darwaza_3.jpg"
  ],
  "visapur-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Fortification_wall_at_visapur.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/87/Visapur_Fort_monsoon.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/52/Visapur_Fort_Plateau.jpg"
  ],
  "shivneri-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/a/a1/Shivneri_fort1.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/Shivneri_Fort_Entrance.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e0/Shivneri_Fort_Birthplace.jpg"
  ],
  "pratapgad-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/c/ca/Pratapgad_The_Fort_of_Valour.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/50/Pratapgad_Fort_Bhavani_Temple.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e4/Pratapgad_Fort_overview.jpg"
  ],
  "murud-janjira-sea-fortress": [
    "https://upload.wikimedia.org/wikipedia/commons/f/f4/Fort_Janjira_Unconquered.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/0/0c/Murud_Janjira_Fort.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/3/34/Murud_Janjira_fort.jpg"
  ],
  "devkund-waterfall-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Devkund_waterfalls.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Devkund_Waterfall_Bhira.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/aa/Devkund_Fall.jpg"
  ],
  "sandhan-valley-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/6/6f/Sandhan_Valley_The_Valley_of_Shadows.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/30/Sandhan_Valley_Canyon.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2e/Sandhan_Valley.jpg"
  ],
  "rajmachi-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/4/4d/Rajmachi_Fort_Shrivardhan.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/64/Rajmachi_view.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/1/10/Rajmachi_Fort.jpg"
  ],
  "tung-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/3/31/Tung_Fort.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/5d/Tung_Fort_Pavana_Lake.jpg"
  ],
  "tikona-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/c/cc/Tikona_Panorama.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/36/Tikona_Fort_Trimbakeshwar.jpg"
  ],
  "korigad-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/b/b8/Korigad_from_Lonavla.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/c/c5/Korigad_Fort_Wall.jpg"
  ],
  "kothaligad-peth-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/0/02/Kothaligad_Fort1.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/87/Kothaligad_Peth_Fort_Pinnacle.jpg"
  ],
  "bhimashankar-jyotirlinga-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/d/d7/Bhimashankar.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/eb/Bhimashankar_temple.JPG"
  ],
  "karnala-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/5/5a/Yash.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/91/Karnala_Fort_Pinnacle.jpg"
  ],
  "ratangad-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/9/9b/Ratangad_fort_from_ratanwadi.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/0e/Ratangad_Fort_Nedhe.jpg"
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
  "padmadurg-kasa-sea-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/4/41/Surrounded_by.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b3/Padmadurg_Fort_Murud.jpg"
  ],
  "irshalgad-pinnacle-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/1/14/Irshal_gad_pinnacle.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/6d/Irshalgad_Pinnacle.jpg"
  ],
  "purandar-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/d/d5/Purandar_Fort_-_AB.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/Purandar_Fort_Entrance.jpg"
  ],
  "rohida-vichitragad-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/e/e1/Rohida_Fort.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/1/14/Rohida_Fort_Bastion.jpg"
  ],
  "gorakhgad-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/8/82/Gorakhgad.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/de/Gorakhgad_Fort_Peak.jpg"
  ],
  "kenjalgad-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/6/61/View_towards_Kenjalgad_-433414386.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d1/Kenjalgad_Fort_Plateau.jpg"
  ],
  "sindhudurg-sea-wall-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/3/3a/Sindhudurg_fort.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/d/d4/Sindhudurg_Fort_Aerial.jpg"
  ],
  "kondane-caves-waterfall-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/3/32/Archaic_archtecture_of_Kondana_caves.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/21/Kondane_Caves_Karjat.jpg"
  ],
  "bankot-fort-coastal-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/7/7d/Bankot_Fort.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/30/Bankot_Fort_Entrance.jpg"
  ],
  "jaigad-fort-temple-trail": [
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Jaigad_outerwall1.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/1/18/Jaigad_Fort_Ramparts.jpg"
  ],
  "amboli-sunset-night-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/4/48/Amboli5.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/95/Amboli_Ghat_waterfall.jpg"
  ],
  "manikgad-fort-trek": [
    "https://upload.wikimedia.org/wikipedia/commons/6/65/Manikgad%28Raigad%29.jpg"
  ]
};

async function testAll() {
  console.log('Testing photo URLs...');
  for (const [slug, urls] of Object.entries(REAL_PHOTOS_CANDIDATES)) {
    for (const url of urls) {
      const res = await checkUrl(url);
      if (!res.ok) {
        console.log(`❌ FAIL [${slug}]: ${url} (status: ${res.status})`);
      } else {
        console.log(`✅ OK [${slug}]: ${url.substring(0, 70)}...`);
      }
    }
  }
}

testAll().catch(console.error);

