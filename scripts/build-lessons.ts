/**
 * Build step: every markdown file under `content/` -> `public/data/lessons/`
 * plus `public/data/courses.json`.
 *
 * The markdown files stay the source of truth for authors; the JSON is what the
 * running site fetches. Nothing is published implicitly — see `publish` in
 * frontmatter (default false), which keeps drafts out of the build.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { parseLesson } from '../src/lib/markdown.ts';
import { loadCourseManifest } from '../src/lib/course.ts';
import type { Lesson } from '../src/lib/types.ts';

const ROOT = new URL('..', import.meta.url).pathname;
const CONTENT = join(ROOT, 'content');
const OUT = join(ROOT, 'public', 'data');

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

const manifest = loadCourseManifest(CONTENT);
mkdirSync(join(OUT, 'lessons'), { recursive: true });

let errors = 0;
let written = 0;
const published: Lesson[] = [];

for (const file of walk(CONTENT)) {
  const source = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file);
  const { lesson, notes } = parseLesson(source, rel);

  // Frontmatter may opt a lesson out of the build.
  const publish = /^publish:\s*true\s*$/m.test(source);
  for (const note of notes) {
    if (note.level === 'error') errors++;
    const tag = note.level === 'error' ? 'error' : 'warn ';
    console.log(`  ${tag}  ${note.message}`);
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

const manifestIds = new Set(manifest.modules.flatMap((m) => m.lessons));
for (const lesson of published) {
  if (!manifestIds.has(lesson.id)) {
    console.log(`  warn   lesson "${lesson.id}" is published but absent from course.yaml`);
  }
}
for (const id of manifestIds) {
  if (!published.some((l) => l.id === id)) {
    console.log(`  warn   course.yaml lists "${id}" but no published lesson has that id`);
  }
}

writeFileSync(join(OUT, 'courses.json'), JSON.stringify([manifest], null, 2), 'utf8');
console.log(`\n${written} lesson(s) written to public/data, ${errors} error(s).`);
if (errors) process.exitCode = 1;
