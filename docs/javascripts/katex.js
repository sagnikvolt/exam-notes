document$.subscribe(() => {
  if (typeof renderMathInElement !== 'function') return;
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    // The hidden source copy of each question is rendered once, inside the reader, by instapaper.js
    ignoredClasses: ['instapaper-container'],
    throwOnError: false
  })
})
