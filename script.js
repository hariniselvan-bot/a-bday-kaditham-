/* ═══════════════════════════════════════════════════════════════
   HAPPY BIRTHDAY, SALOO ♡ — interactions
   vanilla JS only · no frameworks
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);

  /* ─────────────────────────────────────────────────────────
     1 · floating petals
  ───────────────────────────────────────────────────────── */
  function spawnPetals() {
    const box = $('#petals');
    if (!box) return;
    const COUNT = 16;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'petal' + (Math.random() < 0.22 ? ' gold' : '');
      const size = 9 + Math.random() * 8;
      p.style.setProperty('--size', size.toFixed(1) + 'px');
      p.style.setProperty('--dur', (9 + Math.random() * 8).toFixed(2) + 's');
      p.style.setProperty('--delay', (-Math.random() * 18).toFixed(2) + 's');
      p.style.setProperty('--sway', (30 + Math.random() * 70).toFixed(0) + 'px');
      p.style.setProperty('--op', (0.4 + Math.random() * 0.45).toFixed(2));
      p.style.left = (Math.random() * 100).toFixed(2) + '%';
      box.appendChild(p);
    }
  }

  /* ─────────────────────────────────────────────────────────
     2 · scroll reveals
  ───────────────────────────────────────────────────────── */
  function initReveals() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

    items.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      io.observe(el);
    });
  }

  /* ─────────────────────────────────────────────────────────
     3 · smooth-scroll helper
  ───────────────────────────────────────────────────────── */
  function scrollToSection(sel) {
    const el = $(sel);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ─────────────────────────────────────────────────────────
     4 · HERO envelope — the cinematic opening
  ───────────────────────────────────────────────────────── */
  let heroOpened = false;

  function openHeroEnvelope() {
    if (heroOpened) return;
    heroOpened = true;

    const envelope = $('#heroEnvelope');
    const btn = $('#openBtn');
    envelope.classList.add('open');
    if (btn) { btn.disabled = true; btn.textContent = 'Opening your letter…'; }

    // 1) flap opens · 2) letter rises · 3) whole scene dissolves into greeting
    setTimeout(() => $('#hero').classList.add('sent'), 2100);
    setTimeout(() => {
      document.body.classList.remove('locked');
      scrollToSection('#greeting');
    }, 2500);
    setTimeout(() => { if (btn) btn.textContent = 'Open Your Letter ♡'; }, 4200);
  }

  /* ─────────────────────────────────────────────────────────
     5 · COVER envelope — opens the final letter
  ───────────────────────────────────────────────────────── */
  let coverOpened = false;

  function openCoverEnvelope() {
    if (coverOpened) return;
    coverOpened = true;

    const envelope = $('#coverEnvelope');
    const btn = $('#coverBtn');
    envelope.classList.add('open');
    if (btn) btn.disabled = true;

    setTimeout(() => scrollToSection('#letter'), 1600);
  }

  /* ─────────────────────────────────────────────────────────
     6 · vinyl player — honest controls (no fake audio)
  ───────────────────────────────────────────────────────── */
  function initPlayer() {
    const audio = $('#songAudio');
    const section = $('#song');
    const playBtn = $('#playBtn');
    const progress = $('#progress');
    const timeNow = $('#timeNow');
    const timeTotal = $('#timeTotal');
    const note = $('#songNote');
    if (!audio || !section || !playBtn || !progress) return;

    let audioAvailable = true;

    function fmt(sec) {
      if (!isFinite(sec)) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return m + ':' + String(s).padStart(2, '0');
    }

    function showNote() {
      audioAvailable = false;
      if (note) note.classList.add('show');
    }

    // if the local file is missing, say so — never pretend
    audio.addEventListener('error', showNote);

    async function togglePlay() {
      if (!audioAvailable) { showNote(); return; }
      if (audio.paused) {
        try {
          await audio.play();
          section.classList.add('playing');
          if (note) note.classList.remove('show');
        } catch (err) {
          showNote();
        }
      } else {
        audio.pause();
        section.classList.remove('playing');
      }
    }

    playBtn.addEventListener('click', togglePlay);

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const ratio = audio.currentTime / audio.duration;
      progress.value = Math.round(ratio * 1000);
      progress.style.setProperty('--fill', (ratio * 100).toFixed(1) + '%');
      timeNow.textContent = fmt(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      timeTotal.textContent = fmt(audio.duration);
    });

    audio.addEventListener('ended', () => {
      section.classList.remove('playing');
      progress.value = 0;
      progress.style.setProperty('--fill', '0%');
      timeNow.textContent = '0:00';
    });

    progress.addEventListener('input', () => {
      if (!audioAvailable || !audio.duration) return;
      const ratio = progress.value / 1000;
      audio.currentTime = ratio * audio.duration;
      progress.style.setProperty('--fill', (ratio * 100).toFixed(1) + '%');
    });
  }

  /* ─────────────────────────────────────────────────────────
     7 · memory photo — elegant placeholder if image missing
  ───────────────────────────────────────────────────────── */
  function initPhotoSlots() {
    document.querySelectorAll('img[data-local]').forEach((img) => {
      const slot = img.closest('.photo-slot');
      if (!slot) return;
      const fail = () => slot.classList.add('empty');
      img.addEventListener('error', fail);
      if (img.complete && img.naturalWidth === 0) fail();
    });
  }

  /* ─────────────────────────────────────────────────────────
     8 · final heart burst when the letter is revealed
  ───────────────────────────────────────────────────────── */
  function initHeartBurst() {
    const letter = $('#letter');
    if (!letter) return;

    function burst() {
      const colors = ['#e2c98a', '#e9c9c9', '#fffaf0', '#c9a24b'];
      for (let i = 0; i < 26; i++) {
        const h = document.createElement('span');
        h.className = 'burst-heart';
        h.textContent = '♡';
        const dx = (Math.random() * 320 - 160).toFixed(0) + 'px';
        const dy = (-(140 + Math.random() * 320)).toFixed(0) + 'px';
        h.style.setProperty('--dx', dx);
        h.style.setProperty('--dy', dy);
        h.style.setProperty('--rot', (Math.random() * 70 - 35).toFixed(0) + 'deg');
        h.style.setProperty('--dur', (1.4 + Math.random() * 1.2).toFixed(2) + 's');
        h.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
        h.style.left = (38 + Math.random() * 24) + '%';
        h.style.top = (70 + Math.random() * 20) + '%';
        h.style.fontSize = (12 + Math.random() * 16).toFixed(0) + 'px';
        document.body.appendChild(h);
        h.addEventListener('animationend', () => h.remove());
      }
    }

    if (!('IntersectionObserver' in window)) { burst(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(burst, 900); // after the paper finishes unfolding
          io.disconnect();
        }
      });
    }, { threshold: 0.45 });
    io.observe(letter);
  }

  /* ─────────────────────────────────────────────────────────
     boot
  ───────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    spawnPetals();
    initReveals();
    initPlayer();
    initPhotoSlots();
    initHeartBurst();

    // hero opening — button, flap, or wax seal
    const openBtn = $('#openBtn');
    const heroFlap = $('#heroFlap');
    if (openBtn) openBtn.addEventListener('click', openHeroEnvelope);
    if (heroFlap) heroFlap.addEventListener('click', openHeroEnvelope);

    // greeting → song
    const toSongBtn = $('#toSongBtn');
    if (toSongBtn) toSongBtn.addEventListener('click', () => scrollToSection('#song'));

    // cover envelope — flap or button
    const coverBtn = $('#coverBtn');
    const coverFlap = $('#coverFlap');
    if (coverBtn) coverBtn.addEventListener('click', openCoverEnvelope);
    if (coverFlap) coverFlap.addEventListener('click', openCoverEnvelope);
  });
})();
