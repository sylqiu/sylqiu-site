/**
 * One-off cleanup of Blogger archive artifacts left in content/blog/*.md:
 * meaningless link targets (https://www.blogger.com/null) and \tag{...}
 * equation tags that KaTeX rejects in inline math.
 *
 *   node scripts/clean-blogspot.ts        # rewrite in place
 *   node scripts/clean-blogspot.ts --dry  # report only
 *
 * Frontmatter is preserved byte-for-byte; only the body is touched.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { cleanBlogspotArtifacts } from '../src/lib/blogspot.ts';

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
  const fixed = cleanBlogspotArtifacts(body);
  if (fixed === body) continue;
  changed++;
  if (dry) {
    console.log('would clean', name);
    continue;
  }
  writeFileSync(path, head + fixed, 'utf8');
  console.log('cleaned', name);
}

console.log(`${dry ? 'would change' : 'changed'} ${changed} file(s)`);
