/**
 * Scene: hybrid-chain — starter template.
 *
 * This is the file you (the author) hand-edit. It draws a chain of hybrids
 * H₀ … H_k and reacts to narration beats:
 *
 *   beat 0  show the chain
 *   beat 1  highlight that each step flips exactly one coordinate
 *   beat 2  reveal the per-step advantage (each ≤ ε/k)
 *   beat 3  accumulate — the total never exceeds ε
 *
 * `play` is optional. Delete it and the demo still renders; the beats then act
 * as a caption strip.
 */
import type { SceneFactory } from '../lib/registry.ts';

const SVG = 'http://www.w3.org/2000/svg';
const K = 6; // hybrids H₀ … H_k
const COLS = 5; // coordinates per string
const ROWS = 3;

const COLOR_X = '#30363d'; // a coordinate taken from X
const COLOR_Y = '#1f6feb'; // a coordinate taken from Y
const COLOR_DIM = '#8b949e';
const COLOR_FG = '#e6edf3';
const COLOR_STEP = '#d29922';
const COLOR_TOTAL = '#3fb950';
const EPS_PER_STEP = 0.4; // ε/k, exaggerated so it is visible

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

const hybrid: SceneFactory = (host) => {
  const svg = el('svg', { viewBox: '0 0 720 300' });
  host.appendChild(svg);

  const caption = document.createElement('div');
  caption.className = 'scene-caption';
  host.appendChild(caption);

  const marginX = 40;
  const slot = (720 - marginX * 2) / (K + 1);
  const cellW = Math.min(26, (slot - 8) / COLS);
  const cellH = 20;
  const topY = 44;
  const axisY = 208;

  let highlightColumn = -1; // column flipped by the current step

  // --- static axes --------------------------------------------------------
  svg.appendChild(el('line', { x1: marginX, y1: axisY, x2: 720 - marginX, y2: axisY, stroke: '#2a3140' }));

  const epsLabel = el('text', {
    x: 720 - marginX,
    y: axisY - 8,
    'text-anchor': 'end',
    fill: COLOR_DIM,
    'font-size': 12,
  });
  epsLabel.textContent = `each step ≤ ε/${K}`;
  svg.appendChild(epsLabel);

  // --- grid ---------------------------------------------------------------
  const cells: SVGRectElement[][][] = []; // [hybrid][column][row]
  const labels: SVGTextElement[] = [];
  const stepBars: SVGRectElement[] = [];
  const stepLabels: SVGTextElement[] = [];

  for (let i = 0; i <= K; i++) {
    const x0 = marginX + slot * i + (slot - cellW * COLS) / 2;
    const group: SVGRectElement[][] = [];

    for (let c = 0; c < COLS; c++) {
      const column: SVGRectElement[] = [];
      for (let r = 0; r < ROWS; r++) {
        const rect = el('rect', {
          x: x0 + c * cellW + 1,
          y: topY + r * (cellH + 3),
          width: cellW - 2,
          height: cellH,
          rx: 3,
          fill: COLOR_X,
        });
        svg.appendChild(rect);
        column.push(rect);
      }
      group.push(column);
    }
    cells.push(group);

    const label = el('text', {
      x: x0 + (cellW * COLS) / 2,
      y: topY - 14,
      'text-anchor': 'middle',
      fill: COLOR_DIM,
      'font-size': 13,
      'font-family': 'ui-monospace, SFMono-Regular, Menlo, monospace',
    });
    label.textContent = `H${i}`;
    svg.appendChild(label);
    labels.push(label);

    // one advantage bar per transition H_{i-1} → H_i
    if (i > 0) {
      const bar = el('rect', {
        x: marginX + slot * (i - 0.5) - 11,
        y: axisY,
        width: 22,
        height: 0,
        rx: 3,
        fill: COLOR_STEP,
        opacity: 0,
      });
      svg.appendChild(bar);
      stepBars.push(bar);

      const tag = el('text', {
        x: marginX + slot * (i - 0.5),
        y: axisY + 16,
        'text-anchor': 'middle',
        fill: COLOR_DIM,
        'font-size': 11,
        opacity: 0,
      });
      tag.textContent = `${i}`;
      svg.appendChild(tag);
      stepLabels.push(tag);
    }
  }

  // --- state --------------------------------------------------------------
  const captions = [
    `A chain of ${K + 1} hybrids, H₀ … H_${K}`,
    'Each step flips exactly one coordinate — never the whole string',
    `No efficient test detects a single step (advantage ≤ ε/${K})`,
    'Summing all k steps: the endpoints are indistinguishable (total ≤ ε)',
  ];

  function draw() {
    cells.forEach((group, i) => {
      group.forEach((column, c) => {
        const fromY = c < i; // this coordinate has switched to Y
        const isFlipped = c === highlightColumn;
        column.forEach((rect) => {
          rect.setAttribute('fill', fromY ? COLOR_Y : COLOR_X);
          rect.setAttribute('stroke', isFlipped ? COLOR_FG : 'none');
          rect.setAttribute('stroke-width', isFlipped ? '1.5' : '0');
        });
      });
      labels[i].setAttribute('fill', highlightColumn >= 0 ? COLOR_FG : COLOR_DIM);
    });
    stepBars.forEach((bar) => {
      bar.setAttribute('height', highlightColumn >= 0 ? String(EPS_PER_STEP * 150) : '0');
      bar.setAttribute('opacity', highlightColumn >= 0 ? '1' : '0');
    });
    stepLabels.forEach((tag) => tag.setAttribute('opacity', highlightColumn >= 0 ? '1' : '0'));
  }

  function reset() {
    highlightColumn = -1;
    caption.textContent = captions[0];
    draw();
  }

  function play(beat: number) {
    caption.textContent = captions[beat] ?? captions[captions.length - 1];

    if (beat <= 0) highlightColumn = -1;
    else if (beat === 1) highlightColumn = Math.floor(COLS / 2);
    else highlightColumn = COLS - 1;

    const total = beat >= 3;
    stepBars.forEach((bar) => bar.setAttribute('fill', total ? COLOR_TOTAL : COLOR_STEP));
    draw();
  }

  reset();

  return {
    play,
    reset,
    destroy() {
      svg.remove();
      caption.remove();
    },
  };
};

export default hybrid;
