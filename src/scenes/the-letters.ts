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
import { createDay, RULES, SCENARIOS, CITIES, type Day } from './the-letters-sim.ts';

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
    <span class="clock mono"><b id="clock">day 0.0</b> / <span id="limit">5</span></span>
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
      <h3 class="grp" style="margin-bottom:8px">Post office rules</h3>
      <div class="rulegrid" id="rules"></div>
      <div style="font-size:9.5px;color:var(--dimmer);margin-top:6px;line-height:1.4">Rules apply to all three offices. Prices are per letter, in postage.</div>
    </div>
    <div>
      <div class="score">
        <div class="head"><span class="big" id="promiseState">in progress</span><span class="mono" id="cost" style="font-size:10.5px;color:var(--dim)"></span></div>
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
    playing: false,
    speed: 2,
    timer: null as ReturnType<typeof setInterval> | null,
    drawnLog: 0,
    focus: null as string | null,
    ended: false,
  };

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
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
  }

  function newSim() {
    stop();
    state.ended = false;
    state.drawnLog = 0;
    state.focus = null;
    state.sim = createDay({ scenario: state.day, rules: state.rules });
    $('verdict').classList.remove('show');
    $('log').innerHTML = '';
    $('run').textContent = '▶ Run';
    draw();
  }

  function play() {
    if (state.ended) newSim();
    state.playing = true;
    $('run').textContent = '⏸ Pause';
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(step, 33);
  }

  function step() {
    if (!state.playing || !state.sim) return;
    state.sim.tick(0.033 * state.speed * 0.9);
    draw();
    if (state.sim.now >= state.sim.scenario.deadline + 2) finish();
  }

  function finish() {
    stop();
    state.ended = true;
    if (!state.sim) return;
    const s = state.sim.summary();
    $('verdict').classList.add('show');
    $('vt').innerHTML = s.promise ? '<span class="ok">Promise kept.</span>' : '<span class="bad">Promise broken.</span>';
    const reasons: string[] = [];
    s.rows.forEach((r) => {
      if (r.delivered === 0) reasons.push(r.label + ' never arrived');
      else if (r.delivered > 1) reasons.push(r.label + ' arrived ' + r.delivered + ' times');
      else if (!r.onTime) reasons.push(r.label + ' arrived late');
    });
    $('vs').textContent =
      (reasons.length ? reasons.join(' · ') + '. ' : 'All three letters, once each. ') + s.cost + ' coins of postage.';
    const next = $('next') as HTMLButtonElement;
    next.disabled = state.day >= SCENARIOS.length - 1;
    next.textContent = state.day >= SCENARIOS.length - 1 ? 'That is the whole slice' : 'Next day →';
    draw();
  }

  function draw() {
    if (!state.sim) return;
    drawMap();
    drawPanels();
    drawLog();
    $('clock').textContent = 'day ' + Math.min(state.sim.now, state.sim.scenario.deadline).toFixed(1);
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
    let jitter = 0;
    for (const a of sim.attempts) {
      if (a.status !== 'moving') continue;
      const u = Math.max(0, Math.min(1, (sim.now - a.start) / total));
      const flyStart = 0.6 / total;
      const flyEnd = (0.6 + F) / total;
      let p: { x: number; y: number };
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
        p.y -= 8;
      }
      parts.push(`<g class="letter" data-letter="${a.letterId}" style="cursor:pointer">
        <rect x="${p.x - 10}" y="${p.y - 7}" width="20" height="14" rx="2" />
        <path d="M ${p.x - 10} ${p.y - 7} L ${p.x} ${p.y} L ${p.x + 10} ${p.y - 7}" />
        ${a.number ? `<text x="${p.x}" y="${p.y - 11}" text-anchor="middle">${a.number}</text>` : ''}
      </g>`);
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
    const s = sim.summary();
    $('promiseState').innerHTML = state.ended
      ? s.promise
        ? '<span class="ok">Kept</span>'
        : '<span class="bad">Broken</span>'
      : '<span style="color:var(--dim);font-size:12px">in progress</span>';
    $('cost').textContent = s.cost + ' coins';

    $('rows').innerHTML = s.rows
      .map((r) => {
        const status =
          r.delivered === 0
            ? state.ended
              ? '<span class="bad">never</span>'
              : '<span style="color:var(--dimmer)">in transit</span>'
            : r.delivered > 1
              ? `<span class="bad">${r.delivered} copies</span>`
              : '<span class="ok">1 copy</span>';
        return `<div class="srow"><div class="l"><b>${r.label}</b></div><div class="c">${status}</div><div class="t mono">${r.first === null ? '—' : r.first.toFixed(1) + 'd'}</div></div>`;
      })
      .join('');
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
        ['numbering', 'Numbering'],
        ['receipts', 'Receipts'],
        ['retry', 'If no receipt'],
        ['ledger', 'At the far office'],
      ] as [string, string][]
    )
      .map(([key, label]) => {
        const opts = RULES[key]
          .map((o) => {
            const disabled = key === 'ledger' && state.rules.numbering === 'none';
            const on = state.rules[key] === o.id;
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
        newSim();
      });
    });
  }

  function setDay(n: number) {
    state.day = n;
    const sc = SCENARIOS[n];
    $('title').innerHTML = sc.title + ' <span>· day ' + sc.day + '</span>';
    $('limit').textContent = String(sc.deadline);
    $('days').innerHTML = SCENARIOS.map(
      (s, i) => `<button data-d="${i}" class="${i === n ? 'on' : ''}">${s.day}</button>`,
    ).join('');
    $('days').querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
      b.addEventListener('click', () => setDay(Number(b.dataset.d)));
    });
    renderRules();
    newSim();
  }

  $('run').addEventListener('click', () => {
    if (state.playing) {
      stop();
      $('run').textContent = '▶ Resume';
    } else play();
  });
  $('reset').addEventListener('click', () => newSim());
  $('again').addEventListener('click', () => newSim());
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
      newSim();
    }
    state.sim?.runAll();
    finish();
  }

  return {
    destroy() {
      stop();
      shadow.innerHTML = '';
    },
  };
};

export default scene;
