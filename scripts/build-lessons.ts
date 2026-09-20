/**
 * Build step:
 *   - every markdown file under `content/` (excluding blog/) -> public/data/lessons/
 *   - every markdown file under `content/blog/`             -> public/data/blog/
 *   - plus public/data/courses.json and public/data/blog.json
 *
 * Markdown stays the source of truth for authors; JSON is what the site
 * fetches. Drafts (`publish: false`) are skipped, not published.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { parseLesson, renderMarkdown, splitFrontmatter } from '../src/lib/markdown.ts';
import { loadCourseManifest } from '../src/lib/course.ts';
import type { Lesson } from '../src/lib/types.ts';

const ROOT = new URL('..', import.meta.url).pathname;
const CONTENT = join(ROOT, 'content');
const OUT = join(ROOT, 'public', 'data');
const BLOG_DIR = join(CONTENT, 'blog');

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'blog') return [];
      return walk(full);
    }
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

const manifest = loadCourseManifest(CONTENT);
mkdirSync(join(OUT, 'lessons'), { recursive: true });
rmSync(join(OUT, 'blog'), { recursive: true, force: true });
mkdirSync(join(OUT, 'blog'), { recursive: true });

let errors = 0;
let written = 0;
const published: Lesson[] = [];

for (const file of walk(CONTENT)) {
  const source = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file);
  const { lesson, notes } = parseLesson(source, rel);

  const publish = /^publish:\s*true\s*$/m.test(source);
  for (const note of notes) {
    if (note.level === 'error') errors++;
    console.log(`  ${note.level === 'error' ? 'error' : 'warn '}  ${note.message}`);
  }
  if (notes.some((n) => n.level === 'error')) continue;
  if (!publish) {
    console.log(`  skip   ${rel} (publish: false)`);
    continue;
  }

  const id = lesson.id || basename(file, '.md');
  writeFileSync(join(OUT, 'lessons', `${id}.json`), JSON.stringify(lesson, null, 2), 'utf8');
  published.push(lesson);
  written++;
}

/* ---------------------------------- blog ---------------------------------- */

interface BlogIndexEntry {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  source?: string;
}

const blogIndex: BlogIndexEntry[] = [];
let posts = 0;

if (existsSync(BLOG_DIR)) {
  for (const name of readdirSync(BLOG_DIR).sort().reverse()) {
    if (!name.endsWith('.md')) continue;
    const file = join(BLOG_DIR, name);
    const source = readFileSync(file, 'utf8');
    if (!/^publish:\s*true\s*$/m.test(source)) continue;

    const { data, body } = splitFrontmatter(source);
    const html = renderMarkdown(body);
    const id = String(data.id || basename(name, '.md'));
    const plain = html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    writeFileSync(
      join(OUT, 'blog', `${id}.json`),
      JSON.stringify(
        {
          id,
          title: String(data.title || id),
          date: String(data.date || ''),
          tags: data.tags || [],
          source: data.source,
          html,
        },
        null,
        2,
      ),
      'utf8',
    );

    blogIndex.push({
      id,
      title: String(data.title || id),
      date: String(data.date || ''),
      tags: data.tags || [],
      excerpt: plain.slice(0, 180) + (plain.length > 180 ? '…' : ''),
      source: data.source,
    });
    posts++;
  }
}

blogIndex.sort((a, b) => (a.date < b.date ? 1 : -1));
writeFileSync(join(OUT, 'blog.json'), JSON.stringify(blogIndex, null, 2), 'utf8');

/* -------------------------------- manifest -------------------------------- */

const manifestIds = new Set(manifest.modules.flatMap((m) => m.lessons));
for (const lesson of published) {
  if (!manifestIds.has(lesson.id)) console.log(`  warn   lesson "${lesson.id}" is published but absent from course.yaml`);
}
for (const id of manifestIds) {
  if (!published.some((l) => l.id === id)) console.log(`  warn   course.yaml lists "${id}" but no published lesson has that id`);
}

writeFileSync(join(OUT, 'courses.json'), JSON.stringify([manifest], null, 2), 'utf8');
console.log(`\n${written} lesson(s), ${posts} blog post(s) written. ${errors} error(s).`);
if (errors) process.exitCode = 1;
