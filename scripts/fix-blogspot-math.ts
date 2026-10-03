/**
 * One-off migration: rewrite the LaTeX in `content/blog/*.md` so the existing
 * remark-math -> KaTeX pipeline renders it. See `src/lib/blogspot.ts` for the
 * specific damage the Blogger archive import left behind.
 *
 *   node scripts/fix-blogspot-math.ts        # rewrite in place
 *   node scripts/fix-blogspot-math.ts --dry  # report only
 *
 * Frontmatter is preserved byte-for-byte; only the body is normalized.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fixBlogspotMathBody } from '../src/lib/blogspot.ts';

const BLOG = new URL('../content/blog', import.meta.url).pathname;
const dry = process.argv.includes('--dry');
let changed = 0;

for (const name of readdirSync(BLOG)) {
  if (!name.endsWith('.md')) continue;
  const path = join(BLOG, name);
  const src = readFileSync(path, 'utf8');
  const m = src.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  const head = m ? m[1] : '';
  const body = m ? m[2] : src;
  const fixed = fixBlogspotMathBody(body);
  if (fixed === body) continue;
  changed++;
  if (dry) {
    console.log('would fix', name);
    continue;
  }
  writeFileSync(path, head + fixed, 'utf8');
  console.log('fixed', name);
}

console.log(`${dry ? 'would change' : 'changed'} ${changed} file(s)`);
