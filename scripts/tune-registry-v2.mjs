// Tuning harness for the Act II "damage" model.
// Run: node scripts/tune-registry-v2.mjs

const RECORDS = [
  { id: 'signup', label: 'Signup list', stakes: 0.5, refundable: true },
  { id: 'parcel', label: 'Parcel order', stakes: 3, refundable: true },
  { id: 'deed', label: 'Land deed', stakes: 5, refundable: false },
];

const WORLDS = [
  { id: 0, cut: 'none', two: true, origin: null, seed: 1 },
  { id: 1, cut: 'none', two: false, origin: 'A', seed: 2 },
  { id: 2, cut: 'A', two: true, origin: null, seed: 3 },
  { id: 3, cut: 'B', two: false, origin: 'B', seed: 4 },
  { id: 4, cut: 'C', two: true, origin: null, seed: 5 },
  { id: 5, cut: 'all', two: true, origin: null, seed: 6 },
  { id: 6, cut: 'B', two: false, origin: 'A', seed: 7 },
  { id: 7, cut: 'none', two: true, origin: null, seed: 8 },
  { id: 8, cut: 'A', two: false, origin: 'C', seed: 9 },
  { id: 9, cut: 'C', two: true, origin: null, seed: 10 },
];

const REFUSED = Number(process.env.REFUSED ?? 2);
const CLERK = Number(process.env.CLERK ?? 3);
const DIST = { A: 0, B: 6, C: 2 };
const OFFICES = ['A', 'B', 'C'];

function component(origin, cut) {
  if (cut === 'all' || cut === origin) return [origin];
  if (cut === 'none') return [...OFFICES];
  return OFFICES.filter((o) => o !== cut);
}

function quorumDays(origin, q, cut) {
  const comp = component(origin, cut);
  if (comp.length < q) return null;
  const others = comp.filter((o) => o !== origin).sort((a, b) => DIST[a] - DIST[b]).slice(0, q - 1);
  return Math.max(...[origin, ...others].map((o) => DIST[o]));
}

function baseDamage(kind, rec) {
  switch (kind) {
    case 'ok': return 0;
    case 'refused': return REFUSED;
    case 'lostSilent': return rec.stakes * 2;
    case 'lostNotified': return rec.refundable ? 1.5 + 0.2 * rec.stakes : 0.8 * rec.stakes;
    case 'clerk': return CLERK;
    default: throw new Error(kind);
  }
}

function add(parts, kind, rec, days) {
  if (kind === 'refused') { parts.refused += REFUSED; return; }
  if (kind === 'ok') { parts.slow += 0.3 * days; return; }
  parts.lost += baseDamage(kind, rec);
  parts.slow += 0.3 * days;
}

function evalRecord(rec, policy, world) {
  const parts = { lost: 0, refused: 0, slow: 0 };
  const origins = world.two ? ['A', 'C'] : [world.origin];
  const days = origins.map((o) => quorumDays(o, policy.quorum, world.cut));

  if (!world.two) {
    if (days[0] === null) add(parts, 'refused', rec, 0);
    else add(parts, 'ok', rec, days[0]);
    return { ...parts, damage: parts.lost + parts.refused + parts.slow, outcome: days[0] === null ? 'refused' : 'ok' };
  }

  const [a, c] = days;
  if (a === null && c === null) {
    add(parts, 'refused', rec, 0);
    add(parts, 'refused', rec, 0);
    return { ...parts, damage: parts.lost + parts.refused + parts.slow, outcome: 'refused' };
  }
  if (a !== null && c !== null) {
    const d = Math.max(a, c);
    const kind = policy.conflict === 'silent' ? 'lostSilent' : policy.conflict === 'notify' ? 'lostNotified' : 'clerk';
    add(parts, kind, rec, d);
    return { ...parts, damage: parts.lost + parts.refused + parts.slow, outcome: kind };
  }
  const d = a ?? c;
  add(parts, 'refused', rec, 0);
  add(parts, 'ok', rec, d);
  return { ...parts, damage: parts.lost + parts.refused + parts.slow, outcome: 'refused+ok' };
}

const POLICIES = [];
for (const quorum of [1, 2, 3]) for (const conflict of ['silent', 'notify', 'clerk']) POLICIES.push({ quorum, conflict });

function cost(rec, policy) {
  return WORLDS.reduce((n, w) => n + evalRecord(rec, policy, w).damage, 0);
}

const results = RECORDS.map((rec) => {
  const scored = POLICIES.map((p) => ({ policy: p, cost: cost(rec, p) })).sort((a, b) => a.cost - b.cost);
  return { rec, best: scored[0], all: scored };
});

for (const { rec, best, all } of results) {
  console.log(rec.label, 'stakes', rec.stakes, 'refundable', rec.refundable);
  for (const x of all.slice(0, 5)) console.log(' ', x.cost.toFixed(2), 'q' + x.policy.quorum, x.policy.conflict);
  console.log('  BEST', best.cost.toFixed(2), 'q' + best.policy.quorum, best.policy.conflict);
}

const bestPolicies = results.map((r) => r.best.policy);
const key = (p) => 'q' + p.quorum + '-' + p.conflict;
console.log('\nBest per record:', results.map((r) => r.rec.id + '=' + key(r.best.policy)).join(', '));
console.log('Distinct best policies:', new Set(bestPolicies.map(key)).size);
for (const p of POLICIES) {
  const wins = results.filter((r) => key(r.best.policy) === key(p)).length;
  if (wins) console.log('  ', key(p), 'wins', wins);
}

const unique = new Set(bestPolicies.map(key)).size;
if (unique < 3) {
  console.error('\nFAIL: expected three distinct optimal policies');
  process.exit(1);
}
console.log('\nPASS: three distinct optimal policies');
