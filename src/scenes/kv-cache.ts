/**
 * Illustration: How KV cache works in an autoregressive LLM.
 *
 * A stacked explainer: five sections, each its own figure, read top to bottom.
 *  1  inside one transformer layer — per-token blocks vs the one cross-token step,
 *     with the causal mask drawn explicitly
 *  2  the autoregressive loop — a token becomes a distribution over the next token
 *  3  prefill, walked position by position
 *  4  decode, the same walk with K and V read from the cache
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
    title: "The Transformer Architecture",
    blurb:
      "Let [t] denote the sequence [0, ..., T] of indices and t be an element. The input vectors h_[t] go through (1) the normalization layer and the MLP layer that projects to QKV features, (2) causal self-attention across [t], (3) normalization, MLP bottleneck and residual connection",
    h: 710,
  },
  {
    id: "next-token-prediction",
    title: "Next token prediction",
    blurb:
      "A token is an element of the vocabulary. Every token is mapped to a probability distribution of the next token.",
    h: 380,
  },
  {
    id: "prefill",
    title: "Prefill: processing the prompt sequence all at once",
    blurb:
      "This is the standard forward pass of the transformer on an input sequence with causal attention.",
    h: 440,
  },
  {
    id: "decode",
    title: "Decode: sample the next token, then repeat the forward pass with the updated token sequence",
    blurb:
      "",
    h: 440,
  },

];

/* --------------------------------- scene ---------------------------------- */

const kvCache: SceneFactory = (host) => {
  let n = 8;
  let layer = 0;
  let head = 0;
  let flash = false;
  let step = 0;
  let attnToken = Math.min(2, 7);
  let attnTimer: number | null = null;

  /* one token per step: a step produces the whole output vector of that token */
  function toggleAttn(): void {
    if (attnTimer !== null) {
      window.clearInterval(attnTimer);
      attnTimer = null;
      render();
      return;
    }
    step = 1;
    attnToken = 0;
    render();
    attnTimer = window.setInterval(() => {
      if (attnToken < n - 1) {
        attnToken += 1;
      } else {
        if (attnTimer !== null) window.clearInterval(attnTimer);
        attnTimer = null;
      }
      render();
    }, 700);
  }

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

  const STEPS = [
    { chip: "1 · normalize, project q, k, v" },
    { chip: "2 · causal self-attention" },
    { chip: "3 · normalize, MLP, residual" },
  ];

  /* one column, read top to bottom: input, the step, the output */
  const BLOCK = { inY: 60, inH: 108, opY: 196, opH: 340, outY: 566, outH: 128 };
  const MID = 360;

  function strip(art: SVGSVGElement, x: number, y: number, vec: Vec, color: string, label: string, opacity = 1): void {
    art.appendChild(txt(x, y - 6, label, { size: 9.5, fill: color, opacity }));
    for (let i = 0; i < vec.length; i++) {
      art.appendChild(s("rect", { x: x + i * 12, y, width: 11, height: 14, rx: 1, fill: cellFill(vec[i], color), opacity }));
    }
  }

  const hVec = (p: number): Vec => cachedVec("h:" + p, () => unit((i) => gauss(p, i, 44)));
  const outVec = (p: number): Vec => cachedVec("o:" + p, () => unit((i) => gauss(p, i, 88)));
  const attnVec = (l: number, h: number, p: number): Vec => cachedVec("a:" + l + ":" + h + ":" + p, () => unit((i) => gauss(l, h, p, i, 99)));

  function drawLayer(art: SVGSVGElement): void {
    const t = Math.min(attnToken, n - 1);
    const weights = attention(layer, head, t);
    const wMax = weights.length > 0 ? Math.max.apply(null, weights) : 1;
    const rel = (w: number): number => Math.min(1, w / wMax);
    const started = attnTimer !== null;

    STEPS.forEach((st, i) => {
      const x = 20 + i * 236;
      const on = i === step;
      const g = s("g", { cursor: "pointer" });
      g.addEventListener("click", () => {
        step = i;
        attnToken = Math.min(2, n - 1);
        render();
      });
      g.appendChild(
        s("rect", { x, y: 16, width: 224, height: 34, rx: 8, fill: on ? C.accent : C.panel, "fill-opacity": on ? 0.18 : 0.5, stroke: on ? C.accent : C.line, "stroke-width": on ? 1.6 : 1 }),
      );
      g.appendChild(txt(x + 12, 38, st.chip, { size: 11, fill: on ? C.fg : C.dim, weight: on ? 700 : 400 }));
      art.appendChild(g);
    });

    const blockBox = (y: number, h: number, label: string, color: string): void => {
      art.appendChild(s("rect", { x: 20, y, width: 680, height: h, rx: 10, fill: C.panel, "fill-opacity": 0.5, stroke: C.line }));
      art.appendChild(txt(32, y + 19, label, { size: 10, weight: 600, fill: color }));
    };
    blockBox(BLOCK.inY, BLOCK.inH, "input", C.dim);
    blockBox(BLOCK.opY, BLOCK.opH, "step " + (step + 1) + " of 3", C.accent);
    blockBox(BLOCK.outY, BLOCK.outH, "output", C.dim);
    art.appendChild(txt(688, BLOCK.outY + 19, layer + "." + head, { anchor: "end", size: 9.5 }));
    arrow(art, MID, BLOCK.inY + BLOCK.inH + 4, MID, BLOCK.opY - 4, C.dim, "arw-d");
    arrow(art, MID, BLOCK.opY + BLOCK.opH + 4, MID, BLOCK.outY - 4, C.dim, "arw-d");

    /* ------------------------------ step 1 ------------------------------ */
    if (step === 0) {
      strip(art, MID - 48, BLOCK.inY + 62, hVec(t), C.fg, "h_t · one vector per position");
      art.appendChild(s("rect", { x: 210, y: 230, width: 300, height: 32, rx: 7, fill: C.panel2, stroke: C.line }));
      art.appendChild(txt(224, 251, "RMSNorm", { size: 11, fill: C.fg }));
      arrow(art, MID, 266, MID, 300, C.dim, "arw-d");
      const projs = [
        { label: T`q_t = W_Q h_t`, color: C.accent },
        { label: T`k_t = W_K h_t`, color: C.purple },
        { label: T`v_t = W_V h_t`, color: C.teal },
      ];
      projs.forEach((p, i) => {
        const px = 40 + i * 220;
        art.appendChild(s("rect", { x: px, y: 310, width: 200, height: 62, rx: 8, fill: C.panel2, stroke: p.color }));
        tex(art, px + 24, 340, p.label, { size: 11, color: p.color });
        art.appendChild(txt(px + 24, 360, "per position", { size: 9.5 }));
      });
      strip(art, 152, BLOCK.outY + 62, queryVec(layer, head, t), C.accent, "q_t");
      strip(art, MID - 48, BLOCK.outY + 62, keyVec(layer, head, t), C.purple, "k_t");
      strip(art, 472, BLOCK.outY + 62, valVec(layer, head, t), C.teal, "v_t");
    }

    /* ------------------------------ step 2 ------------------------------ */
    if (step === 1) {
      strip(art, 152, BLOCK.inY + 62, queryVec(layer, head, t), C.accent, "q_t");
      strip(art, MID - 48, BLOCK.inY + 62, keyVec(layer, head, t), C.purple, "k_t");
      strip(art, 472, BLOCK.inY + 62, valVec(layer, head, t), C.teal, "v_t");

      const chipW = 30;
      const cpitch = 34;
      const rowW = n * cpitch - 4;
      const x0 = MID - rowW / 2;
      const cx = (p: number): number => x0 + p * cpitch + chipW / 2;
      const kY = 286;
      const qY = 328;

      art.appendChild(txt(32, 222, "one step: dot the keys, then mix the values", { size: 10, fill: C.teal, weight: 600 }));
      const playBtn = s("g", { cursor: "pointer", class: "ill-svg-btn" });
      playBtn.appendChild(s("rect", { x: 500, y: 206, width: 184, height: 26, rx: 13, fill: C.accent, "fill-opacity": 0.12, stroke: C.accent }));
      playBtn.appendChild(txt(592, 223, attnTimer !== null ? "❚❚ Pause" : "▶ Animate", { anchor: "middle", size: 10.5, fill: C.accent, weight: 600 }));
      playBtn.addEventListener("click", () => toggleAttn());
      art.appendChild(playBtn);
      art.appendChild(txt(688, 223, "click a token to jump", { anchor: "end", size: 9, fill: C.dim }));

      if (t < n - 1) {
        art.appendChild(s("rect", { x: cx(t + 1) - 8, y: 244, width: (n - t - 1) * cpitch + 8, height: 116, rx: 6, fill: C.panel2, "fill-opacity": 0.3, stroke: C.warn, "stroke-dasharray": "4 3" }));
        art.appendChild(txt(x0 + rowW - 6, 352, "blocked · p > t", { anchor: "end", size: 9.5, fill: C.warn }));
      }

      for (let p = 0; p < n; p++) {
        const allowed = p <= t;
        const isQuery = p === t;
        const chip = s("g", { cursor: allowed ? "pointer" : "default" });
        chip.addEventListener("click", () => {
          if (!allowed) return;
          attnToken = p;
          if (attnTimer !== null) {
            window.clearInterval(attnTimer);
            attnTimer = null;
          }
          render();
        });
        chip.appendChild(
          s("rect", {
            x: x0 + p * cpitch,
            y: 244,
            width: chipW,
            height: 24,
            rx: 6,
            fill: isQuery ? C.accent : C.panel,
            "fill-opacity": isQuery ? 0.2 : 1,
            stroke: isQuery ? C.accent : C.line,
            opacity: allowed ? 1 : 0.45,
          }),
        );
        chip.appendChild(txt(cx(p), 260, TEXT[p], { anchor: "middle", size: 8.5, mono: true, fill: allowed ? C.fg : C.dim }));
        art.appendChild(chip);
        art.appendChild(s("rect", { x: cx(p) - 7, y: kY, width: 14, height: 14, rx: 3, fill: C.purple, "fill-opacity": allowed ? 0.35 : 0.1, stroke: C.purple, opacity: allowed ? 1 : 0.4 }));
        art.appendChild(txt(cx(p), kY + 28, "k" + p, { anchor: "middle", size: 8.5, mono: true, fill: allowed ? C.purple : C.dim, opacity: allowed ? 1 : 0.5 }));
      }

      for (let p = 0; p <= t; p++) {
        const r = t > 0 ? rel(weights[p]) : 1;
        art.appendChild(s("line", { x1: cx(t), y1: qY, x2: cx(p), y2: kY + 14, stroke: C.accent, "stroke-width": 0.8 + 4.5 * r, opacity: 0.45 + 0.55 * r }));
      }
      art.appendChild(s("rect", { x: cx(t) - 9, y: qY, width: 18, height: 18, rx: 4, fill: C.accent, "fill-opacity": 0.5, stroke: C.fg }));
      art.appendChild(txt(cx(t), qY + 32, "q_t", { anchor: "middle", size: 9.5, mono: true, fill: C.accent }));
      art.appendChild(txt(32, qY + 32, "Causal: token " + t + " reads 0 … " + t + ".", { size: 10.5, fill: C.fg }));

      const mx = 300;
      const my = 396;
      const mPitch = 16;
      const colPitch = 18;
      art.appendChild(txt(196, my - 8, "a_{t,p}", { size: 9.5, fill: C.warn }));
      art.appendChild(txt(mx, my - 8, "V · row p is the v vector of position p, 8 numbers wide", { size: 9.5, fill: C.teal }));
      for (let p = 0; p < n; p++) {
        const allowed = p <= t;
        const r = allowed && t > 0 ? rel(weights[p]) : allowed ? 1 : 0;
        art.appendChild(s("rect", { x: 196, y: my + p * mPitch, width: allowed ? 6 + 34 * r : 2, height: 12, rx: 2, fill: C.warn, "fill-opacity": allowed ? 0.75 : 0.15 }));
        for (let j = 0; j < D; j++) {
          art.appendChild(
            s("rect", { x: mx + j * colPitch, y: my + p * mPitch, width: 16, height: 12, rx: 2, fill: cellFill(valVec(layer, head, p)[j], C.teal), opacity: allowed ? 0.25 + 0.75 * r : 0.06 }),
          );
        }
        art.appendChild(txt(188, my + p * mPitch + 10, String(p), { anchor: "end", size: 8, mono: true, fill: C.dim }));
      }
      tex(art, 470, my + 44, T`o_t = Σ_p a_{t,p} v_p`, { size: 11, color: C.teal });
      art.appendChild(txt(470, my + 66, "step " + (t + 1) + " of " + n, { size: 10, fill: C.dim }));
      art.appendChild(txt(470, my + 88, "= a weighted sum of whole v rows", { size: 10, fill: C.dim }));

      const ostep = Math.min(D * 10 + 3, Math.floor(643 / n));
      const ocw = Math.max(3, Math.floor((ostep - 3) / D) - 1);
      const ox0 = MID - (n * ostep - 3) / 2;
      art.appendChild(txt(ox0, BLOCK.outY + 30, "o_0 … o_" + t + " · one vector per step", { size: 9.5, fill: C.ok }));
      for (let p = 0; p <= t; p++) {
        const vec = attnVec(layer, head, p);
        for (let j = 0; j < D; j++) {
          art.appendChild(
            s("rect", { x: ox0 + p * ostep + j * (ocw + 1), y: BLOCK.outY + 40, width: ocw, height: 14, rx: 1, fill: cellFill(vec[j], C.ok), opacity: p === t ? 1 : 0.72 }),
          );
        }
      }
    }

    /* ------------------------------ step 3 ------------------------------ */
    if (step === 2) {
      strip(art, MID - 48, BLOCK.inY + 62, attnVec(layer, head, t), C.ok, "o_t · attention output");
      art.appendChild(s("rect", { x: 210, y: 230, width: 300, height: 30, rx: 7, fill: C.panel2, stroke: C.line }));
      art.appendChild(txt(224, 250, "RMSNorm", { size: 11, fill: C.fg }));
      arrow(art, MID, 262, MID, 292, C.dim, "arw-d");
      const bars = [
        { y: 292, x: 40, w: 640, label: "up-projection" },
        { y: 336, x: 200, w: 320, label: "bottleneck" },
        { y: 380, x: 40, w: 640, label: "down-projection" },
      ];
      for (const b of bars) {
        art.appendChild(s("rect", { x: b.x, y: b.y, width: b.w, height: 30, rx: 7, fill: C.panel2, stroke: C.purple }));
        art.appendChild(txt(b.x + 12, b.y + 19, b.label, { size: 10 }));
      }
      art.appendChild(s("path", { d: "M 30 440 C 30 330 690 330 690 440", fill: "none", stroke: C.ok, "stroke-width": 1.2, "stroke-dasharray": "5 4" }));
      art.appendChild(txt(40, 462, "+ residual", { size: 10.5, fill: C.ok }));
      strip(art, MID - 48, BLOCK.outY + 62, outVec(t), C.fg, "h_t · up to the next layer");
    }
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


  const draws = [
    drawLayer,
    drawLoop,
    (art: SVGSVGElement) => drawFlow(art, "pre"),
    (art: SVGSVGElement) => drawFlow(art, "dec"),
  ];

  /* -------------------------------- cards -------------------------------- */

  function cardsFor(i: number): Array<{ k: string; v: string; hint?: string }> {
    const sec = SECS[i].id;
    const c = flowCursor(sec === "decode" ? "dec" : "pre");
    if (sec === "layer") {
      const qt = Math.min(attnToken, n - 1);
      const weights = attention(layer, head, qt);
      let top = 0;
      weights.forEach((w, j) => {
        if (w > (weights[top] === undefined ? 0 : weights[top])) top = j;
      });
      const base: Array<{ k: string; v: string; hint?: string }> = [
        { k: "step", v: step + 1 + " / 3", hint: STEPS[step].chip },
        { k: "cross-token", v: step === 1 ? "yes" : "no", hint: step === 1 ? "attention is the one step that reads other positions" : "this position alone" },
      ];
      if (step !== 1) return base;
      return base.concat([
        { k: "query token", v: "t = " + qt },
        { k: "keys it may read", v: "p ≤ " + qt },
        { k: "top weight", v: weights.length > 0 ? weights[top].toFixed(2) + " → token " + top : "—" },
      ]);
    }
    if (sec === "next-token-prediction") {
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
    return [{ k: "positions", v: String(n) }];
  }

  /* ------------------------------- controls ------------------------------ */

  const sampleBtn = mkBtn("▶ Sample next token", true);
  const loopReset = mkBtn("Reset");
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

  secEls[1].ctl.append(sampleBtn, loopReset);
  secEls[2].ctl.append(prePlay, preStep, preReset);
  secEls[3].ctl.append(decPlay, decStep, decReset);

  /* -------------------------------- render ------------------------------- */

  function render(): void {
    if (dead) return;
    preCursor = Math.min(preCursor, n - 1);
    attnToken = Math.min(attnToken, n - 1);
    decCursor = Math.min(decCursor, n - 1);
    posOut.textContent = String(n);
    headBtns.forEach((b, i) => {
      b.classList.toggle("on", Math.floor(i / HEADS) === layer && i % HEADS === head);
    });
    sampleBtn.textContent = flash ? "sampling…" : n >= MAX_N ? "↺ Restart the loop" : "▶ Sample next token";
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
      if (attnTimer !== null) window.clearInterval(attnTimer);
      if (preTimer !== null) window.clearInterval(preTimer);
      if (decTimer !== null) window.clearInterval(decTimer);
    },
  };
};

export default kvCache;
