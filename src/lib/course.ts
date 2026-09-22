import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { CourseManifest } from './types.ts';

/** Read a single `course.yaml` (modules + lesson order). */
export function loadCourseManifest(file: string): CourseManifest {
  const data = parseYaml(readFileSync(file, 'utf8')) as Partial<CourseManifest>;
  return normalise(data);
}

/**
 * Read every course under `<contentDir>/courses/<course-id>/course.yaml`.
 * Each course owns its lessons, so adding a topic means adding one directory.
 */
export function loadCourses(contentDir: string): CourseManifest[] {
  const root = join(contentDir, 'courses');
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => join(root, e.name, 'course.yaml'))
    .filter(existsSync)
    .map(loadCourseManifest)
    .sort((a, b) => a.title.localeCompare(b.title));
}

function normalise(data: Partial<CourseManifest>): CourseManifest {
  return {
    id: data.id || 'course',
    title: data.title || 'Untitled course',
    subtitle: data.subtitle,
    modules: (data.modules || []).map((m) => ({
      id: m.id,
      title: m.title || m.id,
      lessons: m.lessons || [],
    })),
  };
}
