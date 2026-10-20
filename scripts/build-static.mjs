// Builds the static GitHub Pages bundle into docs/.
//
// Only pages that need no server can go here. /demo qualifies because it is
// deliberately self-contained (fixed copy, no fetch, no API key), which also
// makes it the right thing to test a blocked corporate network with.
//
//   node scripts/build-static.mjs
//
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { GET as demoGET } from '../app/demo/route.js';
import { GET as appGET } from '../app/route.js';

// Output dir is a parameter so the same build can target docs/ in the source
// repo or the repository root where Pages serves from.
const OUT = new URL((process.argv[2] || '../docs') + '/', import.meta.url);
const LIVE = 'https://gridwatch-nine.vercel.app';

// The Pages copy has to be world-readable for the office network to reach it
// without a GitHub login, so keep it out of search results. This is obscurity,
// not access control - anyone with the link can still open it.
const NOINDEX = '<meta name="robots" content="noindex, nofollow">';
const noindex = (html) => html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + NOINDEX);

mkdirSync(OUT, { recursive: true });

// GitHub Pages runs Jekyll over the directory unless this file exists, which
// would strip anything starting with an underscore.
writeFileSync(new URL('.nojekyll', OUT), '');

const demo = await (await demoGET()).text();
writeFileSync(
  new URL('demo.html', OUT),
  noindex(demo)
    // On Pages there is no "/" app to go back to - point at the live service.
    .replace(/href="\/"/g, `href="${LIVE}/"`)
    .replace(/href="\/demo"/g, 'href="demo.html"')
);

// The feed itself. STATIC_MODE switches the client over to articles.json and
// to the locally-computed chatbot; the markup is otherwise identical to the
// served app, so the two cannot drift apart.
const app = await (await appGET()).text();
const staticApp = app
  .replace('const STATIC_MODE = false;', 'const STATIC_MODE = true;')
  .replace(/href="\/demo"/g, 'href="demo.html"')
  .replace(/href="\/dev"/g, 'href="demo.html"');
if (!staticApp.includes('const STATIC_MODE = true;')) {
  throw new Error('STATIC_MODE 플래그를 찾지 못했습니다 - app/route.js가 바뀐 것 같습니다.');
}
// The feed is what the team should land on, so it is the index.
writeFileSync(new URL('index.html', OUT), noindex(staticApp));

// Connectivity diagnostic, kept for checking a blocked network.
writeFileSync(
  new URL('check.html', OUT),
  noindex(readFileSync(new URL('../scripts/index.src.html', import.meta.url), 'utf8').replace(/__LIVE__/g, LIVE))
);

writeFileSync(new URL('robots.txt', OUT), 'User-agent: *\nDisallow: /\n');

console.log('docs/ 생성 완료: index.html(피드), demo.html, check.html, robots.txt, .nojekyll');
