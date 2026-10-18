/**
 * Illustration: How KV cache works in an autoregressive LLM.
 *
 * A stacked explainer: ten sections, each its own figure, read top to bottom.
 *  1  inside one transformer layer — per-token blocks vs the one cross-token step,
 *     with the causal mask drawn explicitly
 *  2  the autoregressive loop — a token becomes a distribution over the next token
 *  3  prefill, walked position by position
 *  4  decode, the same walk with K and V read from the cache
 *  5  contiguous cache allocation — reserved buffers and the waste they leave
 *  6  PagedAttention — fixed-size physical blocks and per-sequence block tables
 *  7  continuous batching — iteration-level scheduling against a paged pool
 *  8  block sharing — reference counts and copy-on-write for a shared prefix
 *  9  RadixAttention — a global radix tree that reuses the longest matching prefix
 * 10  prefill/decode disaggregation — separate pools and the KV handoff
 *
 * One toy model throughout: 2 layers x 2 heads per layer, head dimension d = 8, so
 * one (layer, head) slice is eight numbers wide. Formulas are plain SVG text with
 * real sub/superscripts.
 */
import type { SceneFactory } from "../lib/registry.ts";
import { pseudocode } from "../content/kv-cache-pseudocode/index.ts";

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

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function pyBlock(title: string, code: string, refs: string): string {
  return "<h3>" + title + "</h3><pre><code>" + escapeHtml(code) + "</code></pre>" + refs;
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
    title: "Next Token Prediction",
    blurb:
      "A token is an element of the vocabulary. Every token is mapped to a probability distribution of the next token.",
    h: 380,
    top: 44,
  },
  {
    id: "prefill",
    title: "The Prefill Stage",
    blurb:
      "This is the standard forward pass of the transformer on an input sequence with causal attention.",
    h: 640,
    top: 44,
  },
  {
    id: "decode",
    title: "The Decode Stage",
    blurb:
      "Each step we sample the next token, then repeat the forward pass with the updated token sequence. We only need to compute the QKV for the new token and its attention to the past, which only needs K and V.",
    h: 640,
    top: 44,
  },
  {
    id: "contiguous",
    title: "The Cost of Contiguity",
    blurb:
      "The cache is now the thing to store, and it grows one token at a time. A serving system that gives each request one contiguous buffer has to reserve the longest sequence it might produce up front — so most of the cache is allocated but empty.",
    h: 310,
    top: 44,
  },
  {
    id: "paged",
    title: "PagedAttention: Blocks, Not Buffers",
    blurb:
      "PagedAttention cuts the cache into fixed-size physical blocks. Each sequence keeps a block table mapping its logical blocks to blocks anywhere in the pool, so memory is allocated on demand and a sequence's cache never has to be contiguous.",
    h: 430,
    top: 44,
  },
  {
    id: "batching",
    title: "Continuous Batching",
    blurb:
      "Once the cache is paged, the scheduler can reconsider the batch on every forward pass. A finished request returns its blocks immediately and a queued request joins the next iteration — no waiting for the slowest sequence to finish.",
    h: 360,
    top: 44,
  },
  {
    id: "sharing",
    title: "Sharing Blocks: Copy-on-Write",
    blurb:
      "A block table makes sharing cheap: two requests can point at the same physical block. Each block keeps a reference count, and a write to a shared block triggers copy-on-write — copy the block, update one table, and leave the other request untouched.",
    h: 350,
    top: 44,
  },
  {
    id: "radix",
    title: "RadixAttention: One Tree of Prefixes",
    blurb:
      "RadixAttention sits on top of paged blocks: the cache becomes a radix tree keyed by token sequences. A request walks the tree to its longest matching prefix, reuses those KV blocks, and computes only the unmatched suffix. Shared ancestors stay put while leaves are evicted LRU.",
    h: 430,
    top: 44,
  },
  {
    id: "disagg",
    title: "Prefill / Decode Disaggregation",
    blurb:
      "Without chunked prefill, a long prompt on a shared worker stalls decode behind it. Chunked prefill interleaves prompt chunks with decode; disaggregation goes further, giving prefill and decode separate pools and handing the prompt's KV blocks from the prefill worker to the decode worker over the interconnect.",
    h: 600,
    top: 44,
  },
  {
    id: "pseudocode",
    title: "Pseudocode: The Serving Loop",
    blurb:
      "Every diagram above is a data-structure cartoon. Here is the shape of the code: a block table with copy-on-write, a radix prefix matcher, an iteration-level scheduler, and a prefill/decode handoff. The links point to production implementations.",
    h: 250,
    top: 44,
    prose: [
      '<p>Shape-of-the-code pseudocode with lightweight Python types, not drop-in API calls. The snippets are kept as standalone Python files and rendered here verbatim.</p>',
      pyBlock(
        "Core objects",
        pseudocode.coreObjects,
        '<p class="ill-refs">Types are illustrative; vLLM uses <a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/block_pool.py">KVCacheBlock / BlockPool</a>, SGLang uses <a href="https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/mem_cache/radix_cache.py">TreeNode / RadixKey</a>.</p>',
      ),
      pyBlock(
        "PagedAttention: block table + copy-on-write",
        pseudocode.pagedAttention,
        '<p class="ill-refs"><a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/kv_cache_manager.py">vLLM KVCacheManager</a> · <a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/block_pool.py">BlockPool</a> · <a href="https://arxiv.org/abs/2309.06180">PagedAttention paper</a></p>',
      ),
      pyBlock(
        "RadixAttention: longest-prefix match",
        pseudocode.radixAttention,
        '<p class="ill-refs"><a href="https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/mem_cache/radix_cache.py">SGLang radix_cache.py</a> · <a href="https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/managers/scheduler.py">SGLang scheduler.py</a> · <a href="https://arxiv.org/abs/2312.07104">RadixAttention paper</a></p>',
      ),
      pyBlock(
        "Continuous batching: one iteration at a time",
        pseudocode.scheduler,
        '<p class="ill-refs"><a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/sched/scheduler.py">vLLM scheduler.py</a> · <a href="https://arxiv.org/abs/2404.14294">DeepSpeed-FastGen / Dynamic SplitFuse</a> · <a href="https://arxiv.org/abs/2403.02310">Sarathi-Serve / chunked prefill</a></p>',
      ),
      pyBlock(
        "Prefill → decode handoff",
        pseudocode.handoff,
        '<p class="ill-refs"><a href="https://github.com/NVIDIA/TensorRT-LLM/blob/main/cpp/tensorrt_llm/batch_manager/kvCacheManager.cpp">TensorRT-LLM KV cache manager</a> · <a href="https://arxiv.org/abs/2401.09670">DistServe / disaggregated prefill+decode</a></p>',
      ),
      pyBlock(
        "Async serving loop",
        pseudocode.asyncServing,
        '<p class="ill-refs">Conceptual host-side shape; production uses device streams/events. <a href="https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/sched/scheduler.py">vLLM scheduler.py</a> · <a href="https://arxiv.org/abs/2401.09670">DistServe</a></p>',
      ),
      '<p><strong>Concurrency note:</strong> the pseudocode is synchronous at the level of one sequence: the next token depends on the previous KV. The serving loop is not a global barrier. The scheduler runs on the host, GPU kernels are submitted asynchronously, and KV transfer can overlap with the tail of prefill. Continuous batching mixes requests at different phases; decode waits only for the blocks it needs.</p>',
      '<p class="ill-refs"><strong>More:</strong> <a href="https://github.com/vllm-project/vllm">vLLM</a> · <a href="https://github.com/sgl-project/sglang">SGLang</a> · <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a> · <a href="https://arxiv.org/abs/2404.14294">DeepSpeed-FastGen</a> · <a href="https://arxiv.org/abs/2401.09670">DistServe</a> · <a href="https://arxiv.org/abs/2403.02310">Sarathi-Serve</a></p>',
    ],
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
  let naiveStep = 0;
  let pageDecoded = 0;
  let pageD = false;
  let dAt = 0;
  let batchIter = 0;
  let batchTimer: number | null = null;
  let pdLong = false;
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
      proseEl.innerHTML = sec.prose.map((p) => (p.trim().startsWith("<") ? p : "<p>" + p + "</p>")).join("");
      styleCodeBlocks(proseEl);
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
      art.appendChild(txt(vX, ry - 14, "v_[t]", { size: 9.5, fill: C.teal }));
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
      /* the residual: a skip path down the left of the step, merged back in at the bottom */
      art.appendChild(
        s("path", {
          d: "M 40 180 L 34 180 L 34 512 L " + (MID - 26) + " 512",
          fill: "none",
          stroke: C.ok,
          "stroke-width": 1.4,
          "stroke-dasharray": "5 4",
          "marker-end": "url(#arw-g)",
        }),
      );
      art.appendChild(txt(44, 192, "residual · the step input, unchanged", { size: 9.5, fill: C.ok }));
      arrow(art, MID, 414, MID, 502, C.purple, "arw-d");
      art.appendChild(s("circle", { cx: MID, cy: 512, r: 9, fill: C.panel2, stroke: C.ok, "stroke-width": 1.4 }));
      art.appendChild(txt(MID, 516, "+", { anchor: "middle", size: 13, fill: C.ok, weight: 700 }));
      art.appendChild(txt(MID + 18, 516, "residual", { size: 9.5, fill: C.ok }));
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
    box(154, 316, "Forward the whole prompt at once", C.accent);
    box(498, 114, "output", C.dim);
    arrow(art, MID, 130, MID, 150, C.dim, "arw-d");
    arrow(art, MID, 474, MID, 494, C.dim, "arw-d");

    svgBtn(art, 20, -36, 150, preTimer !== null ? "❚❚ Pause" : "▶ Prefill", togglePrefill);
    svgBtn(art, 180, -36, 96, "↺ Reset", resetPrefill);

    sqList(art, 36, n, C.accent, "q_[t]", hasDots ? n : 0);
    sqList(art, 68, n, C.purple, "k_[t]", hasKV ? n : 0);
    sqList(art, 100, n, C.teal, "v_[t]", hasKV ? n : 0);

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
    box(154, 316, "decode one token per step", C.teal);
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
    art.appendChild(txt(32, 424, "everything left of the dashed line came from prefill KV cache", { size: 10.5, fill: C.fg }));
    art.appendChild(txt(32, 448, "each step appends one more KV cache", { size: 10.5, fill: C.teal }));

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

  /* ------------------------------ section 5 ----------------------------- */

  const NAIVE_MAX = 16;
  const NAIVE_CAP = 48;
  const NAIVE_REQS = [
    { name: "A", len: 8, color: C.accent },
    { name: "B", len: 3, color: C.teal },
    { name: "C", len: 11, color: C.purple },
  ];
  const NAIVE_WAIT = { name: "D", len: 6, color: C.ok };

  function drawNaive(art: SVGSVGElement): void {
    const admitted = Math.min(naiveStep, NAIVE_REQS.length);
    const dFailed = naiveStep > NAIVE_REQS.length;
    const reserved = admitted * NAIVE_MAX;
    const live = NAIVE_REQS.slice(0, admitted).reduce((sum, r) => sum + r.len, 0);
    const waste = reserved - live;
    const free = NAIVE_CAP - reserved;

    svgBtn(art, 20, -36, 190, "▶ Admit next request", advanceNaive, naiveStep < 4);
    svgBtn(art, 220, -36, 96, "↺ Reset", resetNaive);
    art.appendChild(
      txt(20, 14, "one contiguous buffer per request · each buffer reserves max_len = " + NAIVE_MAX + " slots", { size: 10.5, fill: C.fg }),
    );

    const x0 = 24;
    const cw = 12;
    const pitch = 13;
    const y = 58;
    const h = 34;

    for (let i = 0; i < NAIVE_CAP; i++) {
      const owner = Math.floor(i / NAIVE_MAX);
      const slot = i % NAIVE_MAX;
      const req = NAIVE_REQS[owner];
      const has = owner < admitted;
      const on = has && slot < req.len;
      if (has) {
        art.appendChild(
          s("rect", {
            x: x0 + i * pitch,
            y,
            width: cw,
            height: h,
            rx: 3,
            fill: on ? req.color : "none",
            "fill-opacity": on ? 0.36 : 0,
            stroke: req.color,
            "stroke-opacity": on ? 0.95 : 0.26,
            "stroke-dasharray": on ? "" : "2 2",
          }),
        );
        if (on) {
          art.appendChild(txt(x0 + i * pitch + cw / 2, y + 21, String(slot), { anchor: "middle", size: 7, mono: true, fill: C.fg }));
        }
      } else {
        art.appendChild(
          s("rect", { x: x0 + i * pitch, y, width: cw, height: h, rx: 3, fill: "none", stroke: C.line, "stroke-dasharray": "2 3", opacity: 0.55 }),
        );
      }
    }

    NAIVE_REQS.forEach((r, i) => {
      if (i >= admitted) return;
      const center = x0 + (i * NAIVE_MAX + NAIVE_MAX / 2) * pitch;
      art.appendChild(txt(center, y - 7, r.name + " · " + r.len + " / " + NAIVE_MAX + " used", { anchor: "middle", size: 9.5, fill: r.color, weight: 600 }));
    });

    art.appendChild(
      txt(20, 114, "reserved " + reserved + " / " + NAIVE_CAP + " slots   ·   live " + live + "   ·   idle-but-reserved " + waste + "   ·   free " + free, {
        size: 10.5,
        fill: C.fg,
      }),
    );

    const by = 144;
    art.appendChild(
      s("rect", {
        x: 20,
        y: by,
        width: 680,
        height: 88,
        rx: 10,
        fill: C.panel,
        "fill-opacity": 0.5,
        stroke: dFailed ? C.bad : C.line,
        "stroke-dasharray": dFailed ? "" : "4 4",
      }),
    );
    art.appendChild(txt(32, by + 22, NAIVE_WAIT.name + " · 6-token request", { size: 11, weight: 600, fill: NAIVE_WAIT.color }));
    art.appendChild(txt(32, by + 40, "asks for one contiguous region of " + NAIVE_MAX + " slots", { size: 10, fill: C.dim }));

    for (let j = 0; j < NAIVE_MAX; j++) {
      art.appendChild(
        s("rect", {
          x: 470 + j * 14,
          y: by + 28,
          width: 13,
          height: 26,
          rx: 3,
          fill: dFailed ? C.bad : C.ok,
          "fill-opacity": 0.1,
          stroke: dFailed ? C.bad : C.ok,
          "stroke-opacity": 0.55,
          "stroke-dasharray": "3 2",
        }),
      );
    }

    const msg = dFailed
      ? "✕ rejected · " + waste + " slots are idle, but no " + NAIVE_MAX + "-slot contiguous run is free"
      : naiveStep >= NAIVE_REQS.length
        ? "waiting · every buffer is reserved, although " + waste + " slots inside them are empty"
        : "waiting in the queue";
    art.appendChild(txt(32, by + 66, msg, { size: 10.5, fill: dFailed ? C.bad : C.warn }));

    if (admitted === NAIVE_REQS.length) {
      art.appendChild(
        txt(20, 258, "Only " + live + " of the " + NAIVE_CAP + " reserved slots hold K or V. The rest is fragmentation:", { size: 10.5, fill: C.fg }),
      );
      art.appendChild(txt(20, 276, "reserved tails inside each buffer, plus buffer-wide gaps that cannot be merged for a new request.", { size: 10, fill: C.dim }));
    } else {
      art.appendChild(txt(20, 258, "Each admitted request takes a fixed " + NAIVE_MAX + "-slot region, whether or not it ever reaches that length.", { size: 10.5, fill: C.fg }));
      art.appendChild(txt(20, 276, "The tail of the region is reserved up front and stays empty until the sequence grows into it.", { size: 10, fill: C.dim }));
    }
  }

  /* ------------------------------ section 6 ----------------------------- */

  const PAGE_BLOCK = 4;
  const PAGE_POOL = 12;

  interface PageRow {
    name: string;
    color: string;
    len: number;
    map: number[];
    queued?: boolean;
  }

  function pagedRows(): PageRow[] {
    const rows: PageRow[] = [
      { name: "A", color: C.accent, len: 8 + pageDecoded, map: [5, 1, 10] },
      { name: "B", color: C.teal, len: 3 + pageDecoded, map: [8, 4] },
      { name: "C", color: C.purple, len: 11 + pageDecoded, map: [0, 7, 2, 3] },
    ];
    if (pageD) {
      rows.push({ name: "D", color: C.ok, len: 6 + Math.max(0, pageDecoded - dAt), map: [6, 9, 11] });
    } else {
      rows.push({ name: "D", color: C.ok, len: 0, map: [], queued: true });
    }
    return rows.map((r) => ({ ...r, map: r.map.slice(0, Math.ceil(r.len / PAGE_BLOCK)) }));
  }

  function drawPaged(art: SVGSVGElement): void {
    svgBtn(art, 20, -36, 180, "▶ Decode iteration", stepPaged, pageDecoded < 3);
    svgBtn(art, 210, -36, 130, pageD ? "D admitted" : "＋ Admit D", admitD, !pageD);
    svgBtn(art, 350, -36, 96, "↺ Reset", resetPaged);
    art.appendChild(
      txt(20, 12, "logical sequence · 4-token blocks · L0→#5 means logical block 0 lives in physical block 5", { size: 10.5, fill: C.fg }),
    );

    const rows = pagedRows();
    rows.forEach((r, i) => {
      const ry = 38 + i * 44;
      art.appendChild(txt(24, ry + 20, r.name, { size: 12, weight: 700, fill: r.color }));
      if (r.queued) {
        art.appendChild(txt(48, ry + 19, "queued · 6 tokens · will take 2 blocks", { size: 10, fill: C.dim }));
        return;
      }
      art.appendChild(txt(24, ry + 33, "len " + r.len, { size: 8, fill: C.dim }));
      r.map.forEach((pid, b) => {
        const bx = 48 + b * 84;
        art.appendChild(txt(bx + 2, ry - 3, "L" + b + "→#" + pid, { size: 8.5, mono: true, fill: r.color }));
        for (let j = 0; j < 4; j++) {
          const p = b * 4 + j;
          const used = p < r.len;
          const newest = p === r.len - 1;
          art.appendChild(
            s("rect", {
              x: bx + j * 16,
              y: ry,
              width: 15,
              height: 30,
              rx: 4,
              fill: used ? r.color : "none",
              "fill-opacity": used ? (newest ? 0.6 : 0.3) : 0,
              stroke: used ? (newest ? C.fg : r.color) : C.line,
              "stroke-dasharray": used ? "" : "2 2",
              "stroke-opacity": used ? 0.95 : 0.7,
            }),
          );
          art.appendChild(
            txt(bx + j * 16 + 7.5, ry + 19, used ? String(p) : "·", { anchor: "middle", size: 7.5, mono: true, fill: C.fg, opacity: used ? 1 : 0.35 }),
          );
        }
      });
    });

    const usedBlocks = rows.reduce((sum, r) => sum + r.map.length, 0);
    const live = rows.reduce((sum, r) => sum + r.len, 0);
    const waste = usedBlocks * PAGE_BLOCK - live;
    const lx = 430;
    const ly = 18;
    art.appendChild(s("rect", { x: lx, y: ly, width: 270, height: 174, rx: 10, fill: C.panel, "fill-opacity": 0.5, stroke: C.line }));
    art.appendChild(txt(lx + 12, ly + 21, "block table", { size: 10.5, weight: 700, fill: C.fg }));
    art.appendChild(txt(lx + 12, ly + 42, "one array per sequence,", { size: 9.5, fill: C.dim }));
    art.appendChild(txt(lx + 12, ly + 58, "logical block → physical block", { size: 9.5, fill: C.dim }));
    art.appendChild(txt(lx + 12, ly + 84, "blocks need not be adjacent", { size: 9.5, fill: C.fg }));
    art.appendChild(txt(lx + 12, ly + 112, "now   " + usedBlocks + " blocks · " + (usedBlocks * PAGE_BLOCK) + " slots", { size: 10, mono: true, fill: C.teal }));
    art.appendChild(txt(lx + 12, ly + 130, "waste " + waste + " slots · " + Math.round((live / Math.max(1, usedBlocks * PAGE_BLOCK)) * 100) + "% full", { size: 10, mono: true, fill: C.fg }));
    art.appendChild(txt(lx + 12, ly + 154, "vs " + NAIVE_REQS.length * NAIVE_MAX + " slots reserved", { size: 9.5, fill: C.dim }));

    art.appendChild(txt(20, 232, "physical block pool · " + PAGE_POOL + " blocks × " + PAGE_BLOCK + " slots", { size: 10.5, fill: C.fg }));

    const px0 = 131;
    const bw = 68;
    const gap = 10;
    for (let id = 0; id < PAGE_POOL; id++) {
      const col = id % 6;
      const prow = Math.floor(id / 6);
      const bx = px0 + col * (bw + gap);
      const py = 250 + prow * 60;
      const owner = rows.find((r) => !r.queued && r.map.indexOf(id) >= 0);
      art.appendChild(txt(bx + 2, py - 5, "#" + id, { size: 8, mono: true, fill: owner ? owner.color : C.dim }));
      art.appendChild(
        s("rect", {
          x: bx,
          y: py,
          width: bw,
          height: 38,
          rx: 7,
          fill: owner ? owner.color : "none",
          "fill-opacity": owner ? 0.07 : 0,
          stroke: owner ? owner.color : C.line,
          "stroke-dasharray": owner ? "" : "3 3",
          "stroke-opacity": owner ? 0.6 : 0.8,
        }),
      );
      if (!owner) {
        art.appendChild(txt(bx + bw / 2, py + 23, "free", { anchor: "middle", size: 9, fill: C.dim }));
        continue;
      }
      const logical = owner.map.indexOf(id);
      for (let j = 0; j < 4; j++) {
        const p = logical * 4 + j;
        const used = p < owner.len;
        const newest = p === owner.len - 1;
        art.appendChild(
          s("rect", {
            x: bx + 3 + j * 16,
            y: py + 4,
            width: 15,
            height: 30,
            rx: 3,
            fill: used ? owner.color : "none",
            "fill-opacity": used ? (newest ? 0.65 : 0.32) : 0,
            stroke: used ? (newest ? C.fg : owner.color) : C.line,
            "stroke-dasharray": used ? "" : "2 2",
            "stroke-opacity": used ? 0.9 : 0.55,
          }),
        );
        art.appendChild(
          txt(bx + 3 + j * 16 + 7.5, py + 23, used ? String(p) : "·", { anchor: "middle", size: 7, mono: true, fill: C.fg, opacity: used ? 1 : 0.3 }),
        );
      }
    }

    art.appendChild(txt(20, 386, "Blocks need not be adjacent; the last block of a sequence may be only partly filled.", { size: 10, fill: C.dim }));
    art.appendChild(txt(20, 404, "Real systems also share blocks across requests, with reference counts and copy-on-write on divergence.", { size: 10, fill: C.dim }));
  }

  /* ------------------------------ section 7 ----------------------------- */

  const BATCH_N = 8;
  const BATCH_ROWS = [
    { name: "A", color: C.accent, p: 1, d0: 2, d1: 4 },
    { name: "B", color: C.teal, p: 1, d0: 2, d1: 7 },
    { name: "C", color: C.purple, p: 1, d0: 2, d1: 8 },
    { name: "D", color: C.ok, p: 5, d0: 6, d1: 8 },
  ];

  function batchActive(iter: number): typeof BATCH_ROWS {
    if (iter <= 0) return [];
    return BATCH_ROWS.filter((r) => iter >= r.p && iter <= r.d1);
  }

  function drawBatching(art: SVGSVGElement): void {
    svgBtn(art, 20, -36, 150, batchTimer !== null ? "❚❚ Pause" : "▶ Run", toggleBatch, batchIter < BATCH_N || batchTimer !== null);
    svgBtn(art, 180, -36, 96, "Step ▸", stepBatch, batchIter < BATCH_N);
    svgBtn(art, 286, -36, 96, "↺ Reset", resetBatch);
    art.appendChild(txt(20, 12, "iteration-level schedule · one column per forward pass", { size: 10.5, fill: C.fg }));
    art.appendChild(txt(520, 12, "P = prefill · D = decode · queue = waiting", { size: 9.5, fill: C.dim }));

    const x0 = 100;
    const colW = 72;
    const cellW = 60;
    const cx = (iter: number): number => x0 + (iter - 0.5) * colW;
    const rowY = (i: number): number => 58 + i * 34;

    for (let iter = 1; iter <= BATCH_N; iter++) {
      art.appendChild(txt(cx(iter), 46, String(iter), { anchor: "middle", size: 9.5, mono: true, fill: iter === batchIter ? C.fg : C.dim, weight: iter === batchIter ? 700 : 400 }));
    }
    if (batchIter > 0) {
      art.appendChild(s("rect", { x: cx(batchIter) - cellW / 2 - 5, y: 34, width: cellW + 10, height: 274, rx: 8, fill: C.accent, "fill-opacity": 0.05, stroke: C.accent, "stroke-opacity": 0.25 }));
    }

    BATCH_ROWS.forEach((r, i) => {
      const ry = rowY(i);
      art.appendChild(txt(24, ry + 18, r.name, { size: 11, weight: 700, fill: r.color }));
      for (let iter = 1; iter <= BATCH_N; iter++) {
        const isP = iter === r.p;
        const isD = iter >= r.d0 && iter <= r.d1;
        const isQueue = iter < r.p;
        const isDone = iter > r.d1 && !isQueue;
        const current = iter === batchIter;
        const past = batchIter > 0 && iter <= batchIter;
        const alpha = past ? 1 : 0.22;
        const label = isP ? "P" : isD ? "D" : isQueue ? "queue" : "done";
        const color = isP ? C.accent : isD ? r.color : C.dim;
        art.appendChild(
          s("rect", {
            x: cx(iter) - cellW / 2,
            y: ry,
            width: cellW,
            height: 26,
            rx: 6,
            fill: isQueue || isDone ? "none" : color,
            "fill-opacity": isQueue || isDone ? 0 : current ? 0.34 : 0.2,
            stroke: isQueue ? C.line : isDone ? C.line : color,
            "stroke-opacity": isQueue || isDone ? 0.7 : current ? 1 : 0.8,
            "stroke-dasharray": isQueue || isDone ? "3 3" : "",
            opacity: alpha,
          }),
        );
        art.appendChild(
          txt(cx(iter), ry + 17, label, {
            anchor: "middle",
            size: isQueue ? 7.5 : 9,
            mono: true,
            fill: isP ? C.fg : isD ? C.fg : C.dim,
            opacity: alpha,
            weight: current ? 700 : 400,
          }),
        );
      }
    });

    art.appendChild(txt(24, 218, "batch size", { size: 9.5, fill: C.dim }));
    const base = 280;
    for (let iter = 1; iter <= BATCH_N; iter++) {
      const count = batchActive(iter).length;
      const bh = (count / 3) * 36;
      const on = iter === batchIter;
      art.appendChild(
        s("rect", {
          x: cx(iter) - 16,
          y: base - bh,
          width: 32,
          height: bh,
          rx: 3,
          fill: on ? C.accent : C.accent,
          "fill-opacity": batchIter > 0 && iter <= batchIter ? (on ? 0.8 : 0.35) : 0.12,
        }),
      );
      art.appendChild(txt(cx(iter), base + 12, String(count), { anchor: "middle", size: 8.5, mono: true, fill: on ? C.fg : C.dim }));
    }
    art.appendChild(s("line", { x1: x0, y1: base, x2: x0 + BATCH_N * colW, y2: base, stroke: C.line }));

    art.appendChild(txt(20, 320, "A finishes after iteration 4, so its blocks return to the pool; D prefills in iteration 5.", { size: 10.5, fill: C.fg }));
    art.appendChild(txt(20, 338, "The batch never drains between requests: finished sequences leave and queued ones join at iteration boundaries.", { size: 10, fill: C.dim }));
  }

  /* ------------------------------ section 8 ----------------------------- */

  const SHARE_PREFIX = 10;
  const SHARE_MAX = 14;
  let shareA = SHARE_PREFIX;
  let shareB = SHARE_PREFIX;
  let cowBy: "A" | "B" | null = null;

  interface ShareBlock {
    color: string;
    refs: number;
    start: number;
    end: number;
    cow?: boolean;
  }

  function shareMap(len: number, side: "A" | "B"): number[] {
    const copy = side === "A" ? 7 : 8;
    const map = [0, 1, cowBy === side ? copy : 2];
    if (len > 12) map.push(side === "A" ? 9 : 10);
    return map;
  }

  function sharePoolBlock(id: number): ShareBlock | null {
    if (id === 0) return { color: C.ok, refs: 2, start: 0, end: 4 };
    if (id === 1) return { color: C.ok, refs: 2, start: 4, end: 8 };
    if (id === 2) {
      const color = cowBy === null ? C.ok : cowBy === "A" ? C.teal : C.accent;
      const end = cowBy === null ? Math.min(shareA, shareB) : cowBy === "A" ? shareB : shareA;
      return { color, refs: cowBy === null ? 2 : 1, start: 8, end };
    }
    if (id === 7) return cowBy === "A" ? { color: C.accent, refs: 1, start: 8, end: shareA, cow: true } : null;
    if (id === 8) return cowBy === "B" ? { color: C.teal, refs: 1, start: 8, end: shareB, cow: true } : null;
    if (id === 9) return shareA > 12 ? { color: C.accent, refs: 1, start: 12, end: shareA } : null;
    if (id === 10) return shareB > 12 ? { color: C.teal, refs: 1, start: 12, end: shareB } : null;
    return null;
  }

  function drawSharing(art: SVGSVGElement): void {
    svgBtn(art, 20, -36, 118, "Append A ▸", () => appendShare("A"), shareA < SHARE_MAX);
    svgBtn(art, 148, -36, 118, "Append B ▸", () => appendShare("B"), shareB < SHARE_MAX);
    svgBtn(art, 276, -36, 96, "↺ Reset", resetShare);
    art.appendChild(
      txt(20, 12, "two requests share a " + SHARE_PREFIX + "-token system prompt · a block is shared until someone writes to it", { size: 10.5, fill: C.fg }),
    );

    const rows: Array<{ name: string; color: string; len: number; map: number[] }> = [
      { name: "A", color: C.accent, len: shareA, map: shareMap(shareA, "A") },
      { name: "B", color: C.teal, len: shareB, map: shareMap(shareB, "B") },
    ];
    rows.forEach((r, i) => {
      const ry = 42 + i * 42;
      art.appendChild(txt(24, ry + 18, r.name, { size: 12, weight: 700, fill: r.color }));
      art.appendChild(txt(24, ry + 31, "len " + r.len, { size: 8, fill: C.dim }));
      r.map.forEach((id, b) => {
        const bx = 64 + b * 90;
        const c = sharePoolBlock(id);
        const color = c ? c.color : C.dim;
        art.appendChild(txt(bx + 2, ry - 4, "L" + b + "→#" + id, { size: 8.5, mono: true, fill: color }));
        art.appendChild(s("rect", { x: bx, y: ry, width: 82, height: 26, rx: 6, fill: color, "fill-opacity": 0.12, stroke: color, "stroke-opacity": 0.8 }));
        art.appendChild(txt(bx + 41, ry + 17, "#" + id, { anchor: "middle", size: 10, mono: true, fill: C.fg }));
        if (c && c.refs > 1) art.appendChild(txt(bx + 76, ry + 10, "×" + c.refs, { anchor: "end", size: 8, mono: true, fill: C.ok }));
      });
    });

    art.appendChild(s("rect", { x: 455, y: 24, width: 245, height: 118, rx: 10, fill: C.panel, "fill-opacity": 0.5, stroke: C.line }));
    art.appendChild(txt(467, 45, "reference counts", { size: 10.5, weight: 700, fill: C.fg }));
    art.appendChild(txt(467, 64, "shared block = ×2", { size: 9.5, fill: C.ok }));
    art.appendChild(txt(467, 82, "a write to a shared block", { size: 9.5, fill: C.dim }));
    art.appendChild(txt(467, 98, "copies it before writing", { size: 9.5, fill: C.dim }));
    art.appendChild(txt(467, 116, "only the writer's table changes", { size: 9.5, fill: C.dim }));
    art.appendChild(txt(467, 134, "block #2: ×" + (cowBy === null ? 2 : 1), { size: 10, mono: true, fill: cowBy === null ? C.ok : C.warn }));

    const status =
      cowBy === null
        ? "Both tables point at block #2 for tokens 8–9. Either request can fork it; neither can write in place."
        : cowBy === "A"
          ? "A copied #2 → #7 before writing; B still reads #2. Refcount on #2 is now 1."
          : "B copied #2 → #8 before writing; A still reads #2. Refcount on #2 is now 1.";
    art.appendChild(txt(20, 152, status, { size: 10, fill: cowBy === null ? C.warn : C.ok }));

    art.appendChild(txt(20, 174, "physical pool · blocks with reference counts", { size: 10.5, fill: C.fg }));

    const px0 = 131;
    const bw = 68;
    const gap = 10;
    for (let id = 0; id < 12; id++) {
      const col = id % 6;
      const prow = Math.floor(id / 6);
      const bx = px0 + col * (bw + gap);
      const py = 194 + prow * 60;
      const c = sharePoolBlock(id);
      const label = "#" + id + (c ? " ×" + c.refs : "") + (c && c.cow ? " · COW" : "");
      art.appendChild(txt(bx + 2, py - 5, label, { size: 8, mono: true, fill: c ? c.color : C.dim }));
      art.appendChild(
        s("rect", {
          x: bx,
          y: py,
          width: bw,
          height: 38,
          rx: 7,
          fill: c ? c.color : "none",
          "fill-opacity": c ? 0.07 : 0,
          stroke: c ? c.color : C.line,
          "stroke-dasharray": c ? "" : "3 3",
          "stroke-opacity": c ? 0.6 : 0.8,
        }),
      );
      if (!c) {
        art.appendChild(txt(bx + bw / 2, py + 23, "free", { anchor: "middle", size: 9, fill: C.dim }));
        continue;
      }
      for (let j = 0; j < 4; j++) {
        const p = c.start + j;
        const used = p < c.end;
        const newest = used && p === c.end - 1 && c.end % 4 !== 0;
        art.appendChild(
          s("rect", {
            x: bx + 3 + j * 16,
            y: py + 4,
            width: 15,
            height: 30,
            rx: 3,
            fill: used ? c.color : "none",
            "fill-opacity": used ? (newest ? 0.65 : 0.32) : 0,
            stroke: used ? (newest ? C.fg : c.color) : C.line,
            "stroke-dasharray": used ? "" : "2 2",
            "stroke-opacity": used ? 0.9 : 0.55,
          }),
        );
        art.appendChild(
          txt(bx + 3 + j * 16 + 7.5, py + 23, used ? String(p) : "·", { anchor: "middle", size: 7, mono: true, fill: C.fg, opacity: used ? 1 : 0.3 }),
        );
      }
    }

    art.appendChild(txt(20, 322, "A block is freed only when its reference count reaches zero.", { size: 10, fill: C.dim }));
    art.appendChild(
      txt(
        20,
        340,
        shareA > 12 && shareB > 12
          ? "Private blocks #9/#10 hold the tokens past position 12; the shared prefix still has a refcount of 2."
          : shareA > 12
            ? "A's #9 holds the token past position 12; B's #10 is still free."
            : shareB > 12
              ? "B's #10 holds the token past position 12; A's #9 is still free."
              : "Copy-on-write keeps the shared prefix immutable until a request writes into its partial block.",
        { size: 10, fill: C.dim },
      ),
    );
  }

  /* ------------------------------ section 9 ----------------------------- */

  let radixStep = 0;
  const RADIX_REQS = [
    { id: "R1", matched: 0, computed: 7, step: 1, prompt: "You are a helpful assistant. Answer:" },
    { id: "R2", matched: 5, computed: 1, step: 2, prompt: "You are a helpful assistant. Summarize:" },
    { id: "R3", matched: 7, computed: 2, step: 3, prompt: "You are a helpful assistant. Answer: in French:" },
    { id: "R4", matched: 0, computed: 3, step: 4, prompt: "Translate this sentence:" },
  ];

  interface RadixNode {
    id: string;
    label: string;
    tokens: number;
    x: number;
    y: number;
    w: number;
    h: number;
    parent: string | null;
    createdAt: number;
  }

  const RADIX_NODES: RadixNode[] = [
    { id: "root", label: "root", tokens: 0, x: 20, y: 150, w: 48, h: 28, parent: null, createdAt: 0 },
    { id: "n1", label: "You are a helpful assistant.", tokens: 5, x: 95, y: 150, w: 215, h: 28, parent: "root", createdAt: 1 },
    { id: "n2", label: "Answer:", tokens: 2, x: 345, y: 82, w: 82, h: 28, parent: "n1", createdAt: 1 },
    { id: "n3", label: "Summarize:", tokens: 1, x: 345, y: 200, w: 98, h: 28, parent: "n1", createdAt: 2 },
    { id: "n4", label: "in French:", tokens: 2, x: 455, y: 82, w: 96, h: 28, parent: "n2", createdAt: 3 },
    { id: "n5", label: "Translate this sentence:", tokens: 3, x: 345, y: 260, w: 170, h: 28, parent: "root", createdAt: 4 },
  ];

  function radixNode(id: string): RadixNode {
    return RADIX_NODES.find((n) => n.id === id) as RadixNode;
  }

  function drawRadix(art: SVGSVGElement): void {
    svgBtn(
      art,
      20,
      -36,
      170,
      radixStep < RADIX_REQS.length ? "▶ Send " + RADIX_REQS[radixStep].id : "✓ All sent",
      stepRadix,
      radixStep < RADIX_REQS.length,
    );
    svgBtn(art, 200, -36, 96, "↺ Reset", resetRadix);
    art.appendChild(txt(20, 12, "one tree for every prefix · a node holds the cached KV for its token sequence", { size: 10.5, fill: C.fg }));

    const visible = (nd: RadixNode): boolean => nd.createdAt <= radixStep;
    for (const nd of RADIX_NODES) {
      if (!visible(nd) || nd.parent === null) continue;
      const p = radixNode(nd.parent);
      if (!visible(p)) continue;
      const x1 = p.x + p.w;
      const y1 = p.y + p.h / 2;
      const x2 = nd.x;
      const y2 = nd.y + nd.h / 2;
      const color = nd.createdAt === radixStep && radixStep > 0 ? C.warn : C.ok;
      const d =
        Math.abs(y1 - y2) < 1
          ? "M " + x1 + " " + y1 + " L " + x2 + " " + y2
          : "M " + x1 + " " + y1 + " C " + (x1 + 40) + " " + y1 + ", " + (x2 - 40) + " " + y2 + ", " + x2 + " " + y2;
      art.appendChild(s("path", { d, fill: "none", stroke: color, "stroke-width": 1.3, opacity: 0.75 }));
    }

    for (const nd of RADIX_NODES) {
      if (!visible(nd)) continue;
      const isRoot = nd.id === "root";
      const fresh = !isRoot && nd.createdAt === radixStep && radixStep > 0;
      const color = isRoot ? C.dim : fresh ? C.warn : C.ok;
      art.appendChild(
        s("rect", {
          x: nd.x,
          y: nd.y,
          width: nd.w,
          height: nd.h,
          rx: 7,
          fill: color,
          "fill-opacity": isRoot ? 0.08 : fresh ? 0.2 : 0.1,
          stroke: color,
          "stroke-width": fresh ? 1.5 : 1,
        }),
      );
      art.appendChild(txt(nd.x + nd.w / 2, nd.y + 18, nd.label, { anchor: "middle", size: 9.5, mono: true, fill: isRoot ? C.dim : C.fg, weight: fresh ? 700 : 400 }));
      if (!isRoot) {
        art.appendChild(txt(nd.x + nd.w / 2, nd.y + nd.h + 11, nd.tokens + " tok", { anchor: "middle", size: 8, fill: color }));
      }
    }

    const px = 570;
    const py = 36;
    art.appendChild(s("rect", { x: px, y: py, width: 130, height: 190, rx: 10, fill: C.panel, "fill-opacity": 0.5, stroke: C.line }));
    art.appendChild(txt(px + 10, py + 20, "requests", { size: 10.5, weight: 700, fill: C.fg }));
    art.appendChild(txt(px + 10, py + 34, "matched + new", { size: 8, fill: C.dim }));
    RADIX_REQS.forEach((r, i) => {
      const ry = py + 58 + i * 32;
      const done = radixStep >= r.step;
      const on = radixStep === r.step;
      const color = on ? C.warn : done ? C.ok : C.dim;
      art.appendChild(txt(px + 10, ry, r.id, { size: 10, mono: true, fill: color, weight: on ? 700 : 400 }));
      art.appendChild(txt(px + 38, ry, r.matched + " + " + r.computed, { size: 9, mono: true, fill: color }));
    });

    const completed = RADIX_REQS.filter((r) => r.step <= radixStep);
    const naive = completed.reduce((sum, r) => sum + r.matched + r.computed, 0);
    const unique = RADIX_NODES.filter(visible).reduce((sum, nd) => sum + nd.tokens, 0);
    const max = 25;
    const barX = 220;
    const barW = 430;

    const shown = RADIX_REQS[Math.min(radixStep === 0 ? 0 : radixStep - 1, RADIX_REQS.length - 1)];
    art.appendChild(txt(20, 306, shown.id + " · " + shown.prompt, { size: 9.5, fill: C.dim }));

    art.appendChild(txt(20, 326, "KV computed across the requests so far", { size: 10.5, fill: C.fg }));
    if (naive > 0) {
      art.appendChild(txt(650, 318, Math.round((1 - unique / naive) * 100) + "% less KV", { anchor: "end", size: 10.5, weight: 700, fill: C.ok }));
    }
    art.appendChild(txt(20, 342, "with reuse", { size: 9.5, fill: C.ok }));
    art.appendChild(s("rect", { x: barX, y: 332, width: Math.max(2, (unique / max) * barW), height: 12, rx: 3, fill: C.ok, "fill-opacity": 0.7 }));
    art.appendChild(txt(barX + (unique / max) * barW + 8, 342, unique + " tok", { size: 9, mono: true, fill: C.ok }));
    art.appendChild(txt(20, 366, "without reuse", { size: 9.5, fill: C.dim }));
    art.appendChild(s("rect", { x: barX, y: 356, width: Math.max(2, (naive / max) * barW), height: 12, rx: 3, fill: C.dim, "fill-opacity": 0.35 }));
    art.appendChild(txt(barX + (naive / max) * barW + 8, 366, naive + " tok", { size: 9, mono: true, fill: C.dim }));

    art.appendChild(txt(20, 396, "A node is a token sequence with its KV; two requests share a node while their prefixes agree.", { size: 10, fill: C.dim }));
    art.appendChild(txt(20, 414, "When they diverge the node splits; unused leaves are evicted LRU, while shared ancestors survive.", { size: 10, fill: C.dim }));
  }

  /* ----------------------------- section 10 ----------------------------- */

  const PD_N = 8;
  const PD_ARRIVE = 3;

  function drawDisagg(art: SVGSVGElement): void {
    svgBtn(art, 20, -36, 190, pdLong ? "↺ Reset prompt" : "▶ Send long prompt", togglePd);
    art.appendChild(
      txt(20, 12, pdLong ? "a 256-token prompt arrives at iteration " + PD_ARRIVE : "steady state · only decode is running", { size: 10.5, fill: C.fg }),
    );

    const x0 = 150;
    const colW = 62;
    const cellW = 54;
    const cx = (i: number): number => x0 + (i - 1) * colW + cellW / 2;

    for (let i = 1; i <= PD_N; i++) {
      art.appendChild(txt(cx(i), 44, String(i), { anchor: "middle", size: 9, mono: true, fill: C.dim }));
    }
    art.appendChild(txt(700, 58, "iteration (time) →", { anchor: "end", size: 8.5, fill: C.dim }));

    const cell = (i: number, y: number, label: string, color: string, on = true, dashed = false): void => {
      const x = x0 + (i - 1) * colW + 4;
      art.appendChild(
        s("rect", {
          x,
          y,
          width: cellW,
          height: 24,
          rx: 6,
          fill: on ? color : "none",
          "fill-opacity": on ? 0.18 : 0,
          stroke: color,
          "stroke-opacity": on ? 0.8 : 0.45,
          "stroke-dasharray": dashed ? "3 2" : "",
        }),
      );
      art.appendChild(
        txt(x + cellW / 2, y + 16, label, { anchor: "middle", size: 8.5, mono: true, fill: on ? C.fg : C.dim, opacity: on ? 1 : 0.6 }),
      );
    };

    art.appendChild(s("rect", { x: 12, y: 26, width: 696, height: 140, rx: 10, fill: C.panel, "fill-opacity": 0.42, stroke: C.line }));
    art.appendChild(txt(20, 46, "colocated · unchunked", { size: 10.5, weight: 700, fill: C.fg }));
    art.appendChild(txt(20, 60, "one pool · prefill and decode share a batch", { size: 9, fill: C.dim }));
    art.appendChild(txt(20, 90, "A/B/C decode", { size: 9.5, fill: C.accent }));
    art.appendChild(txt(20, 120, "long prompt", { size: 9.5, fill: C.warn }));
    for (let i = 1; i <= PD_N; i++) {
      const stalled = pdLong && i >= PD_ARRIVE && i <= PD_ARRIVE + 1;
      cell(i, 74, stalled ? "stall" : "D", stalled ? C.bad : C.accent, true, stalled);
      if (!pdLong) {
        cell(i, 104, "—", C.line, false);
      } else if (i < PD_ARRIVE) {
        cell(i, 104, "queue", C.warn, true, true);
      } else if (i <= PD_ARRIVE + 1) {
        cell(i, 104, "P", C.warn);
      } else {
        cell(i, 104, "D", C.ok);
      }
    }
    art.appendChild(
      txt(20, 154, pdLong ? "decode stalls for 2 iterations → ITL spike" : "all three requests decode every iteration", { size: 9.5, fill: pdLong ? C.bad : C.dim }),
    );

    art.appendChild(s("rect", { x: 12, y: 304, width: 696, height: 184, rx: 10, fill: C.panel, "fill-opacity": 0.42, stroke: C.line }));
    art.appendChild(txt(20, 324, "disaggregated", { size: 10.5, weight: 700, fill: C.fg }));
    art.appendChild(txt(20, 338, "separate pools · KV handoff", { size: 9, fill: C.dim }));
    art.appendChild(txt(700, 324, "P:D = 1:4 · example", { anchor: "end", size: 9, fill: C.dim }));
    art.appendChild(txt(20, 374, "prefill P0", { size: 9.5, fill: C.warn }));
    art.appendChild(txt(20, 404, "decode D0", { size: 9.5, fill: C.accent }));
    art.appendChild(txt(20, 434, "long prompt", { size: 9.5, fill: C.ok }));
    for (let i = 1; i <= PD_N; i++) {
      if (!pdLong || i < PD_ARRIVE || i > PD_ARRIVE + 1) {
        cell(i, 360, "—", C.line, false);
      } else {
        cell(i, 360, "P", C.warn);
      }
      cell(i, 390, "D", C.accent);
      if (!pdLong) {
        cell(i, 420, "—", C.line, false);
      } else if (i < PD_ARRIVE) {
        cell(i, 420, "queue", C.warn, true, true);
      } else if (i <= PD_ARRIVE + 1) {
        cell(i, 420, "wait", C.dim, true, true);
      } else {
        cell(i, 420, "D", C.ok);
      }
    }
    if (pdLong) {
      art.appendChild(txt(20, 458, "KV blocks move P0 → D0 before the first decode token", { size: 9.5, fill: C.teal }));
      art.appendChild(txt(20, 474, "decode keeps running if D has capacity · TTFT pays the handoff", { size: 9.5, fill: C.ok }));
    } else {
      art.appendChild(txt(20, 458, "no long prompt · both deployments are in steady state", { size: 9.5, fill: C.dim }));
    }

    art.appendChild(s("rect", { x: 12, y: 176, width: 696, height: 118, rx: 10, fill: C.panel, "fill-opacity": 0.42, stroke: C.line }));
    art.appendChild(txt(20, 196, "colocated + chunked prefill", { size: 10.5, weight: 700, fill: C.fg }));
    art.appendChild(txt(20, 210, "same pool · prompt split into chunks", { size: 9, fill: C.dim }));
    art.appendChild(txt(20, 234, "A/B/C decode", { size: 9.5, fill: C.accent }));
    art.appendChild(txt(20, 264, "long prompt", { size: 9.5, fill: C.warn }));
    for (let i = 1; i <= PD_N; i++) {
      cell(i, 224, "D", C.accent);
      if (!pdLong) {
        cell(i, 254, "—", C.line, false);
      } else if (i < PD_ARRIVE) {
        cell(i, 254, "queue", C.warn, true, true);
      } else if (i <= PD_ARRIVE + 3) {
        cell(i, 254, "P", C.warn);
      } else {
        cell(i, 254, "D", C.ok);
      }
    }
    art.appendChild(
      txt(20, 286, pdLong ? "no decode gaps · the new prompt's first token slips to iteration 7" : "no long prompt · steady state", {
        size: 9.5,
        fill: pdLong ? C.ok : C.dim,
      }),
    );

    art.appendChild(txt(20, 506, "Why split", { size: 10.5, weight: 700, fill: C.fg }));
    art.appendChild(txt(20, 522, "prefill is compute-bound; decode is memory-bound", { size: 9.5, fill: C.dim }));
    art.appendChild(txt(20, 538, "size the two pools independently", { size: 9.5, fill: C.dim }));
    art.appendChild(txt(20, 554, "chunked prefill is the usual baseline", { size: 9.5, fill: C.dim }));
    art.appendChild(txt(360, 506, "What it costs", { size: 10.5, weight: 700, fill: C.fg }));
    art.appendChild(txt(360, 522, "KV transfer adds to TTFT", { size: 9.5, fill: C.dim }));
    art.appendChild(txt(360, 538, "P:D imbalance can still queue decode", { size: 9.5, fill: C.dim }));
    art.appendChild(txt(360, 554, "placement, more queues, more failure modes", { size: 9.5, fill: C.dim }));
    art.appendChild(txt(20, 578, "Chunked prefill avoids the stall without a second pool; it just delays the new prompt's first token.", { size: 9.5, fill: C.dim }));
  }

  function styleCodeBlocks(root: HTMLElement): void {
    const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const keywords = new Set(["def","if","else","elif","while","for","in","return","break","continue","not","and","or","is","lambda","yield","pass","raise","try","except","finally","with","as","import","from","class","async","await"]);
    const builtins = new Set(["len","range","copy","ceil","print","int","float","str","list","dict","set","tuple","bool","deque","dataclass","asyncio","None","True","False","Node"]);
    const types = new Set(["Tensor","Sequence","KVBlock","RadixNode","BlockPool","KVTensor","Protocol","Worker"]);
    const highlight = (line: string): string => {
      const token = /("""[^"]*"""|"[^"]*"|'[^']*')|(#[^\n]*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_]+)/g;
      let out = "";
      let last = "";
      let m: RegExpExecArray | null;
      while ((m = token.exec(line)) !== null) {
        const [raw, str, comment, num, ident, space, op] = m;
        if (str) {
          out += '<span class="tok-str">' + esc(str) + '</span>';
        } else if (comment) {
          out += '<span class="tok-com">' + esc(comment) + '</span>';
        } else if (num) {
          out += '<span class="tok-num">' + esc(num) + '</span>';
        } else if (ident) {
          const cls = keywords.has(ident) ? "tok-kw" : last === "def" ? "tok-fn" : types.has(ident) ? "tok-type" : builtins.has(ident) ? "tok-builtin" : "";
          out += cls ? '<span class="' + cls + '">' + esc(ident) + '</span>' : esc(ident);
          last = ident;
          continue;
        } else if (space) {
          out += space;
          continue;
        } else if (op) {
          out += '<span class="tok-op">' + esc(op) + '</span>';
        }
        last = raw;
      }
      return out || " ";
    };

    root.querySelectorAll("pre").forEach((pre) => {
      const previous = pre.previousElementSibling;
      const title = previous && previous.tagName === "H3" ? (previous.textContent || "pseudocode").split(":")[0] : "pseudocode";
      const lines = (pre.textContent || "").replace(/\n$/, "").split("\n");
      const card = document.createElement("div");
      card.className = "code-card";

      const head = document.createElement("div");
      head.className = "code-head";
      head.innerHTML = '<span class="code-dots"><i></i><i></i><i></i></span><span class="code-title"></span><span class="code-lang">python</span>';
      const titleEl = head.querySelector(".code-title");
      if (titleEl) titleEl.textContent = title;

      const codeEl = document.createElement("code");
      lines.forEach((line, index) => {
        const row = document.createElement("span");
        row.className = "code-line";
        const ln = document.createElement("span");
        ln.className = "ln";
        ln.textContent = String(index + 1);
        const lc = document.createElement("span");
        lc.className = "lc";
        lc.innerHTML = highlight(line);
        row.append(ln, lc);
        codeEl.appendChild(row);
      });

      const newPre = document.createElement("pre");
      newPre.appendChild(codeEl);
      card.append(head, newPre);
      pre.replaceWith(card);
    });
  }

  /* ----------------------------- section 11 ----------------------------- */

  function drawServingLoop(art: SVGSVGElement): void {
    const box = (x: number, y: number, w: number, label: string, sub: string, color: string): void => {
      art.appendChild(s("rect", { x, y, width: w, height: 50, rx: 8, fill: C.panel, "fill-opacity": 0.7, stroke: color, "stroke-opacity": 0.7 }));
      art.appendChild(txt(x + 12, y + 21, label, { size: 10.5, weight: 700, fill: C.fg }));
      art.appendChild(txt(x + 12, y + 38, sub, { size: 8.5, fill: C.dim }));
    };

    art.appendChild(txt(20, 24, "control plane", { size: 9.5, weight: 700, fill: C.accent }));
    box(20, 40, 150, "scheduler", "admit · batch · SLO", C.accent);
    box(190, 40, 160, "radix cache", "prefix match · LRU", C.ok);
    box(370, 40, 150, "block manager", "alloc · refcount", C.purple);
    box(540, 40, 150, "handoff", "KV to decode pool", C.teal);
    arrow(art, 170, 65, 190, 65, C.dim, "arw-d");
    arrow(art, 350, 65, 370, 65, C.dim, "arw-d");
    arrow(art, 520, 65, 540, 65, C.dim, "arw-d");

    art.appendChild(txt(20, 134, "data plane", { size: 9.5, weight: 700, fill: C.teal }));
    box(20, 150, 150, "attention", "gather K/V by table", C.accent);
    box(190, 150, 160, "KV pool", "physical blocks", C.purple);
    box(370, 150, 150, "prefill / decode", "one iteration", C.ok);
    box(540, 150, 150, "append / evict", "write KV · drop LRU", C.teal);
    arrow(art, 170, 175, 190, 175, C.dim, "arw-d");
    arrow(art, 350, 175, 370, 175, C.dim, "arw-d");
    arrow(art, 520, 175, 540, 175, C.dim, "arw-d");

    art.appendChild(
      s("line", { x1: 95, y1: 90, x2: 95, y2: 150, stroke: C.accent, "stroke-width": 1.2, "stroke-dasharray": "3 3", "marker-end": "url(#arw-a)" }),
    );
    art.appendChild(txt(105, 124, "block table / batch", { size: 8.5, fill: C.dim }));
    arrow(art, 690, 220, 20, 220, C.dim, "arw-d");
    art.appendChild(txt(355, 236, "next iteration", { anchor: "middle", size: 8.5, fill: C.dim }));
  }

  const draws = [
    drawLayer,
    drawLoop,
    drawPrefill,
    drawDecode,
    drawNaive,
    drawPaged,
    drawBatching,
    drawSharing,
    drawRadix,
    drawDisagg,
    drawServingLoop,
  ];

  /* -------------------------------- cards -------------------------------- */

  function cardsFor(_i: number): Array<{ k: string; v: string; hint?: string }> {
    return [];
  }

  /* --------------------------- new-demo controls -------------------------- */

  function advanceNaive(): void {
    if (naiveStep < 4) naiveStep += 1;
    render();
  }

  function resetNaive(): void {
    naiveStep = 0;
    render();
  }

  function stepPaged(): void {
    if (pageDecoded < 3) pageDecoded += 1;
    render();
  }

  function admitD(): void {
    if (!pageD) {
      pageD = true;
      dAt = pageDecoded;
    }
    render();
  }

  function resetPaged(): void {
    pageDecoded = 0;
    pageD = false;
    dAt = 0;
    render();
  }

  function stopBatch(): void {
    if (batchTimer !== null) {
      window.clearInterval(batchTimer);
      batchTimer = null;
    }
  }

  function stepBatch(): void {
    stopBatch();
    if (batchIter < BATCH_N) batchIter += 1;
    render();
  }

  function toggleBatch(): void {
    if (batchTimer !== null) {
      stopBatch();
      render();
      return;
    }
    if (batchIter >= BATCH_N) batchIter = 0;
    render();
    batchTimer = window.setInterval(() => {
      if (batchIter < BATCH_N) {
        batchIter += 1;
        render();
      }
      if (batchIter >= BATCH_N) {
        stopBatch();
        render();
      }
    }, 760);
  }

  function resetBatch(): void {
    stopBatch();
    batchIter = 0;
    render();
  }

  function appendShare(side: "A" | "B"): void {
    if (side === "A") {
      if (shareA >= SHARE_MAX) return;
      if (cowBy === null) cowBy = "A";
      shareA += 1;
    } else {
      if (shareB >= SHARE_MAX) return;
      if (cowBy === null) cowBy = "B";
      shareB += 1;
    }
    render();
  }

  function resetShare(): void {
    shareA = SHARE_PREFIX;
    shareB = SHARE_PREFIX;
    cowBy = null;
    render();
  }

  function stepRadix(): void {
    if (radixStep < RADIX_REQS.length) radixStep += 1;
    render();
  }

  function resetRadix(): void {
    radixStep = 0;
    render();
  }

  function togglePd(): void {
    pdLong = !pdLong;
    render();
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
      naiveStep = 0;
      pageDecoded = 0;
      pageD = false;
      dAt = 0;
      batchIter = 0;
      shareA = SHARE_PREFIX;
      shareB = SHARE_PREFIX;
      cowBy = null;
      radixStep = 0;
      pdLong = false;
      stopBatch();
      render();
    },
    destroy() {
      dead = true;
      if (timer !== null) window.clearTimeout(timer);
      if (attnTimer !== null) window.clearInterval(attnTimer);
      if (preTimer !== null) window.clearInterval(preTimer);
      if (decTimer !== null) window.clearInterval(decTimer);
      stopBatch();
    },
  };
};

export default kvCache;
