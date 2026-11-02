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

async function findWikiImage(query) {
  try {
    const enc = encodeURIComponent(query);
    // 1. OpenSearch to find canonical title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${enc}&limit=3&format=json`;
    const searchRes = await fetchJson(searchUrl);
    const titles = searchRes[1] || [];
    if (!titles.length) return null;

    for (const title of titles) {
      const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages|images&pithumbsize=1200&format=json`;
      const pageRes = await fetchJson(pageUrl);
      const pages = Object.values(pageRes.query.pages);
      if (pages[0] && pages[0].thumbnail) {
        return {
          title,
          image: pages[0].thumbnail.source.replace(/\?.*$/, '')
        };
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function run() {
  const queries = [
    'Rajgad',
    'Murud Janjira',
    'Shivneri',
    'Sarasgad',
    'Rohida fort',
    'Kondana caves',
    'Bankot fort',
    'Dhak Bahiri',
    'Peb fort',
    'Suvarnadurg',
    'Manikgad'
  ];

  for (const q of queries) {
    const res = await findWikiImage(q);
    console.log(`${q} ->`, res ? `${res.title}: ${res.image}` : 'NOT FOUND');
  }
}

run().catch(console.error);

