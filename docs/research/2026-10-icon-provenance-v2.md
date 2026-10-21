# Icon provenance v2: every shipped icon, strict (0.9 P27, CK-2)

Game Data Check, 2026-10-21. Input for P27 (#698), gate `research-icon-provenance-v2`. This replaces the "Owner list"
and "For P27's check" sections of `2026-10-icon-provenance.md`; that file's 29 Cleric rows still stand.

## What v1 got wrong

v1 counted an icon as recorded when an ISSUES.md table row named it, even when the row's source, file URL and date
cells were blank. P27's build used the strict test (a row naming the file, with a page URL, a file URL and a date), and
that test fails 28 of 239 icons on main. v1 claimed 239 of 239.

## Method

- `src/assets/icons/` on main has 239 files. The strict test was re-run over ISSUES.md plus v1's rows: 28 fail. The
  build comment named 26 of them; `extract-flask.png` and `story-complete.png` are the other two.
- **13 Assassin skill and stigma icons:** these were checked against Metabot today. For each, the skill page was fetched,
  the file its `og:image` names was fetched, the file was scaled to the shipped size, and the two were compared. Every
  request is in `legal/fetch-log/gretchen.md`: 2026-10-21 23:20–23:28Z (the item checks below included), our User-Agent, at least 10.5 s apart, all 200.
  - The 9 skills differ by a mean of 1.8–2.9 of 255. The 4 stigmas differ by 0.00, so they are pixel-identical after
    scaling.
  - As a control, a wrong icon differs by 67–134.
  - So each shipped file is that Metabot file at 128 px. This is the same method as `sk-shadowstrike.png`
    (2026-10-18). When the files were first taken is not on record (before 2026-10-12, the first repo commit
    de17312d), so the date given is the date of the match check.
- **6 Daevanion node frames and 3 item icons:** these are the owner's own uploads, traced in the research archive
  (fe5225f5).
  - `EXCLUDED.md`, "Owner uploads not archived", lists 10 uploads from the original claude.ai project that are
    sha256-identical to the archived `icons/*.png` and `icons/*-src.png`.
  - The archive's `engineering/e1/app.js` says: "Node art cut from the player's screenshots".
  - The frames were cut from those uploads with the archive's `icons/cut*.py` scripts (background removal by flood fill). The
    items are the uploads unchanged.
  - Today's sha256 of every shipped file matches the archive's `MANIFEST.md`, with one known exception: Wisdom Stone and
    Daevanion Crystal swap names, because 477f366b (2026-10-13) fixed swapped file names. So no file changed after it
    was uploaded.
  - Metabot's item files are a different picture (mean difference 41–114 against `icon_item_usable_*`; fetched
    23:27Z), so Metabot is not their source.
- **3 owner crops** (`rq-available`, `extract-flask`, `story-complete`) already have full owner-crop rows in ISSUES.md:
  owner screen, cleaning, date, and the committed crop. They have no file URL because none exists. The check has to
  accept that kind of row; they don't need a new record.
- **3 relabelled Cleric files:** their rows exist under the staged names that ISSUES.md line 89 names. git shows
  `C100` copies (fdd9b03d) of the staged files, so each row's source page is the page the file came from, not the
  shipped name's page (Metabot's file labels are wrong; ISSUES.md "Closed 2026-10-20").

## Rows to add to docs/ISSUES.md (shipped name)

Kind `metabot`: a page URL and a file URL. `owner-upload` / `owner-crop`: no file URL exists; the record is the owner's
image and its hash. Nothing below is guessed; each row says how it was established.

| File | Kind | Name | Source page | File URL | Retrieved | How established |
|---|---|---|---|---|---|---|
| sk-ambush.png | metabot | Ambush | <https://metabot.gg/en/aion-2/skills/ambush> | <https://metabot.gg/web/aion2/skills/13060000.webp> | 2026-10-21 (match checked) | mean diff 2.89 |
| sk-assault-stance.png | metabot | Assault Stance | <https://metabot.gg/en/aion-2/skills/assault-stance> | <https://metabot.gg/web/aion2/skills/13750000.webp> | 2026-10-21 (match checked) | mean diff 2.22 |
| sk-defense-break.png | metabot | Defense Break | <https://metabot.gg/en/aion-2/skills/defense-break> | <https://metabot.gg/web/aion2/skills/13780000.webp> | 2026-10-21 (match checked) | mean diff 2.70 |
| sk-exploit-weakness.png | metabot | Exploit Weakness | <https://metabot.gg/en/aion-2/skills/exploit-weakness> | <https://metabot.gg/web/aion2/skills/13720000.webp> | 2026-10-21 (match checked) | mean diff 2.47 |
| sk-heart-gore.png | metabot | Heart Gore | <https://metabot.gg/en/aion-2/skills/heart-gore> | <https://metabot.gg/web/aion2/skills/13350000.webp> | 2026-10-21 (match checked) | mean diff 2.47 |
| sk-insignia-explosion.png | metabot | Insignia Explosion | <https://metabot.gg/en/aion-2/skills/insignia-explosion> | <https://metabot.gg/web/aion2/skills/13130000.webp> | 2026-10-21 (match checked) | mean diff 2.24 |
| sk-quick-slice.png | metabot | Quick Slice | <https://metabot.gg/en/aion-2/skills/quick-slice> | <https://metabot.gg/web/aion2/skills/13010000.webp> | 2026-10-21 (match checked) | mean diff 2.73 |
| sk-rear-smite.png | metabot | Rear Smite | <https://metabot.gg/en/aion-2/skills/rear-smite> | <https://metabot.gg/web/aion2/skills/13740000.webp> | 2026-10-21 (match checked) | mean diff 2.28 |
| sk-savage-roar.png | metabot | Savage Roar | <https://metabot.gg/en/aion-2/skills/savage-roar> | <https://metabot.gg/web/aion2/skills/13100000.webp> | 2026-10-21 (match checked) | mean diff 1.76 |
| st-illusive-clone.png | metabot | Illusive Clone | <https://metabot.gg/en/aion-2/skills/illusive-clone> | <https://metabot.gg/web/aion2/skills/13310000.webp> | 2026-10-21 (match checked) | mean diff 0.00 |
| st-savage-fang.png | metabot | Savage Fang | <https://metabot.gg/en/aion-2/skills/savage-fang> | <https://metabot.gg/web/aion2/skills/13270000.webp> | 2026-10-21 (match checked) | mean diff 0.00 |
| st-swift-contract.png | metabot | Swift Contract | <https://metabot.gg/en/aion-2/skills/swift-contract> | <https://metabot.gg/web/aion2/skills/13390000.webp> | 2026-10-21 (match checked) | mean diff 0.00 |
| st-triniels-dagger.png | metabot | Triniel's Dagger | <https://metabot.gg/en/aion-2/skills/triniels-dagger> | <https://metabot.gg/web/aion2/skills/13300000.webp> | 2026-10-21 (match checked) | mean diff 0.00 |
| sk-cleric-heal-block.png | metabot | Heal Block | <https://metabot.gg/en/aion-2/skills/immortal-veil> (file mislabelled there) | <https://metabot.gg/web/aion2/skills/17750000.webp> | 2026-10-19 | C100 of staged `sk-immortal-veil.png` (fdd9b03d) |
| sk-cleric-prayer-of-concentration.png | metabot | Prayer of Concentration | <https://metabot.gg/en/aion-2/skills/heal-block> (file mislabelled there) | <https://metabot.gg/web/aion2/skills/17760000.webp> | 2026-10-19 | C100 of staged `sk-heal-block.png` (fdd9b03d) |
| sk-cleric-radiant-benediction.png | metabot | Radiant Benediction | <https://metabot.gg/en/aion-2/skills/prayer-of-concentration> (file mislabelled there) | <https://metabot.gg/web/aion2/skills/17770000.webp> | 2026-10-19 | C100 of staged `sk-prayer-of-concentration.png` (fdd9b03d) |
| blue-off.png | owner-upload | Daevanion node, blue, not bought | owner upload `f6f30d8f-image.png` (original claude.ai project), cut with the archive's `icons/cut*.py` | — (owner upload) | before 2026-10-12 (in de17312d) | src sha256 in archive MANIFEST; shipped `8a16aed5…` = archive |
| blue-on.png | owner-upload | Daevanion node, blue, bought | owner upload `e436c8c9-image.png`, cut as above | — (owner upload) | before 2026-10-12 (in de17312d) | shipped `335adbdf…` = archive |
| green-off2.png | owner-upload | Daevanion node, green, not bought | owner upload `bae912b7-image.png`, cut as above | — (owner upload) | before 2026-10-12 (in de17312d) | shipped `5040ad62…` = archive |
| green-on2.png | owner-upload | Daevanion node, green, bought | owner upload `5ed5bb6c-image.png`, cut as above | — (owner upload) | before 2026-10-12 (in de17312d) | shipped `6a92da1f…` = archive |
| orange-off.png | owner-upload | Daevanion node, orange, not bought | owner upload `a4ba3845-image.png`, cut as above | — (owner upload) | before 2026-10-12 (in de17312d) | shipped `532604ac…` = archive |
| orange-on.png | owner-upload | Daevanion node, orange, bought | owner upload `2357222e-image.png`, cut as above | — (owner upload) | before 2026-10-12 (in de17312d) | shipped `c5602e30…` = archive |
| daevanion-crystal.png | owner-upload | Daevanion Crystal | owner upload `8722a333-image.png`, unchanged | — (owner upload) | before 2026-10-12 (in de17312d) | shipped `9e6088f4…` = upload (archived as wisdom-stone.png before 477f366b fixed the swapped names) |
| wisdom-stone.png | owner-upload | Wisdom Stone | owner upload `8df21e92-image.png`, unchanged | — (owner upload) | before 2026-10-12 (in de17312d) | shipped `b62714e2…` = upload (archived as daevanion-crystal.png before 477f366b) |
| enhance-stone.png | owner-upload | Enhance Stone | owner upload `a60a6ac1-image.png`, unchanged | — (owner upload) | before 2026-10-12 (in de17312d) | shipped `e060a29b…` = upload |
| rq-available.png | owner-crop | Regional quest available | existing ISSUES.md row (owner screen 2026-10-18, T-47) | — (owner crop) | 2026-10-18 | already recorded |
| extract-flask.png | owner-crop | Extract action | existing ISSUES.md row (owner screen 2026-10-18, T-47) | — (owner crop) | 2026-10-18 | already recorded |
| story-complete.png | owner-crop | Story quest complete check | existing ISSUES.md row (owner screen 2026-10-18) | — (owner crop) | 2026-10-18 | already recorded |

The 6 blank placeholder rows at ISSUES.md 121–126 should be replaced by these rows, not kept beside them.

## Owner list (icons with no provenance record)

None. All 28 have a record above.

One check for the owner, not a gap in the record: the 9 owner-upload files are images the owner gave the project before
the repo existed. If any of them came from a website, not a game screenshot, he can name the site. Until he does, the
record answers a takedown or permission question as "supplied by the owner".

## For P27's check

- With these rows and v1's 29, 239 of 239 files pass. This was checked by re-running the strict test on a scratch copy
  of ISSUES.md with both tables appended.
- The strict test must accept the two owner kinds (`owner-upload`, `owner-crop`) without a file URL. Instead it needs an
  owner source (screen or upload) and a date. For `owner-upload`, the date "before 2026-10-12 (in de17312d)" is a bound,
  not an exact day; that bound is the most the record holds. Every other row needs a page URL, a file URL and a date.
- This doesn't narrow the check: the 6 files with no URL have no URL anywhere, and the check was always going to have to
  read these rows' kind.
