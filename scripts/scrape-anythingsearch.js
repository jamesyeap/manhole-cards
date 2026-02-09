const https = require('https');
const fs = require('fs');
const path = require('path');

const CARDS_PATH = path.join(__dirname, '..', 'src', 'data', 'manholeCards.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'anythingsearchCards.json');
const DELAY_MS = 1000;
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ManholeCardCollector/1.0';

function fetch(url, originalUrl) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const target = new URL(res.headers.location, url).href;
        const orig = originalUrl || url;
        if (target.replace(/\/$/, '') !== orig.replace(/\/$/, '')) {
          resolve({ statusCode: 404, body: '' });
          return;
        }
        fetch(target, orig).then(resolve, reject);
        return;
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function extractTitle(html) {
  const match = html.match(/<title>([^<]+)<\/title>/);
  if (!match) return null;
  const full = match[1].trim();
  const pipeIdx = full.indexOf(' | ');
  return pipeIdx !== -1 ? full.substring(0, pipeIdx) : full;
}

function extractCardImage(html) {
  const bodyMatch = html.match(/wp-block-image[^>]*>.*?data-src="(https:\/\/anythingsearch\.info\/card\/wp-content\/uploads\/[^"]+)"/s);
  if (bodyMatch) return bodyMatch[1];

  const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
  if (ogMatch) return ogMatch[1];

  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const cards = JSON.parse(fs.readFileSync(CARDS_PATH, 'utf-8'));
  const results = {};
  const today = new Date().toISOString().slice(0, 10);

  console.log(`Scraping ${cards.length} cards from anythingsearch.info...\n`);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const slug = card.id.toLowerCase();
    const sourceUrl = `https://anythingsearch.info/mhcard-${slug}/`;

    process.stdout.write(`[${i + 1}/${cards.length}] ${card.id} ... `);

    try {
      const { statusCode, body } = await fetch(sourceUrl);

      if (statusCode !== 200) {
        console.log(`HTTP ${statusCode}`);
        results[card.id] = { sourceUrl, title: null, imageUrl: null, lastFetched: today };
      } else {
        const title = extractTitle(body);
        const imageUrl = extractCardImage(body);
        console.log(`OK - ${title || '(no title)'}`);
        results[card.id] = { sourceUrl, title, imageUrl, lastFetched: today };
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      results[card.id] = { sourceUrl, title: null, imageUrl: null, lastFetched: today };
    }

    if (i < cards.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2) + '\n');
  const successful = Object.values(results).filter((r) => r.title !== null).length;
  console.log(`\nDone. ${successful}/${cards.length} cards fetched successfully.`);
  console.log(`Results saved to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
