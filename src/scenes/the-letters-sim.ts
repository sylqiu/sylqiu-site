/**
 * The Letters — world model.
 *
 * Three friends, three post offices, one rule set per day. Deterministic:
 * the same scenario + rules always produce the same day, so a failure can be
 * replayed and explained. No DOM.
 */

export interface City {
  id: string;
  friend: string;
  city: string;
  x: number;
  y: number;
  color: string;
}

export interface RuleOption {
  id: string;
  label: string;
  cost: number;
  note: string;
}

export interface Scenario {
  day: number;
  title: string;
  blurb: string;
  deadline: number;
  remote: boolean;
  lostBags: { letter: number; attempt: number }[];
  lostReceipts: { letter: number }[];
}

export interface Rules {
  numbering: string;
  receipts: string;
  retry: string;
  ledger: string;
  route: string;
}

export interface Attempt {
  id: string;
  letterId: string;
  number: string | null;
  from: string;
  to: string;
  attempt: number;
  start: number;
  delivered: boolean;
  status: 'moving' | 'delivered' | 'dropped' | 'lost';
  deliverAt: number;
  lost: boolean;
  lostAt: number;
  endedAt?: number;
}

export interface Letter {
  id: string;
  seq: number;
  from: string;
  to: string;
  label: string;
  number: string | null;
  attempts: Attempt[];
  acked: boolean;
  ackAt: number | null;
  /** The first slip for this letter goes missing; a later one may arrive. */
  slipLost: boolean;
}

export interface DayEvent {
  t: number;
  kind: string;
  text: string;
  letter?: string;
  attempt?: string;
}

export interface Row {
  id: string;
  label: string;
  number: string | null;
  delivered: number;
  first: number | null;
  onTime: boolean;
  acked: boolean;
  lost: boolean;
}

export interface DaySummary {
  rows: Row[];
  exact: number;
  onTime: number;
  dupes: number;
  lost: number;
  total: number;
  cost: number;
  attempts: number;
  promise: boolean;
}

export const CITIES: Record<string, City> = {
  A: { id: 'A', friend: 'Alice', city: 'Porto', x: 175, y: 620, color: '#58a6ff' },
  B: { id: 'B', friend: 'Bob', city: 'Kyoto', x: 390, y: 300, color: '#3fb950' },
  C: { id: 'C', friend: 'Carol', city: 'Denver', x: 610, y: 600, color: '#d2a8ff' },
};

export const RULES: Record<string, RuleOption[]> = {
  numbering: [
    { id: 'none', label: 'No number', cost: 0, note: 'Cheapest. Nothing can be matched to anything.' },
    { id: 'date', label: 'Date stamp', cost: 0.1, note: 'One stamp for the whole day — not unique.' },
    { id: 'serial', label: 'Sender + serial', cost: 0.3, note: 'A-01, A-02… unique per letter.' },
  ],
  receipts: [
    { id: 'none', label: 'No receipt', cost: 0, note: 'The sender never learns what happened.' },
    { id: 'sign', label: 'Signature back', cost: 0.4, note: 'The receiver signs; the slip returns.' },
  ],
  retry: [
    { id: 'never', label: 'Never resend', cost: 0, note: 'One attempt, whatever happens.' },
    { id: 'tuned', label: 'Round-trip timeout', cost: 0.6, note: 'Resend once, but only after the route could have delivered and returned.' },
    { id: 'quick', label: 'Fixed 6.5-day timeout', cost: 1.1, note: 'Impatient. Right for a 2-day route; wrong when the route grows.' },
  ],
  ledger: [
    { id: 'off', label: 'No ledger', cost: 0, note: 'Every copy that arrives is delivered.' },
    { id: 'on', label: 'Ledger of numbers', cost: 0.3, note: 'Drops a copy whose number is already delivered.' },
  ],
};

export const SCENARIOS: Scenario[] = [
  {
    day: 1,
    title: 'A calm day',
    blurb: 'Three letters, three direct routes, nothing goes wrong. Learn what the rules cost.',
    deadline: 5,
    remote: false,
    lostBags: [],
    lostReceipts: [],
  },
  {
    day: 2,
    title: 'A sack goes missing',
    blurb: 'One courier bag never arrives. The letter inside is gone — not delayed, gone.',
    deadline: 12,
    remote: false,
    lostBags: [{ letter: 1, attempt: 1 }],
    lostReceipts: [],
  },
  {
    day: 3,
    title: 'The receipt never arrives',
    blurb: 'The letter arrived. The signed slip did not. The sender cannot tell the difference.',
    deadline: 12,
    remote: false,
    lostBags: [],
    lostReceipts: [{ letter: 1 }],
  },
  {
    day: 4,
    title: 'Bob moves to the mountains',
    blurb: 'Bob is four days away now. Every slip takes the slow road back.',
    deadline: 14,
    remote: true,
    lostBags: [],
    lostReceipts: [],
  },
];

// One day = 10 mornings drawn from a distribution. The player commits one
// rulebook; the morning decides which sacks and slips go missing.
export const SITUATIONS = 10;
export const BUDGETS = [60, 75, 105, 150];

const PROFILES = [
  // Day 1 is the tutorial: no sacks lost, no slips lost. The lesson is cost,
  // not failure. Loss starts on day 2.
  { sack: 0, slip: 0, storm: 0 },
  { sack: 0.07, slip: 0, storm: 0 },
  { sack: 0.05, slip: 0.2, storm: 0.05 },
  { sack: 0.05, slip: 0.1, storm: 0.25 },
];

export interface Plan {
  lostBags: { letter: number; attempt: number }[];
  lostReceipts: { letter: number }[];
  delay: number;
}

function morningRng(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function morningPlan(scenarioIdx: number, morning: number): Plan {
  const p = PROFILES[scenarioIdx];
  // Ten mornings sample the twenty-morning space at even indices, keeping the
  // lost bags and slips that make days 2–4 teach something.
  const sample = morning * 2;
  const r = morningRng((scenarioIdx + 1) * 7919 + sample * 104729 + 17);
  const lostBags: { letter: number; attempt: number }[] = [];
  const lostReceipts: { letter: number }[] = [];
  for (let letter = 1; letter <= 3; letter++) {
    if (r() < p.sack) lostBags.push({ letter, attempt: 1 });
    if (r() < p.slip) lostReceipts.push({ letter });
  }
  const delay = r() < p.storm ? 2 : 0;
  return { lostBags, lostReceipts, delay };
}

const SEND_AT = [0.1, 0.25, 0.4];
const WALK = 0.4;
const OFFICE = 0.2;
const RECEIPT_TAIL = 0.6;

export function flightDays(scenarioIdx: number, route: string): number {
  const sc = SCENARIOS[scenarioIdx];
  if (!sc.remote) return 2;
  return route === 'relay' ? 3 : 4;
}

function ruleCost(group: string, id: string): number {
  const r = RULES[group].find((x) => x.id === id);
  return r ? r.cost : 0;
}

export function createDay(opts: { scenario?: number; rules?: Partial<Rules>; plan?: Plan } = {}) {
  const scenario = SCENARIOS[opts.scenario ?? 0];
  const rules: Rules = {
    numbering: 'none',
    receipts: 'none',
    retry: 'never',
    ledger: 'off',
    route: 'direct',
    ...(opts.rules || {}),
  };
  const ledgerOn = rules.ledger === 'on' && rules.numbering !== 'none';
  const plan = opts.plan ?? null;
  const lostBags = plan ? plan.lostBags : scenario.lostBags;
  const lostReceipts = plan ? plan.lostReceipts : scenario.lostReceipts;
  const F = flightDays(opts.scenario ?? 0, rules.route) + (plan?.delay ?? 0);

  const letters: Letter[] = [
    { id: 'L1', seq: 1, from: 'A', to: 'B', label: 'Alice → Bob' },
    { id: 'L2', seq: 2, from: 'B', to: 'C', label: 'Bob → Carol' },
    { id: 'L3', seq: 3, from: 'C', to: 'A', label: 'Carol → Alice' },
  ].map((l) => ({
    ...l,
    number:
      rules.numbering === 'serial'
        ? `${l.from}-${String(l.seq).padStart(2, '0')}`
        : rules.numbering === 'date'
          ? 'DAY-' + scenario.day
          : null,
    attempts: [],
    acked: false,
    ackAt: null,
    slipLost: lostReceipts.some((r) => r.letter === l.seq),
  }));

  const attempts: Attempt[] = [];
  const deliveries: { letterId: string; number: string | null; at: number; attempt: string }[] = [];
  const events: DayEvent[] = [];
  const ledger = new Set<string>();
  let now = 0;
  let seq = 0;
  let done = false;

  const log = (kind: string, text: string, extra: Partial<DayEvent> = {}) => {
    events.push({ t: now, kind, text, ...extra });
  };

  function spawn(letter: Letter, n: number): Attempt {
    const a: Attempt = {
      id: 'a' + ++seq,
      letterId: letter.id,
      number: letter.number,
      from: letter.from,
      to: letter.to,
      attempt: n,
      start: now,
      delivered: false,
      status: 'moving',
      deliverAt: now + WALK + OFFICE + F + OFFICE + WALK,
      lost: lostBags.some((b) => b.letter === letter.seq && b.attempt === n),
      lostAt: now + WALK + OFFICE + F * 0.55,
    };
    letter.attempts.push(a);
    attempts.push(a);
    log('sent', `${letter.label} left the desk${a.number ? ' [' + a.number + ']' : ''}`, {
      letter: letter.id,
      attempt: a.id,
    });
    return a;
  }

  function deliver(a: Attempt) {
    const letter = letters.find((l) => l.id === a.letterId)!;
    if (ledgerOn && a.number && ledger.has(a.number)) {
      a.status = 'dropped';
      a.endedAt = now;
      log('dropped', `${a.number} already in the ledger — the copy is dropped`, {
        letter: a.letterId,
        attempt: a.id,
      });
      // the office still confirms the original delivery, or the sender would
      // resend forever
      if (rules.receipts === 'sign') letter.ackAt = now + F + RECEIPT_TAIL;
      return;
    }
    if (ledgerOn && a.number) ledger.add(a.number);
    a.status = 'delivered';
    a.delivered = true;
    a.endedAt = now;
    deliveries.push({ letterId: a.letterId, number: a.number, at: now, attempt: a.id });
    log('delivered', `${letter.to === 'A' ? 'Alice' : letter.to === 'B' ? 'Bob' : 'Carol'} received ${a.number || 'a letter'}`, {
      letter: a.letterId,
      attempt: a.id,
    });
    if (rules.receipts === 'sign') letter.ackAt = now + F + RECEIPT_TAIL;
  }

  function tick(dt: number) {
    if (done) return;
    now += dt;

    for (const a of attempts) {
      if (a.status !== 'moving') continue;
      if (a.lost && now >= a.lostAt) {
        a.status = 'lost';
        a.endedAt = now;
        log('lost', `the bag carrying ${a.number || 'a letter'} is gone`, { letter: a.letterId, attempt: a.id });
        continue;
      }
      if (now >= a.deliverAt) deliver(a);
    }

    for (const l of letters) {
      if (!l.acked && l.ackAt && now >= l.ackAt) {
        if (l.slipLost) {
          l.slipLost = false;
          // The slip is gone, and so is this arrival time. Without clearing
          // ackAt, the next tick would acknowledge the very slip we just lost.
          l.ackAt = null;
          log('lost', `the signed slip for ${l.number || l.label} never arrived`, { letter: l.id });
        } else {
          l.acked = true;
          log('ack', `the signed slip for ${l.number || l.label} reached the sender`, { letter: l.id });
        }
      }
    }

    if (rules.retry !== 'never' && now > 0.01) {
      const cap = rules.retry === 'tuned' ? 2 : 3;
      for (const l of letters) {
        if (l.acked) continue;
        if (l.attempts.length >= cap) continue;
        const last = l.attempts[l.attempts.length - 1];
        if (!last) continue;
        const wait = rules.retry === 'tuned' ? 2 * F + 2.6 : 6.5;
        if (now >= last.start + wait) {
          log('retry', `no slip from ${l.label} — sending again`, { letter: l.id });
          spawn(l, l.attempts.length + 1);
        }
      }
    }
  }

  function summary(): DaySummary {
    const rows: Row[] = letters.map((l) => {
      const ds = deliveries.filter((d) => d.letterId === l.id);
      const first = ds.length ? Math.min(...ds.map((d) => d.at)) : null;
      return {
        id: l.id,
        label: l.label,
        number: l.number,
        delivered: ds.length,
        first,
        onTime: first !== null && first <= scenario.deadline,
        acked: l.acked,
        lost: l.attempts.length > 0 && l.attempts.every((a) => a.status === 'lost'),
      };
    });
    const exact = rows.filter((r) => r.delivered === 1).length;
    const onTime = rows.filter((r) => r.delivered === 1 && r.onTime).length;
    const dupes = rows.reduce((n, r) => n + Math.max(0, r.delivered - 1), 0);
    const lost = rows.filter((r) => r.delivered === 0).length;

    const cost =
      letters.length * 1 +
      letters.length * ruleCost('numbering', rules.numbering) +
      letters.length * ruleCost('receipts', rules.receipts) +
      (ledgerOn ? letters.length * ruleCost('ledger', rules.ledger) : 0) +
      (rules.retry !== 'never' ? letters.length * ruleCost('retry', rules.retry) : 0) +
      (scenario.remote && rules.route === 'direct' ? letters.length * 0.5 : 0) +
      (attempts.length - letters.length) * 1;

    return {
      rows,
      exact,
      onTime,
      dupes,
      lost,
      total: letters.length,
      cost: Math.round(cost * 10) / 10,
      attempts: attempts.length,
      // The promise has three clauses: every letter once, on time, and the
      // sender holds a signed slip. No receipts means the promise fails even
      // when the letters arrive.
      promise: onTime === letters.length && dupes === 0 && rows.every((r) => r.acked),
    };
  }

  function runAll(): DaySummary {
    while (now < scenario.deadline + 3) tick(0.05);
    done = true;
    return summary();
  }

  letters.forEach((l, i) => {
    now = SEND_AT[i];
    spawn(l, 1);
  });
  now = 0;

  return {
    scenario,
    rules,
    letters,
    attempts,
    deliveries,
    events,
    flightDays: F,
    plan: { lostBags, lostReceipts, delay: plan?.delay ?? 0 },
    get now() {
      return now;
    },
    tick,
    summary,
    runAll,
    get done() {
      return done;
    },
  };
}

export type Day = ReturnType<typeof createDay>;
