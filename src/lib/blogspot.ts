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

function collectNullLinks(node: any, out: Span[]): void {
  if (!node || typeof node !== 'object') return;
  if (
    node.type === 'link' &&
    node.url === 'https://www.blogger.com/null' &&
    node.position &&
    node.position.start &&
    node.position.end &&
    typeof node.position.start.offset === 'number' &&
    typeof node.position.end.offset === 'number'
  ) {
    out.push({ start: node.position.start.offset, end: node.position.end.offset });
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) collectNullLinks(child, out);
  }
}

const NULL_LINK_SUFFIX = '](https://www.blogger.com/null)';

/**
 * Strip two Blogger archive artifacts:
 *  - links to the meaningless https://www.blogger.com/null anchor: unwrap the
 *    link text (or drop the link when the text is empty), and
 *  - \tag{...} equation tags, which KaTeX only allows in *display* math while
 *    the archive stored these equations inline.
 */
export function cleanBlogspotArtifacts(body: string): string {
  const tree: any = parser.parse(body);
  const links: Span[] = [];
  collectNullLinks(tree, links);
  // Replace from the end so earlier offsets stay valid.
  links.sort((a, b) => b.start - a.start);
  let out = body;
  for (const { start, end } of links) {
    const raw = body.slice(start, end);
    const text = raw.endsWith(NULL_LINK_SUFFIX)
      ? raw.slice(1, raw.length - NULL_LINK_SUFFIX.length)
      : raw;
    out = out.slice(0, start) + text + out.slice(end);
  }
  return (
    out
      // Equation tags are meaningless without display math, and KaTeX rejects
      // them inline.
      .replace(/\\tag\{[^}]*\}/g, '')
      // MathJax control spaces (\ ) become plain spaces: KaTeX ignores plain
      // spaces in math mode but errors on a trailing control space. Do not
      // touch a doubled backslash (a \\ line break) that happens to precede a
      // space.
      .replace(/(?<!\\)\\ /g, ' ')
      // eqnarray is not a KaTeX environment; aligned is the closest match.
      .replace(/\\begin\{eqnarray\}/g, '\\begin{aligned}')
      .replace(/\\end\{eqnarray\}/g, '\\end{aligned}')
      .replace(/\\nonumber/g, '')
      // KaTeX has \text but not \mbox; \ensuremath is a no-op wrapper.
      .replace(/\\mbox\{/g, '\\text{')
      .replace(/\\ensuremath\{/g, '{')
      // A line-leading \= is a MathJax macron accent; here it is a relation.
      .replace(/(^|\n)\\=\s/g, '$1= ')
      // \quad is invalid inside \text{...}.
      .replace(/(\\text\{[^}]*?)\\quad/g, '$1')
  );
}
