/* ==========================================================================
   Examnotes Instapaper-Style 3-Pane Reader Experience
   Extreme Left Nav | Middle Feed | Right Reader
   ========================================================================== */

document$.subscribe(() => {
  // Instant navigation re-runs this callback on every page view. Remove the document-level listeners
  // from the previous run so they don't pile up (one key press / click must trigger one action).
  if (window.__ipAbort) window.__ipAbort.abort();
  const ac = new AbortController();
  window.__ipAbort = ac;
  const listen = { signal: ac.signal };
  const mobileMQ = window.matchMedia('(max-width: 959.98px)'); // same breakpoint as the CSS
  const isMobile = () => mobileMQ.matches;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // SVG Icon definitions matching Instapaper outline style
  const icons = {
    home: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    drives: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    embedded: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,
    network: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    hrd: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    esp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    semester: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
    clock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
  };

  // Site base path (correct at any page depth; "/" on exam.sagniknath.in) and the page path below it
  const base = (typeof __md_scope !== 'undefined' && __md_scope.pathname) ? __md_scope.pathname : '/';
  const path = window.location.pathname;
  const rel = path.startsWith(base) ? path.slice(base.length) : path.replace(/^\//, '');
  const root = base;

  // Phones, ordinary pages (Home, overview pages): menu / theme / search live in a floating pill at the bottom.
  // They just press the theme's own (hidden) header buttons, so the menu, search and dark mode keep working.
  document.querySelectorAll('.page-pill').forEach((n) => n.remove());
  {
    const pi = (d) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    const pill = document.createElement('div');
    pill.className = 'page-pill';
    pill.innerHTML = `
      <button type="button" class="pill-btn" data-act="menu" aria-label="Menu">${pi('<line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>')}</button>
      <button type="button" class="pill-btn" data-act="search" aria-label="Search">${pi('<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>')}</button>
      <button type="button" class="pill-btn" data-act="theme" aria-label="Switch light or dark mode">${pi('<circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"></path>')}</button>`;
    pill.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const act = btn.getAttribute('data-act');
      const target = act === 'menu' ? document.querySelector('label.md-header__button[for="__drawer"]')
        : act === 'search' ? document.querySelector('label.md-header__button[for="__search"]')
        : document.querySelector('[data-md-component="palette"] label:not([hidden])');
      if (target) target.click();
    });
    document.body.appendChild(pill);
  }

  // =========================================================================
  // 1. Build Clean Instapaper Left Sidebar
  // =========================================================================
  const sidebar = document.querySelector('.md-sidebar--primary');
  if (sidebar) {
    let cleanSidebar = sidebar.querySelector('.ip-sidebar-container');
    if (!cleanSidebar) {
      cleanSidebar = document.createElement('div');
      cleanSidebar.className = 'ip-sidebar-container';

      const isHome = rel === '' || rel === 'index.html';
      const isDrives = rel.includes('electric-drives/');
      const isEmbedded = rel.includes('embedded-system/');
      const isNetwork = rel.includes('computer-network/');
      const isHrd = rel.includes('hsmc701/');
      const isEsp = rel.includes('esp-vii/');
      const isSem8 = rel.startsWith('sem8/');

      cleanSidebar.innerHTML = `
        <div class="ip-brand-header">Examnotes</div>
        
        <div class="ip-nav-list">
          <a href="${root}" class="ip-nav-row ${isHome ? 'is-active' : ''}">
            <span class="ip-row-icon">${icons.home}</span>
            <span class="ip-row-label">Home</span>
          </a>

          <a href="${root}sem7/electric-drives/midsem/" class="ip-nav-row ${isDrives ? 'is-active' : ''}">
            <span class="ip-row-icon">${icons.drives}</span>
            <span class="ip-row-label">Electric Drives</span>
            <span class="ip-row-badge">PEC</span>
          </a>

          <a href="${root}sem7/embedded-system/midsem/" class="ip-nav-row ${isEmbedded ? 'is-active' : ''}">
            <span class="ip-row-icon">${icons.embedded}</span>
            <span class="ip-row-label">Embedded Systems</span>
            <span class="ip-row-badge">OEC</span>
          </a>

          <a href="${root}sem7/computer-network/midsem/" class="ip-nav-row ${isNetwork ? 'is-active' : ''}">
            <span class="ip-row-icon">${icons.network}</span>
            <span class="ip-row-label">Computer Networks</span>
            <span class="ip-row-badge">OEC</span>
          </a>

          <a href="${root}sem7/hsmc701/midsem/" class="ip-nav-row ${isHrd ? 'is-active' : ''}">
            <span class="ip-row-icon">${icons.hrd}</span>
            <span class="ip-row-label">HRD &amp; OB</span>
            <span class="ip-row-badge">HSMC</span>
          </a>

          <a href="${root}sem7/esp-vii/midsem/" class="ip-nav-row ${isEsp ? 'is-active' : ''}">
            <span class="ip-row-icon">${icons.esp}</span>
            <span class="ip-row-label">ESP VII</span>
            <span class="ip-row-badge">ESPEE</span>
          </a>

          <div class="ip-section-heading">Semesters</div>

          <a href="${root}sem7/electric-drives/" class="ip-nav-row ${rel.startsWith('sem7/') && !isDrives && !isEmbedded && !isNetwork && !isHrd && !isEsp ? 'is-active' : ''}">
            <span class="ip-row-icon">${icons.semester}</span>
            <span class="ip-row-label">7th Semester</span>
            <span class="ip-row-badge">Batch 27</span>
          </a>

          <a href="${root}sem8/" class="ip-nav-row ${isSem8 ? 'is-active' : ''}">
            <span class="ip-row-icon">${icons.clock}</span>
            <span class="ip-row-label">8th Semester</span>
            <span class="ip-row-badge">Soon</span>
          </a>
        </div>

        <div class="ip-user-footer">Made by Sagnik Kumar Nath</div>
      `;

      // Clear existing MkDocs nav elements and attach clean sidebar
      const scrollWrap = sidebar.querySelector('.md-sidebar__inner') || sidebar;
      scrollWrap.innerHTML = '';
      scrollWrap.appendChild(cleanSidebar);
    }
  }

  // =========================================================================
  // 2. Build 3-Pane Middle Feed and Right Reader
  // =========================================================================
  // A question is just a Markdown "## Q<number>. Title <small>(5 marks)</small>" heading plus everything
  // after it up to the next such heading. Nothing else is required: the title, marks, preview text,
  // thumbnail and reading time are worked out here, so authors only write normal Markdown.
  const pageContent = document.querySelector('.md-content__inner');
  if (!pageContent) return;
  if (pageContent.querySelector('.instapaper-app')) return; // already built for this page view

  const clean = (t) => String(t || '').replace(/[¶¶]/g, '').replace(/\s+/g, ' ').trim();
  const isSyllabusHead = (el) => el.tagName === 'H2' && /^\s*Syllabus\s*¶?\s*$/i.test(el.textContent);
  const isQuestionHead = (el) => el.tagName === 'H2' && (/^\s*Q\s*\d+/i.test(el.textContent) || isSyllabusHead(el));
  const isThemeChrome = (el) => /(^|\s)(md-source-file|md-content__button|md-feedback|md-source|md-footer)(\s|$)/.test(el.getAttribute('class') || '') || el.tagName === 'ASIDE' || el.tagName === 'FORM';

  const kids = Array.from(pageContent.children);
  const firstQ = kids.findIndex(isQuestionHead);
  const pageH1 = pageContent.querySelector(':scope > h1');

  // Subject pages: .../midsem/ and .../endsem/ share a Mid Sem | End Sem tab bar. Each has its own "## Syllabus" at the top of the list.
  const subjMatch = rel.match(/^(sem\d+)\/([^/]+)\/(midsem|endsem)?\/?$/);
  const pageKind = subjMatch ? (subjMatch[3] || 'overview') : '';
  const subjectBase = subjMatch ? `${root}${subjMatch[1]}/${subjMatch[2]}/` : '';
  const tabsHtml = (active) => !subjMatch ? '' : `<nav class="subject-tabs" aria-label="Subject sections">${
    [['midsem', 'Mid Sem', 'midsem/'], ['endsem', 'End Sem', 'endsem/']].map(([k, label, href]) =>
      `<a class="subject-tab${k === active ? ' is-active' : ''}" href="${subjectBase}${href}"${k === active ? ' aria-current="page"' : ''}>${label}</a>`).join('')
  }</nav>`;

  if (subjMatch && pageKind === 'overview') return; // subject overview page: a normal page
  // Ordinary page without questions: leave it alone. Mid/End Sem pages always get the layout, even when empty.
  if (firstQ === -1 && !(subjMatch && (pageKind === 'midsem' || pageKind === 'endsem'))) return;

  const subject = clean(pageH1 && pageH1.textContent) || 'Questions';
  const subjectName = subject.replace(/\s*[—–-]\s*(Mid|End)\s*Sem\s*$/i, '') || subject; // the tabs already say Mid / End
  const introNodes = kids.slice(0, firstQ === -1 ? kids.length : firstQ).filter((el) => el !== pageH1 && !isThemeChrome(el));

  const groups = [];
  let currentGroup = null;
  (firstQ === -1 ? [] : kids.slice(firstQ)).forEach((el) => {
    if (isQuestionHead(el)) { currentGroup = { head: el, nodes: [] }; groups.push(currentGroup); }
    else if (currentGroup && !isThemeChrome(el)) currentGroup.nodes.push(el);
  });

  const examLabel = pageKind === 'endsem' ? 'End Sem' : 'Mid Sem';
  const usedIds = new Set();
  const questionsData = groups.map((g, idx) => {
    const headCopy = g.head.cloneNode(true);
    headCopy.querySelectorAll('a.headerlink').forEach((a) => a.remove());
    const smallEl = headCopy.querySelector('small');
    const smallText = smallEl ? smallEl.textContent : '';
    if (smallEl) smallEl.remove();
    const headText = clean(headCopy.textContent);
    const isSyllabus = isSyllabusHead(g.head);
    const m = isSyllabus ? null : headText.match(/^Q\s*(\d+)\s*[.:)\-–—]*\s*(.*)$/i);
    const num = m ? m[1] : String(idx + 1);
    const title = isSyllabus ? 'Syllabus' : ((m ? m[2] : headText) || `Question ${num}`);
    const marksMatch = `${smallText} ${headText}`.match(/(\d+(?:\.\d+)?)\s*marks?/i);
    const marks = (marksMatch && !isSyllabus) ? marksMatch[1] : '';

    let id = isSyllabus ? 'syllabus' : `q${num}`;
    if (usedIds.has(id)) id = `q${num}-${idx + 1}`;
    usedIds.add(id);

    const words = g.nodes.reduce((n, el) => n + clean(el.textContent).split(' ').length, 0);
    const mins = Math.max(1, Math.round(words / 180));
    const metaBits = [];
    if (marks) metaBits.push(`${marks} mark${marks === '1' ? '' : 's'}`);
    if (isSyllabus) metaBits.push(`${examLabel} syllabus`); else metaBits.push(`${mins} min read`);

    // Preview text: first real paragraph, with equations left out
    const firstPara = g.nodes.find((el) => el.tagName === 'P' && clean(el.textContent).length > 20);
    let glimpse = '';
    if (isSyllabus) {
      const items = g.nodes.flatMap((el) => Array.from(el.querySelectorAll ? el.querySelectorAll('li') : []));
      const lines = items.length ? items.map((li) => clean(li.firstChild ? li.textContent : '').split(/\s+[—–-]\s+/)[0]) : [clean(g.nodes.map((n) => n.textContent).join(' '))];
      glimpse = lines.join(' · ');
      if (glimpse.length > 170) glimpse = glimpse.slice(0, 167).trimEnd() + '...';
    } else if (firstPara) {
      const pc = firstPara.cloneNode(true);
      pc.querySelectorAll('.arithmatex, .katex, .katex-display, annotation').forEach((n) => n.remove());
      glimpse = clean(pc.textContent).replace(/\(\s*\)/g, '').replace(/\s+([.,;:])/g, '$1');
      if (glimpse.length > 170) glimpse = glimpse.slice(0, 167).trimEnd() + '...';
    }

    // Thumbnail: the first picture in the answer, if any
    let thumb = '';
    for (const el of g.nodes) {
      const img = el.tagName === 'IMG' ? el : el.querySelector('img');
      if (img) { thumb = img.currentSrc || img.src; break; }
    }

    return {
      id, qid: isSyllabus ? 'Syllabus' : `Q${num}`, isSyllabus, title, glimpse, thumb, marks,
      metaShort: metaBits.join(' • '),
      meta: [subjectName].concat(metaBits).join(' · '),
      head: g.head, nodes: g.nodes,
      body: null,
    };
  });

  // ---- "read" ticks: saved in this browser only (localStorage), so no account or server is needed ----
  const STORE_KEY = 'examnotes.done.v1';
  const pageKey = rel || '/';
  let doneMap = {};
  try { doneMap = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; } catch (e) { doneMap = {}; }
  const isDone = (id) => !!doneMap[`${pageKey}#${id}`];
  function setDone(id, on) {
    if (on) doneMap[`${pageKey}#${id}`] = Date.now(); else delete doneMap[`${pageKey}#${id}`];
    try { localStorage.setItem(STORE_KEY, JSON.stringify(doneMap)); } catch (e) { /* private mode: keep it for this visit only */ }
    refreshProgress();
  }

  // ---- group the questions by marks: highest first (10, 5, 2 ...), questions without marks last ----
  const groupMap = new Map();
  const syllabusQ = questionsData.find((q) => q.isSyllabus) || null;
  const realQs = questionsData.filter((q) => !q.isSyllabus);
  realQs.forEach((q) => {
    if (!groupMap.has(q.marks)) groupMap.set(q.marks, []);
    groupMap.get(q.marks).push(q);
  });
  const groupsOrdered = Array.from(groupMap.entries()).sort((a, b) => {
    if (a[0] === '') return 1;
    if (b[0] === '') return -1;
    return parseFloat(b[0]) - parseFloat(a[0]);
  });
  const ordered = (syllabusQ ? [syllabusQ] : []).concat(groupsOrdered.flatMap(([, list]) => list)); // the order shown on screen = order for prev / next

  let appWrapper = document.querySelector('.instapaper-app');
  if (appWrapper) appWrapper.remove();

  appWrapper = document.createElement('div');
  appWrapper.className = 'instapaper-app';

  // Middle Section (Feed)
  const feed = document.createElement('aside');
  feed.className = 'instapaper-feed';

  const feedTitle = esc(subjectName);
  const chevronLeft = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
  const checkSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  const chevronDown = `<svg class="q-group-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
  feed.innerHTML = `
    <div class="feed-top">
    <div class="instapaper-feed-header">
      <a class="feed-back-btn" href="${root}" aria-label="Back to home">${chevronLeft}</a>
      <div class="feed-header-left">
        <span class="feed-home-icon">${icons.home}</span>
        <span class="feed-home-title">${feedTitle}</span>
        <span class="feed-count"></span>
      </div>
      <div class="feed-header-right">
        <button class="feed-icon-btn search-btn" title="Search questions" aria-label="Search questions">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <button class="feed-icon-btn theme-btn" title="Light / dark mode" aria-label="Switch light or dark mode">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"></path></svg>
        </button>
      </div>
    </div>
    ${tabsHtml(pageKind)}
    <div class="feed-search-drawer" style="display: none;">
      <input type="text" class="feed-search-input" placeholder="Search questions..." aria-label="Search questions" />
    </div>
    </div>
    <div class="instapaper-card-list"></div>
  `;

  const cardList = feed.querySelector('.instapaper-card-list');

  // Phones: the header buttons live in a floating pill at the bottom (easy to reach with a thumb)
  const pillIcon = (d) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const feedPill = document.createElement('div');
  feedPill.className = 'feed-pill';
  feedPill.innerHTML = `
    <a class="pill-btn" href="${root}" aria-label="Back to home">${chevronLeft}</a>
    ${tabsHtml(pageKind)}
    <button type="button" class="pill-btn pill-search" aria-label="Search questions">${pillIcon('<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>')}</button>
    <button type="button" class="pill-btn pill-theme" aria-label="Switch light or dark mode">${pillIcon('<circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"></path>')}</button>
  `;
  feed.appendChild(feedPill);
  feedPill.querySelector('.pill-search').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    feed.querySelector('.search-btn').click();
  });
  feedPill.querySelector('.pill-theme').addEventListener('click', () => feed.querySelector('.theme-btn').click());

  function makeCard(q) {
    const card = document.createElement('div');
    card.className = 'instapaper-card';
    card.setAttribute('data-target-id', q.id);
    card.tabIndex = 0;
    card.setAttribute('role', 'button');

    card.innerHTML = `
      ${q.isSyllabus ? '' : `<button type="button" class="card-check" aria-label="Mark as read" aria-pressed="false" title="Mark as read">${checkSvg}</button>`}
      <div class="card-body">
        <h4 class="card-title">${esc(q.title)}</h4>
        <div class="card-meta">${esc(q.metaShort)}</div>
        <p class="card-glimpse">${esc(q.glimpse)}</p>
      </div>
      ${q.thumb ? `<div class="card-thumb"><img src="${esc(q.thumb)}" alt="" loading="lazy"/></div>` : ''}
    `;

    const tick = card.querySelector('.card-check');
    if (tick) tick.addEventListener('click', (e) => {
      e.stopPropagation(); // ticking must not open the question
      setDone(q.id, !isDone(q.id));
    });
    card.addEventListener('click', () => {
      selectQuestion(q.id);
      if (isMobile()) openMobileReader();
    });
    card.addEventListener('keydown', (e) => {
      if (e.target !== card) return; // Enter/Space on the tick button belongs to the button
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
    return card;
  }

  if (syllabusQ) {
    const top = document.createElement('div');
    top.className = 'q-syllabus';
    top.appendChild(makeCard(syllabusQ));
    cardList.appendChild(top);
  }

  groupsOrdered.forEach(([key, list]) => {
    const label = key ? `${key} mark${key === '1' ? '' : 's'}` : 'Other';
    const section = document.createElement('section');
    section.className = 'q-group';
    section.innerHTML = `
      <button type="button" class="q-group-head" aria-expanded="true">
        <span class="q-group-title">${esc(label)}</span>
        <span class="q-group-count"></span>
        ${chevronDown}
      </button>
      <div class="q-group-cards"></div>
    `;
    const box = section.querySelector('.q-group-cards');
    list.forEach((q) => box.appendChild(makeCard(q)));
    section.querySelector('.q-group-head').addEventListener('click', (e) => {
      const collapsed = section.classList.toggle('is-collapsed');
      e.currentTarget.setAttribute('aria-expanded', String(!collapsed));
    });
    cardList.appendChild(section);
  });

  // Right Section (Reader Pane)
  const reader = document.createElement('main');
  reader.className = 'instapaper-reader';

  reader.innerHTML = `
    <div class="instapaper-toolbar">
      <div class="toolbar-left">
        <button class="toolbar-btn mobile-back-btn" title="Back to questions" aria-label="Back to questions">${chevronLeft}</button>
        <button class="toolbar-btn close-btn" title="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <button class="toolbar-btn expand-btn" title="Fullscreen / Expand">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
        </button>
      </div>
      <div class="toolbar-right">
        <button class="toolbar-btn mobile-step-btn prev-q-btn" title="Previous question" aria-label="Previous question">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
        </button>
        <button class="toolbar-btn mobile-step-btn next-q-btn" title="Next question" aria-label="Next question">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <button class="toolbar-btn done-btn" title="Mark as read" aria-label="Mark as read" aria-pressed="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"></circle><polyline points="7.5 12.5 10.5 15.5 16.5 9"></polyline></svg>
        </button>
        <button class="toolbar-btn tag-btn" title="Tags">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
        </button>
        <button class="toolbar-btn folder-btn" title="Move to Folder">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        </button>
        <button class="toolbar-btn archive-btn" title="Archive">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
        </button>
        <button class="toolbar-btn trash-btn" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
        <div class="typography-dropdown-wrap">
          <button class="toolbar-btn type-settings-btn" title="Typography (Aa)">Aa</button>
          <div class="type-settings-menu">
            <div class="type-menu-row">
              <span class="type-menu-label">Font</span>
              <div class="type-pill-group">
                <button class="font-pill serif-pill is-selected" data-font="serif">Serif</button>
                <button class="font-pill sans-pill" data-font="sans">Sans</button>
              </div>
            </div>
            <div class="type-menu-row">
              <span class="type-menu-label">Size</span>
              <div class="type-pill-group">
                <button class="size-pill size-down">A-</button>
                <button class="size-pill size-up">A+</button>
              </div>
            </div>
          </div>
        </div>
        <button class="toolbar-btn more-options-btn" title="Options">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
        </button>
      </div>
    </div>
    <article class="instapaper-article"></article>
  `;

  const articleViewport = reader.querySelector('.instapaper-article');

  appWrapper.appendChild(feed);
  appWrapper.appendChild(reader);

  pageContent.insertBefore(appWrapper, pageContent.firstChild);

  // Anything written above the first question (e.g. a short note) is kept, at the top of the list.
  if (introNodes.length) {
    const intro = document.createElement('div');
    intro.className = 'feed-intro';
    intro.append(...introNodes);
    feed.insertBefore(intro, cardList);
  }

  // Move each question's own content into the reader (moved, not copied: no duplicate ids, nothing left behind).
  questionsData.forEach((q) => {
    const body = document.createElement('div');
    body.className = 'reader-content';
    body.append(...q.nodes);
    body.querySelectorAll('img:not([loading]), iframe:not([loading])').forEach((n) => n.setAttribute('loading', 'lazy'));
    body.querySelectorAll('video:not([preload])').forEach((v) => v.setAttribute('preload', 'none'));
    q.head.remove();
    q.body = body;
    q.mathDone = false;
  });

  const mathOptions = {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    throwOnError: false
  };
  const headerCache = new Map();
  function getArticleNodes(qData) {
    let header = headerCache.get(qData.id);
    if (!header) {
      header = document.createElement('header');
      header.className = 'reader-header';
      const h1 = document.createElement('h1');
      h1.className = 'reader-title';
      h1.textContent = qData.title;
      const byline = document.createElement('div');
      byline.className = 'reader-byline';
      byline.textContent = qData.meta;
      header.append(h1, byline);
      headerCache.set(qData.id, header);
    }
    if (!qData.mathDone && typeof renderMathInElement === 'function') {
      renderMathInElement(qData.body, mathOptions); // once per answer, then reused
      qData.mathDone = true;
    }
    return [header, qData.body];
  }

  // Scroll only the question list (never the whole page) to keep the active card in view.
  function keepCardVisible(card) {
    if (cardList.scrollHeight <= cardList.clientHeight + 1) return;
    const lr = cardList.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    if (cr.top < lr.top) cardList.scrollTop -= (lr.top - cr.top) + 8;
    else if (cr.bottom > lr.bottom) cardList.scrollTop += (cr.bottom - lr.bottom) + 8;
  }

  // Phone layout: the reader replaces the list. Reset scroll on open, restore the list position on back.
  let feedScrollY = 0;
  let readerPushed = false;
  function openMobileReader() {
    if (appWrapper.classList.contains('mobile-reader-open')) return;
    feedScrollY = window.scrollY;
    appWrapper.classList.add('mobile-reader-open');
    window.scrollTo({ top: 0, behavior: 'instant' });
    // A state-less history entry: the theme's instant navigation ignores it, but the phone's Back
    // button pops it, which returns to the list instead of leaving the page.
    try { history.pushState(null, '', `#${currentId}`); readerPushed = true; } catch (e) { readerPushed = false; }
  }
  function hideMobileReader() {
    if (!appWrapper.classList.contains('mobile-reader-open')) return;
    appWrapper.classList.remove('mobile-reader-open');
    readerPushed = false;
    window.scrollTo({ top: feedScrollY, behavior: 'instant' });
  }
  function backFromReader() {
    if (readerPushed) history.back(); // popstate below hides the reader
    else hideMobileReader();
  }
  window.addEventListener('popstate', hideMobileReader, listen);

  // End of every answer: mark as read, or go straight on to the next question
  const finish = document.createElement('div');
  finish.className = 'reader-finish';
  finish.innerHTML = `
    <button type="button" class="finish-done"><span class="finish-icon">${checkSvg}</span><span class="finish-label">Mark as read</span></button>
    <button type="button" class="finish-next">Next question <span aria-hidden="true">&rsaquo;</span></button>
  `;
  const doneBtn = reader.querySelector('.done-btn');
  const toggleCurrentDone = () => { if (currentId) setDone(currentId, !isDone(currentId)); };
  doneBtn.addEventListener('click', toggleCurrentDone);
  finish.querySelector('.finish-done').addEventListener('click', toggleCurrentDone);
  finish.querySelector('.finish-next').addEventListener('click', () => stepQuestion(1));

  function updateDoneButtons() {
    const on = !!currentId && isDone(currentId);
    doneBtn.classList.toggle('is-done', on);
    doneBtn.setAttribute('aria-pressed', String(on));
    doneBtn.title = on ? 'Marked as read (tap to undo)' : 'Mark as read';
    finish.classList.toggle('is-done', on);
    finish.querySelector('.finish-label').textContent = on ? 'Read. Tap to undo' : 'Mark as read';
    const pos = ordered.findIndex((q) => q.id === currentId);
    finish.querySelector('.finish-next').hidden = pos < 0 || pos >= ordered.length - 1;
    const isSy = !!syllabusQ && currentId === syllabusQ.id;
    doneBtn.hidden = isSy;
    finish.querySelector('.finish-done').hidden = isSy;
    finish.querySelector('.finish-next').textContent = isSy ? 'First question ›' : 'Next question ›';
  }

  // Ticks on the cards, "2/3" counts on each marks group and the total next to the title
  function refreshProgress() {
    let total = 0;
    let done = 0;
    cardList.querySelectorAll('.q-group').forEach((sec) => {
      const cards = Array.from(sec.querySelectorAll('.instapaper-card'));
      let d = 0;
      cards.forEach((c) => {
        const on = isDone(c.getAttribute('data-target-id'));
        c.classList.toggle('is-done', on);
        c.querySelector('.card-check').setAttribute('aria-pressed', String(on));
        if (on) d += 1;
      });
      sec.querySelector('.q-group-count').textContent = `${d}/${cards.length}`;
      total += cards.length;
      done += d;
    });
    const cnt = feed.querySelector('.feed-count');
    if (cnt) cnt.textContent = total ? `${done}/${total}` : '';
    updateDoneButtons();
  }

  const prevBtn = reader.querySelector('.prev-q-btn');
  const nextBtn = reader.querySelector('.next-q-btn');
  let currentId = null;
  function selectQuestion(id) {
    const qData = questionsData.find(item => item.id === id) || questionsData[0];
    if (!qData || qData.id === currentId) return;
    currentId = qData.id;

    cardList.querySelectorAll('.instapaper-card').forEach(c => {
      const on = c.getAttribute('data-target-id') === qData.id;
      c.classList.toggle('is-active', on);
      if (on) keepCardVisible(c);
    });

    articleViewport.replaceChildren(...getArticleNodes(qData), finish);
    reader.scrollTo({ top: 0, behavior: 'instant' });
    updateDoneButtons();
    const pos = ordered.indexOf(qData);
    if (prevBtn) prevBtn.disabled = pos <= 0;
    if (nextBtn) nextBtn.disabled = pos >= ordered.length - 1;

    // On phones the list keeps a clean URL; only the reader entry carries #qN (so Back returns to the list).
    const writeHash = !isMobile() || appWrapper.classList.contains('mobile-reader-open');
    if (writeHash && history.replaceState && window.location.hash !== `#${qData.id}`) {
      history.replaceState(history.state, '', `#${qData.id}`);
    }
  }

  const currentHash = window.location.hash.replace('#', '');
  const hashMatches = currentHash && questionsData.some(q => q.id === currentHash);
  if (ordered.length) {
    selectQuestion(hashMatches ? currentHash : (realQs[0] || ordered[0]).id);
    if (hashMatches && isMobile()) appWrapper.classList.add('mobile-reader-open'); // opened from a shared link
  } else {
    appWrapper.classList.add('is-empty'); // Mid/End Sem page with no questions yet
    articleViewport.innerHTML = '<p class="reader-empty">Questions added to this page will open here.</p>';
  }
  refreshProgress();

  // Search Toggle
  const searchBtn = feed.querySelector('.search-btn');
  const searchDrawer = feed.querySelector('.feed-search-drawer');
  const searchInput = feed.querySelector('.feed-search-input');
  if (searchBtn && searchDrawer && searchInput) {
    searchBtn.addEventListener('click', () => {
      const isVisible = searchDrawer.style.display !== 'none';
      searchDrawer.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) searchInput.focus();
    });

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      cardList.querySelectorAll('.instapaper-card').forEach(card => {
        const titleText = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const glimpseText = card.querySelector('.card-glimpse')?.textContent.toLowerCase() || '';
        card.style.display = (titleText.includes(query) || glimpseText.includes(query)) ? '' : 'none';
      });
      cardList.querySelectorAll('.q-group, .q-syllabus').forEach((sec) => {
        sec.hidden = !Array.from(sec.querySelectorAll('.instapaper-card')).some((c) => c.style.display !== 'none');
      });
    });
  }

  // Mobile Back Button
  const mobileBackBtn = reader.querySelector('.mobile-back-btn');
  if (mobileBackBtn) {
    mobileBackBtn.addEventListener('click', backFromReader);
  }
  const closeBtn = reader.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (isMobile()) backFromReader();
      else appWrapper.classList.remove('is-reader-expanded');
    });
  }

  // Expand / Fullscreen
  const expandBtn = reader.querySelector('.expand-btn');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      appWrapper.classList.toggle('is-reader-expanded');
    });
  }

  // Previous / next question (phone toolbar)
  function stepQuestion(delta) {
    const pos = ordered.findIndex(q => q.id === currentId);
    const target = ordered[pos + delta];
    if (!target) return;
    selectQuestion(target.id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (prevBtn) prevBtn.addEventListener('click', () => stepQuestion(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => stepQuestion(1));

  // Light / dark switch: reuse the theme's own palette toggle (its header is hidden on these pages)
  const themeBtn = feed.querySelector('.theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const label = document.querySelector('[data-md-component="palette"] label:not([hidden])');
      if (label) label.click();
    });
  }

  // Typography Settings Dropdown
  const typeBtn = reader.querySelector('.type-settings-btn');
  const typeMenu = reader.querySelector('.type-settings-menu');
  if (typeBtn && typeMenu) {
    typeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      typeMenu.classList.toggle('is-visible');
    });
    document.addEventListener('click', () => {
      typeMenu.classList.remove('is-visible');
    }, listen);
    typeMenu.addEventListener('click', (e) => e.stopPropagation());
  }

  // Serif vs Sans
  const serifPill = reader.querySelector('.serif-pill');
  const sansPill = reader.querySelector('.sans-pill');
  if (serifPill && sansPill) {
    serifPill.addEventListener('click', () => {
      serifPill.classList.add('is-selected');
      sansPill.classList.remove('is-selected');
      articleViewport.classList.remove('font-sans');
    });
    sansPill.addEventListener('click', () => {
      sansPill.classList.add('is-selected');
      serifPill.classList.remove('is-selected');
      articleViewport.classList.add('font-sans');
    });
  }

  // Font Size Up / Down
  let currentFontSize = parseFloat(getComputedStyle(articleViewport).fontSize) || 19;
  const sizeUpBtn = reader.querySelector('.size-up');
  const sizeDownBtn = reader.querySelector('.size-down');
  if (sizeUpBtn && sizeDownBtn) {
    sizeUpBtn.addEventListener('click', () => {
      if (currentFontSize < 25) {
        currentFontSize += 1.5;
        articleViewport.style.fontSize = `${currentFontSize}px`;
      }
    });
    sizeDownBtn.addEventListener('click', () => {
      if (currentFontSize > 15) {
        currentFontSize -= 1.5;
        articleViewport.style.fontSize = `${currentFontSize}px`;
      }
    });
  }

  // Keyboard navigation: j / k anywhere; arrow keys only while the question list has focus, so the
  // arrow keys keep scrolling the answer normally.
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    const inFeed = !!(t && t.closest && t.closest('.instapaper-card-list'));
    const down = e.key === 'j' || (e.key === 'ArrowDown' && inFeed);
    const up = e.key === 'k' || (e.key === 'ArrowUp' && inFeed);
    if (!down && !up) return;

    const cards = Array.from(cardList.querySelectorAll('.instapaper-card')).filter(c => c.style.display !== 'none' && !c.closest('.q-group.is-collapsed'));
    const activeCard = cardList.querySelector('.instapaper-card.is-active');
    const currentIndex = cards.indexOf(activeCard);
    const target = cards[currentIndex + (down ? 1 : -1)];
    e.preventDefault();
    if (!target) return;
    selectQuestion(target.getAttribute('data-target-id'));
    if (inFeed) target.focus({ preventScroll: true });
  }, listen);
});
