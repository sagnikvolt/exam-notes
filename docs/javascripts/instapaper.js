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

        <div class="ip-user-footer">
          <div class="ip-user-avatar">
            S
          </div>
          <span class="ip-user-name">sagnikvolt</span>
          <span class="ip-user-more">⁝</span>
        </div>
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
  const container = document.querySelector('.instapaper-container');
  if (!container) return;

  const rawQuestions = Array.from(container.querySelectorAll('.question-article'));
  if (rawQuestions.length === 0) return;

  const questionsData = rawQuestions.map((el, idx) => {
    const qid = el.getAttribute('data-qid') || `Q${idx + 1}`;
    const id = el.id || `q${idx + 1}`;
    const title = el.getAttribute('data-title') || el.querySelector('h2')?.textContent.replace(/[¶\u00b6]/g, '').trim() || `Question ${idx + 1}`;
    const meta = el.getAttribute('data-meta') || 'PEC-EE 701C · 5 marks · Mid Sem · 2 min read';
    const glimpse = el.getAttribute('data-glimpse') || el.querySelector('.article-lead')?.textContent.trim() || '';
    const thumb = el.getAttribute('data-thumb') || '';
    
    const fullContent = el.cloneNode(true);
    // The hidden original keeps the ids; the copy must not duplicate them (duplicate ids made the page jump).
    fullContent.removeAttribute('id');
    fullContent.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
    fullContent.querySelectorAll('a.headerlink').forEach((a) => a.remove());
    const cloneH2 = fullContent.querySelector('h2');
    if (cloneH2) cloneH2.remove();

    const parts = meta.split('·').map(x => x.trim()).filter(Boolean);
    const metaShort = (parts.length > 2 ? parts.slice(1) : parts).join(' • ');

    return { id, qid, title, meta, metaShort, glimpse, thumb, fullContent };
  });

  container.style.display = 'none';

  let appWrapper = document.querySelector('.instapaper-app');
  if (appWrapper) appWrapper.remove();

  appWrapper = document.createElement('div');
  appWrapper.className = 'instapaper-app';

  // Middle Section (Feed)
  const feed = document.createElement('aside');
  feed.className = 'instapaper-feed';

  const feedTitle = esc((document.querySelector('.md-content__inner > h1')?.textContent || 'Questions').replace(/[¶\u00b6]/g, '').trim());
  const chevronLeft = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
  feed.innerHTML = `
    <div class="instapaper-feed-header">
      <a class="feed-back-btn" href="${root}" aria-label="Back to home">${chevronLeft}</a>
      <div class="feed-header-left">
        <span class="feed-home-icon">${icons.home}</span>
        <span class="feed-home-title">${feedTitle}</span>
        <span class="feed-count">${questionsData.length}</span>
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
    <div class="feed-search-drawer" style="display: none;">
      <input type="text" class="feed-search-input" placeholder="Search questions..." aria-label="Search questions" />
    </div>
    <div class="instapaper-card-list"></div>
  `;

  const cardList = feed.querySelector('.instapaper-card-list');

  questionsData.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = `instapaper-card ${idx === 0 ? 'is-active' : ''}`;
    card.setAttribute('data-target-id', q.id);
    card.tabIndex = 0;
    card.setAttribute('role', 'button');

    card.innerHTML = `
      <div class="card-body">
        <h4 class="card-title">${q.title}</h4>
        <div class="card-meta">${q.metaShort}</div>
        <p class="card-glimpse">${q.glimpse}</p>
      </div>
      ${q.thumb ? `<div class="card-thumb"><img src="${q.thumb}" alt="${q.title}" loading="lazy"/></div>` : ''}
    `;

    card.addEventListener('click', () => {
      selectQuestion(q.id);
      if (isMobile()) openMobileReader();
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    cardList.appendChild(card);
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
        <button class="toolbar-btn fav-btn" title="Like / Bookmark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
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

  const contentParent = document.querySelector('.md-content__inner') || container.parentNode;
  contentParent.insertBefore(appWrapper, contentParent.firstChild);

  // Build each answer once (incl. KaTeX) and reuse it, so switching questions is instant.
  const articleCache = new Map();
  const mathOptions = {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    throwOnError: false
  };
  function getArticleNodes(qData) {
    let nodes = articleCache.get(qData.id);
    if (nodes) return nodes;
    const header = document.createElement('header');
    header.className = 'reader-header';
    const h1 = document.createElement('h1');
    h1.className = 'reader-title';
    h1.textContent = qData.title;
    const byline = document.createElement('div');
    byline.className = 'reader-byline';
    byline.textContent = qData.meta;
    header.append(h1, byline);
    const content = document.createElement('div');
    content.className = 'reader-content';
    content.append(...Array.from(qData.fullContent.childNodes));
    if (typeof renderMathInElement === 'function') renderMathInElement(content, mathOptions);
    nodes = [header, content];
    articleCache.set(qData.id, nodes);
    return nodes;
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

    articleViewport.replaceChildren(...getArticleNodes(qData));
    reader.scrollTo({ top: 0, behavior: 'instant' });
    const pos = questionsData.indexOf(qData);
    if (prevBtn) prevBtn.disabled = pos <= 0;
    if (nextBtn) nextBtn.disabled = pos >= questionsData.length - 1;

    // On phones the list keeps a clean URL; only the reader entry carries #qN (so Back returns to the list).
    const writeHash = !isMobile() || appWrapper.classList.contains('mobile-reader-open');
    if (writeHash && history.replaceState && window.location.hash !== `#${qData.id}`) {
      history.replaceState(history.state, '', `#${qData.id}`);
    }
  }

  const currentHash = window.location.hash.replace('#', '');
  const hashMatches = currentHash && questionsData.some(q => q.id === currentHash);
  selectQuestion(hashMatches ? currentHash : questionsData[0].id);
  if (hashMatches && isMobile()) appWrapper.classList.add('mobile-reader-open'); // opened from a shared link

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
        if (titleText.includes(query) || glimpseText.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
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

  // Favorite Heart
  const favBtn = reader.querySelector('.fav-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      favBtn.classList.toggle('is-favorited');
    });
  }

  // Previous / next question (phone toolbar)
  function stepQuestion(delta) {
    const pos = questionsData.findIndex(q => q.id === currentId);
    const target = questionsData[pos + delta];
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

    const cards = Array.from(cardList.querySelectorAll('.instapaper-card')).filter(c => c.style.display !== 'none');
    const activeCard = cardList.querySelector('.instapaper-card.is-active');
    const currentIndex = cards.indexOf(activeCard);
    const target = cards[currentIndex + (down ? 1 : -1)];
    e.preventDefault();
    if (!target) return;
    selectQuestion(target.getAttribute('data-target-id'));
    if (inFeed) target.focus({ preventScroll: true });
  }, listen);
});
