/**
 * Scene: prg-stretch — starter template.
 *
 * A PRG stretches a k-bit seed into ℓ(k) > k bits. The range holds only 2^k
 * points, visibly sparse in {0,1}^ℓ — yet it looks uniform to efficient
 * observers.
 *
 * Beats:
 *   0  a k-bit seed, and G
 *   1  the ℓ(k)-bit output
 *   2  the ambient space is huge; only 2^k points are reachable
 *   3  zoom in: locally the reachable points look uniform
 *
 * The dot field is decorative and deterministic — swap in a real generator
 * (e.g. the BBS construction from the course) when the lesson needs it.
 */
import type { SceneFactory } from '../lib/registry.ts';

const SVG = 'http://www.w3.org/2000/svg';

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

/** Small deterministic PRNG so the picture is stable across reloads. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const scene: SceneFactory = (host) => {
  const svg = el('svg', { viewBox: '0 0 720 300' });
  host.appendChild(svg);

  const caption = document.createElement('div');
  caption.className = 'scene-caption';
  host.appendChild(caption);

  const FLOOR = 230;
  const CEIL = 40;
  const BOX_X = 300;
  const BOX_Y = CEIL;
  const BOX_W = 380;
  const BOX_H = FLOOR - CEIL;

  // seed blob
  svg.appendChild(el('circle', { cx: 90, cy: 120, r: 26, fill: '#1f6feb', opacity: 0.9 }));
  const seedLabel = el('text', { x: 90, y: 126, 'text-anchor': 'middle', fill: '#0d1117', 'font-size': 13, 'font-weight': 700 });
  seedLabel.textContent = 'k';
  svg.appendChild(seedLabel);
  const seedCaption = el('text', { x: 90, y: 170, 'text-anchor': 'middle', fill: '#8b949e', 'font-size': 12 });
  seedCaption.textContent = 'seed, k bits';
  svg.appendChild(seedCaption);

  // G arrow
  const arrow = el('line', { x1: 130, y1: 120, x2: 270, y2: 120, stroke: '#8b949e', 'stroke-width': 1.5, 'marker-end': '' });
  svg.appendChild(arrow);
  const arrowLabel = el('text', { x: 200, y: 108, 'text-anchor': 'middle', fill: '#e6edf3', 'font-size': 14, 'font-family': 'ui-monospace, monospace' });
  arrowLabel.textContent = 'G';
  svg.appendChild(arrowLabel);
  const stretchLabel = el('text', { x: 200, y: 142, 'text-anchor': 'middle', fill: '#8b949e', 'font-size': 11, opacity: 0 });
  stretchLabel.textContent = 'stretches to ℓ(k) > k';
  svg.appendChild(stretchLabel);

  // ambient space
  svg.appendChild(el('rect', { x: BOX_X, y: BOX_Y, width: BOX_W, height: BOX_H, rx: 8, fill: 'none', stroke: '#2a3140' }));
  const spaceLabel = el('text', { x: BOX_X + 8, y: BOX_Y - 10, fill: '#8b949e', 'font-size': 12 });
  spaceLabel.textContent = '{0,1}^ℓ(k)';
  svg.appendChild(spaceLabel);

  // reachable points: sparse
  const rand = mulberry32(7);
  const POINTS = 130;
  const dots: SVGCircleElement[] = [];
  for (let i = 0; i < POINTS; i++) {
    const dot = el('circle', {
      cx: BOX_X + 14 + rand() * (BOX_W - 28),
      cy: BOX_Y + 14 + rand() * (BOX_H - 28),
      r: 2.2,
      fill: '#58a6ff',
      opacity: 0,
    });
    svg.appendChild(dot);
    dots.push(dot);
  }

  const density = el('text', { x: BOX_X + BOX_W - 8, y: FLOOR + 22, 'text-anchor': 'end', fill: '#8b949e', 'font-size': 12, opacity: 0 });
  density.textContent = 'density = 2^k / 2^ℓ = 2^(k−ℓ)';
  svg.appendChild(density);

  const captions = [
    'A k-bit seed, fed to a generator G',
    'G stretches it to ℓ(k) > k bits',
    'The range holds only 2^k points — sparse in {0,1}^ℓ(k)',
    'Zoom in: locally the points look uniform to any efficient test',
  ];

  function reset() {
    dots.forEach((d) => d.setAttribute('opacity', '0'));
    density.setAttribute('opacity', '0');
    stretchLabel.setAttribute('opacity', '0');
    caption.textContent = captions[0];
  }

  function play(beat: number) {
    caption.textContent = captions[beat] ?? captions[captions.length - 1];
    stretchLabel.setAttribute('opacity', beat >= 1 ? '1' : '0');
    dots.forEach((d, i) => {
      // later beats reveal more of the field, then a magnified cluster
      const shown = beat >= 3 ? i < 22 : beat >= 2 ? true : false;
      d.setAttribute('opacity', shown ? (beat >= 3 ? '1' : '0.75') : '0');
      d.setAttribute('r', beat >= 3 ? '4.5' : '2.2');
    });
    density.setAttribute('opacity', beat >= 2 ? '1' : '0');
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
