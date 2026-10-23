/**
 * Illustration: One request, one lost reply (WIP).
 *
 * Unit 0 of a distributed-systems course, as a single instrument panel: one
 * fixed workload (a small ledger), four pre-built designs, a fault dial, a
 * trace, invariant checks, and a seed sweep. The reader never writes a design;
 * they switch between shipped ones and watch the tradeoff move.
 *
 * Styles live in a shadow root so the lab's dense panel styling cannot leak
 * into (or be broken by) the site's prose styles.
 */
import type { SceneFactory } from '../lib/registry.ts';
import { createSim, DESIGNS, type Design, type Sim, type Summary } from './distributed-sim.ts';

const CSS = `
:host { display: block; }
* { box-sizing: border-box; }
.wrap {
  --line: #242a34; --panel: #12151b; --panel2: #171b22;
  --text: #e6e9ef; --dim: #8b94a3; --dimmer: #5c6472;
  --blue: #58a6ff; --green: #3fb950; --red: #f85149; --amber: #d29922; --violet: #a371f7;
  color: var(--text);
  font: 13.5px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
  border: 1px solid var(--line); border-radius: 12px; overflow: hidden;
  background: #0e1116;
}
.mono { font-family: "SF Mono", ui-monospace, Menlo, monospace; font-variant-numeric: tabular-nums; }
button {
  font: inherit; font-size: 12px; color: var(--text); background: var(--panel2);
  border: 1px solid var(--line); border-radius: 7px; padding: 6px 10px; cursor: pointer;
}
button:hover { border-color: #3a4350; }
button.primary { background: #17303f; border-color: #235068; color: #cdeaf7; }
button.primary:hover { background: #1b3a4c; }
button:disabled { opacity: .45; cursor: default; }
input[type="number"], select {
  font: inherit; font-size: 12px; color: var(--text); background: var(--panel2);
  border: 1px solid var(--line); border-radius: 7px; padding: 5px 7px;
}
input[type="range"] { accent-color: var(--blue); height: 18px; }

.bar { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; padding: 9px 12px; border-bottom: 1px solid var(--line); background: #0f1319; }
.bar .lbl { font-size: 9.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--dimmer); }
.bar #seed { width: 70px; }
.bar .spacer { flex: 1; }
.bar .speed { display: flex; align-items: center; gap: 6px; }
.bar .speed input { width: 82px; }
.bar .speed .val { font-size: 11px; color: var(--dim); width: 22px; }

.predictbar { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; padding: 8px 12px; border-bottom: 1px solid var(--line); background: #0c1015; font-size: 11.5px; }
.predictbar .tag { font-size: 9.5px; letter-spacing: .13em; text-transform: uppercase; color: var(--blue); }
.predictbar .q { color: var(--dim); }
.predictbar .verdict { margin-left: auto; color: var(--text); }
.predictbar .verdict b { color: var(--blue); }
.miss { color: var(--amber); }

.shelf { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; padding: 11px 12px 4px; }
.card { border: 1px solid var(--line); background: var(--panel); border-radius: 9px; padding: 8px 10px; cursor: pointer; transition: border-color .12s, background .12s; }
.card:hover { border-color: #37404e; }
.card.on { border-color: var(--blue); background: #141c24; }
.card .top { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
.card .id { font: 600 9.5px/1 "SF Mono", monospace; color: #0b0d10; background: var(--dim); width: 15px; height: 15px; display: grid; place-items: center; border-radius: 4px; flex: none; }
.card.on .id { background: var(--blue); }
.card .nm { font-size: 12px; font-weight: 560; }
.card .tag { font-size: 8.5px; color: var(--dimmer); text-transform: uppercase; letter-spacing: .08em; margin-left: auto; }
.card .body { font-size: 10.5px; color: var(--dim); line-height: 1.38; }
.card .body .k { color: var(--dimmer); font-size: 8.5px; text-transform: uppercase; letter-spacing: .06em; margin-right: 4px; }
.card .body .crow { margin-top: 2px; }

.faults { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 8px 12px 12px; }
.fault label { display: flex; justify-content: space-between; font-size: 11px; color: var(--dim); }
.fault label .val { color: var(--text); }
.fault input { width: 100%; }

.stage { border-top: 1px solid var(--line); }
.topo { position: relative; height: 84px; padding: 0 14px; background: #0c1016; border-bottom: 1px solid var(--line); }
.node { position: absolute; top: 22px; width: 104px; padding: 6px 9px; border-radius: 8px; border: 1px solid var(--line); background: var(--panel); font-size: 11px; }
.node.left { left: 14px; }
.node.right { right: 14px; }
.node .n { font-weight: 600; font-size: 11.5px; }
.node .s { color: var(--dim); font-size: 10px; margin-top: 1px; }
.wire { position: absolute; left: 130px; right: 130px; height: 1px; background: #2a3140; transition: background .15s, box-shadow .15s; }
.wire.w1 { top: 42px; }
.wire.w2 { top: 62px; }
.wire .lab { position: absolute; left: 50%; transform: translate(-50%, -140%); font-size: 8.5px; letter-spacing: .09em; text-transform: uppercase; color: var(--dimmer); background: #0c1016; padding: 0 5px; }
.wire.pulse { background: var(--blue); box-shadow: 0 0 10px rgba(88,166,255,.5); }

.stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: var(--line); border-bottom: 1px solid var(--line); }
.stat { background: var(--panel); padding: 9px 11px; }
.stat .k { font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: var(--dimmer); margin-bottom: 3px; }
.stat .v { font-size: 18px; font-weight: 520; letter-spacing: -.02em; }
.stat .v.bad { color: var(--red); }
.stat .v.good { color: var(--green); }
.stat .sub { font-size: 9.5px; color: var(--dimmer); }

.inv { padding: 9px 12px; }
.inv .line { display: flex; align-items: center; gap: 8px; font-size: 11.5px; padding: 3px 0; }
.pill { font: 600 8.5px/1 "SF Mono", monospace; letter-spacing: .06em; padding: 3px 5px; border-radius: 4px; flex: none; }
.pill.pass { color: #052e16; background: var(--green); }
.pill.fail { color: #450a0a; background: var(--red); }
.pill.note { color: var(--amber); background: transparent; border: 1px solid #4a3a12; }
.inv .txt { color: var(--dim); }
.inv .txt b { color: var(--text); font-weight: 500; }

.tracebox { border-top: 1px solid var(--line); }
.th { display: flex; justify-content: space-between; align-items: baseline; padding: 8px 12px 6px; }
.th h3 { font-size: 9.5px; letter-spacing: .13em; text-transform: uppercase; color: var(--dimmer); margin: 0; font-weight: 600; }
.th .clock { font-size: 10px; color: var(--dimmer); }
.rows { height: 230px; overflow-y: auto; padding: 0 12px 8px; font-size: 11px; }
.rows .empty { color: var(--dimmer); padding: 10px 0; }
.row { display: grid; grid-template-columns: 62px 46px 1fr; gap: 6px; padding: 1.5px 0; border-bottom: 1px solid #151a21; }
.row .t { color: var(--dimmer); font-size: 10px; }
.row .n { font-size: 8.5px; letter-spacing: .05em; text-transform: uppercase; color: var(--dimmer); padding-top: 1px; }
.row .x { color: #b6bec9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.row.send .x { color: var(--blue); }
.row.drop .x { color: var(--red); }
.row.dup .x { color: var(--amber); }
.row.apply .x { color: var(--green); }
.row.dedup .x { color: var(--violet); }
.row.retry .x { color: var(--amber); }
.row.done .x { color: var(--green); }
.row.timeout .x { color: var(--red); }

.chart { border-top: 1px solid var(--line); padding: 11px 12px 14px; }
.ch { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 9px; }
.ch h3 { font-size: 9.5px; letter-spacing: .13em; text-transform: uppercase; color: var(--dimmer); margin: 0; font-weight: 600; }
.bar-row { display: grid; grid-template-columns: 150px 1fr 46px; gap: 8px; align-items: center; margin-bottom: 6px; font-size: 11px; }
.bar-row .nm { color: var(--dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-row .nm b { color: var(--text); font-weight: 500; }
.bar-row .track { height: 13px; background: #171b22; border-radius: 3px; overflow: hidden; }
.bar-row .fill { height: 100%; background: #3b82f6; border-radius: 3px; transition: width .3s; }
.bar-row .fill.zero { background: var(--green); }
.bar-row .n { text-align: right; }
.hint { font-size: 10.5px; color: var(--dimmer); margin-top: 6px; line-height: 1.45; }

.lesson { margin-top: 13px; padding-top: 10px; border-top: 1px solid var(--line); }
.lesson h3 { font-size: 9px; letter-spacing: .13em; text-transform: uppercase; color: var(--dimmer); margin: 0 0 6px; font-weight: 600; }
.lesson ul { margin: 0; padding-left: 15px; }
.lesson li { font-size: 11px; color: var(--dim); line-height: 1.5; margin-bottom: 3px; }
.lesson b { color: var(--text); font-weight: 500; }

@media (max-width: 640px) {
  .shelf { grid-template-columns: 1fr; }
  .faults { grid-template-columns: 1fr; gap: 8px; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .predictbar .verdict { margin-left: 0; width: 100%; }
  .bar-row { grid-template-columns: 110px 1fr 40px; }
}
`;

const HTML = `
<div class="wrap">
  <div class="bar">
    <span class="lbl">seed</span>
    <input type="number" id="seed" value="1" min="0" max="999999" />
    <button id="rand" title="Random seed">rnd</button>
    <button id="play" class="primary">▶ Run</button>
    <button id="step" title="Advance one event">›|</button>
    <button id="reset" title="Reset">↺</button>
    <span class="spacer"></span>
    <span class="speed"><input type="range" id="speed" min="0" max="4" value="1" step="1" /><span class="val mono" id="vSpeed">1×</span></span>
  </div>

  <div class="predictbar">
    <span class="tag">Predict</span>
    <span class="q">how many of the 60 operations get applied twice?</span>
    <select id="predict">
      <option value="0">0 — dedup is not needed</option>
      <option value="1">about 1</option>
      <option value="3" selected>about 3</option>
      <option value="6">about 6</option>
      <option value="12">about 12</option>
    </select>
    <span class="verdict" id="verdict"></span>
  </div>

  <div class="shelf" id="shelf"></div>

  <div class="faults">
    <div class="fault">
      <label for="reqDrop">Request loss <span class="val mono" id="vReq">5%</span></label>
      <input type="range" id="reqDrop" min="0" max="30" value="5" />
    </div>
    <div class="fault">
      <label for="respDrop">Reply loss <span class="val mono" id="vResp">5%</span></label>
      <input type="range" id="respDrop" min="0" max="30" value="5" />
    </div>
    <div class="fault">
      <label for="dup">Duplication <span class="val mono" id="vDup">2%</span></label>
      <input type="range" id="dup" min="0" max="20" value="2" />
    </div>
  </div>

  <div class="stage">
    <div class="topo">
      <div class="node left"><div class="n">client</div><div class="s" id="clientSub">idle</div></div>
      <div class="wire w1" id="wire1"><span class="lab">request</span></div>
      <div class="wire w2" id="wire2"><span class="lab">reply</span></div>
      <div class="node right"><div class="n">server</div><div class="s" id="serverSub">0 applied</div></div>
    </div>

    <div class="stats">
      <div class="stat"><div class="k">On the wire</div><div class="v mono" id="mSent">0</div><div class="sub">requests sent</div></div>
      <div class="stat"><div class="k">Applied</div><div class="v mono" id="mApplied">0</div><div class="sub">effects on state</div></div>
      <div class="stat"><div class="k">Duplicates</div><div class="v mono" id="mDup">0</div><div class="sub">extra effects</div></div>
      <div class="stat"><div class="k">p99</div><div class="v mono" id="mP99">—</div><div class="sub">completion</div></div>
      <div class="stat"><div class="k">Failed</div><div class="v mono" id="mFail">0</div><div class="sub">gave up</div></div>
    </div>

    <div class="inv" id="inv"></div>
  </div>

  <div class="tracebox">
    <div class="th"><h3>Trace</h3><span class="clock mono" id="clock">t = 0.000 s</span></div>
    <div class="rows" id="rows"><div class="empty">Press Run. Then switch designs with the seed fixed.</div></div>
  </div>

  <div class="chart">
    <div class="ch">
      <h3>Same workload, four designs · 60 seeds each</h3>
      <button id="sweep" style="padding:4px 9px;font-size:11px">Run sweep</button>
    </div>
    <div id="bars"><div class="empty" style="color:var(--dimmer);font-size:11px">Running the sweep…</div></div>
    <div class="hint" id="sweepNote"></div>

    <div class="lesson">
      <h3>What to notice</h3>
      <ul>
        <li><b>A and B</b> apply the same operation twice: backoff changes the timing, not the correctness.</li>
        <li><b>C and D</b> apply it once. The fix is the request's identity, not the retry policy.</li>
        <li><b>I1 stays green</b> while money is spent twice. A check only catches what it checks.</li>
      </ul>
    </div>
  </div>
</div>
`;

const scene: SceneFactory = (el) => {
  const shadow = el.shadowRoot ?? el.attachShadow({ mode: 'open' });
  shadow.innerHTML = '<style>' + CSS + '</style>' + HTML;

  const $ = <T extends HTMLElement = HTMLElement>(id: string) => shadow.querySelector('#' + id) as T;

  const state = {
    design: 'A',
    seed: 1,
    speed: 1,
    playing: false,
    faults: { reqDrop: 0.05, respDrop: 0.05, dup: 0.02 },
    sim: null as Sim | null,
    drawn: 0,
    lastFrame: 0,
    predicted: 3,
    timer: null as ReturnType<typeof setInterval> | null,
    flash: new Map<string, ReturnType<typeof setTimeout>>(),
  };

  function buildSim() {
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
    state.sim = createSim({ seed: state.seed, design: state.design, faults: state.faults });
    state.sim.start();
    state.drawn = 0;
    state.playing = false;
    $('play').textContent = '▶ Run';
    $('rows').innerHTML = '<div class="empty">Press Run. Then switch designs with the seed fixed.</div>';
    $('verdict').textContent = '';
    renderShelf();
    render();
  }

  function renderShelf() {
    $('shelf').innerHTML = Object.values(DESIGNS)
      .map(
        (d: Design) => `
      <div class="card ${state.design === d.id ? 'on' : ''}" data-d="${d.id}">
        <div class="top"><span class="id">${d.id}</span><span class="nm">${d.name}</span><span class="tag">${d.tag}</span></div>
        <div class="body">
          <div class="crow"><span class="k">assumes</span>${d.assumption}</div>
          <div class="crow"><span class="k">does</span>${d.mechanism}</div>
          <div class="crow"><span class="k">fixes</span>${d.fixes} <span class="k" style="margin-left:5px">costs</span>${d.price}</div>
        </div>
      </div>`,
      )
      .join('');
    shadow.querySelectorAll<HTMLElement>('.card').forEach((card) => {
      card.addEventListener('click', () => {
        state.design = card.dataset.d || 'A';
        buildSim();
      });
    });
  }

  const fmt = (s: number) => (s / 1000).toFixed(3);

  function render() {
    const sim = state.sim;
    if (!sim) return;
    const sm: Summary = sim.summary();
    $('mSent').textContent = String(sm.sent);
    $('mApplied').textContent = String(sm.applied);
    $('mDup').textContent = String(sm.dupEffects);
    $('mDup').className = 'v mono ' + (sm.dupEffects > 0 ? 'bad' : 'good');
    $('mP99').textContent = sm.completed ? sm.p99 + ' ms' : '—';
    $('mFail').textContent = String(sm.failed);
    $('clock').textContent = 't = ' + fmt(sim.now) + ' s';
    $('serverSub').textContent = sm.applied + ' applied';
    $('clientSub').textContent = sim.done ? 'finished' : state.playing ? 'running' : sim.now === 0 ? 'idle' : 'paused';

    const i1note = sm.dupEffects > 0 ? '<span class="pill note">check passed, system wrong</span>' : '';
    $('inv').innerHTML = `
      <div class="line"><span class="pill ${sm.conserved ? 'pass' : 'fail'}">${sm.conserved ? 'PASS' : 'FAIL'}</span>
        <span class="txt"><b>I1</b> money is conserved — Σ balances = ${sm.total}</span>${i1note}</div>
      <div class="line"><span class="pill ${sm.doubleBooked ? 'fail' : 'pass'}">${sm.doubleBooked ? 'FAIL' : 'PASS'}</span>
        <span class="txt"><b>I2</b> no seat is double-booked${sm.doubleBooked ? ' — ' + sm.doubleBooked + ' seats' : ''}</span></div>
      <div class="line"><span class="pill ${sm.dupEffects ? 'fail' : 'pass'}">${sm.dupEffects ? 'FAIL' : 'PASS'}</span>
        <span class="txt"><b>I5</b> each operation has exactly one effect${sm.dupEffects ? ' — ' + sm.dupEffects + ' extra' : ''}</span></div>`;
  }

  function flash(id: string) {
    const wire = $(id);
    wire.classList.add('pulse');
    const prev = state.flash.get(id);
    if (prev) clearTimeout(prev);
    state.flash.set(
      id,
      setTimeout(() => {
        wire.classList.remove('pulse');
        state.flash.delete(id);
      }, 180),
    );
  }

  function appendTrace() {
    const sim = state.sim;
    if (!sim) return;
    const tr = sim.trace;
    const box = $('rows');
    if (state.drawn === 0) box.innerHTML = '';
    for (let i = state.drawn; i < tr.length; i++) {
      const e = tr[i];
      const row = document.createElement('div');
      row.className = 'row ' + e.kind;
      row.innerHTML = '<span class="t mono">' + fmt(e.t) + '</span><span class="n">' + e.node + '</span><span class="x">' + e.text + '</span>';
      box.appendChild(row);
      if (e.kind === 'send') flash('wire1');
      if (e.kind === 'recv' && e.node === 'client') flash('wire2');
    }
    state.drawn = tr.length;
    if (tr.length) box.scrollTop = box.scrollHeight;
  }

  function finishRun() {
    const sim = state.sim;
    if (!sim) return;
    const sm = sim.summary();
    const ok = Math.abs(sm.dupEffects - state.predicted) <= 1;
    $('verdict').innerHTML =
      'predicted <b>' + state.predicted + '</b> · observed <b>' + sm.dupEffects + '</b> ' +
      (ok ? '<span style="color:var(--green)">— close</span>' : '<span class="miss">— the gap is the lesson</span>');
  }

  function tick() {
    if (!state.playing || !state.sim) return;
    const ts = performance.now();
    const dt = Math.min(100, ts - state.lastFrame || 16);
    state.lastFrame = ts;
    state.sim.runUntil(state.sim.now + dt * state.speed * 0.9);
    render();
    appendTrace();
    if (state.sim.done) {
      state.playing = false;
      if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
      }
      $('play').textContent = '▶ Run';
      finishRun();
    }
  }

  function play() {
    if (!state.sim) return;
    if (state.sim.done) buildSim();
    state.playing = true;
    $('play').textContent = '⏸ Pause';
    state.lastFrame = performance.now();
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(tick, 30);
  }

  function runSweep() {
    const out: Record<string, { dup: number; p99: number; failed: number }> = {};
    const N = 60;
    for (const id of Object.keys(DESIGNS)) {
      const res: Summary[] = [];
      for (let s = 1; s <= N; s++) {
        const sim = createSim({ seed: s, design: id, faults: state.faults, recordTrace: false });
        sim.start();
        res.push(sim.runAll());
      }
      const mean = (k: 'dupEffects' | 'p99' | 'failed') => res.reduce((a, b) => a + b[k], 0) / res.length;
      out[id] = { dup: mean('dupEffects'), p99: Math.round(mean('p99')), failed: mean('failed') };
    }
    renderBars(out);
  }

  function renderBars(out: Record<string, { dup: number; p99: number; failed: number }>) {
    const max = Math.max(1, ...Object.values(out).map((o) => o.dup));
    $('bars').innerHTML = Object.values(DESIGNS)
      .map((d) => {
        const o = out[d.id];
        return `<div class="bar-row">
          <div class="nm"><b>${d.id}</b> ${d.name}</div>
          <div class="track"><div class="fill ${o.dup < 0.05 ? 'zero' : ''}" style="width:${Math.max(o.dup > 0 ? 2 : 0, (o.dup / max) * 100)}%"></div></div>
          <div class="n mono">${o.dup.toFixed(1)}</div>
        </div>`;
      })
      .join('');
    $('sweepNote').innerHTML =
      'Bars: mean duplicate effects over 60 seeds. ' +
      Object.values(DESIGNS)
        .map((d) => d.id + ' p99 ' + out[d.id].p99 + ' ms')
        .join(' · ') +
      '. Backoff (B) buys politeness, not correctness: its duplicate count matches A.';
  }

  $('play').addEventListener('click', () => {
    if (state.playing) {
      state.playing = false;
      if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
      }
      $('play').textContent = '▶ Run';
    } else {
      play();
    }
  });

  $('step').addEventListener('click', () => {
    state.playing = false;
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
    $('play').textContent = '▶ Run';
    const moved = state.sim?.stepEvent();
    render();
    appendTrace();
    if (!moved) finishRun();
  });

  $('reset').addEventListener('click', () => buildSim());

  $('rand').addEventListener('click', () => {
    state.seed = Math.floor(Math.random() * 100000);
    ($('seed') as HTMLInputElement).value = String(state.seed);
    buildSim();
  });

  $('seed').addEventListener('input', (e) => {
    const v = Number((e.target as HTMLInputElement).value) || 0;
    state.seed = v;
    buildSim();
  });

  $('reqDrop').addEventListener('input', (e) => {
    const v = Number((e.target as HTMLInputElement).value);
    state.faults.reqDrop = v / 100;
    $('vReq').textContent = v + '%';
    buildSim();
  });
  $('respDrop').addEventListener('input', (e) => {
    const v = Number((e.target as HTMLInputElement).value);
    state.faults.respDrop = v / 100;
    $('vResp').textContent = v + '%';
    buildSim();
  });
  $('dup').addEventListener('input', (e) => {
    const v = Number((e.target as HTMLInputElement).value);
    state.faults.dup = v / 100;
    $('vDup').textContent = v + '%';
    buildSim();
  });

  $('speed').addEventListener('input', (e) => {
    state.speed = Number((e.target as HTMLInputElement).value) || 1;
    $('vSpeed').textContent = state.speed + '×';
  });

  $('predict').addEventListener('change', (e) => {
    state.predicted = Number((e.target as HTMLSelectElement).value);
  });

  $('sweep').addEventListener('click', () => {
    const btn = $('sweep') as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = 'Running…';
    setTimeout(() => {
      runSweep();
      btn.disabled = false;
      btn.textContent = 'Run sweep';
    }, 30);
  });

  buildSim();
  const initSweep = setTimeout(runSweep, 80);

  return {
    destroy() {
      if (state.timer) clearInterval(state.timer);
      clearTimeout(initSweep);
      state.flash.forEach((t) => clearTimeout(t));
      state.flash.clear();
      shadow.innerHTML = '';
    },
  };
};

export default scene;
