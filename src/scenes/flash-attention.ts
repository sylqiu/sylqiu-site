/**
 * Illustration: FlashAttention, from the definition to kernels.
 *
 * 1  attention by definition
 * 2  GPU and TPU memory architectures
 * 3  tiling + online softmax, focused on data movement
 * 4  variants: masks, layouts, precision, platforms
 * 5  code for PyTorch, CUDA/CUTLASS, Triton, and TPU/Pallas
 */
import type { SceneFactory } from "../lib/registry.ts";

const NS = "http://www.w3.org/2000/svg";
const VB_W = 720;
let currentArt: SVGSVGElement | null = null;

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
  pink: "#f778ba",
};

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
  if (o.weight !== undefined) t.setAttribute("font-weight", String(o.weight));
  t.textContent = content;
  if (currentArt) currentArt.appendChild(t);
  return t;
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

function box(art: SVGSVGElement, x: number, y: number, w: number, h: number, title: string, sub: string, color: string, dim = false): void {
  art.appendChild(s("rect", { x, y, width: w, height: h, rx: 9, fill: C.panel, "fill-opacity": dim ? 0.3 : 0.7, stroke: color, "stroke-opacity": dim ? 0.3 : 0.7 }));
  art.appendChild(txt(x + 12, y + 22, title, { size: 11, weight: 700, fill: dim ? C.dim : color }));
  art.appendChild(txt(x + 12, y + 41, sub, { size: 8.5, fill: C.dim }));
}

function svgBtn(art: SVGSVGElement, x: number, y: number, w: number, label: string, onClick: () => void, on = true): void {
  const color = on ? C.accent : C.dim;
  const g = s("g", { cursor: on ? "pointer" : "default", class: "ill-svg-btn" });
  g.appendChild(s("rect", { x, y, width: w, height: 26, rx: 13, fill: color, "fill-opacity": on ? 0.12 : 0.06, stroke: color }));
  g.appendChild(txt(x + w / 2, y + 17, label, { anchor: "middle", size: 10.5, fill: color, weight: 600 }));
  if (on) {
    let lastPointer = 0;
    g.setAttribute("role", "button");
    g.setAttribute("tabindex", "0");
    g.addEventListener("pointerdown", (event) => {
      lastPointer = Date.now();
      event.preventDefault();
      onClick();
    });
    g.addEventListener("click", () => {
      if (Date.now() - lastPointer < 700) return;
      onClick();
    });
    g.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick();
      }
    });
  }
  art.appendChild(g);
}

function wrapText(text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (next.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function bar(art: SVGSVGElement, x: number, y: number, w: number, frac: number, color: string, label: string, value: string): void {
  art.appendChild(txt(x, y - 6, label, { size: 9.5, fill: C.dim }));
  art.appendChild(s("rect", { x, y, width: w, height: 12, rx: 6, fill: C.panel2, stroke: C.line }));
  art.appendChild(s("rect", { x, y, width: Math.max(2, w * Math.min(1, frac)), height: 12, rx: 6, fill: color, "fill-opacity": 0.85 }));
  art.appendChild(txt(x + w, y + 26, value, { anchor: "end", size: 9, fill: color, mono: true }));
}

interface Sec {
  id: string;
  title: string;
  blurb: string;
  h: number;
}

const SECS: Sec[] = [
  {
    id: "memory",
    title: "GPU and TPU memory architectures",
    blurb:
      "The CPU orchestrates; the GPU and TPU expose very different memory hierarchies. GPU programs stage tiles explicitly through SMEM and rely on caches; TPU programs hand tiles to the compiler, which schedules CMEM and the MXU. Unified memory removes explicit copies, but not HBM bandwidth.",
    h: 480,
  },
  {
    id: "definition",
    title: "Attention, by definition",
    blurb:
      "Attention is a loop. Take one query Q, pair it with every key K, turn those scores into weights with a softmax, then pair each weight with its value V and sum. Repeat the inner K/V loop for every Q. FlashAttention is the same loop, staged through on-chip memory.",
    h: 510,
  },
  {
    id: "naive",
    title: "Naive attention: the obvious trace",
    blurb:
      "The textbook implementation launches a sequence of kernels and materializes the N×N score and probability matrices in HBM. The trace shows CPU launches, HBM reads/writes, compute-active time, and the memory bill that motivates FlashAttention.",
    h: 560,
  },
  {
    id: "tiling",
    title: "Tiling and online softmax: follow the bytes",
    blurb:
      "Load one Q tile, stream K/V tiles through SRAM, and keep a running max, denominator, and output accumulator. The score and probability tiles are born and die in SRAM. Only Q, K, V, and the final O touch HBM.",
    h: 620,
  },
  {
    id: "variants",
    title: "The variant landscape",
    blurb:
      "The tiled online-softmax loop is the invariant. Variants change the mask, the layout, the precision, or the hardware target: causal and sliding-window attention, GQA/MQA, paged/varlen batching, FP8/FP4, and CUDA, Triton, ROCm, or TPU/Pallas implementations.",
    h: 560,
  },
  {
    id: "code",
    title: "Code across platforms",
    blurb:
      "The same recurrence appears in PyTorch, a CUDA/CUTLASS kernel, a Triton kernel, and a TPU/Pallas kernel. What changes is how tiles are loaded, which matrix-multiply primitive is used, and who schedules the data movement.",
    h: 280,
  },
];

const N = 4;
const D = 3;
const QVALS = Array.from({ length: N }, (_, i) =>
  Array.from({ length: D }, (_, j) => Math.sin((i + 1) * 0.7 + (j + 1) * 0.4)),
);
const KVALS = Array.from({ length: N }, (_, i) =>
  Array.from({ length: D }, (_, j) => Math.cos((i + 1) * 0.5 + (j + 1) * 0.8)),
);
const VALUES = Array.from({ length: N }, (_, i) =>
  Array.from({ length: D }, (_, j) => Math.cos(i * 1.1 + j * 0.7)),
);
const SCORES = QVALS.map((q) =>
  KVALS.map((k) => q.reduce((sum, qv, idx) => sum + qv * k[idx], 0) / Math.sqrt(D)),
);

const CODE: Array<{ label: string; lang: string; lines: string[]; note: string }> = [
  {
    label: "PyTorch",
    lang: "python",
    note: "The dispatch layer picks a fused backend; you do not write the tiling loop.",
    lines: [
      "import torch",
      "import torch.nn.functional as F",
      "",
      "q = torch.randn(2, 8, 4096, 64, device='cuda', dtype=torch.float16)",
      "k = torch.randn_like(q)",
      "v = torch.randn_like(q)",
      "",
      "# causal mask, fused attention kernel",
      "out = F.scaled_dot_product_attention(q, k, v, is_causal=True)",
      "",
      "# FlashAttention / efficient attention is selected by the backend",
    ],
  },
  {
    label: "CUDA / CUTLASS",
    lang: "cuda",
    note: "One CTA owns one Q tile; TMA/WGMMA/TMEM are the Hopper/Blackwell primitives.",
    lines: [
      "// one CTA = one Q tile, BQ rows",
      "extern __shared__ half smem[];",
      "half* Qs = smem;              // BQ x D",
      "half* Ks = Qs + BQ * D;       // BK x D",
      "half* Vs = Ks + BK * D;",
      "",
      "for (int kt = 0; kt < num_k_tiles; ++kt) {",
      "  cp_async(Ks, K + kt * BK * D, ...);",
      "  cp_async(Vs, V + kt * BK * D, ...);",
      "  wgmma(S, Qs, Ks);            // S = Q K^T",
      "  online_softmax(S, m, l);     // row max, exp, rescale",
      "  wgmma(O, P, Vs);             // O += P V",
      "}",
      "store(O, O_ptr + q_tile * BQ * D);",
    ],
  },
  {
    label: "Triton",
    lang: "python",
    note: "Triton expresses the tile loop directly; tl.dot maps to tensor cores.",
    lines: [
      "@triton.jit",
      "def flash_fwd(Q, K, V, O, stride_q, stride_k, stride_v, N, D: tl.constexpr):",
      "    q = tl.load(Q + ...)",
      "    m = tl.full([BQ], -float('inf'), tl.float32)",
      "    l = tl.zeros([BQ], tl.float32)",
      "    acc = tl.zeros([BQ, D], tl.float32)",
      "    for kt in range(0, N, BK):",
      "        k = tl.load(K + kt * stride_k + ...)",
      "        v = tl.load(V + kt * stride_v + ...)",
      "        s = tl.dot(q, tl.trans(k))",
      "        m_new = tl.maximum(m, tl.max(s, 1))",
      "        p = tl.exp(s - m_new[:, None])",
      "        l = l * tl.exp(m - m_new) + tl.sum(p, 1)",
      "        acc = acc * tl.exp(m - m_new)[:, None] + tl.dot(p, v)",
      "        m = m_new",
      "    tl.store(O + ..., acc / l[:, None])",
    ],
  },
  {
    label: "TPU / Pallas",
    lang: "python",
    note: "Pallas makes the tile shapes and DMA explicit; XLA maps them to CMEM and the MXU.",
    lines: [
      "def flash_attention(q, k, v, BQ=128, BK=128):",
      "    m = jnp.full((BQ,), -jnp.inf)",
      "    l = jnp.zeros((BQ,))",
      "    o = jnp.zeros((BQ, D))",
      "    for kt in range(0, N, BK):",
      "        k_tile = pl.load(k, (kt, 0), (BK, D))",
      "        v_tile = pl.load(v, (kt, 0), (BK, D))",
      "        s = pl.dot(q_tile, k_tile.T)",
      "        m_new = jnp.maximum(m, jnp.max(s, axis=1))",
      "        p = jnp.exp(s - m_new[:, None])",
      "        l = l * jnp.exp(m - m_new) + jnp.sum(p, axis=1)",
      "        o = o * jnp.exp(m - m_new)[:, None] + pl.dot(p, v_tile)",
      "        m = m_new",
      "    pl.store(o / l[:, None], ...)",
    ],
  },
];

const VARIANTS: Array<{ title: string; color: string; detail: string }> = [
  { title: "Causal", color: C.accent, detail: "Mask S where key > query. Whole tiles above the diagonal are skipped; diagonal tiles apply the mask before the online update." },
  { title: "Sliding window", color: C.ok, detail: "Only K/V tiles within a window of the query tile are loaded. Traffic scales with the window, not the full sequence." },
  { title: "Block-sparse", color: C.warn, detail: "Load only selected K/V blocks. The inner kernel is unchanged; the scheduler decides which blocks exist." },
  { title: "GQA / MQA", color: C.purple, detail: "Several query heads share one K/V head. Reuse the K/V tile across query heads to cut bandwidth and increase arithmetic intensity." },
  { title: "Varlen / paged", color: C.teal, detail: "Sequences are ragged or stored in blocks. The kernel reads per-sequence offsets and block tables; the tile loop stays the same." },
  { title: "CUDA / CUTLASS", color: C.accent, detail: "CuTe layouts, TMA, WGMMA, and TMEM. This is the lowest-level and usually fastest path on NVIDIA GPUs." },
  { title: "Triton / ROCm", color: C.ok, detail: "Triton expresses tiles in Python; AMD CDNA uses Composable Kernel or Triton. The matrix-core instructions differ." },
  { title: "TPU / Pallas", color: C.purple, detail: "The compiler manages CMEM and DMA; the MXU is a systolic array. Block shapes and masks are explicit in Pallas." },
  { title: "FP8 / FP4", color: C.warn, detail: "Quantize operands with per-block scales. Softmax and the running denominator stay in higher precision to protect accuracy." },
  { title: "v1 → v4", color: C.teal, detail: "The math is fixed; the schedule evolves from IO-aware tiling to work partitioning, Hopper asynchrony, and Blackwell co-design." },
];

const flash: SceneFactory = (host) => {
  let attnStep = 1;
  let attnPlaying = true;
  let activeQ = 0;
  let attnPhaseT = 0;
  let osDone = [false, false, false, false];
  let attnRaf: number | null = null;
  let attnLast = 0;
  let attnSingle = false;
  let arch: "gpu" | "tpu" = "gpu";
  let naiveStep = 0;
  let naivePlaying = false;
  let naiveTimer: number | null = null;
  let tileStep = 0;
  let tilePlaying = false;
  let tileTimer: number | null = null;
  let causal = false;
  let variant = 0;
  let codeTab = 0;

  const root = document.createElement("div");
  root.className = "ill";

  const secEls: Array<{ svg: SVGSVGElement; ctl: HTMLElement; section: HTMLElement }> = [];
  SECS.forEach((sec, secIndex) => {
    const section = document.createElement("section");
    section.className = "ill-sec";
    section.id = "ill-" + sec.id;
    const head = document.createElement("div");
    head.className = "ill-sec-head";
    const h2 = document.createElement("h2");
    h2.textContent = secIndex + 1 + " · " + sec.title;
    const ctl = document.createElement("div");
    ctl.className = "ill-sec-ctl";
    head.append(h2, ctl);
    const blurb = document.createElement("p");
    blurb.className = "ill-sec-blurb";
    blurb.textContent = sec.blurb;
    const fig = document.createElement("div");
    fig.className = "ill-fig";
    const svg = s("svg", {
      viewBox: "0 0 " + VB_W + " " + sec.h,
      role: "img",
      "aria-label": sec.title,
    });
    fig.appendChild(svg);
    section.append(head, blurb, fig);
    root.appendChild(section);
    secEls.push({ svg, ctl, section });
  });
  host.appendChild(root);

  const draws = [drawMemory, drawDefinition, drawNaive, drawTiling, drawVariants, drawCode];

  function render(): void {
    for (let i = 0; i < secEls.length; i++) {
      const svg = secEls[i].svg;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      currentArt = svg;
      draws[i](svg);
      currentArt = null;
    }
  }

  /* ------------------------------ section 1 ------------------------------ */

  function drawMatrix(
    art: SVGSVGElement,
    x: number,
    y: number,
    rows: number,
    cols: number,
    cell: number,
    values: number[][],
    color: string,
    active: boolean,
    showValues: boolean,
  ): void {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const v = values[i]?.[j] ?? 0;
        const m = Math.min(1, Math.abs(v));
        const fill = active ? color : C.panel2;
        art.appendChild(
          s("rect", {
            x: x + j * cell,
            y: y + i * cell,
            width: cell - 2,
            height: cell - 2,
            rx: 2,
            fill,
            "fill-opacity": active ? 0.12 + 0.55 * m : 0.5,
            stroke: active ? color : C.line,
            "stroke-opacity": active ? 0.7 : 0.5,
          }),
        );
        if (showValues) {
          art.appendChild(txt(x + j * cell + 5, y + i * cell + 12, v.toFixed(1), { size: 6.5, mono: true, fill: active ? C.fg : C.dim }));
        }
      }
    }
  }

  function drawDefinition(art: SVGSVGElement): void {
    art.appendChild(marker("arw-def", C.dim));
    const qx = 30;
    const qw = 70;
    const ky = 70;
    const kw = 70;
    const sy = 150;
    const wy = 232;
    const vy = 310;
    const qys = [80, 130, 180, 230];
    const kxs = [180, 275, 370, 465];
    const phase = Math.min(1, Math.max(0, attnPhaseT));
    const ease = 1 - Math.pow(1 - phase, 3);
    const qCenter = { x: qx + qw / 2, y: qys[activeQ] + 15 };
    const oY = qys[activeQ] + 15;
    const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

    txt(20, 24, "one Q  →  every K  →  softmax  →  every V  →  one O", { size: 10, weight: 700, fill: C.fg });
    txt(20, 40, "each Q loops over the K/V tokens; the animation runs the loop for you", { size: 8.5, fill: C.dim });

    txt(qx, 58, "Q loop", { size: 9, weight: 700, fill: C.dim });
    qys.forEach((y, i) => {
      const active = i === activeQ;
      art.appendChild(s("rect", { x: qx, y, width: qw, height: 30, rx: 6, fill: active ? C.accent : C.panel2, "fill-opacity": active ? 0.18 : 0.55, stroke: active ? C.accent : C.line, "stroke-width": active ? 1.6 : 1 }));
      txt(qx + qw / 2, y + 19, "Q", { anchor: "middle", size: 11, weight: 700, fill: active ? C.fg : C.dim, mono: true });
    });
    txt(qx, 272, "one Q at a time", { size: 8.5, fill: C.dim });

    txt(180, 58, "K loop · every key", { size: 9, weight: 700, fill: C.dim });
    txt(180, 296, "V loop · every value", { size: 9, weight: 700, fill: C.dim });

    const chip = (cx: number, cy: number, label: string, color: string, opacity: number, w = 32, h = 20): void => {
      if (opacity <= 0.02) return;
      art.appendChild(s("rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 5, fill: color, "fill-opacity": 0.08 + 0.16 * opacity, stroke: color, "stroke-opacity": 0.6 * opacity }));
      txt(cx, cy + 3.5, label, { anchor: "middle", size: 7.5, fill: color, mono: true });
    };

    kxs.forEach((x, i) => {
      const target = { x: x + kw / 2, y: sy };

      // K and V tokens.
      art.appendChild(s("rect", { x, y: ky, width: kw, height: 30, rx: 6, fill: attnStep >= 1 ? C.ok : C.panel2, "fill-opacity": attnStep >= 1 ? 0.16 : 0.55, stroke: attnStep >= 1 ? C.ok : C.line }));
      txt(x + kw / 2, ky + 19, "K", { anchor: "middle", size: 11, weight: 700, fill: attnStep >= 1 ? C.fg : C.dim, mono: true });
      const vOn = attnStep >= 3;
      art.appendChild(s("rect", { x, y: vy, width: kw, height: 30, rx: 6, fill: vOn ? C.purple : C.panel2, "fill-opacity": vOn ? 0.16 : 0.55, stroke: vOn ? C.purple : C.line }));
      txt(x + kw / 2, vy + 19, "V", { anchor: "middle", size: 11, weight: 700, fill: vOn ? C.fg : C.dim, mono: true });

      // Step 1: all Q/K pairs merge in one pass.
      if (attnStep === 1 && phase < 0.9) {
        const qp = { x: qCenter.x + (target.x - qCenter.x) * ease, y: qCenter.y + (target.y - qCenter.y) * ease };
        const kp = { x: target.x, y: ky + 15 + (target.y - (ky + 15)) * ease };
        chip(qp.x, qp.y, "Q", C.accent, 0.95);
        chip(kp.x, kp.y, "K", C.ok, 0.95);
      }
      if (attnStep === 1 && phase > 0.68) {
        chip(target.x, target.y, "logit", C.warn, 1, 44, 20);
      }

      // Step 2: logits flow into a denominator, then normalize into weights.
      if (attnStep === 2 && phase < 0.52) {
        const mt = clamp01(phase / 0.52);
        const me = 1 - Math.pow(1 - mt, 3);
        chip(target.x + (360 - target.x) * me, sy + (190 - sy) * me, "logit", C.warn, 1, 44, 20);
      }
      if (attnStep >= 2) {
        const grow = attnStep === 2 ? clamp01((phase - 0.42) / 0.58) : 1;
        const widths = [28, 48, 58, 36];
        const bw = Math.max(3, widths[i] * grow);
        art.appendChild(s("rect", { x: target.x - bw / 2, y: wy, width: bw, height: 10, rx: 5, fill: C.ok, "fill-opacity": 0.75, stroke: C.ok, "stroke-opacity": 0.8 }));
      }

      // Step 3: each weight merges with its V, then the weighted values flow into O.
      if (attnStep >= 3) {
        const merge = clamp01(phase / 0.45);
        const me = 1 - Math.pow(1 - merge, 3);
        const vx = x + kw / 2;
        if (merge < 0.98) {
          chip(vx, wy + 10 + (vy + 15 - (wy + 10)) * me, "w", C.ok, 1, 22, 16);
        }
        if (merge > 0.55) {
          chip(vx, vy + 15, "w·V", C.purple, 1, 34, 16);
        }
        const flow = clamp01((phase - 0.45 - i * 0.05) / 0.5);
        if (flow > 0 && flow < 1) {
          chip(vx + (640 - vx) * flow, vy + 15 + (oY - (vy + 15)) * flow, "w·V", C.purple, 1 - flow, 34, 16);
        }
      }
    });

    // Step 2 denominator.
    if (attnStep === 2) {
      const op = clamp01((phase - 0.2) / 0.25);
      chip(360, 190, "Σ", C.teal, op, 44, 24);
      if (op > 0.2) txt(360, 214, "denominator", { anchor: "middle", size: 7.5, fill: C.teal });
      const grow = clamp01((phase - 0.42) / 0.58);
      if (grow > 0) {
        txt(170, wy + 8, "weights", { size: 8.5, fill: C.ok, anchor: "end" });
      }
    } else if (attnStep === 1) {
      txt(170, sy - 5, "logits", { size: 8.5, fill: C.warn, anchor: "end" });
    }

    txt(590, 58, "O loop · one per Q", { size: 9, weight: 700, fill: C.dim });
    qys.forEach((y, i) => {
      const active = i === activeQ;
      const done = osDone[i];
      const lit = done || (active && attnStep >= 3);
      art.appendChild(s("rect", { x: 590, y, width: 100, height: 30, rx: 6, fill: lit ? C.purple : C.panel2, "fill-opacity": lit ? (done ? 0.22 : 0.12 + 0.1 * phase) : 0.55, stroke: lit ? C.purple : C.line, "stroke-width": active ? 1.5 : 1 }));
      txt(640, y + 19, "O", { anchor: "middle", size: 11, weight: 700, fill: lit ? C.fg : C.dim, mono: true });
    });
    txt(590, 260, "one O per Q", { size: 8.5, fill: C.dim });

    const stage = [
      "",
      "1 · Merge the active Q with every K at once; each pair becomes a logit.",
      "2 · Merge the logits into the softmax denominator; normalize them into weights.",
      "3 · Merge each weight with its V; sum the weighted values into O. Then the next Q begins.",
    ][attnStep];
    txt(20, 424, stage, { size: 10, fill: C.fg });

    svgBtn(art, 20, 446, 82, "▶ Step", () => { stepAttn(); });
    svgBtn(art, 110, 446, 92, attnPlaying ? "⏸ Pause" : "▶ Run", () => { toggleAttn(); });
    svgBtn(art, 210, 446, 80, "↺ Reset", () => { resetAttn(); });
    txt(305, 464, "step " + attnStep + " / 3", { size: 9.5, fill: C.dim, mono: true });
    txt(20, 492, "The inner loop is over K/V; the outer loop is over Q.", { size: 9, fill: C.dim });
  }

  function softmaxRows(values: number[][]): number[][] {
    return values.map((row) => {
      const m = Math.max(...row);
      const e = row.map((v) => Math.exp(v - m));
      const sum = e.reduce((a, b) => a + b, 0);
      return e.map((v) => v / sum);
    });
  }

  function outputVals(): number[][] {
    const p = softmaxRows(SCORES);
    return p.map((row) => {
      const out: number[] = [];
      for (let j = 0; j < D; j++) {
        let sum = 0;
        for (let k = 0; k < N; k++) sum += row[k] * VALUES[k][j];
        out.push(sum);
      }
      return out;
    });
  }

  function renderDefinition(): void {
    const svg = secEls[1].svg;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    currentArt = svg;
    drawDefinition(svg);
    currentArt = null;
  }

  function stopAttn(): void {
    attnPlaying = false;
    if (attnRaf !== null) {
      window.cancelAnimationFrame(attnRaf);
      attnRaf = null;
    }
  }

  function startAttn(single = false): void {
    if (attnRaf !== null) {
      window.cancelAnimationFrame(attnRaf);
      attnRaf = null;
    }
    attnPlaying = true;
    attnSingle = single;
    attnLast = performance.now();
    renderDefinition();
    attnRaf = window.requestAnimationFrame(attnTick);
  }

  function attnTick(now: number): void {
    attnRaf = null;
    if (!attnPlaying) return;
    const dt = Math.min(0.05, (now - attnLast) / 1000);
    attnLast = now;
    const duration = attnStep === 1 ? 0.9 : attnStep === 2 ? 0.85 : 1.05;
    attnPhaseT += dt / duration;

    if (attnPhaseT >= 1) {
      attnPhaseT = 0;
      if (attnStep === 1) {
        if (attnSingle) {
          attnPhaseT = 1;
          stopAttn();
          renderDefinition();
          return;
        }
        attnStep = 2;
      } else if (attnStep === 2) {
        if (attnSingle) {
          attnPhaseT = 1;
          stopAttn();
          renderDefinition();
          return;
        }
        attnStep = 3;
      } else {
        osDone[activeQ] = true;
        if (attnSingle) {
          attnPhaseT = 1;
          stopAttn();
          renderDefinition();
          return;
        }
        activeQ = (activeQ + 1) % 4;
        attnStep = 1;
      }
    }

    renderDefinition();
    if (attnPlaying) attnRaf = window.requestAnimationFrame(attnTick);
  }

  function stepAttn(): void {
    stopAttn();
    if (attnStep === 1) {
      attnStep = 2;
    } else if (attnStep === 2) {
      attnStep = 3;
    } else {
      activeQ = (activeQ + 1) % 4;
      attnStep = 1;
    }
    attnPhaseT = 0;
    startAttn(true);
  }

  function toggleAttn(): void {
    if (attnPlaying) {
      stopAttn();
      renderDefinition();
      return;
    }
    startAttn(false);
  }

  function resetAttn(): void {
    stopAttn();
    activeQ = 0;
    attnStep = 1;
    attnPhaseT = 0;
    osDone = [false, false, false, false];
    renderDefinition();
  }

  /* ------------------------------ section 2 ------------------------------ */

  function drawMemory(art: SVGSVGElement): void {
    art.appendChild(marker("arw-mem", C.dim));
    const gpuOn = arch === "gpu";
    const tpuOn = arch === "tpu";

    const memBox = (x: number, y: number, w: number, h: number, title: string, sub: string, color: string, dim = false): void => {
      art.appendChild(s("rect", { x, y, width: w, height: h, rx: 7, fill: C.panel, "fill-opacity": dim ? 0.3 : 0.7, stroke: color, "stroke-opacity": dim ? 0.28 : 0.7 }));
      txt(x + 12, y + 16, title, { size: 10, weight: 700, fill: dim ? C.dim : color });
      txt(x + 12, y + h - 8, sub, { size: 8, fill: C.dim });
    };
    const speedBar = (x: number, y: number, w: number, frac: number, color: string, label: string, value: string): void => {
      txt(x, y + 8, label, { size: 8.5, fill: C.dim });
      art.appendChild(s("rect", { x, y: y + 12, width: w, height: 9, rx: 4.5, fill: C.panel2, stroke: C.line }));
      art.appendChild(s("rect", { x, y: y + 12, width: Math.max(2, w * Math.min(1, frac)), height: 9, rx: 4.5, fill: color, "fill-opacity": 0.85 }));
      txt(x + w, y + 8, value, { anchor: "end", size: 8.5, fill: color, mono: true });
    };

    // Host control plane.
    art.appendChild(s("rect", { x: 20, y: 20, width: 680, height: 52, rx: 9, fill: C.panel, "fill-opacity": 0.55, stroke: C.line }));
    txt(34, 40, "CPU host", { size: 11, weight: 700, fill: C.fg });
    txt(34, 56, "launches kernels · schedules DMA · owns page tables / coherence", { size: 8.5, fill: C.dim });
    txt(688, 40, "control plane", { size: 8, fill: C.dim, anchor: "end" });
    arrow(art, 185, 72, 185, 126, C.dim, "arw-mem");
    arrow(art, 535, 72, 535, 126, C.dim, "arw-mem");
    txt(195, 94, "launch / DMA", { size: 8, fill: C.dim });
    txt(545, 94, "launch / DMA", { size: 8, fill: C.dim });

    // GPU hierarchy.
    art.appendChild(s("rect", { x: 20, y: 100, width: 330, height: 240, rx: 10, fill: C.panel, "fill-opacity": gpuOn ? 0.4 : 0.18, stroke: C.accent, "stroke-opacity": gpuOn ? 0.55 : 0.2 }));
    txt(34, 118, "GPU", { size: 13, weight: 700, fill: gpuOn ? C.accent : C.dim });
    txt(335, 118, gpuOn ? "selected" : "dimmed", { size: 7.5, fill: gpuOn ? C.accent : C.dim, anchor: "end" });
    memBox(35, 128, 300, 42, "HBM3", "80 GB · 3.35 TB/s", C.accent, !gpuOn);
    memBox(95, 188, 180, 32, "L2 cache", "50 MB · shared by SMs", C.teal, !gpuOn);
    art.appendChild(s("rect", { x: 35, y: 238, width: 300, height: 86, rx: 8, fill: C.panel, "fill-opacity": gpuOn ? 0.55 : 0.25, stroke: C.accent, "stroke-opacity": gpuOn ? 0.5 : 0.2 }));
    txt(47, 256, "SM · streaming multiprocessor", { size: 9, weight: 700, fill: C.dim });
    txt(47, 274, "SMEM 228 KB · tensor cores", { size: 8.5, fill: C.fg, mono: true });
    txt(47, 292, "explicit tiling", { size: 8.5, fill: C.fg });
    txt(47, 308, "caches help; tiling decides", { size: 8.5, fill: C.warn });
    arrow(art, 185, 170, 185, 188, C.dim, "arw-mem");
    arrow(art, 185, 220, 185, 238, C.dim, "arw-mem");
    arrow(art, 210, 238, 210, 220, C.dim, "arw-mem");
    arrow(art, 210, 188, 210, 170, C.dim, "arw-mem");
    txt(220, 182, "3.35 TB/s", { size: 8, fill: C.accent, mono: true });
    txt(220, 232, "on-chip", { size: 8, fill: C.dim });

    // TPU hierarchy.
    art.appendChild(s("rect", { x: 370, y: 100, width: 330, height: 240, rx: 10, fill: C.panel, "fill-opacity": tpuOn ? 0.4 : 0.18, stroke: C.purple, "stroke-opacity": tpuOn ? 0.55 : 0.2 }));
    txt(384, 118, "TPU", { size: 13, weight: 700, fill: tpuOn ? C.purple : C.dim });
    txt(685, 118, tpuOn ? "selected" : "dimmed", { size: 7.5, fill: tpuOn ? C.purple : C.dim, anchor: "end" });
    memBox(385, 128, 300, 42, "HBM", "95 GB · 2.76 TB/s", C.purple, !tpuOn);
    memBox(445, 188, 180, 32, "CMEM", "compiler-managed SRAM", C.teal, !tpuOn);
    art.appendChild(s("rect", { x: 385, y: 238, width: 300, height: 86, rx: 8, fill: C.panel, "fill-opacity": tpuOn ? 0.55 : 0.25, stroke: C.purple, "stroke-opacity": tpuOn ? 0.5 : 0.2 }));
    txt(397, 256, "MXU + vector unit", { size: 9, weight: 700, fill: C.dim });
    txt(397, 274, "systolic array · softmax", { size: 8.5, fill: C.purple, mono: true });
    txt(397, 292, "compiler-scheduled DMA", { size: 8.5, fill: C.fg });
    txt(397, 308, "block shapes, not caches", { size: 8.5, fill: C.warn });
    arrow(art, 535, 170, 535, 188, C.dim, "arw-mem");
    arrow(art, 535, 220, 535, 238, C.dim, "arw-mem");
    arrow(art, 560, 238, 560, 220, C.dim, "arw-mem");
    arrow(art, 560, 188, 560, 170, C.dim, "arw-mem");
    txt(570, 182, "2.76 TB/s", { size: 8, fill: C.purple, mono: true });
    txt(570, 232, "on-chip", { size: 8, fill: C.dim });

    // Unified memory case.
    art.appendChild(s("rect", { x: 20, y: 356, width: 680, height: 70, rx: 9, fill: C.panel, "fill-opacity": 0.5, stroke: C.teal, "stroke-opacity": 0.45 }));
    txt(34, 376, "Unified memory · the case", { size: 10.5, weight: 700, fill: C.teal });
    txt(34, 394, "CPU and accelerator share one address space; no explicit H2D/D2H copies", { size: 8.5, fill: C.fg });
    txt(34, 410, "still HBM-bound; coherence and capacity are the trade-offs", { size: 8.5, fill: C.warn });

    svgBtn(art, 20, 440, 90, gpuOn ? "✓ GPU" : "GPU", () => { arch = "gpu"; render(); });
    svgBtn(art, 118, 440, 90, tpuOn ? "✓ TPU" : "TPU", () => { arch = "tpu"; render(); });
    txt(220, 458, "toggle target: architectures and scheduling differ", { size: 8.5, fill: C.dim });
  }

  /* ------------------------------ section 3 ------------------------------ */

  function stopNaive(): void {
    if (naiveTimer !== null) {
      window.clearTimeout(naiveTimer);
      naiveTimer = null;
    }
    naivePlaying = false;
  }

  function toggleNaive(): void {
    if (naivePlaying) {
      stopNaive();
      render();
      return;
    }
    if (naiveStep >= 4) naiveStep = 0;
    naivePlaying = true;
    const tick = (): void => {
      if (!naivePlaying) return;
      if (naiveStep >= 4) {
        naivePlaying = false;
        naiveTimer = null;
        render();
        return;
      }
      naiveStep += 1;
      render();
      naiveTimer = window.setTimeout(tick, 950);
    };
    naiveTimer = window.setTimeout(tick, 500);
    render();
  }

  function stepNaive(): void {
    stopNaive();
    naiveStep = naiveStep >= 4 ? 0 : naiveStep + 1;
    render();
  }

  function resetNaive(): void {
    stopNaive();
    naiveStep = 0;
    render();
  }

  function drawNaive(art: SVGSVGElement): void {
    const T = {
      total: 61.3,
      steps: [
        { label: "QKᵀ", cpu: [0.46, 6.06], gpu: [5.86, 15.61], kind: "tensor", kernel: "turing_fp16_s1688gemm", read: "Q, K", write: "S", readBytes: "32 MiB", writeBytes: "1 GiB", color: C.ok },
        { label: "scale/mask", cpu: [6.16, 6.34], gpu: [15.61, 24.38], kind: "vector", kernel: "vectorized_elementwise", read: "S", write: "S", readBytes: "1 GiB", writeBytes: "1 GiB", color: C.warn },
        { label: "softmax", cpu: [6.36, 10.33], gpu: [24.38, 54.11], kind: "vector", kernel: "cunn_SoftMaxForward", read: "S", write: "P", readBytes: "1 GiB", writeBytes: "1 GiB", color: C.warn },
        { label: "PV", cpu: [10.35, 10.60], gpu: [54.11, 61.25], kind: "tensor", kernel: "turing_fp16_s1688gemm", read: "P, V", write: "O", readBytes: "1.01 GiB", writeBytes: "16 MiB", color: C.ok },
      ],
    };
    const x0 = 150;
    const x1 = 680;
    const X = (ms: number): number => x0 + (ms / T.total) * (x1 - x0);
    const W = (ms: number): number => (ms / T.total) * (x1 - x0);
    const active = (i: number): boolean => naiveStep === i + 1;
    const done = (i: number): boolean => naiveStep > i + 1;
    const band = (x: number, y: number, w: number, color: string, label: string, on: boolean, h = 18): void => {
      art.appendChild(s("rect", { x, y, width: Math.max(2, w), height: h, rx: 3, fill: color, "fill-opacity": on ? 0.28 : 0.07, stroke: color, "stroke-opacity": on ? 0.95 : 0.22 }));
      if (w > 36) txt(x + 5, y + h - 5, label, { size: 6.5, fill: on ? color : C.dim, mono: true });
    };

    txt(20, 24, "naive attention · real trace", { size: 11, weight: 700, fill: C.fg });
    txt(20, 42, "Tesla T4 · torch 2.11.0+cu130 · B=4 H=8 N=4096 D=64 · FP16", { size: 8, fill: C.dim });
    txt(688, 24, "wall 61.3 ms · GPU active 55.4 ms", { size: 8, fill: C.dim, anchor: "end" });
    txt(688, 42, "peak 2.22 GB", { size: 8, fill: C.warn, anchor: "end" });

    txt(20, 70, "CPU", { size: 8.5, weight: 700, fill: C.dim });
    T.steps.forEach((st, i) => {
      const on = active(i) || done(i);
      band(X(st.cpu[0]), 56, W(st.cpu[1] - st.cpu[0]), C.dim, st.label, on, 14);
    });
    art.appendChild(s("rect", { x: X(10.68), y: 74, width: W(61.27 - 10.68), height: 6, rx: 3, fill: C.panel2, stroke: C.line }));
    txt(X(10.68) + 4, 90, "CPU waits on GPU", { size: 7, fill: C.dim });

    txt(20, 116, "GPU stream", { size: 8.5, weight: 700, fill: C.dim });
    T.steps.forEach((st, i) => {
      const on = active(i) || done(i);
      band(X(st.gpu[0]), 102, W(st.gpu[1] - st.gpu[0]), st.color, st.label + " " + (st.gpu[1] - st.gpu[0]).toFixed(1) + " ms", on);
    });
    txt(X(0) + 4, 134, "idle / launch", { size: 6.5, fill: C.bad });

    txt(20, 160, "HBM traffic", { size: 8.5, weight: 700, fill: C.dim });
    T.steps.forEach((st, i) => {
      const on = active(i) || done(i);
      const x = X(st.gpu[0]);
      const w = W(st.gpu[1] - st.gpu[0]);
      band(x, 146, w, st.kind === "tensor" ? C.ok : C.warn, "read " + st.read, on, 10);
      band(x, 158, w, C.bad, "write " + st.write, on, 10);
    });

    txt(20, 190, "compute active", { size: 8.5, weight: 700, fill: C.dim });
    T.steps.forEach((st, i) => {
      const on = active(i) || done(i);
      band(X(st.gpu[0]), 176, W(st.gpu[1] - st.gpu[0]), st.kind === "tensor" ? C.ok : C.warn, st.kind, on, 10);
    });

    txt(20, 224, "HBM buffers", { size: 8.5, weight: 700, fill: C.dim });
    const alloc = (x: number, w: number, label: string, on: boolean, color: string, sub: string): void => {
      art.appendChild(s("rect", { x, y: 234, width: w, height: 26, rx: 5, fill: on ? color : C.panel2, "fill-opacity": on ? 0.18 : 0.45, stroke: on ? color : C.line }));
      txt(x + 6, 251, label, { size: 8.5, fill: on ? C.fg : C.dim, mono: true });
      txt(x + w - 6, 251, sub, { size: 6.5, fill: on ? color : C.dim, anchor: "end", mono: true });
    };
    alloc(150, 42, "Q", true, C.accent, "16 MiB");
    alloc(198, 42, "K", true, C.accent, "16 MiB");
    alloc(246, 42, "V", true, C.accent, "16 MiB");
    alloc(294, 88, "S", naiveStep >= 1, C.bad, "1 GiB");
    alloc(388, 88, "P", naiveStep >= 3, C.purple, "1 GiB");
    alloc(482, 44, "O", naiveStep >= 4, C.ok, "16 MiB");
    txt(540, 251, naiveStep >= 3 ? "peak: S + P" : "S/P not yet live", { size: 7.5, fill: C.bad });

    const cur = naiveStep > 0 ? T.steps[naiveStep - 1] : null;
    art.appendChild(s("rect", { x: 20, y: 280, width: 680, height: 96, rx: 9, fill: C.panel, "fill-opacity": 0.55, stroke: cur ? cur.color : C.line, "stroke-opacity": 0.55 }));
    if (!cur) {
      txt(34, 302, "baseline · Q/K/V resident in HBM", { size: 10, weight: 700, fill: C.accent });
      txt(34, 320, "Press Play or Step to advance through the captured trace.", { size: 8.5, fill: C.fg });
      txt(34, 338, "CPU launches; GPU work is serialized on one stream.", { size: 8.5, fill: C.dim });
    } else {
      txt(34, 302, cur.label + " · " + (cur.gpu[1] - cur.gpu[0]).toFixed(2) + " ms GPU", { size: 10.5, weight: 700, fill: cur.color });
      txt(34, 320, "kernel: " + cur.kernel, { size: 8, fill: C.fg, mono: true });
      txt(34, 338, "HBM: read " + cur.readBytes + " · write " + cur.writeBytes, { size: 8.5, fill: C.fg });
      txt(34, 356, "buffers: " + (naiveStep >= 3 ? "S and P live" : naiveStep >= 1 ? "S live" : "Q/K/V live"), { size: 8.5, fill: C.warn });
    }
    txt(20, 398, "CPU enqueues all four kernels by 10.6 ms; the GPU spends 55.4 ms executing.", { size: 8, fill: C.dim });
    txt(20, 414, "HBM bytes are derived from tensor shapes; timing comes from the captured T4 profile.", { size: 8, fill: C.dim });

    const playhead = naiveStep > 0 ? X(T.steps[naiveStep - 1].gpu[1]) : X(0);
    art.appendChild(s("line", { x1: playhead, y1: 50, x2: playhead, y2: 270, stroke: C.accent, "stroke-opacity": 0.7, "stroke-dasharray": "3 3" }));

    svgBtn(art, 20, 500, 100, naivePlaying ? "⏸ Pause" : "▶ Play", () => { toggleNaive(); });
    svgBtn(art, 130, 500, 90, "▶ Step", () => { stepNaive(); });
    svgBtn(art, 230, 500, 90, "↺ Reset", () => { resetNaive(); });
    txt(340, 518, "step " + naiveStep + " / 4", { size: 9.5, fill: C.dim, mono: true });
  }

  function tileStats(kMax: number): { m: number; l: number; o: number } {
    let m = -Infinity;
    let l = 0;
    let o = 0;
    for (let j = 0; j <= kMax; j++) {
      if (causal && j > 0) continue;
      const score = SCORES[0][j];
      const mNew = Math.max(m, score);
      const scale = m === -Infinity ? 0 : Math.exp(m - mNew);
      const p = Math.exp(score - mNew);
      l = l * scale + p;
      o = o * scale + p * VALUES[j][0];
      m = mNew;
    }
    return { m, l, o };
  }

  function stopTile(): void {
    if (tileTimer !== null) {
      window.clearTimeout(tileTimer);
      tileTimer = null;
    }
    tilePlaying = false;
  }

  function toggleTile(): void {
    if (tilePlaying) {
      stopTile();
      render();
      return;
    }
    if (tileStep >= 3) tileStep = 0;
    tilePlaying = true;
    const tick = (): void => {
      if (!tilePlaying) return;
      if (tileStep >= 3) {
        tilePlaying = false;
        tileTimer = null;
        render();
        return;
      }
      tileStep += 1;
      render();
      tileTimer = window.setTimeout(tick, 850);
    };
    tileTimer = window.setTimeout(tick, 420);
    render();
  }

  function drawTiling(art: SVGSVGElement): void {
    art.appendChild(marker("arw-tile", C.dim));
    const kMax = tileStep >= 2 ? 1 : 0;
    const stats = tileStats(kMax);

    // HBM
    art.appendChild(s("rect", { x: 20, y: 44, width: 180, height: 430, rx: 10, fill: C.panel, "fill-opacity": 0.55, stroke: C.bad, "stroke-opacity": 0.6 }));
    txt(34, 68, "HBM", { size: 11, weight: 700, fill: C.bad });
    txt(34, 84, "Q, K, V, O", { size: 8.5, fill: C.dim, mono: true });
    const blocks = [
      { y: 108, label: "Q tile", on: tileStep >= 1, color: C.accent },
      { y: 162, label: "K0", on: tileStep >= 1, color: C.ok },
      { y: 206, label: "V0", on: tileStep >= 1, color: C.ok },
      { y: 250, label: "K1", on: tileStep >= 2, color: C.ok },
      { y: 294, label: "V1", on: tileStep >= 2, color: C.ok },
      { y: 338, label: "O tile", on: tileStep >= 3, color: C.purple },
    ];
    blocks.forEach((b) => {
      art.appendChild(s("rect", { x: 34, y: b.y, width: 110, height: 30, rx: 6, fill: b.on ? b.color : C.panel2, "fill-opacity": b.on ? 0.2 : 0.5, stroke: b.on ? b.color : C.line }));
      txt(44, b.y + 19, b.label, { size: 9, fill: b.on ? C.fg : C.dim, mono: true });
    });
    txt(34, 394, "streamed once", { size: 8.5, fill: C.dim });
    txt(34, 410, "S/P never written here", { size: 8.5, fill: C.ok });

    // SRAM
    art.appendChild(s("rect", { x: 240, y: 44, width: 260, height: 430, rx: 10, fill: C.panel, "fill-opacity": 0.6, stroke: C.accent, "stroke-opacity": 0.6 }));
    txt(254, 68, "SRAM / on-chip", { size: 11, weight: 700, fill: C.accent });
    txt(254, 84, "Q tile + K/V tile + O accumulator", { size: 8.5, fill: C.dim });
    art.appendChild(s("rect", { x: 254, y: 100, width: 100, height: 34, rx: 5, fill: C.accent, "fill-opacity": 0.16, stroke: C.accent }));
    txt(264, 121, "Q tile 4×64", { size: 8.5, fill: C.fg, mono: true });
    art.appendChild(s("rect", { x: 366, y: 100, width: 120, height: 34, rx: 5, fill: C.ok, "fill-opacity": 0.14, stroke: C.ok }));
    txt(376, 121, "K/V tile " + (tileStep >= 2 ? "1" : "0"), { size: 8.5, fill: C.fg, mono: true });

    // S/P tile heatmap
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const on = tileStep >= 1 && (j < 4);
        const masked = causal && j > 0;
        const v = SCORES[i][j];
        art.appendChild(s("rect", { x: 254 + j * 26, y: 150 + i * 26, width: 24, height: 24, rx: 3, fill: masked ? C.line : on ? C.bad : C.panel2, "fill-opacity": masked ? 0.5 : on ? 0.25 : 0.6, stroke: masked ? C.line : on ? C.bad : C.line }));
        if (on && !masked) txt(258 + j * 26, 167 + i * 26, v.toFixed(1), { size: 6.5, fill: C.fg, mono: true });
      }
    }
    txt(254, 278, "S tile 4×4", { size: 8.5, fill: C.bad, mono: true });
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const masked = causal && j > 0;
        const p = masked ? 0 : Math.exp(SCORES[i][j] - Math.max(...SCORES[i]));
        art.appendChild(s("rect", { x: 366 + j * 26, y: 150 + i * 26, width: 24, height: 24, rx: 3, fill: masked ? C.line : tileStep >= 1 ? C.ok : C.panel2, "fill-opacity": masked ? 0.5 : tileStep >= 1 ? 0.16 + 0.5 * Math.min(1, p) : 0.6, stroke: masked ? C.line : tileStep >= 1 ? C.ok : C.line }));
      }
    }
    txt(366, 278, "P tile (softmax)", { size: 8.5, fill: C.ok, mono: true });

    art.appendChild(s("rect", { x: 254, y: 298, width: 232, height: 66, rx: 8, fill: C.panel2, "fill-opacity": 0.6, stroke: C.line }));
    txt(266, 318, "running state", { size: 8.5, weight: 700, fill: C.dim });
    txt(266, 336, "m = " + (stats.m === -Infinity ? "−∞" : stats.m.toFixed(2)) + "   ℓ = " + stats.l.toFixed(2), { size: 9, fill: C.accent, mono: true });
    txt(266, 354, "O = " + (stats.l > 0 ? (stats.o / stats.l).toFixed(2) : "—"), { size: 9, fill: C.purple, mono: true });

    // compute
    art.appendChild(s("rect", { x: 530, y: 44, width: 170, height: 180, rx: 10, fill: C.panel, "fill-opacity": 0.55, stroke: C.purple, "stroke-opacity": 0.6 }));
    txt(544, 68, "compute", { size: 11, weight: 700, fill: C.purple });
    txt(544, 92, "S = Q Kᵀ", { size: 9.5, fill: C.fg, mono: true });
    txt(544, 112, "online softmax", { size: 9.5, fill: C.fg, mono: true });
    txt(544, 132, "O += P V", { size: 9.5, fill: C.fg, mono: true });
    txt(544, 160, "tensor cores", { size: 8.5, fill: C.dim });
    txt(544, 176, "exp / rescale", { size: 8.5, fill: C.dim });
    txt(544, 200, "no N×N write", { size: 8.5, fill: C.ok });

    arrow(art, 150, 123, 240, 123, C.accent, "arw-tile");
    arrow(art, 150, 177, 240, 160, C.ok, "arw-tile");
    arrow(art, 150, 265, 240, 190, C.ok, "arw-tile");
    arrow(art, 500, 190, 530, 190, C.purple, "arw-tile");
    arrow(art, 530, 120, 500, 120, C.purple, "arw-tile");

    // transfer ledger
    art.appendChild(s("rect", { x: 20, y: 490, width: 680, height: 70, rx: 9, fill: C.panel, "fill-opacity": 0.55, stroke: C.line }));
    const ledger = tileStep === 0
      ? "waiting: load Q tile, then K/V tiles"
      : tileStep === 1
        ? "load Q0 + K0 + V0 → SRAM · compute S0, update m/ℓ/O"
        : tileStep === 2
          ? "load K1 + V1 → SRAM · update m/ℓ/O · discard K/V tile"
          : "write O0 → HBM · next Q tile repeats the loop";
    txt(34, 512, "transfer ledger", { size: 9, weight: 700, fill: C.dim });
    txt(34, 532, ledger, { size: 9.5, fill: C.fg, mono: true });
    txt(34, 550, "S/P HBM writes: 0 B · Q/O tile: 512 B · K/V pair: 1 KB", { size: 8.5, fill: C.ok, mono: true });

    svgBtn(art, 20, 574, 82, "▶ Step", () => { stopTile(); if (tileStep < 3) tileStep += 1; render(); });
    svgBtn(art, 110, 574, 92, tilePlaying ? "⏸ Pause" : "▶ Run", () => { toggleTile(); });
    svgBtn(art, 210, 574, 80, "↺ Reset", () => { stopTile(); tileStep = 0; render(); });
    svgBtn(art, 298, 574, 100, causal ? "Causal: on" : "Causal: off", () => { stopTile(); causal = !causal; render(); });
    txt(412, 592, "step " + tileStep + " / 3", { size: 9.5, fill: C.dim, mono: true });
  }

  /* ------------------------------ section 4 ------------------------------ */

  function drawVariants(art: SVGSVGElement): void {
    txt(20, 26, "same core, different constraints", { size: 9.5, weight: 700, fill: C.dim });
    txt(260, 26, "click a variant", { size: 9, fill: C.dim });

    VARIANTS.forEach((v, i) => {
      const x = 20 + (i % 5) * 136;
      const y = 48 + Math.floor(i / 5) * 104;
      const on = i === variant;
      const g = s("g", { cursor: "pointer" });
      g.addEventListener("click", () => { variant = i; render(); });
      g.appendChild(s("rect", { x, y, width: 126, height: 88, rx: 8, fill: on ? v.color : C.panel, "fill-opacity": on ? 0.14 : 0.55, stroke: on ? v.color : C.line, "stroke-width": on ? 1.6 : 1 }));
      g.appendChild(txt(x + 10, y + 20, v.title.slice(0, 15), { size: 9.5, weight: 700, fill: on ? v.color : C.fg }));
      const words = v.title.split(" ");
      if (words.length > 2) g.appendChild(txt(x + 10, y + 36, words.slice(2).join(" "), { size: 8, fill: C.dim }));
      g.appendChild(txt(x + 10, y + 74, on ? "selected" : "click", { size: 8, fill: on ? v.color : C.dim, mono: true }));
      art.appendChild(g);
    });

    const v = VARIANTS[variant];
    art.appendChild(s("rect", { x: 20, y: 268, width: 680, height: 110, rx: 10, fill: C.panel, "fill-opacity": 0.6, stroke: v.color, "stroke-opacity": 0.65 }));
    txt(34, 292, v.title, { size: 12, weight: 700, fill: v.color });
    const words = v.detail.split(" ");
    const line1 = words.slice(0, 14).join(" ");
    const line2 = words.slice(14, 28).join(" ");
    const line3 = words.slice(28).join(" ");
    txt(34, 314, line1, { size: 9.5, fill: C.fg });
    txt(34, 332, line2, { size: 9.5, fill: C.fg });
    txt(34, 350, line3, { size: 9.5, fill: C.fg });
    txt(34, 368, "The tiled online-softmax recurrence does not change.", { size: 8.5, fill: C.ok });

    txt(20, 410, "Algorithmic variants", { size: 8.5, weight: 700, fill: C.dim });
    txt(20, 426, "causal · sliding window · block-sparse · GQA/MQA · varlen/paged", { size: 8.5, fill: C.dim, mono: true });
    txt(20, 446, "Platform variants", { size: 8.5, weight: 700, fill: C.dim });
    txt(20, 462, "CUDA/CUTLASS · Triton · ROCm/CK · TPU/Pallas · inference engines", { size: 8.5, fill: C.dim, mono: true });
    txt(20, 486, "Precision variants", { size: 8.5, weight: 700, fill: C.dim });
    txt(20, 502, "FP16/BF16 · FP8 · FP4/mixed · higher-precision softmax", { size: 8.5, fill: C.dim, mono: true });
    txt(430, 486, "Generation sweep", { size: 8.5, weight: 700, fill: C.dim });
    txt(430, 502, "v1 IO-aware → v2 partitioning → v3 Hopper → v4 Blackwell", { size: 8.5, fill: C.dim, mono: true });
  }

  /* ------------------------------ section 5 ------------------------------ */

  function drawCode(art: SVGSVGElement): void {
    txt(20, 26, "same recurrence, four idioms", { size: 9.5, weight: 700, fill: C.dim });
    const platforms = [
      { label: "PyTorch", sub: "dispatch", color: C.accent, x: 20 },
      { label: "CUDA / CUTLASS", sub: "TMA · WGMMA", color: C.ok, x: 190 },
      { label: "Triton", sub: "tl.dot", color: C.purple, x: 360 },
      { label: "TPU / Pallas", sub: "MXU · CMEM", color: C.teal, x: 530 },
    ];
    platforms.forEach((p, i) => {
      const on = i === codeTab;
      art.appendChild(s("rect", { x: p.x, y: 48, width: 150, height: 74, rx: 8, fill: p.color, "fill-opacity": on ? 0.14 : 0.55, stroke: p.color, "stroke-opacity": on ? 0.9 : 0.4, "stroke-width": on ? 1.8 : 1 }));
      art.appendChild(txt(p.x + 12, 72, p.label, { size: 10.5, weight: 700, fill: p.color }));
      art.appendChild(txt(p.x + 12, 92, p.sub, { size: 8.5, fill: C.dim, mono: true }));
      art.appendChild(txt(p.x + 12, 110, "tile + softmax", { size: 8, fill: C.fg }));
    });
    art.appendChild(s("rect", { x: 250, y: 150, width: 220, height: 40, rx: 20, fill: C.panel2, stroke: C.accent, "stroke-opacity": 0.6 }));
    txt(360, 175, "same online-softmax loop", { anchor: "middle", size: 10, fill: C.accent, weight: 700 });
    [95, 265, 435, 605].forEach((x) => arrow(art, x, 122, x, 150, C.dim, "arw-code"));
    txt(20, 220, "The platform decides how tiles move and which matrix-multiply primitive runs.", { size: 9, fill: C.dim });
    txt(20, 238, "The loop below is the invariant; the tabs show the same steps in each language.", { size: 9, fill: C.ok });
    art.appendChild(marker("arw-code", C.dim));
  }

  /* ------------------------------ code panel ------------------------------ */

  const codeSection = secEls[5].section;
  const codeWrap = document.createElement("div");
  codeWrap.className = "ill-prose";
  const tabs = document.createElement("div");
  tabs.style.display = "flex";
  tabs.style.flexWrap = "wrap";
  tabs.style.gap = "6px";
  tabs.style.margin = "14px 0 8px";
  const codeCard = document.createElement("div");
  codeCard.className = "code-card";
  const codeHead = document.createElement("div");
  codeHead.className = "code-head";
  const codeDots = document.createElement("div");
  codeDots.className = "code-dots";
  codeDots.innerHTML = "<i></i><i></i><i></i>";
  const codeTitle = document.createElement("span");
  codeTitle.className = "code-title";
  const codeLang = document.createElement("span");
  codeLang.className = "code-lang";
  codeHead.append(codeDots, codeTitle, codeLang);
  const pre = document.createElement("pre");
  pre.style.padding = "12px 16px";
  const codeEl = document.createElement("code");
  codeEl.style.display = "block";
  pre.appendChild(codeEl);
  codeCard.append(codeHead, pre);
  codeWrap.append(tabs, codeCard);
  codeSection.appendChild(codeWrap);

  const tabEls: HTMLButtonElement[] = [];
  function setCode(i: number): void {
    codeTab = i;
    tabEls.forEach((b, k) => b.classList.toggle("on", k === i));
    codeTitle.textContent = CODE[i].label;
    codeLang.textContent = CODE[i].lang;
    codeEl.textContent = CODE[i].lines.join("\n");
    noteEl.textContent = CODE[i].note;
  }
  const noteEl = document.createElement("p");
  noteEl.className = "ill-refs";
  codeWrap.appendChild(noteEl);

  CODE.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ill-stage";
    b.innerHTML = '<span class="n">' + (i + 1) + "</span>" + c.label;
    b.addEventListener("click", () => { setCode(i); render(); });
    tabs.appendChild(b);
    tabEls.push(b);
  });
  setCode(0);

  render();
  startAttn(false);
  return {
    destroy(): void {
      stopAttn();
      stopNaive();
      stopTile();
    },
  };
};

export default flash;
