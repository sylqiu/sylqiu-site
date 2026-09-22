/** Shared types for the ExploreFlow lesson format. */

export type BoxKind = 'def' | 'thm' | 'proof' | 'con' | 'ex' | 'rem';

/** One unit of narration. A scene turns these into timed beats. */
export interface Beat {
  /** Narration line, plain text (no markdown). */
  text: string;
  /** Optional per-beat dwell time in seconds when no audio is present. */
  seconds?: number;
}

export interface CheckOption {
  text: string;
  correct: boolean;
}

export interface CheckBlock {
  qid: string;
  question: string;
  options: CheckOption[];
  explanation: string;
}

export type Block =
  | { kind: 'md'; html: string }
  | { kind: 'box'; box: BoxKind; title: string; html: string }
  | { kind: 'scene'; id: string; title: string; height: number; beats: Beat[] }
  | { kind: 'check'; check: CheckBlock };

export interface LessonMeta {
  id: string;
  /** Owning course id (set by the build; not required in frontmatter). */
  courseId?: string;
  module: string;
  kind: string;
  title: string;
  reading?: { text: string; url?: string };
  /** Narration audio for the lesson's scene, if recorded. */
  audio?: string;
}

export interface Lesson extends LessonMeta {
  blocks: Block[];
}

export interface ModuleDef {
  id: string;
  title: string;
  lessons: string[];
}

export interface CourseManifest {
  id: string;
  title: string;
  subtitle?: string;
  modules: ModuleDef[];
}
