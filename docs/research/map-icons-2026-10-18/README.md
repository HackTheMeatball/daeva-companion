# Map-marker and skill icons from approved sources (2026-10-18)

Covered by the owner's "0.6.2 map icons OK: as recommended" (typed in the Release Planner thread, 2026-10-18 10:04 PM ET) and his icon rule
(DECISIONS, 2026-10-18 8:57 PM ET: a better online copy first, his crop as the fallback). The skill icon falls under the standing icon OK
(CLAUDE.md). Bot builds can't reach the web, so the files a build uses are committed here. Each PNG was converted from the source WebP with
its pixels unchanged (checked pixel for pixel). Fetched by Game Data Check with our own User-Agent, one request at a time, at least 7 s apart.

| File | What it is | Source page | File URL | Retrieved |
|---|---|---|---|---|
| `sealed.png` (52×52, transparent) | Sealed Dungeon map marker | https://metabot.gg/en/aion-2/map/altgard (the map page that loads these files, as Source Vetting reported) | https://metabot.gg/web/aion2/mapicons/sealed.webp | 2026-10-18 10:14 PM ET |
| `garrison.png` (52×52, transparent) | Stronghold (garrison) map marker | https://metabot.gg/en/aion-2/map/altgard (the map page that loads these files, as Source Vetting reported) | https://metabot.gg/web/aion2/mapicons/garrison.webp | 2026-10-18 10:14 PM ET |
| `trace.png` (52×52, transparent) | Empyrean Trace map marker | https://metabot.gg/en/aion-2/map/altgard (the map page that loads these files, as Source Vetting reported) | https://metabot.gg/web/aion2/mapicons/trace.webp | 2026-10-18 10:14 PM ET |
| `kibelisk-purple.png` (64×64, transparent) | Kibelisk map marker (purple, engraved) | https://aion2quest.pro/en/map/altgard (as Source Vetting reported) | https://aion2quest.pro/img/map/markers/UT_Marker_TeleportArtifact_Dark_Engraved.webp | 2026-10-18 10:15 PM ET |
| `shadowstrike.png` (256×256) | Assassin skill Shadowstrike | https://metabot.gg/en/aion-2/skills/shadowstrike | https://metabot.gg/web/aion2/skills/13070000.webp | 2026-10-18 10:15 PM ET |

The app's existing `src/assets/icons/sk-shadowstrike.png` (128 px) is this same file scaled down: its mean pixel difference from the
256 px original at 128 px is under 3 of 255. Its provenance row in docs/ISSUES.md is filled in from this record.

All four markers were matched against the owner's crops in `/mnt/project-files/owner-screens/2026-10-18/` (comparison sheet
`/mnt/project-files/icons-hq/gretchen-crop-vs-source-2026-10-18.png`). Campsite has no approved-source match and stays as the owner's crop.
