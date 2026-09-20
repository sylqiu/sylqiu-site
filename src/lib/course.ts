import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { CourseManifest } from './types.ts';

/** Read `content/course.yaml` — the course outline (modules + lesson order). */
export function loadCourseManifest(contentDir: string): CourseManifest {
  const text = readFileSync(join(contentDir, 'course.yaml'), 'utf8');
  const data = parseYaml(text) as Partial<CourseManifest>;
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
