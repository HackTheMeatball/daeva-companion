# T-47 last-resort icon check (2026-10-19)

Source Vetting, at Game Data Check's request (owner, project chat 2026-10-18 10:50 PM ET). Six AION 2 UI icons have no
approved-site source: the Field zone label (crossed swords), the Village zone label (tent), the Journal completed-quest
check, the regional and story "available" stars, and the item tooltip's Extract flask. Already ruled out on approved
sites: Metabot's whole `mapicons` set and zone pages, and aion2quest.pro's `UT_Marker_*` set.

**Result: none found.** The owner's crops stay as the fallback.

| Site | Terms (read first) | robots.txt | Content |
|---|---|---|---|
| www.aion2kina.com | Pass: <https://www.aion2kina.com/en/terms/> (updated 2026-10-17) bans only "unreasonable automated load"; "AION2 names, marks, and official media belong to NC Corporation" | Pass: `Allow: /`, disallows `/admin/`, `/api/admin/`, `/api/journey-events/` | Map marker categories are Collectables, Gathering, Pet, Location only; icons are a generic web icon set (inferred; the marker bundle was not opened). No quest or zone-type icons |
| namu.wiki | Not read: 403 Cloudflare challenge on our first request, the terms page (`/w/나무위키:이용약관`), stopped | Not read | — |
| Allakhazam / ZAM | Fail: <https://corp.fanbyte.com/legal/terms> bans access "using any engine, software, tool, agent, device or mechanism (including spiders, robots, crawlers, data mining tools or the like)" other than browsers | Not read (terms fail) | — |

Searched, not vetted: no AION 2 Fandom, wiki.gg or Fextralife wiki exists; wiki search results were wikily.gg and
thegameswiki.com (both Fail already). Guide articles that describe the Extract button (screenshots at best) were not
opened. Requests: aion2kina 11 (2 to the bare domain, 404), namu.wiki 1, Allakhazam 1, Fanbyte 1; our User-Agent, one
at a time, at least 6 s apart. Nothing kept.
