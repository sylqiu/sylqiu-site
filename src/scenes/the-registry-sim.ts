/**
 * Act II — The Registry.
 *
 * One currency: damage. Three records with different stakes. Each record has
 * its own quorum and conflict policy. Ten seeded worlds; the same world runs
 * a write for all three records.
 *
 * Constants are tuned so the three records have three different optimal
 * policies, including a real quorum choice:
 *   signup  q1 + silent
 *   parcel  q1 + notify
 *   deed    q2 + clerk
 */

export type RecordId = 'signup' | 'parcel' | 'deed';
export type Conflict = 'silent' | 'notify' | 'clerk';
export type Quorum = 1 | 2 | 3;

export interface RecordDef {
  id: RecordId;
  label: string;
  stakes: number;
  refundable: boolean;
}

export interface Policy {
  quorum: Quorum;
  conflict: Conflict;
}

export type Policies = Record<RecordId, Policy>;

export const RECORDS: RecordDef[] = [
  { id: 'signup', label: 'Signup list', stakes: 0.5, refundable: true },
  { id: 'parcel', label: 'Parcel order', stakes: 3, refundable: true },
  { id: 'deed', label: 'Land deed', stakes: 5, refundable: false },
];

export interface World {
  id: number;
  cut: 'none' | 'A' | 'B' | 'C' | 'all';
  two: boolean;
  origin: 'A' | 'B' | 'C' | null;
  seed: number;
}

export const WORLDS: World[] = [
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

const DIST = { A: 0, B: 6, C: 2 } as const;
const OFFICES = ['A', 'B', 'C'] as const;

export const REFUSED = 1.8;
export const CLERK = 3.9;
export const LATENCY = 0.3;

function component(origin: string, cut: World['cut']): string[] {
  if (cut === 'all' || cut === origin) return [origin];
  if (cut === 'none') return [...OFFICES];
  return OFFICES.filter((o) => o !== cut);
}

function quorumDays(origin: string, q: number, cut: World['cut']): number | null {
  const comp = component(origin, cut);
  if (comp.length < q) return null;
  const others = comp
    .filter((o) => o !== origin)
    .sort((a, b) => DIST[a as keyof typeof DIST] - DIST[b as keyof typeof DIST])
    .slice(0, q - 1);
  return Math.max(...[origin, ...others].map((o) => DIST[o as keyof typeof DIST]));
}

export interface Cell {
  outcome: string;
  damage: number;
  lost: number;
  refused: number;
  slow: number;
  days: number;
}

export interface WorldResult {
  world: World;
  cells: Record<RecordId, Cell>;
  total: number;
  lost: number;
  refused: number;
  slow: number;
}

function baseDamage(kind: string, rec: RecordDef): number {
  switch (kind) {
    case 'ok': return 0;
    case 'refused': return REFUSED;
    case 'lostSilent': return rec.stakes * 2;
    case 'lostNotified': return rec.refundable ? 1.5 + 0.2 * rec.stakes : 0.8 * rec.stakes;
    case 'clerk': return CLERK;
    default: throw new Error(kind);
  }
}

function add(parts: { lost: number; refused: number; slow: number }, kind: string, rec: RecordDef, days: number) {
  if (kind === 'refused') {
    parts.refused += REFUSED;
    return;
  }
  if (kind === 'ok') {
    parts.slow += LATENCY * days;
    return;
  }
  parts.lost += baseDamage(kind, rec);
  parts.slow += LATENCY * days;
}

export function evaluateRecord(rec: RecordDef, policy: Policy, world: World): Cell {
  const parts = { lost: 0, refused: 0, slow: 0 };
  const origins: string[] = world.two ? ['A', 'C'] : [world.origin ?? 'A'];
  const days = origins.map((o) => quorumDays(o, policy.quorum, world.cut));
  let outcome = 'ok';

  if (!world.two) {
    if (days[0] === null) {
      add(parts, 'refused', rec, 0);
      outcome = 'refused';
    } else {
      add(parts, 'ok', rec, days[0]);
      outcome = 'ok';
    }
  } else {
    const [a, c] = days;
    if (a === null && c === null) {
      add(parts, 'refused', rec, 0);
      add(parts, 'refused', rec, 0);
      outcome = 'both refused';
    } else if (a !== null && c !== null) {
      const d = Math.max(a, c);
      const kind = policy.conflict === 'silent' ? 'lostSilent' : policy.conflict === 'notify' ? 'lostNotified' : 'clerk';
      add(parts, kind, rec, d);
      outcome = kind;
    } else {
      const d = a ?? c!;
      add(parts, 'refused', rec, 0);
      add(parts, 'ok', rec, d);
      outcome = 'one refused';
    }
  }

  return {
    outcome,
    damage: Math.round((parts.lost + parts.refused + parts.slow) * 10) / 10,
    lost: Math.round(parts.lost * 10) / 10,
    refused: Math.round(parts.refused * 10) / 10,
    slow: Math.round(parts.slow * 10) / 10,
    days: Math.max(...days.filter((d): d is number => d !== null), 0),
  };
}

export function evaluate(policies: Policies): { worlds: WorldResult[]; total: number; lost: number; refused: number; slow: number; perRecord: Record<RecordId, number> } {
  const perRecord: Record<RecordId, number> = { signup: 0, parcel: 0, deed: 0 };
  const worlds = WORLDS.map((world) => {
    const cells = {} as Record<RecordId, Cell>;
    let total = 0;
    let lost = 0;
    let refused = 0;
    let slow = 0;
    for (const rec of RECORDS) {
      const cell = evaluateRecord(rec, policies[rec.id], world);
      cells[rec.id] = cell;
      total += cell.damage;
      lost += cell.lost;
      refused += cell.refused;
      slow += cell.slow;
      perRecord[rec.id] += cell.damage;
    }
    return { world, cells, total: Math.round(total * 10) / 10, lost, refused, slow };
  });
  const total = Math.round(worlds.reduce((n, w) => n + w.total, 0) * 10) / 10;
  const lost = Math.round(worlds.reduce((n, w) => n + w.lost, 0) * 10) / 10;
  const refused = Math.round(worlds.reduce((n, w) => n + w.refused, 0) * 10) / 10;
  const slow = Math.round(worlds.reduce((n, w) => n + w.slow, 0) * 10) / 10;
  for (const id of Object.keys(perRecord) as RecordId[]) perRecord[id] = Math.round(perRecord[id] * 10) / 10;
  return { worlds, total, lost, refused, slow, perRecord };
}

const ALL_POLICIES: Policy[] = [];
for (const quorum of [1, 2, 3] as Quorum[]) for (const conflict of ['silent', 'notify', 'clerk'] as Conflict[]) ALL_POLICIES.push({ quorum, conflict });

let optimumCache: number | null = null;

export function optimumDamage(): number {
  if (optimumCache !== null) return optimumCache;
  let sum = 0;
  for (const rec of RECORDS) {
    let best = Infinity;
    for (const policy of ALL_POLICIES) {
      const p: Policies = { signup: policy, parcel: policy, deed: policy };
      const d = evaluate(p).perRecord[rec.id];
      if (d < best) best = d;
    }
    sum += best;
  }
  optimumCache = Math.round(sum * 10) / 10;
  return optimumCache;
}

export type Rank = 'S' | 'A' | 'B' | 'C';

export function rankFor(total: number): Rank {
  const opt = optimumDamage();
  const rel = opt > 0 ? (total - opt) / opt : 0;
  if (rel <= 0.1) return 'S';
  if (rel <= 0.3) return 'A';
  if (rel <= 0.5) return 'B';
  return 'C';
}

export function defaultPolicies(): Policies {
  return {
    signup: { quorum: 2, conflict: 'notify' },
    parcel: { quorum: 2, conflict: 'notify' },
    deed: { quorum: 2, conflict: 'notify' },
  };
}
