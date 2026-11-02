const fs = require('fs');
const c = fs.readFileSync('scripts/seedDestinations.ts', 'utf8') + '\n' + fs.readFileSync('scripts/seedMoreDestinations.ts', 'utf8');

const regex = /name:\s*["']([^"']+)["'][\s\S]*?images:\s*\[([\s\S]*?)\]/g;
let m;
while ((m = regex.exec(c)) !== null) {
  const name = m[1];
  const imgs = m[2];
  if (/harihareshwar|velas|revdanda|ratnagiri|anjanvel|suvarnadurg|kanakdurg|nivti/i.test(name)) {
    console.log(name, '->', imgs.trim().split('\n')[0]);
  }
}

