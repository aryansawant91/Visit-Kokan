const https = require('https');

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

async function searchCommons(q) {
  const enc = encodeURIComponent(q);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${enc}&gsrlimit=5&gsrnamespace=6&prop=imageinfo&iiprop=url|mime&format=json`;
  const res = await fetchJson(url);
  if (!res.query || !res.query.pages) return [];
  return Object.values(res.query.pages).map(p => p.imageinfo?.[0]?.url).filter(Boolean);
}

async function test() {
  const missing = [
    'Sandhan',
    'Tamhini',
    'Harihareshwar',
    'Velas',
    'Ratnagiri fort',
    'Chanderi fort',
    'Sondai',
    'Dhak Bahiri',
    'Kanakdurg',
    'Nivti',
    'Mahipatgad',
    'Prachitgad',
    'Sumargad',
    'Anjanvel'
  ];

  for (const m of missing) {
    const urls = await searchCommons(m);
    console.log(`${m}:`, urls.slice(0, 2));
  }
}

test().catch(console.error);

