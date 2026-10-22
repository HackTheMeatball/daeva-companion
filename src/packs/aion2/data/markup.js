/* Text helpers the data tables use to build their HTML (item links, "i" buttons, map links, placeholders).
   Moved out of src/main.js unchanged (0.2 P2). Every export is still a page global (scripts/build.mjs). */
import { DV_BOARDS, MAP_BASE, TIPS } from "./generated.js";
import { ITEMS } from "./items.js";
import { STIGMA_PLAN } from "./build.js";
export const seq = (arr) => '<span class="seq">' + arr.map(s => `<span>${s}</span>`).join('<i>→</i>') + '</span>';
export const EYE = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>`;
export const I = (key, label) => {
  const [name, slug] = ITEMS[key];
  return `<a class="itm" data-ico="${key}" href="https://metabot.gg/en/aion-2/items/${slug}" target="_blank" rel="noopener" title="Open in the item database">${label || name}${EYE}</a>`;
};
/* Inline item icons (0.6.2 P17, DECISIONS owner-ok-0.6.2-item-icons): Wisdom Stones, Daevanion Crystals and Enhance
   Stones show their icon (the item's own file in assets/icons) where a Next up card or a reward / count line names them;
   never in milestone rows (their tile shows it) and never on free text. itemKeyOf is the one matcher for the three item
   words: one spelling rule ("Enhance" or "Enhancement" Stone), a bare "crystal" is a Daevanion Crystal (the Cube and
   Sealed Dungeon lines), and a crystal with another name before it ("Soul Crystal", "Life Crystal") is not. */
const ITEM_WORDS = [["wisdom", /^Wisdom Stones?$/], ["crystal", /^(Daevanion )?Crystals?$|^crystals?$/], ["enhance", /^Enhance(ment)? Stones?$/]];
export const itemKeyOf = w => (ITEM_WORDS.find(([k, re]) => re.test(w) && ITEMS[k] && ITEMS[k][2]) || [])[0];
export const itemIco = k => `<img class="itm-ico" src="${ITEMS[k][2]}" alt="" loading="lazy" onerror="this.remove()">`;
/* "3 Wisdom Stones": number, icon and word on one line (a word the matcher doesn't know stays plain) */
export const itemQty = (n, w) => { const k = itemKeyOf(w); return k ? `<span class="itq">${n} ${itemIco(k)}${w}</span>` : `${n} ${w}`; };
/* a reward line the code writes from the data ("2 Crystals · 2 Wisdom Stones"): each named item, with its number */
export const itemLine = s => s.replace(/(?:(\+?\d[\d,]*) )?(Daevanion Crystals?|(?<![A-Za-z] )[Cc]rystals?|Wisdom Stones?|Enhance(?:ment)? Stones?)(?![A-Za-z])/g,
  (m, n, w) => { const k = itemKeyOf(w); return !k ? m : n ? itemQty(n, w) : `<span class="itq">${itemIco(k)}${w}</span>`; });
/* item links (I() below) on a Next up card: the icon before the text, inside the link; the external-link mark stays */
export const itemLinkIcos = html => html.replace(/(<a class="itm" data-ico="(\w+)"[^>]*>)(?!<img)/g, (m, open, k) => itemKeyOf(ITEMS[k] ? ITEMS[k][0] : "") === k ? open + itemIco(k) : m);
/* "i" button after a term. `name` is the button's spoken name when the term has no visible label (a section title next to it). */
export const T = (label, key, name) => `<span class="term">${label}<button type="button" class="tip" data-tip="${key}" aria-expanded="false" aria-label="${name || `What is ${label.replace(/<[^>]+>/g, "")}?`}">i</button></span>`;
/* Placeholders in milestone text, filled by fillStigmaText() on every update. */
export const stn = n => `<span class="stn" data-slot="${n}">${STIGMA_PLAN[n - 1]}</span>`;
export const eRow = n => `<span class="erow" data-slot="${n}"></span>`;
/* The stigmas a new one lands under on E (order: the E stack after adding it, r: its row) each move up a row; name the row
   each lands on, not a direction (#774 Design Lead: row 0 is at the bottom, so "down" read wrong). "" when none move. */
export const eShift = (order, r) => order.slice(r + 1).map((n, i) => `${n} ${i ? "to" : "moves up to"} row ${r + 1 + i}`).join(", ");
export const sub = (label, note) => ({ sub: label, subNote: note });
/* An unverified value's label (0.8 P20): the generator carries a field's status when it isn't verified; disputed and
   owner-check read "check in game", inferred "inferred". Single source keeps its own tags (the skill rows'), so none here.
   stTag: the small tag after the value; stNote: the same words for a tooltip ("" when the value is verified). */
const ST_WORDS = { disputed: ["check in game", "Sources disagree on this: check it in game"], "owner-check": ["check in game", "Not confirmed yet: check it in game"], inferred: ["inferred", "Inferred from nearby data, not stated by a source"] };
export const stTag = st => ST_WORDS[st] ? ` <span class="ss-tag" title="${ST_WORDS[st][1]}">${ST_WORDS[st][0]}</span>` : "";
export const stWord = st => (ST_WORDS[st] || [])[0];
export const stNote = st =>ST_WORDS[st] ? ` (${ST_WORDS[st][0]})` : "";
/* Vaizel / Triniel plan nodes (DV_BOARDS, data/build.json); keys dv:v:* / dv:t:*. */
export const dvNodes = b => DV_BOARDS[b].nodes.map(n => ({ k: n.k, dv: true, board: b, blv: DV_BOARDS[b].lv, ty: n.ty, t: n.t, ...(n.via ? { via: n.via } : {}), ...(n.st ? { st: n.st } : {}), ...(n.cst ? { cst: n.cst } : {}) }));
export const metaSlug = n => n.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const mapSlug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const hideouts = (names, keyPrefix = "sd") => [{ ...sub("Sealed Dungeons"), group: "hideout" },
  ...names.map(n => ({ kind: "hideout", name: n, k: `${keyPrefix}:${mapSlug(n)}`, t: `<a class="itm" href="${MAP_BASE}/dungeons?focus=dungeon:${metaSlug(n)}" target="_blank" rel="noopener" title="Show on the Altgard interactive map (Metabot)"><b>${n}</b>${EYE}</a>`, cell: true }))];
/* Link a quest giver to the quest's marker on the faction's map (MAP_BASE: Metabot's Altgard map). */
export const mapQ = (id, who) => `<a class="itm" href="${MAP_BASE}?focus=quest:${id}" target="_blank" rel="noopener" title="Show on the map">${who}${EYE}</a>`;
export const ASC = "Journal (J) → Ascension tab → Teleport (bottom right) takes you to Asahr.";
/* Guide text tokens (data format v2, DATA-FORMAT-V2 §7) -> the HTML the helpers above make. The data holds the tokens; their
   markup and wording stay here in code. Build tokens ([[build:…]]) are expanded by the generator with the guide build. */
export const expandTokens = s => s.replace(/\[\[([a-z]+)(?::([^|\]]*))?(?:\|([^\]]*))?\]\]/g, (m, kind, arg, label) => {
  if (kind === "item") return I(arg, label);
  /* a label that is a clause ("Respec is free") would read "What is Respec is free?": name the button by its tip's title */
  if (kind === "tip") return T(label, arg, /\sis\s/.test(label) && TIPS[arg] ? `About ${TIPS[arg].h.toLowerCase()}` : undefined);
  if (kind === "mapq") return mapQ(arg, label);
  if (kind === "stigma") return stn(+arg);
  if (kind === "erow") return eRow(+arg);
  if (kind === "asc") return ASC;
  if (kind === "rotseq") return `<span class="rotseq"></span>`;
  throw new Error("unknown text token " + m);
});
