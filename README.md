# sylqiu-site

Personal site + MathFlow course authoring. Built as one repo so the course can
live inside the page later without a second toolchain.

## Run it

```sh
npm install
npm run dev       # http://localhost:5173
```

`npm run dev` rebuilds lessons from markdown first, then starts Vite with hot
reload. Edit a `.md` file, save, then re-run (or re-run `npm run lessons`) — the
parser is a build step, not a Vite plugin yet.

```sh
npm run build     # lessons + static site -> dist/
npm run preview   # serve dist/
```

## Where things live

| Path | What it is |
|---|---|
| `content/course.yaml` | Course outline: modules and lesson order. |
| `content/**/*.md` | **The lessons.** One file per lesson. This is the thing you edit. |
| `src/lib/markdown.ts` | Markdown -> blocks parser (directives, boxes, checks). |
| `src/lib/narration.ts` | Beat clock: audio-driven, or estimated reading time. |
| `src/lib/registry.ts` | Scene id -> code mapping, lazy-loaded. |
| `src/scenes/*.ts` | The interactive demos. Hand-written, per-lesson. |
| `public/data/lessons/*.json` | Generated. Never edit; never commit (`npm run lessons`). |

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

**Frontmatter** — `publish: true` is required; drafts are skipped, not published.

```markdown
---
id: one-way-functions
module: m1
kind: theory
title: One-way functions
reading: { text: "Primer §2.1" }
publish: true
---
```

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
frontmatter; the beats are then distributed across the real audio duration.

## Notable choices

- **Markdown, not JSON, is the source of truth.** `$$` LaTeX survives verbatim,
  diffs are readable, and one lesson file is a clean LLM context window.
  `validate_courses.py`-style structure checks run in `scripts/build-lessons.ts`.
- **No video.** Scenes are live DOM/SVG, so they respond to drag, hover, and
  scroll — and they stay sharp on any display.
- **Content and code are separable.** `public/media/` and `public/data/` are
  git-ignored, so a private content repo can feed a public site later.

## Known gaps

- Vite doesn't watch `content/`; re-run `npm run lessons` (or restart `dev`).
- Scenes ship hand-written SVG. A math helper layer (axis/tick/label) is not
  written yet — the three scenes inline their own.
- The personal-page shell (hero, research, writing) is not built yet; `index.html`
  is the course player only.
