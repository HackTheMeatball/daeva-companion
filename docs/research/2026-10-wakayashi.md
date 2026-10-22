# wakayashi.gg vetting, 2026-10-22 (Lydia)

Isaac asked (03:55Z, Source Vetting thread): "lydia, can we use https://wakayashi.gg". Then, relayed at 04:03Z: "actually
this has 8 build guides https://wakayashi.gg/aion2". The row is in `SOURCES.md` under "Passed but not on the allowed list".
Every request is logged in `/mnt/project-files/legal/fetch-log/lydia.md` (03:56–04:04Z). Game Data Check's read of
`/aion2` is at 04:03Z in `/mnt/project-files/legal/fetch-log/gretchen.md`. Nothing was copied or kept.

## Terms and robots.txt (before any content page)

- **Terms:** `/terms`, `/terms-of-service`, `/tos`, `/terms-of-use` and `/terms-and-conditions` all returned 404 (03:56–03:57Z).
  A web search for `wakayashi.gg terms of service OR privacy OR about` found no terms page.
- **robots.txt** (03:57Z): one `*` group that allows `/` and disallows `/admin` and `/api/`. It has no group for Claude-User
  or for our User-Agent, so the site doesn't opt out.
- **Verdict** (logged 03:57:41Z, before the first content request): no terms found, so the site is **Spot** under the
  no-terms rule. Facts with a link only, no quotes and no copies.
- **Legal pages** (03:58Z): the footer links only `/impressum` and `/datenschutz`. The Impressum names
  RAHFT Management GmbH. An Impressum is a legal notice, not terms (Chuck, #823).

## What the site has (coverage, ROL-10)

The page source of `/aion2` was read as fetched, meaning its HTML and the Next.js data embedded in it. It was never
rendered in a browser, and no `/api/` path was requested.

- **Class build guides:** found in the `#class-guides` tab on `/aion2`, with all 8 classes, dated 2026-10-09 (endgame).
  The guides are not separate articles: their text is only in the embedded script data, not in the visible HTML.
- **My first read (03:58Z) was wrong.** I reported "no class guides". The coverage of that read was the `href="/aion2/…"`
  article links only. It didn't include the tabs, the embedded data, a page-text search or the sitemap. Isaac caught the
  miss, and the 04:03–04:04Z re-reads found the tab. That miss is the cause of ROL-10.
- **Articles:** crafting, enhancement, Kinah, Pantheon CP, soul binding stats per class, and patch notes.
- **Not checked:** the sitemap, site search, and a page-text search in German. None was needed once the tab was found.
  ROL-10 binds only a "none" finding: a later "none" from this site needs all three first.

## Use

- **Build guides:** leads only. They are never cited for a build pick, and wakayashi isn't a build witness ("Build
  sources" in `SOURCES.md`). Whether it should become one is with the owner.
- **Other articles:** a second source for a single fact (for example a crafting or enhancement fact), with a link,
  never the only source.
- **No systematic extraction:** cite only the facts a given task needs, never the guide set. The operator is a German
  company, and the EU database right likely applies (inferred, not jurisdiction-checked; Chuck, #823).
- **Network list:** the site isn't on it, and adding it needs the owner's OK.
