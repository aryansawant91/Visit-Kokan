const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'VisitKokanBot/1.0 (https://visitkokan.in)' } }, (res) => {
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

async function searchWikimedia(term) {
  const enc = encodeURIComponent(term);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${enc}&gsrlimit=5&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json`;
  const res = await fetchJson(url);
  if (!res.query || !res.query.pages) return [];
  const pages = Object.values(res.query.pages);
  return pages
    .filter(p => p.imageinfo && p.imageinfo[0] && p.imageinfo[0].mime.startsWith('image/'))
    .map(p => ({
      title: p.title,
      url: p.imageinfo[0].url,
      width: p.imageinfo[0].width,
      height: p.imageinfo[0].height
    }));
}

async function run() {
  const terms = ['Rajgad fort', 'Kalsubai peak', 'Lohagad fort', 'Murud Janjira'];
  for (const t of terms) {
    const results = await searchWikimedia(t);
    console.log(`\nResults for "${t}":`);
    results.slice(0, 3).forEach(r => console.log('  -', r.title, r.url));
  }
}

run().catch(console.error);

