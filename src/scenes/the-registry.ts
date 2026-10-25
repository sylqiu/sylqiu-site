/**
 * The Registry — first slice of the next edition.
 *
 * One deed, three offices, two buyers. You are Porto. You only see your own
 * office and the letters that reach it. Ten independent worlds; choose a
 * write quorum and a conflict rule, then inspect the failures.
 */
import type { SceneFactory } from '../lib/registry.ts';
import {
  runAll,
  scoreWorlds,
  type Policy,
  type Quorum,
  type Conflict,
  type WorldResult,
  WORLDS,
  DEFAULT_BUDGET,
} from './the-registry-sim.ts';

const CSS = `
:host { display: block; }
* { box-sizing: border-box; }
.wrap { --line:#242a34; --panel:#12151b; --panel2:#171b22; --text:#e6e9ef; --dim:#8b94a3; --dimmer:#5c6472; --blue:#58a6ff; --green:#3fb950; --red:#f85149; --amber:#d29922; --violet:#a371f7; --gold:#e3b341; color:var(--text); font:13.5px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif; border:1px solid var(--line); border-radius:12px; overflow:hidden; background:#0e1116; }
.mono { font-family:"SF Mono",ui-monospace,Menlo,monospace; font-variant-numeric:tabular-nums; }
button { font:inherit; color:var(--text); background:var(--panel2); border:1px solid var(--line); border-radius:7px; padding:5px 9px; cursor:pointer; font-size:12px; }
button:hover { border-color:#3a4350; }
button:disabled { opacity:.4; cursor:default; }
.bar { display:flex; align-items:center; gap:8px; padding:9px 12px; border-bottom:1px solid var(--line); background:#0f1319; flex-wrap:wrap; }
.bar .title { font-size:12.5px; font-weight:560; }
.bar .title span { color:var(--dimmer); font-weight:400; }
.bar .spacer { flex:1; }
.clock { font-size:10.5px; color:var(--dim); }
.brief { padding:10px 14px 9px; border-bottom:1px solid var(--line); background:linear-gradient(180deg,#11161d,#0d1116); }
.brief-title { font-size:12px; font-weight:600; }
.brief-copy { font-size:10.5px; color:var(--dim); line-height:1.5; margin-top:3px; max-width:760px; }
.brief-goal { font-size:9.5px; color:var(--dimmer); margin-top:5px; }
.brief-goal b { color:var(--gold); font-weight:600; letter-spacing:.04em; }
.body { display:grid; grid-template-columns:1fr 340px; }
.main { min-width:0; border-right:1px solid var(--line); }
.side { min-width:0; }
.worldhead { padding:12px 14px 6px; display:flex; justify-content:space-between; gap:10px; align-items:baseline; }
.worldhead b { font-size:13px; font-weight:560; }
.worldhead span { font-size:10.5px; color:var(--dimmer); }
.offices { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; padding:4px 14px 10px; }
.office { border:1px solid var(--line); border-radius:9px; background:var(--panel); padding:9px 10px; min-width:0; }
.office.you { border-color:#5a4a1c; background:#1c1a12; }
.office .tag { font-size:8px; letter-spacing:.12em; text-transform:uppercase; color:var(--dimmer); }
.office.you .tag { color:var(--gold); }
.office .name { font-size:13px; font-weight:560; margin-top:1px; }
.office .status { font-size:10px; color:var(--dim); margin-top:4px; line-height:1.4; }
.office .status.ok { color:var(--green); }
.office .status.bad { color:var(--red); }
.detail { margin:0 14px 10px; border:1px solid var(--line); border-radius:9px; background:#10151d; padding:10px 12px; min-height:58px; font-size:10.5px; color:var(--dim); line-height:1.5; }
.detail b { color:var(--text); font-weight:560; }
.rail { display:flex; align-items:center; gap:8px; padding:8px 12px; border-top:1px solid var(--line); border-bottom:1px solid var(--line); background:#0f1319; flex-wrap:wrap; }
.rail-label { font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--dimmer); }
.hint { font-size:9.5px; color:var(--dimmer); }
.tiles { display:flex; gap:4px; flex-wrap:wrap; }
.tile { width:30px; height:24px; padding:0; border-radius:6px; background:#1a2029; border:1px solid #333d4b; color:var(--dim); font-size:10.5px; font-weight:600; display:grid; place-items:center; }
.tile.ok { background:#102219; border-color:#2b5d3b; color:#7ee2a8; }
.tile.bad { background:#2a1316; border-color:#6e2b31; color:#ff9b9b; }
.tile.sel { box-shadow:0 0 0 1px var(--gold); }
.score { padding:12px; border-bottom:1px solid var(--line); }
.score-rank { display:flex; align-items:center; gap:9px; margin-bottom:5px; }
.rank { width:34px; height:34px; border-radius:9px; display:grid; place-items:center; font-size:17px; font-weight:650; border:1px solid var(--line); background:#141922; color:var(--dim); flex:none; }
.rank.s { background:var(--gold); border-color:var(--gold); color:#0d1117; }
.rank.a { background:#102219; border-color:#2b5d3b; color:#7ee2a8; }
.rank.b { background:#221d10; border-color:#5a4a1c; color:var(--amber); }
.rank.c { background:#2a1316; border-color:#6e2b31; color:#ff9b9b; }
.kicker { font-size:8.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--dimmer); }
.big { font-size:16px; font-weight:560; }
.best { margin-left:auto; text-align:right; font-size:8.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--dimmer); line-height:1.45; flex:none; }
.best b { display:block; font-size:10px; font-weight:500; letter-spacing:0; text-transform:none; color:var(--text); }
.stat { display:flex; justify-content:space-between; gap:8px; font-size:10.5px; color:var(--dim); padding:3px 0; border-bottom:1px solid #171d26; }
.stat b { color:var(--text); font-weight:500; }
.track { height:4px; border-radius:999px; background:#1b222c; overflow:hidden; margin:7px 0 5px; }
.track i { display:block; height:100%; width:0; background:var(--green); }
.track i.over { background:var(--red); }
.why { font-size:9.5px; color:var(--dimmer); line-height:1.4; margin-top:4px; }
.rules { padding:12px; }
.grp { font-size:9px; letter-spacing:.13em; text-transform:uppercase; color:var(--dimmer); margin:8px 0 5px; font-weight:600; }
.opt { display:block; width:100%; text-align:left; background:var(--panel); border:1px solid var(--line); border-radius:7px; padding:5px 7px; margin-bottom:4px; cursor:pointer; color:var(--text); }
.opt.on { border-color:var(--gold); background:#1c1a12; }
.opt .row { display:flex; justify-content:space-between; gap:6px; align-items:baseline; }
.opt .nm { font-size:11px; font-weight:520; }
.opt .pr { font-size:10px; color:var(--gold); }
.opt .note { font-size:9.5px; color:var(--dimmer); line-height:1.3; margin-top:1px; display:none; }
.opt.on .note { display:block; }
@media (max-width:760px) { .body { grid-template-columns:1fr; } .main { border-right:none; border-bottom:1px solid var(--line); } .offices { grid-template-columns:1fr; } }
`;

const HTML = `
<div class="wrap">
  <div class="bar">
    <span class="title">Postmarked: The Registry <span>· one deed, three offices</span></span>
    <span class="spacer"></span>
    <span class="clock mono" id="clock">10 worlds</span>
  </div>
  <div class="brief">
    <div class="brief-title">Keep the deed single-owner.</div>
    <div class="brief-copy">You are the postmaster in Porto. A deed can be sold once. Two buyers, two offices, and a road that can be cut. Choose a write quorum and a conflict rule; ten worlds are scored at once, and you can click a result to see what happened.</div>
    <div class="brief-goal"><b>PASS</b> deed intact 10 / 10 · ≥10 acknowledged writes · ≤40 postage · <b>S</b> for a clean, available run</div>
  </div>
  <div class="body">
    <div class="main">
      <div class="worldhead"><b id="worldTitle">World 1</b><span id="worldSub"></span></div>
      <div class="offices" id="offices"></div>
      <div class="detail" id="detail"></div>
      <div class="rail"><span class="rail-label">Results</span><div class="tiles" id="tiles"></div><span class="hint">click a result to inspect</span></div>
    </div>
    <div class="side">
      <div class="score">
        <div class="score-rank"><span class="rank" id="rank">—</span><div><div class="kicker">Scoreboard</div><div class="big" id="safe">—</div></div><div class="best"><span>BEST</span><b id="best">—</b></div></div>
        <div class="stat"><span>Deed intact</span><b id="safe2">—</b></div>
        <div class="stat"><span>Acknowledged writes</span><b id="avail">—</b></div>
        <div class="stat"><span>Postage</span><b id="cost">—</b></div>
        <div class="track"><i id="bar"></i></div>
        <div class="why" id="why"></div>
      </div>
      <div class="rules" id="rules"></div>
    </div>
  </div>
</div>
`;

const scene: SceneFactory = (el) => {
  const shadow = el.shadowRoot ?? el.attachShadow({ mode: 'open' });
  shadow.innerHTML = '<style>' + CSS + '</style>' + HTML;
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => shadow.querySelector('#' + id) as T;

  const state: { policy: Policy; results: WorldResult[]; selected: number; best: { safe: number; available: number; cost: number } | null } = {
    policy: { quorum: 2, conflict: 'lww' },
    results: [],
    selected: 0,
    best: null,
  };

  const bestKey = 'registry:best';
  function loadBest() {
    try {
      const raw = localStorage.getItem(bestKey);
      if (!raw) return null;
      const b = JSON.parse(raw);
      if (b && typeof b.safe === 'number' && typeof b.available === 'number' && typeof b.cost === 'number') return b;
    } catch {}
    return null;
  }
  function saveBest(score: ReturnType<typeof scoreWorlds>) {
    if (!score.pass) return;
    const cur = state.best;
    const better = !cur || score.safe > cur.safe || (score.safe === cur.safe && score.available > cur.available) || (score.safe === cur.safe && score.available === cur.available && score.cost < cur.cost);
    if (!better) return;
    state.best = { safe: score.safe, available: score.available, cost: score.cost };
    try { localStorage.setItem(bestKey, JSON.stringify(state.best)); } catch {}
  }

  function recompute() {
    state.results = runAll(state.policy);
    const score = scoreWorlds(state.results);
    if (state.selected >= state.results.length) state.selected = 0;
    saveBest(score);
    render();
  }

  function renderRules() {
    const quorums: { q: Quorum; label: string; note: string }[] = [
      { q: 1, label: 'One office', note: 'Accept locally. Fast, but a partition can acknowledge two conflicting sales.' },
      { q: 2, label: 'Majority (2 of 3)', note: 'Balanced. One side of a cut may refuse, but conflicts cannot both commit.' },
      { q: 3, label: 'All three', note: 'Safest, but a single cut makes every transfer wait.' },
    ];
    $('rules').innerHTML =
      '<div class="grp">Write quorum</div>' +
      quorums.map((o) => '<button class="opt ' + (state.policy.quorum === o.q ? 'on' : '') + '" data-q="' + o.q + '"><div class="row"><span class="nm">' + o.label + '</span><span class="pr mono">' + o.q + ' ack' + (o.q > 1 ? 's' : '') + '</span></div><div class="note">' + o.note + '</div></button>').join('') +
      '<div class="grp" style="margin-top:10px">Conflict rule</div>' +
      ([['lww', 'Last writer wins', 'On reconnect, the newest postmark wins; the other acknowledged sale is lost.'], ['reject', 'Reject conflicts', 'On reconnect, conflicting writes are refused; an acknowledged sale can still be lost at quorum 1.']] as [Conflict, string, string][])
        .map(([id, label, note]) => '<button class="opt ' + (state.policy.conflict === id ? 'on' : '') + '" data-c="' + id + '"><div class="row"><span class="nm">' + label + '</span></div><div class="note">' + note + '</div></button>').join('');
    $('rules').querySelectorAll<HTMLButtonElement>('[data-q]').forEach((b) => b.addEventListener('click', () => {
      state.policy.quorum = Number(b.dataset.q) as Quorum;
      recompute();
    }));
    $('rules').querySelectorAll<HTMLButtonElement>('[data-c]').forEach((b) => b.addEventListener('click', () => {
      state.policy.conflict = b.dataset.c as Conflict;
      recompute();
    }));
  }

  function renderOffices(w: WorldResult) {
    const cut = w.cut;
    const office = (id: string, name: string, you: boolean, committed: boolean | null, remote: boolean) => {
      const tag = you ? 'YOU · PORTO' : remote ? 'REMOTE' : 'NOTARY';
      let status = '';
      let cls = '';
      if (committed === true) { status = 'Accepted a transfer.'; cls = 'ok'; }
      else if (committed === false) { status = 'Refused: no quorum.'; cls = 'bad'; }
      else { status = 'Holds a replica of the deed.'; }
      return '<div class="office ' + (you ? 'you' : '') + '"><div class="tag">' + tag + '</div><div class="name">' + name + '</div><div class="status ' + cls + '">' + status + '</div></div>';
    };
    $('offices').innerHTML =
      office('A', 'Porto', true, w.aCommitted, false) +
      office('B', 'Kyoto', false, null, true) +
      office('C', 'Denver', false, w.cCommitted, true);
    $('worldTitle').textContent = 'World ' + (w.id + 1);
    $('worldSub').textContent = cut === 'no cut' ? 'roads open' : cut;
  }

  function render() {
    const score = scoreWorlds(state.results);
    const w = state.results[state.selected] ?? state.results[0];
    renderOffices(w);
    $('safe').textContent = score.safe + ' / ' + WORLDS;
    $('safe2').textContent = score.safe + ' / ' + WORLDS;
    $('avail').textContent = score.available + ' / ' + (WORLDS * 2);
    $('cost').textContent = score.cost + ' / ' + DEFAULT_BUDGET;
    $('cost').className = score.cost > DEFAULT_BUDGET ? 'bad' : '';
    $('bar').style.width = Math.min(100, (score.cost / DEFAULT_BUDGET) * 100) + '%';
    $('bar').className = score.cost > DEFAULT_BUDGET ? 'over' : '';
    $('rank').textContent = score.rank;
    $('rank').className = 'rank ' + score.rank.toLowerCase();
    $('best').textContent = state.best ? state.best.safe + '/10 · ' + state.best.available + '/20 · ' + state.best.cost + 'c' : '—';
    $('why').textContent = score.pass
      ? 'Deed intact and the office stayed useful.'
      : score.safe < WORLDS
        ? (WORLDS - score.safe) + ' worlds acknowledged a transfer that was later lost.'
        : score.available < 10
          ? 'Safe, but too many transfers were refused. A quorum that is never available is not useful.'
          : 'Over the postage budget.';
    $('why').style.color = score.pass ? 'var(--green)' : 'var(--red)';
    $('detail').innerHTML = '<b>World ' + (w.id + 1) + ' · ' + w.cut + '.</b> ' + w.detail;
    $('tiles').innerHTML = state.results.map((r, i) => '<button class="tile ' + (r.safe ? 'ok' : 'bad') + (i === state.selected ? ' sel' : '') + '" data-i="' + i + '" title="' + (r.safe ? 'deed intact' : 'lost acknowledged write') + '">' + (i + 1) + '</button>').join('');
    $('tiles').querySelectorAll<HTMLButtonElement>('[data-i]').forEach((b) => b.addEventListener('click', () => {
      state.selected = Number(b.dataset.i);
      render();
    }));
    renderRules();
  }

  state.best = loadBest();
  recompute();

  return {
    destroy() { shadow.innerHTML = ''; },
  };
};

export default scene;
