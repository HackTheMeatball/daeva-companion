# robots.txt policy for daevacompanion.com (draft, Lydia, 2026-10-20; changed 2026-10-21 for Isaac's 03:23Z / 03:25Z call)

Goal: consistent with the Terms (no AI training, no scraping) while staying findable. robots.txt is advisory; the
Terms are what back it. This **replaces** the existing `public/robots.txt` (today: `User-agent: *` / `Allow: /` plus the sitemap line). `scripts/build.mjs` line 306 copies `public/` into `dist/` as is (`cpSync(P('public'), DIST, { recursive: true })`), so no build change is needed; `public/sitemap.xml` is untouched.

**Policy (Isaac, 2026-10-21 03:23Z and 03:25Z, Chuck's thread):** "I want to show up in AI searches in robots txt but
disallow pulling any data from the site at all in t and cs". Search engines and AI **search** crawlers stay allowed.
Every training crawler and every **user-triggered** assistant fetcher (Claude-User, ChatGPT-User, Perplexity-User) is
blocked. This replaces the earlier default, which allowed user-triggered fetchers.

```
# Daeva Companion terms: https://github.com/hackthemeatball/daeva-companion/blob/main/TERMS.md
# No scraping, no AI training, no assistant fetches. Search and AI search indexing are allowed.

# AI training, dataset and bulk-data crawlers: blocked
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: anthropic-ai
User-agent: CCBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: meta-externalagent
User-agent: FacebookBot
User-agent: Bytespider
User-agent: Amazonbot
User-agent: cohere-ai
User-agent: cohere-training-data-crawler
User-agent: Diffbot
User-agent: omgili
User-agent: Timpibot
User-agent: ImagesiftBot
# User-triggered assistant fetchers: blocked (Isaac, 2026-10-21)
User-agent: Claude-User
User-agent: ChatGPT-User
User-agent: Perplexity-User
User-agent: Meta-ExternalFetcher
Disallow: /

# Link-preview bots (Isaac, 2026-10-21 03:30Z): allowed, by name
User-agent: Twitterbot
User-agent: facebookexternalhit
User-agent: Slackbot-LinkExpanding
User-agent: Discordbot
Allow: /

# Everyone else (search engines; AI search crawlers such as OAI-SearchBot, Claude-SearchBot, PerplexityBot): allowed
User-agent: *
Allow: /

Sitemap: https://daevacompanion.com/sitemap.xml
```

Notes
- Google-Extended and Applebot-Extended are training opt-outs only; normal Googlebot / Applebot search indexing is unaffected.
- Amazonbot: Amazon says it "may be used to train Amazon AI models" (https://developer.amazon.com/amazonbot, retrieved 2026-10-20). Amazon's search agent, Amzn-SearchBot, is a separate token and stays allowed under `*`.
- Diffbot: Diffbot's docs describe search and knowledge-graph use, not AI training. It is blocked as a bulk-data / knowledge-graph crawler (inferred), because blocking is the safe direction.
- FacebookBot, Bytespider, cohere-ai, cohere-training-data-crawler, omgili, Timpibot: no operator page found; sourced from third-party crawler directories only. They stay blocked, because blocking is the safe direction.
- Per-token sources: `legal/robots-ua-sources.md`.
- AI *search* crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) stay allowed under `*`, as Isaac decided: they
  index pages for AI answer engines and cite them with links. Agent names change; Source Vetting re-checks the list each minor.
- User-triggered fetchers (honours-robots re-check, `legal/robots-ua-sources.md` 2026-10-21): Claude-User honours robots.txt (Anthropic, live);
  ChatGPT-User "may not" (OpenAI, search-sourced) and Perplexity-User "generally ignores" it (third-party only). For those
  two the block is a signal only, and the Terms are the only binding line.
- Link-preview bots: **allowed** (Isaac, card in Chuck's thread, 03:30Z). Named in their own group so the intent is visible
  and a later blocklist change can't catch them. Sources (search results only, not fetched; 2026-10-21):
  Twitterbot (X developer troubleshooting guide, developer.x.com; archived Twitter docs say it honours robots.txt);
  facebookexternalhit (Meta, developers.facebook.com/documentation/sharing/webmasters/web-crawlers: builds share
  previews; "might bypass robots.txt" for security checks); Slackbot-LinkExpanding (Slack, api.slack.com/robots: fetches
  links users post); Discordbot (third-party only: darkvisitors.com, botcrawl.com; no Discord page found; label
  "third-party only"). LinkedInBot and TelegramBot aren't named: no operator source found. They still get in under `*`.
  iMessage builds previews on the sender's device (inferred), so it needs no token.
- Meta-ExternalFetcher: added to the blocked group under Isaac's policy. Meta's crawler page (search result) describes
  it as Meta's user-requested fetcher, the same kind as Claude-User, and says it "may also bypass" robots.txt. So the
  block is a signal only (operator, search-sourced).
- **Not done, flagged:** this is still a blocklist, so an unknown bot is allowed by `*`. An allowlist (`User-agent: *` /
  `Disallow: /` plus named search engines) would be stricter. But a search engine we don't name would drop out, and our
  sources confirm only Google's, Apple's and the three AI search tokens, not Bingbot or DuckDuckBot. Moving to an
  allowlist needs those two operator pages vetted first.
- Our own research UA (DaevaCompanion-Research) is unaffected ("not including us", Isaac): it falls under `*`.
- Test (for the pipeline item): `tests/site` asserts that robots.txt contains `User-agent: GPTBot` + `Disallow: /` and
  still allows `*`, that the sitemap line stays, and (R2, flipped 2026-10-21) that `Claude-User` and `ChatGPT-User` **are** in the blocked group and that
  `OAI-SearchBot`, `Claude-SearchBot` and the four preview bots (`Twitterbot`, `facebookexternalhit`,
  `Slackbot-LinkExpanding`, `Discordbot`) are **not**, so the search-and-previews policy can't break silently.
