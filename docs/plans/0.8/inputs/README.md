# 0.8 build inputs

Builds run in CI and can't read the project's shared folder, so every file a 0.8 spec points at lives here (copied
2026-10-20 by the Release Planner; the shared-folder originals are unchanged). P13 #502 stopped on exactly this.

| Path | What it is | Who made it | Used by |
|---|---|---|---|
| `owner-keys/templar.md` | Owner's Templar skill window (K), Lv 4, 2026-10-18: unlock levels, icon ids, default keys | Game Data Check | P3 |
| `owner-keys/cleric.md` | Owner's Cleric skill window, 2026-10-19 | Game Data Check | P5 |
| `owner-keys/sorcerer.md` | Owner's Sorcerer skill window, 2026-10-19 | Game Data Check | P17 |
| `owner-keys/chanter.md` | Owner's Chanter skill window, 2026-10-19 | Game Data Check | P19 |
| `passive-icons-templar-cleric-2026-10-20.md` | Templar and Cleric passive icons against the owner's screens | Game Data Check | P3, P5 |
| `design-v2/README.md` and its frames | Design Lead's round 2 (§2 regional quest state, §3 class choice) with the owner's answers | Design Lead | P12, P13 |
| `design-v4/` | Verb buttons and the Regional quests tile, owner T-58 (2026-10-19 8:25 and 8:44 PM ET); supersedes v2 for the buttons | Design Lead | P13 |
| `design-extract/4-extract-icon.png` | The extract-tip flask placement (first round, unchanged in v2 §4) | Design Lead | P13 |
| `emblems/` and `SOURCES.md` | The 8 Metabot class emblems, exact fetched bytes with sha256 and pixel hashes | Design Lead | P12 |

The owner crops P13 needs (teal star, extract flask) are in `docs/research/owner-crops-2026-10-18/` with their record.
Frames are docs, not app art: nothing here ships to the site.

The shared folder re-encodes image files after they sync (pixels kept, bytes changed; Design Lead's test, 2026-10-20).
So a byte hash taken on a shared-folder copy won't match the original. The emblems came from a tar for that reason.
The PNG frames and crops here are copies from the shared folder and only claim matching pixels.
