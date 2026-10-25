// Day-level invariants for The Letters.
// Run: node --experimental-strip-types scripts/verify-letters.mjs
import { createDay, morningPlan, SITUATIONS, BUDGETS } from '../src/scenes/the-letters-sim.ts';

let fails = 0;
const ok = (cond, msg) => {
  console.log((cond ? 'PASS  ' : 'FAIL  ') + msg);
  if (!cond) fails++;
};

function sweep(day, rules) {
  let kept = 0;
  let cost = 0;
  let dup = 0;
  let lost = 0;
  for (let i = 0; i < SITUATIONS; i++) {
    const d = createDay({ scenario: day, rules, plan: morningPlan(day, i) });
    const s = d.runAll();
    kept += s.promise ? 1 : 0;
    cost += s.cost;
    dup += s.dupes;
    lost += s.lost;
  }
  return { kept, cost: Math.round(cost * 10) / 10, dup, lost };
}

const minimal = { numbering: 'serial', receipts: 'sign', retry: 'never', ledger: 'off' };
const full = { numbering: 'serial', receipts: 'sign', retry: 'tuned', ledger: 'on' };
const none = { numbering: 'none', receipts: 'none', retry: 'never', ledger: 'off' };

// Day 1 is calm. A book with receipts + numbers must be perfect and affordable.
const PASS = Math.ceil(SITUATIONS * 0.85);
const d1 = sweep(0, minimal);
ok(d1.kept === SITUATIONS, 'day 1, calm: minimal competent book keeps ' + SITUATIONS + '/' + SITUATIONS + ' (got ' + d1.kept + ')');
ok(d1.cost <= BUDGETS[0], 'day 1, calm: minimal book is inside budget (' + d1.cost + ' / ' + BUDGETS[0] + ')');

// The promise requires a signed slip, so no receipts cannot pass.
ok(sweep(0, none).kept === 0, 'day 1, no receipts: promise fails in every morning');

// Day 2 introduces loss: no resend loses mornings, a round-trip timeout recovers.
const d2none = sweep(1, { ...minimal, retry: 'never' });
ok(d2none.kept < SITUATIONS, 'day 2, never resend: at least one morning breaks (' + d2none.kept + '/' + SITUATIONS + ')');
const d2 = sweep(1, { ...minimal, retry: 'tuned' });
ok(d2.kept >= SITUATIONS - 1, 'day 2, round-trip timeout: recovers nearly all (' + d2.kept + '/' + SITUATIONS + ')');
ok(d2.cost <= BUDGETS[1], 'day 2, round-trip timeout: inside budget (' + d2.cost + ' / ' + BUDGETS[1] + ')');

// Day 3 introduces lost slips: without a ledger the resend duplicates.
const d3bad = sweep(2, { ...minimal, retry: 'quick', ledger: 'off' });
ok(d3bad.dup > 0, 'day 3, no ledger: duplicates appear (' + d3bad.dup + ')');
const d3good = sweep(2, { ...minimal, retry: 'quick', ledger: 'on' });
ok(d3good.dup === 0, 'day 3, ledger on: duplicates are dropped (' + d3good.dup + ')');
ok(d3good.kept >= PASS, 'day 3, ledger on: promise holds (' + d3good.kept + '/' + SITUATIONS + ')');
ok(d3good.cost <= BUDGETS[2], 'day 3, ledger on: inside budget (' + d3good.cost + ' / ' + BUDGETS[2] + ')');

// Day 4 lengthens the route: the impatient timeout duplicates heavily.
const d4bad = sweep(3, { ...minimal, retry: 'quick', ledger: 'off' });
ok(d4bad.dup >= SITUATIONS, 'day 4, impatient timeout: copies pile up (' + d4bad.dup + ')');
const d4good = sweep(3, { ...minimal, retry: 'quick', ledger: 'on' });
ok(d4good.kept >= PASS, 'day 4, ledger on: promise mostly holds (' + d4good.kept + '/' + SITUATIONS + ')');
ok(d4good.cost <= BUDGETS[3], 'day 4, ledger on: inside budget (' + d4good.cost + ' / ' + BUDGETS[3] + ')');

// The full book must also survive day 1 (it is allowed to cost more).
ok(sweep(0, full).kept === SITUATIONS, 'day 1, full book: ' + SITUATIONS + '/' + SITUATIONS);

console.log(fails ? '\n' + fails + ' failure(s)' : '\nall checks passed');
process.exit(fails ? 1 : 0);
