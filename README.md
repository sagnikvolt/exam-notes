# exam-notes

Source for **https://exam.sagniknath.in** — mid sem & end sem Q&A (B.Tech EE, IEM Kolkata).

Agents: read [AGENTS.md](AGENTS.md) first.

## How to add content

- Questions go in `docs/sem7/<subject>/midsem.md` or `endsem.md`. Copy the format block in the comment at the bottom of each page.
- New subject: create `docs/sem7/<slug>/index.md`, `midsem.md`, `endsem.md`, then add it under `nav:` in `mkdocs.yml` and as a card in `docs/index.md`.
- Put source PDFs/photos in `raw/` — local only, git-ignored (the repo is public).
- Push to `main` → GitHub Actions rebuilds the site in ~1 min.

Preview locally: `pip install mkdocs-material` then `mkdocs serve`.
