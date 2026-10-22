/**
 * Build step. Markdown stays the source of truth; this writes the JSON the site
 * fetches.
 *
 *   content/courses/<course-id>/course.yaml   -> course outline
 *   content/courses/<course-id>/**.md         -> public/data/lessons/<id>.json
 *   content/blog/**.md                        -> public/data/blog/<id>.json
 *
 * Drafts (`publish: false`) are skipped, never published.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { parseLesson, renderMarkdown, splitFrontmatter } from '../src/lib/markdown.ts';
import { loadCourses, loadCourseManifest } from '../src/lib/course.ts';
import type { CourseManifest, Lesson } from '../src/lib/types.ts';

const ROOT = new URL('..', import.meta.url).pathname;
const CONTENT = join(ROOT, 'content');
const COURSES = join(CONTENT, 'courses');
const BLOG = join(CONTENT, 'blog');
const OUT = join(ROOT, 'public', 'data');

function walk(dir: string, skip: string[] = []): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      if (skip.includes(entry.name)) return [];
      return walk(join(dir, entry.name), skip);
    }
    return entry.name.endsWith('.md') ? [join(dir, entry.name)] : [];
  });
}

let errors = 0;

/* --------------------------------- lessons -------------------------------- */

rmSync(join(OUT, 'lessons'), { recursive: true, force: true });
mkdirSync(join(OUT, 'lessons'), { recursive: true });

const courseDirs = existsSync(COURSES)
  ? readdirSync(COURSES, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => join(COURSES, e.name))
  : [];

const courses: CourseManifest[] = [];
const written = new Map<string, Lesson>();

for (const dir of courseDirs) {
  const manifestPath = join(dir, 'course.yaml');
  if (!existsSync(manifestPath)) {
    console.log(`  warn   ${relative(ROOT, dir)} has no course.yaml — skipped`);
    continue;
  }
  const manifest = loadCourseManifest(manifestPath);
  courses.push(manifest);

  for (const file of walk(dir)) {
    const rel = relative(ROOT, file);
    const source = readFileSync(file, 'utf8');
    const { lesson, notes } = parseLesson(source, rel);

    for (const note of notes) {
      if (note.level === 'error') errors++;
      console.log(`  ${note.level === 'error' ? 'error' : 'warn '}  ${note.message}`);
    }
    if (notes.some((n) => n.level === 'error')) continue;
    if (!/^publish:\s*true\s*$/m.test(source)) {
      console.log(`  skip   ${rel} (publish: false)`);
      continue;
    }

    const id = lesson.id || basename(file, '.md');
    if (written.has(id)) {
      console.log(`  error  duplicate lesson id "${id}" (also in ${written.get(id)!.courseId})`);
      errors++;
      continue;
    }
    lesson.courseId = manifest.id;
    writeFileSync(join(OUT, 'lessons', `${id}.json`), JSON.stringify(lesson, null, 2), 'utf8');
    written.set(id, lesson);
  }

  const ids = new Set(manifest.modules.flatMap((m) => m.lessons));
  for (const [id, lesson] of written) {
    if (lesson.courseId === manifest.id && !ids.has(id)) {
      console.log(`  warn   lesson "${id}" is published but absent from ${manifest.id}/course.yaml`);
    }
  }
  for (const id of ids) {
    if (!written.has(id)) console.log(`  warn   ${manifest.id}/course.yaml lists "${id}" but no published lesson has that id`);
  }
}

courses.sort((a, b) => a.title.localeCompare(b.title));
writeFileSync(join(OUT, 'courses.json'), JSON.stringify(courses, null, 2), 'utf8');

/* ---------------------------------- blog ---------------------------------- */

interface BlogImage {
  src: string;
  alt: string;
}

interface BlogIndexEntry {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  /** First few paragraphs, plain text, shown as the index-card preview. */
  preview: string[];
  /** Every image in the post, in document order. */
  images: BlogImage[];
  source?: string;
}

/**
 * First few real paragraphs of a rendered post, as HTML with KaTeX intact.
 * Math-only lines, captions, and stray fragments are skipped so the preview
 * always reads as prose.
 */
function previewParagraphs(html: string, count = 2): string[] {
  const out: string[] = [];
  for (const match of html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const inner = match[1];
    const text = inner
      // Drop KaTeX's MathML twin only for the readability test.
      .replace(/<span class="katex-mathml">[\s\S]*?<\/span>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length < 60) continue;
    if ((text.match(/[A-Za-z]{2,}/g) || []).length < 8) continue;
    out.push(inner.trim());
    if (out.length >= count) break;
  }
  return out;
}

/** All <img> tags in a rendered post, deduped by src, in document order. */
function postImages(html: string): BlogImage[] {
  const seen = new Set<string>();
  const images: BlogImage[] = [];
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const src = (tag.match(/src=["']([^"']+)["']/i) || [])[1];
    if (!src || seen.has(src)) continue;
    const alt = (tag.match(/alt=["']([^"']*)["']/i) || [])[1] || '';
    seen.add(src);
    images.push({ src, alt });
  }
  return images;
}

rmSync(join(OUT, 'blog'), { recursive: true, force: true });
mkdirSync(join(OUT, 'blog'), { recursive: true });

const blogIndex: BlogIndexEntry[] = [];

if (existsSync(BLOG)) {
  for (const name of readdirSync(BLOG)) {
    if (!name.endsWith('.md')) continue;
    const source = readFileSync(join(BLOG, name), 'utf8');
    if (!/^publish:\s*true\s*$/m.test(source)) continue;

    const { data, body } = splitFrontmatter(source);
    const html = renderMarkdown(body);
    const id = String(data.id || basename(name, '.md'));
    const plain = html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
    const preview = previewParagraphs(html);
    const images = postImages(html);

    writeFileSync(
      join(OUT, 'blog', `${id}.json`),
      JSON.stringify(
        {
          id,
          title: String(data.title || id),
          date: String(data.date || ''),
          tags: data.tags || [],
          source: data.source,
          preview,
          images,
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
      excerpt: plain.slice(0, 200) + (plain.length > 200 ? '…' : ''),
      preview,
      images,
      source: data.source,
    });
  }
}

blogIndex.sort((a, b) => (a.date < b.date ? 1 : -1));
writeFileSync(join(OUT, 'blog.json'), JSON.stringify(blogIndex, null, 2), 'utf8');

console.log(
  `\n${written.size} lesson(s) across ${courses.length} course(s), ${blogIndex.length} blog post(s). ${errors} error(s).`,
);
if (errors) process.exitCode = 1;
