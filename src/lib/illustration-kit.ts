/**
 * Shared primitives for the interactive illustrations.
 *
 * The scenes are hand-built SVG, not a charting library. Keep the palette, type
 * scale, motion defaults, and the persistent control layer here so a new scene
 * looks and behaves like the existing ones.
 */
const NS = "http://www.w3.org/2000/svg";

export const C = {
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
} as const;

export function s<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

export interface TxtOpts {
  fill?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
  mono?: boolean;
  weight?: number;
}

export function txtInto(
  parent: SVGElement,
  x: number,
  y: number,
  content: string,
  o: TxtOpts = {},
): SVGTextElement {
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
  parent.appendChild(t);
  return t;
}

export function wrapText(text: string, width: number): string[] {
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

export function box(
  art: SVGElement,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color: string,
  dim = false,
): void {
  art.appendChild(
    s("rect", {
      x,
      y,
      width: w,
      height: h,
      rx: 9,
      fill: C.panel,
      "fill-opacity": dim ? 0.3 : 0.7,
      stroke: color,
      "stroke-opacity": dim ? 0.3 : 0.7,
    }),
  );
  txtInto(art, x + 12, y + 22, title, { size: 11, weight: 700, fill: dim ? C.dim : color });
  txtInto(art, x + 12, y + 41, sub, { size: 8.5, fill: C.dim });
}

export function bar(
  art: SVGElement,
  x: number,
  y: number,
  w: number,
  frac: number,
  color: string,
  label: string,
  value: string,
): void {
  txtInto(art, x, y - 6, label, { size: 9.5, fill: C.dim });
  art.appendChild(s("rect", { x, y, width: w, height: 12, rx: 6, fill: C.panel2, stroke: C.line }));
  art.appendChild(
    s("rect", {
      x,
      y,
      width: Math.max(2, w * Math.min(1, frac)),
      height: 12,
      rx: 6,
      fill: color,
      "fill-opacity": 0.85,
    }),
  );
  txtInto(art, x + w, y + 26, value, { anchor: "end", size: 9, fill: color, mono: true });
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - x, 3);
}

export function segmentEase(phase: number, start: number, end: number): number {
  const t = Math.min(1, Math.max(0, (phase - start) / (end - start)));
  return easeOutCubic(t);
}

/** Default motion values. Scenes can override a duration without changing the feel. */
export const MOTION = {
  stepSeconds: 1.35,
  frameSeconds: 1 / 60,
  ease: easeOutCubic,
  segment: segmentEase,
  seconds(value: number): number {
    return prefersReducedMotion() ? 0.001 : value;
  },
} as const;

type ButtonNode = { g: SVGGElement; rect: SVGRectElement; label: SVGTextElement };

export interface SvgControls {
  /** Reset the per-frame action table; call before drawing a frame. */
  beginFrame(): void;
  /** Draw or update a persistent button. Position is the stable identity. */
  button(x: number, y: number, w: number, label: string, onClick: () => void, on?: boolean): void;
}

/**
 * A persistent control layer for an animated SVG.
 *
 * Do not put buttons in the part of the SVG that is cleared each frame: a tap
 * that begins on a node which is replaced before pointerup is lost on mobile.
 * The control group is a sibling of the animated art group and is never
 * cleared; only its labels and handlers are refreshed.
 */
export function attachSvgControls(svg: SVGSVGElement, art: SVGGElement): SvgControls {
  const layer = s("g", { class: "ill-controls" });
  svg.appendChild(layer);
  const nodes = new Map<string, ButtonNode>();
  let actions = new Map<string, () => void>();
  let lastPointer = 0;

  const run = (target: EventTarget | null): boolean => {
    const g = (target as Element | null)?.closest?.("g[data-btn]");
    if (!g || !svg.contains(g)) return false;
    const action = actions.get(g.getAttribute("data-btn") || "");
    if (!action) return false;
    action();
    return true;
  };

  svg.addEventListener("pointerdown", (event) => {
    lastPointer = Date.now();
    if (run(event.target)) event.preventDefault();
  });
  svg.addEventListener("click", (event) => {
    if (Date.now() - lastPointer < 700) return;
    if (run(event.target)) event.preventDefault();
  });
  svg.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      if (run(event.target)) event.preventDefault();
    }
  });

  return {
    beginFrame(): void {
      actions = new Map();
    },
    button(x, y, w, label, onClick, on = true): void {
      const key = x + "," + y + "," + w;
      let node = nodes.get(key);
      if (!node) {
        const g = s("g", { class: "ill-svg-btn" });
        const rect = s("rect", { x, y, width: w, height: 26, rx: 13 });
        const text = s("text", {
          x: x + w / 2,
          y: y + 17,
          "text-anchor": "middle",
          "font-size": 10.5,
          "font-weight": 600,
        });
        text.textContent = label;
        g.append(rect, text);
        layer.appendChild(g);
        node = { g, rect, label: text };
        nodes.set(key, node);
      }
      const color = on ? C.accent : C.dim;
      node.rect.setAttribute("fill", color);
      node.rect.setAttribute("fill-opacity", String(on ? 0.12 : 0.06));
      node.rect.setAttribute("stroke", color);
      node.label.textContent = label;
      node.label.setAttribute("fill", color);
      node.g.setAttribute("data-btn", key);
      node.g.setAttribute("cursor", on ? "pointer" : "default");
      node.g.setAttribute("role", "button");
      node.g.setAttribute("tabindex", "0");
      node.g.style.display = on ? "" : "none";
      if (on) actions.set(key, onClick);
    },
  };
}
