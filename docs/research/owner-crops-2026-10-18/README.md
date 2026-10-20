# Cleaned owner crops (T-47 fallback), 2026-10-18

Cleaned by Game Data Check (Gretchen) at 10:55 PM ET from the owner's in-game screens (the source of truth). These two
icons are on neither Metabot nor aion2quest.pro, and the last-resort check found none (`docs/research/2026-10-t47-icon-check.md`),
so the owner icon rule makes the owner's crop the source (DECISIONS 2026-10-18 8:57 PM ET; `docs/ISSUES.md` T-47).

Cleaning: background colour = median of the border pixels; alpha ramps with colour distance from it and the colour is
un-mixed; trimmed to the glyph (alpha > 0.1) and centred on a square canvas with an 8% margin; never upscaled.

| File | What it is | Source screen |
|---|---|---|
| `regional-available-owner-crop.png` (33 px) | Regional quest available (teal star) | owner screen 2026-10-18 `regional-quest-available.png` (private archive) |
| `extract-flask-owner-crop.png` (35 px) | Extract action (flask) in the item tooltip | owner screen 2026-10-18, item tooltip (private archive) |

Used by 0.8 P13 (#502). The build adds the ISSUES.md provenance row when it puts either in `src/assets/icons/`.
