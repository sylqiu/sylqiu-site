/**
 * Scene: stat-vs-comp — starter template.
 *
 * Two histograms whose shapes are obviously different (large statistical
 * distance) yet which no efficient test separates (computational
 * indistinguishability). Draws a coarse projection that makes them overlap.
 *
 * Beats:
 *   0  two visibly different histograms
 *   1  statistical distance is large
 *   2  apply a coarse projection — the images overlap
 *   3  so statistical distance ≠ computational indistinguishability
 *
 * Replace `bin1` / `bin2` with whatever the lesson actually needs — this is a
 * placeholder shape, not real data.
 */
import type { SceneFactory } from '../lib/registry.ts';

const SVG = 'http://www.w3.org/2000/svg';
const W = 720;
const H = 300;
const BINS = 12;

const bin1 = Array.from({ length: BINS }, (_, i) => Math.exp(-((i - 3) ** 2) / 6) + 0.04);
const bin2 = Array.from({ length: BINS }, (_, i) => Math.exp(-((i - 8) ** 2) / 6) + 0.04);

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

const scene: SceneFactory = (host) => {
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}` });
  host.appendChild(svg);

  const caption = document.createElement('div');
  caption.className = 'scene-caption';
  host.appendChild(caption);

  const baseline = H - 60;
  const maxBar = 140;
  const groupW = 250;
  const barW = groupW / BINS;
  const peak = Math.max(...bin1, ...bin2);

  const groups: { x0: number; bars: SVGRectElement[] }[] = [];

  function histogram(x0: number, data: number[]): SVGRectElement[] {
    return data.map((v, i) => {
      const rect = el('rect', {
        x: x0 + i * barW + 1,
        y: baseline - (v / peak) * maxBar,
        width: barW - 2,
        height: (v / peak) * maxBar,
        rx: 2,
        fill: '#1f6feb',
        opacity: 0.85,
      });
      svg.appendChild(rect);
      return rect;
    });
  }

  // left: the true distributions; right: the projections
  groups.push({ x0: 60, bars: histogram(60, bin1) });
  groups.push({ x0: W - 60 - groupW, bars: histogram(W - 60 - groupW, bin2) });

  const captions = [
    'Two distributions — plainly different shapes',
    'Their statistical distance is large: an unbounded observer separates them',
    'Project both onto a coarse linear functional… the images nearly coincide',
    'Computational indistinguishability ≠ statistical closeness',
  ];

  const title = el('text', {
    x: W / 2,
    y: 26,
    'text-anchor': 'middle',
    fill: '#8b949e',
    'font-size': 13,
  });
  title.textContent = 'X';
  svg.appendChild(title);

  const titleRight = el('text', {
    x: W / 2,
    y: 26,
    'text-anchor': 'middle',
    fill: '#8b949e',
    'font-size': 13,
  });
  svg.appendChild(titleRight);

  function reset() {
    groups.forEach((g) => g.bars.forEach((b) => b.setAttribute('opacity', '0.85')));
    caption.textContent = captions[0];
    titleRight.textContent = '';
  }

  function play(beat: number) {
    caption.textContent = captions[beat] ?? captions[captions.length - 1];
    const overlapping = beat >= 2;

    // In the "projected" state both histograms are redrawn as near-identical
    // blurred versions of each other — the visual claim the scene makes.
    groups[1].bars.forEach((bar, i) => {
      const mirror = bin1[BINS - 1 - i];
      const v = overlapping ? (bin1[i] + mirror) / 2 : bin2[i];
      bar.setAttribute('y', String(baseline - (v / peak) * maxBar));
      bar.setAttribute('height', String((v / peak) * maxBar));
      bar.setAttribute('fill', overlapping ? '#3fb950' : '#1f6feb');
    });
    groups[0].bars.forEach((bar) => {
      bar.setAttribute('fill', overlapping ? '#3fb950' : '#1f6feb');
    });

    title.textContent = overlapping ? 'projection of X' : 'X';
    titleRight.textContent = overlapping ? 'projection of Y' : 'Y';
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

export default scene;
