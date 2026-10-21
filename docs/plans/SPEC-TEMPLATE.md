# Item spec template

The Release Planner writes every item spec in `docs/plans/<minor>/README.md` (and each `<minor> P<n>` issue) from this
file. A `tests/kickoff.mjs` check parses the example below with the same code kickoff uses, so a
format change here that kickoff can't read fails its own PR (Kaizen, 2026-10-19: the After parser broke twice on spec-format changes). Change the spec
format only here, together with the parser and its test.

## Rules kickoff depends on

- The issue title is `<minor> P<n>: <short title>` (a patch item `<x.y.z> F<n>: …`, the release `Release <minor>.0 (<short title>)`,
  which kickoff keys as `R`; use this form. `<minor> R: …` is also keyed `R` since #530).
- The **first** `After:` in the issue body is the one kickoff reads. It holds bare keys separated by commas:
  - `P<n>` (another item of the same minor), `research-<slug>` (met once a docs/research file named with `<slug>` is
    on main), `owner-ok-<minor>-<slug>` (met once a DECISIONS topic carries it in backticks on an "Owner, typed" row);
  - `everything` or `all` (every other item of the minor), or `none` (`and` and `nothing` are skipped like `none`).
  - Markdown marks and `(…)` notes are stripped; text after the first `. ` is ignored. Anything else is "not
    understood" and holds the item, which is how the release item is held on purpose until the Release Planner
    releases it.
- The queue line is the issue's last line, copied into the state issue (#114) to queue it:
  `- [next] #<n> <opus|sonnet> lanes:<lane>[,<lane>…]`, `lanes:none`, or no lanes at all; `alone` is a separate word
  (`lanes:release alone`, or `- [next] #<n> opus alone`), never part of the lane list.
- The **Inputs** bullet lists, in backticks, the repo paths the build reads (crops, boards, research files), or says
  `none`; only its backticked paths count. A spec with no Inputs bullet or line reads as `none`. An `Inputs: <path>, <path>` line in `## Lanes, model, order` may list them
  plain. Kickoff looks each one up on
  main (a directory or glob by its directory) and holds the item, with a `spec: input not in repo: <path>` comment, when
  one is missing or lies outside the repo (`~/…`, `/…`). A `/mnt/` path anywhere in the spec but its No-gos holds it the same way:
  builds can't read the project's shared folder (Kaizen, 2026-10-20; #502 sat 67 min).
- The issue's `Plan: \`docs/plans/<minor>/README.md\` §P<n>` names its plan text: that `## P<n>:` section (the whole file
  when no § is given) plus any ROADMAP row linking it as `[P<n>](<file>)`. Every repo path the plan text names (in
  backticks, or as a link resolved against the file it is in; a `:line` anchor is dropped, and only a path whose first
  segment is a top-level entry on main counts) must be in the spec's Inputs or Files, or written in the spec as
  `` `<path>` — not needed: <reason> `` (kickoff posts it for Watchdog to log; best on its own line outside Inputs, and
  kickoff never looks one up as an input); every key in the plan's After line and every
  `research-<slug>` it names must be in the spec's After. Otherwise kickoff holds the item with a
  `spec: plan input missing: <path>` or `spec: plan After key missing: <key>` comment (Kaizen, 2026-10-21: #644's plan
  gained an input and an After key that its issue never got).
- An item on the `gen` or a `golden` lane, or whose spec runs `npm run gen` or re-records golden, starts on Opus
  whatever its queue line says, and so does one whose **Files** line names an Opus path (`.github/routing/opus-paths.json`;
  Kaizen, 2026-10-20: #509 was routed to Sonnet and stopped) or names no path at all. Files must list every file the
  Result needs, core, save, pack and build files included: routing only sees what is listed (#501 stopped on src/core
  and scripts/ files its spec left out).
- Lanes are the serial files of docs/team/DISPATCH.md. Names outside kickoff's known list only warn, and kickoff still
  keeps same-named lanes apart.

## Items that fetch

Bot builds have no web access, so a build never fetches; the fetching happens in a research step a thread does first
(the `research-<slug>` After key). When an item needs one, its **Result** names the research step and points to the
fetch-log rule rather than restating it: ledger ROL-08 (coordinator, 2026-10-20 7:59 PM ET), whose text lives in
`docs/research/SOURCES.md` "Keeping this current". Keep the pointer out of **Inputs** (every backticked path there is an
input the build must find on main). Name the fetch log itself in words, never by a path: kickoff holds any spec with a
`/mnt/` path outside No-gos (rule above).

## Example

```markdown
## P2: Templar class data (hidden)

- **Problem.** One or two sentences: what is wrong or missing, with its source (issue, review, owner message).
- **Result.** What exists when it is done, file by file.
- **Inputs.** `docs/research/2026-10-templar-pack.md`, `data/research/templar-skills-metabot-2026-10.csv`.
- **Files.** `data/packs/aion2/classes/templar/*`, `tools/research/gladiator-pack.mjs`, the tests.
- **No-gos.** What it must not change.
- **Acceptance.**
  - [ ] One checkable line each, with the evidence the PR pastes.
- **Lanes:** gen. **Model:** Opus, L (120 min).
- **After:** P1, research-templar, owner-ok-0.8-icon-box.
```

The issue body is `# <title>`, a one-line "Planned in …" note (pass, plan file, owner go), the spec above verbatim,
`## Lanes, model, order` (lanes, model, stall limit, gate), and the queue line last.
