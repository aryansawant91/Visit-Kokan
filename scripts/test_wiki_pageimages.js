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

async function testWiki(title) {
  const enc = encodeURIComponent(title);
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${enc}&prop=pageimages&pithumbsize=1200&format=json`;
  const res = await fetchJson(url);
  const pages = Object.values(res.query.pages);
  if (pages[0] && pages[0].thumbnail) {
    return pages[0].thumbnail.source;
  }
  return null;
}

async function run() {
  const forts = [
    'Rajgad Fort',
    'Kalsubai',
    'Murud-Janjira',
    'Lohagad',
    'Visapur Fort',
    'Shivneri',
    'Pratapgad',
    'Sindhudurg Fort',
    'Devkund Waterfall',
    'Sandhan Valley',
    'Kothaligad',
    'Tung Fort',
    'Tikona',
    'Korigad',
    'Sarasgad',
    'Bhimashankar Temple',
    'Karnala Fort',
    'Ratangad',
    'Vijaydurg Fort',
    'Suvarnadurg',
    'Korlai Fort',
    'Padmadurg',
    'Irshalgad',
    'Purandar Fort',
    'Rohida Fort',
    'Sondai Fort',
    'Gorakhgad',
    'Kenjalgad',
    'Dhak Bahiri',
    'Bankot Fort',
    'Jaigad Fort',
    'Amboli, Sindhudurg',
    'Kondane Caves'
  ];

  for (const f of forts) {
    const img = await testWiki(f);
    console.log(`${f} -> ${img || 'NOT FOUND'}`);
  }
}

run().catch(console.error);

