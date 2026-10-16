/**
 * Illustration: kv-cache — where a decoder-only transformer's speed comes from.
 *
 * A stand-in transformer (4 layers x 4 heads x 8 dims, fixed hash-seeded
 * weights) generates text one token at a time. Left: the K and V rows the cache
 * holds for one (layer, head) slice. Right: the attention the newest query pays
 * to every cached key. Below: the multiply-accumulates a real model spends per
 * token and the memory its cache occupies at a chosen context length.
 *
 * Deterministic — every number comes from hash-seeded vectors, so a reload
 * reproduces exactly the same picture.
 *
 * Not a lesson scene (no narration beats), but it uses the same factory
 * contract: append into `host`, return destroy().
 */
import type { SceneFactory } from '../lib/registry.ts';

const NS = 'http://www.w3.org/2000/svg';

const C = {
  fg: '#e6edf3',
  dim: '#8b949e',
  line: '#2a3140',
  panel: '#161b22',
  panel2: '#1c2230',
  accent: '#58a6ff',
  ok: '#3fb950',
  warn: '#d29922',
  bad: '#f85149',
  teal: '#39c5cf',
  purple: '#a371f7',
};

/* ------------------------------- tiny model ------------------------------- */

const LAYERS = 4;
const HEADS = 4;
const D = 8; // head dimension (cells drawn)
const MAX_POS = 12; // prompt + generated positions kept in view
const SHARP = 3.2; // attention temperature knob (exaggerated so it is visible)
const PROMPT = ['<bos>', 'a', 'transformer', 'reads'];
const VOCAB = ['the', 'prompt', 'once', 'and', 'reuses', 'every', 'key', 'cached', 'so', 'each', 'step', 'stays', 'cheap', 'then', 'it', 'keeps', 'typing', 'along'];

type Vec = number[];

/** FNV-ish hash over integers: the only source of randomness here. */
function hash(...vals: number[]): number {
  let h = 0x811c9dc5;
  for (const v of vals) {
    h = Math.imul(h ^ (v | 0), 0x01000193);
    h ^= h >>> 15;
  }
  return h >>> 0;
}
const u01 = (...v: number[]) => hash(...v) / 4294967296;

function gauss(...v: number[]): number {
  const a = Math.max(1e-6, u01(...v, 977));
  const b = u01(...v, 131);
  return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b);
}

const memo = new Map<string, Vec>();
function cachedVec(tag: string, make: () => Vec): Vec {
  const hit = memo.get(tag);
  if (hit) return hit;
  const v = make();
  memo.set(tag, v);
  return v;
}

function unit(fill: (i: number) => number): Vec {
  const v: Vec = [];
  let s = 0;
  for (let i = 0; i < D; i++) {
    v.push(fill(i));
    s += v[i] * v[i];
  }
  const n = Math.sqrt(s) || 1;
  for (let i = 0; i < D; i++) v[i] /= n;
  return v;
}

/** Key vector for a position — the thing the cache stores. */
const keyVec = (l: number, h: number, p: number): Vec =>
  cachedVec(`k:${l}:${h}:${p}`, () => unit((i) => gauss(l, h, p, i, 11)));

/** Value vector for a position — also cached, also reused every step. */
const valVec = (l: number, h: number, p: number): Vec =>
  cachedVec(`v:${l}:${h}:${p}`, () => unit((i) => gauss(l, h, p, i, 22)));

/** Query for a position: mostly "look at the previous token", plus spread. */
const queryVec = (l: number, h: number, p: number): Vec =>
  cachedVec(`q:${l}:${h}:${p}`, () => {
    const prev = keyVec(l, h, Math.max(0, p - 1));
    return unit((i) => 0.85 * prev[i] + 0.55 * gauss(l, h, p, i, 33));
  });

const dot = (a: Vec, b: Vec): number => {
  let s = 0;
  for (let i = 0; i < D; i++) s += a[i] * b[i];
  return s;
};

function softmax(logits: Vec): Vec {
  const m = Math.max(...logits);
  const ex = logits.map((x) => Math.exp(x - m));
  const s = ex.reduce((a, b) => a + b, 0) || 1;
  return ex.map((x) => x / s);
}

/** Weights the newest query puts on each cached key (causal: 0 .. q-1). */
function attention(l: number, h: number, q: number): Vec {
  if (q <= 0) return [];
  const query = queryVec(l, h, q);
  const logits: Vec = [];
  for (let p = 0; p < q; p++) logits.push(SHARP * dot(query, keyVec(l, h, p)));
  return softmax(logits);
}

/** The attention-weighted sum of cached values: what the layer passes on. */
function context(l: number, h: number, q: number, a: Vec): Vec {
  const out: Vec = new Array(D).fill(0);
  for (let p = 0; p < q; p++) {
    const v = valVec(l, h, p);
    for (let i = 0; i < D; i++) out[i] += a[p] * v[i];
  }
  return out;
}

/** Deterministic "sampling": the context picks the next word. */
function sampleToken(q: number): string {
  const a = attention(0, 0, q);
  const ctx = context(0, 0, q, a);
  const h = hash(q, Math.round(ctx[0] * 512), Math.round(ctx[1] * 512), Math.round(ctx[2] * 512), Math.round(ctx[3] * 512));
  return VOCAB[h % VOCAB.length];
}

/**
 * Multiply-accumulates for one decode step, summed over layers and heads.
 *   cached   -> project only the new token, attend to n cached keys: 2d^2 + 2nd
 *   uncached -> re-project every past token as well:            2(n+1)d^2 + 2nd
 * The extra term is the quadratic part old-style recomputation pays for.
 */
function stepMacs(past: number, cached: boolean): number {
  const proj = cached ? 2 * D * D : (past + 1) * 2 * D * D;
  const attn = 2 * past * D;
  return (proj + attn) * LAYERS * HEADS;
}

/* -------------------------------- memory -------------------------------- */

interface ModelDef {
  id: string;
  label: string;
  layers: number;
  kvHeads: number;
  headDim: number;
  note: string;
}
const MODELS: ModelDef[] = [
  { id: 'gpt2', label: 'GPT-2 small · 12L · 12 heads (MHA)', layers: 12, kvHeads: 12, headDim: 64, note: 'Every query head gets its own K and V head.' },
  { id: 'l2-7b', label: 'Llama-2 7B · 32L · 32 heads (MHA)', layers: 32, kvHeads: 32, headDim: 128, note: 'The 0.5 MB/token everyone quotes.' },
  { id: 'l3-8b', label: 'Llama-3 8B · 32L · 8 KV heads (GQA)', layers: 32, kvHeads: 8, headDim: 128, note: 'Grouped-query attention: 4 query heads per KV head.' },
  { id: 'l2-70b', label: 'Llama-2 70B · 80L · 8 KV heads (GQA)', layers: 80, kvHeads: 8, headDim: 128, note: '64 query heads share 8 KV heads — the cache shrinks 8x.' },
];
const PRECS = [
  { id: 'fp16', label: 'fp16 · 2 bytes', bytes: 2 },
  { id: 'fp8', label: 'fp8 · 1 byte', bytes: 1 },
  { id: 'int4', label: 'int4 · 0.5 bytes', bytes: 0.5 },
];

const bytesPerToken = (m: ModelDef, b: number) => 2 * m.layers * m.kvHeads * m.headDim * b;

function fmtBytes(n: number): string {
  if (n >= 1024 ** 3) return (n / 1024 ** 3).toFixed(n >= 10 * 1024 ** 3 ? 0 : 1) + ' GiB';
  if (n >= 1024 ** 2) return (n / 1024 ** 2).toFixed(n >= 10 * 1024 ** 2 ? 0 : 1) + ' MiB';
  if (n >= 1024) return (n / 1024).toFixed(n >= 10 * 1024 ? 0 : 1) + ' KiB';
  return Math.round(n) + ' B';
}
function fmtMacs(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + ' G';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + ' M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + ' k';
  return String(Math.round(n));
}

/* --------------------------------- svg ---------------------------------- */

function s<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

interface TxtOpts {
  fill?: string;
  size?: number;
  anchor?: 'start' | 'middle' | 'end';
  mono?: boolean;
  opacity?: number;
  weight?: number;
}
function txt(x: number, y: number, content: string, o: TxtOpts = {}): SVGTextElement {
  const t = s('text', {
    x,
    y,
    fill: o.fill ?? C.dim,
    'font-size': o.size ?? 11,
    'text-anchor': o.anchor ?? 'start',
    'font-family': o.mono === false ? 'inherit' : 'ui-monospace, SFMono-Regular, Menlo, monospace',
  });
  if (o.opacity !== undefined) t.setAttribute('opacity', String(o.opacity));
  if (o.weight !== undefined) t.setAttribute('font-weight', String(o.weight));
  t.textContent = content;
  return t;
}

/* geometry */
const VB_W = 720;
const VB_H = 428;
const ROW_TOP = 64;
const ROW_H = 24;
const X_TOKEN = 22;
const X_K = 76;
const X_V = 180;
const CELL_W = 10;
const CELL_GAP = 2;
const CELL_H = 18;
const CELL_PITCH = CELL_W + CELL_GAP;
const X_ATTN = 300;
const ATTN_W = 286;

const BIN_COLORS = C.bad;

/* --------------------------------- host ---------------------------------- */

const kvCache: SceneFactory = (host) => {
  /* ------------------------------- state ------------------------------- */
  const tokens = [...PROMPT];
  let filled = PROMPT.length; // positions whose K/V are in the cache
  let lastQuery = -1; // position whose attention is on screen
  let attn: Vec | null = null;
  let layer = 0;
  let head = 0;
  let useCache = true;
  let running = false;
  let dead = false;
  let timer: number | null = null;
  let pulseTimer: number | null = null;
  let pulsing = false;
  let speedMs = 950;
  let cumCached = 0;
  let cumNaive = 0;

  /* -------------------------------- dom -------------------------------- */
  const root = document.createElement('div');
  root.className = 'ill';

  const ctl = document.createElement('div');
  ctl.className = 'ill-ctl';

  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'btn primary';
  playBtn.textContent = '▶ Play';

  const stepBtn = document.createElement('button');
  stepBtn.type = 'button';
  stepBtn.className = 'btn';
  stepBtn.textContent = 'Step';

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn';
  resetBtn.textContent = 'Reset';

  const cacheLabel = document.createElement('label');
  cacheLabel.className = 'ill-check';
  const cacheBox = document.createElement('input');
  cacheBox.type = 'checkbox';
  cacheBox.checked = true;
  cacheLabel.append(cacheBox, document.createTextNode(' reuse cached K/V'));

  const speedWrap = document.createElement('label');
  const speed = document.createElement('input');
  speed.type = 'range';
  speed.min = '250';
  speed.max = '2000';
  speed.step = '50';
  speed.value = String(speedMs);
  speedWrap.append(document.createTextNode('speed'), speed);

  const stepInfo = document.createElement('span');
  stepInfo.className = 'ill-step';

  ctl.append(playBtn, stepBtn, resetBtn, cacheLabel, speedWrap, stepInfo);

  /* slice picker: layer x head */
  const headsWrap = document.createElement('div');
  headsWrap.className = 'ill-slice';
  const headsLabel = document.createElement('span');
  headsLabel.className = 'ill-slice-label';
  headsLabel.textContent = 'slice shown';
  const headsGrid = document.createElement('div');
  headsGrid.className = 'ill-heads';
  headsWrap.append(headsLabel, headsGrid);

  const headBtns: HTMLButtonElement[] = [];
  for (let l = 0; l < LAYERS; l++) {
    for (let h = 0; h < HEADS; h++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ill-head';
      b.textContent = `${l}.${h}`;
      b.title = `layer ${l}, head ${h}`;
      b.addEventListener('click', () => {
        layer = l;
        head = h;
        if (lastQuery >= 0) attn = attention(layer, head, lastQuery);
        draw();
      });
      headsGrid.appendChild(b);
      headBtns.push(b);
    }
  }

  /* the picture */
  const fig = document.createElement('div');
  fig.className = 'ill-fig';
  const art = s('svg', { viewBox: `0 0 ${VB_W} ${VB_H}`, role: 'img', 'aria-label': 'KV cache rows and the attention paid to them' });
  fig.appendChild(art);

  const strip = document.createElement('div');
  strip.className = 'ill-tokens';

  /* counters */
  const cards = document.createElement('div');
  cards.className = 'ill-cards';
  function mkCard(label: string): HTMLElement {
    const c = document.createElement('div');
    c.className = 'ill-card';
    const k = document.createElement('div');
    k.className = 'k';
    k.textContent = label;
    const v = document.createElement('div');
    v.className = 'v';
    c.append(k, v);
    cards.appendChild(c);
    return v;
  }
  const cardN = mkCard('sequence (n)');
  const cardStep = mkCard('attention MACs / step');
  const cardCum = mkCard('cumulative MACs');
  const cardRatio = mkCard('cost of not caching');

  const bars = document.createElement('div');
  bars.className = 'ill-bars';
  function mkBar(label: string): { fill: HTMLElement; num: HTMLElement } {
    const row = document.createElement('div');
    row.className = 'ill-bar-row';
    const l = document.createElement('span');
    l.className = 'ill-bar-label';
    l.textContent = label;
    const track = document.createElement('div');
    track.className = 'ill-bar';
    const fill = document.createElement('span');
    track.appendChild(fill);
    const num = document.createElement('span');
    num.className = 'ill-bar-num';
    row.append(l, track, num);
    bars.appendChild(row);
    return { fill, num };
  }
  const barC = mkBar('with cache');
  const barN = mkBar('no cache');

  /* memory panel */
  const scale = document.createElement('div');
  scale.className = 'ill-scale';
  const scaleHead = document.createElement('div');
  scaleHead.className = 'ill-scale-head';
  scaleHead.textContent = 'the same cache in a real model';
  const scaleCtl = document.createElement('div');
  scaleCtl.className = 'ill-ctl';

  const modelSel = document.createElement('select');
  for (const m of MODELS) {
    const o = document.createElement('option');
    o.value = m.id;
    o.textContent = m.label;
    modelSel.appendChild(o);
  }
  modelSel.value = 'l2-7b';
  const modelLabel = document.createElement('label');
  modelLabel.append(document.createTextNode('model'), modelSel);

  const precSel = document.createElement('select');
  for (const p of PRECS) {
    const o = document.createElement('option');
    o.value = p.id;
    o.textContent = p.label;
    precSel.appendChild(o);
  }
  precSel.value = 'fp16';
  const precLabel = document.createElement('label');
  precLabel.append(document.createTextNode('precision'), precSel);

  const ctxRange = document.createElement('input');
  ctxRange.type = 'range';
  ctxRange.min = '512';
  ctxRange.max = '32768';
  ctxRange.step = '512';
  ctxRange.value = '4096';
  const ctxOut = document.createElement('span');
  ctxOut.className = 'ill-step';
  const ctxLabel = document.createElement('label');
  ctxLabel.append(document.createTextNode('context'), ctxRange, ctxOut);

  scaleCtl.append(modelLabel, precLabel, ctxLabel);

  const scaleCards = document.createElement('div');
  scaleCards.className = 'ill-cards';
  function mkScaleCard(label: string): HTMLElement {
    const c = document.createElement('div');
    c.className = 'ill-card';
    const k = document.createElement('div');
    k.className = 'k';
    k.textContent = label;
    const v = document.createElement('div');
    v.className = 'v';
    c.append(k, v);
    scaleCards.appendChild(c);
    return v;
  }
  const memPer = mkScaleCard('cache / token');
  const memTotal = mkScaleCard('cache total');
  const memCtx = mkScaleCard('context');

  const memTrack = document.createElement('div');
  memTrack.className = 'ill-bar tall';
  const memFill = document.createElement('span');
  memTrack.appendChild(memFill);
  const memNote = document.createElement('p');
  memNote.className = 'ill-legend';

  /* footnote */
  const note = document.createElement('p');
  note.className = 'ill-note';
  note.innerHTML =
    'The cache stores one key and one value per position, per layer, per KV head — written once and read at every later step. ' +
    'Grouped-query attention (GQA) shrinks it by sharing KV heads between query heads. ' +
    'It lives in the same GPU memory as the weights, so a long context competes with the model itself.';

  scale.append(scaleHead, scaleCtl, scaleCards, memTrack, memNote);
  root.append(ctl, headsWrap, strip, fig, cards, bars, scale, note);
  host.appendChild(root);

  /* ------------------------------- drawing ------------------------------ */

  function cellFill(v: number): string {
    const m = Math.min(1, Math.abs(v) / 1.5);
    const col = v >= 0 ? C.teal : C.accent;
    return col + Math.round((0.14 + 0.76 * m) * 255).toString(16).padStart(2, '0');
  }

  function draw() {
    if (dead) return;

    /* token strip */
    strip.textContent = '';
    tokens.forEach((t, i) => {
      const chip = document.createElement('span');
      chip.className = 'ill-token' + (i < PROMPT.length ? ' prompt' : '') + (i === tokens.length - 1 && filled > PROMPT.length ? ' fresh' : '');
      chip.textContent = t;
      strip.appendChild(chip);
    });

    /* slice buttons */
    headBtns.forEach((b, i) => {
      b.classList.toggle('on', Math.floor(i / HEADS) === layer && i % HEADS === head);
    });

    art.textContent = '';

    const stale = !useCache;

    /* titles */
    art.appendChild(txt(X_TOKEN, 26, `KV cache · layer ${layer} · head ${head}`, { fill: C.fg, size: 12, weight: 600 }));
    art.appendChild(txt(X_TOKEN, 42, `${filled} positions · K,V written once`, { size: 10.5 }));
    art.appendChild(txt(X_K + (D * CELL_PITCH - CELL_GAP) / 2, 58 - 10, 'K', { anchor: 'middle', fill: C.dim }));
    art.appendChild(txt(X_V + (D * CELL_PITCH - CELL_GAP) / 2, 58 - 10, 'V', { anchor: 'middle', fill: C.dim }));

    art.appendChild(txt(X_ATTN, 26, 'attention from the newest query', { fill: C.fg, size: 12, weight: 600 }));
    art.appendChild(
      txt(X_ATTN, 42, lastQuery >= 0 ? `softmax( q·Kᵀ / √d ) · ${lastQuery} cached keys` : 'softmax( q·Kᵀ / √d ) · no keys yet', { size: 10.5 }),
    );

    if (stale) {
      art.appendChild(
        txt(VB_W - 12, 60, '↻ recomputed from scratch each step', { anchor: 'end', fill: C.warn, size: 10.5 }),
      );
    }

    /* cache rows */
    for (let i = 0; i < filled; i++) {
      const y = ROW_TOP + i * ROW_H;
      const isQueryRow = i === lastQuery;
      const isNew = i === filled - 1 && filled > PROMPT.length;

      if (isQueryRow) {
        art.appendChild(s('rect', { x: X_TOKEN - 6, y: y - 2, width: VB_W - X_TOKEN * 2 + 12, height: ROW_H - 2, rx: 4, fill: C.accent, opacity: 0.07 }));
      }

      const label = tokens[i] ?? `#${i}`;
      art.appendChild(txt(X_TOKEN, y + 16, label.length > 8 ? label.slice(0, 7) + '…' : label, { fill: isQueryRow ? C.fg : C.dim, size: 10.5 }));

      const k = keyVec(layer, head, i);
      const v = valVec(layer, head, i);
      for (let j = 0; j < D; j++) {
        const kc = isQueryRow && j === 0 ? { stroke: C.accent, sw: 1 } : { stroke: 'none', sw: 0 };
        art.appendChild(
          s('rect', {
            x: X_K + j * CELL_PITCH,
            y: y + 3,
            width: CELL_W,
            height: CELL_H,
            rx: 2,
            fill: cellFill(k[j]),
            stroke: stale ? C.warn : kc.stroke,
            'stroke-width': stale ? 0.6 : kc.sw,
            opacity: stale && !pulsing ? 0.55 : 1,
          }),
        );
        art.appendChild(
          s('rect', {
            x: X_V + j * CELL_PITCH,
            y: y + 3,
            width: CELL_W,
            height: CELL_H,
            rx: 2,
            fill: cellFill(v[j]),
            stroke: stale ? C.warn : 'none',
            'stroke-width': stale ? 0.6 : 0,
            opacity: stale && !pulsing ? 0.55 : 1,
          }),
        );
      }

      if (isNew) {
        art.appendChild(s('rect', { x: X_K - 4, y: y - 1, width: X_V + D * CELL_PITCH - CELL_GAP - X_K + 8, height: ROW_H, rx: 4, fill: 'none', stroke: C.ok, 'stroke-width': 1.2 }));
      }
      art.appendChild(
        txt(X_V + D * CELL_PITCH + 8, y + 16, isQueryRow ? 'q' : useCache ? '◆' : '↻', {
          fill: isQueryRow ? C.accent : useCache ? C.ok : C.warn,
          size: 11,
        }),
      );
    }

    /* attention bars */
    if (attn && attn.length) {
      for (let i = 0; i < attn.length; i++) {
        const y = ROW_TOP + i * ROW_H + 4;
        const w = Math.max(1, attn[i] * ATTN_W);
        art.appendChild(s('rect', { x: X_ATTN, y, width: ATTN_W, height: 16, rx: 3, fill: C.panel2, opacity: 0.35 }));
        art.appendChild(s('rect', { x: X_ATTN, y, width: w, height: 16, rx: 3, fill: C.accent, opacity: 0.75 }));
        art.appendChild(s('rect', { x: X_ATTN + w - 1.5, y, width: 3, height: 16, rx: 1, fill: C.fg, opacity: 0.9 }));
        art.appendChild(
          txt(X_ATTN + ATTN_W + 6, y + 13, attn[i].toFixed(3), { fill: attn[i] > 0.25 ? C.fg : C.dim, size: 10.5 }),
        );
      }
      const ctx = context(layer, head, lastQuery, attn);
      const cy = VB_H - 46;
      art.appendChild(txt(X_ATTN, cy - 8, `Σ aᵢvᵢ  (context handed to the next block)`, { size: 10.5 }));
      for (let j = 0; j < D; j++) {
        art.appendChild(s('rect', { x: X_ATTN + j * CELL_PITCH * 1.4, y: cy - 2, width: CELL_W, height: CELL_H, rx: 2, fill: cellFill(ctx[j]) }));
      }
      art.appendChild(
        txt(X_ATTN + D * CELL_PITCH * 1.4 + 12, cy + 13, `→ samples “${tokens[filled - 1]}”`, { fill: C.ok, size: 11 }),
      );
    } else {
      art.appendChild(
        txt(X_ATTN, ROW_TOP + 30, 'Prefill: every prompt token is projected in parallel.', { size: 11.5, fill: C.dim }),
      );
      art.appendChild(
        txt(X_ATTN, ROW_TOP + 50, 'Press Step to decode the next token.', { size: 11.5, fill: C.dim }),
      );
    }

    /* caption */
    const caption =
      lastQuery < 0
        ? `Prefill writes ${filled} rows in one parallel pass — that is the cache's opening balance.`
        : filled >= MAX_POS
          ? `Context full (${MAX_POS} positions). Every new token reads all ${filled} cached rows; nothing is stored twice.`
          : `Step ${filled - PROMPT.length}: query at position ${lastQuery}, ${lastQuery} cached keys attended, then its own K/V row was appended.`;
    art.appendChild(txt(X_TOKEN, VB_H - 10, caption, { fill: C.fg, size: 11.5, mono: false }));

    /* counters */
    const past = Math.max(0, lastQuery);
    const stepCached = useCache ? stepMacs(past, true) : stepMacs(past, false);
    const naiveStep = stepMacs(past, false);
    cardN.textContent = `${filled} / ${MAX_POS}`;
    cardStep.textContent = lastQuery < 0 ? '—' : fmtMacs(stepCached);
    cardStep.title = lastQuery < 0 ? '' : useCache ? '2d² + 2nd per layer-head' : '2(n+1)d² + 2nd per layer-head';
    cardCum.textContent = fmtMacs(useCache ? cumCached : cumNaive);
    cardRatio.textContent = cumNaive > 0 ? `×${(cumNaive / Math.max(1, cumCached)).toFixed(2)} more MACs` : '—';

    const max = Math.max(cumCached, cumNaive, 1);
    barC.fill.style.width = ((cumCached / max) * 100).toFixed(1) + '%';
    barC.fill.style.background = C.ok;
    barN.fill.style.width = ((cumNaive / max) * 100).toFixed(1) + '%';
    barN.fill.style.background = cumNaive > cumCached ? C.warn : C.dim;
    barC.num.textContent = fmtMacs(cumCached);
    barN.num.textContent = fmtMacs(cumNaive);
    barC.num.style.color = useCache ? C.fg : C.dim;
    barN.num.style.color = useCache ? C.dim : C.fg;

    stepInfo.textContent = `step ${Math.max(0, filled - PROMPT.length)} / ${MAX_POS - PROMPT.length}`;
    playBtn.textContent = running ? '❚❚ Pause' : filled >= MAX_POS ? '↺ Replay' : '▶ Play';
  }

  function updateMemory() {
    const m = MODELS.find((x) => x.id === modelSel.value) ?? MODELS[1];
    const p = PRECS.find((x) => x.id === precSel.value) ?? PRECS[0];
    const per = bytesPerToken(m, p.bytes);
    const ctx = Number(ctxRange.value);
    const total = per * ctx;
    memPer.textContent = fmtBytes(per);
    memTotal.textContent = fmtBytes(total);
    memCtx.textContent = `${ctx.toLocaleString()} tokens`;
    const cap = 24 * 1024 ** 3;
    const frac = Math.min(1, total / cap);
    memFill.style.width = (frac * 100).toFixed(1) + '%';
    memFill.style.background = total > cap ? C.bad : frac > 0.5 ? C.warn : C.ok;
    memNote.textContent =
      total > cap
        ? `${fmtBytes(total)} of KV cache — more than a 24 GB card can hold, before any weights are loaded. ${m.note}`
        : `${((total / cap) * 100).toFixed(0)}% of a 24 GB card, weights excluded. ${m.note}`;
  }

  /* ------------------------------- playback ----------------------------- */

  function stopTimer() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    running = false;
  }

  function pulse() {
    if (useCache) return;
    pulsing = true;
    if (pulseTimer !== null) window.clearTimeout(pulseTimer);
    pulseTimer = window.setTimeout(() => {
      pulsing = false;
      draw();
    }, 220);
  }

  function advance(): boolean {
    if (filled >= MAX_POS) return false;
    const q = filled;
    attn = attention(layer, head, q);
    cumCached += stepMacs(q, true);
    cumNaive += stepMacs(q, false);
    tokens.push(sampleToken(q));
    lastQuery = q;
    filled = q + 1;
    pulse();
    draw();
    return filled < MAX_POS;
  }

  function resetAll() {
    stopTimer();
    tokens.length = 0;
    tokens.push(...PROMPT);
    filled = PROMPT.length;
    lastQuery = -1;
    attn = null;
    cumCached = 0;
    cumNaive = 0;
    pulsing = false;
    draw();
  }

  function play() {
    if (running) {
      stopTimer();
      draw();
      return;
    }
    if (filled >= MAX_POS) resetAll();
    running = true;
    timer = window.setInterval(() => {
      if (!advance()) {
        stopTimer();
        draw();
      }
    }, speedMs);
    draw();
  }

  playBtn.addEventListener('click', play);
  stepBtn.addEventListener('click', () => {
    stopTimer();
    advance();
  });
  resetBtn.addEventListener('click', () => {
    resetAll();
  });
  cacheBox.addEventListener('change', () => {
    useCache = cacheBox.checked;
    draw();
  });
  speed.addEventListener('input', () => {
    speedMs = Number(speed.value);
    if (running) {
      stopTimer();
      play();
    }
  });
  modelSel.addEventListener('change', updateMemory);
  precSel.addEventListener('change', updateMemory);
  ctxRange.addEventListener('input', updateMemory);

  /* ------------------------------- start -------------------------------- */
  updateMemory();
  draw();

  return {
    reset: resetAll,
    destroy() {
      dead = true;
      stopTimer();
      if (pulseTimer !== null) window.clearTimeout(pulseTimer);
      root.remove();
    },
  };
};

export default kvCache;
