#!/usr/bin/env python3
"""Content checker for the exam-notes site. Run it before every push:

    python scripts/check_content.py

It only reads files (standard library, nothing to install) and exits with code 1 if it finds a problem
that would break or garble a page. `mkdocs build --strict` should still be run afterwards.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"

errors, warnings = [], []


def err(f, n, msg):
    errors.append(f"ERROR   {f.relative_to(ROOT)}:{n}: {msg}")


def warn(f, n, msg):
    warnings.append(f"warning {f.relative_to(ROOT)}:{n}: {msg}")


LIST_RE = re.compile(r"^(\s*)([-*+]|\d+[.)])\s+\S")
Q_RE = re.compile(r"^##\s+Q\s*(\d+)\b", re.I)
IMG_MD = re.compile(r"!\[[^\]]*\]\(\s*<?([^)\s>]+)")
HTML_SRC = re.compile(r"""(?:src|poster|href)\s*=\s*["']([^"']+)["']""", re.I)


def is_local(url):
    return not re.match(r"^(https?:|//|data:|mailto:|#|/)", url) and url.strip() != ""


def exists_rel(base, url):
    url = url.split("#")[0].split("?")[0]
    return (base / url).resolve().exists()


def check_file(f):
    text = f.read_text(encoding="utf-8")
    lines = text.split("\n")
    md_dir = f.parent
    # raw HTML is not rewritten by MkDocs, so it resolves against the page's URL folder
    url_dir = md_dir if f.name == "index.md" else md_dir / f.stem

    in_fence = False
    in_comment = False
    in_front = lines[0].strip() == "---"
    q_numbers = []
    first_h1 = None
    prev = ""            # previous non-blank line (outside code)
    prev_blank = True
    prev_was_list = False
    prev_list_indent = -1
    dollars = 0

    for n, line in enumerate(lines, 1):
        stripped = line.strip()
        if in_front:
            if n > 1 and stripped == "---":
                in_front = False
            continue
        if stripped.startswith("```") or stripped.startswith("~~~"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if "<!--" in line:
            in_comment = "-->" not in line
            continue
        if in_comment:
            if "-->" in line:
                in_comment = False
            continue

        dollars += line.count("$$")

        # ---- old wrapper format (no longer used) ----
        if re.search(r'class="(instapaper-container|question-article|article-lead)"|\bdata-(title|qid|glimpse|thumb|meta)=', line):
            err(f, n, "old question wrapper (instapaper-container / question-article / data-*). "
                      "Questions are now plain Markdown: just '## Q1. Title <small>(5 marks)</small>' then the answer.")
        if "{ .instapaper-subject-title }" in line:
            err(f, n, "remove '{ .instapaper-subject-title }' - the page title is a plain '# Title'.")
        if stripped.startswith("??? success") or stripped.startswith("???+ success"):
            warn(f, n, "collapsible '??? success' answers are no longer used; write the answer directly under the heading.")
        if re.match(r"^\{:\s*[.#]", stripped):
            err(f, n, "'{: .class }' on its own line does nothing. Put attributes on the same line: '# Title { .cls }'.")

        # ---- headings ----
        m1 = re.match(r"^#\s+\S", line)
        if m1 and first_h1 is None:
            first_h1 = n
        mq = Q_RE.match(line)
        if mq:
            q_numbers.append((int(mq.group(1)), n))
            if "<small>" in line and "</small>" not in line:
                err(f, n, "unclosed <small> in question heading")
            if not re.search(r"\d+(?:\.\d+)?\s*marks?", line, re.I):
                warn(f, n, "no marks in the question heading. Add <small>(5 marks)</small> so it is listed under the right marks group (otherwise it goes under 'Other').")

        # ---- lists ----
        lm = LIST_RE.match(line)
        if lm:
            indent = len(lm.group(1).replace("\t", "    "))
            if not prev_blank and not prev_was_list and prev and not prev.lstrip().startswith(("<", ">", "|", "!!!", "???", "#")):
                err(f, n, "blank line needed before a list (otherwise it renders as one run-on paragraph).")
            if prev_was_list and 0 < indent < 4 and indent > prev_list_indent and prev_list_indent == 0:
                err(f, n, f"nested list indented {indent} spaces; use 4 (3 or 2 spaces flattens the list).")
            prev_was_list = True
            prev_list_indent = indent
        elif stripped:
            if not (line.startswith((" ", "\t")) and prev_was_list):
                prev_was_list = False
                prev_list_indent = -1

        # ---- media ----
        for url in IMG_MD.findall(line):
            if is_local(url) and not exists_rel(md_dir, url):
                err(f, n, f"image not found: {url} (Markdown images are relative to this file, e.g. img/name.svg)")
            if is_local(url) and url.lower().endswith(".gif"):
                err(f, n, "GIFs are not allowed (too heavy). Use SVG/WebP or a short MP4/WebM.")
        for url in HTML_SRC.findall(line):
            if not is_local(url):
                continue
            target = (url_dir / url.split("#")[0].split("?")[0]).resolve()
            if not Path(url.split("#")[0]).suffix:      # a link to another page, e.g. sem7/x/midsem/
                if target.is_dir() and (target / "index.md").exists() or target.with_suffix(".md").exists() or (target / "index.md").exists():
                    continue
                err(f, n, f"page not found: {url}")
            elif not target.exists():
                err(f, n, f"file not found: {url} (inside raw HTML, paths need '../' because each page is served from its own folder, e.g. ../img/name.svg)")

        if stripped:
            prev = line
        prev_blank = not stripped

    # ---- per-file checks ----
    if q_numbers:
        nums = [q for q, _ in q_numbers]
        if first_h1 is None:
            err(f, 1, "question page needs a '# Page title' line at the top.")
        seen = set()
        for q, n in q_numbers:
            if q in seen:
                err(f, n, f"duplicate question number Q{q}")
            seen.add(q)
        if nums != sorted(nums):
            err(f, q_numbers[0][1], "questions are not in order (Q1, Q2, Q3, ...).")
        if sorted(set(nums)) != list(range(1, max(nums) + 1)):
            warn(f, q_numbers[0][1], "question numbers skip a number (e.g. Q1, Q3). Fine only if intentional.")
    if dollars % 2:
        err(f, 1, "odd number of '$$' - an equation block is not closed.")


def check_assets():
    for p in DOCS.rglob("*"):
        if not p.is_file():
            continue
        ext = p.suffix.lower()
        size = p.stat().st_size
        if ext == ".gif":
            err(p, 0, "GIF files are not allowed; use SVG/WebP or short MP4/WebM.")
        elif ext in (".png", ".jpg", ".jpeg", ".webp") and size > 200_000:
            warn(p, 0, f"image is {size // 1024} KB; keep images under ~150 KB (WebP, max ~1000 px wide).")
        elif ext in (".mp4", ".webm") and size > 2_000_000:
            warn(p, 0, f"video is {size / 1e6:.1f} MB; keep clips under ~1-2 MB or use an unlisted YouTube embed.")
        elif size > 5_000_000:
            err(p, 0, "file over 5 MB")


def main():
    md_files = sorted(DOCS.rglob("*.md"))
    for f in md_files:
        check_file(f)
    check_assets()
    if not (DOCS / "CNAME").exists():
        errors.append("ERROR   docs/CNAME is missing - the custom domain would go offline. Restore it.")
    for w in warnings:
        print(w)
    for e in errors:
        print(e)
    print(f"\nChecked {len(md_files)} pages: {len(errors)} error(s), {len(warnings)} warning(s).")
    if errors:
        print("Fix the errors above before pushing.")
        sys.exit(1)
    print("OK")


if __name__ == "__main__":
    main()
