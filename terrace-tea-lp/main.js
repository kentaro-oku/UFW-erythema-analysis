(() => {
  'use strict';

  // ---- config: the frame sequence extracted from assets/terrace-tea.mp4 (4s × 30fps)
  const FRAME_COUNT = 120;
  const BG = '#15231b';
  const framePath = (i) => `frames/frame_${String(i + 1).padStart(4, '0')}.webp`;

  const section = document.getElementById('hero');
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loader-fill');
  const loaderText = document.getElementById('loader-text');
  const progressFill = document.getElementById('progress-fill');
  const beats = [...document.querySelectorAll('.beat')];
  const header = document.querySelector('.site-header');
  const mobileQuery = window.matchMedia('(max-width: 860px)');

  const images = new Array(FRAME_COUNT);
  let loaded = 0;
  let currentFrame = -1;
  let targetProgress = 0;
  let ticking = false;

  // ---- canvas sizing (cover fit, HiDPI aware)
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    currentFrame = -1;
    render();
  }

  function drawFrame(index) {
    // fall back to the nearest frame that has finished loading
    let img = images[index];
    if (!img || !img.complete || !img.naturalWidth) {
      for (let d = 1; d < FRAME_COUNT; d++) {
        const a = images[index - d], b = images[index + d];
        if (a && a.complete && a.naturalWidth) { img = a; break; }
        if (b && b.complete && b.naturalWidth) { img = b; break; }
      }
    }
    if (!img || !img.naturalWidth) return;
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, cw, ch);
    if (cw / ch < 0.9) {
      // portrait: fill the upper ~62% with the film and fade it into the background,
      // leaving the lower area free for copy
      const areaH = ch * 0.62;
      const scale = Math.max(cw / iw, areaH / ih);
      const w = iw * scale, h = ih * scale;
      const y = Math.max(0, areaH - h);
      ctx.drawImage(img, (cw - w) / 2, y, w, h);
      const g = ctx.createLinearGradient(0, y + h * 0.7, 0, y + h);
      g.addColorStop(0, 'rgba(21,35,27,0)');
      g.addColorStop(1, BG);
      ctx.fillStyle = g;
      ctx.fillRect(0, y + h * 0.7, cw, h * 0.3 + 1);
    } else {
      const scale = Math.max(cw / iw, ch / ih);
      const w = iw * scale, h = ih * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }
  }

  // ---- scroll progress (0..1) through the sticky section
  function getProgress() {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    return Math.min(1, Math.max(0, -rect.top / scrollable));
  }

  function updateBeats(p) {
    for (const el of beats) {
      const start = parseFloat(el.dataset.start), end = parseFloat(el.dataset.end);
      const fade = 0.06;
      let o = 0;
      if (p >= start && p <= end) {
        o = Math.min(1, (p - start) / fade + (start === 0 ? 1 : 0), (end - p) / fade + (end >= 1 ? 1 : 0));
      }
      o = Math.max(0, Math.min(1, o));
      el.style.opacity = o.toFixed(3);
      const shift = (1 - o) * 24;
      let base;
      if (el.classList.contains('scroll-hint')) base = 'translateX(-50%) ';
      else if (el.classList.contains('align-left') || el.classList.contains('align-right')) base = mobileQuery.matches ? '' : 'translate(0, -50%) ';
      else base = 'translate(-50%, -50%) ';
      el.style.transform = `${base}translateY(${shift}px)`;
      el.classList.toggle('is-active', o > 0.5);
    }
  }

  function render() {
    ticking = false;
    const p = targetProgress;
    const frame = Math.min(FRAME_COUNT - 1, Math.floor(p * (FRAME_COUNT - 1) + 0.5));
    if (frame !== currentFrame) {
      currentFrame = frame;
      drawFrame(frame);
    }
    progressFill.style.transform = `scaleX(${p})`;
    updateBeats(p);
  }

  function onScroll() {
    targetProgress = getProgress();
    header.classList.toggle('is-solid', window.scrollY > section.offsetHeight - window.innerHeight);
    if (!ticking) { ticking = true; requestAnimationFrame(render); }
  }

  // ---- preload: first frame immediately, then the rest
  function load(i) {
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => {
        loaded++;
        const pct = Math.round((loaded / FRAME_COUNT) * 100);
        loaderFill.style.width = pct + '%';
        loaderText.textContent = `Loading ${pct}%`;
        if (i === currentFrame || currentFrame === -1) { currentFrame = -1; render(); }
        resolve();
      };
      img.src = framePath(i);
      images[i] = img;
    });
  }

  load(0).then(() => {
    resize();
    const rest = [];
    for (let i = 1; i < FRAME_COUNT; i++) rest.push(load(i));
    // let the visitor start once enough frames are in; hide loader when complete
    Promise.all(rest).then(() => { loader.classList.add('is-done'); currentFrame = -1; render(); });
    setTimeout(() => loader.classList.add('is-done'), 4000);
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { resize(); onScroll(); });
  onScroll();

  // ---- reveal-on-scroll for lower sections
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
