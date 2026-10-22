# Sources credit when the link lists load on open (0.9 P23 gate)

Source Vetting (Lydia), 2026-10-22. Gate `research-sources-credit` for P23 (#645); P24 (#754) waits on it. The plan asks
whether per-page credit links rendered only when the Sources card opens still meet CLAUDE.md's "plain dofollow links"
and Metabot's terms. Owner, 2026-10-20 5:24 PM ET: the team decides after an outside review. **Outside review: passed** (Ted, fresh governance review, at 0fbcbb7, #802; reached the same conditional pass
independently).

## Verdict

**Conditional pass.** P23 may load the per-page lists on open if all four conditions below hold. Without condition 2,
the answer is **no**: the change would meet the letter of Metabot's terms but drop every per-page credit link from what
search engines see, which is the reason the terms ask for dofollow links at all.

1. **Same markup.** Each per-page link keeps today's form: `<a href="<the specific page>">`, no `rel="nofollow"`,
   `"sponsored"` or `"ugc"` (`noopener` is fine), label unchanged.
2. **A crawlable copy.** The build also emits a plain HTML page (for example `sources.html`) that lists every URL in
   `data/DATA_SOURCES.md` as such a link, with no script needed to see them. It is linked from the Sources card by a plain
   link and listed in `public/sitemap.xml`. It names thegameswiki's licence (CC BY-NC-SA 4.0, linked) beside that site's
   links (Ted's review). The Sources card names no licence today (source at 57bd9d3), so that line is new.
3. **No per-site substitute.** The owner's option "one plain link per source site" may sit beside the lists, never
   replace them. A link to `metabot.gg` does not credit "the specific metabot.gg page the data came from".
4. **Tests.** `tests/site`: after the card opens, every URL has an `<a>` with none of the three forbidden `rel` values;
   the crawlable page contains every URL in `DATA_SOURCES.md`, with the same check; it is reached from the card's plain
   link with script off, and `sitemap.xml` lists it (bot review on #802).

Condition 2 adds one link to the page and a new file on the site, so it is a visible change: P23's "No visible change"
acceptance line would have to change, with before / after shots. That is the plan owner's call.

## What the terms require (read 2026-10-22 00:24Z, `legal/fetch-log/lydia.md`)

- `metabot.gg/en/legal/terms-of-service`, "Data Usage & Attribution (AI Agents & Automated Tools)": any use of the data
  "must credit MetaBot.GG with a dofollow link (a standard HTML link with no rel="nofollow", rel="sponsored", or
  rel="ugc" attribute) to the specific metabot.gg page the data came from". Reuse without it "is not permitted".
- `metabot.gg/ai` repeats this and calls it "a condition of our data license".
- Neither page says where the link must appear, that it must be visible at load, or that it must be crawlable. So a link
  rendered on open meets the letter. That part is fact.
- "Dofollow" only matters to search engines: it tells them to follow the link and pass ranking credit. A link that no
  crawler ever sees passes none. So the terms' purpose is a backlink that search engines can see. That part is
  inferred, not stated by Metabot.

## What a crawler sees today, and after P23 as written

Measured on a build of main (606491a), fresh load at `/`, Sources card closed, headless Chromium:

| | Today | P23 as written |
|---|---|---|
| Source links in `#srcCard` in the DOM | 515 (309 to metabot.gg) | 0 until a click |
| `rel` on them | `noopener` only | same, once opened |
| Static HTML (`dist/index.html`) | 6 `<a>` to metabot.gg, none from the per-page lists (script draws those) | same |

- Google renders script but doesn't click, so today it can see the 515 links and after P23 it would see none. Whether
  Google indexes these links today is unmeasured. To check: Search Console's URL inspection of `/`, rendered HTML, before
  P23 merges.
- Today only the active class's pack is in the DOM. Metabot pages cited only by the other seven classes are not crawlable
  now either: `data/DATA_SOURCES.md` lists 576 metabot.gg URLs, and 309 are on the page. Condition 2 fixes that too, so it
  gives better credit than today.
- `DATA_SOURCES.md` on GitHub should not be counted as credit: GitHub is known to add `rel="nofollow"` to outside links in
  rendered Markdown (inferred, not measured here; check the rendered file's link markup).

## Options considered

| Option | Meets the terms' letter | Search engines see the per-page links | Page budget (P23's goal) |
|---|---|---|---|
| P23 as written | Yes | No | Met |
| P23 + crawlable sources page (recommended) | Yes | Yes, all 8 classes | Met; the page adds one link |
| Keep only the Metabot lists at load | Yes | Yes, active class only | Mostly lost: Metabot is 309 of the 515 links |
| Per-site links only | **No** | — | Met |

## Not covered

- Other sources' credit: no other source's terms ask for dofollow. thegameswiki (CC BY-NC-SA) needs attribution, which
  the lists and the crawlable page both give.
- Whether to ask Metabot for a written OK on load-on-open credit. It's optional: with condition 2, nothing is weaker than
  today.
