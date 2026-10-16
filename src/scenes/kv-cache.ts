/**
 * Illustration: kv-cache — where a decoder-only transformer spends its compute.
 *
 * A guided walkthrough in seven stages over one toy model: 2 layers x 2 heads per
 * layer, head dimension d = 8. One (layer, head) slice is therefore exactly eight
 * numbers wide, and every figure is the real arithmetic, just small enough to count
 * by hand. No real-model statistics: the point is the shape of the work — what one
 * step computes, what the cache lets it skip, and what keeping the cache costs.
 *
 * Stages:
 *   0  decoding is one position at a time
 *   1  every position leaves behind a key and a value
 *   2  without a cache, every step re-projects the whole past
 *   3  with a cache, a step writes one row and reads the rest
 *   4  what one step costs, with and without the cache
 *   5  how the saving sums up over a whole generation
 *   6  what the cache costs: memory
 *
 * Not a lesson scene (no narration beats), but it keeps the factory contract:
 * append into host, return destroy().
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
const D = 8; // head dimension: eight numbers per row, counted on screen
const MIN_N = 4;
const MAX_N = 12;
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

/** Key row for a position: what that position offers to be matched. */
const keyVec = (l: number, h: number, p: number): Vec =>
  cachedVec("k:" + l + ":" + h + ":" + p, () => unit((i) => gauss(l, h, p, i, 11)));

/** Value row for a position: what it contributes once matched. */
const valVec = (l: number, h: number, p: number): Vec =>
  cachedVec("v:" + l + ":" + h + ":" + p, () => unit((i) => gauss(l, h, p, i, 22)));

/* -------------------------------- the costs ------------------------------- */

/**
 * Multiply-accumulates for one decode step, per (layer, head) slice.
 *   cached   -> project only the new token, read n cached rows: 2d² + 2nd
 *   no cache -> re-project every past token as well:        2(n+1)d² + 2nd
 * The query is new at every step either way, so it is left out of both sides.
 */
function stepMacs(past: number, cached: boolean): number {
  const proj = cached ? 2 * D * D : 2 * (past + 1) * D * D;
  const attend = 2 * past * D;
  return proj + attend;
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

const NUM_PER_POS = 2 * LAYERS * HEADS * D; // one key row + one value row, per layer-head
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

/** A cell colour carrying the magnitude of one number. */
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

/* geometry (viewBox 720 x 400) */
const VB_W = 720;
const VB_H = 400;
const CELL_W = 30;
const CELL_GAP = 6;
const CELL_PITCH = CELL_W + CELL_GAP;
const GRID_X = 180;
const GRID_Y = 98;
const ROW_H = 15;
const ROW_PITCH = 21;
const colX = (p: number): number => GRID_X + p * CELL_PITCH;
const rowY = (r: number): number => GRID_Y + (r - 1) * ROW_PITCH;

interface StageDef {
  short: string;
  caption: string;
}

const STAGES: StageDef[] = [
  {
    short: "one at a time",
    caption:
      "Decoding is sequential: each new position reads the positions to its left, and that lookback is the work the cache exists to reuse.",
  },
  {
    short: "keys and values",
    caption:
      "Keys and values are functions of a position alone. Compute them once and they stay valid for every later step.",
  },
  {
    short: "no cache",
    caption:
      "With no cache, step t rebuilds the keys and values of every earlier position — the same numbers, over and over. The dark red cells are work already done.",
  },
  {
    short: "with a cache",
    caption:
      "With a cache, each step writes one new row and reads the rows already kept. Same keys, same values — computed once, read many times.",
  },
  {
    short: "cost of a step",
    caption:
      "The cache deletes the re-projection term: 2(t+1)d² becomes 2d² per step. The read over cached keys stays, because that part is genuinely new work.",
  },
  {
    short: "the whole run",
    caption:
      "Summed over the run, the no-cache projection bill grows like n²; with the cache it is a straight line. Attention grows either way.",
  },
  {
    short: "what it costs",
    caption:
      "The price is memory: one key row and one value row per position, per layer, per KV head. It grows with context, and it never shrinks.",
  },
];

/* --------------------------------- scene ---------------------------------- */

const kvCache: SceneFactory = (host) => {
  let stage = 0;
  let n = 8;
  let layer = 0;
  let head = 0;
  let running = false;
  let dead = false;
  let timer: number | null = null;

  /* -------------------------------- dom -------------------------------- */
  const root = document.createElement("div");
  root.className = "ill";

  const rail = document.createElement("div");
  rail.className = "ill-rail";
  const railBtns: HTMLButtonElement[] = [];
  STAGES.forEach((def, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ill-stage";
    b.innerHTML = `<span class="n">${i + 1}</span><span>${def.short}</span>`;
    b.title = def.caption;
    b.addEventListener("click", () => {
      stop();
      go(i);
    });
    rail.appendChild(b);
    railBtns.push(b);
  });

  const ctl = document.createElement("div");
  ctl.className = "ill-ctl";

  const mkBtn = (label: string, primary = false): HTMLButtonElement => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = primary ? "btn primary" : "btn";
    b.textContent = label;
    return b;
  };
  const prevBtn = mkBtn("← Back");
  const nextBtn = mkBtn("Next →", true);
  const playBtn = mkBtn("▶ Play");
  const resetBtn = mkBtn("Reset");

  const posWrap = document.createElement("label");
  const posRange = document.createElement("input");
  posRange.type = "range";
  posRange.min = String(MIN_N);
  posRange.max = String(MAX_N);
  posRange.step = "1";
  posRange.value = String(n);
  const posOut = document.createElement("span");
  posOut.className = "ill-step";
  posWrap.append(document.createTextNode("positions "), posRange, posOut);

  const headsWrap = document.createElement("div");
  headsWrap.className = "ill-slice";
  const headsLabel = document.createElement("span");
  headsLabel.className = "ill-slice-label";
  headsLabel.textContent = "slice";
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

  ctl.append(prevBtn, nextBtn, playBtn, resetBtn, posWrap, headsWrap);

  const fig = document.createElement("div");
  fig.className = "ill-fig";
  const art = s("svg", { viewBox: `0 0 ${VB_W} ${VB_H}`, role: "img", "aria-label": "KV cache walkthrough" });
  fig.appendChild(art);

  const caption = document.createElement("p");
  caption.className = "ill-caption";

  const cards = document.createElement("div");
  cards.className = "ill-cards";

  const legend = document.createElement("div");
  legend.className = "ill-legend-box";
  const legendTitle = document.createElement("div");
  legendTitle.className = "ill-legend-head";
  legendTitle.textContent = "how to read it";
  legend.appendChild(legendTitle);
  const swatches: Array<[string, string, boolean]> = [
    [C.accent, "computed at this step", false],
    [C.teal, "read from the cache, not recomputed", true],
    [C.bad, "recomputed again: work already done", false],
    [C.panel2, "not needed yet", false],
  ];
  for (const [color, label, outline] of swatches) {
    const row = document.createElement("span");
    row.className = "ill-legend-item";
    const sw = document.createElement("span");
    sw.className = outline ? "ill-sw outline" : "ill-sw";
    if (outline) sw.style.borderColor = color;
    else sw.style.background = color;
    row.append(sw, document.createTextNode(label));
    legend.appendChild(row);
  }
  const legendFoot = document.createElement("span");
  legendFoot.className = "ill-legend-item dim";
  legendFoot.textContent = "arrows = attention reading a key that is already stored";
  legend.appendChild(legendFoot);

  const note = document.createElement("p");
  note.className = "ill-note";
  note.textContent =
    "Toy model: 2 layers × 2 heads, head dimension d = 8 — one slice is eight numbers wide. " +
    "MACs count the K and V projections plus the attention read; the query is new at every step either way, so it is left out. " +
    "A real model multiplies the layers, heads and d, and leaves the shape of the saving alone.";

  root.append(rail, ctl, fig, caption, cards, legend, note);
  host.appendChild(root);

  /* ------------------------------ rendering ----------------------------- */

  function header(title: string, hint: string): void {
    art.appendChild(txt(20, 24, title, { fill: C.fg, size: 12.5, weight: 600 }));
    art.appendChild(txt(VB_W - 20, 24, hint, { anchor: "end", size: 10.5 }));
  }

  /** One stacked cost bar: projection + attention, on a shared scale. */
  function costBar(x: number, y: number, w: number, h: number, label: string, proj: number, attend: number, scale: number): void {
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

  function draw0(): void {
    header("1 · decoding is one position at a time", "n = " + n + " positions");
    const w = 46;
    const pitch = 52;
    const x0 = 26;
    const y = 152;
    const h = 56;
    const nx = x0 + (n - 1) * pitch;

    if (n > 1) {
      art.appendChild(s("rect", { x: x0 - 8, y: y - 12, width: (n - 2) * pitch + w + 16, height: h + 24, rx: 12, fill: C.accent, opacity: 0.05 }));
      art.appendChild(txt(x0 - 4, y - 20, "the past it may look at", { size: 10 }));
    }

    for (let i = 0; i < n; i++) {
      const x = x0 + i * pitch;
      const fresh = i === n - 1;
      art.appendChild(s("rect", { x, y, width: w, height: h, rx: 9, fill: fresh ? C.accent : C.panel, "fill-opacity": fresh ? 0.16 : 1, stroke: fresh ? C.accent : C.line, "stroke-width": fresh ? 1.6 : 1 }));
      art.appendChild(txt(x + w / 2, y + 24, TEXT[i] ?? "", { anchor: "middle", fill: fresh ? C.fg : C.dim, size: 10.5, mono: true }));
      art.appendChild(txt(x + w / 2, y + 42, "t" + i, { anchor: "middle", size: 9, mono: true }));
      if (fresh) art.appendChild(txt(x + w / 2, y - 26, "newest", { anchor: "middle", fill: C.accent, size: 10, weight: 600 }));
    }

    for (let i = 0; i < n - 1; i++) {
      const sx = nx + w / 2;
      const tx = x0 + i * pitch + w / 2;
      const cy = 118 - (n - 1 - i) * 4;
      art.appendChild(
        s("path", {
          d: "M " + sx + " " + (y - 30) + " Q " + ((sx + tx) / 2 | 0) + " " + cy + " " + tx + " " + (y - 30),
          fill: "none",
          stroke: C.accent,
          "stroke-width": 1,
          opacity: 0.3,
          "marker-end": "url(#arw-a)",
        }),
      );
    }

    art.appendChild(txt(20, 262, "Causal attention: a new position reads every position to its left, nothing to its right.", { size: 11.5 }));
    art.appendChild(txt(20, 284, "That lookback is what makes decoding cost anything in the first place.", { size: 11.5 }));
    art.appendChild(txt(20, 314, "Prefill writes all prompt rows in one parallel pass; decode then adds one row per step.", { size: 11.5 }));
  }

  function draw1(): void {
    header("2 · every position leaves behind a key and a value", "slice " + layer + "." + head);
    const p = 3;
    const tx = 26;
    const tw = 96;
    const ty = 158;
    const th = 44;
    art.appendChild(s("rect", { x: tx, y: ty, width: tw, height: th, rx: 9, fill: C.panel, stroke: C.accent, "stroke-width": 1.2 }));
    art.appendChild(txt(tx + tw / 2, ty + 20, TEXT[p] ?? "", { anchor: "middle", fill: C.fg, size: 11, mono: true }));
    art.appendChild(txt(tx + tw / 2, ty + 36, "position t" + p, { anchor: "middle", size: 9 }));

    art.appendChild(s("line", { x1: tx + tw, y1: ty + 12, x2: 250, y2: 122, stroke: C.purple, "stroke-width": 1.2, "marker-end": "url(#arw-a)" }));
    art.appendChild(txt(184, 132, "× W_K", { anchor: "middle", size: 10, fill: C.purple, mono: true }));
    art.appendChild(s("line", { x1: tx + tw, y1: ty + 34, x2: 250, y2: 214, stroke: C.teal, "stroke-width": 1.2, "marker-end": "url(#arw-t)" }));
    art.appendChild(txt(184, 222, "× W_V", { anchor: "middle", size: 10, fill: C.teal, mono: true }));

    const k = keyVec(layer, head, p);
    const v = valVec(layer, head, p);
    const rx = 262;
    const ry = 112;
    const rw = 18;
    const rh = 20;
    art.appendChild(txt(252, ry + 15, "k", { anchor: "end", size: 13, fill: C.purple, weight: 600 }));
    art.appendChild(txt(252, ry + 109, "v", { anchor: "end", size: 13, fill: C.teal, weight: 600 }));
    for (let j = 0; j < D; j++) {
      art.appendChild(s("rect", { x: rx + j * (rw + 4), y: ry, width: rw, height: rh, rx: 2, fill: cellFill(k[j], C.purple) }));
      art.appendChild(s("rect", { x: rx + j * (rw + 4), y: ry + 94, width: rw, height: rh, rx: 2, fill: cellFill(v[j], C.teal) }));
    }

    const cx = 470;
    const lines: Array<[number, string]> = [
      [122, "k: what this position offers."],
      [142, "v: what it contributes once matched."],
      [180, "Both depend on this position alone —"],
      [200, "compute them once and they stay valid."],
      [238, "one slice: " + D + " numbers per row,"],
      [258, LAYERS + " layers × " + HEADS + " heads = " + LAYERS * HEADS + " slices here."],
      [296, "later steps read these rows instead"],
      [316, "of rebuilding them. That is the cache."],
    ];
    for (const [ly, text] of lines) art.appendChild(txt(cx, ly, text, { size: 11 }));
  }

  function draw2(): void {
    header("3 · no cache: every step rebuilds the whole past", "n = " + n);
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
    art.appendChild(
      txt(GRID_X, fy, ((n * (n + 1)) / 2) + " projections written, but only " + n + " distinct rows exist.", { size: 11.5, fill: C.fg }),
    );
    art.appendChild(txt(GRID_X, fy + 20, "Darker = rebuilt more often; t0 is rebuilt at every single step.", { size: 11.5 }));
  }

  function draw3(): void {
    header("4 · with a cache: write one row, read the rest", "n = " + n);
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
    art.appendChild(
      txt(20, fy, "Every row is written once and read by every later step: " + ((n * (n - 1)) / 2) + " reads, " + n + " writes.", { size: 11.5, fill: C.fg }),
    );
    art.appendChild(txt(20, fy + 20, "The new row costs one projection; every read costs one dot product.", { size: 11.5 }));
  }

  function draw4(): void {
    const past = n - 1;
    header("5 · what one step costs, with and without", "step " + n + " · " + past + " cached keys");
    const cProj = 2 * D * D;
    const cAttn = 2 * past * D;
    const nProj = 2 * (past + 1) * D * D;
    const nAttn = 2 * past * D;
    const nTotal = nProj + nAttn;
    const bx = 180;
    const bw = 470;
    const bh = 22;
    costBar(bx, 86, bw, bh, "with cache", cProj, cAttn, nTotal);
    costBar(bx, 148, bw, bh, "no cache", nProj, nAttn, nTotal);

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
  }

  function draw5(): void {
    header("6 · how the saving sums up over the run", "n = " + n + " steps");
    const cProj = cumProj(n, true);
    const cAttn = cumAttend(n);
    const nProj = cumProj(n, false);
    const nAttn = cumAttend(n);
    const nTotal = nProj + nAttn;
    const bx = 180;
    const bw = 470;
    const bh = 24;
    costBar(bx, 82, bw, bh, "with cache", cProj, cAttn, nTotal);
    costBar(bx, 152, bw, bh, "no cache", nProj, nAttn, nTotal);
    art.appendChild(
      txt(20, 232, "with cache:  Σ (2d² + 2td) = " + fmt(cProj + cAttn) + " MACs — the projection term is a straight line.", { size: 11.5, fill: C.fg }),
    );
    art.appendChild(
      txt(20, 256, "no cache:    Σ (2(t+1)d² + 2td) = " + fmt(nTotal) + " MACs — the projection term grows like n².", { size: 11.5, fill: C.fg }),
    );
    art.appendChild(
      txt(20, 292, "Re-projection is " + Math.round((100 * (nProj - cProj)) / nTotal) + "% of the no-cache bill, and it is the part the cache removes.", { size: 11.5 }),
    );
    art.appendChild(
      txt(20, 316, "The read over cached keys stays in both bills: a cache never makes attention itself cheaper.", { size: 11.5 }),
    );
  }

  function draw6(): void {
    header("7 · what the cache costs: memory", "n = " + n + " positions");
    const sx = 40;
    const pitch = 20;
    for (let r = 0; r < n; r++) {
      const y = 96 + r * pitch;
      art.appendChild(s("rect", { x: sx, y, width: 240, height: 15, rx: 3, fill: C.panel, stroke: C.line }));
      const k = keyVec(layer, head, r);
      const v = valVec(layer, head, r);
      for (let j = 0; j < D; j++) {
        art.appendChild(s("rect", { x: sx + 8 + j * 13, y: y + 2, width: 10, height: 11, rx: 1, fill: cellFill(k[j], C.purple) }));
        art.appendChild(s("rect", { x: sx + 126 + j * 13, y: y + 2, width: 10, height: 11, rx: 1, fill: cellFill(v[j], C.teal) }));
      }
    }
    art.appendChild(txt(sx + 8, 90, "key rows", { size: 9.5, fill: C.purple }));
    art.appendChild(txt(sx + 126, 90, "value rows", { size: 9.5, fill: C.teal }));

    const cx = 320;
    const lines: Array<[number, string]> = [
      [104, "per position, per layer, per head:"],
      [124, "2 rows × " + D + " numbers."],
      [156, LAYERS + " layers × " + HEADS + " heads = " + LAYERS * HEADS + " slices,"],
      [176, "so " + NUM_PER_POS + " numbers per position."],
      [208, "at " + BYTES_PER_NUM + " bytes a number: " + fmtBytes(NUM_PER_POS * BYTES_PER_NUM) + " per position,"],
      [228, fmtBytes(NUM_PER_POS * BYTES_PER_NUM * n) + " at " + n + " positions — one row per step."],
      [266, "linear in context, while the compute saving"],
      [286, "per step is roughly flat once d is large."],
    ];
    for (const [ly, text] of lines) art.appendChild(txt(cx, ly, text, { size: 11 }));
    art.appendChild(
      txt(40, 350, "The cache trades compute for memory. Attention over n keys still costs 2nd per step either way.", { size: 11.5 }),
    );
  }

  function renderCards(): void {
    cards.textContent = "";
    const specs: Array<{ k: string; v: string; hint?: string }> = [];
    const past = n - 1;
    if (stage === 2) {
      specs.push(
        { k: "rows rebuilt", v: String((n * (n + 1)) / 2), hint: "only " + n + " rows exist" },
        { k: "projection MACs", v: fmt(cumProj(n, false)) },
        { k: "t0 rebuilt", v: n + "×" },
      );
    } else if (stage === 3) {
      specs.push(
        { k: "rows written", v: String(n) },
        { k: "rows read", v: String((n * (n - 1)) / 2) },
        { k: "projection MACs", v: fmt(cumProj(n, true)) },
      );
    } else if (stage === 4) {
      const c = stepMacs(past, true);
      const nc = stepMacs(past, false);
      specs.push(
        { k: "this step, with cache", v: fmt(c) },
        { k: "this step, no cache", v: fmt(nc) },
        { k: "ratio", v: "×" + (nc / c).toFixed(1) },
        { k: "re-projection dropped", v: fmt(nc - c) + " MACs" },
      );
    } else if (stage === 5) {
      const withC = cumMacs(n, true);
      const noC = cumMacs(n, false);
      specs.push(
        { k: "whole run, with cache", v: fmt(withC) },
        { k: "whole run, no cache", v: fmt(noC) },
        { k: "ratio", v: "×" + (noC / withC).toFixed(2) },
        { k: "attention share", v: Math.round((100 * cumAttend(n)) / noC) + "%", hint: "of the no-cache bill" },
      );
    } else if (stage === 6) {
      specs.push(
        { k: "numbers per position", v: String(NUM_PER_POS) },
        { k: "bytes per position", v: fmtBytes(NUM_PER_POS * BYTES_PER_NUM) },
        { k: "bytes at " + n + " positions", v: fmtBytes(NUM_PER_POS * BYTES_PER_NUM * n) },
      );
    }
    cards.hidden = specs.length === 0;
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
      cards.appendChild(c);
    }
  }

  const draw: Array<() => void> = [draw0, draw1, draw2, draw3, draw4, draw5, draw6];

  function render(): void {
    if (dead) return;
    railBtns.forEach((b, i) => {
      b.classList.toggle("on", i === stage);
      b.classList.toggle("done", i < stage);
    });
    prevBtn.disabled = stage === 0;
    nextBtn.disabled = stage === STAGES.length - 1;
    playBtn.textContent = running ? "❚❚ Pause" : stage === STAGES.length - 1 ? "↺ From the top" : "▶ Play";
    posOut.textContent = String(n);
    headBtns.forEach((b, i) => {
      b.classList.toggle("on", Math.floor(i / HEADS) === layer && i % HEADS === head);
    });

    art.textContent = "";
    const defs = s("defs");
    defs.append(marker("arw-a", C.accent), marker("arw-t", C.teal), marker("arw-d", C.dim));
    art.appendChild(defs);
    draw[stage]();
    caption.textContent = STAGES[stage].caption;
    renderCards();
  }

  /* ------------------------------ playback ------------------------------ */

  function stop(): void {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    running = false;
    render();
  }

  function go(i: number): void {
    stage = Math.max(0, Math.min(STAGES.length - 1, i));
    render();
  }

  function play(): void {
    if (running) {
      stop();
      return;
    }
    if (stage >= STAGES.length - 1) stage = 0;
    running = true;
    render();
    timer = window.setInterval(() => {
      if (stage >= STAGES.length - 1) {
        stop();
        return;
      }
      stage += 1;
      render();
    }, 3600);
  }

  prevBtn.addEventListener("click", () => {
    stop();
    go(stage - 1);
  });
  nextBtn.addEventListener("click", () => {
    stop();
    go(stage + 1);
  });
  playBtn.addEventListener("click", play);
  resetBtn.addEventListener("click", () => {
    stop();
    n = 8;
    layer = 0;
    head = 0;
    posRange.value = "8";
    go(0);
  });
  posRange.addEventListener("input", () => {
    n = Number(posRange.value);
    render();
  });

  render();

  return {
    reset() {
      stage = 0;
      render();
    },
    destroy() {
      dead = true;
      if (timer !== null) window.clearInterval(timer);
      root.remove();
    },
  };
};

export default kvCache;
