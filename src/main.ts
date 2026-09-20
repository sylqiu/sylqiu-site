/**
 * Site router + views.
 *
 * One site, four surfaces:
 *   #/            personal page  (bio, publications, links)
 *   #/blog        post index     (migrated blogspot archive)
 *   #/blog/:id    single post
 *   #/course      MathFlow course home
 *   #/lesson/:id  lesson player   (scenes + narration beats)
 */
import 'katex/dist/katex.min.css';
import './styles/site.css';
import { mountScene, type SceneHost } from './lib/registry.ts';
import { Narration } from './lib/narration.ts';
import { publications, site, authorsHtml } from './lib/site.ts';
import type { Block, CourseManifest, Lesson } from './lib/types.ts';

const app = document.getElementById('app')!;
const topnav = document.getElementById('topnav')!;

let course: CourseManifest | null = null;
const lessonCache = new Map<string, Lesson>();
const postCache = new Map<string, BlogPost>();
const progress = new Set<string>(JSON.parse(localStorage.getItem('mf:progress') || '[]'));

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

function saveProgress() {
  localStorage.setItem('mf:progress', JSON.stringify([...progress]));
}

const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function fetchJson<T>(path: string): Promise<T | null> {
  const res = await fetch(path);
  if (!res.ok) return null;
  return (await res.json()) as T;
}

/* --------------------------------- nav ---------------------------------- */

const NAV = [
  { href: '#/', label: 'About' },
  { href: '#/blog', label: 'Blog' },
  { href: '#/course', label: 'MathFlow' },
];

function renderNav() {
  topnav.innerHTML = NAV.map(
    (item) => `<a href="${item.href}" data-nav="${item.href}">${item.label}</a>`,
  ).join('');
}

/* --------------------------------- home --------------------------------- */

function viewHome() {
  const links = site.links
    .map((l) => `<a href="${esc(l.href)}"${l.href.startsWith('http') ? ' rel="noopener"' : ''}>${esc(l.label)}</a>`)
    .join('<span class="sep">/</span>');

  const pubs = publications
    .map((p) => {
      const images = p.images
        .map((src, i) => `<img src="${esc(src)}" alt="" class="${i === 0 ? 'pub-img primary' : 'pub-img secondary'}" loading="lazy" />`)
        .join('');
      const title = p.href
        ? `<a href="${esc(p.href)}" target="_blank" rel="noopener">${esc(p.title)}</a>`
        : esc(p.title);
      const extra = p.links
        .map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">[${esc(l.label)}]</a>`)
        .join(' ');
      return `<article class="pub">
        <div class="pub-media${p.images.length > 1 ? ' swap' : ''}">${images}</div>
        <div class="pub-body">
          <h3 class="pub-title">${title}</h3>
          <p class="pub-authors">${authorsHtml(p.authors)}</p>
          <p class="pub-venue"><em>${esc(p.venue)}</em></p>
          <p class="pub-links">${extra}</p>
          <p class="pub-blurb">${esc(p.blurb)}</p>
        </div>
      </article>`;
    })
    .join('');

  app.innerHTML = `
    <section class="hero">
      <div class="hero-text">
        <h1>${esc(site.name)}</h1>
        <p class="role">${esc(site.role)}</p>
        <p>${esc(site.bio)}</p>
        <p class="hero-links">${links}</p>
      </div>
      <img class="avatar" src="${esc(site.avatar)}" alt="${esc(site.name)}" />
    </section>

    <section class="callout">
      <h2>MathFlow</h2>
      <p>A visual course on pseudorandomness — interactive demos instead of video,
      with narration you can step through line by line.</p>
      <a class="btn primary" href="#/course">Open the course →</a>
    </section>

    <h2 class="section">Publications</h2>
    <div class="pubs">${pubs}</div>

    <footer class="site-footer">
      <p>This site is a rewrite of an earlier page adapted from
      <a href="https://jonbarron.info/" target="_blank" rel="noopener">Jon Barron's page</a>.
      Earlier writing lives at the
      <a href="${esc(site.blogArchive)}" target="_blank" rel="noopener">original blog</a>.</p>
    </footer>
  `;
}

/* --------------------------------- blog --------------------------------- */

async function viewBlog() {
  const index = await fetchJson<BlogIndexEntry[]>('./data/blog.json');
  if (!index) {
    app.innerHTML = `<div class="empty"><h1>Blog</h1><p>No posts built. Run <code>npm run lessons</code>.</p></div>`;
    return;
  }
  const items = index
    .map(
      (p) => `<li class="post">
        <a class="post-title" href="#/blog/${esc(p.id)}">${esc(p.title)}</a>
        <span class="post-date">${esc(p.date)}</span>
        <p class="post-tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>
      </li>`,
    )
    .join('');
  app.innerHTML = `<article class="blog">
    <header><h1>Blog</h1>
      <p class="reading">${index.length} posts, migrated from
        <a href="${esc(site.blogArchive)}" target="_blank" rel="noopener">the blogspot archive</a>.</p>
    </header>
    <ul class="post-list">${items}</ul>
  </article>`;
}

async function viewPost(id: string) {
  let post = postCache.get(id);
  if (!post) {
    const fetched = await fetchJson<BlogPost>(`./data/blog/${id}.json`);
    if (!fetched) {
      app.innerHTML = `<div class="empty"><h1>Not found</h1><p>No post <code>${esc(id)}</code>.</p></div>`;
      return;
    }
    post = fetched;
    postCache.set(id, post);
  }
  app.innerHTML = `<article class="post-view">
    <header>
      <a class="back" href="#/blog">← All posts</a>
      <h1>${esc(post.title)}</h1>
      <div class="meta">${esc(post.date)}</div>
      <p class="post-tags">${post.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>
    </header>
    <div class="prose">${post.html}</div>
    ${post.source ? `<footer class="post-source">Originally posted at <a href="${esc(post.source)}" target="_blank" rel="noopener">blogspot</a>.</footer>` : ''}
  </article>`;
}

/* -------------------------------- course -------------------------------- */

function viewCourseHome() {
  if (!course) {
    app.innerHTML = `<div class="empty"><h1>Course</h1><p>No course built.</p></div>`;
    return;
  }
  const modules = course.modules
    .map(
      (m) => `<section class="mod">
        <h2>${esc(m.title)}</h2>
        ${m.lessons.length
          ? `<ul>${m.lessons
              .map(
                (id) =>
                  `<li><a href="#/lesson/${esc(id)}">${esc(id)}</a>${
                    progress.has(id) ? ' <span class="done">✓</span>' : ''
                  }</li>`,
              )
              .join('')}</ul>`
          : '<p class="dim">No lessons yet.</p>'}
      </section>`,
    )
    .join('');
  app.innerHTML = `<article class="course-home">
    <a class="back" href="#/">← About</a>
    <h1>${esc(course.title)}</h1>
    ${course.subtitle ? `<p class="sub">${esc(course.subtitle)}</p>` : ''}
    ${modules}
  </article>`;
}

/* ------------------------------- rendering ------------------------------- */

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
      app.innerHTML = `<div class="empty"><h1>Not built yet</h1>
        <p>No lesson <code>${esc(id)}</code>.</p>
        <p>Add <code>content/**/${esc(id)}.md</code>, set <code>publish: true</code>, then run <code>npm run lessons</code>.</p></div>`;
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

  app.innerHTML = `<article class="lesson">
    <header>
      <a class="back" href="#/course">← Course</a>
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

/* -------------------------------- routing -------------------------------- */

function teardown() {
  for (const [section, handle] of activeScenes) {
    handle.narration.stop();
    handle.host?.destroy();
    section.replaceWith(section.cloneNode(false));
  }
  activeScenes.clear();
}

function markActiveNav(hash: string) {
  const base = hash.replace(/^#\/(blog|course|lesson).*$/, (_m, p) =>
    p === 'lesson' ? 'course' : p,
  );
  topnav.querySelectorAll<HTMLAnchorElement>('a[data-nav]').forEach((a) => {
    const target = a.dataset.nav!;
    const on = target === '.' ? base === '#' || base === '#/' : target === `#/${base}`;
    a.classList.toggle('active', on);
  });
}

function route() {
  const hash = location.hash || '#/';
  teardown();
  markActiveNav(hash);

  const post = hash.match(/^#\/blog\/(.+)$/);
  if (post) return void viewPost(post[1]);

  const lesson = hash.match(/^#\/lesson\/(.+)$/);
  if (lesson) return void viewLesson(lesson[1]);

  if (hash.startsWith('#/blog')) return void viewBlog();
  if (hash.startsWith('#/course')) return void viewCourseHome();
  viewHome();
  window.scrollTo(0, 0);
}

async function boot() {
  course = await fetchJson<CourseManifest[]>('./data/courses.json').then((c) => c?.[0] ?? null);
  renderNav();
  window.addEventListener('hashchange', route);
  route();
}

void boot();
