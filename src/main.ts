/**
 * Authoring preview + course player.
 *
 * Deliberately thin: read the generated JSON, render blocks, mount scenes.
 * Everything interesting lives in `lib/` (format, narration) and `scenes/`.
 */
import { mountScene, type SceneHost } from './lib/registry.ts';
import { Narration } from './lib/narration.ts';
import type { Block, CourseManifest, Lesson } from './lib/types.ts';

const app = document.getElementById('app')!;
const topnav = document.getElementById('topnav')!;

let courses: CourseManifest[] = [];
const lessonCache = new Map<string, Lesson>();
const progress = new Set<string>(JSON.parse(localStorage.getItem('mf:progress') || '[]'));

function saveProgress() {
  localStorage.setItem('mf:progress', JSON.stringify([...progress]));
}

function course(): CourseManifest {
  return courses[0];
}

async function loadLesson(id: string): Promise<Lesson> {
  const cached = lessonCache.get(id);
  if (cached) return cached;
  const res = await fetch(`./data/lessons/${id}.json`);
  if (!res.ok) throw new Error(`no lesson "${id}" (${res.status})`);
  const lesson = (await res.json()) as Lesson;
  lessonCache.set(id, lesson);
  return lesson;
}

/* ------------------------------- rendering ------------------------------- */

function renderBox(block: Extract<Block, { kind: 'box' }>): string {
  const title = block.title ? `<div class="box-title">${block.title}</div>` : '';
  return `<section class="box box-${block.box}">${title}<div class="box-body">${block.html}</div></section>`;
}

function renderCheck(block: Extract<Block, { kind: 'check' }>): string {
  const options = block.check.options
    .map(
      (o, i) => `<button class="opt" data-correct="${o.correct}" data-i="${i}">
        <span class="opt-mark"></span><span>${o.text}</span></button>`,
    )
    .join('');
  return `<section class="check" data-qid="${block.check.qid}">
    <div class="check-q">${block.check.question}</div>
    <div class="check-opts">${options}</div>
    <div class="check-exp" hidden>${block.check.explanation}</div>
  </section>`;
}

function renderScene(block: Extract<Block, { kind: 'scene' }>): string {
  const beats = block.beats
    .map((b, i) => `<button class="beat" data-beat="${i}"><span class="beat-n">${i + 1}</span>${b.text}</button>`)
    .join('');
  return `<section class="sceneblock" data-scene="${block.id}" style="--scene-h:${block.height}px">
    <div class="scene-head">
      <span class="scene-id">${block.id}</span>
      ${block.title ? `<span class="scene-title">${block.title}</span>` : ''}
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
  beats: HTMLElement[];
}

const activeScenes = new Map<HTMLElement, SceneHandle>();

async function wireScene(section: HTMLElement, block: Extract<Block, { kind: 'scene' }>) {
  const canvas = section.querySelector<HTMLElement>('.scene-canvas')!;
  const beatEls = [...section.querySelectorAll<HTMLElement>('.beat')];
  const playBtn = section.querySelector<HTMLButtonElement>('.play')!;
  const resetBtn = section.querySelector<HTMLButtonElement>('.reset')!;

  const audio = block.id && lessonAudioFor(block.id);
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

  const handle: SceneHandle = { host, narration, beats: beatEls };
  activeScenes.set(section, handle);

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

/** Optional recorded narration for a lesson (public/media/<lesson>.mp3). */
function lessonAudioFor(id: string): HTMLAudioElement | null {
  const lesson = currentLesson;
  if (!lesson?.audio) return null;
  const el = new Audio(`./media/${lesson.audio}`);
  el.preload = 'auto';
  return el;
}

/* -------------------------------- routing -------------------------------- */

let currentLesson: Lesson | null = null;

function teardown() {
  for (const [section, handle] of activeScenes) {
    handle.narration.stop();
    handle.host?.destroy();
    section.replaceWith(section.cloneNode(false)); // drop listeners
  }
  activeScenes.clear();
  currentLesson = null;
}

function renderNav() {
  const c = course();
  topnav.innerHTML = c.modules
    .map((m) => `<span class="nav-mod">${m.title}</span>`)
    .join('');
}

async function viewHome() {
  const c = course();
  const modules = c.modules
    .map(
      (m) => `<section class="mod">
        <h2>${m.title}</h2>
        <ul>${m.lessons
          .map(
            (id) =>
              `<li><a href="#/lesson/${id}">${id}</a>${
                progress.has(id) ? ' <span class="done">✓</span>' : ''
              }</li>`,
          )
          .join('')}</ul>
      </section>`,
    )
    .join('');
  app.innerHTML = `<div class="home"><h1>${c.title}</h1>
    ${c.subtitle ? `<p class="sub">${c.subtitle}</p>` : ''}${modules}</div>`;
}

async function viewLesson(id: string) {
  let lesson: Lesson;
  try {
    lesson = await loadLesson(id);
  } catch (err) {
    app.innerHTML = `<div class="home"><h1>Not built yet</h1>
      <p class="sub">${(err as Error).message}</p>
      <p>Add <code>content/**/${id}.md</code>, set <code>publish: true</code>, then run <code>npm run lessons</code>.</p></div>`;
    return;
  }
  currentLesson = lesson;
  const reading = lesson.reading
    ? `<p class="reading">Reading: ${
        lesson.reading.url
          ? `<a href="${lesson.reading.url}" target="_blank" rel="noopener">${lesson.reading.text}</a>`
          : lesson.reading.text
      }</p>`
    : '';
  app.innerHTML = `<article class="lesson">
    <header><h1>${lesson.title}</h1><div class="meta">${lesson.module} · ${lesson.kind}</div>${reading}</header>
    ${renderLessonBody(lesson)}
  </article>`;

  for (const block of lesson.blocks) {
    if (block.kind !== 'scene') continue;
    const section = app.querySelector<HTMLElement>(`[data-scene="${block.id}"]`);
    if (section) await wireScene(section, block);
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

function route() {
  const hash = location.hash || '#/';
  const match = hash.match(/^#\/lesson\/(.+)$/);
  teardown();
  if (match) void viewLesson(match[1]);
  else void viewHome();
}

async function boot() {
  const res = await fetch('./data/courses.json');
  if (!res.ok) {
    app.innerHTML = `<div class="home"><h1>No build yet</h1>
      <p>Run <code>npm run lessons</code> to generate <code>public/data/</code>.</p></div>`;
    return;
  }
  courses = (await res.json()) as CourseManifest[];
  renderNav();
  window.addEventListener('hashchange', route);
  route();
}

void boot();
