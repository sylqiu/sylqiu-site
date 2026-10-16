/**
 * Illustration: How KV cache works in an autoregressive LLM.
 *
 * A stacked explainer: five sections, each its own figure, read top to bottom.
 *  1  inside one transformer layer — per-token blocks vs the one cross-token step,
 *     with the causal mask drawn explicitly
 *  2  the autoregressive loop — a token becomes a distribution over the next token
 *  3  prefill, walked position by position
 *  4  decode, the same walk with K and V read from the cache
 *  5  how it is implemented (prose)
 *
 * One toy model throughout: 2 layers x 2 heads per layer, head dimension d = 8, so
 * one (layer, head) slice is eight numbers wide. Formulas are plain SVG text with
 * real sub/superscripts, and every symbol is defined in the glossary above.
 */
import type { SceneFactory } from "../lib/registry.ts";

const NS = "http://www.w3.org/2000/svg";
const T = String.raw;

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
const TEXT = ["<s>", "a", "small", "model", "writes", "text", "one", "token", "at", "a", "time", "and"];

type Vec = number[];

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

/** a_{t,p}: how much position t reads position p. Causal, so p < t only. */
function attention(l: number, h: number, t: number): Vec {
  if (t <= 0) return [];
  const query = queryVec(l, h, t);
  const logits: Vec = [];
  for (let p = 0; p < t; p++) logits.push(SHARP * dot(query, keyVec(l, h, p)));
  return softmax(logits);
}

/** Toy next-token distribution over the sentence vocabulary. */
function distribution(nn: number): Vec {
  const next = nn < TEXT.length ? TEXT[nn] : "";
  const logits = TEXT.map((w, i) => 1.4 * gauss(nn + 1, i, 71) + (w === next ? 6 : 0));
  return softmax(logits);
}

const NUM_PER_POS = 2 * LAYERS * HEADS * D;
const BYTES_PER_NUM = 2;

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

/* Math is plain SVG text with real tspans. No foreignObject, no web fonts, no
 * second layout engine: it cannot reflow, clip or lose its baseline. */
type MathToken = { text: string; kind: "base" | "sub" | "sup" };

function parseMath(input: string): MathToken[] {
  const out: MathToken[] = [];
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if ((c === "_" || c === "^") && i + 1 < input.length) {
      const kind: MathToken["kind"] = c === "_" ? "sub" : "sup";
      i += 1;
      if (input[i] === "{") {
        const end = input.indexOf("}", i);
        const body = input.slice(i + 1, end < 0 ? input.length : end);
        out.push({ text: body, kind });
        i = end < 0 ? input.length : end + 1;
      } else {
        out.push({ text: input[i], kind });
        i += 1;
      }
    } else {
      let j = i;
      while (j < input.length && input[j] !== "_" && input[j] !== "^") j += 1;
      out.push({ text: input.slice(i, j), kind: "base" });
      i = j;
    }
  }
  return out;
}

const MATH_FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";

function mathWidth(tokens: MathToken[], size: number): number {
  let w = 0;
  for (const t of tokens) w += t.text.length * (t.kind === "base" ? size * 0.6 : size * 0.42);
  return w;
}

/**
 * A formula as SVG text, in user units, so it scales with the drawing.
 * x/y is the text baseline; sub/superscripts are real tspans.
 */
function tex(
  art: SVGSVGElement,
  x: number,
  y: number,
  math: string,
  o: { size?: number; align?: "left" | "center"; color?: string; width?: number } = {},
): void {
  const size = o.size ?? 12;
  const tokens = parseMath(math);
  const start = o.align === "center" ? x - mathWidth(tokens, size) / 2 : x;
  const node = s("text", {
    x: start,
    y,
    "font-size": size,
    fill: o.color ?? C.fg,
    "font-family": MATH_FONT,
  });
  let cursor = start;
  let shift = 0;
  for (const token of tokens) {
    const target = token.kind === "base" ? 0 : token.kind === "sub" ? size * 0.3 : -size * 0.42;
    const span = s("tspan", { x: cursor, dy: target - shift, "font-size": token.kind === "base" ? size : size * 0.72 });
    span.textContent = token.text;
    node.appendChild(span);
    shift = target;
    cursor += token.text.length * (token.kind === "base" ? size * 0.6 : size * 0.42);
  }
  art.appendChild(node);
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

const VB_W = 720;

/* ------------------------------- the model -------------------------------- */

const STEP_CHIPS = 56;

const MASK = { x: 380, y: 306, cell: 11, step: 13 };

interface Sec {
  id: string;
  title: string;
  blurb: string;
  h: number;
  prose?: string[];
}

const SECS: Sec[] = [
  {
    id: "layer",
    title: "Inside one transformer layer",
    blurb:
      "The step from the input vector h_t of one position to the layer above it, block by block. Stage it: the norm, the three projections and the MLP all work on this position alone; attention is the single place where a token touches its past. The mask on the right says which positions a query is allowed to read.",
    h: 530,
  },
  {
    id: "loop",
    title: "Every token becomes a distribution over the next token",
    blurb:
      "The model reads the sequence and outputs, at the last position, a probability for every token in its vocabulary. One is sampled, appended, and the whole thing runs again. Sample a few and watch the loop.",
    h: 380,
  },
  {
    id: "prefill",
    title: "Prefill: the prompt, position by position",
    blurb:
      "The prompt is processed in one parallel pass, but walk it one position at a time and you can see what each position does: project its own q, k and v, read the positions to its left, and leave one k row and one v row behind. Play or step it.",
    h: 440,
  },
  {
    id: "decode",
    title: "Decode: one new token, the rest read from the cache",
    blurb:
      "Same walk, one position at a time — except that the earlier rows are now read from the cache instead of being rebuilt. Only the new position is projected, and attention reads every row written before it. Play or step it.",
    h: 440,
  },
  {
    id: "impl",
    title: "How it is implemented",
    blurb: "The parts an engine actually has to get right, once the arithmetic is clear.",
    h: 300,
    prose: [
      "<strong>Allocation.</strong> Every layer keeps two tensors, K and V, of shape <code>[heads, capacity, d]</code> — capacity being the longest context the server will allow. Only the capacity is booked up front; rows are filled as tokens arrive, so a sequence that stops early costs only the blocks it used.",
      "<strong>Writing.</strong> A per-sequence write pointer marks position n. Prefill writes the whole prompt in one kernel, one row per position. Each decode step writes exactly one row at n and advances the pointer.",
      "<strong>Reading.</strong> Attention for the new token reads the rows 0…n: one dot product with each cached key, then the weighted sum of the cached values. The projections of the past never run again — that is the whole saving.",
      "<strong>Sharing a pool.</strong> With many sequences in flight the cache is cut into fixed blocks (16 positions, say) and a block table maps logical positions to physical blocks. A sequence occupies only what it needs, finished sequences hand their blocks back at once, and a shared prompt prefix can reuse the same blocks copy-on-write — the PagedAttention idea.",
      "<strong>Shrinking it.</strong> Grouped-query attention gives several query heads one shared K/V head (H_kv < H); multi-query attention goes to H_kv = 1. Each cuts the cache by the sharing factor. Storing K and V in fp8 or int4 cuts it again, at the price of noisier attention scores.",
      "<strong>Why decode is bandwidth-bound.</strong> Per token the GPU reads the weights once and the entire cache (2 · L · H_kv · d · n values), but does arithmetic for one token only. Bigger batches amortize the weight reads; longer contexts do not amortize the cache read — so context length and batch size compete for the same memory.",
      "<strong>Keeping it bounded.</strong> Sliding-window attention, attention sinks and cache eviction drop rows to cap memory; chunked prefill interleaves prompt chunks with decode steps so one long prompt does not stall the rest of the batch.",
      "<strong>Where you meet it.</strong> vLLM, TensorRT-LLM, TGI and SGLang all keep a paged or fused KV cache; llama.cpp keeps one contiguous cache per sequence. The interface is the same everywhere: append one row per step, read everything before it.",
    ],
  },
];

/* --------------------------------- scene ---------------------------------- */

const kvCache: SceneFactory = (host) => {
  let n = 8;
  let layer = 0;
  let head = 0;
  let flash = false;
  let layerStep = 0;
  let preCursor = 7;
  let decCursor = 7;
  let preTimer: number | null = null;
  let decTimer: number | null = null;
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
  posWrap.append(document.createTextNode("positions shown "), posRange, posOut);

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

  /* -------------------------------- symbols ------------------------------ */
  const glossary = document.createElement("div");
  glossary.className = "ill-glossary";
  const symbols: Array<[string, string]> = [
    ["x<sub>1</sub> … x<sub>n</sub>", "the input tokens"],
    ["h<sub>t</sub>", "hidden state: the vector for position t entering a block"],
    ["W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub>", "learned projection matrices"],
    ["q<sub>t</sub> = W<sub>Q</sub>h<sub>t</sub>", "query: what position t asks"],
    ["k<sub>t</sub> = W<sub>K</sub>h<sub>t</sub>", "key: what position t offers to be matched"],
    ["v<sub>t</sub> = W<sub>V</sub>h<sub>t</sub>", "value: what position t contributes once matched"],
    ["d", "head dimension — how many numbers q, k, v have (8 here)"],
    ["a<sub>t,p</sub>", "attention weight: how much position t reads position p"],
    ["n", "how many positions have been processed"],
    ["L, H", "layers, and attention heads per layer"],
    ["p(x<sub>t+1</sub> | x<sub>≤t</sub>)", "the model output: probability of the next token"],
  ];
  glossary.innerHTML =
    '<div class="ill-legend-head">symbols used on this page</div>' +
    symbols
      .map(([sym, def]) => {
        return '<span class="ill-gloss-item"><span class="sym">' + sym + '</span><span class="def">' + def + "</span></span>";
      })
      .join("");

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

  const secEls: Array<{ svg: SVGSVGElement; cards: HTMLElement; ctl: HTMLElement; prose: HTMLElement | null }> = [];
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
    let proseEl: HTMLElement | null = null;
    section.append(head, blurb, fig, cards);
    if (sec.prose) {
      proseEl = document.createElement("div");
      proseEl.className = "ill-prose";
      proseEl.innerHTML = sec.prose.map((p) => "<p>" + p + "</p>").join("");
      section.appendChild(proseEl);
    }
    root.appendChild(section);
    secEls.push({ svg, cards, ctl: secCtl, prose: proseEl });
  });

  root.append(ctl, glossary, toc);
  host.appendChild(root);

  /* ------------------------------ section 1 ----------------------------- */

  const LAYER_STEPS = [
    { label: "input h_t", note: "The hidden vector for this position, handed up by the layer below. One vector per position." },
    { label: "RMSNorm", note: "Per token: it normalizes that one vector. No other position is involved." },
    { label: "q, k, v projections", note: "Per token: three matrix-vector products on h_t alone. This is why a stored k or v never needs rebuilding." },
    { label: "attention", note: "The one cross-token step: the query of this position meets every key it is allowed to read, and the weights mix their values." },
    { label: "+ residual", note: "Per token: the attention output is added back onto h_t." },
    { label: "RMSNorm + MLP", note: "Per token: a position-wise feed-forward block, the same arithmetic at every position." },
    { label: "output h_t", note: "Sent up to the next layer. Nothing on this path needed a token to the right — which is what makes the cache legal." },
  ];

  function drawLayer(art: SVGSVGElement): void {
    const x = 20;
    const w = 280;
    const blocks = [
      { y: 40, h: 34, label: "", sub: "" },
      { y: 90, h: 30, label: "RMSNorm", sub: "per token" },
      { y: 136, h: 52, label: "", sub: "" },
      { y: 204, h: 76, label: "", sub: "the only cross-token step" },
      { y: 296, h: 30, label: "+ residual", sub: "per token" },
      { y: 342, h: 36, label: "RMSNorm + MLP", sub: "per token" },
      { y: 394, h: 34, label: "out · layer above", sub: "per token" },
    ];
    art.appendChild(
      txt(x, 26, "stage " + (layerStep + 1) + " / " + LAYER_STEPS.length + " · " + LAYER_STEPS[layerStep].label + " · slice " + layer + "." + head, { size: 11.5, fill: C.fg, weight: 600 }),
    );
    art.appendChild(txt(VB_W - 20, 26, "one (layer, head) slice", { anchor: "end", size: 10 }));

    blocks.forEach((blk, i) => {
      if (i === 0 || i === 2 || i === 3) return;
      const on = i === layerStep;
      art.appendChild(s("rect", { x, y: blk.y, width: w, height: blk.h, rx: 8, fill: C.panel, stroke: on ? C.fg : C.line, "stroke-width": on ? 1.8 : 1 }));
      art.appendChild(txt(x + 12, blk.y + 19, blk.label, { size: 11.5, fill: C.fg }));
      art.appendChild(txt(x + 12, blk.y + blk.h - 5, blk.sub, { size: 9.5 }));
    });

    const b0 = blocks[0];
    const on0 = layerStep === 0;
    art.appendChild(s("rect", { x, y: b0.y, width: w, height: b0.h, rx: 8, fill: C.panel, stroke: on0 ? C.fg : C.line, "stroke-width": on0 ? 1.8 : 1 }));
    tex(art, x + 12, b0.y + 22, T`h_t`, { size: 13 });
    art.appendChild(txt(x + 46, b0.y + 22, "this layer in · one vector per position", { size: 10 }));

    const p2 = blocks[2];
    const on2 = layerStep === 2;
    art.appendChild(s("rect", { x, y: p2.y, width: w, height: p2.h, rx: 8, fill: C.panel, stroke: on2 ? C.fg : C.line, "stroke-width": on2 ? 1.8 : 1 }));
    tex(art, x + 12, p2.y + 20, T`q_t = W_Q h_t`, { size: 11.5, color: C.accent });
    tex(art, x + 12, p2.y + 38, T`k_t = W_K h_t`, { size: 11.5, color: C.purple });
    tex(art, x + 150, p2.y + 20, T`v_t = W_V h_t`, { size: 11.5, color: C.teal });
    art.appendChild(txt(x + w - 10, p2.y + 44, "per token", { anchor: "end", size: 9.5 }));

    const p3 = blocks[3];
    const on3 = layerStep === 3;
    art.appendChild(s("rect", { x, y: p3.y, width: w, height: p3.h, rx: 8, fill: C.accent, "fill-opacity": on3 ? 0.18 : 0.1, stroke: on3 ? C.fg : C.accent, "stroke-width": on3 ? 1.8 : 1 }));
    tex(art, x + 12, p3.y + 22, T`a_{t,p} = softmax(q_t · k_p / √d)`, { size: 11 });
    tex(art, x + 12, p3.y + 52, T`Σ_{p} a_{t,p} v_p`, { size: 11.5 });
    art.appendChild(txt(x + 150, p3.y + 56, "· the context it gets back", { size: 10, fill: C.accent }));

    arrow(art, x + w / 2, 74, x + w / 2, 84, C.dim, "arw-d");
    arrow(art, x + w / 2, 120, x + w / 2, 130, C.dim, "arw-d");
    arrow(art, x + w / 2, 188, x + w / 2, 198, C.dim, "arw-d");
    arrow(art, x + w / 2, 280, x + w / 2, 290, C.dim, "arw-d");
    arrow(art, x + w / 2, 326, x + w / 2, 336, C.dim, "arw-d");
    arrow(art, x + w / 2, 378, x + w / 2, 388, C.dim, "arw-d");

    const perToken = layerStep !== 3;
    const coupling = layerStep === 3;
    art.appendChild(s("rect", { x: 336, y: 40, width: 352, height: 132, rx: 9, fill: C.panel, "fill-opacity": perToken ? 1 : 0.5, stroke: perToken ? C.ok : C.line, "stroke-width": perToken ? 1.4 : 1 }));
    art.appendChild(s("circle", { cx: 352, cy: 58, r: 4, fill: C.ok }));
    art.appendChild(txt(364, 62, "independent · per token", { size: 10.5, fill: C.ok, weight: 600 }));
    art.appendChild(txt(352, 84, "RMSNorm · MLP · output projection", { size: 11 }));
    tex(art, 352, 108, T`q_t = W_Q h_t`, { size: 11.5, width: 300 });
    tex(art, 352, 126, T`k_t = W_K h_t`, { size: 11.5, width: 300 });
    tex(art, 352, 144, T`v_t = W_V h_t`, { size: 11.5, width: 300 });
    art.appendChild(txt(352, 164, "no term from any other position", { size: 10.5 }));

    art.appendChild(s("rect", { x: 336, y: 182, width: 352, height: 92, rx: 9, fill: C.panel, "fill-opacity": coupling ? 1 : 0.5, stroke: coupling ? C.warn : C.line, "stroke-width": coupling ? 1.4 : 1 }));
    art.appendChild(s("circle", { cx: 352, cy: 200, r: 4, fill: C.warn }));
    art.appendChild(txt(364, 204, "couples positions", { size: 10.5, fill: C.warn, weight: 600 }));
    tex(art, 352, 226, T`a_{t,p} = softmax(q_t · k_p / √d)`, { size: 11 });
    art.appendChild(txt(352, 250, "over every position p this query may read", { size: 10.5 }));
    arrow(art, 336, 240, 304, 240, C.warn, "arw-w", 1.2);

    art.appendChild(txt(336, 296, "causal mask · row t reads columns p ≤ t", { size: 10.5, fill: C.fg, weight: 600 }));
    for (let p = 0; p < n; p++) {
      art.appendChild(txt(MASK.x + p * MASK.step + MASK.cell / 2, MASK.y - 5, String(p), { anchor: "middle", size: 8, mono: true }));
    }
    for (let r = 0; r < n; r++) {
      art.appendChild(txt(MASK.x - 5, MASK.y + r * MASK.step + MASK.cell - 1, String(r), { anchor: "end", size: 8, mono: true }));
      for (let p = 0; p < n; p++) {
        const allowed = p <= r;
        const newest = r === n - 1;
        art.appendChild(
          s("rect", {
            x: MASK.x + p * MASK.step,
            y: MASK.y + r * MASK.step,
            width: MASK.cell,
            height: MASK.cell,
            rx: 2,
            fill: allowed ? (newest ? C.accent : C.teal) : C.panel2,
            opacity: allowed ? (newest ? 0.9 : 0.28) : 0.35,
          }),
        );
      }
    }
    art.appendChild(txt(336, MASK.y + n * MASK.step + 18, "grey = the future: no query may read it.", { size: 10.5 }));
    art.appendChild(txt(336, MASK.y + n * MASK.step + 34, "The bottom row is the query being computed now.", { size: 10.5 }));
    art.appendChild(txt(x, 508, LAYER_STEPS[layerStep].note, { size: 11.5, fill: C.fg }));
  }

  /* ------------------------------ section 2 ----------------------------- */

  function drawLoop(art: SVGSVGElement): void {
    const w = 50;
    const pitch = STEP_CHIPS;
    const x0 = 20;
    const y = 34;
    const h = 30;
    for (let i = 0; i < MAX_N; i++) {
      const bx = x0 + i * pitch;
      const has = i < n;
      if (has) {
        art.appendChild(s("rect", { x: bx, y, width: w, height: h, rx: 7, fill: i === n - 1 ? C.accent : C.panel, "fill-opacity": i === n - 1 ? 0.18 : 1, stroke: i === n - 1 ? C.accent : C.line }));
        art.appendChild(txt(bx + w / 2, y + 20, TEXT[i], { anchor: "middle", size: 9.5, mono: true, fill: i === n - 1 ? C.fg : C.dim }));
      } else if (i === n) {
        art.appendChild(s("rect", { x: bx, y, width: w, height: h, rx: 7, fill: "none", stroke: C.accent, "stroke-width": 1.2, "stroke-dasharray": "4 3" }));
        art.appendChild(txt(bx + w / 2, y + 20, "?", { anchor: "middle", size: 13, fill: C.accent, weight: 600 }));
      }
    }
    art.appendChild(txt(x0, y - 10, "input so far · the model predicts position " + n, { size: 10 }));

    const cx = 360;
    const btop = 88;
    art.appendChild(s("rect", { x: 240, y: btop, width: 240, height: 44, rx: 9, fill: C.panel, stroke: C.line }));
    art.appendChild(txt(360, btop + 19, "transformer · " + LAYERS + " layers here", { anchor: "middle", size: 11, fill: C.fg }));
    art.appendChild(txt(360, btop + 34, "attention + MLP at every position", { anchor: "middle", size: 9.5 }));
    arrow(art, cx, y + h + 6, cx, btop - 6, C.dim, "arw-d");
    arrow(art, cx, btop + h + 6, cx, 168, C.dim, "arw-d");

    const probs = distribution(n);
    const base = 322;
    const maxH = 118;
    const bw = 40;
    const bpitch = 56;
    const bx0 = 20;
    tex(art, bx0, 190, T`p(x_{n+1} | x_{≤n})`, { size: 12 });
    art.appendChild(txt(170, 190, "· one probability per vocabulary entry", { size: 10.5 }));
    let argmax = 0;
    probs.forEach((p, i) => {
      if (p > probs[argmax]) argmax = i;
    });
    probs.forEach((p, i) => {
      const bx = bx0 + i * bpitch;
      const hh = Math.max(2, p * maxH);
      const top = base - hh;
      const on = i === argmax;
      art.appendChild(s("rect", { x: bx, y: 200, width: bw, height: maxH, rx: 3, fill: C.panel2, opacity: 0.45 }));
      art.appendChild(s("rect", { x: bx, y: top, width: bw, height: hh, rx: 3, fill: on ? C.accent : C.teal, opacity: on ? (flash ? 1 : 0.9) : 0.45 }));
      const label = s("text", {
        x: bx + bw / 2,
        y: base + 12,
        fill: on ? C.fg : C.dim,
        "font-size": 9.5,
        "text-anchor": "end",
        transform: "rotate(-52 " + (bx + bw / 2) + " " + (base + 12) + ")",
        "font-family": "ui-monospace, SFMono-Regular, Menlo, monospace",
      });
      label.textContent = TEXT[i];
      art.appendChild(label);
      art.appendChild(txt(bx + bw / 2, top - 5, p.toFixed(2), { anchor: "middle", size: 9, mono: true, fill: on ? C.accent : C.dim }));
      if (on) art.appendChild(txt(bx + bw / 2, top + 15, "sampled", { anchor: "middle", size: 9.5, fill: "#0b1220", weight: 700 }));
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
  /* --------------------------- sections 3 and 4 -------------------------- */

  const flowCursor = (mode: "pre" | "dec"): number => Math.min(mode === "pre" ? preCursor : decCursor, n - 1);

  function drawFlow(art: SVGSVGElement, mode: "pre" | "dec"): void {
    const c = flowCursor(mode);
    const pre = mode === "pre";
    const w = 50;
    const pitch = STEP_CHIPS;
    const x0 = 20;
    const y = 34;
    const h = 30;

    for (let i = 0; i < n; i++) {
      const bx = x0 + i * pitch;
      const done = i < c;
      const now = i === c;
      art.appendChild(
        s("rect", {
          x: bx,
          y,
          width: w,
          height: h,
          rx: 7,
          fill: now ? C.accent : C.panel,
          "fill-opacity": now ? 0.2 : 1,
          stroke: now ? C.accent : C.line,
          "stroke-width": now ? 1.6 : 1,
          opacity: done ? 0.75 : 1,
        }),
      );
      art.appendChild(txt(bx + w / 2, y + 20, TEXT[i], { anchor: "middle", size: 9.5, mono: true, fill: now ? C.fg : C.dim }));
    }
    art.appendChild(txt(x0, y - 10, "position being processed · t = " + c + (pre ? " (prompt, left to right)" : " (the new token)"), { size: 10 }));

    const bx0 = 20;
    const bw0 = 320;
    const rows: Array<{ y: number; h: number; label: string }> = [
      { y: 92, h: 40, label: "" },
      { y: 148, h: 48, label: "" },
      { y: 212, h: 60, label: "" },
    ];
    rows.forEach((r) => {
      art.appendChild(s("rect", { x: bx0, y: r.y, width: bw0, height: r.h, rx: 8, fill: C.panel, stroke: C.line }));
    });
    art.appendChild(txt(bx0 + 12, 110, "the token at position " + c + " · " + TEXT[c], { size: 11, mono: true, fill: C.fg }));
    tex(art, bx0 + 12, 128, T`h_t`, { size: 11.5, width: 120 });
    art.appendChild(txt(bx0 + 52, 128, "· its hidden vector, one per position", { size: 10 }));

    tex(art, bx0 + 12, 168, T`q_t = W_Q h_t`, { size: 11.5, width: 150, color: C.accent });
    tex(art, bx0 + 160, 168, T`k_t = W_K h_t`, { size: 11.5, width: 150, color: C.purple });
    tex(art, bx0 + 12, 188, T`v_t = W_V h_t`, { size: 11.5, width: 150, color: C.teal });
    art.appendChild(
      txt(bx0 + 160, 188, pre ? "computed for this position" : "the only new arithmetic", { size: 10, fill: C.ok }),
    );

    tex(art, bx0 + 12, 236, T`a_{t,p} = softmax(q_t · k_p / √d)`, { size: 11 });
    art.appendChild(
      txt(bx0 + 12, 262, pre ? "over p ≤ t — the positions to its left" : "over p ≤ t — every row already in the cache", { size: 10.5 }),
    );

    const sx = 380;
    art.appendChild(txt(sx, 86, "the cache · one k row and one v row per position", { size: 10.5, fill: C.teal, weight: 600 }));
    art.appendChild(txt(sx + 24, 104, "k", { anchor: "middle", size: 9, fill: C.purple }));
    art.appendChild(txt(sx + 124, 104, "v", { anchor: "middle", size: 9, fill: C.teal }));
    for (let r = 0; r < n; r++) {
      const ry = 112 + r * 17;
      const read = !pre && r < c;
      const written = r < c || r === c;
      const fresh = r === c;
      art.appendChild(
        s("rect", {
          x: sx,
          y: ry,
          width: 300,
          height: 15,
          rx: 3,
          fill: C.panel,
          stroke: fresh ? C.ok : read ? C.teal : C.line,
          "stroke-width": fresh || read ? 1.3 : 1,
          "stroke-dasharray": written ? "" : "3 3",
          opacity: written ? 1 : 0.45,
        }),
      );
      const k = keyVec(layer, head, r);
      const v = valVec(layer, head, r);
      for (let j = 0; j < D; j++) {
        art.appendChild(s("rect", { x: sx + 18 + j * 6, y: ry + 3, width: 5, height: 9, rx: 1, fill: written ? cellFill(k[j], C.purple) : C.panel2, opacity: written ? 1 : 0.5 }));
        art.appendChild(s("rect", { x: sx + 118 + j * 6, y: ry + 3, width: 5, height: 9, rx: 1, fill: written ? cellFill(v[j], C.teal) : C.panel2, opacity: written ? 1 : 0.5 }));
      }
      art.appendChild(txt(sx + 292, ry + 11, String(r), { anchor: "end", size: 8.5, mono: true, opacity: 0.8 }));
    }
    const cacheNote = pre
      ? "written so far: " + (c + 1) + " rows"
      : "read: " + c + " rows · written this step: 1 row";
    art.appendChild(txt(sx, 112 + n * 17 + 14, cacheNote, { size: 10.5, fill: pre ? C.ok : C.teal }));

    art.appendChild(txt(x0, 308, "positions this query may read · grey is blocked by the causal mask", { size: 10.5, fill: C.fg }));
    for (let p = 0; p < n; p++) {
      const px = x0 + p * 16;
      const allowed = p <= c;
      art.appendChild(
        s("rect", {
          x: px,
          y: 318,
          width: 14,
          height: 14,
          rx: 2,
          fill: p === c ? C.ok : allowed ? C.accent : C.panel2,
          opacity: allowed ? 0.8 : 0.35,
        }),
      );
    }

    const note1 = pre
      ? "In hardware the prompt is processed in one parallel pass; walking it one position at a time shows what each contributes."
      : "Only the new position is projected. Every earlier row is read from the cache — none of it is recomputed.";
    const note2 = pre
      ? "Each position projects its own k and v, reads the positions to its left, and leaves exactly one row behind."
      : "That read is the part that grows: one dot product per cached key, per layer, per head, at every step.";
    art.appendChild(txt(x0, 366, note1, { size: 11.5, fill: C.fg }));
    art.appendChild(txt(x0, 390, note2, { size: 11.5 }));
    art.appendChild(
      txt(x0, 416, pre ? "This is the phase that fills the cache." : "This is the phase that pays for it, one row at a time.", { size: 11.5, fill: C.ok }),
    );
  }

  /* ------------------------------ section 5 ----------------------------- */

  function drawImpl(art: SVGSVGElement): void {
    const sx = 90;
    const cellW = 24;
    const pitchX = 26;
    for (let l = 0; l < LAYERS; l++) {
      for (let kind = 0; kind < 2; kind++) {
        const y = 50 + (l * 2 + kind) * 22;
        const isK = kind === 0;
        art.appendChild(
          txt(sx - 8, y + 12, "layer " + l + " · " + (isK ? "K" : "V"), { anchor: "end", size: 10, mono: true, fill: isK ? C.purple : C.teal }),
        );
        art.appendChild(s("rect", { x: sx - 4, y: y - 2, width: n * pitchX + 4, height: 19, rx: 3, fill: C.panel, stroke: C.line }));
        for (let p = 0; p < n; p++) {
          const vec = isK ? keyVec(layer, head, p) : valVec(layer, head, p);
          let fill = "";
          for (let j = 0; j < 3; j++) fill += cellFill(vec[j], isK ? C.purple : C.teal).slice(7, 9);
          art.appendChild(s("rect", { x: sx + p * pitchX, y, width: cellW, height: 15, rx: 2, fill: (isK ? "#a371f7" : "#39c5cf") + fill.slice(0, 2), opacity: 0.75 }));
        }
      }
    }
    art.appendChild(txt(sx, 28, "one sequence · two tensors per layer, per KV head", { size: 10.5, fill: C.fg }));
    arrow(art, sx + (n - 1) * pitchX + cellW / 2, 32, sx + (n - 1) * pitchX + cellW / 2, 46, C.ok, "arw-g");
    art.appendChild(txt(sx + (n - 1) * pitchX + cellW / 2 + 8, 40, "write pointer", { size: 10, fill: C.ok }));
    art.appendChild(s("line", { x1: sx - 2, y1: 140, x2: sx + n * pitchX - 2, y2: 140, stroke: C.teal }));
    art.appendChild(txt(sx - 2, 154, "read window: rows 0 … n−1, contiguous", { size: 10, fill: C.teal }));

    const px = 440;
    art.appendChild(txt(px, 28, "many sequences · one pool of blocks", { size: 10.5, fill: C.fg }));
    const palette = [C.accent, C.accent, C.teal, C.teal, C.accent, C.line];
    for (let i = 0; i < 6; i++) {
      const col = palette[i];
      art.appendChild(s("rect", { x: px + i * 44, y: 52, width: 40, height: 40, rx: 6, fill: col, "fill-opacity": i === 5 ? 0.15 : 0.25, stroke: col }));
      art.appendChild(txt(px + i * 44 + 20, 77, String(i), { anchor: "middle", size: 11, mono: true, fill: C.fg }));
    }
    art.appendChild(txt(px, 110, "seq A → blocks 0, 1, 4   ·   seq B → blocks 2, 3   ·   free: 5", { size: 10.5 }));
    art.appendChild(txt(px, 132, "each block holds 16 positions (say);", { size: 10.5 }));
    art.appendChild(txt(px, 150, "a block table maps logical to physical ones.", { size: 10.5 }));
    art.appendChild(txt(px, 176, "a finished sequence returns its blocks at once,", { size: 10.5 }));
    art.appendChild(txt(px, 194, "and a shared prompt prefix is reused copy-on-write.", { size: 10.5 }));

    art.appendChild(txt(20, 232, "The cache is a 4-D tensor: [layer][KV head][position][d]. Only the position axis grows with context.", { size: 11.5, fill: C.fg }));
    art.appendChild(txt(20, 256, "Prefill fills a prompt in one kernel; decode appends one row per step and reads everything before it.", { size: 11.5 }));
    art.appendChild(txt(20, 280, "Its size is the budget: it competes with the weights, and caps how long a context or how large a batch you serve.", { size: 11.5 }));
  }

  const draws = [
    drawLayer,
    drawLoop,
    (art: SVGSVGElement) => drawFlow(art, "pre"),
    (art: SVGSVGElement) => drawFlow(art, "dec"),
    drawImpl,
  ];

  /* -------------------------------- cards -------------------------------- */

  function cardsFor(i: number): Array<{ k: string; v: string; hint?: string }> {
    const sec = SECS[i].id;
    const c = flowCursor(sec === "decode" ? "dec" : "pre");
    if (sec === "layer") {
      const step = LAYER_STEPS[layerStep];
      return [
        { k: "stage", v: layerStep + 1 + " / " + LAYER_STEPS.length },
        { k: "block", v: step.label },
        { k: "cross-token", v: layerStep === 3 ? "yes" : "no", hint: layerStep === 3 ? "reads the positions it may read" : "this position alone" },
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
        { k: "positions so far", v: String(n) },
      ];
    }
    if (sec === "prefill") {
      return [
        { k: "at position", v: "t = " + c },
        { k: "rows in the cache", v: c + 1 + " of " + n },
        { k: "reads", v: "p ≤ " + c },
      ];
    }
    if (sec === "decode") {
      return [
        { k: "at position", v: "t = " + c },
        { k: "rows read from cache", v: String(c) },
        { k: "rows written this step", v: "1" },
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
  const prePlay = mkBtn("▶ Play", true);
  const preStep = mkBtn("Step ▸");
  const preReset = mkBtn("Reset");
  const decPlay = mkBtn("▶ Play", true);
  const decStep = mkBtn("Step ▸");
  const decReset = mkBtn("Reset");

  function appendToken(): void {
    if (dead) return;
    n = n >= MAX_N ? MIN_N : n + 1;
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

  function stopFlow(which: "pre" | "dec"): void {
    if (which === "pre" && preTimer !== null) {
      window.clearInterval(preTimer);
      preTimer = null;
    }
    if (which === "dec" && decTimer !== null) {
      window.clearInterval(decTimer);
      decTimer = null;
    }
    render();
  }

  function startFlow(which: "pre" | "dec"): void {
    stopFlow(which);
    if (which === "pre") preCursor = 0;
    else decCursor = 0;
    render();
    const tick = (): void => {
      const cur = which === "pre" ? preCursor : decCursor;
      if (cur >= n - 1) {
        stopFlow(which);
        return;
      }
      if (which === "pre") preCursor = cur + 1;
      else decCursor = cur + 1;
      render();
    };
    if (which === "pre") preTimer = window.setInterval(tick, 900);
    else decTimer = window.setInterval(tick, 900);
  }

  sampleBtn.addEventListener("click", animateAppend);
  loopReset.addEventListener("click", () => {
    n = MIN_N;
    posRange.value = String(n);
    flash = false;
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
  prePlay.addEventListener("click", () => {
    if (preTimer !== null) stopFlow("pre");
    else startFlow("pre");
  });
  decPlay.addEventListener("click", () => {
    if (decTimer !== null) stopFlow("dec");
    else startFlow("dec");
  });
  preStep.addEventListener("click", () => {
    if (preTimer !== null) stopFlow("pre");
    preCursor = Math.min(n - 1, flowCursor("pre") + 1);
    render();
  });
  decStep.addEventListener("click", () => {
    if (decTimer !== null) stopFlow("dec");
    decCursor = Math.min(n - 1, flowCursor("dec") + 1);
    render();
  });
  preReset.addEventListener("click", () => {
    if (preTimer !== null) stopFlow("pre");
    preCursor = n - 1;
    render();
  });
  decReset.addEventListener("click", () => {
    if (decTimer !== null) stopFlow("dec");
    decCursor = n - 1;
    render();
  });
  posRange.addEventListener("input", () => {
    n = Number(posRange.value);
    render();
  });

  secEls[0].ctl.append(layerNext, layerBack);
  secEls[1].ctl.append(sampleBtn, loopReset);
  secEls[2].ctl.append(prePlay, preStep, preReset);
  secEls[3].ctl.append(decPlay, decStep, decReset);

  /* -------------------------------- render ------------------------------- */

  function render(): void {
    if (dead) return;
    preCursor = Math.min(preCursor, n - 1);
    decCursor = Math.min(decCursor, n - 1);
    posOut.textContent = String(n);
    headBtns.forEach((b, i) => {
      b.classList.toggle("on", Math.floor(i / HEADS) === layer && i % HEADS === head);
    });
    sampleBtn.textContent = flash ? "sampling…" : n >= MAX_N ? "↺ Restart the loop" : "▶ Sample next token";
    layerNext.textContent = layerStep >= LAYER_STEPS.length - 1 ? "↺ From the input" : "▶ Stage the layer";
    layerBack.disabled = layerStep === 0;
    prePlay.textContent = preTimer !== null ? "❚❚ Pause" : "▶ Play";
    decPlay.textContent = decTimer !== null ? "❚❚ Pause" : "▶ Play";
    preStep.disabled = flowCursor("pre") >= n - 1;
    decStep.disabled = flowCursor("dec") >= n - 1;

    secEls.forEach((el, i) => {
      el.svg.textContent = "";
      const defs = s("defs");
      defs.append(
        marker("arw-a", C.accent),
        marker("arw-t", C.teal),
        marker("arw-d", C.dim),
        marker("arw-g", C.ok),
        marker("arw-w", C.warn),
      );
      el.svg.appendChild(defs);
      draws[i](el.svg);
      el.cards.textContent = "";
      const specs = cardsFor(i);
      for (const spec of specs) {
        const card = document.createElement("div");
        card.className = "ill-card";
        const key = document.createElement("div");
        key.className = "k";
        key.textContent = spec.k;
        const val = document.createElement("div");
        val.className = "v";
        val.textContent = spec.v;
        card.append(key, val);
        if (spec.hint) {
          const hint = document.createElement("div");
          hint.className = "ill-card-hint";
          hint.textContent = spec.hint;
          card.appendChild(hint);
        }
        el.cards.appendChild(card);
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
      if (preTimer !== null) window.clearInterval(preTimer);
      if (decTimer !== null) window.clearInterval(decTimer);
    },
  };
};

export default kvCache;
