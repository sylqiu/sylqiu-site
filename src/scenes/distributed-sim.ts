/**
 * Deterministic discrete-event simulator for the Ledger workload.
 *
 * Unit 0 of the distributed-systems course: one fixed workload, four pre-built
 * designs, one fault model. Same seed + same design => identical schedule, so a
 * failure can always be replayed.
 *
 * Pure logic, no DOM. The scene in `distributed-lab.ts` is the only consumer.
 */

export interface Design {
  id: string;
  name: string;
  tag: string;
  assumption: string;
  mechanism: string;
  fixes: string;
  price: string;
  stableId: boolean;
  dedup: boolean;
  backoff: boolean;
  timeout: number;
  deadline?: number;
  maxAttempts: number;
}

export interface Faults {
  reqDrop: number;
  respDrop: number;
  dup: number;
}

export interface SimOptions {
  seed?: number;
  design?: string;
  faults?: Partial<Faults>;
  clients?: number;
  opsPerClient?: number;
  recordTrace?: boolean;
}

export interface TraceEvent {
  t: number;
  seq: number;
  kind: string;
  node: string;
  text: string;
}

export interface Summary {
  design: string;
  seed: number;
  ops: number;
  sent: number;
  applied: number;
  dedupHits: number;
  dupEffects: number;
  dupOps: number;
  completed: number;
  failed: number;
  dedupTable: number;
  p50: number;
  p99: number;
  total: number;
  initialTotal: number;
  conserved: boolean;
  doubleBooked: number;
  done: number;
  ms: number;
}

interface Op {
  id: string;
  kind: 'transfer' | 'reserve';
  label: string;
  from: string;
  to: string;
  amt: number;
  seat: number;
}

interface Cursor {
  op: Op;
  attempts: number;
  done: boolean;
  firstAt: number;
  deadlineAt: number;
  reqId: string | null;
}

interface Client {
  id: string;
  idx: number;
  ops: Op[];
  current: Cursor | null;
}

interface Timer {
  t: number;
  seq: number;
  fn: () => void;
}

export const DESIGNS: Record<string, Design> = {
  A: {
    id: 'A',
    name: 'Retry until it works',
    tag: 'naive',
    assumption: 'A lost reply means the request never happened.',
    mechanism: 'Resend every 150 ms, forever. New id each time.',
    fixes: 'Nothing. This is what everyone writes first.',
    price: 'One duplicate effect per lost reply.',
    stableId: false,
    dedup: false,
    backoff: false,
    timeout: 150,
    maxAttempts: 40,
  },
  B: {
    id: 'B',
    name: 'Retry with backoff',
    tag: 'plausible',
    assumption: 'Same as A, but polite about it.',
    mechanism: 'Backoff 150 ms → 800 ms. Still a new id.',
    fixes: 'Retry storms. Not duplicates.',
    price: 'Higher tail latency; duplicates unchanged.',
    stableId: false,
    dedup: false,
    backoff: true,
    timeout: 150,
    maxAttempts: 40,
  },
  C: {
    id: 'C',
    name: 'Stable id + server dedup',
    tag: 'correct',
    assumption: 'The client can name a request; the server remembers names.',
    mechanism: 'One id per operation; the server skips ids it has seen.',
    fixes: 'Duplicate effects.',
    price: 'Unbounded dedup table; retries still unbounded.',
    stableId: true,
    dedup: true,
    backoff: false,
    timeout: 150,
    maxAttempts: 40,
  },
  D: {
    id: 'D',
    name: 'Idempotency key + cached reply',
    tag: 'production',
    assumption: 'The server also remembers the reply it sent.',
    mechanism: 'Stable id + cached reply; 800 ms deadline, 6 attempts.',
    fixes: 'Duplicate effects; clients stuck on a lost reply.',
    price: 'Real deadline failures; the table needs expiry.',
    stableId: true,
    dedup: true,
    backoff: true,
    timeout: 150,
    deadline: 800,
    maxAttempts: 6,
  },
};

const ACCOUNTS = ['alice', 'bob', 'carol', 'dave', 'erin'];
const MAX_STEPS = 400000;

function mulberry32(a: number): () => number {
  a = a >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSim(opts: SimOptions = {}) {
  const seed = (opts.seed ?? 1) >>> 0;
  const designId = opts.design ?? 'A';
  const D = DESIGNS[designId];
  if (!D) throw new Error('unknown design ' + designId);

  const f: Faults = {
    reqDrop: opts.faults?.reqDrop ?? 0.05,
    respDrop: opts.faults?.respDrop ?? 0.05,
    dup: opts.faults?.dup ?? 0.02,
  };
  const clientsCount = opts.clients ?? 3;
  const opsPerClient = opts.opsPerClient ?? 20;
  const recordTrace = opts.recordTrace !== false;

  const rngNet = mulberry32(seed ^ 0x9e3779b9);
  const rngWl = mulberry32((seed * 2654435761) >>> 0);

  function makeOp(i: number): Op {
    if (i % 3 === 0) {
      // one distinct seat per operation: any second booking of it is a bug
      const seat = 100 + i;
      return {
        id: 'o' + i,
        kind: 'reserve',
        seat,
        from: '',
        to: '',
        amt: 0,
        label: 'reserve(seat ' + seat + ')',
      };
    }
    let a = Math.floor(rngWl() * ACCOUNTS.length);
    let b = Math.floor(rngWl() * (ACCOUNTS.length - 1));
    if (b >= a) b += 1;
    const amt = 1 + Math.floor(rngWl() * 5);
    return {
      id: 'o' + i,
      kind: 'transfer',
      from: ACCOUNTS[a],
      to: ACCOUNTS[b],
      amt,
      seat: 0,
      label: 'transfer(' + ACCOUNTS[a] + '→' + ACCOUNTS[b] + ', $' + amt + ')',
    };
  }

  const allOps: Op[] = [];
  for (let i = 0; i < clientsCount * opsPerClient; i++) allOps.push(makeOp(i));

  const clients: Client[] = [];
  for (let c = 0; c < clientsCount; c++) {
    clients.push({
      id: 'c' + (c + 1),
      idx: 0,
      ops: allOps.filter((_, i) => i % clientsCount === c),
      current: null,
    });
  }

  const balances: Record<string, number> = {};
  ACCOUNTS.forEach((a) => (balances[a] = 100));
  const initialTotal = ACCOUNTS.length * 100;
  const seats: Record<number, number> = {};
  const effects: Record<string, number> = {};
  const server = { seen: new Map<string, { ok: boolean }>(), applied: 0, dedupHits: 0 };

  const metrics = { sent: 0, applied: 0, dedupHits: 0, completed: 0, failed: 0, latencies: [] as number[] };
  const trace: TraceEvent[] = [];
  let now = 0;
  let seq = 0;
  const q: Timer[] = [];

  function insert(ev: Timer) {
    let lo = 0;
    let hi = q.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const o = q[mid];
      if (o.t < ev.t || (o.t === ev.t && o.seq < ev.seq)) lo = mid + 1;
      else hi = mid;
    }
    q.splice(lo, 0, ev);
  }
  function schedule(dt: number, fn: () => void) {
    insert({ t: now + Math.max(0, dt), seq: seq++, fn });
  }
  function ev(kind: string, node: string, text: string) {
    if (!recordTrace) return;
    trace.push({ t: now, seq: seq++, kind, node, text });
  }

  function applyOp(op: Op) {
    effects[op.id] = (effects[op.id] || 0) + 1;
    server.applied++;
    metrics.applied++;
    if (op.kind === 'transfer') {
      balances[op.from] -= op.amt;
      balances[op.to] += op.amt;
    } else {
      seats[op.seat] = (seats[op.seat] || 0) + 1;
    }
  }

  function allDone(): boolean {
    return clients.every((c) => c.idx >= c.ops.length);
  }

  function nextClientOp(client: Client) {
    if (client.idx >= client.ops.length) {
      client.current = null;
      return;
    }
    const op = client.ops[client.idx];
    const cur: Cursor = {
      op,
      attempts: 0,
      done: false,
      firstAt: now,
      deadlineAt: now + (D.deadline ?? Infinity),
      reqId: null,
    };
    client.current = cur;
    attempt(client, cur);
  }

  function complete(client: Client, cur: Cursor, status: 'ok' | 'timeout' | 'stuck') {
    if (cur.done) return;
    cur.done = true;
    const lat = now - cur.firstAt;
    if (status === 'ok') {
      metrics.completed++;
      metrics.latencies.push(lat);
      ev('done', 'client', cur.op.label + ' done in ' + Math.round(lat) + ' ms, ' + cur.attempts + ' attempt(s)');
    } else if (status === 'timeout') {
      metrics.failed++;
      ev('timeout', 'client', cur.op.label + ' gave up at the 800 ms deadline');
    } else {
      metrics.failed++;
      ev('timeout', 'client', cur.op.label + ' stuck after ' + cur.attempts + ' attempts');
    }
    client.idx++;
    schedule(4 + rngNet() * 10, () => nextClientOp(client));
  }

  function attempt(client: Client, cur: Cursor) {
    if (cur.done) return;
    cur.attempts++;
    if (cur.attempts > D.maxAttempts) {
      complete(client, cur, 'stuck');
      return;
    }
    const reqId = D.stableId ? cur.op.id : cur.op.id + '#a' + cur.attempts;
    cur.reqId = reqId;
    metrics.sent++;
    ev('send', 'client', '→ ' + cur.op.label + '  [' + reqId + ']');

    const delay = 20 + rngNet() * 40;
    if (rngNet() < f.reqDrop) {
      ev('drop', 'net', 'request ' + reqId + ' lost in flight');
    } else {
      if (rngNet() < f.dup) {
        ev('dup', 'net', 'request ' + reqId + ' duplicated by the network');
        schedule(delay + 18, () => deliverReq({ op: cur.op, reqId }, client, cur));
      }
      schedule(delay, () => deliverReq({ op: cur.op, reqId }, client, cur));
    }

    const wait = D.backoff ? Math.min(800, D.timeout * Math.pow(2, cur.attempts - 1)) : D.timeout;
    schedule(wait, () => {
      if (cur.done) return;
      if (D.deadline && now >= cur.deadlineAt) {
        complete(client, cur, 'timeout');
        return;
      }
      ev('retry', 'client', 'no reply after ' + Math.round(wait) + ' ms → retry #' + (cur.attempts + 1));
      attempt(client, cur);
    });
  }

  function deliverReq(msg: { op: Op; reqId: string }, client: Client, cur: Cursor) {
    ev('recv', 'server', 'req ' + msg.reqId);
    if (D.dedup && server.seen.has(msg.reqId)) {
      server.dedupHits++;
      metrics.dedupHits++;
      ev('dedup', 'server', 'already applied ' + msg.reqId + ' → resend cached reply');
      sendReply(msg.reqId, client, cur);
      return;
    }
    applyOp(msg.op);
    if (D.dedup) server.seen.set(msg.reqId, { ok: true });
    ev('apply', 'server', msg.op.label + ' applied  (effect #' + effects[msg.op.id] + ')');
    sendReply(msg.reqId, client, cur);
  }

  function sendReply(reqId: string, client: Client, cur: Cursor) {
    const delay = 20 + rngNet() * 40;
    if (rngNet() < f.respDrop) {
      ev('drop', 'net', 'reply for ' + reqId + ' lost in flight');
      return;
    }
    if (rngNet() < f.dup) {
      ev('dup', 'net', 'reply for ' + reqId + ' duplicated');
      schedule(delay + 18, () => deliverResp(reqId, client, cur));
    }
    schedule(delay, () => deliverResp(reqId, client, cur));
  }

  function deliverResp(reqId: string, client: Client, cur: Cursor) {
    if (cur.done) {
      ev('recv', 'client', 'late reply ' + reqId + ' ignored');
      return;
    }
    ev('recv', 'client', '← ok ' + reqId);
    complete(client, cur, 'ok');
  }

  function stepEvent(): boolean {
    if (!q.length || allDone()) return false;
    const e = q.shift()!;
    now = e.t;
    e.fn();
    return true;
  }

  function runUntil(t: number): number {
    let steps = 0;
    while (q.length && q[0].t <= t && !allDone() && steps < MAX_STEPS) {
      stepEvent();
      steps++;
    }
    if (allDone()) q.length = 0;
    return now;
  }

  function runAll(): Summary {
    let steps = 0;
    while (q.length && !allDone() && steps < MAX_STEPS) {
      stepEvent();
      steps++;
    }
    q.length = 0;
    return summary();
  }

  function pct(arr: number[], p: number): number {
    if (!arr.length) return 0;
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
  }

  function summary(): Summary {
    const uniq = Object.keys(effects).length;
    const dupEffects = Object.values(effects).reduce((a, b) => a + b, 0) - uniq;
    const dupOps = Object.values(effects).filter((n) => n > 1).length;
    const total = Object.values(balances).reduce((a, b) => a + b, 0);
    const doubleBooked = Object.values(seats).filter((n) => n > 1).length;
    return {
      design: designId,
      seed,
      ops: allOps.length,
      sent: metrics.sent,
      applied: metrics.applied,
      dedupHits: metrics.dedupHits,
      dupEffects,
      dupOps,
      completed: metrics.completed,
      failed: metrics.failed,
      dedupTable: server.seen.size,
      p50: Math.round(pct(metrics.latencies, 50)),
      p99: Math.round(pct(metrics.latencies, 99)),
      total,
      initialTotal,
      conserved: total === initialTotal,
      doubleBooked,
      done: metrics.completed + metrics.failed,
      ms: Math.round(now),
    };
  }

  return {
    get now() {
      return now;
    },
    get trace() {
      return trace;
    },
    get done() {
      return allDone();
    },
    get server() {
      return server;
    },
    stepEvent,
    runUntil,
    runAll,
    summary,
    start: () => {
      clients.forEach((c) => schedule(0, () => nextClientOp(c)));
    },
  };
}

export type Sim = ReturnType<typeof createSim>;
