/**
 * Narration engine — the piece that replaces hand-tuned `self.wait(...)`.
 *
 * A scene owns visual state; narration owns time. Beats advance either from
 * recorded audio (authoritative when present) or from estimated reading time.
 * Whichever clock runs, the scene is told which beat is active, so audio can be
 * regenerated at any time without touching scene code.
 */
import type { Beat } from './types.ts';

const MS_PER_WORD = 380; // ~158 wpm, a calm teaching pace
const MIN_BEAT_MS = 2400;

export function estimateBeatMs(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(MIN_BEAT_MS, Math.round(words * MS_PER_WORD));
}

export interface NarrationOptions {
  beats: Beat[];
  /** Audio element carrying the recorded narration, if any. */
  audio?: HTMLAudioElement | null;
  /** Renders the current line + progress. */
  onBeat(index: number, total: number): void;
  /** Told which beat is active so the scene can set its visual state. */
  onSceneBeat?(index: number): void;
}

export class Narration {
  private index = -1;
  private timer: number | null = null;
  private stopped = false;
  private readonly beatMs: number[];

  constructor(private readonly opts: NarrationOptions) {
    const total = this.opts.audio?.duration;
    const beats = opts.beats;
    if (this.opts.audio && Number.isFinite(total) && total && beats.length) {
      // Distribute audio across beats proportional to reading time, so a long
      // spoken line gets a longer slice. Retiming is now an audio-only concern.
      const weights = beats.map((b) => b.seconds ? b.seconds * 1000 : estimateBeatMs(b.text));
      const sum = weights.reduce((a, b) => a + b, 0);
      this.beatMs = weights.map((w) => (w / sum) * total! * 1000);
    } else {
      this.beatMs = beats.map((b) => (b.seconds ? b.seconds * 1000 : estimateBeatMs(b.text)));
    }
  }

  start(): void {
    this.index = -1;
    this.stopped = false;
    this.advance();
  }

  stop(): void {
    this.stopped = true;
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }

  /** Jump to a beat (e.g. clicking a caption line). */
  goto(index: number): void {
    if (this.stopped) return;
    if (this.timer !== null) clearTimeout(this.timer);
    this.setBeat(index);
    this.schedule();
  }

  private advance(): void {
    if (this.stopped) return;
    this.setBeat(this.index + 1);
    this.schedule();
  }

  private schedule(): void {
    if (this.stopped) return;
    if (this.index >= this.opts.beats.length - 1) return; // hold on the last beat
    const ms = this.beatMs[this.index] ?? MIN_BEAT_MS;
    this.timer = window.setTimeout(() => this.advance(), ms);
  }

  private setBeat(index: number): void {
    if (index === this.index) return;
    this.index = index;
    this.opts.onBeat(index, this.opts.beats.length);
    this.opts.onSceneBeat?.(index);
  }

  get current(): number {
    return this.index;
  }
}
