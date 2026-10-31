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
  index.md                  home page (subject cards)
  CNAME                     custom domain — NEVER delete or edit
  stylesheets/extra.css
  javascripts/mathjax.js    math loader (see section 8)
  sem7/<subject>/index.md   syllabus overview
  sem7/<subject>/midsem.md  mid-sem Q&A
  sem7/<subject>/endsem.md  end-sem Q&A
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

## 4. Always (before every push)

1. Run `pip install mkdocs-material` once, then `mkdocs build --strict` — it must finish with **no warnings or errors** (broken links, missing files and bad nav entries show up here).
2. Look at the page on **mobile width (~390 px)** if you changed layout, tables, images or math.
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

```markdown
## Q1. Question text here <small>(5 marks · Mid Sem 2025)</small>

??? success "Answer"
    Answer text, indented 4 spaces. Math works: $T = K\phi I_a$

    $$ \omega = \frac{V - I_a R_a}{K\phi} $$

    *Source: Dubey, Ch. 2*
```

- One `##` heading per question; number sequentially (`Q1, Q2…`); sub-parts as `(a) (b)` inside the question.
- Answers go **inside** the collapsible `???` block (4-space indent for everything in it). This keeps long pages light and scannable on a phone.
- Keep answers as short as the marks allow. Use lists/tables sparingly; wide tables scroll badly on phones — prefer lists.
- Put the page's questions in order of the paper. Don't merge mid-sem and end-sem questions.

## 7. Adding things

**New question/answer:** append to the right `midsem.md` / `endsem.md`. If the page still has the "No questions yet" note, remove that note when adding the first question.

**New subject (or 8th-sem subjects):** create `docs/sem7|sem8/<slug>/index.md`, `midsem.md`, `endsem.md`; add the subject under `nav:` in `mkdocs.yml`; add a card in `docs/index.md`. Use lowercase-hyphen slugs. For 8th sem, replace the "Coming soon" placeholder.

**Never rename or move an existing page** without asking — it breaks links people have bookmarked or shared. If you must, ask first.

## 8. Performance rules (the site must stay very fast)

Math (LaTeX):
- Use `$...$` (inline) and `$$...$$` (block). Keep expressions simple; no giant macros.
- KaTeX is active via `docs/javascripts/katex.js` and `pymdownx.arithmatex` with `generic: true`; instant navigation is enabled (`navigation.instant`, `navigation.instant.prefetch`).

Images:
- Format **WebP** (or SVG for diagrams). Max width ~1000 px. Target **≤150 KB** each. No raw phone photos, no PNG screenshots over 200 KB.
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
- Don't change theme colours, fonts or layout unless asked.

## 11. If something goes wrong

- Build fails → read the error, fix the file; don't disable `--strict` to hide it.
- Site looks broken after a push → check the Actions run; if the latest commit is the cause, `git revert` it (don't force-push) and tell the owner.
- Custom domain/HTTPS shows an error → don't change settings; report it to the owner (DNS/Pages are managed by hand).
- Unsure about anything in this file → ask the owner before acting.
