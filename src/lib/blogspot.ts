/**
 * Normalize LaTeX from the Blogger/Blogspot archive.
 *
 * The archive stores inline math as dollar spans, but with the TeX backslashes
 * *doubled* (e.g. double-backslash mathbb, in, rightarrow) and literal brackets
 * escaped (e.g. backslash-bracket 0,infinity or K backslash-bracket x,y).
 * remark-math only understands the normal dollar delimiters, and KaTeX reads a
 * doubled backslash as a line break, so every migrated formula renders as
 * garbage.
 *
 * We locate the math spans with remark-math itself (robust pairing), then
 * rewrite only the text inside them. Prose and escaped citation brackets such
 * as backslash-bracket A are left untouched, because Markdown already renders
 * those correctly as literal [A].
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath);

/** Un-double the archive backslashes and unescape brackets inside one span. */
export function fixMathTeX(tex: string): string {
  return tex
    .replace(/\\\\/g, '\\')
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')');
}

interface Span {
  start: number;
  end: number;
}

function collect(node: any, out: Span[]): void {
  if (!node || typeof node !== 'object') return;
  if (
    (node.type === 'inlineMath' || node.type === 'math') &&
    node.position &&
    node.position.start &&
    node.position.end &&
    typeof node.position.start.offset === 'number' &&
    typeof node.position.end.offset === 'number'
  ) {
    out.push({ start: node.position.start.offset, end: node.position.end.offset });
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) collect(child, out);
  }
}

/** Rewrite every math span in a markdown body so KaTeX renders it correctly. */
export function fixBlogspotMathBody(body: string): string {
  const tree: any = parser.parse(body);
  const spans: Span[] = [];
  collect(tree, spans);
  // Replace from the end so earlier offsets stay valid.
  spans.sort((a, b) => b.start - a.start);
  let out = body;
  for (const { start, end } of spans) {
    out = out.slice(0, start) + fixMathTeX(out.slice(start, end)) + out.slice(end);
  }
  return out;
}
