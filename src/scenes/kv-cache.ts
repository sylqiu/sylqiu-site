/**
 * Illustration: kv-cache — from a token to a distribution, and where the cache
 * saves the compute.
 *
 * A stacked explainer: every section is its own figure, all visible on the page,
 * read top to bottom. Sections that move have local controls (sample a token,
 * step the decoder); the rest are static.
 *
 * One toy model runs through the whole page: 2 layers x 2 heads per layer, head
 * dimension d = 8, so one (layer, head) slice is exactly eight numbers wide and
 * every figure is the real arithmetic, small enough to count by hand. No
 * real-model statistics: the point is the shape of the work — what one step
 * computes, what the cache lets it skip, and what keeping the cache costs.
 *
 * Narrative: autoregressive loop -> inside one transformer layer -> attention ->
 * prefill -> decode -> why past rows stay valid (with and without a cache) ->
 * what it saves -> what it costs.
 */
import type { SceneFactory } from "../lib/registry.ts";

const NS = "http://www.w3.org/2000/svg";

const C = {
  fg: "#e6edf3",
  dim: "#8b949e",
  line: "#2a3140",
  panel: "#161b22",
  panel2: "#1c2230",
  accent: "#58a6ff",
  ok: "#3fb950",
  warn: "#d29922",
  bad: "#f85149",
  teal: "#39c5cf",
  purple: "#a371f7",
};

/* ------------------------------- tiny model ------------------------------- */

const LAYERS = 2;
const HEADS = 2;
const D = 8;
const MIN_N = 4;
const MAX_N = 12;
const PROMPT_N = 4;
const TEXT = ["<s>", "a", "small", "model", "writes", "text", "one", "token", "at", "a", "time", "and"];

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
  const norm = Math.sqrt(s) || 1;
  for (let i = 0; i < D; i++) v[i] /= norm;
  return v;
}

const keyVec = (l: number, h: number, p: number): Vec =>
  cachedVec("k:" + l + ":" + h + ":" + p, () => unit((i) => gauss(l, h, p, i, 11)));

const valVec = (l: number, h: number, p: number): Vec =>
  cachedVec("v:" + l + ":" + h + ":" + p, () => unit((i) => gauss(l, h, p, i, 22)));

const queryVec = (l: number, h: number, p: number): Vec =>
  cachedVec("q:" + l + ":" + h + ":" + p, () => {
    const prev = keyVec(l, h, Math.max(0, p - 1));
    return unit((i) => 0.85 * prev[i] + 0.55 * gauss(l, h, p, i, 33));
  });

function softmax(logits: Vec): Vec {
  const m = Math.max(...logits);
  const ex = logits.map((x) => Math.exp(x - m));
  const s = ex.reduce((a, b) => a + b, 0) || 1;
  return ex.map((x) => x / s);
}

const dot = (a: Vec, b: Vec): number => {
  let s = 0;
  for (let i = 0; i < D; i++) s += a[i] * b[i];
  return s;
};

const SHARP = 3.2;

/** Weights the newest query puts on the cached keys to its left (causal). */
function attention(l: number, h: number, q: number): Vec {
  if (q <= 0) return [];
  const query = queryVec(l, h, q);
  const logits: Vec = [];
  for (let p = 0; p < q; p++) logits.push(SHARP * dot(query, keyVec(l, h, p)));
  return softmax(logits);
}

/** Toy next-token distribution over the sentence vocabulary. */
function distribution(nn: number): Vec {
  const next = nn < TEXT.length ? TEXT[nn] : "";
  const logits = TEXT.map((w, i) => 1.4 * gauss(nn + 1, i, 71) + (w === next ? 6 : 0));
  return softmax(logits);
}

/* -------------------------------- the costs ------------------------------- */

function stepMacs(past: number, cached: boolean): number {
  const proj = cached ? 2 * D * D : 2 * (past + 1) * D * D;
  return proj + 2 * past * D;
}

function cumProj(n: number, cached: boolean): number {
  let s = 0;
  for (let t = 0; t < n; t++) s += cached ? 2 * D * D : 2 * (t + 1) * D * D;
  return s;
}

function cumAttend(n: number): number {
  let s = 0;
  for (let t = 0; t < n; t++) s += 2 * t * D;
  return s;
}

const cumMacs = (n: number, cached: boolean): number => cumProj(n, cached) + cumAttend(n);

const NUM_PER_POS = 2 * LAYERS * HEADS * D;
const BYTES_PER_NUM = 2;

function fmt(x: number): string {
  if (x >= 1e6) return (x / 1e6).toFixed(2) + "M";
  if (x >= 1e3) return (x / 1e3).toFixed(1) + "k";
  return String(Math.round(x));
}

function fmtBytes(x: number): string {
  if (x >= 1024) return (x / 1024).toFixed(x >= 10240 ? 0 : 1) + " KiB";
  return Math.round(x) + " B";
}

/* ------------------------------- svg helpers ------------------------------ */

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
  anchor?: "start" | "middle" | "end";
  mono?: boolean;
  opacity?: number;
  weight?: number;
}

function txt(x: number, y: number, content: string, o: TxtOpts = {}): SVGTextElement {
  const t = s("text", {
    x,
    y,
    fill: o.fill ?? C.dim,
    "font-size": o.size ?? 11,
    "text-anchor": o.anchor ?? "start",
    "font-family": o.mono === true ? "ui-monospace, SFMono-Regular, Menlo, monospace" : "inherit",
  });
  if (o.opacity !== undefined) t.setAttribute("opacity", String(o.opacity));
  if (o.weight !== undefined) t.setAttribute("font-weight", String(o.weight));
  t.textContent = content;
  return t;
}

function cellFill(v: number, base: string): string {
  const m = Math.min(1, Math.abs(v) / 1.5);
  return base + Math.round((0.18 + 0.72 * m) * 255).toString(16).padStart(2, "0");
}

function marker(id: string, color: string): SVGMarkerElement {
  const m = s("marker", {
    id,
    viewBox: "0 0 10 10",
    refX: "9",
    refY: "5",
    markerWidth: "5",
    markerHeight: "5",
    orient: "auto-start-reverse",
  });
  m.appendChild(s("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: color }));
  return m;
}

function arrow(art: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, color: string, id: string, width = 1.2): void {
  art.appendChild(s("line", { x1, y1, x2, y2, stroke: color, "stroke-width": width, "marker-end": "url(#" + id + ")" }));
}

/* geometry (viewBox is 720 wide; height varies per section) */
const VB_W = 720;
const CELL_W = 30;
const CELL_GAP = 6;
const CELL_PITCH = CELL_W + CELL_GAP;
const GRID_X = 180;
const GRID_Y = 98;
const ROW_H = 15;
const ROW_PITCH = 21;
const colX = (p: number): number => GRID_X + p * CELL_PITCH;
const rowY = (r: number): number => GRID_Y + (r - 1) * ROW_PITCH;

interface Sec {
  id: string;
  title: string;
  blurb: string;
  h: number;
}

const SECS: Sec[] = [
  {
    id: "loop",
    title: "Every token becomes a distribution over the next token",
    blurb:
      "An autoregressive model reads the sequence and outputs, at the last position, a probability for every token in its vocabulary. One is sampled, appended to the input, and the whole thing runs again. Sample a few and watch the loop.",
    h: 380,
  },
  {
    id: "layer",
    title: "Inside one transformer layer",
    blurb:
      "The step from h_t to the layer above, block by block. Stage it: every block works on this position alone — the norm, the three projections, the MLP — except attention, the single place where a token touches its past. That split is exactly what makes a KV cache possible.",
    h: 440,
  },
  {
    id: "attention",
    title: "Attention: the newest token looks left",
    blurb:
      "To produce that distribution the last position attends to every earlier position: its query q is compared with each stored key k, the scores become weights, and the weights mix the stored values v into one context vector.",
    h: 372,
  },
  {
    id: "prefill",
    title: "Prefill: the prompt in one parallel pass",
    blurb:
      "The prompt has no internal dependency to wait on, so every position is projected at once — keys and values for the whole prompt are written into the cache in a single pass. This is the compute-heavy phase.",
    h: 340,
  },
  {
    id: "decode",
    title: "Decode: one new token, one pass over the cache",
    blurb:
      "The sampled token is appended. Its query, key and value are the only new things computed; attention then reads every row already in the cache. Step it to append the next token.",
    h: 380,
  },
  {
    id: "nocache",
    title: "Why nothing needs recomputing: the whole past would be rebuilt",
    blurb:
      "Without a cache, step t re-projects every earlier token to rebuild keys and values that already exist. The grid marks what each step recomputes; the darker the cell, the more often that row is done again.",
    h: 400,
  },
  {
    id: "cache",
    title: "With a cache: write one row, read the rest",
    blurb:
      "One row per position is written when that position is first seen, and every later step reads it. Keys and values persist; the query does not — it is used at its own step and never again. That is why the cache is a KV cache.",
    h: 400,
  },
  {
    id: "stepcost",
    title: "What one step costs",
    blurb:
      "The cache removes the re-projection term: 2(t+1)d² becomes 2d². Attention over the cached keys stays, because that read is genuinely new work.",
    h: 380,
  },
  {
    id: "runcost",
    title: "How the saving adds up over a run",
    blurb:
      "Summed over a generation, the no-cache projection bill grows like n²; with the cache it is a straight line. Attention grows either way.",
    h: 400,
  },
  {
    id: "memory",
    title: "What the cache costs: memory",
    blurb:
      "The price is memory: one key row and one value row per position, per layer, per KV head. It grows with context, and it never shrinks.",
    h: 380,
  },
];

/* --------------------------------- scene ---------------------------------- */

const kvCache: SceneFactory = (host) => {
  let n = 8;
  let layer = 0;
  let head = 0;
  let flash = false;
  let layerStep = 0;
  let dead = false;
  let timer: number | null = null;

  const root = document.createElement("div");
  root.className = "ill";

  /* --------------------------- global controls --------------------------- */
  const ctl = document.createElement("div");
  ctl.className = "ill-ctl";

  const mkBtn = (label: string, primary = false): HTMLButtonElement => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = primary ? "btn primary" : "btn";
    b.textContent = label;
    return b;
  };

  const posWrap = document.createElement("label");
  const posRange = document.createElement("input");
  posRange.type = "range";
  posRange.min = String(MIN_N);
  posRange.max = String(MAX_N);
  posRange.step = "1";
  posRange.value = String(n);
  const posOut = document.createElement("span");
  posOut.className = "ill-step";
  posWrap.append(document.createTextNode("sequence length "), posRange, posOut);

  const headsWrap = document.createElement("div");
  headsWrap.className = "ill-slice";
  const headsLabel = document.createElement("span");
  headsLabel.className = "ill-slice-label";
  headsLabel.textContent = "slice shown";
  const headsGrid = document.createElement("div");
  headsGrid.className = "ill-heads";
  const headBtns: HTMLButtonElement[] = [];
  for (let l = 0; l < LAYERS; l++) {
    for (let h = 0; h < HEADS; h++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ill-head";
      b.textContent = l + "." + h;
      b.title = "layer " + l + ", head " + h;
      b.addEventListener("click", () => {
        layer = l;
        head = h;
        render();
      });
      headsGrid.appendChild(b);
      headBtns.push(b);
    }
  }
  headsWrap.append(headsLabel, headsGrid);
  ctl.append(posWrap, headsWrap);

  /* ------------------------------- contents ------------------------------ */
  const toc = document.createElement("nav");
  toc.className = "ill-toc";
  SECS.forEach((sec, i) => {
    const a = document.createElement("a");
    a.href = "#ill-" + sec.id;
    a.textContent = String(i + 1);
    a.title = sec.title;
    toc.appendChild(a);
  });

  const secEls: Array<{ svg: SVGSVGElement; cards: HTMLElement; ctl: HTMLElement }> = [];
  SECS.forEach((sec, secIndex) => {
    const section = document.createElement("section");
    section.className = "ill-sec";
    section.id = "ill-" + sec.id;
    const head = document.createElement("div");
    head.className = "ill-sec-head";
    const h2 = document.createElement("h2");
    h2.textContent = secIndex + 1 + " · " + sec.title;
    const secCtl = document.createElement("div");
    secCtl.className = "ill-sec-ctl";
    head.append(h2, secCtl);
    const blurb = document.createElement("p");
    blurb.className = "ill-sec-blurb";
    blurb.textContent = sec.blurb;
    const fig = document.createElement("div");
    fig.className = "ill-fig";
    const svg = s("svg", { viewBox: "0 0 " + VB_W + " " + sec.h, role: "img", "aria-label": sec.title });
    fig.appendChild(svg);
    const cards = document.createElement("div");
    cards.className = "ill-cards";
    section.append(head, blurb, fig, cards);
    root.appendChild(section);
    secEls.push({ svg, cards, ctl: secCtl });
  });

  const note = document.createElement("p");
  note.className = "ill-note";
  note.textContent =
    "Toy model: 2 layers × 2 heads, head dimension d = 8 — one slice is eight numbers wide. " +
    "MACs count the K and V projections plus the attention read; the query is new at every step either way, so it is left out. " +
    "A real model multiplies the layers, heads and d, and leaves the shape of the saving alone.";

  root.append(ctl, toc, note);
  host.appendChild(root);

  /* ------------------------------ section 1 ----------------------------- */

  function drawLoop(art: SVGSVGElement): void {
    const w = 50;
    const pitch = 56;
    const x0 = 20;
    const y = 34;
    const h = 30;
    for (let i = 0; i < MAX_N; i++) {
      const x = x0 + i * pitch;
      const has = i < n;
      if (has) {
        art.appendChild(s("rect", { x, y, width: w, height: h, rx: 7, fill: i === n - 1 ? C.accent : C.panel, "fill-opacity": i === n - 1 ? 0.18 : 1, stroke: i === n - 1 ? C.accent : C.line }));
        art.appendChild(txt(x + w / 2, y + 20, TEXT[i], { anchor: "middle", size: 9.5, mono: true, fill: i === n - 1 ? C.fg : C.dim }));
      } else if (i === n) {
        art.appendChild(s("rect", { x, y, width: w, height: h, rx: 7, fill: "none", stroke: C.accent, "stroke-width": 1.2, "stroke-dasharray": "4 3" }));
        art.appendChild(txt(x + w / 2, y + 20, "?", { anchor: "middle", size: 13, fill: C.accent, weight: 600 }));
      }
    }
    art.appendChild(txt(x0, y - 10, "input so far · the model predicts position " + n, { size: 10 }));

    const cx = 360;
    const btop = 88;
    art.appendChild(s("rect", { x: 240, y: btop, width: 240, height: 44, rx: 9, fill: C.panel, stroke: C.line }));
    art.appendChild(txt(360, btop + 19, "transformer · " + LAYERS + " layers here", { anchor: "middle", size: 11, fill: C.fg }));
    art.appendChild(txt(360, btop + 34, "self-attention + MLP at every position", { anchor: "middle", size: 9.5 }));
    arrow(art, cx, y + h + 6, cx, btop - 6, C.dim, "arw-d");
    arrow(art, cx, btop + h + 6, cx, 168, C.dim, "arw-d");

    const probs = distribution(n);
    const base = 322;
    const maxH = 118;
    const bw = 40;
    const bpitch = 56;
    const bx0 = 20;
    art.appendChild(txt(bx0, 190, "probability of each next token (toy vocabulary: the " + TEXT.length + " words of this sentence)", { size: 10.5, fill: C.fg }));
    let argmax = 0;
    probs.forEach((p, i) => {
      if (p > probs[argmax]) argmax = i;
    });
    probs.forEach((p, i) => {
      const x = bx0 + i * bpitch;
      const hh = Math.max(2, p * maxH);
      const top = base - hh;
      const on = i === argmax;
      art.appendChild(s("rect", { x, y: 200, width: bw, height: maxH, rx: 3, fill: C.panel2, opacity: 0.45 }));
      art.appendChild(s("rect", { x, y: top, width: bw, height: hh, rx: 3, fill: on ? C.accent : C.teal, opacity: on ? (flash ? 1 : 0.9) : 0.45 }));
      art.appendChild(s("text", {
        x: x + bw / 2,
        y: base + 12,
        fill: on ? C.fg : C.dim,
        "font-size": 9.5,
        "text-anchor": "end",
        transform: "rotate(-52 " + (x + bw / 2) + " " + (base + 12) + ")",
        "font-family": "ui-monospace, SFMono-Regular, Menlo, monospace",
      })).textContent = TEXT[i];
      art.appendChild(txt(x + bw / 2, top - 5, p.toFixed(2), { anchor: "middle", size: 9, mono: true, fill: on ? C.accent : C.dim }));
      if (on) art.appendChild(txt(x + bw / 2, top + 15, "sampled", { anchor: "middle", size: 9.5, fill: "#0b1220", weight: 700 }));
    });
    art.appendChild(s("line", { x1: bx0 - 4, y1: base, x2: bx0 + MAX_N * bpitch - 8, y2: base, stroke: C.line }));

    art.appendChild(s("path", {
      d: "M " + (x0 + n * pitch + w / 2) + " " + (y + h + 6) + " C " + (x0 + n * pitch + w / 2) + " 372 " + (bx0 + argmax * bpitch + bw / 2) + " 372 " + (bx0 + argmax * bpitch + bw / 2) + " " + (base + 34),
      fill: "none",
      stroke: C.ok,
      "stroke-width": 1.2,
      "stroke-dasharray": "4 3",
      "marker-end": "url(#arw-g)",
    }));
    art.appendChild(txt(bx0, 372, "Greedy sample: the tallest bar is appended at the dashed slot and the loop runs again.", { size: 11, fill: C.fg }));
  }

  /* ------------------------------ section 2 ----------------------------- */

  function drawAttention(art: SVGSVGElement): void {
    const w = 46;
    const pitch = 52;
    const x0 = 26;
    const y = 70;
    const h = 52;
    const nx = x0 + (n - 1) * pitch;
    const weights = attention(layer, head, n - 1);
    const maxA = Math.max(1e-6, ...weights);

    for (let i = 0; i < n - 1; i++) {
      const tx = x0 + i * pitch + w / 2;
      const sx = nx + w / 2;
      const cy = 48 - (n - 1 - i) * 2;
      art.appendChild(
        s("path", {
          d: "M " + sx + " " + (y - 12) + " Q " + ((sx + tx) / 2 | 0) + " " + cy + " " + tx + " " + (y - 12),
          fill: "none",
          stroke: C.accent,
          "stroke-width": 1,
          opacity: 0.3,
          "marker-end": "url(#arw-a)",
        }),
      );
    }

    for (let i = 0; i < n; i++) {
      const x = x0 + i * pitch;
      const youngest = i === n - 1;
      art.appendChild(s("rect", { x, y, width: w, height: h, rx: 8, fill: youngest ? C.accent : C.panel, "fill-opacity": youngest ? 0.16 : 1, stroke: youngest ? C.accent : C.line, "stroke-width": youngest ? 1.4 : 1 }));
      art.appendChild(txt(x + w / 2, y + 21, TEXT[i], { anchor: "middle", size: 9.5, mono: true, fill: youngest ? C.fg : C.dim }));
      art.appendChild(txt(x + w / 2, y + 38, "t" + i, { anchor: "middle", size: 9, mono: true }));
    }
    art.appendChild(txt(nx + w / 2, y - 30, "query q", { anchor: "middle", size: 10, fill: C.accent, weight: 600 }));
    art.appendChild(txt(x0 - 2, y - 30, "each of these keeps a key k and a value v", { size: 10 }));

    const base = 232;
    const maxBar = 78;
    weights.forEach((a, i) => {
      const x = x0 + i * pitch;
      const bh = Math.max(2, (a / maxA) * maxBar);
      art.appendChild(s("rect", { x, y: base - bh, width: w, height: bh, rx: 4, fill: C.accent, opacity: 0.55 }));
      art.appendChild(txt(x + w / 2, base + 14, a.toFixed(3), { anchor: "middle", size: 9.5, mono: true, fill: a > 0.25 ? C.fg : C.dim }));
    });
    art.appendChild(txt(x0, base - maxBar - 14, "softmax( q·kᵀ / √d ) — how much of each past position the new token pulls in", { size: 10.5, fill: C.fg }));

    art.appendChild(txt(x0, 292, "Σ aᵢ·vᵢ over those positions gives one context vector: the only thing the next block sees.", { size: 11.5, fill: C.fg }));
    art.appendChild(txt(x0, 316, "The keys and values are reused from step to step; the query is made fresh for the newest position.", { size: 11.5 }));
    art.appendChild(txt(x0, 340, "Attention is where the cache does its work: every step reads n stored keys, never rebuilding them.", { size: 11.5 }));
  }

  /* ------------------------------ section 3 ----------------------------- */

  function drawPrefill(art: SVGSVGElement): void {
    const w = 58;
    const pitch = 68;
    const x0 = 20;
    const y = 60;
    const h = 46;
    art.appendChild(txt(x0, y - 12, "the prompt (" + PROMPT_N + " positions)", { size: 10.5, fill: C.fg }));
    for (let i = 0; i < PROMPT_N; i++) {
      const x = x0 + i * pitch;
      art.appendChild(s("rect", { x, y, width: w, height: h, rx: 8, fill: C.panel, stroke: C.accent, "stroke-width": 1.2 }));
      art.appendChild(txt(x + w / 2, y + 20, TEXT[i], { anchor: "middle", size: 10, mono: true, fill: C.fg }));
      art.appendChild(txt(x + w / 2, y + 36, "t" + i, { anchor: "middle", size: 9, mono: true }));
      const k = keyVec(layer, head, i);
      const v = valVec(layer, head, i);
      for (let j = 0; j < D; j++) {
        art.appendChild(s("rect", { x: x + 5 + j * 6, y: 132, width: 5, height: 14, rx: 1, fill: cellFill(k[j], C.purple) }));
        art.appendChild(s("rect", { x: x + 5 + j * 6, y: 150, width: 5, height: 14, rx: 1, fill: cellFill(v[j], C.teal) }));
      }
    }
    art.appendChild(txt(x0 + 5, 128, "k", { size: 9, fill: C.purple }));
    art.appendChild(txt(x0 + 5, 176, "v", { size: 9, fill: C.teal }));
    art.appendChild(s("line", { x1: x0 + 4, y1: 180, x2: x0 + 3 * pitch + w - 4, y2: 180, stroke: C.accent, "stroke-width": 1, opacity: 0.5 }));
    art.appendChild(txt(x0 + (3 * pitch + w) / 2 - 2, 196, "one pass — every position at once", { anchor: "middle", size: 10.5, fill: C.accent }));

    const mx = 340;
    const my = 60;
    const cell = 24;
    art.appendChild(txt(mx, my - 12, "causal mask", { size: 10.5, fill: C.fg }));
    for (let r = 0; r < PROMPT_N; r++) {
      for (let c = 0; c < PROMPT_N; c++) {
        const allowed = c <= r;
        art.appendChild(s("rect", { x: mx + c * (cell + 4), y: my + r * (cell + 4), width: cell, height: cell, rx: 3, fill: allowed ? C.accent : C.panel2, opacity: allowed ? 0.5 : 0.35 }));
      }
    }
    art.appendChild(txt(mx + PROMPT_N * (cell + 4) + 14, my + 34, "a position may read", { size: 11 }));
    art.appendChild(txt(mx + PROMPT_N * (cell + 4) + 14, my + 54, "only its left — so all", { size: 11 }));
    art.appendChild(txt(mx + PROMPT_N * (cell + 4) + 14, my + 74, "of it is computable", { size: 11 }));
    art.appendChild(txt(mx + PROMPT_N * (cell + 4) + 14, my + 94, "in one go.", { size: 11 }));

    art.appendChild(txt(x0, 234, "Prefill runs the whole prompt through the network in parallel: every position projects its k and v,", { size: 11.5, fill: C.fg }));
    art.appendChild(txt(x0, 258, "and the cache is written with one row per prompt position before any token is generated.", { size: 11.5 }));
    art.appendChild(txt(x0, 282, "This phase saturates the GPU with arithmetic; it is where the bulk of the FLOPs of a short chat go.", { size: 11.5 }));
    art.appendChild(txt(x0, 314, "After prefill the cache holds " + PROMPT_N + " rows — the opening balance that decode then adds to.", { size: 11.5, fill: C.ok }));
  }

  /* ------------------------------ section 4 ----------------------------- */

  function drawDecode(art: SVGSVGElement): void {
    const sx = 16;
    const sw = 96;
    art.appendChild(txt(sx, 40, "the cache · " + n + " rows", { size: 10.5, fill: C.teal, weight: 600 }));
    art.appendChild(txt(sx + 27, 58, "k", { anchor: "middle", size: 9, fill: C.purple }));
    art.appendChild(txt(sx + 72, 58, "v", { anchor: "middle", size: 9, fill: C.teal }));
    for (let r = 0; r < n; r++) {
      const y = 62 + r * 18;
      const fresh = r === n - 1;
      art.appendChild(s("rect", { x: sx, y, width: sw, height: 16, rx: 3, fill: C.panel, stroke: fresh ? C.ok : C.line, "stroke-width": fresh ? 1.4 : 1 }));
      const k = keyVec(layer, head, r);
      const v = valVec(layer, head, r);
      for (let j = 0; j < D; j++) {
        art.appendChild(s("rect", { x: sx + 8 + j * 5, y: y + 3, width: 4, height: 10, rx: 1, fill: cellFill(k[j], C.purple) }));
        art.appendChild(s("rect", { x: sx + 52 + j * 5, y: y + 3, width: 4, height: 10, rx: 1, fill: cellFill(v[j], C.teal) }));
      }
    }
    art.appendChild(txt(sx + sw, 62 + (n - 1) * 18 + 12, "written once", { size: 9.5, fill: C.ok }));

    const bx = 150;
    art.appendChild(s("rect", { x: bx, y: 60, width: 150, height: 40, rx: 8, fill: C.panel, stroke: C.ok, "stroke-width": 1.4 }));
    art.appendChild(txt(bx + 75, 78, "new token: " + TEXT[n - 1], { anchor: "middle", size: 10.5, mono: true, fill: C.fg }));
    art.appendChild(txt(bx + 75, 93, "sampled in section 1", { anchor: "middle", size: 9 }));
    art.appendChild(s("rect", { x: bx, y: 126, width: 150, height: 40, rx: 8, fill: C.panel, stroke: C.purple, "stroke-width": 1.2 }));
    art.appendChild(txt(bx + 75, 144, "project q, k, v", { anchor: "middle", size: 10.5, fill: C.purple }));
    art.appendChild(txt(bx + 75, 159, "the only new arithmetic", { anchor: "middle", size: 9 }));
    art.appendChild(s("rect", { x: bx, y: 192, width: 150, height: 40, rx: 8, fill: C.panel, stroke: C.accent, "stroke-width": 1.2 }));
    art.appendChild(txt(bx + 75, 210, "attend to all " + n + " rows", { anchor: "middle", size: 10.5, fill: C.accent }));
    art.appendChild(txt(bx + 75, 225, "one pass, read only", { anchor: "middle", size: 9 }));
    arrow(art, bx + 75, 100, bx + 75, 120, C.ok, "arw-g");
    arrow(art, bx + 75, 166, bx + 75, 186, C.accent, "arw-a");
    arrow(art, sx + sw + 6, 130, bx - 6, 210, C.teal, "arw-t", 1);

    const ox = 350;
    art.appendChild(s("rect", { x: ox, y: 60, width: 350, height: 172, rx: 9, fill: C.panel, stroke: C.line }));
    art.appendChild(txt(ox + 14, 80, "output: a distribution over the next token", { size: 10.5, fill: C.fg }));
    const probs = distribution(n);
    const top = probs.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p).slice(0, 5);
    const maxP = Math.max(...top.map((t) => t.p));
    top.forEach((t, k) => {
      const y = 94 + k * 26;
      art.appendChild(txt(ox + 14, y + 11, TEXT[t.i], { size: 10, mono: true, fill: k === 0 ? C.fg : C.dim }));
      art.appendChild(s("rect", { x: ox + 110, y, width: 190, height: 13, rx: 3, fill: C.panel2, opacity: 0.5 }));
      art.appendChild(s("rect", { x: ox + 110, y, width: Math.max(2, (t.p / maxP) * 190), height: 13, rx: 3, fill: k === 0 ? C.accent : C.teal, opacity: k === 0 ? 0.9 : 0.4 }));
      art.appendChild(txt(ox + 310, y + 11, t.p.toFixed(2), { size: 9.5, mono: true, anchor: "end", fill: k === 0 ? C.fg : C.dim }));
    });
    arrow(art, bx + 152, 212, ox - 6, 212, C.accent, "arw-a");

    art.appendChild(s("path", { d: "M " + (ox + 60) + " 60 C " + (ox + 60) + " 22 " + (bx + 40) + " 22 " + (bx + 75) + " 54", fill: "none", stroke: C.ok, "stroke-width": 1.2, "stroke-dasharray": "4 3", "marker-end": "url(#arw-g)" }));
    art.appendChild(txt(ox + 14, 250, "sample → append → repeat", { size: 10, fill: C.ok }));

    art.appendChild(txt(sx, 296, "Past positions are untouched: their k and v depend only on themselves, so they are read from the", { size: 11.5, fill: C.fg }));
    art.appendChild(txt(sx, 320, "cache instead of being recomputed. Every step adds exactly one row and reads every row before it.", { size: 11.5 }));
    art.appendChild(txt(sx, 344, "One pass over the cache per layer, per head — that is the whole decode step.", { size: 11.5 }));
  }

  /* --------------------------- sections 5 and 6 -------------------------- */

  function drawNoCache(art: SVGSVGElement): void {
    art.appendChild(txt(GRID_X - 12, GRID_Y - 10, "step", { anchor: "end", size: 9 }));
    for (let p = 0; p < n; p++) {
      art.appendChild(txt(colX(p) + CELL_W / 2, GRID_Y - 10, "t" + p, { anchor: "middle", size: 9, mono: true }));
    }
    for (let r = 1; r <= n; r++) {
      const y = rowY(r);
      art.appendChild(txt(GRID_X - 12, y + 11, "step " + r, { anchor: "end", size: 10, mono: true }));
      for (let p = 0; p < n; p++) {
        if (p > r - 1) {
          art.appendChild(s("rect", { x: colX(p), y, width: CELL_W, height: ROW_H, rx: 3, fill: C.panel2, opacity: 0.5 }));
          continue;
        }
        const times = n - p;
        art.appendChild(
          s("rect", {
            x: colX(p),
            y,
            width: CELL_W,
            height: ROW_H,
            rx: 3,
            fill: times === 1 ? C.accent : C.bad,
            opacity: times === 1 ? 0.85 : 0.16 + 0.6 * ((times - 1) / Math.max(1, n - 1)),
          }),
        );
      }
      art.appendChild(txt(GRID_X + n * CELL_PITCH + 4, y + 11, r + " rows", { size: 10, mono: true }));
    }
    const fy = rowY(n) + ROW_H + 24;
    art.appendChild(txt(GRID_X, fy, ((n * (n + 1)) / 2) + " projections written, but only " + n + " distinct rows exist.", { size: 11.5, fill: C.fg }));
    art.appendChild(txt(GRID_X, fy + 20, "Darker = rebuilt more often; t0 is rebuilt at every single step.", { size: 11.5 }));
  }

  function drawCache(art: SVGSVGElement): void {
    const sx = 16;
    const sw = 96;
    art.appendChild(txt(sx, GRID_Y - 26, "the cache", { size: 10, fill: C.teal, weight: 600 }));
    art.appendChild(txt(sx + 27, GRID_Y - 10, "k", { anchor: "middle", size: 9, fill: C.purple }));
    art.appendChild(txt(sx + 72, GRID_Y - 10, "v", { anchor: "middle", size: 9, fill: C.teal }));
    for (let r = 1; r <= n; r++) {
      const y = rowY(r);
      art.appendChild(s("rect", { x: sx, y: y - 2, width: sw, height: ROW_H + 4, rx: 4, fill: C.panel, stroke: C.line }));
      const k = keyVec(layer, head, r - 1);
      const v = valVec(layer, head, r - 1);
      for (let j = 0; j < D; j++) {
        art.appendChild(s("rect", { x: sx + 8 + j * 5, y, width: 4, height: ROW_H, rx: 1, fill: cellFill(k[j], C.purple) }));
        art.appendChild(s("rect", { x: sx + 52 + j * 5, y, width: 4, height: ROW_H, rx: 1, fill: cellFill(v[j], C.teal) }));
      }
    }
    for (let p = 0; p < n; p++) {
      art.appendChild(txt(colX(p) + CELL_W / 2, GRID_Y - 10, "t" + p, { anchor: "middle", size: 9, mono: true }));
    }
    for (let r = 1; r <= n; r++) {
      const y = rowY(r);
      art.appendChild(txt(GRID_X - 12, y + 11, "step " + r, { anchor: "end", size: 10, mono: true }));
      for (let p = 0; p < n; p++) {
        const read = p < r - 1;
        const write = p === r - 1;
        if (!read && !write) {
          art.appendChild(s("rect", { x: colX(p), y, width: CELL_W, height: ROW_H, rx: 3, fill: C.panel2, opacity: 0.5 }));
          continue;
        }
        art.appendChild(
          s("rect", {
            x: colX(p),
            y,
            width: CELL_W,
            height: ROW_H,
            rx: 3,
            fill: write ? C.teal : "none",
            "fill-opacity": write ? 0.85 : 0,
            stroke: C.teal,
            "stroke-width": write ? 0 : 1,
            opacity: write ? 1 : 0.5,
          }),
        );
      }
      art.appendChild(txt(GRID_X + n * CELL_PITCH + 4, y + 11, "1 write · " + (r - 1) + " read", { size: 9.5, mono: true }));
    }
    const fy = rowY(n) + ROW_H + 24;
    art.appendChild(txt(20, fy, "Every row is written once and read by every later step: " + ((n * (n - 1)) / 2) + " reads, " + n + " writes.", { size: 11.5, fill: C.fg }));
    art.appendChild(txt(20, fy + 20, "Q is not kept: a query is used at its own step and never again. Only K and V persist.", { size: 11.5 }));
  }

  /* ------------------------------ section 7 ----------------------------- */

  function costBar(art: SVGSVGElement, x: number, y: number, w: number, h: number, label: string, proj: number, attend: number, scale: number): void {
    const total = proj + attend;
    const pw = Math.max(2, (proj / scale) * w);
    const aw = Math.max(0, (attend / scale) * w);
    art.appendChild(txt(x - 12, y + h / 2 + 4, label, { anchor: "end", size: 11, mono: true, fill: C.fg }));
    art.appendChild(s("rect", { x, y, width: w, height: h, rx: 4, fill: C.panel2, stroke: C.line }));
    art.appendChild(s("rect", { x, y, width: pw, height: h, rx: 4, fill: C.purple, opacity: 0.85 }));
    art.appendChild(txt(x, y - 7, fmt(proj) + " project + " + fmt(attend) + " attend = " + fmt(total) + " MACs", { size: 10.5, mono: true }));
    art.appendChild(txt(x + pw, y - 25, "projection", { size: 9.5, fill: C.purple }));
    art.appendChild(txt(x + pw + aw + 6, y + h / 2 + 4, "attention", { size: 9.5, fill: C.teal }));
  }

  function drawStepCost(art: SVGSVGElement): void {
    const past = n - 1;
    const cProj = 2 * D * D;
    const cAttn = 2 * past * D;
    const nProj = 2 * (past + 1) * D * D;
    const nAttn = 2 * past * D;
    const nTotal = nProj + nAttn;
    const bx = 180;
    const bw = 470;
    const bh = 22;
    costBar(art, bx, 86, bw, bh, "with cache", cProj, cAttn, nTotal);
    costBar(art, bx, 148, bw, bh, "no cache", nProj, nAttn, nTotal);

    const cy = 216;
    const ch = 108;
    const maxMacs = Math.max(1, stepMacs(past, false));
    const px = (t: number) => bx + (past === 0 ? bw : (t / past) * bw);
    const py = (v: number) => cy + ch - (v / maxMacs) * ch;
    art.appendChild(s("line", { x1: bx, y1: cy + ch, x2: bx + bw, y2: cy + ch, stroke: C.line }));
    art.appendChild(s("line", { x1: bx, y1: cy, x2: bx, y2: cy + ch, stroke: C.line }));
    art.appendChild(txt(bx - 12, cy + 6, fmt(maxMacs), { anchor: "end", size: 9.5, mono: true }));
    art.appendChild(txt(bx - 12, cy + ch + 4, "0", { anchor: "end", size: 9.5, mono: true }));
    art.appendChild(txt(bx, cy - 12, "MACs per step, per slice", { size: 10.5, fill: C.fg }));
    art.appendChild(txt(bx + bw, cy + ch + 18, "steps 1 … " + n, { anchor: "end", size: 9.5, mono: true }));
    let dA = "";
    let dB = "";
    for (let t = 0; t <= past; t++) {
      dA += (t === 0 ? "M " : " L ") + px(t) + " " + py(stepMacs(t, true));
      dB += (t === 0 ? "M " : " L ") + px(t) + " " + py(stepMacs(t, false));
    }
    art.appendChild(s("path", { d: dB, fill: "none", stroke: C.bad, "stroke-width": 1.6 }));
    art.appendChild(s("path", { d: dA, fill: "none", stroke: C.accent, "stroke-width": 1.6 }));
    art.appendChild(txt(bx + bw - 4, py(stepMacs(past, false)) - 8, "no cache", { anchor: "end", size: 10, fill: C.bad }));
    art.appendChild(txt(bx + bw - 4, py(stepMacs(past, true)) - 8, "with cache", { anchor: "end", size: 10, fill: C.accent }));
    art.appendChild(txt(bx, 356, "The gap between the lines is the projection work the cache removes; the attention term is in both.", { size: 11.5 }));
  }

  function drawRunCost(art: SVGSVGElement): void {
    const cProj = cumProj(n, true);
    const cAttn = cumAttend(n);
    const nProj = cumProj(n, false);
    const nAttn = cumAttend(n);
    const nTotal = nProj + nAttn;
    const bx = 180;
    const bw = 470;
    const bh = 24;
    costBar(art, bx, 82, bw, bh, "with cache", cProj, cAttn, nTotal);
    costBar(art, bx, 152, bw, bh, "no cache", nProj, nAttn, nTotal);
    art.appendChild(txt(20, 232, "with cache:  Σ (2d² + 2td) = " + fmt(cProj + cAttn) + " MACs — the projection term is a straight line.", { size: 11.5, fill: C.fg }));
    art.appendChild(txt(20, 256, "no cache:    Σ (2(t+1)d² + 2td) = " + fmt(nTotal) + " MACs — the projection term grows like n².", { size: 11.5, fill: C.fg }));
    art.appendChild(txt(20, 292, "Re-projection is " + Math.round((100 * (nProj - cProj)) / nTotal) + "% of the no-cache bill, and it is the part the cache removes.", { size: 11.5 }));
    art.appendChild(txt(20, 316, "The read over cached keys stays in both bills: a cache never makes attention itself cheaper.", { size: 11.5 }));
    art.appendChild(txt(20, 348, "That is the whole of the saving: identical outputs, one straight line instead of a quadratic rise.", { size: 11.5, fill: C.ok }));
  }

  /* ------------------------------ section 9 ----------------------------- */

  function drawMemory(art: SVGSVGElement): void {
    const sx = 40;
    const pitch = 20;
    for (let r = 0; r < n; r++) {
      const y = 56 + r * pitch;
      art.appendChild(s("rect", { x: sx, y, width: 240, height: 15, rx: 3, fill: C.panel, stroke: C.line }));
      const k = keyVec(layer, head, r);
      const v = valVec(layer, head, r);
      for (let j = 0; j < D; j++) {
        art.appendChild(s("rect", { x: sx + 8 + j * 13, y: y + 2, width: 10, height: 11, rx: 1, fill: cellFill(k[j], C.purple) }));
        art.appendChild(s("rect", { x: sx + 126 + j * 13, y: y + 2, width: 10, height: 11, rx: 1, fill: cellFill(v[j], C.teal) }));
      }
    }
    art.appendChild(txt(sx + 8, 50, "key rows", { size: 9.5, fill: C.purple }));
    art.appendChild(txt(sx + 126, 50, "value rows", { size: 9.5, fill: C.teal }));
    const cx = 320;
    const lines: Array<[number, string]> = [
      [70, "per position, per layer, per head:"],
      [90, "2 rows × " + D + " numbers."],
      [122, LAYERS + " layers × " + HEADS + " heads = " + LAYERS * HEADS + " slices,"],
      [142, "so " + NUM_PER_POS + " numbers per position."],
      [174, "at " + BYTES_PER_NUM + " bytes a number: " + fmtBytes(NUM_PER_POS * BYTES_PER_NUM) + " per position,"],
      [194, fmtBytes(NUM_PER_POS * BYTES_PER_NUM * n) + " at " + n + " positions — one row per step."],
      [232, "linear in context, while the compute saving"],
      [252, "per step is roughly flat once d is large."],
    ];
    for (const [ly, text] of lines) art.appendChild(txt(cx, ly, text, { size: 11 }));
    art.appendChild(txt(40, 330, "The cache trades compute for memory. Attention over n keys still costs 2nd per step either way.", { size: 11.5 }));
  }

  const LAYER_STEPS = [
    { label: "input h_t", note: "The vector for this position, handed up by the layer below. One vector per position." },
    { label: "RMSNorm", note: "Per token: it normalizes that one vector. No other position is involved." },
    { label: "q, k, v projections", note: "Per token: three matrix-vector products on h_t alone. This is why a stored k or v never needs rebuilding." },
    { label: "attention", note: "The one cross-token step: q_t is dotted with every cached k, and the weights mix every cached v." },
    { label: "+ residual", note: "Per token: the attention output is added back onto h_t." },
    { label: "RMSNorm + MLP", note: "Per token: a position-wise feed-forward block, the same arithmetic at every position." },
    { label: "output h_t", note: "Sent up to the next layer. Nothing on this path needed a token to the right — which is what makes the cache legal." },
  ];

  function drawLayer(art: SVGSVGElement): void {
    const x = 20;
    const w = 280;
    const blocks = [
      { y: 40, h: 34, label: "h_t · this layer in", sub: "one vector per position" },
      { y: 90, h: 30, label: "RMSNorm", sub: "per token" },
      { y: 136, h: 46, label: "", sub: "" },
      { y: 198, h: 58, label: "softmax(q·kᵀ/√d) · v", sub: "the only cross-token step" },
      { y: 272, h: 30, label: "+ residual", sub: "per token" },
      { y: 318, h: 36, label: "RMSNorm + MLP", sub: "per token" },
      { y: 370, h: 34, label: "h_t out · layer above", sub: "per token" },
    ];
    art.appendChild(
      txt(x, 26, "stage " + (layerStep + 1) + " / " + LAYER_STEPS.length + " · " + LAYER_STEPS[layerStep].label, { size: 11.5, fill: C.fg, weight: 600 }),
    );

    blocks.forEach((blk, i) => {
      if (i === 2) return;
      const attn = i === 3;
      const on = i === layerStep;
      art.appendChild(
        s("rect", {
          x,
          y: blk.y,
          width: w,
          height: blk.h,
          rx: 8,
          fill: attn ? C.accent : C.panel,
          "fill-opacity": attn ? 0.1 : 1,
          stroke: on ? C.fg : attn ? C.accent : C.line,
          "stroke-width": on ? 1.8 : 1,
        }),
      );
      art.appendChild(txt(x + 12, blk.y + 18, blk.label, { size: 11.5, mono: attn, fill: C.fg }));
      art.appendChild(txt(x + 12, blk.y + (attn ? 44 : 32), blk.sub, { size: 9.5, fill: attn ? C.accent : C.dim }));
    });

    const py = 136;
    const ph = 46;
    const names = ["q = W_Q h", "k = W_K h", "v = W_V h"];
    const cols = [C.accent, C.purple, C.teal];
    for (let j = 0; j < 3; j++) {
      const bx = x + j * 94;
      const on = layerStep === 2;
      art.appendChild(s("rect", { x: bx, y: py, width: 88, height: ph, rx: 7, fill: C.panel, stroke: on ? C.fg : cols[j], "stroke-width": on ? 1.6 : 1 }));
      art.appendChild(txt(bx + 44, py + 20, names[j], { anchor: "middle", size: 10.5, mono: true, fill: cols[j] }));
      art.appendChild(txt(bx + 44, py + 35, "per token", { anchor: "middle", size: 9 }));
    }
    for (let j = 0; j < 3; j++) {
      const bx = x + j * 94 + 44;
      art.appendChild(s("line", { x1: bx, y1: py + ph, x2: bx, y2: 186, stroke: C.dim, "stroke-width": 1, opacity: 0.7 }));
    }
    art.appendChild(s("line", { x1: 64, y1: 186, x2: 252, y2: 186, stroke: C.dim, "stroke-width": 1, opacity: 0.7 }));
    arrow(art, 160, 186, 160, 194, C.dim, "arw-d");
    arrow(art, x + w / 2, 74, x + w / 2, 84, C.dim, "arw-d");
    arrow(art, x + w / 2, 120, x + w / 2, 130, C.dim, "arw-d");
    arrow(art, x + w / 2, 256, x + w / 2, 266, C.dim, "arw-d");
    arrow(art, x + w / 2, 302, x + w / 2, 312, C.dim, "arw-d");
    arrow(art, x + w / 2, 354, x + w / 2, 364, C.dim, "arw-d");

    const perToken = layerStep !== 3;
    const coupling = layerStep === 3;
    art.appendChild(txt(336, 46, "per token or cross-token", { size: 10.5, fill: C.fg, weight: 600 }));
    art.appendChild(
      s("rect", { x: 336, y: 56, width: 352, height: 128, rx: 9, fill: C.panel, "fill-opacity": perToken ? 1 : 0.5, stroke: perToken ? C.ok : C.line, "stroke-width": perToken ? 1.4 : 1 }),
    );
    art.appendChild(s("circle", { cx: 352, cy: 74, r: 4, fill: C.ok }));
    art.appendChild(txt(364, 78, "independent · per token", { size: 10.5, fill: C.ok, weight: 600 }));
    art.appendChild(txt(352, 102, "RMSNorm", { size: 11 }));
    art.appendChild(txt(352, 124, "q, k, v projections", { size: 11 }));
    art.appendChild(txt(352, 146, "MLP, output projection", { size: 11 }));
    art.appendChild(txt(352, 172, "no term from any other position", { size: 10.5, fill: C.dim }));

    art.appendChild(
      s("rect", { x: 336, y: 198, width: 352, height: 78, rx: 9, fill: C.panel, "fill-opacity": coupling ? 1 : 0.5, stroke: coupling ? C.warn : C.line, "stroke-width": coupling ? 1.4 : 1 }),
    );
    art.appendChild(s("circle", { cx: 352, cy: 216, r: 4, fill: C.warn }));
    art.appendChild(txt(364, 220, "couples positions", { size: 10.5, fill: C.warn, weight: 600 }));
    art.appendChild(txt(352, 244, "q_t · every cached k", { size: 11 }));
    art.appendChild(txt(352, 266, "weights · every cached v", { size: 11 }));
    arrow(art, 336, 237, 304, 237, C.warn, "arw-w", 1.2);

    const demoOn = layerStep === 2 || layerStep === 3;
    const boxes = [336, 520];
    const labels = ["position t−2", "position t−1"];
    for (let j = 0; j < 2; j++) {
      art.appendChild(
        s("rect", { x: boxes[j], y: 292, width: 168, height: 32, rx: 7, fill: C.panel, stroke: demoOn ? C.ok : C.line, "stroke-width": demoOn ? 1.3 : 1 }),
      );
      art.appendChild(txt(boxes[j] + 84, 306, labels[j], { anchor: "middle", size: 10.5, mono: true, fill: C.fg }));
      art.appendChild(txt(boxes[j] + 84, 319, "its own k, v", { anchor: "middle", size: 9 }));
      arrow(art, boxes[j] + 84, 324, boxes[j] + 84, 354, demoOn ? C.warn : C.line, "arw-w", 1);
    }
    art.appendChild(txt(512, 313, "∥", { anchor: "middle", size: 14, fill: C.ok, weight: 700 }));
    art.appendChild(txt(336, 342, "computed side by side — no arrows between them", { size: 10.5, fill: demoOn ? C.ok : C.dim }));
    art.appendChild(
      s("rect", { x: 336, y: 358, width: 352, height: 36, rx: 9, fill: C.warn, "fill-opacity": 0.08, stroke: C.warn, "stroke-width": 1, "stroke-dasharray": "4 3" }),
    );
    art.appendChild(txt(352, 380, "attention: reads every row written so far", { size: 10.5, fill: C.warn }));

    art.appendChild(txt(x, 428, LAYER_STEPS[layerStep].note, { size: 11.5, fill: C.fg }));
  }

  const draws = [drawLoop, drawLayer, drawAttention, drawPrefill, drawDecode, drawNoCache, drawCache, drawStepCost, drawRunCost, drawMemory];

  /* -------------------------------- cards -------------------------------- */

  function cardsFor(i: number): Array<{ k: string; v: string; hint?: string }> {
    const past = n - 1;
    const sec = SECS[i].id;
    if (sec === "layer") {
      const step = LAYER_STEPS[layerStep];
      return [
        { k: "stage", v: layerStep + 1 + " / " + LAYER_STEPS.length },
        { k: "block", v: step.label },
        {
          k: "cross-token",
          v: layerStep === 3 ? "yes" : "no",
          hint: layerStep === 3 ? "reads every cached row" : "this position alone",
        },
      ];
    }
    if (sec === "loop") {
      const probs = distribution(n);
      let best = 0;
      probs.forEach((p, j) => {
        if (p > probs[best]) best = j;
      });
      return [
        { k: "vocabulary", v: TEXT.length + " words", hint: "a real one is ~100k" },
        { k: "sampled token", v: n < TEXT.length ? TEXT[n] : "—" },
        { k: "top probability", v: probs[best].toFixed(2) },
        { k: "sequence length", v: String(n) },
      ];
    }
    if (sec === "attention") {
      const a = attention(layer, head, past);
      const maxA = a.length ? Math.max(...a) : 0;
      const sum = a.reduce((x, y) => x + y, 0);
      return [
        { k: "keys read", v: String(a.length) },
        { k: "largest weight", v: maxA.toFixed(3) },
        { k: "weights sum", v: sum.toFixed(3) },
        { k: "slice", v: layer + "." + head },
      ];
    }
    if (sec === "prefill") {
      return [
        { k: "prompt positions", v: String(PROMPT_N) },
        { k: "rows written", v: String(PROMPT_N) },
        { k: "passes", v: "1", hint: "parallel over positions" },
      ];
    }
    if (sec === "decode") {
      return [
        { k: "rows read", v: String(past) },
        { k: "rows written", v: "1" },
        { k: "projection MACs", v: fmt(2 * D * D) },
        { k: "attention MACs", v: fmt(2 * past * D) },
      ];
    }
    if (sec === "nocache") {
      return [
        { k: "rows rebuilt", v: String((n * (n + 1)) / 2), hint: "only " + n + " rows exist" },
        { k: "projection MACs", v: fmt(cumProj(n, false)) },
        { k: "t0 rebuilt", v: n + "×" },
      ];
    }
    if (sec === "cache") {
      return [
        { k: "rows written", v: String(n) },
        { k: "rows read", v: String((n * (n - 1)) / 2) },
        { k: "projection MACs", v: fmt(cumProj(n, true)) },
      ];
    }
    if (sec === "stepcost") {
      const c = stepMacs(past, true);
      const nc = stepMacs(past, false);
      return [
        { k: "this step, with cache", v: fmt(c) },
        { k: "this step, no cache", v: fmt(nc) },
        { k: "ratio", v: "×" + (nc / c).toFixed(1) },
        { k: "re-projection dropped", v: fmt(nc - c) + " MACs" },
      ];
    }
    if (sec === "runcost") {
      const withC = cumMacs(n, true);
      const noC = cumMacs(n, false);
      return [
        { k: "whole run, with cache", v: fmt(withC) },
        { k: "whole run, no cache", v: fmt(noC) },
        { k: "ratio", v: "×" + (noC / withC).toFixed(2) },
        { k: "attention share", v: Math.round((100 * cumAttend(n)) / noC) + "%", hint: "of the no-cache bill" },
      ];
    }
    return [
      { k: "numbers per position", v: String(NUM_PER_POS) },
      { k: "bytes per position", v: fmtBytes(NUM_PER_POS * BYTES_PER_NUM) },
      { k: "bytes at " + n + " positions", v: fmtBytes(NUM_PER_POS * BYTES_PER_NUM * n) },
    ];
  }

  /* ------------------------------- controls ------------------------------ */

  const sampleBtn = mkBtn("▶ Sample next token", true);
  const loopReset = mkBtn("Reset");
  const layerNext = mkBtn("▶ Stage the layer", true);
  const layerBack = mkBtn("◀ Back");
  const stepBtn = mkBtn("▶ Step decode", true);

  function appendToken(): void {
    if (dead) return;
    if (n >= MAX_N) {
      n = MIN_N;
    } else {
      n += 1;
    }
    posRange.value = String(n);
    flash = false;
    render();
  }

  function animateAppend(): void {
    if (timer !== null) window.clearTimeout(timer);
    if (n >= MAX_N) {
      n = MIN_N;
      posRange.value = String(n);
    }
    flash = true;
    render();
    timer = window.setTimeout(() => {
      timer = null;
      appendToken();
    }, 620);
  }

  sampleBtn.addEventListener("click", animateAppend);
  stepBtn.addEventListener("click", animateAppend);
  loopReset.addEventListener("click", () => {
    n = MIN_N;
    posRange.value = String(n);
    flash = false;
    render();
  });
  posRange.addEventListener("input", () => {
    n = Number(posRange.value);
    render();
  });

  layerNext.addEventListener("click", () => {
    layerStep = layerStep >= LAYER_STEPS.length - 1 ? 0 : layerStep + 1;
    render();
  });
  layerBack.addEventListener("click", () => {
    layerStep = Math.max(0, layerStep - 1);
    render();
  });

  secEls[0].ctl.append(sampleBtn, loopReset);
  secEls[1].ctl.append(layerNext, layerBack);
  secEls[4].ctl.append(stepBtn);

  /* -------------------------------- render ------------------------------- */

  function render(): void {
    if (dead) return;
    posOut.textContent = String(n);
    headBtns.forEach((b, i) => {
      b.classList.toggle("on", Math.floor(i / HEADS) === layer && i % HEADS === head);
    });
    layerNext.textContent = layerStep >= LAYER_STEPS.length - 1 ? "↺ From the input" : "▶ Stage the layer";
    layerBack.disabled = layerStep === 0;
    sampleBtn.disabled = false;
    sampleBtn.textContent = flash ? "sampling…" : n >= MAX_N ? "↺ Restart the loop" : "▶ Sample next token";
    stepBtn.textContent = flash ? "decoding…" : n >= MAX_N ? "↺ Restart" : "▶ Step decode";

    secEls.forEach((el, i) => {
      el.svg.textContent = "";
      const defs = s("defs");
      defs.append(marker("arw-a", C.accent), marker("arw-t", C.teal), marker("arw-d", C.dim), marker("arw-g", C.ok), marker("arw-w", C.warn));
      el.svg.appendChild(defs);
      draws[i](el.svg);
      el.cards.textContent = "";
      const specs = cardsFor(i);
      for (const spec of specs) {
        const c = document.createElement("div");
        c.className = "ill-card";
        const k = document.createElement("div");
        k.className = "k";
        k.textContent = spec.k;
        const v = document.createElement("div");
        v.className = "v";
        v.textContent = spec.v;
        c.append(k, v);
        if (spec.hint) {
          const h = document.createElement("div");
          h.className = "ill-card-hint";
          h.textContent = spec.hint;
          c.appendChild(h);
        }
        el.cards.appendChild(c);
      }
    });
  }

  render();

  return {
    reset() {
      n = MIN_N;
      posRange.value = String(n);
      render();
    },
    destroy() {
      dead = true;
      if (timer !== null) window.clearTimeout(timer);
      root.remove();
    },
  };
};

export default kvCache;
