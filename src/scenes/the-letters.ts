/**
 * Illustration: The Letters (WIP).
 *
 * A postal game about distributed systems. Three friends, three post offices,
 * and a rule book the reader sets: numbering, receipts, retries, a ledger.
 * Each day changes the world, not the rules, so a design that worked yesterday
 * visibly fails today.
 *
 * The engine is deterministic; this file is only the instrument panel. Styles
 * live in a shadow root so the game cannot leak into the site's prose.
 */
import type { SceneFactory } from '../lib/registry.ts';
import { createDay, morningPlan, flightDays, minProofCost, SITUATIONS, BUDGETS, RULES, SCENARIOS, CITIES, type Day, type DaySummary } from './the-letters-sim.ts';

const CSS = `
:host { display: block; }
* { box-sizing: border-box; }
.wrap {
  --line: #242a34; --panel: #12151b; --panel2: #171b22;
  --text: #e6e9ef; --dim: #8b94a3; --dimmer: #5c6472;
  --blue: #58a6ff; --green: #3fb950; --red: #f85149; --amber: #d29922;
  --violet: #a371f7; --teal: #39c5cf; --gold: #e3b341;
  color: var(--text);
  font: 13.5px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
  border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #0e1116;
}
.mono { font-family: "SF Mono", ui-monospace, Menlo, monospace; font-variant-numeric: tabular-nums; }
button { font: inherit; color: var(--text); background: var(--panel2); border: 1px solid var(--line); border-radius: 7px; padding: 5px 9px; cursor: pointer; font-size: 12px; }
button:hover { border-color: #3a4350; }
button.primary { background: #2a2413; border-color: #5a4a1c; color: #f0d78a; }
button:disabled { opacity: .4; cursor: default; }

.bar { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-bottom: 1px solid var(--line); background: #0f1319; flex-wrap: wrap; }
.bar .title { font-size: 12.5px; font-weight: 560; }
.bar .title span { color: var(--dimmer); font-weight: 400; }
.bar .spacer { flex: 1; }
.days { display: flex; gap: 3px; }
.days button { padding: 4px 7px; font-size: 11px; }
.days button.on { border-color: var(--gold); color: var(--gold); }
.clock { font-size: 11px; color: var(--dim); }
.clock b { color: var(--text); font-weight: 500; }
.rail { display: flex; align-items: center; gap: 9px; padding: 8px 12px; border-top: 1px solid var(--line); background: #0f1319; flex-wrap: wrap; }
.rail .rail-label { font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--dimmer); }
.rail .rail-hint { font-size: 9.5px; color: var(--dimmer); }
.sitchips { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
.sitchips .sip { width: 30px; height: 24px; padding: 0; border-radius: 6px; background: #1a2029; border: 1px solid #333d4b; color: var(--dim); font-size: 10.5px; font-weight: 600; cursor: pointer; display: grid; place-items: center; }
.sitchips .sip:hover { border-color: var(--text); color: var(--text); }
.sitchips .sip.ok { background: #102219; border-color: #2b5d3b; color: #7ee2a8; }
.sitchips .sip.bad { background: #2a1316; border-color: #6e2b31; color: #ff9b9b; }
.sitchips .sip.warn { background: #221d10; border-color: #5a4a1c; color: #e3c37a; }
.sitchips .sip.bad:hover { border-color: var(--red); }
.sitchips .sip.sel { box-shadow: 0 0 0 1px var(--gold); }

.mapwrap { position: relative; height: 420px; background: radial-gradient(120% 100% at 50% 0%, #10151d 0%, #0b0d10 70%); }
svg { width: 100%; height: 100%; display: block; }
.route { fill: none; stroke: #36405a; stroke-width: 1.5; stroke-dasharray: 3 6; }
.routelabel { fill: var(--dimmer); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
.city text.name { fill: var(--text); font-size: 13px; font-weight: 560; }
.city text.place { fill: var(--dimmer); font-size: 10.5px; }
.office { fill: #1a2029; stroke: #2f3a49; stroke-width: 1; }
.office.flag { fill: var(--gold); }
.letter rect { fill: #f2e6c8; stroke: #b99a52; }
.letter path { stroke: #b99a52; fill: none; }
.letter text { fill: #f0e6c8; font-size: 8px; font-weight: 700; }
.letter { filter: drop-shadow(0 2px 4px rgba(0,0,0,.45)); }
.letter.focus rect { stroke: var(--gold); stroke-width: 2.2; }
.stack text { fill: #f0e6c8; font-size: 7.5px; font-weight: 700; }
.lostmark { fill: none; stroke: var(--red); stroke-width: 2; }

.panels { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); }
.panels > div { padding: 12px; min-width: 0; }
.panels > div + div { border-left: 1px solid var(--line); }
h3.grp { font-size: 9px; letter-spacing: .13em; text-transform: uppercase; color: var(--dimmer); margin: 0 0 6px; font-weight: 600; }
.rulegrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; }
.opt { display: block; width: 100%; text-align: left; background: var(--panel); border: 1px solid var(--line); border-radius: 7px; padding: 5px 7px; margin-bottom: 4px; cursor: pointer; font: inherit; color: var(--text); }
.opt:hover { border-color: #3a4350; }
.opt.on { border-color: var(--gold); background: #1c1a12; }
.opt .row { display: flex; justify-content: space-between; gap: 6px; align-items: baseline; }
.opt .nm { font-size: 11px; font-weight: 520; }
.opt .pr { font-size: 10px; color: var(--gold); }
.opt .note { font-size: 9.5px; color: var(--dimmer); line-height: 1.3; margin-top: 1px; display: none; }
.opt.on .note { display: block; }
.opt.off { opacity: .38; cursor: not-allowed; }

.brief { padding: 10px 14px 9px; border-bottom: 1px solid var(--line); background: linear-gradient(180deg, #11161d, #0d1116); }
.brief-title { font-size: 12px; font-weight: 600; letter-spacing: .01em; }
.brief-copy { font-size: 10.5px; color: var(--dim); line-height: 1.5; margin-top: 3px; max-width: 760px; }
.brief-goal { font-size: 9.5px; color: var(--dimmer); margin-top: 5px; }
.brief-goal b { color: var(--gold); font-weight: 600; letter-spacing: .04em; }
.score-rank { display: flex; align-items: center; gap: 9px; margin-bottom: 4px; }
.rank { width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; font-size: 17px; font-weight: 650; border: 1px solid var(--line); background: #141922; color: var(--dim); flex: none; }
.rank.s { background: var(--gold); border-color: var(--gold); color: #0d1117; }
.rank.a { background: #102219; border-color: #2b5d3b; color: #7ee2a8; }
.rank.b { background: #221d10; border-color: #5a4a1c; color: var(--amber); }
.rank.c { background: #2a1316; border-color: #6e2b31; color: #ff9b9b; }
.rank-body { flex: 1; min-width: 0; }
.rank-title { font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--dimmer); }
.rank-body .big { font-size: 16px; }
.best { text-align: right; font-size: 8.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--dimmer); line-height: 1.45; flex: none; }
.best b { display: block; font-size: 10.5px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--text); }
.budget-line { display: flex; justify-content: space-between; font-size: 8.5px; letter-spacing: .1em; color: var(--dimmer); }
.budget-track { height: 4px; border-radius: 999px; background: #1b222c; overflow: hidden; margin: 3px 0 5px; }
.budget-track i { display: block; height: 100%; width: 0; background: var(--green); transition: width .3s; }
.budget-track i.over { background: var(--red); }
.starget { font-size: 9px; color: var(--dimmer); margin: 0 0 4px; line-height: 1.35; }
.score .head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.score .big { font-size: 15px; font-weight: 560; }
.ok { color: var(--green); } .bad { color: var(--red); }
.srow { display: grid; grid-template-columns: 1fr 76px 40px; gap: 6px; font-size: 11px; padding: 4px 0; border-bottom: 1px solid #171d26; align-items: center; }
.srow .l { color: var(--dim); }
.srow .l b { color: var(--text); font-weight: 500; }
.srow .c { text-align: right; }
.srow .t { text-align: right; color: var(--dimmer); font-size: 10px; }

.log { margin-top: 10px; height: 200px; overflow-y: auto; font-size: 10.5px; border-top: 1px solid var(--line); padding-top: 6px; }
.log .lrow { display: grid; grid-template-columns: 34px 1fr; gap: 6px; padding: 1.5px 0; border-bottom: 1px solid #141a22; }
.log .lt { color: var(--dimmer); font-size: 9.5px; }
.log .lx { color: #b6bec9; }
.log .sent .lx { color: var(--blue); }
.log .delivered .lx { color: var(--green); }
.log .dropped .lx { color: var(--violet); }
.log .lost .lx { color: var(--red); }
.log .retry .lx { color: var(--amber); }
.log .ack .lx { color: var(--teal); }

.verdict { position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%); background: #12151bee; border: 1px solid var(--line); border-radius: 10px; padding: 10px 14px; width: min(420px, 90%); box-shadow: 0 12px 40px rgba(0,0,0,.5); display: none; }
.verdict.show { display: block; }
.verdict .vt { font-size: 12.5px; font-weight: 560; margin-bottom: 3px; }
.verdict .vs { font-size: 11px; color: var(--dim); margin-bottom: 8px; }
.verdict .va { display: flex; gap: 6px; }

@media (max-width: 640px) {
  .panels { grid-template-columns: 1fr; }
  .panels > div + div { border-left: none; border-top: 1px solid var(--line); }
  .mapwrap { height: 340px; }
}
`;

const HTML = `
<div class="wrap">
  <div class="bar">
    <span class="title" id="title">A calm day <span>· day 1</span></span>
    <span class="spacer"></span>
    <div class="days" id="days"></div>
    <button id="reset" title="Recompute results">↺</button>
    <span class="clock mono"><b id="clock">situation 1/10 · day 0.0</b></span>
  </div>

  <div class="brief">
    <div class="brief-title">Your job: keep the promise</div>
    <div class="brief-copy">Deliver every letter once, on time — across ten independent weather worlds. Pick the post-office add-ons; postage comes out of a fixed budget. Signed slips are proof: they cost extra and earn the S. Click a red result to replay its failure.</div>
    <div class="brief-goal"><b>PASS</b> 9 / 10 delivered within budget · <b>PERFECT</b> all slips at the efficient price earns an S · best saved per day (<span id="briefBudget">60</span> coins)</div>
  </div>

  <div class="mapwrap">
    <svg id="map" viewBox="0 0 800 430" preserveAspectRatio="xMidYMid meet">
      <defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#1b2230"/></pattern></defs>
      <rect x="0" y="0" width="800" height="430" fill="url(#dots)" opacity="0.65" />
      <g id="map-static"></g>
      <g id="map-dynamic"></g>
    </svg>
    <div class="verdict" id="verdict">
      <div class="vt" id="vt"></div>
      <div class="vs" id="vs"></div>
      <div class="va"><button id="next" class="primary">Next day →</button><button id="again">Run again</button></div>
    </div>
  </div>

  <div class="rail">
    <span class="rail-label">Results</span>
    <div class="sitchips" id="sitchips"></div>
    <span class="rail-hint">click any result to replay · amber = delivered, unsigned · red = broken</span>
  </div>

  <div class="panels">
    <div>
      <h3 class="grp" style="margin-bottom:8px">Post office add-ons</h3>
      <div class="rulegrid" id="rules"></div>
      <div style="font-size:9.5px;color:var(--dimmer);margin-top:6px;line-height:1.4">Add-ons apply to all three offices. Priced per letter, in postage.</div>
    </div>
    <div>
      <div class="score">
        <div class="score-rank">
          <span class="rank" id="rank" title="S = perfect · A = pass · B = close · C = fail">—</span>
          <div class="rank-body">
            <div class="rank-title">Scoreboard</div>
            <div class="big" id="promiseState">in progress</div>
          </div>
          <div class="best"><span>BEST</span><b id="best">—</b></div>
        </div>
        <div class="budget-line"><span>POSTAGE</span><span class="mono" id="cost" style="font-size:10.5px;color:var(--dim)"></span></div>
        <div class="budget-track"><i id="budgetBar"></i></div>
        <div class="starget" id="starget"></div>
        <div id="promise" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:2px 0 3px"></div>
        <div id="sitnote" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:0 0 3px"></div>
        <div id="why" style="font-size:9.5px;line-height:1.35;margin:0 0 5px;color:var(--dimmer)"></div>
        <div id="rows"></div>
      </div>
      <div class="log" id="log"></div>
    </div>
  </div>
</div>
`;

const scene: SceneFactory = (el) => {
  const shadow = el.shadowRoot ?? el.attachShadow({ mode: 'open' });
  shadow.innerHTML = '<style>' + CSS + '</style>' + HTML;

  const $ = <T extends HTMLElement = HTMLElement>(id: string) => shadow.querySelector('#' + id) as T;
  const svg = shadow.querySelector<SVGSVGElement>('#map')!;
  const staticLayer = shadow.querySelector<SVGGElement>('#map-static')!;
  const dynamicLayer = shadow.querySelector<SVGGElement>('#map-dynamic')!;
  let staticKey = '';

  const POS: Record<string, { x: number; y: number }> = {
    A: { x: 150, y: 300 },
    B: { x: 415, y: 120 },
    C: { x: 660, y: 320 },
  };
  const REMOTE_B = { x: 470, y: 62 };

  const state = {
    day: 0,
    // Day 1 starts from a book that can actually keep the promise; the lesson
    // is what each add-on costs, not discovering that no receipts can pass.
    rules: { numbering: 'serial', receipts: 'sign', retry: 'never', ledger: 'off', route: 'direct' },
    sim: null as Day | null,
    days: [] as Day[],
    index: 0,
    results: [] as (DaySummary | null)[],
    playing: false,
    single: false,
    speed: 1,
    drawnLog: 0,
    focus: null as string | null,
    ended: false,
    best: null as { kept: number; signed: number; cost: number } | null,
    sTarget: null as number | null,
  };
  let raf = 0;
  let lastTs = 0;
  let holdUntil = 0;

  function cityPos(id: string) {
    if (state.sim?.scenario.remote && id === 'B') return REMOTE_B;
    return POS[id];
  }

  function routeFor(a: string, b: string) {
    const p1 = cityPos(a);
    const p2 = cityPos(b);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy) || 1;
    const bend = a === 'A' && b === 'C' ? -54 : 42;
    return {
      p1,
      p2,
      c: { x: (p1.x + p2.x) / 2 - (dy / len) * bend, y: (p1.y + p2.y) / 2 + (dx / len) * bend },
    };
  }

  function quad(p1: { x: number; y: number }, c: { x: number; y: number }, p2: { x: number; y: number }, t: number) {
    const u = 1 - t;
    return { x: u * u * p1.x + 2 * u * t * c.x + t * t * p2.x, y: u * u * p1.y + 2 * u * t * c.y + t * t * p2.y };
  }

  function stop() {
    state.playing = false;
    cancelAnimationFrame(raf);
  }

  function newCampaign() {
    stop();
    holdUntil = 0;
    state.ended = true; // results are already in view
    state.single = false;
    state.drawnLog = 0;
    state.focus = null;
    state.index = 0;
    // Keep a fresh copy for replay, and score a separate copy of every world.
    state.days = Array.from({ length: SITUATIONS }, (_, i) =>
      createDay({ scenario: state.day, rules: state.rules, plan: morningPlan(state.day, i) }),
    );
    state.results = state.days.map((_, i) =>
      createDay({ scenario: state.day, rules: state.rules, plan: morningPlan(state.day, i) }).runAll(),
    );
    state.sTarget = minProofCost(state.day);
    state.best = loadBest();
    if (state.best && (state.sTarget === null || state.best.cost > state.sTarget + 0.05)) state.best = null;
    saveBest();
    state.sim = state.days[0];
    $('verdict').classList.remove('show');
    $('log').innerHTML = '';
    draw();
  }

  function play(single = false) {
    if (state.ended) newCampaign();
    // After watching one situation, Run continues with the next pending one.
    if (state.sim && state.sim.now >= state.sim.scenario.deadline + 2 && !single) {
      let next = state.index + 1;
      while (next < SITUATIONS && state.results[next]) next++;
      if (next < SITUATIONS) {
        state.index = next;
        state.sim = state.days[next];
        $('log').innerHTML = '';
        state.drawnLog = 0;
        draw();
      }
    }
    state.playing = true;
    state.single = single;
    lastTs = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  function selectSituation(i: number) {
    stop();
    $('verdict').classList.remove('show');
    state.ended = false;
    state.single = false;
    state.playing = false;
    state.index = i;
    // Replay this world from the morning; clicking a pip should explain it,
    // not just freeze its final frame.
    state.days[i] = createDay({ scenario: state.day, rules: state.rules, plan: morningPlan(state.day, i) });
    state.sim = state.days[i];
    $('log').innerHTML = '';
    state.drawnLog = 0;
    draw();
    play(true);
  }

  function frame(ts: number) {
    if (!state.playing || !state.sim) return;
    if (ts < holdUntil) {
      raf = requestAnimationFrame(frame);
      return;
    }
    const dt = Math.min(0.06, (ts - lastTs) / 1000);
    lastTs = ts;
    // The first watchable situation gets a readable pace; the rest of a
    // batch run is a little quicker.
    const rate = state.single || state.index === 0 ? 2.2 : 4.2;
    state.sim.tick(dt * state.speed * rate);
    if (state.sim.now >= state.sim.scenario.deadline + 2) {
      state.results[state.index] = state.sim.summary();
      if (state.single) {
        state.playing = false;
        state.single = false;
        state.ended = true;
        saveBest();
        cancelAnimationFrame(raf);
        draw();
        return;
      }
      state.index++;
      if (state.results.every(Boolean) || state.index >= SITUATIONS) {
        finishAll();
        return;
      }
      while (state.index < SITUATIONS && state.results[state.index]) state.index++;
      if (state.index >= SITUATIONS) {
        finishAll();
        return;
      }
      state.sim = state.days[state.index];
      $('log').innerHTML = '';
      state.drawnLog = 0;
      draw();
      lastTs = ts;
      holdUntil = ts + 220;
      raf = requestAnimationFrame(frame);
      return;
    }
    draw();
    raf = requestAnimationFrame(frame);
  }

  function bestKey() {
    return 'letters:best:' + state.day;
  }

  function loadBest(): { kept: number; signed: number; cost: number } | null {
    try {
      const raw = localStorage.getItem(bestKey());
      if (!raw) return null;
      const b = JSON.parse(raw);
      if (b && typeof b.kept === 'number' && typeof b.cost === 'number') {
        return { kept: b.kept, signed: typeof b.signed === 'number' ? b.signed : 0, cost: b.cost };
      }
    } catch {
      /* storage may be unavailable */
    }
    return null;
  }

  function saveBest() {
    const agg = aggregate();
    if (state.sTarget === null || agg.kept < SITUATIONS || agg.signed < SITUATIONS * 3 || agg.cost > state.sTarget + 0.05) return;
    const cur = state.best;
    const better = !cur || agg.kept > cur.kept ||
      (agg.kept === cur.kept && agg.signed > cur.signed) ||
      (agg.kept === cur.kept && agg.signed === cur.signed && agg.cost < cur.cost);
    if (!better) return;
    state.best = { kept: agg.kept, signed: agg.signed, cost: agg.cost };
    try {
      localStorage.setItem(bestKey(), JSON.stringify(state.best));
    } catch {
      /* ignore */
    }
  }

  function aggregate() {
    const rs = state.results.filter((r): r is DaySummary => !!r);
    const kept = rs.filter((r) => r.promise).length;
    const signed = rs.reduce((n, r) => n + r.signed, 0);
    const cost = Math.round(rs.reduce((acc, r) => acc + r.cost, 0) * 10) / 10;
    const budget = BUDGETS[state.day];
    const per = ['L1', 'L2', 'L3'].map((id) => {
      const label = state.days[0]?.letters.find((l) => l.id === id)?.label ?? id;
      let ok = 0;
      let dup = 0;
      for (const r of rs) {
        const row = r.rows.find((x) => x.id === id);
        if (row && row.delivered === 1) ok++;
        if (row) dup += Math.max(0, row.delivered - 1);
      }
      return { id, label, ok, dup };
    });
    return { kept, signed, cost, budget, per, n: rs.length };
  }

  function finishAll() {
    stop();
    state.playing = false;
    state.single = false;
    state.ended = true;
    const agg = aggregate();
    const pass = agg.kept >= PASS_SITUATIONS && agg.cost <= agg.budget;
    $('verdict').classList.add('show');
    const over = agg.cost > agg.budget;
    $('vt').innerHTML = pass
      ? '<span class="ok">Good enough: ' + agg.kept + ' / ' + SITUATIONS + ' situations.</span>'
      : over
        ? '<span class="bad">Over budget: ' + agg.cost + ' / ' + agg.budget + ' coins.</span>'
        : '<span class="bad">Not yet: ' + agg.kept + ' / ' + SITUATIONS + ' situations.</span>';

    let wi = -1;
    let wscore = 99;
    state.results.forEach((r, i) => {
      if (!r) return;
      const sc = r.exact * 2 - r.dupes;
      if (sc < wscore) { wscore = sc; wi = i; }
    });
    const worst = wi >= 0 ? state.results[wi] : null;
    const wrow = worst ? worst.rows.slice().sort((x, y) => y.delivered - x.delivered)[0] : null;
    const tail = wrow && wrow.delivered > 1
      ? ' · worst: situation ' + (wi + 1) + ', ' + wrow.delivered + ' copies for ' + wrow.label
      : worst && worst.lost > 0
        ? ' · worst: situation ' + (wi + 1) + ', a letter never arrived'
        : ' · every letter at most once';
    $('vs').textContent = agg.cost + ' / ' + agg.budget + ' coins' + tail;
    const next = $('next') as HTMLButtonElement;
    next.disabled = state.day >= SCENARIOS.length - 1;
    next.textContent = state.day >= SCENARIOS.length - 1 ? 'That is the whole slice' : 'Next day →';
    draw();
  }

  const PASS_SITUATIONS = Math.ceil(SITUATIONS * 0.85);

  function runAllMornings() {
    stop();
    state.results = state.days.map((d) => d.runAll());
    state.index = state.days.length;
    state.sim = state.days[state.days.length - 1];
    finishAll();
  }
  function draw() {
    if (!state.sim) return;
    drawMap();
    drawPanels();
    drawLog();
    const sit = Math.min(state.index + 1, SITUATIONS);
    const day = Math.min(state.sim.now, state.sim.scenario.deadline).toFixed(1);
    $('clock').textContent = 'situation ' + sit + '/' + SITUATIONS + ' · day ' + day + ' / ' + state.sim.scenario.deadline;
  }

  function drawMap() {
    const sim = state.sim;
    if (!sim) return;
    const staticParts: string[] = [];
    const dynamicParts: string[] = [];

    for (const [a, b] of [['A', 'B'], ['B', 'C'], ['A', 'C']]) {
      const r = routeFor(a, b);
      staticParts.push(`<path class="route" d="M ${r.p1.x} ${r.p1.y} Q ${r.c.x} ${r.c.y} ${r.p2.x} ${r.p2.y}" />`);
      const m = quad(r.p1, r.c, r.p2, 0.5);
      const days = flightDays(sim.scenario, sim.rules.route, a, b);
      staticParts.push(`<text class="routelabel" x="${m.x}" y="${m.y - 12}" text-anchor="middle">${days} days one-way</text>`);
    }

    for (const id of ['A', 'B', 'C']) {
      const p = cityPos(id);
      const c = CITIES[id];
      const toHere = sim.deliveries.filter((d) => sim.letters.find((l) => l.id === d.letterId)!.to === id);
      const remote = sim.scenario.remote && id === 'B';
      staticParts.push(`<g class="city">
        <circle cx="${p.x}" cy="${p.y}" r="28" fill="#0f141b" stroke="${c.color}" stroke-width="2" />
        <text class="name" x="${p.x}" y="${p.y + 44}" text-anchor="middle">${c.friend}</text>
        <text class="place" x="${p.x}" y="${p.y + 58}" text-anchor="middle">${remote ? 'the mountains' : c.city}</text>
        <g transform="translate(${p.x + 30},${p.y - 32})">
          <rect class="office" x="0" y="0" width="17" height="13" rx="2" />
          <rect class="office flag" x="4" y="-7" width="2" height="7" />
          <rect class="office flag" x="6" y="-7" width="6" height="4" />
        </g>
      </g>`);

      toHere.slice(0, 4).forEach((d, i) => {
        dynamicParts.push(`<g class="stack" transform="translate(${p.x + 38 + i * 13},${p.y - 10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${d.number ? `<text x="7" y="-4" text-anchor="middle">${d.number}</text>` : ''}
        </g>`);
      });
    }

    let jitter = 0;
    for (const a of sim.attempts) {
      if (a.status !== 'moving') continue;
      const total = 1.2 + a.flightDays;
      const u = Math.max(0, Math.min(1, (sim.now - a.start) / total));
      const flyStart = 0.6 / total;
      const flyEnd = (0.6 + a.flightDays) / total;
      let p: { x: number; y: number };
      let angle = 0;
      if (u <= flyStart) {
        p = cityPos(a.from);
        p = { x: p.x - 40 - (jitter++ % 3) * 7, y: p.y - 2 };
      } else if (u >= flyEnd) {
        p = cityPos(a.to);
        p = { x: p.x + 12, y: p.y + 34 };
      } else {
        const k = (u - flyStart) / (flyEnd - flyStart);
        const r = routeFor(a.from, a.to);
        p = quad(r.p1, r.c, r.p2, k);
        const q = quad(r.p1, r.c, r.p2, Math.min(1, k + 0.015));
        angle = Math.max(-20, Math.min(20, (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI));
        p.y -= 8;
        for (let g = 1; g <= 2; g++) {
          const gp = quad(r.p1, r.c, r.p2, Math.max(0, k - g * 0.03));
          dynamicParts.push('<rect x="' + (gp.x - 8) + '" y="' + (gp.y - 13) + '" width="16" height="11" rx="2" fill="#f2e6c8" opacity="' + (0.18 / g) + '" />');
        }
      }
      const focused = state.focus === a.letterId;
      dynamicParts.push(
        '<g class="letter ' + (focused ? 'focus' : '') + '" data-letter="' + a.letterId + '" style="cursor:pointer" transform="translate(' + p.x + ' ' + p.y + ') rotate(' + angle + ')">' +
          '<rect x="-11" y="-7.5" width="22" height="15" rx="2" />' +
          '<path d="M -11 -7.5 L 0 2 L 11 -7.5" />' +
          '<circle cx="0" cy="0.5" r="1.7" fill="#b4453a" stroke="none" opacity="0.85" />' +
          (a.number ? '<text x="0" y="-11" text-anchor="middle" transform="rotate(' + (-angle) + ' 0 -11)">' + a.number + '</text>' : '') +
          '</g>',
      );
    }

    // slips coming home
    for (const l of sim.letters) {
      const d = sim.deliveries.find((x) => x.letterId === l.id);
      if (!d || sim.rules.receipts !== 'sign' || !l.ackAt) continue;
      if (sim.now < d.at || sim.now > l.ackAt) continue;
      const prog = (sim.now - d.at) / (l.ackAt - d.at);
      const lost = sim.plan.lostReceipts.some((r) => r.letter === l.seq);
      if (lost && prog > 0.55) continue;
      const r = routeFor(l.to, l.from);
      const p = quad(r.p1, r.c, r.p2, prog);
      const fade = lost ? Math.max(0.15, 1 - Math.max(0, prog - 0.3) / 0.25) : 1;
      dynamicParts.push(
        '<g transform="translate(' + p.x + ' ' + (p.y - 7) + ')" opacity="' + fade + '">' +
          '<rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#e8eef7" stroke="#9fb0c8" />' +
          '<path d="M -7 -5 L 0 0 L 7 -5" fill="none" stroke="#9fb0c8" />' +
          '<circle cx="0" cy="2.4" r="1.5" fill="#b4453a" />' +
          '</g>',
      );
    }

    // arrivals
    for (const d of sim.deliveries) {
      const age = sim.now - d.at;
      if (age < 0 || age > 1.1) continue;
      const target = sim.letters.find((l) => l.id === d.letterId);
      if (!target) continue;
      const p = cityPos(target.to);
      const k = age / 1.1;
      dynamicParts.push('<circle cx="' + p.x + '" cy="' + p.y + '" r="' + (28 + 36 * k) + '" fill="none" stroke="#3fb950" stroke-width="' + (2.2 * (1 - k)) + '" opacity="' + (0.5 * (1 - k)) + '" />');
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI * 2 * i) / 6;
        const rad = 26 + 30 * k;
        dynamicParts.push('<circle cx="' + (p.x + Math.cos(ang) * rad) + '" cy="' + (p.y + Math.sin(ang) * rad) + '" r="1.7" fill="#3fb950" opacity="' + (0.75 * (1 - k)) + '" />');
      }
    }

    // the office stamp, while a letter is processed
    for (const a of sim.attempts) {
      if (a.status !== 'moving') continue;
      const total = 1.2 + a.flightDays;
      const u = (sim.now - a.start) / total;
      const s0 = 0.6 / total;
      const s1 = 0.8 / total;
      if (u < s0 || u > s1 + 0.08) continue;
      const p = cityPos(a.from);
      const k = Math.min(1, (u - s0) / (s1 - s0));
      const sc = 0.75 + 0.25 * k;
      const fade = u > s1 ? Math.max(0, 1 - (u - s1) / 0.08) : 1;
      dynamicParts.push(
        '<g transform="translate(' + (p.x - 26) + ' ' + (p.y + 24) + ') scale(' + sc + ')" opacity="' + (0.9 * fade) + '">' +
          '<circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" />' +
          '<path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" />' +
          '</g>',
      );
    }

    const key = sim.scenario.day + '|' + sim.scenario.remote + '|' + sim.rules.route;
    if (key !== staticKey) {
      staticLayer.innerHTML = staticParts.join('');
      staticKey = key;
    }
    dynamicLayer.innerHTML = dynamicParts.join('');
  }

  function drawSitchips() {
    const box = $('sitchips');
    if (box.children.length !== SITUATIONS) {
      // Build the buttons once; replacing them every frame would eat clicks.
      box.innerHTML = Array.from({ length: SITUATIONS }, (_, i) =>
        '<button class="sip" data-i="' + i + '" title="Situation ' + (i + 1) + '">' + (i + 1) + '</button>',
      ).join('');
    }
    const current = state.ended ? -1 : state.index;
    box.querySelectorAll<HTMLButtonElement>('.sip').forEach((b, i) => {
      const r = state.results[i];
      const tone = r ? (r.promise ? (r.proof ? 'ok' : 'warn') : 'bad') : '';
      b.className = 'sip ' + [tone, i === current ? 'sel' : ''].filter(Boolean).join(' ');
      b.title = 'Situation ' + (i + 1) + ' — ' + resultText(r);
    });
  }

  function resultText(r: DaySummary | null | undefined): string {
    if (!r) return 'not run';
    if (r.promise && r.proof) return 'delivered · all slips back';
    if (r.promise) return 'delivered · ' + r.signed + '/' + r.total + ' signed';
    const bits: string[] = [];
    if (r.lost) bits.push(r.lost + ' lost');
    if (r.dupes) bits.push(r.dupes + ' duplicate' + (r.dupes > 1 ? 's' : ''));
    const late = r.rows.filter((x) => x.delivered === 1 && !x.onTime).length;
    if (late) bits.push(late + ' late');
    const unsigned = r.rows.filter((x) => !x.acked).length;
    if (unsigned) bits.push(unsigned + ' unsigned');
    return bits.length ? bits.join(' · ') : 'promise broken';
  }

  function whySummary(agg: { kept: number; signed: number; cost: number; budget: number }): string {
    const rs = state.results.filter((r): r is DaySummary => !!r);
    const lost = rs.reduce((n, r) => n + r.lost, 0);
    const dupes = rs.reduce((n, r) => n + r.dupes, 0);
    const late = rs.reduce((n, r) => n + r.rows.filter((x) => x.delivered === 1 && !x.onTime).length, 0);
    const unsigned = rs.reduce((n, r) => n + r.rows.filter((x) => x.delivered > 0 && !x.acked).length, 0);
    const bits: string[] = [];
    if (agg.cost > agg.budget) bits.push('over budget by ' + (agg.cost - agg.budget).toFixed(1) + ' coins');
    if (lost) bits.push(lost + ' never arrived');
    if (dupes) bits.push(dupes + ' duplicate' + (dupes > 1 ? 's' : ''));
    if (late) bits.push(late + ' late');
    if (unsigned) bits.push(unsigned + ' without a signed slip');
    const deliveryOk = agg.kept >= PASS_SITUATIONS && agg.cost <= agg.budget;
    if (!bits.length) {
      if (rs.length === SITUATIONS && agg.signed === SITUATIONS * 3 && state.sTarget !== null && agg.cost > state.sTarget + 0.05) {
        return 'All delivered and signed; S needs the efficient book at ≤ ' + state.sTarget + ' coins.';
      }
      if (rs.length === SITUATIONS && agg.signed === SITUATIONS * 3 && state.sTarget === null) {
        return 'All delivered and signed; no all-proof book fits this day.';
      }
      return rs.length === SITUATIONS ? 'All delivered; every slip made it back.' : '';
    }
    if (deliveryOk && bits.length === 1 && unsigned) {
      return 'All delivered; ' + unsigned + ' without a signed slip — no S rank.';
    }
    return 'Why: ' + bits.join(' · ');
  }

  function situationNote(): string {
    const sim = state.sim;
    if (!sim) return '';
    const p = sim.plan;
    const bits: string[] = [];
    if (p.lostBags.length) bits.push(p.lostBags.length + (p.lostBags.length > 1 ? ' bags' : ' bag') + ' lost');
    if (p.lostReceipts.length) bits.push(p.lostReceipts.length + (p.lostReceipts.length > 1 ? ' slips' : ' slip') + ' lost');
    if (p.delay) bits.push('storm +' + p.delay + ' days');
    const n = Math.min(state.index + 1, SITUATIONS);
    return 'Situation ' + n + ': ' + (bits.length ? bits.join(' · ') : 'nothing goes wrong');
  }

  function drawPanels() {
    const sim = state.sim;
    if (!sim) return;
    const agg = aggregate();
    const pass = agg.kept >= PASS_SITUATIONS && agg.cost <= agg.budget;
    const perfect = agg.kept === SITUATIONS && agg.signed === SITUATIONS * 3 && state.sTarget !== null && agg.cost <= state.sTarget + 0.05;
    const rank = perfect ? 'S' : pass ? 'A' : agg.kept >= PASS_SITUATIONS - 2 ? 'B' : 'C';
    $('rank').textContent = rank;
    $('rank').className = 'rank ' + rank.toLowerCase();
    $('best').textContent = state.best ? state.best.kept + '/' + SITUATIONS + ' · ' + state.best.signed + 's · ' + state.best.cost + 'c' : '—';
    $('budgetBar').style.width = Math.min(100, (agg.cost / agg.budget) * 100) + '%';
    $('budgetBar').className = agg.cost > agg.budget ? 'over' : '';
    $('starget').textContent = state.sTarget === null ? 'S: no all-proof book fits this day' : 'S: all slips at ≤ ' + state.sTarget + ' coins';
    $('starget').style.color = perfect ? 'var(--gold)' : 'var(--dimmer)';
    if (agg.n === SITUATIONS) {
      const label = agg.cost > agg.budget ? 'Over budget' : agg.kept + ' / ' + SITUATIONS;
      $('promiseState').innerHTML = '<span class="' + (pass ? 'ok' : 'bad') + '">' + label + '</span>';
    } else if (agg.n === 0) {
      $('promiseState').innerHTML = '<span style="color:var(--dim);font-size:12px">in progress</span>';
    } else {
      $('promiseState').innerHTML = '<span style="color:var(--dim);font-size:12px">' + agg.kept + ' / ' + agg.n + ' so far</span>';
    }
    $('cost').textContent = (agg.n ? agg.cost : '—') + ' / ' + agg.budget + ' coins';
    $('cost').className = 'mono' + (agg.cost > agg.budget ? ' bad' : '');
    $('promise').innerHTML =
      'Promise: every letter once, within ' + sim.scenario.deadline + ' days. Signed slips are proof; all of them at the efficient price earn an S.';
    $('sitnote').textContent = situationNote();
    $('why').textContent = whySummary(agg);
    $('why').style.color = perfect ? 'var(--green)' : pass ? 'var(--amber)' : 'var(--red)';
    drawSitchips();

    $('rows').innerHTML = agg.per.map((p) =>
      '<div class="srow"><div class="l"><b>' + p.label + '</b></div><div class="c">' +
      (agg.n ? p.ok + '/' + agg.n : '—') + '</div><div class="t mono">' + (p.dup ? p.dup + ' dup' : '') + '</div></div>',
    ).join('');
  }
  function drawLog() {
    const sim = state.sim;
    if (!sim) return;
    const rows = sim.events.filter((e) => !state.focus || e.letter === state.focus);
    const box = $('log');
    for (let i = state.drawnLog; i < rows.length; i++) {
      const e = rows[i];
      const d = document.createElement('div');
      d.className = 'lrow ' + e.kind;
      d.innerHTML = '<span class="lt mono">' + e.t.toFixed(1) + '</span><span class="lx">' + e.text + '</span>';
      box.appendChild(d);
    }
    state.drawnLog = rows.length;
    box.scrollTop = box.scrollHeight;
  }

  function renderRules() {
    const box = $('rules');
    box.innerHTML = (
      [
        ['numbering', 'Registered post'],
        ['receipts', 'Return receipt'],
        ['retry', 'Automatic resend'],
        ['ledger', 'Delivery ledger'],
      ] as [string, string][]
    )
      .map(([key, label]) => {
        const opts = RULES[key]
          .map((o) => {
            const disabled = key === 'ledger' && state.rules.numbering === 'none';
            const on = (state.rules as unknown as Record<string, string>)[key] === o.id;
            return `<button class="opt ${on ? 'on' : ''} ${disabled ? 'off' : ''}" data-g="${key}" data-o="${o.id}" ${disabled ? 'disabled' : ''} title="${o.note}">
              <div class="row"><span class="nm">${o.label}</span><span class="pr mono">+${o.cost.toFixed(1)}</span></div>
              <div class="note">${disabled ? 'Needs a number on the envelope.' : o.note}</div>
            </button>`;
          })
          .join('');
        return `<div><h3 class="grp">${label}</h3>${opts}</div>`;
      })
      .join('');
    box.querySelectorAll<HTMLButtonElement>('.opt').forEach((b) => {
      b.addEventListener('click', () => {
        const g = b.dataset.g!;
        state.rules[g as keyof typeof state.rules] = b.dataset.o!;
        if (g === 'numbering' && state.rules.numbering === 'none') state.rules.ledger = 'off';
        renderRules();
        newCampaign();
      });
    });
  }

  function setDay(n: number) {
    state.day = n;
    const sc = SCENARIOS[n];
    $('title').innerHTML = sc.title + ' <span>· day ' + sc.day + '  ·  ' + SITUATIONS + ' situations</span>';
    $('briefBudget').textContent = String(BUDGETS[n]);
    $('days').innerHTML = SCENARIOS.map(
      (s, i) => '<button data-d="' + i + '" class="' + (i === n ? 'on' : '') + '">' + s.day + '</button>',
    ).join('');
    $('days').querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
      b.addEventListener('click', () => setDay(Number(b.dataset.d)));
    });
    renderRules();
    newCampaign();
  }
  $('sitchips').addEventListener('click', (ev) => {
    const pip = (ev.target as Element | null)?.closest?.('.sip');
    if (!pip) return;
    const i = Number(pip.getAttribute('data-i'));
    if (Number.isInteger(i)) selectSituation(i);
  });
  $('reset').addEventListener('click', () => newCampaign());
  $('again').addEventListener('click', () => newCampaign());
  $('next').addEventListener('click', () => {
    if (state.day < SCENARIOS.length - 1) setDay(state.day + 1);
  });
  svg.addEventListener('click', (ev) => {
    const node = (ev.target as Element | null)?.closest?.('.letter');
    if (!node) return;
    const id = node.getAttribute('data-letter');
    state.focus = state.focus === id ? null : id;
    $('log').innerHTML = '';
    state.drawnLog = 0;
    draw();
  });

  setDay(0);

  // Verification hook: /?tlauto=3&tl=serial,sign,quick,off
  const params = new URLSearchParams(location.search);
  if (params.has('tlauto')) {
    const day = Math.max(0, Math.min(SCENARIOS.length - 1, Number(params.get('tlauto')) || 0));
    const preset = (params.get('tl') || '').split(',');
    setDay(day);
    if (preset.length === 4) {
      state.rules = { numbering: preset[0], receipts: preset[1], retry: preset[2], ledger: preset[3], route: 'direct' };
      renderRules();
      newCampaign();
    }
    const at = Number(params.get('tlat'));
    if (at > 0) {
      while (state.sim && state.sim.now < at) state.sim.tick(0.05);
      draw();
    } else {
      runAllMornings();
    }
  }

  return {
    destroy() {
      stop();
      shadow.innerHTML = '';
    },
  };
};

export default scene;
