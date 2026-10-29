/**
 * Act II — The Registry.
 *
 * Damage, not boolean. Three records with different stakes; a policy per
 * record; ten worlds run a write for each record. The rank is relative to the
 * brute-forced optimum, so there is no single right answer.
 */
import type { SceneFactory } from '../lib/registry.ts';
import {
  RECORDS,
  WORLDS,
  evaluate,
  optimumDamage,
  rankFor,
  defaultPolicies,
  type RecordId,
  type Conflict,
  type Quorum,
  type Policies,
  type Cell,
} from './the-registry-sim.ts';

const CSS = `
:host { display: block; }
* { box-sizing: border-box; }
.wrap { --line:#242a34; --panel:#12151b; --panel2:#171b22; --text:#e6e9ef; --dim:#8b94a3; --dimmer:#5c6472; --blue:#58a6ff; --green:#3fb950; --red:#f85149; --amber:#d29922; --violet:#a371f7; --gold:#e3b341; color:var(--text); font:13.5px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif; border:1px solid var(--line); border-radius:12px; overflow:hidden; background:#0e1116; }
.mono { font-family:"SF Mono",ui-monospace,Menlo,monospace; font-variant-numeric:tabular-nums; }
button { font:inherit; color:var(--text); background:var(--panel2); border:1px solid var(--line); border-radius:6px; padding:4px 7px; cursor:pointer; font-size:11px; }
button:hover { border-color:#3a4350; }
button.on { border-color:var(--gold); background:#211d12; color:var(--gold); }
.bar { display:flex; align-items:center; gap:8px; padding:9px 12px; border-bottom:1px solid var(--line); background:#0f1319; flex-wrap:wrap; }
.bar .title { font-size:12.5px; font-weight:560; }
.bar .title span { color:var(--dimmer); font-weight:400; }
.bar .spacer { flex:1; }
.clock { font-size:10.5px; color:var(--dim); }
.brief { padding:10px 14px 9px; border-bottom:1px solid var(--line); background:linear-gradient(180deg,#11161d,#0d1116); }
.brief-title { font-size:12px; font-weight:600; }
.brief-copy { font-size:10.5px; color:var(--dim); line-height:1.5; margin-top:3px; max-width:800px; }
.brief-goal { font-size:9.5px; color:var(--dimmer); margin-top:5px; }
.brief-goal b { color:var(--gold); font-weight:600; letter-spacing:.04em; }
.guide { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-top:8px; }
.gstep { border:1px solid var(--line); border-radius:7px; background:#10151d; padding:6px 8px; }
.gstep b { display:block; font-size:10px; color:var(--gold); font-weight:600; }
.gstep span { display:block; font-size:9.5px; color:var(--dim); line-height:1.4; margin-top:2px; }
.terms { display:flex; gap:6px; flex-wrap:wrap; margin-top:7px; }
.term { font-size:9.5px; color:var(--dim); border:1px solid var(--line); border-radius:99px; padding:2px 7px; }
.term b { color:var(--text); font-weight:600; }
.hintline { font-size:9.5px; color:var(--dimmer); line-height:1.4; margin-top:6px; }
.policy-line { font-size:9px; color:var(--dim); line-height:1.4; margin-top:5px; min-height:26px; }
.legend { font-size:8.5px; color:var(--dimmer); flex-basis:100%; margin-top:1px; }
@media (max-width:800px) { .guide { grid-template-columns:1fr; } }
.body { display:grid; grid-template-columns:1fr 330px; }
.main { min-width:0; border-right:1px solid var(--line); }
.side { min-width:0; }
.records { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; padding:12px 12px 8px; }
.rec { border:1px solid var(--line); border-radius:9px; background:var(--panel); padding:9px 9px 7px; min-width:0; }
.rec-head { display:flex; justify-content:space-between; gap:6px; align-items:baseline; }
.rec-head b { font-size:12px; font-weight:560; }
.rec-head span { font-size:8.5px; color:var(--dimmer); text-align:right; }
.grp { font-size:8.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--dimmer); margin:7px 0 3px; font-weight:600; }
.seg, .opts { display:flex; gap:3px; flex-wrap:wrap; }
.chip { flex:1; min-width:0; text-align:center; font-size:10px; padding:3px 4px; }
.rec-dmg { display:flex; justify-content:space-between; margin-top:7px; border-top:1px solid #171d26; padding-top:5px; font-size:9.5px; color:var(--dim); }
.rec-dmg b { color:var(--text); font-weight:500; }
.rail { display:flex; align-items:center; gap:8px; padding:8px 12px; border-top:1px solid var(--line); border-bottom:1px solid var(--line); background:#0f1319; flex-wrap:wrap; }
.rail-label { font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--dimmer); }
.hint { font-size:9.5px; color:var(--dimmer); }
.tiles { display:flex; gap:4px; flex-wrap:wrap; }
.tile { width:38px; height:28px; padding:0; border-radius:6px; background:#1a2029; border:1px solid #333d4b; color:var(--dim); font-size:9.5px; font-weight:600; display:grid; place-items:center; }
.tile.ok { background:#102219; border-color:#2b5d3b; color:#7ee2a8; }
.tile.warn { background:#221d10; border-color:#5a4a1c; color:#e3c37a; }
.tile.bad { background:#2a1316; border-color:#6e2b31; color:#ff9b9b; }
.tile.sel { box-shadow:0 0 0 1px var(--gold); }
.detail { margin:0 12px 12px; border:1px solid var(--line); border-radius:9px; background:#10151d; padding:9px 11px; font-size:10px; color:var(--dim); line-height:1.45; }
.detail b { color:var(--text); font-weight:560; }
.drow { display:grid; grid-template-columns:78px 1fr 58px; gap:7px; padding:3px 0; border-top:1px solid #171d26; }
.drow .x { color:var(--text); }
.drow .d { text-align:right; color:var(--text); }
.score { padding:12px; }
.score-rank { display:flex; align-items:center; gap:9px; margin-bottom:6px; }
.rank { width:34px; height:34px; border-radius:9px; display:grid; place-items:center; font-size:17px; font-weight:650; border:1px solid var(--line); background:#141922; color:var(--dim); flex:none; }
.rank.s { background:var(--gold); border-color:var(--gold); color:#0d1117; }
.rank.a { background:#102219; border-color:#2b5d3b; color:#7ee2a8; }
.rank.b { background:#221d10; border-color:#5a4a1c; color:var(--amber); }
.rank.c { background:#2a1316; border-color:#6e2b31; color:#ff9b9b; }
.kicker { font-size:8.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--dimmer); }
.big { font-size:20px; font-weight:600; }
.best { margin-left:auto; text-align:right; font-size:8.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--dimmer); line-height:1.45; flex:none; }
.best b { display:block; font-size:10px; font-weight:500; letter-spacing:0; text-transform:none; color:var(--text); }
.stat { display:flex; justify-content:space-between; gap:8px; font-size:10px; color:var(--dim); padding:2px 0; border-bottom:1px solid #171d26; }
.stat b { color:var(--text); font-weight:500; }
.target { font-size:9.5px; color:var(--dimmer); margin:6px 0 2px; line-height:1.35; }
.bars { margin-top:8px; }
.brow { display:grid; grid-template-columns:64px 1fr 44px; gap:6px; align-items:center; font-size:9px; color:var(--dim); margin:4px 0; }
.track { height:5px; border-radius:999px; background:#1b222c; overflow:hidden; }
.track i { display:block; height:100%; width:0; }
.track i.lost { background:var(--red); }
.track i.refused { background:var(--amber); }
.track i.slow { background:var(--blue); }
.per { margin-top:8px; border-top:1px solid var(--line); padding-top:5px; }
.per .row { display:flex; justify-content:space-between; font-size:9.5px; color:var(--dim); padding:2px 0; }
.per .row b { color:var(--text); font-weight:500; }
@media (max-width:800px) { .body { grid-template-columns:1fr; } .main { border-right:none; border-bottom:1px solid var(--line); } .records { grid-template-columns:1fr; } }
`;

const HTML = `
<div class="wrap">
  <div class="bar"><span class="title">The Registry <span>· three records, one damage bill</span></span><span class="spacer"></span><span class="clock mono">10 worlds</span></div>
  <div class="brief">
    <div class="brief-title">Your job: run Porto's record office. Lower the damage bill.</div>
    <div class="brief-copy">Every world tries a write for all three records. Three decisions explain the whole game:</div>
    <div class="guide">
      <div class="gstep"><b>1 · Quorum</b><span>How many offices must confirm before a write counts. 1 is fast and brittle; 3 is safe but slow and often unavailable.</span></div>
      <div class="gstep"><b>2 · Conflict</b><span>What happens when two writes collide: silent last-writer-wins, refund the loser, or send both to a human clerk.</span></div>
      <div class="gstep"><b>3 · Damage</b><span>Lost + turned away + slow. Lower is better. S is within 10% of the best possible policy set.</span></div>
    </div>
    <div class="terms"><span class="term"><b>Silent</b> cheapest; a lost write is invisible.</span><span class="term"><b>Notify</b> refund the losing buyer; safe, costs more.</span><span class="term"><b>Clerk</b> keep both; a human resolves; fee + delay.</span></div>
    <div class="hintline">The signup list can tolerate a silent loss. The land deed cannot. That is why one policy does not fit all three records.</div>
  </div>
  <div class="body">
    <div class="main">
      <div class="records" id="records"></div>
      <div class="rail"><span class="rail-label">Worlds</span><div class="tiles" id="tiles"></div><span class="hint">click a world to inspect</span><span class="legend">tile = total damage · green clean · amber turned away · red lost</span></div>
      <div class="detail" id="detail"></div>
    </div>
    <div class="side">
      <div class="score">
        <div class="score-rank"><span class="rank" id="rank">—</span><div><div class="kicker">Damage</div><div class="big" id="total">—</div></div><div class="best"><span>BEST</span><b id="best">—</b></div></div>
        <div class="stat"><span>Best possible</span><b id="optimum">—</b></div>
        <div class="stat"><span>S target</span><b id="target">—</b></div>
        <div class="target" id="note"></div>
        <div class="bars">
          <div class="brow"><span>Lost</span><div class="track"><i class="lost" id="barLost"></i></div><span class="mono" id="lost">0</span></div>
          <div class="brow"><span>Turned away</span><div class="track"><i class="refused" id="barRefused"></i></div><span class="mono" id="refused">0</span></div>
          <div class="brow"><span>Slow</span><div class="track"><i class="slow" id="barSlow"></i></div><span class="mono" id="slow">0</span></div>
        </div>
        <div class="per" id="perRecord"></div>
      </div>
    </div>
  </div>
</div>
`;

const scene: SceneFactory = (el) => {
  const shadow = el.shadowRoot ?? el.attachShadow({ mode: 'open' });
  shadow.innerHTML = '<style>' + CSS + '</style>' + HTML;
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => shadow.querySelector('#' + id) as T;

  const state: { policies: Policies; selected: number; best: number | null } = {
    policies: defaultPolicies(),
    selected: 0,
    best: null,
  };

  const BEST_KEY = 'registry:v2:best';
  function loadBest(): number | null {
    try {
      const raw = localStorage.getItem(BEST_KEY);
      if (raw === null) return null;
      const n = Number(raw);
      return Number.isFinite(n) && n >= 0 ? n : null;
    } catch {
      return null;
    }
  }
  function saveBest(total: number) {
    if (state.best !== null && total >= state.best) return;
    state.best = total;
    try { localStorage.setItem(BEST_KEY, String(total)); } catch {}
  }

  const labelCut = (cut: string) => cut === 'none' ? 'roads open' : cut === 'A' ? 'Porto isolated' : cut === 'B' ? 'Kyoto isolated' : cut === 'C' ? 'Denver isolated' : 'all roads cut';
  const labelOutcome = (o: string) => o === 'lostSilent' ? 'both accepted; one lost silently' : o === 'lostNotified' ? 'both accepted; loser refunded' : o === 'clerk' ? 'both accepted; sent to a clerk' : o === 'one refused' ? 'one accepted; one turned away' : o === 'both refused' ? 'no quorum; both turned away' : o === 'refused' ? 'no quorum; turned away' : 'committed';

  function policyNote(p: { quorum: Quorum; conflict: Conflict }): string {
    const q = p.quorum === 1 ? 'One office can accept alone.' : p.quorum === 2 ? 'Two offices must agree.' : 'All three offices must agree.';
    const c = p.conflict === 'silent' ? 'A collision can vanish without telling the buyer.' : p.conflict === 'notify' ? 'A collision is refused and the buyer is refunded.' : 'A collision goes to a human clerk (slow, fee).';
    return q + ' ' + c;
  }

  function renderRecords(perRecord: Record<RecordId, number>) {
    $('records').innerHTML = RECORDS.map((rec) => {
      const p = state.policies[rec.id];
      const qLabels: Record<number, string> = { 1: 'Fast; one office can accept alone.', 2: 'Majority; may refuse during a cut.', 3: 'All three; slow and often refuses.' };
      const cLabels: Record<Conflict, string> = { silent: 'Cheapest; a lost write is silent.', notify: 'Refund the losing buyer.', clerk: 'Keep both; a human resolves.' };
      const q = [1, 2, 3].map((n) => '<button class="chip' + (p.quorum === n ? ' on' : '') + '" title="' + qLabels[n] + '" data-q="' + n + '" data-rec="' + rec.id + '">' + n + '</button>').join('');
      const c = (['silent', 'notify', 'clerk'] as Conflict[]).map((x) => '<button class="chip' + (p.conflict === x ? ' on' : '') + '" title="' + cLabels[x] + '" data-c="' + x + '" data-rec="' + rec.id + '">' + (x === 'silent' ? 'Silent' : x === 'notify' ? 'Notify' : 'Clerk') + '</button>').join('');
      return '<div class="rec"><div class="rec-head"><b>' + rec.label + '</b><span>stakes ' + rec.stakes + (rec.refundable ? ' · refundable' : ' · no refund') + '</span></div>' +
        '<div class="grp">Quorum · offices that must agree</div><div class="seg">' + q + '</div>' +
        '<div class="grp">Conflict · what happens to the loser</div><div class="opts">' + c + '</div>' +
        '<div class="policy-line">' + policyNote(p) + '</div>' +
        '<div class="rec-dmg"><span>damage</span><b class="mono">' + perRecord[rec.id].toFixed(1) + '</b></div></div>';
    }).join('');
    $('records').querySelectorAll<HTMLButtonElement>('[data-q]').forEach((b) => b.addEventListener('click', () => {
      state.policies[b.dataset.rec as RecordId].quorum = Number(b.dataset.q) as Quorum;
      update();
    }));
    $('records').querySelectorAll<HTMLButtonElement>('[data-c]').forEach((b) => b.addEventListener('click', () => {
      state.policies[b.dataset.rec as RecordId].conflict = b.dataset.c as Conflict;
      update();
    }));
  }

  function renderDetail(cells: Record<RecordId, Cell>, worldId: number) {
    const world = WORLDS[worldId];
    const rows = RECORDS.map((rec) => {
      const cell = cells[rec.id];
      return '<div class="drow"><span>' + rec.label + '</span><span class="x">' + labelOutcome(cell.outcome) + (cell.days ? ' · ' + cell.days + 'd' : '') + '</span><span class="d mono">' + cell.damage.toFixed(1) + '</span></div>';
    }).join('');
    $('detail').innerHTML = '<b>World ' + (world.id + 1) + ' · ' + labelCut(world.cut) + ' · ' + (world.two ? 'two conflicting writes' : 'single write at ' + (world.origin ?? 'A')) + '.</b>' + rows;
  }

  function update() {
    const out = evaluate(state.policies);
    const opt = optimumDamage();
    const rank = rankFor(out.total);
    saveBest(out.total);
    $('rank').textContent = rank;
    $('rank').className = 'rank ' + rank.toLowerCase();
    $('total').textContent = out.total.toFixed(1);
    $('optimum').textContent = opt.toFixed(1);
    $('target').textContent = '≤ ' + (opt * 1.1).toFixed(1);
    const gap = out.total - opt;
    $('note').textContent = 'Your bill ' + out.total.toFixed(1) + '. Best possible ' + opt.toFixed(1) + '. S is ≤ ' + (opt * 1.1).toFixed(1) + '. Lost costs the most; turned away is an unserved customer; slow is delay.' + (gap > 0.05 ? ' You are ' + gap.toFixed(1) + ' above the optimum.' : '');
    $('lost').textContent = out.lost.toFixed(1);
    $('refused').textContent = out.refused.toFixed(1);
    $('slow').textContent = out.slow.toFixed(1);
    $('barLost').style.width = Math.min(100, (out.lost / Math.max(out.total, 1)) * 100) + '%';
    $('barRefused').style.width = Math.min(100, (out.refused / Math.max(out.total, 1)) * 100) + '%';
    $('barSlow').style.width = Math.min(100, (out.slow / Math.max(out.total, 1)) * 100) + '%';
    $('best').textContent = state.best === null ? '—' : state.best.toFixed(1);
    $('perRecord').innerHTML = RECORDS.map((rec) => '<div class="row"><span>' + rec.label + '</span><b class="mono">' + out.perRecord[rec.id].toFixed(1) + '</b></div>').join('');
    renderRecords(out.perRecord);
    $('tiles').innerHTML = out.worlds.map((w, i) => {
      const tone = w.lost > 0 ? 'bad' : w.refused > 0 ? 'warn' : 'ok';
      return '<button class="tile ' + tone + (i === state.selected ? ' sel' : '') + '" data-i="' + i + '" title="World ' + (i + 1) + ' · total damage ' + w.total.toFixed(1) + ' · click to inspect">' + w.total.toFixed(1) + '</button>';
    }).join('');
    $('tiles').querySelectorAll<HTMLButtonElement>('[data-i]').forEach((b) => b.addEventListener('click', () => {
      state.selected = Number(b.dataset.i);
      update();
    }));
    renderDetail(out.worlds[state.selected].cells, state.selected);
  }

  state.best = loadBest();
  update();

  return {
    destroy() { shadow.innerHTML = ''; },
  };
};

export default scene;
