/* Game terms explained (0.6 P18; drawn in docs/design/0.6-onboarding-mockup.md §1.4, T1 / DT1, owner-ok-S1): a card's
   markup marks a term's first use with <button type="button" class="term" data-term="term:<id>">; wireTerms(root) makes
   each mark in root a disclosure for its sentence (aion2Text.terms, compiled from data/packs/aion2/terms.json).
   The note sits under the line it explains, in the card's flow (it pushes the content down, no overlay), and the mark
   names it with aria-describedby. Tap, click, Enter or Space opens and closes it; where the pointer can hover, hover and
   focus open it too (a click then keeps it open); Esc closes it. One is open at a time. A mark with no verified term
   is put back as plain text. */
import { aion2Text } from "./text.js";

let open = null, pinned = false;
const noteOf = b => document.getElementById(b.getAttribute("aria-controls"));
const show = (b, pin) => {
  if (open && open !== b) hide(open);
  const n = noteOf(b); if (!n) return;
  n.hidden = false; b.setAttribute("aria-expanded", "true"); open = b; pinned = pin;
};
function hide(b) { const n = noteOf(b); if (n) n.hidden = true; b.setAttribute("aria-expanded", "false"); if (open === b) { open = null; pinned = false; } }
const canHover = () => typeof matchMedia === "function" && matchMedia("(hover: hover)").matches;
const markOf = e => e.target && e.target.closest ? e.target.closest("button.term[aria-controls]") : null;

let wired = false;
const listen = () => {
  if (wired) return; wired = true;
  document.addEventListener("click", e => { const b = markOf(e); if (!b) return;
    if (open === b && pinned) hide(b); else show(b, true); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && open) { const b = open; hide(b); if (document.activeElement !== b && b.isConnected) b.focus(); } });
  document.addEventListener("focusin", e => { const b = markOf(e); if (b && canHover() && open !== b) show(b, false); });
  document.addEventListener("focusout", e => { const b = markOf(e); if (b && open === b && !pinned) hide(b); });
  document.addEventListener("mouseover", e => { const b = markOf(e); if (b && canHover() && open !== b) show(b, false); });
  document.addEventListener("mouseout", e => { const b = markOf(e); if (b && open === b && !pinned && !b.contains(e.relatedTarget) && document.activeElement !== b) hide(b); });
};

/* the block the mark's line belongs to: the note goes right after it */
const lineOf = b => b.closest("p, li, h3, dd, div") || b.parentElement;

export function wireTerms(root) {
  if (!root) return;
  const terms = aion2Text.terms || {};
  for (const b of root.querySelectorAll("button.term[data-term]")) {
    if (b.hasAttribute("aria-controls")) continue;
    const id = b.dataset.term, t = terms[id];
    if (!t) { b.replaceWith(document.createTextNode(b.textContent)); continue; }
    const nid = "tn-" + id.replace(/[^a-z0-9-]/g, "-");
    const n = document.createElement("p");
    n.className = "term-note"; n.id = nid; n.hidden = true; n.textContent = t.x;
    lineOf(b).after(n);
    b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", nid); b.setAttribute("aria-describedby", nid);
  }
  listen();
}
