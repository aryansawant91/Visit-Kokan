const fs = require('fs');
const path = require('path');
const https = require('https');

const TREK_IMAGE_FILES = {
  "torna-fort-trek": [
    "File:Torna Fort aka Kille Prachangad.jpg",
    "File:Budhla Machi.jpg",
    "File:Kille torna zunjar machi.jpg",
    "File:Zunjar machi, Torna Fort.jpg"
  ],
  "raigad-fort-heritage-climb": [
    "File:Nagarkhana, Raigad Fort, India.jpg",
    "File:MahaDarwaja Raigad Fort.JPG",
    "File:Raigad Fort-Raigad -Maharashtra-001.jpg"
  ],
  "harishchandragad-trek": [
    "File:Harishchandragad Konkan Kada.jpg",
    "File:Kokankada.jpg",
    "File:Kedareshwar.jpg"
  ],
  "kalavantin-durg-trek": [
    "File:Kalavantinicha Durga.jpg",
    "File:KALAVANTIN DURG (FORT).jpg",
    "File:Kalavantin Durg (6780448549).jpg"
  ],
  "sudhagad-fort-trek": [
    "File:Sudhagad Fort.jpg",
    "File:Chor vaat sudhagad.jpg",
    "File:Sudhagad gates.jpg"
  ]
};

async function getFileUrl(fileTitle) {
  return new Promise((resolve, reject) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
    https.get(url, { headers: { 'User-Agent': 'VisitKokanApp/1.0 (contact@visitkokan.travel)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query?.pages || {};
          const page = Object.values(pages)[0];
          const directUrl = page?.imageinfo?.[0]?.url;
          resolve(directUrl);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'VisitKokanApp/1.0 (contact@visitkokan.travel)' } }, res => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const stream = fs.createWriteStream(destPath);
      res.pipe(stream);
      stream.on('finish', () => resolve(destPath));
    }).on('error', reject);
  });
}

async function main() {
  const baseDir = path.join(__dirname, '..', 'public', 'images', 'treks');
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  for (const [slug, files] of Object.entries(TREK_IMAGE_FILES)) {
    const slugDir = path.join(baseDir, slug);
    if (!fs.existsSync(slugDir)) {
      fs.mkdirSync(slugDir, { recursive: true });
    }

    console.log(`\nFetching images for ${slug}...`);
    let idx = 1;
    for (const fileTitle of files) {
      try {
        const directUrl = await getFileUrl(fileTitle);
        if (!directUrl) {
          console.warn(`  ⚠️ Could not find direct URL for ${fileTitle}`);
          continue;
        }
        const ext = path.extname(directUrl).split('?')[0] || '.jpg';
        const destFile = path.join(slugDir, `${idx}${ext}`);
        console.log(`  Downloading ${fileTitle} -> /images/treks/${slug}/${idx}${ext}`);
        await downloadFile(directUrl, destFile);
        console.log(`  ✅ Saved (${(fs.statSync(destFile).size / 1024).toFixed(1)} KB)`);
        idx++;
        // Small delay to be respectful to Wikimedia
        await new Promise(r => setTimeout(r, 600));
      } catch (err) {
        console.error(`  ❌ Error downloading ${fileTitle}:`, err.message);
      }
    }
  }

  console.log('\n🎉 Finished downloading all trek photos!');
}

main();

