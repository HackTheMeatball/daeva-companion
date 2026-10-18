/* Screenshots for the 0.6 S1 onboarding mockup: node docs/design/mockups/shoot-0.6-onboarding.mjs
   Uses the repo's Playwright and the preinstalled Chromium (PLAYWRIGHT_BROWSERS_PATH). One PNG per frame. */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, '0.6-onboarding'), { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1700, height: 1000 } });
await p.goto(pathToFileURL(join(here, '0.6-onboarding.html')).href);
for (const f of await p.$$('.fr')) {
  const id = (await (await f.$('.cap')).innerText()).split(' ')[0].toLowerCase();
  const frame = await f.$('.ph, .dk');
  const wide = await f.$('.dk');
  await frame.screenshot({ path: join(here, '0.6-onboarding', id + (wide ? '-1500' : '-390') + '.png') });
}
await b.close();
