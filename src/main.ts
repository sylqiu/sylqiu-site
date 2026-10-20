/**
 * Site router + views.
 *
 * One site, five surfaces. The landing page stays deliberately minimal: name,
 * one line, links, and pointers. Detail lives on the linked pages.
 *
 *   #/                    minimal landing  (name, role, links, three doors)
 *   #/research            publications
 *   #/courses             ExploreFlow course index
 *   #/courses/:id         one course's outline
 *   #/lesson/:id          lesson player (boxes, scenes, beats, checks)
 *   #/blog                post index (migrated blogspot archive)
 *   #/blog/:id            single post
 */
import 'katex/dist/katex.min.css';
import './styles/site.css';
import { mountScene, type SceneHost } from './lib/registry.ts';
import { Narration } from './lib/narration.ts';
import { publications, site, exploreFlow, authorsHtml, cv, blogCategories, illustrations } from './lib/site.ts';
import type { Block, CourseManifest, Lesson } from './lib/types.ts';

const app = document.getElementById('app')!;
const topnav = document.getElementById('topnav')!;

let courses: CourseManifest[] = [];
const lessonCache = new Map<string, Lesson>();
const postCache = new Map<string, BlogPost>();
const progress = new Set<string>(JSON.parse(localStorage.getItem('exploreflow:progress') || '[]'));

interface BlogIndexEntry {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  source?: string;
}

interface BlogPost extends BlogIndexEntry {
  html: string;
}

const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function saveProgress() {
  localStorage.setItem('exploreflow:progress', JSON.stringify([...progress]));
}

async function fetchJson<T>(path: string): Promise<T | null> {
  const res = await fetch(path);
  if (!res.ok) return null;
  return (await res.json()) as T;
}

/* ---------------------------------- nav ---------------------------------- */

const NAV = [
  { href: '#/', label: 'Home' },
  { href: '#/illustrations', label: 'Illustrations' },
];

function renderNav() {
  topnav.innerHTML = NAV.map(
    (item) => `<a href="${item.href}" data-nav="${item.href}">${esc(item.label)}</a>`,
  ).join('');
}

function markActiveNav(hash: string) {
  const path = hash.split('?')[0] || '#/';
  topnav.querySelectorAll<HTMLAnchorElement>('a[data-nav]').forEach((a) => {
    const target = a.dataset.nav || '#/';
    const active = target === '#/' ? path === '#/' : path === target || path.startsWith(target + '/');
    a.classList.toggle('active', active);
  });
}

/* --------------------------------- landing -------------------------------- */

function viewHome() {
  // Deliberately tiny: the site's sections, stacked and alphabetical.
  const links = [
    { label: 'Curriculum Vitae', href: '#/cv' },
    { label: 'Interactive Illustrations', href: '#/illustrations' },
    { label: 'Writing', href: '#/blog' },
  ]
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`)
    .join('');

  app.innerHTML = `
    <section class="landing">
      <nav class="landing-nav">${links}</nav>
    </section>
  `;
}

/* ----------------------------- illustrations ------------------------------ */

let illustrationHost: SceneHost | null = null;
let lastRoutedHash = "";

function viewIllustrations() {
  // Index page: one row per illustration, each linking to its own page.
  const items = illustrations
    .map(
      (ill) => `<a class="ill-card-link" href="#/illustrations/${esc(ill.id)}">
        <h2>${esc(ill.title)}</h2>
        <p>${esc(ill.blurb)}</p>
        <span class="ill-open">Open →</span>
      </a>`,
    )
    .join('');

  app.innerHTML = `<article class="page">
    <header>
      <h1>Interactive Illustrations</h1>
      <p class="reading">Small, self-contained pictures of ideas I keep re-deriving. Each one has
      its own page and is meant to be played with.</p>
    </header>
    <nav class="ill-index">${items || '<p class="dim">Nothing here yet.</p>'}</nav>
  </article>`;
}

async function viewIllustration(id: string) {
  const ill = illustrations.find((x) => x.id === id);
  if (!ill) {
    app.innerHTML = `<article class="page">
      <header><h1>Not here</h1></header>
      <p>No illustration <code>${esc(id)}</code>.</p>
      <p><a href="#/illustrations">← All illustrations</a></p>
    </article>`;
    return;
  }

  app.innerHTML = `<article class="page">
    <header>
      <a class="back" href="#/illustrations">← All illustrations</a>
      <h1>${esc(ill.title)}</h1>
    </header>
    <div class="ill-canvas" id="ill-stage"></div>
  </article>`;

  const mount = app.querySelector<HTMLElement>('#ill-stage');
  if (!mount) return;
  const illustration = await mountScene(ill.scene, mount, []);
  if (!document.contains(mount)) {
    illustration?.destroy();
    return;
  }
  illustrationHost = illustration;
}

/* ----------------------------------- cv ----------------------------------- */

function viewCv() {
  const orgs = cv.experience
    .map((o) => {
      const roles = o.roles
        .map(
          (r) => `<div class="cv-role">
          <span class="cv-title">${esc(r.title)}</span>
          <span class="cv-when">${esc(r.dates)}</span>
        </div>`,
        )
        .join('');
      return `<div class="cv-org">
        <h3 class="cv-org-name">${esc(o.org)}${o.place ? ` <span class="cv-place">${esc(o.place)}</span>` : ''}</h3>
        ${roles}
      </div>`;
    })
    .join('');

  const pubs = publications
    .map((p) => {
      const title = p.href
        ? `<a href="${esc(p.href)}" target="_blank" rel="noopener">${esc(p.title)}</a>`
        : esc(p.title);
      const extra = p.links
        .map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
        .join(' · ');
      return `<article class="pub">
        <div class="pub-body">
          <h3 class="pub-title">${title}</h3>
          <p class="pub-authors">${authorsHtml(p.authors)}</p>
          <p class="pub-venue"><em>${esc(p.venue)}</em></p>
          ${extra ? `<p class="pub-links">${extra}</p>` : ''}
          <p class="pub-blurb">${esc(p.blurb)}</p>
        </div>
      </article>`;
    })
    .join('');

  app.innerHTML = `<article class="page cv">
    <header>
      <h1>${esc(site.name)}</h1>
    </header>

    <section class="cv-section">
      <h2>Experience</h2>
      ${orgs}
    </section>

    <section class="cv-section">
      <h2>Publications
        <a class="cv-scholar" href="https://scholar.google.com.hk/citations?user=ZYVfX7UAAAAJ&hl" target="_blank" rel="noopener">Google Scholar ↗</a>
      </h2>
      <div class="pubs">${pubs}</div>
    </section>

  </article>`;
}

/* -------------------------------- research -------------------------------- */

/* ------------------------------ exploreflow ------------------------------- */

function viewExploreFlow() {
  const cards = [
    {
      href: '#/research',
      title: 'Research',
      blurb: `${publications.length} publications — graphics, vision, geometry.`,
    },
    {
      href: '#/blog',
      title: 'Writing',
      blurb: 'Notes on analysis, geometry, and numerical methods.',
    },
    {
      href: '#/courses',
      title: 'Courses',
      blurb: courses.length
        ? `${courses.length} interactive course${courses.length === 1 ? '' : 's'} with live demos and narration.`
        : 'Interactive courses with live demos and narration.',
    },
  ]
    .map(
      (c) => `<a class="door" href="${c.href}">
        <span class="door-title">${esc(c.title)}</span>
        <span class="door-blurb">${esc(c.blurb)}</span>
      </a>`,
    )
    .join('');

  app.innerHTML = `<article class="page">
    <header>
      <h1>${esc(exploreFlow.name)}</h1>
      <p class="reading">${esc(exploreFlow.tagline)}</p>
    </header>
    <div class="doors">${cards}</div>
  </article>`;
}

function viewResearch() {
  const pubs = publications
    .map((p) => {
      const images = p.images
        .map(
          (src, i) =>
            `<img src="${esc(src)}" alt="" class="${i === 0 ? 'pub-img primary' : 'pub-img secondary'}" loading="lazy" />`,
        )
        .join('');
      const title = p.href
        ? `<a href="${esc(p.href)}" target="_blank" rel="noopener">${esc(p.title)}</a>`
        : esc(p.title);
      const extra = p.links
        .map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">[${esc(l.label)}]</a>`)
        .join(' ');
      const media = p.images.length
        ? `<div class="pub-media${p.images.length > 1 ? ' swap' : ''}">${images}</div>`
        : '';
      return `<article class="pub">
        ${media}
        <div class="pub-body">
          <h3 class="pub-title">${title}</h3>
          <p class="pub-authors">${authorsHtml(p.authors)}</p>
          <p class="pub-venue"><em>${esc(p.venue)}</em></p>
          ${extra ? `<p class="pub-links">${extra}</p>` : ''}
          <p class="pub-blurb">${esc(p.blurb)}</p>
        </div>
      </article>`;
    })
    .join('');

  app.innerHTML = `<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Research</h1>
      <p class="reading">Selected publications. Full list on
      <a href="https://scholar.google.com.hk/citations?user=ZYVfX7UAAAAJ&hl" target="_blank" rel="noopener">Google Scholar</a>.</p>
    </header>
    <div class="pubs">${pubs}</div>
  </article>`;
}

/* --------------------------------- courses -------------------------------- */

function viewCourses() {
  if (!courses.length) {
    app.innerHTML = `<article class="page"><header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1></header>
      <p class="dim">No courses built yet.</p></article>`;
    return;
  }
  const cards = courses
    .map((c) => {
      const lessonCount = c.modules.reduce((n, m) => n + m.lessons.length, 0);
      const done = c.modules.flatMap((m) => m.lessons).filter((id) => progress.has(id)).length;
      return `<a class="course-card" href="#/courses/${esc(c.id)}">
        <span class="course-title">${esc(c.title)}</span>
        ${c.subtitle ? `<span class="course-sub">${esc(c.subtitle)}</span>` : ''}
        <span class="course-meta">${lessonCount} lesson${lessonCount === 1 ? '' : 's'}${
          done ? ` · ${done} done` : ''
        }</span>
        <span class="door-arrow">→</span>
      </a>`;
    })
    .join('');
  app.innerHTML = `<article class="page">
    <header>
      <a class="back" href="#/exploreflow">← ExploreFlow</a>
      <h1>Courses</h1>
      <p class="reading">${esc(exploreFlow.blurb)}</p>
    </header>
    <div class="courses">${cards}</div>
  </article>`;
}

function viewCourse(id: string) {
  const course = courses.find((c) => c.id === id);
  if (!course) {
    app.innerHTML = `<article class="page"><header><h1>Not found</h1></header>
      <p>No course <code>${esc(id)}</code>. <a href="#/courses">All courses</a></p></article>`;
    return;
  }
  const modules = course.modules
    .map(
      (m) => `<section class="mod">
        <h2>${esc(m.title)}</h2>
        ${m.lessons.length
          ? `<ul>${m.lessons
              .map(
                (lid) =>
                  `<li><a href="#/lesson/${esc(lid)}">${esc(lid)}</a>${
                    progress.has(lid) ? ' <span class="done">✓</span>' : ''
                  }</li>`,
              )
              .join('')}</ul>`
          : '<p class="dim">Not written yet.</p>'}
      </section>`,
    )
    .join('');
  app.innerHTML = `<article class="page">
    <a class="back" href="#/courses">← ${esc(exploreFlow.name)}</a>
    <header><h1>${esc(course.title)}</h1></header>
    ${course.subtitle ? `<p class="sub">${esc(course.subtitle)}</p>` : ''}
    ${modules}
  </article>`;
}

/* ---------------------------------- blog ---------------------------------- */

async function viewBlog() {
  const index = await fetchJson<BlogIndexEntry[]>('./data/blog.json');
  if (!index) {
    app.innerHTML = `<article class="page"><header><h1>Writing</h1></header><p class="dim">Nothing built.</p></article>`;
    return;
  }

  const item = (p: BlogIndexEntry) => `<li class="post">
        <a class="post-title" href="#/blog/${esc(p.id)}">${esc(p.title)}</a>
        <span class="post-date">${esc(p.date)}</span>
      </li>`;

  // File each post under the first category whose tags it carries.
  const groups = blogCategories.map((c) => ({ name: c.name, posts: [] as BlogIndexEntry[] }));
  const other: BlogIndexEntry[] = [];
  for (const p of index) {
    const gi = blogCategories.findIndex((c) => p.tags.some((t) => c.tags.includes(t)));
    if (gi < 0) other.push(p);
    else groups[gi].posts.push(p);
  }
  if (other.length) groups.push({ name: 'Other', posts: other });

  const sections = groups
    .filter((g) => g.posts.length)
    .map(
      (g) => `<section class="blog-cat">
        <h2>${esc(g.name)}<span class="blog-cat-count">${g.posts.length}</span></h2>
        <ul class="post-list">${g.posts.map(item).join('')}</ul>
      </section>`,
    )
    .join('');

  app.innerHTML = `<article class="page">
    <header>
      <h1>Writing</h1>
      <p class="reading">${index.length} notes, grouped by topic.</p>
    </header>
    ${sections}
  </article>`;
}

async function viewPost(id: string) {
  let post = postCache.get(id);
  if (!post) {
    const fetched = await fetchJson<BlogPost>(`./data/blog/${id}.json`);
    if (!fetched) {
      app.innerHTML = `<article class="page"><header><h1>Not found</h1></header><p>No post <code>${esc(id)}</code>.</p></article>`;
      return;
    }
    post = fetched;
    postCache.set(id, post);
  }
  app.innerHTML = `<article class="post-view">
    <a class="back" href="#/blog">← All posts</a>
    <header>
      <h1>${esc(post.title)}</h1>
      <div class="meta">${esc(post.date)}</div>
      <p class="post-tags">${post.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>
    </header>
    <div class="prose">${post.html}</div>
    ${post.source ? `<footer class="post-source">Originally posted at <a href="${esc(post.source)}" target="_blank" rel="noopener">blogspot</a>.</footer>` : ''}
  </article>`;
}

/* ------------------------------ lesson render ----------------------------- */

function renderBox(block: Extract<Block, { kind: 'box' }>): string {
  const title = block.title ? `<div class="box-title">${block.title}</div>` : '';
  return `<section class="box box-${block.box}">${title}<div class="box-body">${block.html}</div></section>`;
}

function renderCheck(block: Extract<Block, { kind: 'check' }>): string {
  const options = block.check.options
    .map(
      (o, i) =>
        `<button class="opt" data-correct="${o.correct}" data-i="${i}">
          <span class="opt-mark"></span><span>${o.text}</span></button>`,
    )
    .join('');
  return `<section class="check" data-qid="${esc(block.check.qid)}">
    <div class="check-q">${block.check.question}</div>
    <div class="check-opts">${options}</div>
    <div class="check-exp" hidden>${block.check.explanation}</div>
  </section>`;
}

function renderScene(block: Extract<Block, { kind: 'scene' }>): string {
  const beats = block.beats
    .map(
      (b, i) =>
        `<button class="beat" data-beat="${i}"><span class="beat-n">${i + 1}</span>${esc(b.text)}</button>`,
    )
    .join('');
  return `<section class="sceneblock" data-scene="${esc(block.id)}" style="--scene-h:${block.height}px">
    <div class="scene-head">
      <span class="scene-id">${esc(block.id)}</span>
      ${block.title ? `<span class="scene-title">${esc(block.title)}</span>` : ''}
      <div class="scene-ctl">
        <button class="btn play" type="button">Play</button>
        <button class="btn reset" type="button">Reset</button>
      </div>
    </div>
    <div class="scene-canvas"></div>
    <div class="beats">${beats || '<span class="dim">No narration beats.</span>'}</div>
  </section>`;
}

function renderLessonBody(lesson: Lesson): string {
  return lesson.blocks
    .map((block) => {
      switch (block.kind) {
        case 'md':
          return `<div class="prose">${block.html}</div>`;
        case 'box':
          return renderBox(block);
        case 'scene':
          return renderScene(block);
        case 'check':
          return renderCheck(block);
      }
    })
    .join('');
}

/* --------------------------- scene + narration --------------------------- */

interface SceneHandle {
  host: SceneHost | null;
  narration: Narration;
}

const activeScenes = new Map<HTMLElement, SceneHandle>();

async function wireScene(section: HTMLElement, block: Extract<Block, { kind: 'scene' }>, lesson: Lesson) {
  const canvas = section.querySelector<HTMLElement>('.scene-canvas')!;
  const beatEls = [...section.querySelectorAll<HTMLElement>('.beat')];
  const playBtn = section.querySelector<HTMLButtonElement>('.play')!;
  const resetBtn = section.querySelector<HTMLButtonElement>('.reset')!;

  const audio = lesson.audio ? new Audio(`./media/${lesson.audio}`) : null;
  if (audio) audio.preload = 'auto';
  const host = await mountScene(block.id, canvas, block.beats.map((b) => b.text));

  const narration = new Narration({
    beats: block.beats,
    audio,
    onBeat: (index) => {
      beatEls.forEach((el, i) => el.classList.toggle('active', i === index));
      beatEls[index]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      playBtn.textContent = index >= block.beats.length - 1 ? 'Replay' : 'Playing…';
    },
    onSceneBeat: (index) => host?.play?.(index),
  });

  activeScenes.set(section, { host, narration });

  playBtn.addEventListener('click', () => {
    narration.stop();
    audio?.pause();
    if (audio) {
      audio.currentTime = 0;
      void audio.play();
    }
    narration.start();
  });
  resetBtn.addEventListener('click', () => {
    narration.stop();
    audio?.pause();
    host?.reset?.();
    beatEls.forEach((el) => el.classList.remove('active'));
    playBtn.textContent = 'Play';
  });
  beatEls.forEach((el) =>
    el.addEventListener('click', () => {
      audio?.pause();
      narration.goto(Number(el.dataset.beat));
    }),
  );
}

async function viewLesson(id: string) {
  let lesson = lessonCache.get(id);
  if (!lesson) {
    const fetched = await fetchJson<Lesson>(`./data/lessons/${id}.json`);
    if (!fetched) {
      app.innerHTML = `<article class="page"><header><h1>Not built yet</h1></header>
        <p>No lesson <code>${esc(id)}</code>.</p>
        <p>Add <code>content/courses/&lt;course&gt;/**/${esc(id)}.md</code>, set <code>publish: true</code>, then run <code>npm run build:lessons</code>.</p></article>`;
      return;
    }
    lesson = fetched;
    lessonCache.set(id, lesson);
  }

  const reading = lesson.reading
    ? `<p class="reading">Reading: ${
        lesson.reading.url
          ? `<a href="${esc(lesson.reading.url)}" target="_blank" rel="noopener">${esc(lesson.reading.text)}</a>`
          : esc(lesson.reading.text)
      }</p>`
    : '';
  const back = lesson.courseId
    ? `<a class="back" href="#/courses/${esc(lesson.courseId)}">← Course</a>`
    : '';

  app.innerHTML = `<article class="lesson">
    <header>
      ${back}
      <h1>${esc(lesson.title)}</h1>
      <div class="meta">${esc(lesson.module)} · ${esc(lesson.kind)}</div>
      ${reading}
    </header>
    ${renderLessonBody(lesson)}
  </article>`;

  for (const block of lesson.blocks) {
    if (block.kind !== 'scene') continue;
    const section = app.querySelector<HTMLElement>(`[data-scene="${block.id}"]`);
    if (section) await wireScene(section, block, lesson);
  }

  for (const check of app.querySelectorAll<HTMLElement>('.check')) {
    check.addEventListener('click', (event) => {
      const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('.opt');
      if (!btn || btn.disabled) return;
      const correct = btn.dataset.correct === 'true';
      btn.classList.add(correct ? 'ok' : 'bad');
      check.querySelectorAll<HTMLButtonElement>('.opt').forEach((b) => {
        if (b.dataset.correct === 'true') b.classList.add('ok');
        b.disabled = true;
      });
      check.querySelector<HTMLElement>('.check-exp')!.hidden = false;
      if (correct) {
        progress.add(id);
        saveProgress();
      }
    });
  }
}

/* --------------------------------- routing -------------------------------- */

function teardown() {
  for (const [section, handle] of activeScenes) {
    try {
      handle.narration.stop();
      handle.host?.destroy();
      section.replaceWith(section.cloneNode(false));
    } catch (error) {
      console.warn("scene teardown failed", error);
    }
  }
  activeScenes.clear();
  try {
    illustrationHost?.destroy();
  } catch (error) {
    console.warn("illustration teardown failed", error);
  } finally {
    illustrationHost = null;
  }
}

function route() {
  const hash = location.hash || '#/';
  window.scrollTo(0, 0);
  if (hash === lastRoutedHash) return;
  lastRoutedHash = hash;
  teardown();
  markActiveNav(hash);

  const post = hash.match(/^#\/blog\/(.+)$/);
  if (post) return void viewPost(post[1]);

  const lesson = hash.match(/^#\/lesson\/(.+)$/);
  if (lesson) return void viewLesson(lesson[1]);

  const course = hash.match(/^#\/courses\/(.+)$/);
  if (course) return void viewCourse(course[1]);

  if (hash.startsWith('#/exploreflow')) return void viewExploreFlow();
  if (hash.startsWith('#/cv')) return void viewCv();
  const illustration = hash.match(/^#\/illustrations\/(.+)$/);
  if (illustration) return void viewIllustration(illustration[1]);
  if (hash.startsWith('#/illustrations')) return void viewIllustrations();
  if (hash.startsWith('#/blog')) return void viewBlog();
  if (hash.startsWith('#/courses')) return void viewCourses();
  if (hash.startsWith('#/research')) return void viewResearch();

  viewHome();
  window.scrollTo(0, 0);
}

async function boot() {
  courses = (await fetchJson<CourseManifest[]>('./data/courses.json')) || [];
  renderNav();
  document.addEventListener('click', (event) => {
    const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#/"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;
    event.preventDefault();
    if (location.hash === href) {
      route();
    } else {
      location.hash = href;
      route();
    }
  });
  window.addEventListener('hashchange', route);
  route();
}

void boot();
