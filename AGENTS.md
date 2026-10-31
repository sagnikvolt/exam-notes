# AGENTS.md — instructions for any AI agent working on this repo

Read this whole file before changing anything. If a user request conflicts with a **Never** rule below, stop and ask the owner first.

## 1. What this project is

- A static study website: **https://exam.sagniknath.in** — mid-sem and end-sem questions with answers for B.Tech Electrical Engineering, IEM Kolkata (batch 2023–27).
- Owner: Sagnik Kumar Nath ("Roni"). Repo: `sagnikvolt/exam-notes` (**public**).
- Built with **MkDocs + Material for MkDocs**. Content is plain Markdown in `docs/`. There is no backend, database or login.
- Hosted free on **GitHub Pages** (branch `gh-pages`, built automatically). DNS is on **Cloudflare**.
- Used mostly on **phones**, often on slow mobile data, the night before exams. **Speed and readability on a small screen beat everything else.**

## 2. Repo layout

```
mkdocs.yml                  site config + navigation (nav:)
docs/
  index.md                  home page (hand-written HTML, see section 12)
  CNAME                     custom domain — NEVER delete or edit
  assets/                   logo / favicon (iem-logo.svg)
  stylesheets/extra.css     ALL layout + design (Instapaper style, see section 12)
  javascripts/instapaper.js builds the sidebar, question feed and reader (section 12)
  javascripts/katex.js      math loader (see section 8)
  sem7/<subject>/index.md   syllabus overview
  sem7/<subject>/midsem.md  mid-sem Q&A
  sem7/<subject>/endsem.md  end-sem Q&A
  sem7/<subject>/img/       diagrams for that subject
  sem8/index.md             placeholder until 8th-sem syllabus exists
.github/workflows/deploy.yml  auto-deploy on push to main — don't edit without asking
raw/                        local-only source files (see section 9)
```

7th-sem subjects (slug → name, code): `electric-drives` (PEC-EE 701C), `embedded-system` (OEC-EE 701A), `computer-network` (OEC-EE 702B), `hsmc701` (HRD & Org Behaviour, HSMC-701), `esp-vii` (ESPEE 701). Exam dates are on the owner's side; don't invent them.

## 3. Never (hard rules)

1. **Never delete or change `docs/CNAME`.** It holds `exam.sagniknath.in`; removing it takes the site offline.
2. **Never edit `.github/workflows/deploy.yml`** unless asked. **Never run `mkdocs gh-deploy` locally** and never commit to or force-push the `gh-pages` branch — CI does that.
3. **Never commit `site/`** (build output) or anything from `raw/` except `raw/.gitkeep`.
4. **Never touch DNS, Cloudflare, GitHub Pages settings, or the domain.** The sibling subdomains `sunsense.sagniknath.in` and `www.sagniknath.in` serve other repos/sites and must keep working.
5. **Never put secrets, tokens, passwords, phone numbers, addresses, marks/grades or other personal data** in the repo. It is public.
6. **Never invent or guess answers.** See section 5.
7. **Never rewrite or "tidy" existing Q&A content** unless asked. Add and fix only what was requested.
8. **Never force-push `main`.** Make small commits with clear messages.
9. **Never break the layout contract in section 12** (base path, listeners, `markdown="1"`, scoped CSS). A "design only" request is not permission to skip it.
10. **Never add buttons or controls that do nothing.** Every visible control must work, or not exist.
11. **Never mix a design change and content changes in one commit.** If the site breaks, the owner must be able to revert one without the other.

## 4. Always (before every push)

1. Run `pip install mkdocs-material` once, then `mkdocs build --strict` — it must finish with **no warnings or errors** (broken links, missing files and bad nav entries show up here).
2. Look at the page on **mobile width (~390 px)** if you changed layout, tables, images or math. If you touched `extra.css`, `instapaper.js`, `index.md` or any question block, also run the **checklist in section 12.4**.
3. `git status` — confirm only intended files changed; `site/` and `raw/*` must not appear.
4. Commit and push to `main`. The site updates in about 1–2 minutes. Check the **Actions** tab shows "Deploy site" succeeded.
5. Tell the owner what changed in 2–3 lines.

## 5. Content accuracy (most important)

This site is for exam revision. A wrong answer costs the owner marks.

- Answer only from: the syllabus, the owner's notes/papers, standard textbooks (e.g. Dubey *Fundamentals of Electrical Drives*; Forouzan *Data Communication and Networking*), or other sources the owner provides.
- If you are **not sure** an answer is correct, still include it but add `!!! warning "Verify this"` inside the answer. Don't present a guess as fact.
- Never make up marks, years, or "important question" claims. Leave `(marks · year)` out if unknown.
- Numericals: show **Given → Formula → Steps → Final answer with units**. Re-check the arithmetic.
- Derivations: state assumptions, number the steps, box the final result.
- Cite the source (textbook + chapter, or "Paper: Mid Sem 2025") in a short line at the end of the answer when known.
- **Questions are typed up generically, not copied.** The owner does not publish question-paper PDFs or photos. Write each question in clear, generic wording that keeps the same technical meaning, topic and marks, instead of reproducing the paper verbatim. If the owner pastes a question or gives a photo for you to work from, use it only as input: rephrase it, never commit the file or quote the paper's layout, headers, or college/exam branding. Mark anything unreadable `[unclear]` and ask.

## 6. Q&A format (use exactly this on every question)

Pages that have questions use the **Instapaper-style reader**: a list of questions, and the full answer shown when one is opened. `instapaper.js` builds that from the block below, so the block must be exact. (The old `??? success "Answer"` collapsible format is **no longer used**; do not bring it back.)

Page header, once per file (the `{ .instapaper-subject-title }` and `markdown="1"` parts are required):

```markdown
---
title: Electric Drives — Mid Sem Q&A
hide: [toc]
---

# Electric Drives — Mid Sem { .instapaper-subject-title }

<div class="instapaper-container" markdown="1">

  ...question blocks go here...

</div>
```

One block per question (copy this, change the text):

```markdown
<div class="question-article" id="q1"
     data-qid="Q1"
     data-title="Describe the 4-quadrant operation of an electrical drive."
     data-meta="PEC-EE 701C · 5 marks · Mid Sem · 2 min read"
     data-glimpse="One or two sentences shown as the preview in the list..."
     data-thumb="../img/four-quadrant-operation.svg" markdown="1">

## Q1. Describe the 4-quadrant operation of an electrical drive. <small>(5 marks · Mid Sem)</small>

<div class="article-lead" markdown="1">
Short opening paragraph. Math works: $T = K\phi I_a$
</div>

<figure class="article-illustration">
  <img src="../img/four-quadrant-operation.svg" alt="Describe the picture" loading="lazy" />
  <figcaption>Illustration: what the picture shows</figcaption>
</figure>

### Heading for a part of the answer

Answer text. Block math:

$$ \omega = \frac{V - I_a R_a}{K\phi} $$

*Source: Dubey, Ch. 2*

</div>
```

Rules for the block:

- `id` is `q1`, `q2`, … in order; `data-qid` is `Q1`, `Q2`, … Never reuse or skip ids, and never change an id that already exists (people share `#q2` links).
- `data-meta` is `COURSE-CODE · N marks · Mid Sem|End Sem · N min read`. The list cards show everything after the course code.
- `data-title`, `data-glimpse` and the `##` heading text must agree. `data-glimpse` is plain text (no math, no markdown), 1–2 sentences.
- **`markdown="1"` is required** on every `<div>` that contains Markdown (the container, each `question-article`, each `article-lead`). Without it the content shows as raw text like `## Q1`.
- The `##` heading goes **first** inside the block. It is used for the build and permalinks; the reader shows `data-title` instead.
- `data-thumb` and `<img src>` are optional, but when used the path is **`../img/<file>`** (every page lives in its own folder, so `img/` without `../` is a 404).
- **Lists:** leave a blank line before every list, and indent nested lists by **4 spaces** (3 spaces silently flattens them).
- **Headings with attributes** must be on one line: `# Title { .cls }`. A `{: .cls }` line below a heading does nothing.
- Keep answers as short as the marks allow. Wide tables scroll badly on phones; prefer lists.
- Questions go in the order of the paper. Don't merge mid-sem and end-sem questions.
- If you are not sure an answer is correct, add `!!! warning "Verify this"` inside the answer.
- A page with no questions yet has **no** `instapaper-container`: just the title and `!!! note "No questions yet"`.

## 7. Adding things

**New question/answer:** append a question block (section 6) inside the `instapaper-container` of the right `midsem.md` / `endsem.md`. If the page still has the "No questions yet" note, replace it with the page header + container from section 6 when adding the first question.

**New subject (or 8th-sem subjects):** create `docs/sem7|sem8/<slug>/index.md`, `midsem.md`, `endsem.md`; add the subject under `nav:` in `mkdocs.yml`; add a row in `docs/index.md` (copy an existing `home-row`); **add a link row in the sidebar list inside `docs/javascripts/instapaper.js`** (the sidebar is written by hand in that file, it does not read `nav:`). Use lowercase-hyphen slugs. For 8th sem, replace the "Coming soon" placeholder.

**Never rename or move an existing page** without asking — it breaks links people have bookmarked or shared. If you must, ask first.

## 8. Performance rules (the site must stay very fast)

Math (LaTeX):
- Use `$...$` (inline) and `$$...$$` (block). Keep expressions simple; no giant macros.
- KaTeX is active via `docs/javascripts/katex.js` and `pymdownx.arithmatex` with `generic: true`; instant navigation is enabled (`navigation.instant`, `navigation.instant.prefetch`).

Images:
- Format **WebP** (or SVG for diagrams; thumbnails in the question list are normally SVG). Max width ~1000 px. Target **≤150 KB** each. No raw phone photos, no PNG screenshots over 200 KB.
- Always add alt text and lazy-loading: `![Torque-speed curve](img/torque-speed.webp){ loading=lazy }`.
- Store next to the subject: `docs/sem7/<subject>/img/`. Descriptive lowercase-hyphen names.
- Prefer **SVG** or **Mermaid** (supported through `pymdownx.superfences`) for circuits, block diagrams, flowcharts and waveforms.

Videos / animations:
- **No GIFs.** Use short **MP4 (H.264) or WebM** loops: 5–10 s, under ~1 MB.
  `<video muted loop playsinline preload="none" poster="img/thumb.webp" controls><source src="vid/clip.mp4" type="video/mp4"></video>`
- Longer than ~15 s or over ~2 MB → upload as **unlisted YouTube** and embed with `loading="lazy"` on the iframe.
- Never autoplay with sound. Never add a video that isn't needed to understand the answer.
- Small interactive widgets (slider + chart) are fine if tiny (a few KB of JS) and loaded only on the page that uses them.

General:
- No heavy third-party scripts, trackers, ads, chat widgets, or web fonts beyond what the theme already uses.
- Don't add plugins/dependencies casually; each one slows the build or the page. Ask first.
- Repo limits: files < 100 MB (aim far lower), whole site < 1 GB.

## 9. `raw/` folder and copyright

- `raw/` is for the owner's source PDFs/photos while working. **It is local only** — `raw/*` is git-ignored (keep `raw/.gitkeep`). If `.gitignore` lacks `raw/*` and `!raw/.gitkeep`, add them before committing anything else.
- The repo is **public**. Do not publish full textbook pages, scanned books, or question-paper PDFs/photos as files (the owner has decided not to share PDFs). Generically typed-up questions and the owner's own worked answers are fine. If unsure, ask.

## 10. Style

- Plain, exam-focused English. No emojis in content. Headings in sentence case.
- Use SI units with symbols (V, A, N·m, rad/s). Italic variables via LaTeX, not Markdown.
- Keep pages scannable: short paragraphs, numbered steps.
- Don't change theme colours, fonts or layout unless asked. When asked, follow section 12.

## 11. If something goes wrong

- Build fails → read the error, fix the file; don't disable `--strict` to hide it.
- Site looks broken after a push → check the Actions run; if the latest commit is the cause, `git revert` it (don't force-push) and tell the owner.
- Custom domain/HTTPS shows an error → don't change settings; report it to the owner (DNS/Pages are managed by hand).
- Unsure about anything in this file → ask the owner before acting.

## 12. Layout and design (Instapaper style) — read before touching `extra.css`, `instapaper.js` or `index.md`

The site looks like the Instapaper app: left sidebar, question list, reader. On **desktop (>= 960 px)** it is three panes that scroll on their own. On a **phone (< 960 px)** it is three screens: Home page (menu) -> question list -> reader with a floating pill at the bottom. The owner likes this look. **Restyle freely, but keep every rule below.** The last time the design was changed without these rules, the site broke (sidebar links 404, double clicks, page scrolling behind the panes, raw `## Q1` text in answers).

### 12.1 Rules for `docs/javascripts/instapaper.js`

1. **It re-runs on every page view** (`document$.subscribe`, because of instant navigation). Everything added to `document` or `window` must use the `{ signal: ac.signal }` AbortController at the top of the callback, or it stacks up and one click/key press fires 4 times. Never add a bare `document.addEventListener` here.
2. **Never hard-code `/` as the site root.** Use the `root` / `base` variable (from `__md_scope`). The site is served at the domain root today, but links must still work under `/exam-notes/` or `localhost`.
3. **Duplicate ids:** the reader shows a *copy* of each question; the copy has its `id`s removed. Don't put ids back (duplicate ids make the page jump).
4. **Scrolling:** never call `scrollIntoView` (it scrolls the whole page). Scroll the list or the reader container instead. Use `scrollTo({ behavior: 'instant' })`. Opening a question on a phone must land at the top of the answer.
5. **Hash:** on desktop the URL gets `#qN`. On phones the **list** URL must stay clean; only the open reader has `#qN` (this is what makes the phone's Back button return to the list).
6. **No dead controls** (section 3 rule 10). Don't re-add placeholder buttons (+, tag, folder, trash, archive).
7. Keyboard: `j`/`k` move between questions; arrow keys only while the list has focus; ignore typing in inputs and ignore Ctrl/Alt/Meta combinations.
8. KaTeX is rendered once per answer and cached. Don't re-render on every click.

### 12.2 Rules for `docs/stylesheets/extra.css`

1. **Scope the "lock to the screen" rules.** Only question pages may use `height: 100vh; overflow: hidden`, and only through `:has(.instapaper-container, .instapaper-app)`. Home, overview and "No questions yet" pages must scroll normally. A global `overflow: hidden` clips the home page.
2. **Desktop pane lock** lives inside `@media (min-width: 960px)`. On phones the **page** scrolls (not an inner box), so the browser's address bar collapses normally.
3. The breakpoint is **959.98px** in both the CSS and the JS (`matchMedia`). Change both or neither.
4. `.instapaper-reader` and `.instapaper-feed` must stay `position: relative`. KaTeX adds hidden absolutely-positioned copies of equations; without a positioned parent they stretch the whole page and create a second scrollbar behind the panes.
5. Colours come from the `--ip-*` variables (light + dark `slate`). Don't hard-code colours that only work in light mode. Check dark mode.
6. Long equations, tables and code must scroll **inside** the answer, never widen the page (no horizontal page scroll at 390 px).
7. Use 16 px font size on inputs (smaller makes iPhones zoom on focus).

### 12.3 Rules for `docs/index.md` (Home)

- The home page is hand-written HTML (`home`, `home-row`, `home-chip` classes). Keep `hide: [toc]` and keep each link relative to the site root (`sem7/<slug>/`, `sem7/<slug>/midsem/`). Check every link exists after a build.
- Don't claim things that aren't true ("verified", "previous university papers", exam dates). Questions are typed up generically (section 5).
- Don't put Markdown inside the raw HTML block (it will not be processed); write plain HTML.

### 12.4 Checklist after ANY change to layout, CSS, JS, Home or a question block

Run `mkdocs build --strict`, then `mkdocs serve` and check **all** of these (desktop 1280 px and phone 390 px, light and dark):

1. Every sidebar link and every Home link opens the right page (no 404). Click each one.
2. **One click does one thing**: click a question once, it opens once. Press `j` once, it moves one question. Do this after visiting 3-4 different pages (this is when the stacking bug shows).
3. Desktop question page: the **page itself does not scroll**; only the list and the answer scroll. Scroll the wheel over each pane.
4. Phone: tap a question -> answer starts at the very top; the bottom pill's back / previous / next buttons work; the phone's Back button returns to the list at the same place.
5. Answers show formatted math, lists, figures. No raw `## Q1`, no `{: ... }` text, no `$...$` left unrendered, no horizontal scrolling.
6. Home page: nothing clipped at either width; the first screen on a phone shows the title and the first subject.
7. Browser console: no errors. Network tab: no 404 (images, favicon).
8. Open a page in a new tab by typing `.../midsem/#q3`: it shows question 3.

If any check fails, fix it before pushing. If you can't, **don't push** and tell the owner what failed.
