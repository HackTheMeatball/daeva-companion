# Privacy

This covers Daeva Companion, the unofficial AION 2 companion at daevacompanion.com.

**Short version:** no accounts, no analytics, no tracking, no cookies. Your progress stays in your browser.

## What is stored, and where

- **Your progress** (per character: level, ticked quests and steps, stigma picks, the class, a random character id,
  and a character name once you can enter one; plus your settings and the dates of your last backups) is saved in your
  browser's `localStorage` under the key `companion-save-v6` on `daevacompanion.com`. It never leaves your device.
  When you import a file, the progress it replaces is kept under `companion-save-v6:before-import`. The key, the
  export file's name and the *Report a problem* link never contain your character's name. Earlier versions used
  the key `aion2-assassin-route-v4` (before 0.4) and older `companion-save` keys (0.4 to 0.8); this version doesn't
  read them and leaves them as they are (clear the site's data to remove them).
- **Keeping your progress:** when you come back with saved progress, the site asks your browser to keep its storage
  (`navigator.storage.persist()`), so it isn't cleared automatically (Safari can clear site data after 7 days without a
  visit). Your browser decides; Firefox may ask you. It asks at most once per browser session (a flag in
  `sessionStorage`, deleted when you close the tab). If saving ever fails in your browser, the page says so and offers
  Export.
- **Offline copy:** a service worker keeps a copy of the app, its icons and fonts in your browser's cache so it works offline.
  It contains no personal data.
- **Export progress** downloads a `.json` file (`companion-save-<date>.json`) to your device; **Import progress** reads a file you pick. Neither is
  uploaded anywhere.

Clearing this site's data in your browser deletes your progress — export a backup first.

## Requests to other sites

- **Fonts** are served from this site; no request goes to Google or any other font service.
- **Hosting:** the site is served by GitHub Pages, which may log IP addresses for security and operations. See the
  [GitHub Privacy Statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement).
- **Sync:** no request goes to a sync service. Optional sync between your devices (off by default, end-to-end encrypted
  with a code only your devices hold) is being built; this page describes what it sends and to whom before it can be
  turned on. Once it runs, a cloud copy that is neither read nor written for
  180 days is deleted from the sync server; nobody, including us, can find or open it before then without your code.
- **Links** in the guide (Metabot, maps, sources) are only requested when you click them.
- **Report a problem** (footer) opens a new GitHub issue form with these fields filled in from the link: the app version,
  your level and current story quest in the guide, Basic/Advanced mode, the build and your
  browser's user agent. Nothing else from your progress is included, and nothing is sent until you submit the issue on
  GitHub, where you can edit or delete any of it first. Issues are public.

## Beta testers

This applies only if you've agreed to test the app before release and send us feedback outside GitHub, for example by
messaging the owner. Nothing here changes anything for anyone else.

- **What we keep:** a tester number (T1, T2 …), how to reach you (the handle or address you messaged from), the text
  of your report and any screenshots you send. Other players' names and chat are cropped or blurred out of
  screenshots before they're kept. Screenshots are only looked at to understand your report; nothing reads game data
  out of them.
- **Who reads it:** the owner, and the AI assistants that run this project (Claude, made by Anthropic), which read,
  sort and file the reports. Anthropic's [privacy policy](https://www.anthropic.com/legal/privacy) covers how it
  handles that data.
- **Where:** in a private repository that only the owner and those assistants can open. It's never published.
  When a report leads to a public issue, the issue names you only by your tester number and leaves out your handle.
- **How long:** your report text and screenshots are deleted 30 days after your report is closed (fixed, declined or
  a duplicate), or when the beta ends, whichever comes first. Your contact handle and the link between it and your
  tester number are kept while you're testing, so we can tell you what happened to later reports, and are deleted
  when the beta ends or when you ask; after that your tester number can't be linked to you. An anonymous one-line
  summary (tester number, date, type, outcome) is kept.
- **Deleting it sooner:** send a message the same way you sent your feedback, asking for your beta data to be deleted,
  and everything we hold for you except that anonymous summary is deleted. You don't need to give a reason.

Reports you file yourself through *Report a problem* are public GitHub issues and follow GitHub's rules, not this
section.

## Changes

This page is updated before anything about what the site collects changes. If the site ever adds anything that collects
data, this page and, where the law requires it, a consent prompt come first.

## Contact

Questions or concerns: open an issue at <https://github.com/hackthemeatball/daeva-companion/issues>. Issues are public,
so leave out personal details.
