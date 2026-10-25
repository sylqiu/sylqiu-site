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
import { createDay, morningPlan, MORNINGS, BUDGETS, RULES, SCENARIOS, CITIES, type Day, type DaySummary } from './the-letters-sim.ts';

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
    <button id="run" class="primary">▶ Run</button>
    <button id="reset" title="Reset">↺</button>
    <button id="skip" title="Skip to results">⏭</button>
    <span class="clock mono"><b id="clock">morning 1/20</b></span>
  </div>

  <div class="mapwrap">
    <svg id="map" viewBox="0 0 800 430" preserveAspectRatio="xMidYMid meet"></svg>
    <div class="verdict" id="verdict">
      <div class="vt" id="vt"></div>
      <div class="vs" id="vs"></div>
      <div class="va"><button id="next" class="primary">Next day →</button><button id="again">Run again</button></div>
    </div>
  </div>

  <div class="panels">
    <div>
      <h3 class="grp" style="margin-bottom:8px">Post office add-ons</h3>
      <div class="rulegrid" id="rules"></div>
      <div style="font-size:9.5px;color:var(--dimmer);margin-top:6px;line-height:1.4">Add-ons apply to all three offices. Priced per letter, in postage.</div>
    </div>
    <div>
      <div class="score">
        <div class="head"><span class="big" id="promiseState">in progress</span><span class="mono" id="cost" style="font-size:10.5px;color:var(--dim)"></span></div>
        <div id="promise" style="font-size:9.5px;color:var(--dimmer);line-height:1.35;margin:2px 0 5px"></div>
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
  const SVGNS = 'http://www.w3.org/2000/svg';

  const POS: Record<string, { x: number; y: number }> = {
    A: { x: 150, y: 300 },
    B: { x: 415, y: 120 },
    C: { x: 660, y: 320 },
  };
  const REMOTE_B = { x: 470, y: 62 };

  const state = {
    day: 0,
    rules: { numbering: 'none', receipts: 'none', retry: 'never', ledger: 'off', route: 'direct' },
    sim: null as Day | null,
    days: [] as Day[],
    index: 0,
    results: [] as DaySummary[],
    playing: false,
    speed: 2,
    drawnLog: 0,
    focus: null as string | null,
    ended: false,
  };
  let raf = 0;
  let lastTs = 0;

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
    state.ended = false;
    state.drawnLog = 0;
    state.focus = null;
    state.results = [];
    state.index = 0;
    state.days = Array.from({ length: MORNINGS }, (_, i) =>
      createDay({ scenario: state.day, rules: state.rules, plan: morningPlan(state.day, i) }),
    );
    state.sim = state.days[0];
    $('verdict').classList.remove('show');
    $('log').innerHTML = '';
    $('run').textContent = '▶ Run 20';
    draw();
  }

  function play() {
    if (state.ended) newCampaign();
    state.playing = true;
    $('run').textContent = '⏸ Pause';
    lastTs = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  function frame(ts: number) {
    if (!state.playing || !state.sim) return;
    const dt = Math.min(0.06, (ts - lastTs) / 1000);
    lastTs = ts;
    state.sim.tick(dt * state.speed * 9);
    if (state.sim.now >= state.sim.scenario.deadline + 2) {
      state.results.push(state.sim.summary());
      state.index++;
      if (state.index >= state.days.length) {
        finishAll();
        return;
      }
      state.sim = state.days[state.index];
      $('log').innerHTML = '';
      state.drawnLog = 0;
      draw();
      raf = requestAnimationFrame(frame);
      return;
    }
    draw();
    raf = requestAnimationFrame(frame);
  }

  function aggregate() {
    const rs = state.results;
    const kept = rs.filter((r) => r.promise).length;
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
    return { kept, cost, budget, per, n: rs.length };
  }

  function finishAll() {
    stop();
    state.playing = false;
    state.ended = true;
    const agg = aggregate();
    const pass = agg.kept >= 17 && agg.cost <= agg.budget;
    $('verdict').classList.add('show');
    $('vt').innerHTML = pass
      ? '<span class="ok">Good enough: ' + agg.kept + ' / ' + MORNINGS + ' mornings.</span>'
      : '<span class="bad">Not yet: ' + agg.kept + ' / ' + MORNINGS + ' mornings.</span>';

    let wi = -1;
    let wscore = 99;
    state.results.forEach((r, i) => {
      const sc = r.exact * 2 - r.dupes;
      if (sc < wscore) { wscore = sc; wi = i; }
    });
    const worst = state.results[wi];
    const wrow = worst ? worst.rows.slice().sort((x, y) => y.delivered - x.delivered)[0] : null;
    const tail = wrow && wrow.delivered > 1
      ? ' · worst: morning ' + (wi + 1) + ', ' + wrow.delivered + ' copies for ' + wrow.label
      : worst && worst.lost > 0
        ? ' · worst: morning ' + (wi + 1) + ', a letter never arrived'
        : ' · every letter at most once';
    $('vs').textContent = agg.cost + ' / ' + agg.budget + ' coins' + tail;
    const next = $('next') as HTMLButtonElement;
    next.disabled = state.day >= SCENARIOS.length - 1;
    next.textContent = state.day >= SCENARIOS.length - 1 ? 'That is the whole slice' : 'Next day →';
    draw();
  }

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
    $('clock').textContent = 'morning ' + Math.min(state.index + 1, MORNINGS) + '/' + MORNINGS;
  }

  function drawMap() {
    const svg = $('map');
    const sim = state.sim;
    if (!sim) return;
    const F = sim.flightDays;
    const parts: string[] = [];

    for (const [a, b] of [['A', 'B'], ['B', 'C'], ['A', 'C']]) {
      const r = routeFor(a, b);
      parts.push(`<path class="route" d="M ${r.p1.x} ${r.p1.y} Q ${r.c.x} ${r.c.y} ${r.p2.x} ${r.p2.y}" />`);
      const m = quad(r.p1, r.c, r.p2, 0.5);
      parts.push(`<text class="routelabel" x="${m.x}" y="${m.y - 12}" text-anchor="middle">${F} days</text>`);
    }

    for (const id of ['A', 'B', 'C']) {
      const p = cityPos(id);
      const c = CITIES[id];
      const toHere = sim.deliveries.filter((d) => sim.letters.find((l) => l.id === d.letterId)!.to === id);
      const remote = sim.scenario.remote && id === 'B';
      parts.push(`<g class="city">
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
        parts.push(`<g class="stack" transform="translate(${p.x + 38 + i * 13},${p.y - 10})">
          <rect x="0" y="0" width="14" height="9" rx="1.5" fill="#f2e6c8" stroke="#b99a52" />
          <path d="M 0 0 L 7 5 L 14 0" fill="none" stroke="#b99a52" />
          ${d.number ? `<text x="7" y="-4" text-anchor="middle">${d.number}</text>` : ''}
        </g>`);
      });
    }

    const total = 1.2 + F;
    parts.push('<defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#1b2230"/></pattern></defs><rect x="0" y="0" width="800" height="430" fill="url(#dots)" opacity="0.65"/>');

    let jitter = 0;
    for (const a of sim.attempts) {
      if (a.status !== 'moving') continue;
      const u = Math.max(0, Math.min(1, (sim.now - a.start) / total));
      const flyStart = 0.6 / total;
      const flyEnd = (0.6 + F) / total;
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
          parts.push('<rect x="' + (gp.x - 8) + '" y="' + (gp.y - 13) + '" width="16" height="11" rx="2" fill="#f2e6c8" opacity="' + (0.18 / g) + '" />');
        }
      }
      const focused = state.focus === a.letterId;
      parts.push(
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
      const lost = sim.scenario.lostReceipts.some((r) => r.letter === l.seq);
      if (lost && prog > 0.55) continue;
      const r = routeFor(l.to, l.from);
      const p = quad(r.p1, r.c, r.p2, prog);
      const fade = lost ? Math.max(0.15, 1 - Math.max(0, prog - 0.3) / 0.25) : 1;
      parts.push(
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
      parts.push('<circle cx="' + p.x + '" cy="' + p.y + '" r="' + (28 + 36 * k) + '" fill="none" stroke="#3fb950" stroke-width="' + (2.2 * (1 - k)) + '" opacity="' + (0.5 * (1 - k)) + '" />');
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI * 2 * i) / 6;
        const rad = 26 + 30 * k;
        parts.push('<circle cx="' + (p.x + Math.cos(ang) * rad) + '" cy="' + (p.y + Math.sin(ang) * rad) + '" r="1.7" fill="#3fb950" opacity="' + (0.75 * (1 - k)) + '" />');
      }
    }

    // the office stamp, while a letter is processed
    for (const a of sim.attempts) {
      if (a.status !== 'moving') continue;
      const u = (sim.now - a.start) / total;
      const s0 = 0.6 / total;
      const s1 = 0.8 / total;
      if (u < s0 || u > s1 + 0.08) continue;
      const p = cityPos(a.from);
      const k = Math.min(1, (u - s0) / (s1 - s0));
      const sc = 0.75 + 0.25 * k;
      const fade = u > s1 ? Math.max(0, 1 - (u - s1) / 0.08) : 1;
      parts.push(
        '<g transform="translate(' + (p.x - 26) + ' ' + (p.y + 24) + ') scale(' + sc + ')" opacity="' + (0.9 * fade) + '">' +
          '<circle r="9" fill="none" stroke="#b4453a" stroke-width="1.4" />' +
          '<path d="M -4 0 L -1 3 L 5 -3" fill="none" stroke="#b4453a" stroke-width="1.6" />' +
          '</g>',
      );
    }

    svg.innerHTML = parts.join('');
    svg.querySelectorAll<SVGElement>('.letter').forEach((node) => {
      node.addEventListener('click', () => {
        const id = node.getAttribute('data-letter');
        state.focus = state.focus === id ? null : id;
        $('log').innerHTML = '';
        state.drawnLog = 0;
        draw();
      });
    });
  }

  function drawPanels() {
    const sim = state.sim;
    if (!sim) return;
    const agg = aggregate();
    if (state.ended) {
      $('promiseState').innerHTML = '<span class="' + (agg.kept >= 17 && agg.cost <= agg.budget ? 'ok' : 'bad') + '">' + agg.kept + ' / ' + MORNINGS + '</span>';
    } else {
      $('promiseState').innerHTML = '<span style="color:var(--dim);font-size:12px">' + agg.kept + ' / ' + Math.max(agg.n, 1) + ' so far</span>';
    }
    $('cost').textContent = agg.cost + ' / ' + agg.budget + ' coins';
    $('cost').className = 'mono' + (agg.cost > agg.budget ? ' bad' : '');
    $('promise').innerHTML =
      'Promise: every letter once, within ' + sim.scenario.deadline + ' days, with a signed slip back.';

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
    $('title').innerHTML = sc.title + ' <span>· day ' + sc.day + '  ·  ' + MORNINGS + ' mornings</span>';
    $('days').innerHTML = SCENARIOS.map(
      (s, i) => '<button data-d="' + i + '" class="' + (i === n ? 'on' : '') + '">' + s.day + '</button>',
    ).join('');
    $('days').querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
      b.addEventListener('click', () => setDay(Number(b.dataset.d)));
    });
    renderRules();
    newCampaign();
  }
  $('run').addEventListener('click', () => {
    if (state.playing) {
      stop();
      $('run').textContent = '▶ Resume';
    } else play();
  });
  $('reset').addEventListener('click', () => newCampaign());
  $('skip').addEventListener('click', () => runAllMornings());
  $('again').addEventListener('click', () => newCampaign());
  $('next').addEventListener('click', () => {
    if (state.day < SCENARIOS.length - 1) setDay(state.day + 1);
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
