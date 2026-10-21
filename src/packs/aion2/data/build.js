/* Assassin build data: stat tiers, skill point plan and costs, Daevanion node types, stigma plan, key stacks, icons.
   Every export is still a page global (scripts/build.mjs). */
import { E_NOTE, E_ORDER, E_ST, KEYS, LEVEL_POINTS, RMB_ROWS, RULE_NODE_COSTS, RULE_SHARD_COST, RULE_SKILL_POINT_COST, RULE_SPEC_SLOTS, SP_EXTRA, SP_ICONS, SP_SKILLS_CORE,
  GUIDE_GATES, KEYS_ST, STAT_NOTE, STAT_SRC, STAT_TIERS, STIGMA_ICON, STIGMA_KEY, STIGMA_PLAN, STIGMA_ST, ST_TARGETS } from "./generated.js";
/* Compiled from data/packs/aion2/classes/assassin/ and data/packs/aion2/asmodian/assassin/builds.json since 0.2 step 5b
   (tools/gen/gen.mjs): the guide build (builds.json: stat tiers,
   skill order and specialty picks, stigma plan and targets, key stacks), skills.json (learn levels, icons) and
   stigmas.json (icons), and rule:level-points. Re-exported here under their page names. Since 0.4 P2a the cost and slot
   tables below are built from the pack's rules (RULE_*: rule:skill-point-cost, rule:specialty-slots, rule:node-costs,
   rule:stigma-shard-cost), not written out here. */
export { E_NOTE, E_ORDER, E_ST, KEYS, KEYS_ST, LEVEL_POINTS, SP_ICONS, STAT_NOTE, STAT_SRC, STAT_TIERS, STIGMA_ICON, STIGMA_KEY, STIGMA_PLAN, STIGMA_ST, ST_TARGETS };
/* the build has a key setup: the guide's right-click rows (the Assassin), or the game's default keys (KEYS, 0.7 P11: the
   Ranger and the Gladiator); without either the Build drawer shows no Rotation */
export const HAS_KEYS = RMB_ROWS.length > 0 || KEYS.length > 0;
/* the build suggests its own binding (the Assassin's right-click rows, 0.8 P14): its grid shows that binding, and KEYS (the
   game's defaults, if any) are only listed beside it; without it KEYS are the grid */
export const GUIDE_KEYS = RMB_ROWS.length > 0;
/* the game's default key of a skill (KEYS), null if the build has none or the skill has no key */
export const defaultKeyOf = n => (KEYS.find(k => k.rows.some(r => r.n === n)) || {}).key || null;
/* Node colours match the game: blue = active skill (3), green = passive skill (2), orange = corner (4). Path stat nodes are grey (1). */
export const DV_TYPE = { a: ["dv-a", "active skill"], p: ["dv-p", "passive skill"], c: ["dv-c", "corner"] };
/* Skill point plan: the guide build's core skills in order ({n, learn, spec, passive}), then (E2) the skills after the
   core eight in their source-backed order (single-source ones flagged). Those live in the Skills card and Sync levels
   only, not in milestones, and come after every core upgrade that's open. */
export const SP_SKILLS = SP_SKILLS_CORE.map(s => ({ ...s }));
SP_EXTRA.forEach(s => SP_SKILLS.push({ ...s, extra: true }));
/* Price at level L from a rule's cost bands [{ from, to, cost }]; null outside them */
const bandCost = (bands, L) => { const b = bands.find(x => L >= x.from && L <= x.to); return b ? b.cost : null; };
/* Skill points to raise a skill to level L, 2–10 (rule:skill-point-cost) */
export const spCost = L => bandCost(RULE_SKILL_POINT_COST, L);
/* Effective skill level at which specialty slot 1 / 2 / 3 opens (rule:specialty-slots) */
export const SPEC_SLOT_LV = RULE_SPEC_SLOTS.slice();
export const SP_STEPS = [];
SP_SKILLS.forEach((s, rank) => {
  for (let L = 2; L <= 10; L++) {
    SP_STEPS.push({ k: `sp:${s.key}:${L}`, s, rank, L, req: s.flat ? s.learn : s.learn + 3 * (L - 2), cost: spCost(L) });
    if (L === 8 && !s.passive && s.spec) SP_STEPS.push({ k: `sp:${s.key}:spec`, s, rank, L: 8.5, req: s.learn + 18, cost: 0, spec: true, slot: 1, slotLv: SPEC_SLOT_LV[0] });
  }
});
/* Specialty slots 2 and 3 (0.3 E7, design §9): open at effective skill level 12 / 20 (rule:specialty-slots; the generator
   checks 8 / 12 / 20), on the skills with a slot 1 line. Not milestone rows: the Skills card and Next up only (slot 3, out of
   reach inside Lv 45, the Skills card only: Q5). req only orders them (slot 2: the level of skill line 10; slot 3: after
   Lv 45). New keys sp:<skill key>:spec2 / :spec3, written only when ticked. The build's pick per slot is s.specs[slot − 1]. */
export const SP_SLOTS = [];
SP_STEPS.filter(x => x.slot === 1).forEach(x => [2, 3].forEach(n => SP_SLOTS.push({ k: `${x.k}${n}`, s: x.s, rank: x.rank, L: 10 + n / 10,
  req: n === 2 ? x.s.learn + 24 : 46, cost: 0, spec: true, slot: n, slotLv: SPEC_SLOT_LV[n - 1] })));
/* Where a slot row sits (0.8.1 F3, owner note 6, docs/research/2026-10-effective-skill-level.md): the first character level at
   which the plan, taken in milestone order, reaches the slot's effective level: the highest skill line open by then plus
   the adds (default 1) of the skill's plan board nodes in milestones at or below it (on-path rows included). Board nodes
   can open a slot before its line alone would (slot 1: learn + 18). x.at = that level, the row's place (src/packs/aion2/
   catalog.js); req stays the line-only level (slot 1 opens there with the switch specialtySlots off, rules.js). A slot the
   plan doesn't reach by Lv 45 has no at and keeps its place (slot 2 / 3 after its slot 1). */
const PLAN_ON = {};
GUIDE_GATES.forEach(g => g.items.filter(it => it.dv && it.skill).forEach(it => (PLAN_ON[it.skill] = PLAN_ON[it.skill] || []).push({ lv: g.lv, adds: it.adds })));
/* the skill's effective level at character level X if the player follows the plan */
export const planEffAt = (x, X) => { const L = Math.max(1, ...SP_STEPS.filter(y => y.s === x.s && !y.spec && y.req <= X).map(y => y.L));
  return L + (PLAN_ON[x.s.n] || []).filter(p => p.lv <= X).reduce((t, p) => t + p.adds, 0); };
SP_STEPS.filter(x => x.slot === 1).concat(SP_SLOTS).forEach(x => { for (let X = 1; X <= 45; X++) if (planEffAt(x, X) >= x.slotLv) { x.at = X; break; } });
/* Key stacks for the hold-to-run setup (K grid): row 0 fires first. Right click = damage line, by character level (RMB_ROWS:
   what right click, Quick Use 2, fires: a macro there, else its own stack; the Assassin's stack, whose second key is T). A
   macro can sit on any quickslot with a 0–3 stack (MACROS_FLAT); this drawer still draws only right click until 0.9 P22's
   build lane renders steps. Q = Shadowstrike alone (positioning, so it never fires by accident); E = opener cooldowns as they
   unlock, E_ORDER. This is the guide's suggested binding, not the game's defaults (KEYS); row order is inferred. A build
   with only the game's default keys takes every key from them instead (requirements.js rotKeys). */
/* a build with no key setup (the Ranger, 0.6 P5: RMB_ROWS empty) has an empty stack */
export const RMB_STACK = lv => ((RMB_ROWS.find(r => lv >= r.minLv) || RMB_ROWS[RMB_ROWS.length - 1]) || { skills: [] }).skills.slice();
/* Node icons by node type, cut from the player's screenshots: [not bought, bought]. Types without art yet use the crystal. */
/* Node art cut from the player's screenshots: [not bought, bought] per node colour. */
export const DV_TYPE_ICONS = {
  p: ["assets/icons/green-off2.png", "assets/icons/green-on2.png"],
  a: ["assets/icons/blue-off.png", "assets/icons/blue-on.png"],
  c: ["assets/icons/orange-off.png", "assets/icons/orange-on.png"] };
/* Live refresh while typing a cost (no re-render, so the box keeps focus). */
/* Cheapest a node can be: the node itself (rule:node-costs by node type); its path only adds to that. */
export const DV_MIN = { p: RULE_NODE_COSTS.passive, a: RULE_NODE_COSTS.active, c: RULE_NODE_COSTS.corner };
export const ST_COST = L => bandCost(RULE_SHARD_COST, L); /* shards to reach stigma level L, null past 20 (rule:stigma-shard-cost) */
