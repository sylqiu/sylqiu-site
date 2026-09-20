/**
 * Scene registry.
 *
 * A `::scene{id="..."}` block in markdown resolves to one factory here. Scenes
 * are hand-written code and lazy-loaded, so a lesson ships only the demo it
 * actually uses.
 *
 * Contract — a scene factory receives its mount element and returns an object:
 *   destroy()   stop timers / observers
 *   play(beat)  jump to the visual state for narration beat `beat` (0-based)
 *   reset()     return to the opening state
 * `play` is optional: a scene that ignores narration still works (narration
 * simply becomes a caption strip).
 */

export interface SceneHost {
  /** Called by the narration engine when the active beat changes. */
  play?(beat: number): void;
  destroy(): void;
}

export type SceneFactory = (el: HTMLElement, opts: { beats: string[] }) => SceneHost;

const registry: Record<string, () => Promise<{ default: SceneFactory }>> = {
  'hybrid-chain': () => import('../scenes/hybrid-chain.ts'),
  'stat-vs-comp': () => import('../scenes/stat-vs-comp.ts'),
  'prg-stretch': () => import('../scenes/prg-stretch.ts'),
};

export function knownScenes(): string[] {
  return Object.keys(registry);
}

export async function mountScene(
  id: string,
  el: HTMLElement,
  beats: string[],
): Promise<SceneHost | null> {
  const load = registry[id];
  if (!load) {
    el.innerHTML = `<div class="scene-missing">Unknown scene <code>${id}</code>.<br>
      Known: ${knownScenes().map((s) => `<code>${s}</code>`).join(', ')}</div>`;
    return null;
  }
  const mod = await load();
  return mod.default(el, { beats });
}
