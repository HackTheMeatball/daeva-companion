# Design review checklist

Run this on any visible change before it goes to the owner: Design Lead (Jane) on mockups and on every visible PR's
shots, and the one-off Design Critic thread on a minor's mockups before Isaac sees them. Source: CLAUDE.md "What the
user wants", `docs/team/design.md` and `tests/a11y.js`. Answer each line yes, no or n/a. Any "no" needs a fix or a
written reason. The tracker and the Ledger use the same lines, except where a line names the app.

## Mockups (before a build)
- [ ] **Real data.** Rows, names, numbers and icons come from the repo or the game sources, not placeholders. Any
  invented or seed data is labelled as such in the mockup's notes.
- [ ] **Shown in context.** The proposal sits in the real page (injected into a build, or the real shell), at 1500 and
  390 px, not as a lone component.
- [ ] **Every state.** Empty, one item, many items, long names, and each status the data can take.
- [ ] **Options and a pick.** When there is a real choice, two options side by side, with one recommended and why.
- [ ] **The cost is written down.** What it adds in height, taps or build work, and what it replaces.

## Setup
- [ ] Build first: `npm run build`, then `npm run serve`. The source page does not run on its own.
- [ ] Review the built result, not the diff. Use a fresh save, a Lv 27 save and a Lv 45 save.
- [ ] Look at it in **Basic** and **Advanced**, at **1500 px** (what the suites use) and **390 px**.

## Look and feel
- [ ] **Minimal distraction.** Nothing new draws the eye that does not need to. No extra colours, borders, badges or motion.
- [ ] **No redundancy across cards.** The same fact is not shown in two cards. If it is, one of them goes.
- [ ] **Alignment.** Edges, baselines, icons and numbers line up with their neighbours, at both widths.
- [ ] **Uniform card layouts.** Skills, Daevanion and Stigmas cards share one layout. Next up cards look like milestone cards.
- [ ] **Existing patterns reused.** Spacing, type, tokens and components come from `app.css`; no one-off styles.
- [ ] **Text.** Plain, short sentences. Calls the guide "unofficial". No hint of endorsement by NC or a source site.
- [ ] **No dead space.** An icon tile lines up with its title, and the lines under the title run the card's full width
  (`design.md`, "No dead space around icons").

## Does it look AI-made?
A design fails here when it looks generated rather than made for this app. Each "yes" is a finding.
- [ ] **Generic styling.** Purple-to-blue gradients, glows, glass blur, heavy drop shadows or neon accents that aren't
  in our tokens.
- [ ] **Decoration as content.** An emoji or icon on every heading or bullet, sparkles, badges with nothing to say, or
  a stat tile that restates a number shown elsewhere.
- [ ] **Everything in a card.** Each line in its own rounded box, or a grid of identical cards where a plain list
  reads better.
- [ ] **Filler words.** "Seamless", "unlock", "elevate", "your journey", "at a glance", marketing tone, or a lede that
  says nothing the title doesn't.
- [ ] **Uniform sameness.** Every section the same shape and size, whatever its content's weight. Nothing is the
  clear first thing to read.
- [ ] **Fake precision.** Percentages, scores or counts with no source, or more digits than the data has.
- [ ] **Title Case and punctuation tics.** Title Case labels, em-dashes or "→" arrows in running text, and colons
  everywhere.
- [ ] **Off-brand.** It ignores our palette, type, icon set or the game's own markers, and would look the same in any
  other app.

## Behaviour
- [ ] **Manual progress.** Nothing ticks or levels up by itself. Level changes only through Level up, −, + or the slider.
- [ ] **Basic mode = essentials only.** Anything not essential is hidden in Basic, and Basic still reads complete.
- [ ] **Saved progress is safe.** Same storage key as today (`KEY` in `src/core/state.js`, see `docs/ARCHITECTURE.md`),
  unless the change is a planned pre-1.0 clean break per CLAUDE.md (new key, fresh start without errors, CHANGELOG says
  saves reset). No renamed, reused or position-derived item keys; new keys follow `rq:<id>` / `sd:<slug>`. Nothing
  reads old saves differently. If a change could touch saves, the `journey` and `save` suites ran.
- [ ] **Correct to Lv 45.** The change holds at Lv 1, 27 and 45 without the user reporting a problem. Empty and full states look right.

## Accessibility
- [ ] **Keyboard.** Every new control is reachable by Tab, in a sensible order, and works with Enter or Space. Popovers close with Escape and return focus.
- [ ] **Focus.** A visible ring on every stop, on every surface it sits on.
- [ ] **Names.** Icon-only controls have an accessible name; no button named "What is ?".
- [ ] **Contrast.** Text 4.5:1; large text and UI borders 3:1. Small text does not use plain `--accent` (use `--accent-text`).
- [ ] **Colour is not the only cue.** Done, overdue and current also differ by icon, text or shape.
- [ ] **Motion.** New animation stops under `prefers-reduced-motion`.
- [ ] **Automated.** `node tests/run.mjs --only a11y` is green (after a build). Do not add rules to the allow list to pass.

## Phone check (390 px)
- [ ] No sideways scroll, also at 260 px wide (150 % zoom).
- [ ] Tap targets are at least 24 px, and primary buttons at least 44 px tall.
- [ ] Text fields are 16 px or larger (iPhone Safari zooms below that). No text under 11 px (mono) or 12 px (body).
- [ ] Nothing is covered by the Build tab or the drawer.
- [ ] Nothing depends on hover. Hover-only hints also show on touch.
- [ ] Readable without zooming; long names wrap instead of cutting off.

## Before it ships
- [ ] `npm test` is green; no check was weakened to pass.
- [ ] Before / after shots and a `scrapbook.json` are committed (`docs/reviews/README.md`), or the PR body says "No
  visible change".
- [ ] No new game art without the owner's OK; new icons have their source recorded in `docs/ISSUES.md`.
- [ ] Reviewer notes say what was checked, what was skipped and why.

## Design Critic findings
- The critic sends one numbered list, each item with the line above it fails, the screen and what it saw.
- Design Lead answers each one in writing: fixed (with the new shot), or not fixing and why. Nothing is answered by
  silence. Isaac's look OK stays final.
