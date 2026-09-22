# sylqiu-site

Personal site + ExploreFlow. One repo, one site.

The landing page is deliberately minimal — name, one line, links, and three
doors. Everything else lives on its own page.

## Run it

```sh
npm install
npm run dev       # http://localhost:5173
```

`npm run dev` rebuilds lessons from markdown first, then starts Vite. Edit a
`.md` file, save, then re-run `npm run build:lessons` (or restart `dev`) — the
parser is a build step, not a Vite plugin yet.

```sh
npm run build     # lessons + blog + static site -> dist/
npm run preview   # serve dist/
```

Push to `main` deploys to Pages automatically:
<https://sylqiu.github.io/sylqiu-site/>

## Surfaces

| Route | What it is |
|---|---|
| `#/` | Minimal landing: name, role, links, three doors. |
| `#/research` | Publications. Content in `src/lib/site.ts`. |
| `#/courses` | ExploreFlow index — all courses. |
| `#/courses/:id` | One course: modules and lesson list. |
| `#/lesson/:id` | Lesson player: boxes, scenes, narration beats, checks. |
| `#/blog` | Writing index (migrated blogspot archive). |
| `#/blog/:id` | Single post. |

## Where things live

| Path | What it is |
|---|---|
| `src/lib/site.ts` | **Personal content** — name, bio, links, publications, and the ExploreFlow name/tagline. |
| `content/courses/<id>/course.yaml` | Course outline: modules and lesson order. |
| `content/courses/<id>/**.md` | **The lessons.** One file per lesson. |
| `content/blog/*.md` | Blog posts, migrated from blogspot. Normal markdown now. |
| `src/lib/markdown.ts` | Markdown -> blocks parser (directives, boxes, checks) + blog renderer. |
| `src/lib/course.ts` | Discovers every course directory. |
| `src/lib/narration.ts` | Beat clock: audio-driven, or estimated reading time. |
| `src/lib/registry.ts` | Scene id -> code mapping, lazy-loaded. |
| `src/scenes/*.ts` | The interactive demos. Hand-written, per-lesson. |
| `scripts/import-blogspot.ts` | One-off import from the blogspot Atom feed. Not part of the build. |
| `public/data/`, `public/media/` | Generated / local media. Git-ignored. |

## Adding a course

Create `content/courses/<course-id>/course.yaml`, drop lesson `.md` files beside
it, set `publish: true` in each, then `npm run build`. The course appears on
`#/courses` automatically — no code change, no registration step.

```yaml
id: linear-algebra
title: Linear algebra
subtitle: Optional one-liner.
modules:
  - id: m1
    title: Module 1 — Vector spaces
    lessons:
      - vector-spaces
```

## Authoring format

Ordinary markdown with GFM + `$$` LaTeX, plus five directives.

**Boxes** — `:::def` `:::thm` `:::proof` `:::con` `:::ex` `:::rem`:

```markdown
:::thm{#hybrid title="Hybrid argument"}
If two distributions are each $k$ single-coordinate steps apart …
:::
```

**Interactive scene** — a leaf directive naming a registered scene:

```markdown
::scene{id="hybrid-chain" title="The hybrid argument" height="440"}
```

**Narration** — bullet list; each bullet becomes one beat:

```markdown
:::narration{scene="hybrid-chain"}
- Start from a distribution H₀ …
- Move one component at a time …
:::
```

**Check** — exactly one `- [x]`:

```markdown
:::check{qid="hybrid-1"}
Why must the adversary be quantified before n?
- [ ] Because adversaries are faster on short inputs.
- [x] Because a fixed adversary must fail for all large enough n.
- [ ] Because n is chosen by the adversary.

Since the probability is over $x \leftarrow \{0,1\}^n$ …
:::
```

**Frontmatter** — `publish: true` is required; drafts are skipped.

## Scenes

A scene is a TypeScript module in `src/scenes/`, registered in
`src/lib/registry.ts`, exporting a factory:

```ts
const factory: SceneFactory = (host, { beats }) => ({
  play(beat: number) { /* set visual state for this narration beat */ },
  reset() { /* back to the opening state */ },
  destroy() { /* stop timers / observers */ },
});
```

`play` is optional — a scene that ignores narration still works, with the beats
acting as a caption strip. **Narration owns time; the scene owns state.** Record
or re-record audio at any point and nothing in the scene changes.

Drop a narration file at `public/media/<lesson-id>.mp3` and set `audio:` in the
frontmatter; beats are then distributed across the real audio duration.

## Notable choices

- **Markdown, not JSON, is the source of truth.** `$$` LaTeX survives verbatim,
  diffs are readable, and one lesson file is a clean LLM context window.
- **No video.** Scenes are live DOM/SVG, so they respond to drag, hover, and
  scroll — and stay sharp on any display.
- **Courses are directories.** Adding a subject is a new folder, not a rename of
  the whole project.

## Known gaps

- Vite doesn't watch `content/`; re-run `npm run build:lessons`.
- Scenes ship hand-written SVG. No shared math helper layer (axis/tick/label) yet.
- Blog images still hotlink to `bloggerusercontent.com` (51 images). They load,
  but localizing them is a follow-up.
- `sylqiu.github.io` — the original user page — is still the old Jon Barron
  template. This site is deployed as a project page until that swap is decided.
