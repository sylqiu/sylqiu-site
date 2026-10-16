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
 * real sub/superscripts.
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
const DEC_STEPS = 4;
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
  top?: number;
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
    top: 44,
  },
  {
    id: "next-token-prediction",
    title: "Next token prediction",
    blurb:
      "A token is an element of the vocabulary. Every token is mapped to a probability distribution of the next token.",
    h: 380,
    top: 44,
  },
  {
    id: "prefill",
    title: "Prefill: processing the prompt sequence all at once",
    blurb:
      "This is the standard forward pass of the transformer on an input sequence with causal attention.",
    h: 640,
    top: 44,
  },
  {
    id: "decode",
    title: "Decode: sample the next token, then repeat the forward pass with the updated token sequence",
    blurb:
      "",
    h: 640,
    top: 44,
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

  let preStage = 0;
  let decoded = 0;
  let preTimer: number | null = null;
  let decTimer: number | null = null;
  let dead = false;
  let timer: number | null = null;

  const root = document.createElement("div");
  root.className = "ill";


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
    const svg = s("svg", { viewBox: "0 -" + (sec.top || 0) + " " + VB_W + " " + (sec.h + (sec.top || 0)), role: "img", "aria-label": sec.title });
    fig.appendChild(svg);
    const cards = document.createElement("div");
    cards.className = "ill-cards";
    let proseEl: HTMLElement | null = null;
    section.append(head, blurb, fig);
    if (sec.prose) {
      proseEl = document.createElement("div");
      proseEl.className = "ill-prose";
      proseEl.innerHTML = sec.prose.map((p) => "<p>" + p + "</p>").join("");
      section.appendChild(proseEl);
    }
    root.appendChild(section);
    secEls.push({ svg, cards, ctl: secCtl, prose: proseEl });
  });

  host.appendChild(root);

  /* ------------------------------ section 1 ----------------------------- */

  const STEPS = [
    { chip: "1 · normalize, project q, k, v" },
    { chip: "2 · causal self-attention" },
    { chip: "3 · normalize, MLP, residual" },
  ];

  const BLOCK = { inY: 60, inH: 108, opY: 196, opH: 340, outY: 566, outH: 128 };
  const MID = 360;
  const SQ = 22;
  const SQ_PITCH = 28;

  /* one square is one vector; a row of squares is a list over positions */
  function sqList(art: SVGSVGElement, y: number, count: number, color: string, label: string, filled = count): void {
    const rowW = count * SQ_PITCH - 6;
    const x0 = MID - rowW / 2;
    art.appendChild(txt(40, y + SQ / 2 + 3, label, { size: 10, fill: color }));
    for (let p = 0; p < count; p++) {
      const on = p < filled;
      art.appendChild(
        s("rect", { x: x0 + p * SQ_PITCH, y, width: SQ, height: SQ, rx: 5, fill: on ? color : "none", "fill-opacity": on ? 0.22 : 0, stroke: on ? color : C.line, "stroke-width": 1.3 }),
      );
      art.appendChild(txt(x0 + p * SQ_PITCH + SQ / 2, y + SQ / 2 + 3.5, String(p), { anchor: "middle", size: 8, mono: true, fill: C.fg, opacity: on ? 1 : 0.4 }));
    }
  }

  const hVec = (p: number): Vec => cachedVec("h:" + p, () => unit((i) => gauss(p, i, 44)));
  const outVec = (p: number): Vec => cachedVec("o:" + p, () => unit((i) => gauss(p, i, 88)));
  const attnVec = (l: number, h: number, p: number): Vec => cachedVec("a:" + l + ":" + h + ":" + p, () => unit((i) => gauss(l, h, p, i, 99)));

  /* a button drawn inside the figure it controls */
  function svgBtn(art: SVGSVGElement, x: number, y: number, w: number, label: string, onClick: () => void, on = true): void {
    const color = on ? C.accent : C.dim;
    const g = s("g", { cursor: on ? "pointer" : "default", class: "ill-svg-btn" });
    g.appendChild(s("rect", { x, y, width: w, height: 26, rx: 13, fill: color, "fill-opacity": on ? 0.12 : 0.06, stroke: color }));
    g.appendChild(txt(x + w / 2, y + 17, label, { anchor: "middle", size: 10.5, fill: color, weight: 600 }));
    if (on) g.addEventListener("click", onClick);
    art.appendChild(g);
  }

  function drawLayer(art: SVGSVGElement): void {
    const t = Math.min(attnToken, n - 1);
    const weights = attention(layer, head, t);
    const wMax = weights.length > 0 ? Math.max.apply(null, weights) : 1;
    const rel = (w: number): number => Math.min(1, w / wMax);
    const r1 = BLOCK.inY + 18;
    const r2 = BLOCK.inY + 50;
    const r3 = BLOCK.inY + 82;
    const o1 = BLOCK.outY + 18;
    const o2 = BLOCK.outY + 50;
    const o3 = BLOCK.outY + 82;

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
      sqList(art, r2, n, C.fg, "h_[t]");
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
      sqList(art, o1, n, C.accent, "q_[t]");
      sqList(art, o2, n, C.purple, "k_[t]");
      sqList(art, o3, n, C.teal, "v_[t]");
    }

    /* ------------------------------ step 2 ------------------------------ */
    if (step === 1) {
      sqList(art, r1, n, C.accent, "q_[t]");
      sqList(art, r2, n, C.purple, "k_[t]");
      sqList(art, r3, n, C.teal, "v_[t]");

      const chipW = 30;
      const cpitch = 34;
      const rowW = n * cpitch - 4;
      const x0 = MID - rowW / 2;
      const cx = (p: number): number => x0 + p * cpitch + chipW / 2;
      const kY = 280;
      const qY = 336;
      art.appendChild(txt(216, kY + 15, "k_[t]", { anchor: "end", size: 9.5, fill: C.purple }));

      art.appendChild(txt(32, 222, "one step per token: dot the keys, mix the values", { size: 10, fill: C.teal, weight: 600 }));
      svgBtn(art, 500, 206, 190, attnTimer !== null ? "❚❚ Pause" : "▶ Animate attention", toggleAttn);

      if (t < n - 1) {
        art.appendChild(s("rect", { x: cx(t + 1) - 8, y: 244, width: (n - t - 1) * cpitch + 8, height: 122, rx: 6, fill: C.panel2, "fill-opacity": 0.3, stroke: C.warn, "stroke-dasharray": "4 3" }));
        art.appendChild(txt(x0 + rowW - 6, 358, "blocked · p > t", { anchor: "end", size: 9.5, fill: C.warn }));
      }

      for (let p = 0; p < n; p++) {
        const allowed = p <= t;
        const isQuery = p === t;
        art.appendChild(
          s("rect", { x: x0 + p * cpitch, y: 244, width: chipW, height: 24, rx: 6, fill: isQuery ? C.accent : C.panel, "fill-opacity": isQuery ? 0.2 : 1, stroke: isQuery ? C.accent : C.line, opacity: allowed ? 1 : 0.45 }),
        );
        art.appendChild(txt(cx(p), 260, TEXT[p], { anchor: "middle", size: 8.5, mono: true, fill: allowed ? C.fg : C.dim }));
        art.appendChild(s("rect", { x: cx(p) - 11, y: kY, width: 22, height: 22, rx: 5, fill: C.purple, "fill-opacity": allowed ? 0.28 : 0.08, stroke: C.purple, opacity: allowed ? 1 : 0.4 }));
        art.appendChild(txt(cx(p), kY + 15, String(p), { anchor: "middle", size: 8, mono: true, fill: C.fg, opacity: allowed ? 1 : 0.45 }));
      }

      for (let p = 0; p <= t; p++) {
        const r = t > 0 ? rel(weights[p]) : 1;
        art.appendChild(s("line", { x1: cx(t), y1: qY, x2: cx(p), y2: kY + 22, stroke: C.accent, "stroke-width": 0.8 + 4.5 * r, opacity: 0.45 + 0.55 * r }));
      }
      art.appendChild(s("rect", { x: cx(t) - 13, y: qY, width: 26, height: 26, rx: 6, fill: C.accent, "fill-opacity": 0.3, stroke: C.fg }));
      art.appendChild(txt(cx(t), qY + 17, String(t), { anchor: "middle", size: 8, mono: true, fill: C.fg }));
      art.appendChild(txt(cx(t), qY + 42, "q_t", { anchor: "middle", size: 9.5, fill: C.accent }));
      art.appendChild(txt(32, qY + 40, "Causal: token " + t + " reads 0 … " + t + ".", { size: 10.5, fill: C.fg }));

      const barX = 250;
      const vX = 306;
      const rowPitch = 18;
      const ry = 392;
      art.appendChild(txt(barX, ry - 14, "a_{t,p}", { size: 9.5, fill: C.warn }));
      art.appendChild(txt(vX, ry - 14, "v_[t] · one square per position", { size: 9.5, fill: C.teal }));
      for (let p = 0; p < n; p++) {
        const allowed = p <= t;
        const r = allowed && t > 0 ? rel(weights[p]) : allowed ? 1 : 0;
        art.appendChild(s("rect", { x: barX, y: ry + p * rowPitch, width: allowed ? 6 + 34 * r : 2, height: 13, rx: 2, fill: C.warn, "fill-opacity": allowed ? 0.8 : 0.15 }));
        art.appendChild(s("rect", { x: vX, y: ry + p * rowPitch, width: 16, height: 13, rx: 3, fill: C.teal, "fill-opacity": allowed ? 0.2 + 0.65 * r : 0.06, stroke: C.teal, "stroke-width": 1, opacity: allowed ? 1 : 0.3 }));
        art.appendChild(txt(vX + 8, ry + p * rowPitch + 11, String(p), { anchor: "middle", size: 7.5, mono: true, fill: C.fg, opacity: allowed ? 1 : 0.4 }));
      }
      tex(art, 384, ry + 34, T`o_t = Σ_p a_{t,p} v_p`, { size: 11.5, color: C.teal });
      art.appendChild(txt(384, ry + 56, "step " + (t + 1) + " of " + n, { size: 10, fill: C.dim }));

      sqList(art, o2, n, C.ok, "o_[t]", t + 1);
    }

    /* ------------------------------ step 3 ------------------------------ */
    if (step === 2) {
      sqList(art, r2, n, C.ok, "o_[t]");
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
      sqList(art, o2, n, C.fg, "h_[t]");
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
    svgBtn(art, 20, -36, 190, flash ? "sampling…" : n >= MAX_N ? "↺ Restart the loop" : "▶ Sample next token", animateAppend);
    svgBtn(art, 232, -36, 96, "↺ Reset", () => {
      n = MIN_N;
      flash = false;
      render();
    });


  }
  /* --------------------------- sections 3 and 4 -------------------------- */

  /* prefill: the prompt enters at once and every position is attended in one pass */
  function drawPrefill(art: SVGSVGElement): void {
    const st = preStage;
    const hasKV = st >= 1;
    const hasDots = st >= 2;
    const hasOut = st >= 3;

    const box = (y: number, h: number, label: string, color: string): void => {
      art.appendChild(s("rect", { x: 20, y, width: 680, height: h, rx: 10, fill: C.panel, "fill-opacity": 0.5, stroke: C.line }));
      art.appendChild(txt(32, y + 19, label, { size: 10, weight: 600, fill: color }));
    };
    box(20, 106, "input", C.dim);
    box(154, 316, "prefill · one pass", C.accent);
    box(498, 114, "output", C.dim);
    arrow(art, MID, 130, MID, 150, C.dim, "arw-d");
    arrow(art, MID, 474, MID, 494, C.dim, "arw-d");

    svgBtn(art, 20, -36, 150, preTimer !== null ? "❚❚ Pause" : "▶ Prefill", togglePrefill);
    svgBtn(art, 180, -36, 96, "↺ Reset", resetPrefill);

    sqList(art, 36, n, C.accent, "q_[t]", hasDots ? n : 0);
    sqList(art, 68, n, C.purple, "k_[t]", hasKV ? n : 0);
    sqList(art, 100, n, C.teal, "v_[t]", hasKV ? n : 0);

    art.appendChild(txt(210, 173, "the whole prompt at once", { size: 10, fill: C.accent, weight: 600 }));

    const chipW = 30;
    const cpitch = 34;
    const rowW = n * cpitch - 4;
    const x0 = MID - rowW / 2;
    const cx = (p: number): number => x0 + p * cpitch + chipW / 2;
    const chipY = 196;
    const kY = 236;
    const qY = 296;
    const vY = 356;
    art.appendChild(txt(40, kY + 15, "k_[t]", { size: 10, fill: C.purple }));
    art.appendChild(txt(40, qY + 15, "q_[t]", { size: 10, fill: C.accent }));
    art.appendChild(txt(40, vY + 15, "v_[t]", { size: 10, fill: C.teal }));

    for (let p = 0; p < n; p++) {
      art.appendChild(s("rect", { x: x0 + p * cpitch, y: chipY, width: chipW, height: 24, rx: 6, fill: C.panel, stroke: C.line }));
      art.appendChild(txt(cx(p), chipY + 16, TEXT[p], { anchor: "middle", size: 8.5, mono: true, fill: C.fg }));
      art.appendChild(s("rect", { x: cx(p) - 11, y: kY, width: 22, height: 22, rx: 5, fill: C.purple, "fill-opacity": hasKV ? 0.28 : 0.06, stroke: hasKV ? C.purple : C.line }));
      art.appendChild(txt(cx(p), kY + 15, String(p), { anchor: "middle", size: 8, mono: true, fill: C.fg, opacity: hasKV ? 1 : 0.35 }));
      art.appendChild(s("rect", { x: cx(p) - 11, y: qY, width: 22, height: 22, rx: 5, fill: C.accent, "fill-opacity": hasDots ? 0.3 : 0.06, stroke: hasDots ? C.accent : C.line }));
      art.appendChild(txt(cx(p), qY + 15, String(p), { anchor: "middle", size: 8, mono: true, fill: C.fg, opacity: hasDots ? 1 : 0.35 }));
      art.appendChild(s("rect", { x: cx(p) - 11, y: vY, width: 22, height: 22, rx: 5, fill: C.teal, "fill-opacity": hasKV ? 0.28 : 0.06, stroke: hasKV ? C.teal : C.line }));
      art.appendChild(txt(cx(p), vY + 15, String(p), { anchor: "middle", size: 8, mono: true, fill: C.fg, opacity: hasKV ? 1 : 0.35 }));
    }
    art.appendChild(txt(40, chipY + 16, "tokens", { size: 10, fill: C.dim }));

    if (hasDots) {
      for (let t = 0; t < n; t++) {
        for (let p = 0; p <= t; p++) {
          art.appendChild(s("line", { x1: cx(t), y1: qY, x2: cx(p), y2: kY + 22, stroke: C.accent, "stroke-width": 0.8, opacity: 0.28 }));
        }
      }
      art.appendChild(txt(32, 424, "every query reads its keys in the same pass · position t reads p ≤ t", { size: 10.5, fill: C.fg }));
    }
    art.appendChild(txt(32, 448, hasKV ? "k and v written once, for every position" : "nothing written yet", { size: 10.5, fill: hasKV ? C.teal : C.dim }));

    sqList(art, 542, n, C.ok, "o_[t]", hasOut ? n : 0);
  }

  /* decode: picks up where prefill stopped; the cache rows never change, only the new query is computed */
  function drawDecode(art: SVGSVGElement): void {
    const done = Math.min(decoded, DEC_STEPS);
    const pos = n + done;
    const weights = attention(layer, head, pos);
    const wMax = weights.length > 0 ? Math.max.apply(null, weights) : 1;
    const rel = (w: number): number => Math.min(1, w / wMax);
    const genTok = (p: number): string => {
      if (p < n) return TEXT[p];
      const probs = distribution(p - 1);
      let best = 0;
      probs.forEach((v, i) => {
        if (v > probs[best]) best = i;
      });
      return TEXT[best];
    };

    const box = (y: number, h: number, label: string, color: string): void => {
      art.appendChild(s("rect", { x: 20, y, width: 680, height: h, rx: 10, fill: C.panel, "fill-opacity": 0.5, stroke: C.line }));
      art.appendChild(txt(32, y + 19, label, { size: 10, weight: 600, fill: color }));
    };
    box(20, 106, "input", C.dim);
    box(154, 316, "decode · one token per step", C.teal);
    box(498, 114, "output", C.dim);
    arrow(art, MID, 130, MID, 150, C.dim, "arw-d");
    arrow(art, MID, 474, MID, 494, C.dim, "arw-d");
    svgBtn(art, 20, -36, 150, decTimer !== null ? "❚❚ Pause" : "▶ Decode", toggleDecode);
    svgBtn(art, 180, -36, 96, "Step ▸", stepDecode, done < DEC_STEPS);
    svgBtn(art, 286, -36, 96, "↺ Reset", resetDecode);

    /* what prefill left in the cache, plus one row per decoded position */
    const cw = 18;
    const cpc = 20;
    const rowW = (pos + 1) * cpc - 2;
    const cX0 = MID - rowW / 2;
    const cacheRow = (y: number, color: string, label: string): void => {
      art.appendChild(txt(40, y + 13, label, { size: 10, fill: color }));
      for (let p = 0; p <= pos; p++) {
        const fromPrompt = p < n;
        const pending = p === pos;
        art.appendChild(
          s("rect", {
            x: cX0 + p * cpc,
            y,
            width: cw,
            height: cw,
            rx: 4,
            fill: pending ? "none" : color,
            "fill-opacity": fromPrompt ? 0.22 : 0.38,
            stroke: pending ? color : color,
            "stroke-dasharray": pending ? "3 2" : "",
            opacity: pending ? 1 : fromPrompt ? 0.8 : 1,
          }),
        );
        art.appendChild(txt(cX0 + p * cpc + cw / 2, y + 13, String(p), { anchor: "middle", size: 7.5, mono: true, fill: C.fg, opacity: pending ? 1 : fromPrompt ? 0.75 : 1 }));
      }
    };
    cacheRow(46, C.purple, "k_[t]");
    cacheRow(74, C.teal, "v_[t]");
    art.appendChild(s("rect", { x: cX0 + pos * cpc, y: 98, width: cw, height: cw, rx: 4, fill: C.accent, "fill-opacity": 0.34, stroke: C.accent }));
    art.appendChild(txt(cX0 + pos * cpc + cw / 2, 111, String(pos), { anchor: "middle", size: 8, mono: true, fill: C.fg }));
    art.appendChild(txt(40, 111, "q_" + pos + " · the only new vector", { size: 10, fill: C.accent }));

    art.appendChild(txt(210, 173, "one step: the new query reads the frozen cache", { size: 10, fill: C.teal, weight: 600 }));

    const count = pos + 1;
    const chipW = 26;
    const cpitch = 30;
    const rowW2 = count * cpitch - 4;
    const x0 = MID - rowW2 / 2;
    const cx = (p: number): number => x0 + p * cpitch + chipW / 2;
    const chipY = 196;
    const kY = 240;
    const qY = 300;
    const vY = 360;
    for (let p = 0; p <= pos; p++) {
      const fromPrompt = p < n;
      const pending = p === pos;
      art.appendChild(s("rect", { x: x0 + p * cpitch, y: chipY, width: chipW, height: 24, rx: 6, fill: pending ? C.teal : C.panel, "fill-opacity": pending ? 0.2 : 1, stroke: pending ? C.teal : C.line }));
      art.appendChild(txt(cx(p), chipY + 16, genTok(p), { anchor: "middle", size: 8, mono: true, fill: pending ? C.fg : C.dim }));
      art.appendChild(s("rect", { x: cx(p) - 10, y: kY, width: 20, height: 20, rx: 5, fill: C.purple, "fill-opacity": pending ? 0.4 : fromPrompt ? 0.22 : 0.34, stroke: C.purple, opacity: pending ? 1 : fromPrompt ? 0.8 : 1 }));
      art.appendChild(txt(cx(p), kY + 14, String(p), { anchor: "middle", size: 7.5, mono: true, fill: C.fg, opacity: pending ? 1 : fromPrompt ? 0.75 : 1 }));
      art.appendChild(s("rect", { x: cx(p) - 10, y: vY, width: 20, height: 20, rx: 5, fill: C.teal, "fill-opacity": pending ? 0.4 : fromPrompt ? 0.22 : 0.34, stroke: C.teal, opacity: pending ? 1 : fromPrompt ? 0.8 : 1 }));
      art.appendChild(txt(cx(p), vY + 14, String(p), { anchor: "middle", size: 7.5, mono: true, fill: C.fg, opacity: pending ? 1 : fromPrompt ? 0.75 : 1 }));
      if (p === n - 1) art.appendChild(s("line", { x1: cx(p) + cpitch / 2, y1: chipY - 6, x2: cx(p) + cpitch / 2, y2: vY + 26, stroke: C.dim, "stroke-dasharray": "3 3", opacity: 0.6 }));
    }
    art.appendChild(txt(40, chipY + 16, "tokens", { size: 10, fill: C.dim }));
    art.appendChild(txt(40, kY + 14, "k_[t]", { size: 10, fill: C.purple }));
    art.appendChild(txt(40, vY + 14, "v_[t]", { size: 10, fill: C.teal }));

    art.appendChild(s("rect", { x: cx(pos) - 12, y: qY, width: 24, height: 24, rx: 6, fill: C.accent, "fill-opacity": 0.34, stroke: C.fg }));
    art.appendChild(txt(cx(pos), qY + 16, String(pos), { anchor: "middle", size: 8, mono: true, fill: C.fg }));
    for (let p = 0; p <= pos; p++) {
      const w = rel(weights[p]);
      art.appendChild(s("line", { x1: cx(pos), y1: qY, x2: cx(p), y2: kY + 20, stroke: C.accent, "stroke-width": 0.8 + 4.5 * w, opacity: 0.45 + 0.55 * w }));
    }
    art.appendChild(txt(40, qY + 16, "q_" + pos, { size: 10, fill: C.accent }));
    art.appendChild(txt(32, 424, "everything left of the dashed line came from prefill · rows read, never rewritten", { size: 10.5, fill: C.fg }));
    art.appendChild(txt(32, 448, "this step appends one row and computes one new output", { size: 10.5, fill: C.teal }));

    const opitch = Math.min(38, Math.floor(643 / count));
    const ox0 = MID - (count * opitch - 4) / 2;
    art.appendChild(txt(40, 553, "o_[t]", { size: 10, fill: C.ok }));
    for (let p = 0; p <= pos; p++) {
      const pending = p === pos;
      const fromPrompt = p < n;
      art.appendChild(s("rect", { x: ox0 + p * opitch, y: 542, width: 22, height: 22, rx: 5, fill: pending ? C.ok : "none", "fill-opacity": pending ? 0.42 : 0, stroke: C.ok, opacity: pending ? 1 : fromPrompt ? 0.5 : 0.75 }));
      art.appendChild(txt(ox0 + p * opitch + 11, 557, String(p), { anchor: "middle", size: 8, mono: true, fill: C.fg, opacity: pending ? 1 : fromPrompt ? 0.5 : 0.75 }));
    }
    art.appendChild(txt(MID, 604, "the prompt outputs came from prefill · one new output per step", { anchor: "middle", size: 9.5, fill: C.dim }));
  }

  const draws = [
    drawLayer,
    drawLoop,
    drawPrefill,
    drawDecode,
  ];

  /* -------------------------------- cards -------------------------------- */

  function cardsFor(_i: number): Array<{ k: string; v: string; hint?: string }> {
    return [];
  }

  /* ------------------------------- controls ------------------------------ */

  function appendToken(): void {
    if (dead) return;
    n = n >= MAX_N ? MIN_N : n + 1;
    flash = false;
    render();
  }

  function animateAppend(): void {
    if (timer !== null) window.clearTimeout(timer);
    if (n >= MAX_N) {
      n = MIN_N;
    }
    flash = true;
    render();
    timer = window.setTimeout(() => {
      timer = null;
      appendToken();
    }, 620);
  }

  function stopPrefill(): void {
    if (preTimer !== null) {
      window.clearInterval(preTimer);
      preTimer = null;
    }
  }

  function togglePrefill(): void {
    if (preTimer !== null) {
      stopPrefill();
      render();
      return;
    }
    if (preStage >= 3) preStage = 0;
    render();
    preTimer = window.setInterval(() => {
      preStage += 1;
      if (preStage >= 3) {
        preStage = 3;
        stopPrefill();
      }
      render();
    }, 800);
  }

  function resetPrefill(): void {
    stopPrefill();
    preStage = 0;
    render();
  }

  function stopDecode(): void {
    if (decTimer !== null) {
      window.clearInterval(decTimer);
      decTimer = null;
    }
  }

  function toggleDecode(): void {
    if (decTimer !== null) {
      stopDecode();
      render();
      return;
    }
    if (decoded >= DEC_STEPS) decoded = 0;
    render();
    decTimer = window.setInterval(() => {
      decoded += 1;
      if (decoded >= DEC_STEPS) {
        decoded = DEC_STEPS;
        stopDecode();
      }
      render();
    }, 900);
  }

  function stepDecode(): void {
    stopDecode();
    decoded = Math.min(DEC_STEPS, decoded + 1);
    render();
  }

  function resetDecode(): void {
    stopDecode();
    decoded = 0;
    render();
  }

  /* -------------------------------- render ------------------------------- */

  function render(): void {
    if (dead) return;
    attnToken = Math.min(attnToken, n - 1);

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
