/**
 * One-off import: blogspot Atom feed -> content/blog/*.md
 *
 * Run once with the feed saved locally:
 *   node scripts/import-blogspot.ts /tmp/blog-full.json
 *
 * Keeps the original post date, tags, and canonical URL so the migrated copy
 * still points back to the archive. Images stay hotlinked to
 * blogger.googleusercontent.com (see README — swapping to local copies is a
 * follow-up).
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import TurndownService from 'turndown';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'content', 'blog');

interface FeedEntry {
  title: { $t: string };
  published: { $t: string };
  content: { $t: string };
  link?: { rel: string; href: string }[];
  category?: { term: string }[];
}

const feedPath = process.argv[2];
if (!feedPath) {
  console.error('usage: node scripts/import-blogspot.ts <feed.json>');
  process.exit(1);
}

const feed = JSON.parse(readFileSync(feedPath, 'utf8')).feed;
const entries: FeedEntry[] = feed.entry || [];

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
});

// Blogspot wraps math in $$ already; turndown would escape underscores inside.
// Protect inline/display math spans before conversion and restore after.
const mathStore: string[] = [];
turndown.addRule('protectMath', {
  filter: (node) =>
    node.nodeType === 1 &&
    /math|katex/i.test((node as HTMLElement).className || '') === true,
  replacement: (content) => {
    mathStore.push(content);
    return `\u0000MATH${mathStore.length - 1}\u0000`;
  },
});

// Keep display math blocks intact.
turndown.addRule('pre', {
  filter: 'pre',
  replacement: (content) => `\n\n\`\`\`\n${content.trim()}\n\`\`\`\n\n`,
});

function slugify(title: string, published: string): string {
  const base = title
    .toLowerCase()
    .replace(/\$[^$]*\$/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
  return `${published}-${base || 'post'}`;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let written = 0;
for (const entry of entries) {
  const title = entry.title.$t.trim();
  const published = entry.published.$t.slice(0, 10);
  const url = entry.link?.find((l) => l.rel === 'alternate')?.href || '';
  const tags = (entry.category || []).map((c) => c.term).filter((t) => t !== 'uncategorized');

  let md = turndown.turndown(entry.content.$t);
  md = md.replace(/\u0000MATH(\d+)\u0000/g, (_, i) => mathStore[Number(i)]);
  md = md.replace(/\u00a0/g, ' ');
  md = md.replace(/^[ \t]+$/gm, '');
  md = md.replace(/\n{3,}/g, '\n\n').trim();

  const id = slugify(title, published);
  const frontmatter = [
    '---',
    `id: ${id}`,
    `title: ${JSON.stringify(title)}`,
    `date: ${published}`,
    `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`,
    url ? `source: ${url}` : null,
    'publish: true',
    '---',
    '',
  ]
    .filter((line) => line !== null)
    .join('\n');

  writeFileSync(join(OUT, `${id}.md`), frontmatter + md + '\n', 'utf8');
  written++;
  console.log(`  ${published}  ${title.slice(0, 60)}`);
}

console.log(`\n${written} post(s) written to content/blog/`);
