/**
 * Illustration: FlashAttention, v1 to v4.
 *
 * One thesis: the algorithm stayed tiled and exact; each generation changed
 * how tiles are fed to the tensor cores and how the non-matmul work is hidden.
 *
 * Sections
 *  1  the memory wall: why materializing S and P is the problem
 *  2  tiling + online softmax: the invariant behind every version
 *  3  v1 -> v2: work partitioning and occupancy
 *  4  v2 -> v3: asynchrony and warp specialization on Hopper
 *  5  v3 -> v4: co-design for Blackwell's asymmetric scaling
 *  6  the four generations at a glance
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

function box(art: SVGSVGElement, x: number, y: number, w: number, h: number, title: string, sub: string, color: string): void {
  art.appendChild(s("rect", { x, y, width: w, height: h, rx: 9, fill: C.panel, "fill-opacity": 0.7, stroke: color, "stroke-opacity": 0.7 }));
  art.appendChild(txt(x + 12, y + 22, title, { size: 11, weight: 700, fill: color }));
  art.appendChild(txt(x + 12, y + 41, sub, { size: 8.5, fill: C.dim }));
}

function fmt(x: number): string {
  if (x >= 1e9) return (x / 1e9).toFixed(1) + "B";
  if (x >= 1e6) return (x / 1e6).toFixed(1) + "M";
  if (x >= 1e3) return (x / 1e3).toFixed(1) + "K";
  return String(Math.round(x));
}

function bar(art: SVGSVGElement, x: number, y: number, w: number, frac: number, color: string, label: string, value: string): void {
  art.appendChild(txt(x, y - 6, label, { size: 9.5, fill: C.dim }));
  art.appendChild(s("rect", { x, y, width: w, height: 12, rx: 6, fill: C.panel2, stroke: C.line }));
  art.appendChild(s("rect", { x, y, width: Math.max(2, w * Math.min(1, frac)), height: 12, rx: 6, fill: color, "fill-opacity": 0.85 }));
  art.appendChild(txt(x + w, y + 26, value, { anchor: "end", size: 9, fill: color, mono: true }));
}

function svgBtn(art: SVGSVGElement, x: number, y: number, w: number, label: string, onClick: () => void, on = true): void {
  const color = on ? C.accent : C.dim;
  const g = s("g", { cursor: on ? "pointer" : "default", class: "ill-svg-btn" });
  g.appendChild(s("rect", { x, y, width: w, height: 26, rx: 13, fill: color, "fill-opacity": on ? 0.12 : 0.06, stroke: color }));
  g.appendChild(txt(x + w / 2, y + 17, label, { anchor: "middle", size: 10.5, fill: color, weight: 600 }));
  if (on) g.addEventListener("click", onClick);
  art.appendChild(g);
}

interface Sec {
  id: string;
  title: string;
  blurb: string;
  h: number;
  top?: number;
  prose?: string[];
}

const SECS: Sec[] = [
  {
    id: "memory",
    title: "The memory wall",
    blurb:
      "Standard attention computes S = QKᵀ and P = softmax(S), then writes both N×N matrices to HBM. The tensor cores are fast; HBM is not. FlashAttention's first move is to never materialize them.",
    h: 360,
  },
  {
    id: "tiling",
    title: "Tile the matrix, keep the softmax online",
    blurb:
      "A query tile walks over key/value tiles. Each tile updates a running max, denominator, and output accumulator in SRAM. The result is exact — no approximation — and the N×N matrix never exists in HBM.",
    h: 560,
  },
  {
    id: "v2",
    title: "v1 → v2: fill the GPU",
    blurb:
      "v1 was IO-aware but left the GPU underoccupied. v2 splits the query dimension across thread blocks and distributes work across warps, so a single head can use the whole GPU.",
    h: 380,
  },
  {
    id: "v3",
    title: "v2 → v3: overlap everything",
    blurb:
      "Hopper added TMA and WGMMA. v3 warp-specializes the kernel: one group produces tiles, another runs matrix multiplies, and softmax overlaps both. FP8 adds another gear.",
    h: 420,
  },
  {
    id: "v4",
    title: "v3 → v4: co-design for Blackwell",
    blurb:
      "On Blackwell, tensor-core throughput doubled while shared-memory bandwidth and exponential units did not. v4 moves work off those slow units: bigger tiles, async MMA, tensor memory, 2-CTA MMA, and emulated exponentials.",
    h: 420,
  },
  {
    id: "timeline",
    title: "Four generations, one idea",
    blurb:
      "Every version is exact tiled attention. What changes is the schedule: how blocks are partitioned, how tiles are loaded, and which unit is the bottleneck.",
    h: 430,
    prose: [
      '<p class="ill-refs"><strong>Papers:</strong> <a href="https://arxiv.org/abs/2205.14135">FlashAttention (2022)</a> · <a href="https://arxiv.org/abs/2307.08691">FlashAttention-2 (2023)</a> · <a href="https://arxiv.org/abs/2407.08608">FlashAttention-3 (2024)</a> · <a href="https://arxiv.org/abs/2603.05451">FlashAttention-4 (2026)</a> · <a href="https://github.com/Dao-AILab/flash-attention">code</a></p>',
      '<pre><code>for q_tile in Q_blocks:\n    m = -inf; l = 0; O = 0\n    for k_tile, v_tile in zip(K_blocks, V_blocks):\n        S = q_tile @ k_tile.T\n        m_new = max(m, rowmax(S))\n        P = exp(S - m_new)\n        l = l * exp(m - m_new) + rowsum(P)\n        O = O * exp(m - m_new) + P @ v_tile\n        m = m_new\n    O = O / l</code></pre>',
      '<p class="ill-refs">The loop is the invariant. v1 made it IO-aware; v2 made it occupy the GPU; v3 overlapped its stages with Hopper’s asynchronous units; v4 rebalanced it for Blackwell.</p>',
    ],
  },
];

const N = 8;
const BLOCK = 4;
const SCORES = Array.from({ length: N }, (_, i) =>
  Array.from({ length: N }, (_, j) => Math.sin((i + 1) * 1.7 + (j + 1) * 0.9)),
);
const VALUES = Array.from({ length: N }, (_, i) =>
  Array.from({ length: N }, (_, j) => Math.cos(i * 1.1 + j * 0.7)),
);

const kvFlash: SceneFactory = (host) => {
  let n = 4096;
  let tileStep = 0;
  let tilePlaying = false;
  let tileTimer: number | null = null;
  let causal = false;
  let mode: "v1" | "v2" = "v2";
  let pipeMode: "v2" | "v3" = "v3";
  let pipeStep = 0;
  let pipeTimer: number | null = null;
  let gen = 0;

  const root = document.createElement("div");
  root.className = "ill";

  const secEls: Array<{ svg: SVGSVGElement; ctl: HTMLElement }> = [];
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
      viewBox: "0 -" + (sec.top || 0) + " " + VB_W + " " + (sec.h + (sec.top || 0)),
      role: "img",
      "aria-label": sec.title,
    });
    fig.appendChild(svg);
    section.append(head, blurb, fig);
    if (sec.prose) {
      const prose = document.createElement("div");
      prose.className = "ill-prose";
      prose.innerHTML = sec.prose.map((p) => (p.trim().startsWith("<") ? p : "<p>" + p + "</p>")).join("");
      section.appendChild(prose);
    }
    root.appendChild(section);
    secEls.push({ svg, ctl });
  });
  host.appendChild(root);

  // Section 1 control: sequence length drives the HBM-traffic bars.
  const nCtl = document.createElement("label");
  nCtl.className = "ill-ctl";
  const nLabel = document.createElement("span");
  nLabel.textContent = "N = " + n.toLocaleString();
  const nInput = document.createElement("input");
  nInput.type = "range";
  nInput.min = "1024";
  nInput.max = "16384";
  nInput.step = "1024";
  nInput.value = String(n);
  nInput.addEventListener("input", () => {
    n = Number(nInput.value);
    nLabel.textContent = "N = " + n.toLocaleString();
    render();
  });
  nCtl.append(nLabel, nInput);
  secEls[0].ctl.append(nCtl);

  const draws = [drawMemory, drawTiling, drawV2, drawV3, drawV4, drawTimeline];

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

  function drawMemory(art: SVGSVGElement): void {
    art.appendChild(marker("arw", C.dim));

    box(art, 20, 40, 340, 74, "HBM", "Q K V O · S · P", C.bad);
    // tiny N×N matrix in HBM
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        art.appendChild(
          s("rect", {
            x: 250 + j * 10,
            y: 58 + i * 8,
            width: 7,
            height: 6,
            rx: 1,
            fill: i === j ? C.bad : C.warn,
            "fill-opacity": 0.18 + 0.06 * ((i + j) % 5),
          }),
        );
      }
    }
    box(art, 90, 150, 200, 62, "SRAM", "one Q tile + K/V tiles + O tile", C.ok);
    box(art, 110, 250, 160, 52, "Tensor cores", "tile-wise matmul", C.accent);

    arrow(art, 190, 114, 190, 150, C.dim, "arw");
    arrow(art, 190, 212, 190, 250, C.dim, "arw");
    arrow(art, 270, 250, 270, 212, C.dim, "arw");
    txt(282, 235, "partial O", { size: 8.5, fill: C.ok });
    arrow(art, 290, 150, 290, 114, C.dim, "arw");
    txt(302, 135, "write back once", { size: 8.5, fill: C.ok });

    txt(420, 40, "HBM elements moved · schematic", { size: 9.5, weight: 700, fill: C.dim });
    const d = 64;
    const sram = 32768;
    const std = n * n + 4 * n * d;
    const flash = 4 * n * d + (n * n * d * d) / sram;
    bar(art, 430, 78, 220, 1, C.bad, "standard attention", fmt(std));
    bar(art, 430, 130, 220, flash / std, C.ok, "FlashAttention", fmt(flash));
    txt(430, 184, "N = " + n.toLocaleString() + " · d = 64 · SRAM = 64 KB", { size: 8.5, fill: C.dim, mono: true });
    txt(430, 206, "ratio " + (std / Math.max(1, flash)).toFixed(1) + "× less HBM traffic", { size: 10, fill: C.ok, weight: 700 });
    txt(430, 238, "standard:  Θ(N² + Nd)", { size: 10, fill: C.fg, mono: true });
    txt(430, 256, "tiled:        Θ(N²d² / M + Nd)", { size: 10, fill: C.fg, mono: true });
    txt(430, 284, "The score matrix is the problem:", { size: 9.5, fill: C.dim });
    txt(430, 300, "N² elements written and read.", { size: 9.5, fill: C.dim });
    txt(430, 326, "Tiling turns that into a streaming pass.", { size: 9.5, fill: C.ok });
  }

  /* ------------------------------ section 2 ------------------------------ */

  function order(): Array<[number, number]> {
    return causal ? [[0, 0], [1, 0], [1, 1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
  }

  function tileTotal(): number {
    return order().length;
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
    if (tileStep >= tileTotal()) tileStep = 0;
    tilePlaying = true;
    const tick = (): void => {
      if (!tilePlaying) return;
      if (tileStep >= tileTotal()) {
        tilePlaying = false;
        tileTimer = null;
        render();
        return;
      }
      tileStep += 1;
      render();
      tileTimer = window.setTimeout(tick, 720);
    };
    tileTimer = window.setTimeout(tick, 420);
    render();
  }

  function tileStats(cur: [number, number] | null): { m: number; l: number; o: number; row: number; kMax: number } {
    if (!cur) return { m: -Infinity, l: 0, o: 0, row: 0, kMax: -1 };
    const row = cur[0] * BLOCK;
    const kMax = cur[1];
    let m = -Infinity;
    let l = 0;
    let o = 0;
    for (let t = 0; t <= kMax; t++) {
      for (let j = t * BLOCK; j < t * BLOCK + BLOCK; j++) {
        if (causal && j > row) continue;
        const score = SCORES[row][j];
        const mNew = Math.max(m, score);
        const scale = m === -Infinity ? 0 : Math.exp(m - mNew);
        const p = Math.exp(score - mNew);
        l = l * scale + p;
        o = o * scale + p * VALUES[row][j];
        m = mNew;
      }
    }
    return { m, l, o, row, kMax };
  }

  function drawTiling(art: SVGSVGElement): void {
    art.appendChild(marker("arw-t", C.dim));
    const gx = 20;
    const gy = 44;
    const cell = 31;
    const ord = order();
    const active = tileStep > 0 ? ord[tileStep - 1] : null;
    const done = ord.slice(0, Math.max(0, tileStep - (active ? 1 : 0)));

    txt(gx, 24, "S = QKᵀ", { size: 11, weight: 700, fill: C.fg, mono: true });
    txt(gx + 82, 24, "a tile at a time", { size: 9.5, fill: C.dim });
    txt(gx + 8, 41, "K →", { size: 8.5, fill: C.dim });
    txt(gx - 10, gy + 18, "Q", { size: 8.5, fill: C.dim, anchor: "end" });

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const ti = Math.floor(i / BLOCK);
        const tj = Math.floor(j / BLOCK);
        const isActive = active !== null && active[0] === ti && active[1] === tj;
        const isDone = done.some(([a, b]) => a === ti && b === tj);
        const masked = causal && j > i;
        let fill = masked ? C.line : C.panel2;
        let op = masked ? 0.55 : 0.9;
        let stroke = C.line;
        let sw = 1;
        if (isDone) {
          fill = C.ok;
          op = 0.18;
          stroke = C.ok;
        }
        if (isActive) {
          fill = C.accent;
          op = 0.28;
          stroke = C.accent;
          sw = 2;
        }
        art.appendChild(
          s("rect", {
            x: gx + j * cell,
            y: gy + i * cell,
            width: cell - 2,
            height: cell - 2,
            rx: 3,
            fill,
            "fill-opacity": op,
            stroke,
            "stroke-width": sw,
          }),
        );
        if (!masked) {
          const v = SCORES[i][j];
          art.appendChild(
            txt(gx + j * cell + (cell - 2) / 2, gy + i * cell + 18, v.toFixed(1), {
              anchor: "middle",
              size: 7.5,
              mono: true,
              fill: isActive ? C.fg : C.dim,
            }),
          );
        }
      }
    }
    for (let k = 0; k <= N; k += BLOCK) {
      art.appendChild(s("line", { x1: gx + k * cell, y1: gy, x2: gx + k * cell, y2: gy + N * cell, stroke: C.fg, "stroke-opacity": 0.28, "stroke-width": 1.5 }));
      art.appendChild(s("line", { x1: gx, y1: gy + k * cell, x2: gx + N * cell, y2: gy + k * cell, stroke: C.fg, "stroke-opacity": 0.28, "stroke-width": 1.5 }));
    }

    const stats = tileStats(active);
    const px = 310;
    txt(px, 52, "online softmax", { size: 11, weight: 700, fill: C.fg });
    txt(px, 70, "one row of the active Q tile", { size: 9, fill: C.dim });
    txt(px, 96, "m = " + (stats.m === -Infinity ? "−∞" : stats.m.toFixed(2)), { size: 11, fill: C.accent, mono: true });
    txt(px + 110, 96, "ℓ = " + stats.l.toFixed(2), { size: 11, fill: C.ok, mono: true });
    txt(px, 120, "O = " + (stats.l > 0 ? (stats.o / stats.l).toFixed(2) : "—"), { size: 11, fill: C.purple, mono: true });
    txt(px, 142, "row " + stats.row + " · K/V tile " + (stats.kMax < 0 ? "—" : stats.kMax), { size: 8.5, fill: C.dim, mono: true });

    txt(px, 176, "m′ = max(m, rowmax(S))", { size: 9.5, fill: C.fg, mono: true });
    txt(px, 194, "ℓ′ = e^{m−m′}ℓ + rowsum(e^{S−m′})", { size: 9.5, fill: C.fg, mono: true });
    txt(px, 212, "O′ = e^{m−m′}O + e^{S−m′}V", { size: 9.5, fill: C.fg, mono: true });
    txt(px, 236, "No N×N matrix leaves SRAM.", { size: 9, fill: C.ok });

    art.appendChild(s("rect", { x: px, y: 254, width: 390, height: 86, rx: 9, fill: C.panel, "fill-opacity": 0.6, stroke: C.line }));
    txt(px + 12, 274, "on-chip working set", { size: 9, weight: 700, fill: C.dim });
    ["Q tile", "K tile", "V tile", "O tile"].forEach((label, i) => {
      const bx = px + 12 + (i % 2) * 150;
      const by = 286 + Math.floor(i / 2) * 24;
      art.appendChild(s("rect", { x: bx, y: by, width: 132, height: 17, rx: 5, fill: i === 3 ? C.purple : C.accent, "fill-opacity": 0.14, stroke: i === 3 ? C.purple : C.accent, "stroke-opacity": 0.7 }));
      txt(bx + 8, by + 12, label, { size: 8.5, fill: C.fg, mono: true });
    });
    txt(px + 310, 274, "SRAM", { size: 8.5, fill: C.dim, anchor: "end" });

    svgBtn(art, 310, 370, 82, "▶ Step", () => { stopTile(); if (tileStep < tileTotal()) tileStep += 1; render(); });
    svgBtn(art, 400, 370, 92, tilePlaying ? "⏸ Pause" : "▶ Run", () => { toggleTile(); });
    svgBtn(art, 500, 370, 80, "↺ Reset", () => { stopTile(); tileStep = 0; render(); });
    svgBtn(art, 588, 370, 100, causal ? "Causal: on" : "Causal: off", () => { stopTile(); causal = !causal; tileStep = Math.min(tileStep, tileTotal()); render(); }, true);

    txt(20, 405, "Each block updates the running statistics; the tile is discarded after use.", { size: 8.5, fill: C.dim });
    txt(20, 423, "Only Q, K, V, O stream through HBM.", { size: 8.5, fill: C.ok });
    txt(20, 452, "step " + tileStep + " / " + tileTotal(), { size: 9.5, fill: C.dim, mono: true });
  }

  /* ------------------------------ section 3 ------------------------------ */

  function drawV2(art: SVGSVGElement): void {
    art.appendChild(marker("arw-v2", C.dim));
    const gx = 20;
    const gy = 48;
    const bw = 64;
    const bh = 48;
    const gap = 9;
    txt(gx, 30, "thread blocks", { size: 9.5, weight: 700, fill: C.dim });
    txt(gx + 150, 30, mode === "v1" ? "one CTA per (batch, head)" : "Q split across CTAs", { size: 9, fill: mode === "v1" ? C.warn : C.ok });

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const active = mode === "v2" || r === 0;
        const x = gx + c * (bw + gap);
        const y = gy + r * (bh + gap);
        const color = active ? (mode === "v1" ? C.warn : C.accent) : C.dim;
        art.appendChild(s("rect", { x, y, width: bw, height: bh, rx: 7, fill: active ? color : C.panel, "fill-opacity": active ? 0.16 : 0.4, stroke: color, "stroke-opacity": active ? 0.8 : 0.3 }));
        art.appendChild(txt(x + 10, y + 19, mode === "v1" ? "batch " + (r + 1) : "Q" + (r + 1), { size: 9, fill: active ? C.fg : C.dim, mono: true, weight: 700 }));
        art.appendChild(txt(x + 10, y + 35, "head " + (c + 1), { size: 8, fill: C.dim, mono: true }));
      }
    }
    txt(gx, 286, mode === "v1" ? "4 CTAs active · occupancy 25–40%" : "16 CTAs active · occupancy 50–73%", { size: 9.5, fill: mode === "v1" ? C.warn : C.ok });

    // small warp fan-out
    const wx = 330;
    txt(wx, 52, "within one CTA", { size: 9.5, weight: 700, fill: C.dim });
    for (let w = 0; w < 4; w++) {
      const y = 72 + w * 28;
      art.appendChild(s("rect", { x: wx, y, width: 88, height: 20, rx: 5, fill: C.panel2, stroke: C.line }));
      txt(wx + 8, y + 13, "warp " + w, { size: 8.5, fill: C.fg, mono: true });
      art.appendChild(s("line", { x1: wx + 88, y1: y + 10, x2: wx + 130, y2: y + 10, stroke: C.accent, "stroke-opacity": 0.7 }));
      txt(wx + 138, y + 13, "Q part", { size: 8.5, fill: C.accent });
    }
    txt(wx, 200, "warps split Q; K/V stay shared", { size: 9, fill: C.dim });
    txt(wx, 220, "less shared-memory traffic", { size: 9, fill: C.ok });

    bar(art, 520, 78, 160, mode === "v1" ? 0.32 : 0.62, mode === "v1" ? C.warn : C.ok, "A100 utilization", mode === "v1" ? "25–40%" : "50–73%");
    txt(520, 132, "v1 → v2", { size: 11, weight: 700, fill: C.fg });
    txt(520, 152, "≈ 2× faster", { size: 16, fill: C.ok, weight: 700 });
    txt(520, 174, "up to 225 TFLOPs/s", { size: 9.5, fill: C.fg, mono: true });
    txt(520, 190, "72% MFU on A100", { size: 9, fill: C.dim });
    txt(520, 214, "Fewer non-matmul FLOPs,", { size: 8.5, fill: C.dim });
    txt(520, 228, "more blocks, less SMEM churn.", { size: 8.5, fill: C.dim });

    svgBtn(art, 20, 320, 90, "v1", () => { mode = "v1"; render(); }, true);
    svgBtn(art, 118, 320, 90, "v2", () => { mode = "v2"; render(); }, true);
    txt(220, 338, "toggle the block schedule", { size: 8.5, fill: C.dim });
  }

  /* ------------------------------ section 4 ------------------------------ */

  function stopPipe(): void {
    if (pipeTimer !== null) {
      window.clearTimeout(pipeTimer);
      pipeTimer = null;
    }
  }

  function togglePipe(): void {
    if (pipeTimer !== null) {
      stopPipe();
      render();
      return;
    }
    if (pipeStep >= 12) pipeStep = 0;
    const tick = (): void => {
      if (pipeStep >= 12) {
        stopPipe();
        render();
        return;
      }
      pipeStep += 1;
      render();
      pipeTimer = window.setTimeout(tick, 260);
    };
    pipeTimer = window.setTimeout(tick, 260);
    render();
  }

  function blockRow(art: SVGSVGElement, y: number, label: string, spans: Array<[number, number, string]>, color: string): void {
    txt(20, y + 14, label, { size: 8.5, fill: C.dim, mono: true });
    for (const [start, len, text] of spans) {
      art.appendChild(s("rect", { x: 100 + start * 48, y, width: len * 48 - 3, height: 22, rx: 5, fill: color, "fill-opacity": 0.2, stroke: color, "stroke-opacity": 0.75 }));
      txt(100 + start * 48 + 6, y + 15, text, { size: 7.5, fill: C.fg, mono: true });
    }
  }

  function drawV3(art: SVGSVGElement): void {
    txt(20, 26, "iteration timeline", { size: 9.5, weight: 700, fill: C.dim });
    txt(170, 26, pipeMode === "v2" ? "v2: stages run in sequence" : "v3: producer / consumer overlap", { size: 9, fill: pipeMode === "v2" ? C.warn : C.ok });

    if (pipeMode === "v2") {
      blockRow(art, 46, "load", [[0, 3, "TMA"], [4, 3, "TMA"], [8, 3, "TMA"]], C.accent);
      blockRow(art, 82, "MMA", [[3, 2, "WGMMA"], [7, 2, "WGMMA"], [11, 1, "WGMMA"]], C.purple);
      blockRow(art, 118, "softmax", [[5, 2, "exp"], [9, 2, "exp"]], C.warn);
      blockRow(art, 154, "correction", [[6, 1, "rescale"], [10, 1, "rescale"]], C.bad);
    } else {
      blockRow(art, 46, "load", [[0, 2, "TMA"], [3, 2, "TMA"], [6, 2, "TMA"], [9, 2, "TMA"]], C.accent);
      blockRow(art, 82, "MMA", [[2, 2, "WGMMA"], [5, 2, "WGMMA"], [8, 2, "WGMMA"], [11, 1, "WGMMA"]], C.purple);
      blockRow(art, 118, "softmax", [[3, 2, "exp"], [6, 2, "exp"], [9, 2, "exp"]], C.warn);
      blockRow(art, 154, "correction", [[4, 1, "rescale"], [7, 1, "rescale"], [10, 1, "rescale"]], C.bad);
      txt(100, 196, "producer warps keep TMA busy; consumer warps never wait on a full tile.", { size: 8.5, fill: C.ok });
    }

    if (pipeStep > 0) {
      const x = 100 + (pipeStep % 12) * 48;
      art.appendChild(s("line", { x1: x, y1: 38, x2: x, y2: 190, stroke: C.fg, "stroke-opacity": 0.55, "stroke-dasharray": "3 3" }));
    }

    const facts: Array<[string, string]> = [
      ["1.5–2×", "faster than v2"],
      ["740 TFLOPs/s", "FP16 · 75% of H100"],
      ["~1.2 PFLOPs/s", "FP8 · 2.6× lower error"],
    ];
    facts.forEach(([big, small], i) => {
      const x = 20 + i * 227;
      art.appendChild(s("rect", { x, y: 206, width: 215, height: 56, rx: 9, fill: C.panel, "fill-opacity": 0.6, stroke: C.line }));
      txt(x + 12, 228, big, { size: 13, weight: 700, fill: C.ok, mono: true });
      txt(x + 12, 246, small, { size: 8.5, fill: C.dim });
    });

    svgBtn(art, 20, 290, 90, "v2", () => { stopPipe(); pipeMode = "v2"; pipeStep = 0; render(); }, true);
    svgBtn(art, 118, 290, 90, "v3", () => { stopPipe(); pipeMode = "v3"; pipeStep = 0; render(); }, true);
    svgBtn(art, 216, 290, 96, pipeTimer !== null ? "⏸ Pause" : "▶ Play", () => { togglePipe(); }, true);
    svgBtn(art, 320, 290, 80, "↺ Reset", () => { stopPipe(); pipeStep = 0; render(); }, true);
    txt(410, 308, "playhead moves one pipeline slot at a time", { size: 8.5, fill: C.dim });
    txt(20, 350, "TMA: bulk async copy · WGMMA: warp-group matrix multiply · softmax: exp + rescale", { size: 8.5, fill: C.dim });
  }

  /* ------------------------------ section 5 ------------------------------ */

  function drawV4(art: SVGSVGElement): void {
    art.appendChild(marker("arw-v4", C.teal));
    txt(20, 28, "Blackwell: asymmetric scaling", { size: 9.5, weight: 700, fill: C.dim });
    bar(art, 20, 58, 220, 1, C.accent, "tensor-core throughput", "2×");
    bar(art, 20, 110, 220, 0.5, C.dim, "shared-memory bandwidth", "1×");
    bar(art, 20, 162, 220, 0.5, C.bad, "exp / softmax units", "1×");
    txt(20, 214, "The matmuls got faster; the softmax path did not.", { size: 9, fill: C.dim });
    txt(20, 230, "v4 moves work off the slow units.", { size: 9, fill: C.ok });

    txt(280, 56, "v4 techniques", { size: 9.5, weight: 700, fill: C.dim });
    const chips = ["fully async MMA", "larger tiles", "software exp", "conditional rescale", "tensor memory", "2-CTA MMA"];
    chips.forEach((chip, i) => {
      const x = 280;
      const y = 72 + i * 28;
      art.appendChild(s("rect", { x, y, width: 180, height: 21, rx: 5, fill: C.purple, "fill-opacity": 0.12, stroke: C.purple, "stroke-opacity": 0.55 }));
      txt(x + 8, y + 14, chip, { size: 8.5, fill: C.fg, mono: true });
    });
    // 2-CTA sketch
    art.appendChild(s("rect", { x: 280, y: 250, width: 90, height: 42, rx: 7, fill: C.panel, stroke: C.teal }));
    art.appendChild(txt(325, 268, "CTA 0", { anchor: "middle", size: 9, fill: C.teal, weight: 700 }));
    art.appendChild(txt(325, 283, "TMEM", { anchor: "middle", size: 8, fill: C.dim, mono: true }));
    art.appendChild(s("rect", { x: 390, y: 250, width: 90, height: 42, rx: 7, fill: C.panel, stroke: C.teal }));
    art.appendChild(txt(435, 268, "CTA 1", { anchor: "middle", size: 9, fill: C.teal, weight: 700 }));
    art.appendChild(txt(435, 283, "TMEM", { anchor: "middle", size: 8, fill: C.dim, mono: true }));
    art.appendChild(s("line", { x1: 370, y1: 271, x2: 390, y2: 271, stroke: C.teal, "stroke-width": 1.5, "marker-end": "url(#arw-v4)" }));
    txt(380, 244, "2-CTA MMA", { anchor: "middle", size: 8, fill: C.teal });

    txt(540, 56, "reported on B200 / GB200", { size: 9.5, weight: 700, fill: C.dim });
    txt(540, 82, "1.3×", { size: 18, fill: C.ok, weight: 700 });
    txt(595, 82, "vs cuDNN 9.13", { size: 9, fill: C.dim });
    txt(540, 108, "2.7×", { size: 18, fill: C.ok, weight: 700 });
    txt(595, 108, "vs Triton", { size: 9, fill: C.dim });
    txt(540, 134, "1613 TFLOPs/s", { size: 11, fill: C.fg, mono: true });
    txt(540, 150, "BF16 · 71% utilization", { size: 8.5, fill: C.dim });
    txt(540, 174, "20–30× faster compile", { size: 8.5, fill: C.purple });
    txt(540, 188, "CuTe-DSL in Python", { size: 8.5, fill: C.dim });

    txt(20, 330, "v3 → v4 is not a bigger tile alone: it is a different balance of GEMM, softmax, and data movement.", { size: 9, fill: C.fg });
    txt(20, 348, "The kernel keeps the same exact online-softmax recurrence.", { size: 9, fill: C.ok });
  }

  /* ------------------------------ section 6 ------------------------------ */

  const GENS = [
    {
      v: "v1",
      year: "2022",
      hw: "A100",
      idea: "IO-aware tiling",
      detail: "Tiling + online softmax + recomputation. Exact attention without an N×N matrix in HBM. 2–4× over optimized baselines.",
      color: C.accent,
    },
    {
      v: "v2",
      year: "2023",
      hw: "A100",
      idea: "Work partitioning",
      detail: "Parallelize over sequence length; split warps; reduce non-matmul FLOPs. ≈2× over v1, 50–73% of A100 peak.",
      color: C.ok,
    },
    {
      v: "v3",
      year: "2024",
      hw: "H100",
      idea: "Asynchrony + FP8",
      detail: "TMA, WGMMA, warp specialization, interleaved matmul/softmax. 1.5–2× over v2, 75% of H100 peak; FP8 near 1.2 PFLOPs/s.",
      color: C.purple,
    },
    {
      v: "v4",
      year: "2026",
      hw: "B200",
      idea: "Blackwell co-design",
      detail: "Fully async MMA, larger tiles, TMEM, 2-CTA MMA, emulated exp. 1.3× over cuDNN, 2.7× over Triton, 71% of B200 peak.",
      color: C.teal,
    },
  ];

  function drawTimeline(art: SVGSVGElement): void {
    art.appendChild(marker("arw-gen", C.dim));
    art.appendChild(s("line", { x1: 30, y1: 38, x2: 690, y2: 38, stroke: C.line, "stroke-width": 2 }));
    GENS.forEach((g, i) => {
      const x = 20 + i * 172;
      const on = i === gen;
      const y = 54;
      const w = 158;
      const h = 188;
      const gEl = s("g", { cursor: "pointer" });
      gEl.addEventListener("click", () => { gen = i; render(); });
      gEl.appendChild(s("rect", { x, y, width: w, height: h, rx: 10, fill: on ? g.color : C.panel, "fill-opacity": on ? 0.14 : 0.55, stroke: on ? g.color : C.line, "stroke-width": on ? 1.8 : 1 }));
      gEl.appendChild(txt(x + 12, y + 24, g.v, { size: 16, weight: 700, fill: on ? g.color : C.fg }));
      gEl.appendChild(txt(x + w - 12, y + 24, g.year, { size: 9, anchor: "end", fill: C.dim, mono: true }));
      gEl.appendChild(txt(x + 12, y + 48, g.hw, { size: 8.5, fill: C.dim, mono: true }));
      gEl.appendChild(txt(x + 12, y + 78, g.idea, { size: 9.5, fill: on ? C.fg : C.dim, weight: on ? 700 : 400 }));
      for (let k = 0; k < 3; k++) {
        gEl.appendChild(s("rect", { x: x + 12, y: y + 96 + k * 20, width: w - 24 - k * 18, height: 7, rx: 3, fill: g.color, "fill-opacity": 0.18 + k * 0.12 }));
      }
      gEl.appendChild(txt(x + 12, y + h - 12, on ? "selected" : "click", { size: 8, fill: on ? g.color : C.dim, mono: true }));
      art.appendChild(gEl);
    });

    const d = GENS[gen];
    art.appendChild(s("rect", { x: 20, y: 264, width: 680, height: 92, rx: 10, fill: C.panel, "fill-opacity": 0.65, stroke: d.color, "stroke-opacity": 0.6 }));
    art.appendChild(txt(34, 288, d.v + " · " + d.hw + " · " + d.year, { size: 11, weight: 700, fill: d.color }));
    art.appendChild(txt(34, 310, d.detail.slice(0, 96), { size: 9.5, fill: C.fg }));
    art.appendChild(txt(34, 328, d.detail.slice(96), { size: 9.5, fill: C.fg }));
    art.appendChild(txt(34, 346, "Same loop: tile, online softmax, exact attention.", { size: 8.5, fill: C.dim }));
    txt(20, 386, "Click a generation to compare the changes.", { size: 8.5, fill: C.dim });

    svgBtn(art, 20, 400, 74, "v1", () => { gen = 0; render(); });
    svgBtn(art, 102, 400, 74, "v2", () => { gen = 1; render(); });
    svgBtn(art, 184, 400, 74, "v3", () => { gen = 2; render(); });
    svgBtn(art, 266, 400, 74, "v4", () => { gen = 3; render(); });
  }

  render();
  return { destroy(): void { stopTile(); stopPipe(); } };
};

export default kvFlash;
