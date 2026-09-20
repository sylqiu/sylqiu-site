/**
 * Lesson markdown -> structured blocks.
 *
 * The authoring format is ordinary markdown plus a few directives, so the same
 * file is readable in any editor, diffs cleanly, and can be handed to an LLM as
 * context without being mangled (LaTeX stays as `$$...$$`, not JSON escapes).
 *
 *   :::def{#prg title="Pseudorandom generator"}   container "box"
 *   :::thm / :::proof / :::con / :::ex / :::rem
 *   ::scene{id="hybrid-chain" height="460"}       leaf: interactive demo
 *   :::narration{scene="hybrid-chain"}            ordered list -> beats
 *   :::check{qid="hy-1"}                          quiz
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import { parse as parseYaml } from 'yaml';
import type { Beat, Block, BoxKind, CheckBlock, Lesson } from './types.ts';

const mdParser = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ['yaml'])
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkDirective);

const toHtmlProc = unified()
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex, { throwOnError: false })
  .use(rehypeStringify, { allowDangerousHtml: true });

/** Serialize a run of mdast nodes to an HTML fragment (KaTeX applied). */
function toHtml(nodes: any[]): string {
  const root = { type: 'root', children: nodes };
  const hast = toHtmlProc.runSync(root as any) as any;
  return String(toHtmlProc.stringify(hast));
}

/** Plain text of an mdast subtree — used for narration lines. */
function textOf(node: any): string {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  const kids = node.children || [];
  return kids.map(textOf).join('').trim();
}

const BOX_KINDS = new Set<BoxKind>(['def', 'thm', 'proof', 'con', 'ex', 'rem']);

const BOX_LABEL: Record<BoxKind, string> = {
  def: 'Definition',
  thm: 'Theorem',
  proof: 'Proof',
  con: 'Construction',
  ex: 'Example',
  rem: 'Remark',
};

interface Note {
  level: 'error' | 'warn';
  message: string;
}

/** Parse one lesson markdown file. Returns the lesson plus validation notes. */
export function parseLesson(source: string, path: string): { lesson: Lesson; notes: Note[] } {
  const notes: Note[] = [];
  const tree = mdParser.parse(source) as any;
  const children: any[] = tree.children || [];

  const frontmatter = children.find((n) => n.type === 'yaml');
  const data: Record<string, any> = frontmatter ? parseYaml(frontmatter.value) || {} : {};

  const blocks: Block[] = [];
  // `:::narration{scene="x"}` attaches its beats to the nearest following scene
  // with that id, so the prose stays editable independently of the scene code.
  const pendingNarration = new Map<string, Beat[]>();
  let lastSceneId: string | null = null;

  const push = (node: any) => blocks.push(node);
  const flushMd = (nodes: any[]) => {
    if (!nodes.length) return;
    const html = toHtml(nodes).trim();
    if (html) push({ kind: 'md', html });
  };

  const buffer: any[] = [];
  for (const node of children) {
    if (node.type === 'yaml') continue;

    if (node.type === 'containerDirective' && BOX_KINDS.has(node.name as BoxKind)) {
      flushMd(buffer.splice(0));
      const box = node.name as BoxKind;
      const attrs = node.attributes || {};
      const title = attrs.title || node.label || (box === 'proof' ? '' : BOX_LABEL[box]);
      push({ kind: 'box', box, title, html: toHtml(node.children || []) });
      continue;
    }

    if (node.type === 'leafDirective' && node.name === 'scene') {
      flushMd(buffer.splice(0));
      const attrs = node.attributes || {};
      const id = String(attrs.id || node.label || '').trim();
      if (!id) {
        notes.push({ level: 'error', message: `${path}: ::scene without an id` });
        continue;
      }
      lastSceneId = id;
      push({
        kind: 'scene',
        id,
        title: String(attrs.title || ''),
        height: Number(attrs.height || 420),
        beats: pendingNarration.get(id) || [],
      });
      continue;
    }

    if (node.type === 'containerDirective' && node.name === 'narration') {
      const attrs = node.attributes || {};
      const sceneId = String(attrs.scene || lastSceneId || '').trim();
      const beats: Beat[] = [];
      for (const child of node.children || []) {
        if (child.type !== 'list') {
          notes.push({ level: 'warn', message: `${path}: :::narration expects a bullet list of lines` });
          continue;
        }
        for (const item of child.children || []) {
          const text = textOf(item);
          if (text) beats.push({ text });
        }
      }
      pendingNarration.set(sceneId, beats);
      // back-fill if the scene was declared first
      const scene = blocks.find((b) => b.kind === 'scene' && b.id === sceneId) as
        | Extract<Block, { kind: 'scene' }>
        | undefined;
      if (scene) scene.beats = beats;
      else
        notes.push({
          level: 'warn',
          message: `${path}: :::narration names scene "${sceneId}" but no ::scene with that id follows`,
        });
      continue;
    }

    if (node.type === 'containerDirective' && node.name === 'check') {
      flushMd(buffer.splice(0));
      const attrs = node.attributes || {};
      const qid = String(attrs.qid || node.label || '').trim();
      const check = parseCheck(node, qid, path, notes);
      if (check) push({ kind: 'check', check });
      continue;
    }

    if (node.type === 'containerDirective' || node.type === 'leafDirective') {
      notes.push({ level: 'warn', message: `${path}: unknown directive ":::${node.name}" — rendered as markdown` });
    }
    buffer.push(node);
  }
  flushMd(buffer);

  const lesson: Lesson = {
    id: String(data.id || ''),
    module: String(data.module || ''),
    kind: String(data.kind || 'theory'),
    title: String(data.title || ''),
    reading: data.reading,
    audio: data.audio,
    blocks,
  };

  for (const key of ['id', 'module', 'title'] as const) {
    if (!lesson[key]) notes.push({ level: 'error', message: `${path}: frontmatter is missing "${key}"` });
  }
  if (!lesson.blocks.some((b) => b.kind === 'scene')) {
    notes.push({ level: 'warn', message: `${path}: no ::scene block — nothing interactive on this page` });
  }
  return { lesson, notes };
}

function parseCheck(
  node: any,
  qid: string,
  path: string,
  notes: Note[],
): CheckBlock | null {
  let question = '';
  let explanation = '';
  const options: { text: string; correct: boolean }[] = [];

  for (const child of node.children || []) {
    if (child.type === 'list') {
      for (const item of child.children || []) {
        const text = textOf(item);
        if (!text) continue;
        // `- [x] correct` / `- [ ] wrong` — a GFM task list, so the checkbox
        // survives in any markdown preview and parses reliably.
        const correct = item.checked === true;
        options.push({ text, correct });
      }
      continue;
    }
    const text = textOf(child);
    if (!text) continue;
    if (!question) question = text;
    else explanation = explanation ? `${explanation}\n\n${text}` : text;
  }

  if (!qid) notes.push({ level: 'error', message: `${path}: :::check without a qid` });
  const correctCount = options.filter((o) => o.correct).length;
  if (options.length < 2) notes.push({ level: 'error', message: `${path}: :::check "${qid}" needs at least 2 options` });
  if (correctCount !== 1)
    notes.push({ level: 'error', message: `${path}: :::check "${qid}" must mark exactly one option [x] (found ${correctCount})` });

  return { qid, question, options, explanation };
}
