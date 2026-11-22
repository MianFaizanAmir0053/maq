/*
  Tells Bing, Yahoo, DuckDuckGo (through Bing), Yandex, Seznam, Naver and other IndexNow search
  engines about every page in the live sitemap, so they recrawl it straight away.
  Google does not use IndexNow; it reads the sitemap submitted in Search Console.

  Run after a deploy that changes pages:  npm run indexnow

  The key below must match the file public/<key>.txt, which proves we own the site.
*/
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maqburgers.com.au';
const KEY = '1ac4e8dcd2c01f729ee4969aa0b12a39';

const xml = await (await fetch(SITE + '/sitemap.xml')).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
if (!urls.length) throw new Error('No URLs found in ' + SITE + '/sitemap.xml');

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  }),
});

// 200 = accepted, 202 = accepted while the key is being checked
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URLs`);
if (res.status >= 300) {
  console.log(await res.text());
  process.exit(1);
}
