/* ==========================================================================
   Instapaper 3-Pane Reader Experience for Exam Notes
   ========================================================================== */

document$.subscribe(() => {
  const container = document.querySelector('.instapaper-container');
  if (!container) return;

  const rawQuestions = Array.from(container.querySelectorAll('.question-article'));
  if (rawQuestions.length === 0) return;

  // Extract question data
  const questionsData = rawQuestions.map((el, idx) => {
    const qid = el.getAttribute('data-qid') || `Q${idx + 1}`;
    const id = el.id || `q${idx + 1}`;
    const title = el.getAttribute('data-title') || el.querySelector('h2')?.textContent.replace(/<.*?>/g, '').trim() || `Question ${idx + 1}`;
    const meta = el.getAttribute('data-meta') || '5 marks · Mid Sem';
    const glimpse = el.getAttribute('data-glimpse') || el.querySelector('.article-lead')?.textContent.trim() || '';
    const thumb = el.getAttribute('data-thumb') || '';
    
    // Store clone of inner content
    const fullContent = el.cloneNode(true);
    // Remove the h2 from clone if we render a custom large serif header
    const cloneH2 = fullContent.querySelector('h2');
    if (cloneH2) cloneH2.remove();

    return { id, qid, title, meta, glimpse, thumb, fullContent };
  });

  // Hide the original linear container
  container.style.display = 'none';

  // Check if our Instapaper wrapper already exists (e.g. across instant navigation)
  let appWrapper = document.querySelector('.instapaper-app');
  if (appWrapper) appWrapper.remove();

  appWrapper = document.createElement('div');
  appWrapper.className = 'instapaper-app';

  // Build Middle Section (Question Feed)
  const feed = document.createElement('aside');
  feed.className = 'instapaper-feed';

  const feedHeader = document.createElement('div');
  feedHeader.className = 'instapaper-feed-header';
  feedHeader.innerHTML = `
    <div class="feed-header-top">
      <div class="feed-header-title">
        <span class="feed-icon">📄</span>
        <span class="feed-title-text">Questions</span>
        <span class="feed-count-badge">${questionsData.length}</span>
      </div>
      <div class="feed-header-actions">
        <button class="feed-action-btn search-toggle" title="Search questions" aria-label="Search">🔍</button>
      </div>
    </div>
    <div class="feed-search-bar">
      <input type="text" class="feed-search-input" placeholder="Search questions & topics..." />
    </div>
  `;
  feed.appendChild(feedHeader);

  const cardList = document.createElement('div');
  cardList.className = 'instapaper-card-list';

  questionsData.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = `instapaper-card ${idx === 0 ? 'is-active' : ''}`;
    card.setAttribute('data-target-id', q.id);

    card.innerHTML = `
      <div class="card-body">
        <h4 class="card-title">${q.title}</h4>
        <div class="card-meta">${q.meta}</div>
        <p class="card-glimpse">${q.glimpse}</p>
      </div>
      ${q.thumb ? `<div class="card-thumb"><img src="${q.thumb}" alt="${q.title}" loading="lazy"/></div>` : ''}
    `;

    card.addEventListener('click', () => {
      selectQuestion(q.id);
      // On mobile view, open reader view
      if (window.innerWidth <= 960) {
        appWrapper.classList.add('mobile-reader-open');
      }
    });

    cardList.appendChild(card);
  });
  feed.appendChild(cardList);

  // Build Right Section (Reader Pane)
  const reader = document.createElement('main');
  reader.className = 'instapaper-reader';

  // Toolbar
  const readerToolbar = document.createElement('div');
  readerToolbar.className = 'instapaper-toolbar';
  readerToolbar.innerHTML = `
    <div class="toolbar-left">
      <button class="toolbar-btn mobile-back-btn" title="Back to questions" aria-label="Back">← Back</button>
      <button class="toolbar-btn close-view-btn" title="Toggle view">✕</button>
      <button class="toolbar-btn expand-btn" title="Expand reading pane">⤢</button>
    </div>
    <div class="toolbar-right">
      <button class="toolbar-btn favorite-btn" title="Save / Bookmark">♥</button>
      <button class="toolbar-btn copy-btn" title="Copy question link">📋</button>
      <div class="typography-dropdown-wrap">
        <button class="toolbar-btn type-settings-btn" title="Font and text settings">Aa</button>
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
              <button class="size-pill size-down" title="Decrease font size">A-</button>
              <button class="size-pill size-up" title="Increase font size">A+</button>
            </div>
          </div>
        </div>
      </div>
      <button class="toolbar-btn more-btn" title="Options">⁝</button>
    </div>
  `;
  reader.appendChild(readerToolbar);

  // Article reading viewport
  const articleViewport = document.createElement('article');
  articleViewport.className = 'instapaper-article';
  reader.appendChild(articleViewport);

  // Assemble
  appWrapper.appendChild(feed);
  appWrapper.appendChild(reader);
  container.parentNode.insertBefore(appWrapper, container);

  // Function to render selected question
  function selectQuestion(id) {
    const qData = questionsData.find(item => item.id === id) || questionsData[0];
    if (!qData) return;

    // Update active state in cards list
    cardList.querySelectorAll('.instapaper-card').forEach(c => {
      if (c.getAttribute('data-target-id') === qData.id) {
        c.classList.add('is-active');
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        c.classList.remove('is-active');
      }
    });

    // Populate Reader Pane
    articleViewport.innerHTML = `
      <header class="reader-header">
        <h1 class="reader-title">${qData.title}</h1>
        <div class="reader-byline">${qData.meta}</div>
      </header>
      <div class="reader-content">
        ${qData.fullContent.innerHTML}
      </div>
    `;

    // Re-render KaTeX math inside the reader pane
    if (typeof renderMathInElement === 'function') {
      renderMathInElement(articleViewport, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    }

    // Scroll reader to top smoothly
    reader.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash without jitter
    if (history.replaceState) {
      history.replaceState(null, null, `#${qData.id}`);
    }
  }

  // Handle URL hash on load
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash && questionsData.some(q => q.id === currentHash)) {
    selectQuestion(currentHash);
  } else {
    selectQuestion(questionsData[0].id);
  }

  // Search filtering in middle pane
  const searchInput = feedHeader.querySelector('.feed-search-input');
  if (searchInput) {
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

  // Mobile back button
  const mobileBackBtn = readerToolbar.querySelector('.mobile-back-btn');
  if (mobileBackBtn) {
    mobileBackBtn.addEventListener('click', () => {
      appWrapper.classList.remove('mobile-reader-open');
    });
  }

  // Favorite button toggle
  const favBtn = readerToolbar.querySelector('.favorite-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      favBtn.classList.toggle('is-favorited');
    });
  }

  // Copy question link
  const copyBtn = readerToolbar.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const activeCard = cardList.querySelector('.instapaper-card.is-active');
      const targetId = activeCard ? activeCard.getAttribute('data-target-id') : 'q1';
      const fullUrl = `${window.location.origin}${window.location.pathname}#${targetId}`;
      navigator.clipboard.writeText(fullUrl).then(() => {
        const origText = copyBtn.textContent;
        copyBtn.textContent = '✓';
        setTimeout(() => { copyBtn.textContent = origText; }, 1500);
      });
    });
  }

  // Expand / Fullscreen reading toggle
  const expandBtn = readerToolbar.querySelector('.expand-btn');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      appWrapper.classList.toggle('is-reader-expanded');
    });
  }

  // Typography controls: Aa popup toggle
  const typeBtn = readerToolbar.querySelector('.type-settings-btn');
  const typeMenu = readerToolbar.querySelector('.type-settings-menu');
  if (typeBtn && typeMenu) {
    typeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      typeMenu.classList.toggle('is-visible');
    });
    document.addEventListener('click', () => {
      typeMenu.classList.remove('is-visible');
    });
    typeMenu.addEventListener('click', (e) => e.stopPropagation());
  }

  // Serif vs Sans toggle
  let currentFont = 'serif';
  const serifPill = readerToolbar.querySelector('.serif-pill');
  const sansPill = readerToolbar.querySelector('.sans-pill');
  if (serifPill && sansPill) {
    serifPill.addEventListener('click', () => {
      serifPill.classList.add('is-selected');
      sansPill.classList.remove('is-selected');
      articleViewport.classList.remove('font-sans');
      articleViewport.classList.add('font-serif');
      currentFont = 'serif';
    });
    sansPill.addEventListener('click', () => {
      sansPill.classList.add('is-selected');
      serifPill.classList.remove('is-selected');
      articleViewport.classList.remove('font-serif');
      articleViewport.classList.add('font-sans');
      currentFont = 'sans';
    });
  }

  // Font size up / down
  let currentFontSize = 19;
  const sizeUpBtn = readerToolbar.querySelector('.size-up');
  const sizeDownBtn = readerToolbar.querySelector('.size-down');
  if (sizeUpBtn && sizeDownBtn) {
    sizeUpBtn.addEventListener('click', () => {
      if (currentFontSize < 26) {
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

  // Keyboard navigation: J/K or Up/Down to cycle through questions
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const activeCard = cardList.querySelector('.instapaper-card.is-active');
    if (!activeCard) return;

    const cards = Array.from(cardList.querySelectorAll('.instapaper-card')).filter(c => c.style.display !== 'none');
    const currentIndex = cards.indexOf(activeCard);

    if (e.key === 'ArrowDown' || e.key === 'j') {
      e.preventDefault();
      const next = cards[currentIndex + 1];
      if (next) selectQuestion(next.getAttribute('data-target-id'));
    } else if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault();
      const prev = cards[currentIndex - 1];
      if (prev) selectQuestion(prev.getAttribute('data-target-id'));
    }
  });
});

