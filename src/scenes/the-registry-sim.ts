/**
 * The Registry — first slice.
 *
 * One deed, three offices, two buyers. Portland (A) is the player's office;
 * Kyoto (B) and Denver (C) hold replicas. The road can be cut. A write needs
 * a quorum of offices. Two conflicting transfers can be accepted during a
 * partition; what happens on reconnect is the whole lesson.
 */

export type Quorum = 1 | 2 | 3;
export type Conflict = 'lww' | 'reject';

export interface Policy {
  quorum: Quorum;
  conflict: Conflict;
}

export interface WorldResult {
  id: number;
  cut: string;
  aCommitted: boolean;
  cCommitted: boolean;
  safe: boolean;
  available: number;
  cost: number;
  detail: string;
}

export const WORLDS = 10;
export const DEFAULT_BUDGET = 40;

const CUTS = [
  'no cut',
  'no cut',
  'Porto–Kyoto cut',
  'Porto–Kyoto cut',
  'Porto–Denver cut',
  'Porto–Denver cut',
  'Kyoto–Denver cut',
  'Kyoto–Denver cut',
  'Porto isolated',
  'Denver isolated',
];

type Office = 'A' | 'B' | 'C';

function linked(a: Office, b: Office, cut: string): boolean {
  if (a === b) return true;
  if (cut === 'no cut') return true;
  if (cut === 'Porto isolated') return a === b || (a !== 'A' && b !== 'A');
  if (cut === 'Denver isolated') return a === b || (a !== 'C' && b !== 'C');
  if (cut === 'Porto–Kyoto cut') return !((a === 'A' && b === 'B') || (a === 'B' && b === 'A'));
  if (cut === 'Porto–Denver cut') return !((a === 'A' && b === 'C') || (a === 'C' && b === 'A'));
  if (cut === 'Kyoto–Denver cut') return !((a === 'B' && b === 'C') || (a === 'C' && b === 'B'));
  return true;
}

function reachable(office: Office, cut: string): number {
  return (['A', 'B', 'C'] as Office[]).filter((o) => linked(office, o, cut)).length;
}

export function runWorld(i: number, policy: Policy): WorldResult {
  const cut = CUTS[i % CUTS.length];
  const canPorto = policy.quorum <= reachable('A', cut);
  const canDenver = policy.quorum <= reachable('C', cut);

  let aCommitted = canPorto;
  let cCommitted = canDenver;
  let safe = true;
  let detail = '';

  if (aCommitted && cCommitted) {
    if (policy.quorum === 1) {
      // Both offices acknowledged a transfer before reconciling. Whichever
      // one loses, an acknowledged write disappears.
      safe = false;
      if (policy.conflict === 'lww') {
        detail = 'Both offices acknowledged the deed. On reconnect, last-writer-wins kept one sale and silently dropped the other acknowledged transfer.';
      } else {
        cCommitted = false;
        detail = 'Both offices acknowledged the deed. On reconnect the conflicting Denver transfer was rejected, so one acknowledged sale was lost.';
      }
    } else {
      // Two majorities intersect; only one conflicting write can commit.
      cCommitted = false;
      detail = 'Porto met its quorum and accepted. Denver refused the conflicting write because a majority was already committed.';
    }
  } else if (aCommitted) {
    detail = 'Porto met its quorum and accepted. Denver refused: no quorum on its side of the cut.';
  } else if (cCommitted) {
    detail = 'Denver met its quorum and accepted. Porto refused: no quorum on your side of the cut.';
  } else {
    detail = 'Neither office had a quorum. Both transfers were refused; the deed did not move.';
  }

  const available = (aCommitted ? 1 : 0) + (cCommitted ? 1 : 0);
  const cost = Math.round(policy.quorum * 1.2 * 10) / 10;
  return { id: i, cut, aCommitted, cCommitted, safe, available, cost, detail };
}

export function runAll(policy: Policy): WorldResult[] {
  return Array.from({ length: WORLDS }, (_, i) => runWorld(i, policy));
}

export interface Score {
  safe: number;
  available: number;
  cost: number;
  pass: boolean;
  rank: 'S' | 'A' | 'B' | 'C';
}

export function scoreWorlds(rs: WorldResult[], budget = DEFAULT_BUDGET): Score {
  const safe = rs.filter((r) => r.safe).length;
  const available = rs.reduce((n, r) => n + r.available, 0);
  const cost = Math.round(rs.reduce((n, r) => n + r.cost, 0) * 10) / 10;
  const pass = safe === WORLDS && available >= 10 && cost <= budget;
  const rank: Score['rank'] =
    safe === WORLDS && available >= 10 && cost <= 24 ? 'S' : pass ? 'A' : safe >= 9 ? 'B' : 'C';
  return { safe, available, cost, pass, rank };
}
