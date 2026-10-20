/* Daevanion path costs (0.8.1 F1, docs/research/2026-10-assassin-board-costs.md §4): a node's cost goes by its colour
   (board-nodes.json `cost`: common 1, rare 2, legend 3, unique 4, Start 0), and a node can be bought only next to one
   already owned (4-neighbour grid, from Start). A plan row costs the cheapest path from everything the earlier rows
   bought; that path is then owned. Two cheapest paths can own different nodes, so the next row's cost can depend on the
   one taken: checkPlanCosts follows every cheapest path (states deduplicated by the set they own) and keeps those that
   give each row its expected cost. A row no cheapest path matches is reported with what the paths give, and the walk
   goes on from all of them. */
const MAX_STATES = 20000;

/* every cheapest path from `owned` to `target`: [cost, [[node ids bought]…]] */
function cheapest(board, owned, target) {
  const dist = new Map(), done = new Set();
  for (const id of owned) dist.set(id, 0);
  for (;;) {
    let u = null;
    for (const [id, d] of dist) if (!done.has(id) && (u === null || d < dist.get(u))) u = id;
    if (u === null) break;
    done.add(u);
    for (const m of board.next.get(u)) {
      const d = dist.get(u) + (owned.has(m.id) ? 0 : m.cost);
      if (!dist.has(m.id) || d < dist.get(m.id)) dist.set(m.id, d);
    }
  }
  if (!dist.has(target)) throw new Error('board path: no path to ' + target);
  if (owned.has(target)) return [0, [[]]];
  /* walk back along tight edges (dist[u] + cost(v) = dist[v]) until an owned node */
  const paths = [], walk = (v, acc) => {
    if (paths.length > MAX_STATES) throw new Error('board path: too many cheapest paths to ' + target);
    for (const u of board.next.get(v)) {
      if (!dist.has(u.id) || dist.get(u.id) + board.byId.get(v).cost !== dist.get(v)) continue;
      if (owned.has(u.id)) paths.push([v, ...acc]); else walk(u.id, [v, ...acc]);
    }
  };
  walk(target, []);
  return [dist.get(target), paths];
}

/* boardNodes: one board's nodes; rows: [{ node, cost? }] in plan order (an anyNode row passes its first node, the guide's
   pick). Returns [[costs the cheapest paths give]…], one per row. */
export function checkPlanCosts(boardNodes, rows) {
  const byId = new Map(boardNodes.map(n => [n.id, n])), at = new Map(boardNodes.map(n => [`${n.row},${n.col}`, n]));
  const next = new Map(boardNodes.map(n => [n.id, [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dr, dc]) => at.get(`${n.row + dr},${n.col + dc}`)).filter(Boolean)]));
  const board = { byId, next };
  const start = boardNodes.filter(n => n.type === 'start');
  if (start.length !== 1) throw new Error('board path: a board has one Start node');
  let states = [new Set([start[0].id])];
  return rows.map(row => {
    const out = [];   /* [cost, owned after] */
    for (const owned of states) { const [c, paths] = cheapest(board, owned, row.node); for (const p of paths) out.push([c, new Set([...owned, ...p])]); }
    const keep = out.some(o => o[0] === row.cost) ? out.filter(o => o[0] === row.cost) : out;
    const seen = new Set();
    states = keep.filter(o => { const k = [...o[1]].sort().join(); if (seen.has(k)) return false; seen.add(k); return true; }).map(o => o[1]);
    if (states.length > MAX_STATES) throw new Error('board path: too many states');
    return [...new Set(out.map(o => o[0]))].sort((a, b) => a - b);
  });
}
