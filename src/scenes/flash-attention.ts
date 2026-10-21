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
    h: 590,
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
    id: "fused",
    title: "Fused attention: one kernel, no intermediates",
    blurb:
      "The same workload through PyTorch's fused SDPA. One kernel reads Q/K/V and writes O; S and P never exist as whole tensors. This is the memory-efficient SM75 path, not FlashAttention, but it shows exactly what removing the intermediates buys.",
    h: 500,
  },
  {
    id: "tiling",
    title: "One new K/V: denominator and O correction",
    blurb:
      "A new K/V pair changes the softmax denominator. Merge Q with the new K into one logit, update ℓ, form the new weight with the new V, then correct the old O by ℓ_old·scale/ℓ_new and add the new contribution. Old logits and old Vs are intentionally hidden.",
    h: 620,
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
  let tileQ = 0;
  const tileDone = [false, false, false, false];
  let tilePhase = 0;
  let tileRaf: number | null = null;
  let tileLast = 0;
  let tileSingle = false;
  let causal = false;

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

  const draws = [drawMemory, drawDefinition, drawNaive, drawFused, drawTiling];

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

    // Bandwidth ladder: transfer bandwidth, not compute throughput.
    art.appendChild(s("rect", { x: 20, y: 352, width: 680, height: 94, rx: 9, fill: C.panel, "fill-opacity": 0.55, stroke: C.teal, "stroke-opacity": 0.45 }));
    txt(34, 372, "bandwidth ladder · H100-class · approximate", { size: 9.5, weight: 700, fill: C.teal });
    const bwRows = [
      { label: "HBM", value: "3.35 TB/s", frac: 3.35 / 30, color: C.accent },
      { label: "L2 / on-chip path", value: "~10 TB/s", frac: 10 / 30, color: C.teal },
      { label: "SMEM → RF", value: "~30 TB/s agg.", frac: 1, color: C.ok },
    ];
    bwRows.forEach((row, i) => {
      const y = 386 + i * 18;
      txt(34, y + 8, row.label, { size: 8, fill: C.dim });
      art.appendChild(s("rect", { x: 150, y, width: 290, height: 8, rx: 4, fill: C.panel2, stroke: C.line }));
      art.appendChild(s("rect", { x: 150, y, width: Math.max(2, 290 * row.frac), height: 8, rx: 4, fill: row.color, "fill-opacity": 0.85 }));
      txt(455, y + 8, row.value, { size: 8, fill: row.color, mono: true });
    });
    txt(34, 438, "TB/s, approximate; compute FLOP/s is a separate axis", { size: 7.5, fill: C.dim });

    // Unified memory case.
    art.appendChild(s("rect", { x: 20, y: 462, width: 680, height: 70, rx: 9, fill: C.panel, "fill-opacity": 0.5, stroke: C.teal, "stroke-opacity": 0.45 }));
    txt(34, 482, "Unified memory · the case", { size: 10.5, weight: 700, fill: C.teal });
    txt(34, 500, "CPU and accelerator share one address space; no explicit H2D/D2H copies", { size: 8.5, fill: C.fg });
    txt(34, 516, "still HBM-bound; coherence and capacity are the trade-offs", { size: 8.5, fill: C.warn });

    svgBtn(art, 20, 548, 90, gpuOn ? "✓ GPU" : "GPU", () => { arch = "gpu"; render(); });
    svgBtn(art, 118, 548, 90, tpuOn ? "✓ TPU" : "TPU", () => { arch = "tpu"; render(); });
    txt(220, 566, "toggle target: architectures and scheduling differ", { size: 8.5, fill: C.dim });
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

  function drawFused(art: SVGSVGElement): void {
    const total = 27.1;
    const x0 = 150;
    const x1 = 680;
    const X = (ms: number): number => x0 + (ms / total) * (x1 - x0);
    const W = (ms: number): number => (ms / total) * (x1 - x0);
    const band = (x: number, y: number, w: number, color: string, label: string, h = 16): void => {
      art.appendChild(s("rect", { x, y, width: w, height: h, rx: 3, fill: color, "fill-opacity": 0.24, stroke: color, "stroke-opacity": 0.85 }));
      txt(x + 5, y + h - 5, label, { size: 6.5, fill: color, mono: true });
    };

    txt(20, 24, "fused attention · real trace", { size: 11, weight: 700, fill: C.fg });
    txt(20, 42, "Tesla T4 · torch 2.11.0+cu130 · B=4 H=8 N=4096 D=64 · FP16", { size: 8, fill: C.dim });
    txt(688, 24, "18.9 ms GPU · 64 MiB peak", { size: 8, fill: C.teal, anchor: "end" });
    txt(688, 42, "1 kernel · no S/P", { size: 8, fill: C.fg, anchor: "end" });

    txt(20, 70, "CPU", { size: 8.5, weight: 700, fill: C.dim });
    band(X(0), 56, W(8.41), C.dim, "launch / setup", 14);
    art.appendChild(s("rect", { x: X(8.52), y: 74, width: W(18.6), height: 6, rx: 3, fill: C.panel2, stroke: C.line }));
    txt(X(8.52) + 4, 90, "CPU waits on GPU", { size: 7, fill: C.dim });

    txt(20, 118, "GPU stream", { size: 8.5, weight: 700, fill: C.dim });
    band(X(8.21), 104, W(18.9), C.teal, "fused SDPA · 18.9 ms", 20);
    txt(X(8.21) + 4, 138, "one kernel", { size: 6.5, fill: C.dim });

    txt(20, 160, "HBM traffic", { size: 8.5, weight: 700, fill: C.dim });
    band(X(8.21), 146, W(18.9), C.accent, "read Q/K/V · 48 MiB", 10);
    band(X(8.21), 158, W(18.9), C.bad, "write O · 16 MiB", 10);

    txt(20, 190, "compute active", { size: 8.5, weight: 700, fill: C.dim });
    band(X(8.21), 176, W(18.9), C.teal, "1 fused kernel", 10);

    txt(20, 218, "HBM buffers", { size: 8.5, weight: 700, fill: C.dim });
    const buf = (x: number, w: number, label: string, sub: string, color: string, dashed = false): void => {
      art.appendChild(s("rect", { x, y: 228, width: w, height: 26, rx: 5, fill: dashed ? "none" : color, "fill-opacity": 0.16, stroke: color, "stroke-opacity": 0.7, "stroke-dasharray": dashed ? "4 3" : "0" }));
      txt(x + 6, 245, label, { size: 8.5, fill: dashed ? C.dim : C.fg, mono: true });
      txt(x + w - 6, 245, sub, { size: 6.5, fill: color, anchor: "end", mono: true });
    };
    buf(150, 42, "Q", "16 MiB", C.accent);
    buf(198, 42, "K", "16 MiB", C.accent);
    buf(246, 42, "V", "16 MiB", C.accent);
    buf(294, 110, "S / P", "not materialized", C.bad, true);
    buf(410, 44, "O", "16 MiB", C.ok);

    art.appendChild(s("rect", { x: 20, y: 274, width: 680, height: 112, rx: 9, fill: C.panel, "fill-opacity": 0.55, stroke: C.teal, "stroke-opacity": 0.5 }));
    txt(34, 296, "what the fused kernel buys", { size: 10.5, weight: 700, fill: C.teal });
    txt(34, 314, "naive: 55.4 ms GPU · 2.22 GB peak · ~6.1 GiB HBM traffic", { size: 8.5, fill: C.dim });
    txt(34, 332, "fused: 18.9 ms GPU · 64 MiB peak · ~64 MiB HBM traffic", { size: 8.5, fill: C.fg });
    txt(34, 350, "2.9× less GPU time · 34× lower peak · ~97× less traffic", { size: 9, weight: 700, fill: C.ok });
    txt(34, 368, "PyTorch efficient attention on SM75 — not FlashAttention; true FA needs SM80+.", { size: 8, fill: C.warn });
    txt(20, 412, "The full N×N scores and probabilities never exist; the kernel keeps tiles on chip.", { size: 8, fill: C.dim });
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
    if (tileRaf !== null) {
      window.cancelAnimationFrame(tileRaf);
      tileRaf = null;
    }
    tilePlaying = false;
  }

  function tickTile(now: number): void {
    tileRaf = null;
    if (!tilePlaying) return;
    const dt = Math.min(0.05, (now - tileLast) / 1000);
    tileLast = now;
    tilePhase = Math.min(1, tilePhase + dt / 1.1);
    if (tilePhase >= 1) {
      tilePhase = 1;
      if (tileSingle) {
        tileSingle = false;
        tilePlaying = false;
      } else if (tileStep < 3) {
        tileStep += 1;
        tilePhase = 0;
      } else {
        tileDone[tileQ] = true;
        if (tileQ < 3) {
          tileQ += 1;
          tileStep = 1;
          tilePhase = 0;
        } else {
          tilePlaying = false;
        }
      }
    }
    render();
    if (tilePlaying) tileRaf = window.requestAnimationFrame(tickTile);
  }

  function toggleTile(): void {
    if (tilePlaying) {
      stopTile();
      render();
      return;
    }
    if (tileStep >= 3 && tileQ >= 3) {
      tileQ = 0;
      tileDone.fill(false);
      tileStep = 0;
    }
    if (tileStep === 0) tileStep = 1;
    tilePhase = 0;
    tileSingle = false;
    tilePlaying = true;
    tileLast = performance.now();
    tileRaf = window.requestAnimationFrame(tickTile);
    render();
  }

  function stepTileOnce(): void {
    stopTile();
    if (tileStep >= 3) {
      tileDone[tileQ] = true;
      if (tileQ < 3) {
        tileQ += 1;
        tileStep = 1;
      } else {
        tileQ = 0;
        tileDone.fill(false);
        tileStep = 0;
      }
    } else if (tileStep === 0) {
      tileStep = 1;
    } else {
      tileStep += 1;
    }
    tilePhase = 0;
    tileSingle = true;
    tilePlaying = true;
    tileLast = performance.now();
    tileRaf = window.requestAnimationFrame(tickTile);
    render();
  }

  function drawTiling(art: SVGSVGElement): void {
    const scoresByQ = [
      [-0.68, -1.14, 0.34],
      [0.12, -0.40, 0.80],
      [0.20, -0.10, 0.45],
      [-0.30, 0.10, 0.05],
    ];
    const vals = VALUES.slice(0, 3);
    const q = tileQ;
    const scores = scoresByQ[q];
    const stats = (n: number): { m: number; l: number; o: number[] } => {
      let m = -Infinity;
      let l = 0;
      const o = [0, 0, 0];
      for (let j = 0; j <= n; j++) {
        const mNew = Math.max(m, scores[j]);
        const sc = m === -Infinity ? 0 : Math.exp(m - mNew);
        const w = Math.exp(scores[j] - mNew);
        l = l * sc + w;
        for (let d = 0; d < 3; d++) o[d] = o[d] * sc + w * vals[j][d];
        m = mNew;
      }
      return { m, l, o };
    };
    const old = stats(1);
    const cur = stats(2);
    const scale = Math.exp(old.m - cur.m);
    const lStart = old.l * scale;
    const pNew = Math.exp(scores[2] - cur.m) / cur.l;
    const ph = Math.min(1, Math.max(0, tilePhase));
    const ease = 1 - Math.pow(1 - ph, 3);
    const stateT = tileStep === 2 ? ease : tileStep >= 3 ? 1 : 0;
    const pT = tileStep === 2 ? ease : tileStep >= 3 ? 1 : 0;
    const oT = tileStep >= 3 ? ease : 0;
    const qy = 78 + q * 50;
    const chip = (cx: number, cy: number, label: string, color: string, opacity = 1, w = 40, h = 20): void => {
      if (opacity <= 0.02) return;
      art.appendChild(s("rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 5, fill: color, "fill-opacity": 0.1 + 0.16 * opacity, stroke: color, "stroke-opacity": 0.7 * opacity }));
      txt(cx, cy + 3.5, label, { anchor: "middle", size: 7.2, fill: color, mono: true });
    };

    txt(20, 24, "one new K/V · smooth steps", { size: 10.5, weight: 700, fill: C.fg });
    txt(20, 42, "Q/K → logit · logit + m,ℓ → p · p + V → O", { size: 8, fill: C.dim });

    for (let i = 0; i < 4; i++) {
      const active = i === q;
      const done = tileDone[i];
      const on = active || done;
      const y = 78 + i * 50;
      art.appendChild(s("rect", { x: 30, y, width: 70, height: 30, rx: 6, fill: active ? C.accent : C.panel2, "fill-opacity": active ? 0.18 : 0.5, stroke: active ? C.accent : C.line, "stroke-width": active ? 1.6 : 1 }));
      txt(65, y + 19, "Q" + i, { anchor: "middle", size: 10, weight: 700, fill: on ? C.fg : C.dim, mono: true });
      const fill = done ? 1 : active ? oT : 0;
      art.appendChild(s("rect", { x: 590, y, width: 100, height: 30, rx: 6, fill: fill > 0 ? C.purple : C.panel2, "fill-opacity": fill > 0 ? 0.12 + 0.22 * fill : 0.5, stroke: fill > 0 ? C.purple : C.line, "stroke-width": active ? 1.5 : 1 }));
      txt(640, y + 19, done ? "O ✓" : "O", { anchor: "middle", size: 10, weight: 700, fill: fill > 0 ? C.fg : C.dim, mono: true });
    }
    txt(30, 267, "Q loop", { size: 7.5, fill: C.dim });

    art.appendChild(s("rect", { x: 350, y: 62, width: 90, height: 30, rx: 6, fill: C.ok, "fill-opacity": tileStep >= 1 ? 0.22 : 0.12, stroke: C.ok }));
    txt(395, 81, "K new", { anchor: "middle", size: 10, weight: 700, fill: C.fg, mono: true });
    art.appendChild(s("rect", { x: 350, y: 382, width: 90, height: 30, rx: 6, fill: C.purple, "fill-opacity": 0.18, stroke: C.purple }));
    txt(395, 401, "V new", { anchor: "middle", size: 10, weight: 700, fill: C.fg, mono: true });

    // Step 1 · Q and K merge into one logit.
    if (tileStep === 1) {
      const fade = Math.max(0, 1 - (ph - 0.55) / 0.3);
      const qS = { x: 65, y: qy + 15 };
      const qp = { x: qS.x + (395 - qS.x) * ease, y: qS.y + (150 - qS.y) * ease };
      chip(qp.x, qp.y, "Q", C.accent, fade, 30, 18);
      const kp = { x: 395, y: 85 + (145 - 85) * ease };
      chip(kp.x, kp.y, "K", C.ok, fade, 30, 18);
      if (ph > 0.45) chip(395, 150, "logit", C.warn, Math.min(1, (ph - 0.45) / 0.3), 54);
    }

    // Persistent state panel; p is produced by the logit meeting m and ℓ.
    art.appendChild(s("rect", { x: 20, y: 282, width: 330, height: 92, rx: 8, fill: C.panel, "fill-opacity": 0.5, stroke: C.line }));
    txt(34, 300, "state", { size: 8.5, weight: 700, fill: C.dim });
    txt(34, 322, "m", { size: 8.5, fill: C.accent, mono: true });
    art.appendChild(s("rect", { x: 72, y: 312, width: 250, height: 8, rx: 4, fill: C.panel2, stroke: C.line }));
    const mPos = 72 + 250 * (0.18 + 0.58 * stateT);
    art.appendChild(s("circle", { cx: mPos, cy: 316, r: 4, fill: C.accent }));
    txt(34, 344, "ℓ", { size: 8.5, fill: C.teal, mono: true });
    art.appendChild(s("rect", { x: 72, y: 334, width: 250, height: 8, rx: 4, fill: C.panel2, stroke: C.line }));
    const lFrac = (lStart + (cur.l - lStart) * stateT) / cur.l;
    art.appendChild(s("rect", { x: 72, y: 334, width: Math.max(2, 250 * lFrac), height: 8, rx: 4, fill: C.teal, "fill-opacity": 0.85 }));
    txt(34, 366, "p", { size: 8.5, fill: C.ok, mono: true });
    art.appendChild(s("rect", { x: 72, y: 356, width: 250, height: 8, rx: 4, fill: C.panel2, stroke: C.line }));
    art.appendChild(s("rect", { x: 72, y: 356, width: Math.max(2, 250 * pNew * pT), height: 8, rx: 4, fill: C.ok, "fill-opacity": 0.85 }));

    // Step 2 · logit moves into the state; m and ℓ update; p emerges.
    if (tileStep === 2) {
      const lx = 395 + (300 - 395) * ease;
      const ly = 150 + (300 - 150) * ease;
      chip(lx, ly, "logit", C.warn, 1 - 0.7 * ease, 50);
      if (ph > 0.35) chip(300, 360, "p", C.ok, 1, 26, 18);
    }

    // Step 3 · p and V merge into O. No p label below V.
    if (tileStep === 3) {
      const px = 300 + (395 - 300) * ease;
      const py = 360 + (397 - 360) * ease;
      chip(px, py, "p", C.ok, 1 - 0.7 * ease, 24, 16);
      art.appendChild(s("circle", { cx: 395, cy: 397, r: 5 + 10 * oT, fill: C.purple, "fill-opacity": 0.12 }));
    }

    svgBtn(art, 20, 566, 82, "▶ Step", () => { stepTileOnce(); });
    svgBtn(art, 110, 566, 100, tilePlaying ? "⏸ Pause" : "▶ Run", () => { toggleTile(); });
    svgBtn(art, 218, 566, 82, "↺ Reset", () => { stopTile(); tileQ = 0; tileDone.fill(false); tileStep = 0; tilePhase = 0; render(); });
    txt(318, 584, "Q " + (q + 1) + " / 4 · step " + tileStep + " / 3", { size: 9.2, fill: C.dim, mono: true });
  }

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
