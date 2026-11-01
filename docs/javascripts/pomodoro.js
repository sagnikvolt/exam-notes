/* Pomodoro timer: floating pill, small chime, state survives page loads. */
(function () {
  const KEY = 'pomo-v1';
  const MODES = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const LABEL = { focus: 'Focus', short: 'Break', long: 'Long break' };
  let st;
  try { st = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  st = Object.assign({ mode: 'focus', left: MODES.focus, end: 0, running: false, done: 0 }, st || {});
  let ctx = null, tick = null, root = null, open = false;

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

  function chime() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      [660, 880, 1320].forEach((f, i) => {
        const t = ctx.currentTime + i * 0.18;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.75);
      });
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate(200);
  }

  function remaining() {
    return st.running ? Math.max(0, Math.round((st.end - Date.now()) / 1000)) : st.left;
  }

  function finish() {
    st.running = false;
    if (st.mode === 'focus') { st.done++; st.mode = st.done % 4 === 0 ? 'long' : 'short'; }
    else st.mode = 'focus';
    st.left = MODES[st.mode];
    save(); chime();
    if (document.title && !document.hidden === false) document.title = '⏰ ' + document.title;
  }

  function render() {
    if (!root) return;
    const r = remaining();
    if (st.running && r <= 0) finish();
    const rr = remaining();
    root.querySelector('.pomo-time').textContent = fmt(rr);
    root.querySelector('.pomo-mode').textContent = LABEL[st.mode] + (st.done ? ' · ' + st.done + '✓' : '');
    root.querySelector('.pomo-go').textContent = st.running ? 'Pause' : 'Start';
    root.classList.toggle('pomo-run', st.running);
    root.classList.toggle('pomo-break', st.mode !== 'focus');
    root.classList.toggle('pomo-open', open);
    root.querySelector('.pomo-pill-t').textContent = (st.running ? '' : '🍅 ') + fmt(rr);
  }

  function build() {
    if (root && document.body.contains(root)) return;
    root = document.createElement('div');
    root.className = 'pomo';
    root.innerHTML =
      '<button class="pomo-pill" aria-label="Pomodoro timer"><span class="pomo-pill-t"></span></button>' +
      '<div class="pomo-panel"><div class="pomo-mode"></div><div class="pomo-time"></div>' +
      '<div class="pomo-row"><button class="pomo-go">Start</button><button class="pomo-skip" title="Skip">Skip</button><button class="pomo-reset" title="Reset">Reset</button></div>' +
      '<div class="pomo-row pomo-modes"><button data-m="focus">25</button><button data-m="short">5</button><button data-m="long">15</button></div></div>';
    document.body.appendChild(root);
    root.querySelector('.pomo-pill').onclick = () => { open = !open; render(); };
    root.querySelector('.pomo-go').onclick = () => {
      if (ctx === null) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
      if (ctx && ctx.state === 'suspended') ctx.resume();
      if (st.running) { st.left = remaining(); st.running = false; }
      else { st.end = Date.now() + st.left * 1000; st.running = true; }
      save(); render();
    };
    root.querySelector('.pomo-reset').onclick = () => { st.running = false; st.left = MODES[st.mode]; save(); render(); };
    root.querySelector('.pomo-skip').onclick = () => {
      st.running = false;
      st.mode = st.mode === 'focus' ? 'short' : 'focus'; st.left = MODES[st.mode]; save(); render();
    };
    root.querySelectorAll('[data-m]').forEach((b) => b.onclick = () => {
      st.mode = b.dataset.m; st.left = MODES[st.mode]; st.running = false; save(); render();
    });
    render();
  }

  build();
  if (typeof document$ !== 'undefined') document$.subscribe(build);
  if (!tick) tick = setInterval(render, 500);
})();
