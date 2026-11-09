import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ---------- text splitting ---------- */

function splitChars(el) {
  const text = el.textContent.trim();
  el.textContent = '';
  const chars = [...text].map((ch) => {
    const s = document.createElement('span');
    s.className = 'char';
    s.textContent = ch === ' ' ? ' ' : ch;
    el.appendChild(s);
    return s;
  });
  if (el.dataset.grad) {
    const [a, b] = el.dataset.grad.split(',').map((c) => c.trim());
    const mix = gsap.utils.interpolate(a, b);
    chars.forEach((c, i) => (c.style.color = mix(chars.length > 1 ? i / (chars.length - 1) : 0)));
  }
  return chars;
}

/** Wraps each word (and each inline element) in a clipping mask; returns the inner movers. */
function splitWords(el) {
  const units = [];
  const nodes = [...el.childNodes];
  el.textContent = '';
  const addUnit = (node) => {
    const mask = document.createElement('span');
    mask.className = 'w-mask';
    node.classList.add('w');
    mask.appendChild(node);
    el.appendChild(mask);
    units.push(node);
  };
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          el.appendChild(document.createTextNode(' '));
          return;
        }
        const w = document.createElement('span');
        w.textContent = part;
        addUnit(w);
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') el.appendChild(node);
      else addUnit(node);
    }
  });
  return units;
}

/* ---------- pieces ---------- */

function heroIntro() {
  const chars = [...document.querySelectorAll('.hero__name [data-split-chars]')].flatMap(splitChars);
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.1 });
  tl.from('.hero .eyebrow', { y: 18, autoAlpha: 0, duration: 0.8 }, 0)
    .from(chars, { yPercent: 115, rotateX: -80, autoAlpha: 0, duration: 1.2, stagger: 0.045 }, 0.1)
    .from('.hero__tagline', { y: 26, autoAlpha: 0, duration: 1 }, 0.5)
    .from('.hero__lede', { y: 26, autoAlpha: 0, duration: 1 }, 0.62)
    .from('[data-hero-btn]', { y: 22, autoAlpha: 0, duration: 0.9, stagger: 0.07, clearProps: 'transform' }, 0.75)
    .from('.hero__exploring', { y: 16, autoAlpha: 0, duration: 0.9 }, 0.95)
    .from('.float-tag', { scale: 0.6, autoAlpha: 0, duration: 1, stagger: 0.12, ease: 'back.out(2)' }, 0.85)
    .from('.scroll-cue', { autoAlpha: 0, duration: 1 }, 1.2);

  gsap.to('.hero__copy', {
    yPercent: -10,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.scroll-cue', {
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '15% top', scrub: true },
  });
}

function rotator(reduceMotion) {
  const items = [...document.querySelectorAll('.rotator > span')];
  if (items.length < 2) return;
  gsap.set(items, { yPercent: 110, autoAlpha: 0 });
  gsap.set(items[0], { yPercent: 0, autoAlpha: 1 });
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    const a = items[i];
    i = (i + 1) % items.length;
    const b = items[i];
    if (reduceMotion) {
      gsap.set(a, { autoAlpha: 0 });
      gsap.set(b, { yPercent: 0, autoAlpha: 1 });
      return;
    }
    gsap.to(a, { yPercent: -110, autoAlpha: 0, duration: 0.55, ease: 'power3.in' });
    gsap.fromTo(b, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', delay: 0.3 });
  }, 2600);
}

function sectionTitles() {
  document.querySelectorAll('[data-split-words]').forEach((el) => {
    const words = splitWords(el);
    gsap.from(words, {
      yPercent: 115,
      rotate: 5,
      duration: 1.15,
      ease: 'power4.out',
      stagger: 0.07,
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });
}

function reveals() {
  // plain text blocks: fade, rise and un-blur
  gsap.utils.toArray('[data-reveal-text]').forEach((el) => {
    gsap.from(el, {
      y: 26,
      autoAlpha: 0,
      filter: 'blur(8px)',
      duration: 1.05,
      ease: 'power3.out',
      clearProps: 'filter',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // glass elements: opacity/transform only (never filter, so backdrop blur keeps working)
  const glassEls = gsap.utils.toArray('[data-reveal]');
  gsap.set(glassEls, { autoAlpha: 0, y: 48 });
  ScrollTrigger.batch(glassEls, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.05, ease: 'power3.out', stagger: 0.09, overwrite: 'auto' }),
  });

  // project cards fly up out of the floor in 3D
  gsap.utils.toArray('[data-reveal-3d]').forEach((slot) => {
    const card = slot.firstElementChild;
    gsap.from(slot, {
      y: 90,
      rotationX: 18,
      transformPerspective: 1200,
      transformOrigin: '50% 0%',
      duration: 1.3,
      ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: { trigger: slot, start: 'top 90%', once: true },
    });
    gsap.from(card, {
      autoAlpha: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: { trigger: slot, start: 'top 90%', once: true },
    });
  });
}

function marquees() {
  const tweens = [];
  document.querySelectorAll('[data-marquee]').forEach((m) => {
    const track = m.querySelector('.marquee__track');
    const group = track.querySelector('.marquee__group');
    track.appendChild(group.cloneNode(true));
    track.appendChild(group.cloneNode(true));
    const left = m.dataset.marquee !== 'right';
    const shift = -100 / 3;
    const tween = gsap.fromTo(
      track,
      { xPercent: left ? 0 : shift },
      { xPercent: left ? shift : 0, duration: 42, ease: 'none', repeat: -1 }
    );
    tween.totalTime(tween.duration() * 400); // lets the loop run backwards when scrolling up
    tweens.push(tween);
  });
  if (!tweens.length) return;

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const dir = self.direction;
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 280, 8);
      tweens.forEach((t) => {
        gsap.to(t, { timeScale: boost * dir, duration: 0.2, overwrite: true });
        gsap.to(t, { timeScale: dir, duration: 1.5, delay: 0.2, ease: 'power2.out' });
      });
    },
  });
}

function backgroundWords() {
  document.querySelectorAll('[data-bgword]').forEach((el) => {
    gsap.fromTo(
      el,
      { xPercent: 4 },
      {
        xPercent: -32,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      }
    );
  });
}

function timelineProgress() {
  const bar = document.querySelector('.timeline__progress');
  if (!bar) return;
  gsap.to(bar, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: 0.5 },
  });
}

function counters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const obj = { v: 0 };
    el.textContent = '0';
    gsap.to(obj, {
      v: end,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => (el.textContent = String(Math.round(obj.v))),
    });
  });
}

/* ---------- entry ---------- */

export function initAnimations({ reduceMotion = false, scene = null } = {}) {
  const bar = document.querySelector('.scroll-progress span');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      if (bar) bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
      scene?.setScroll(self.progress, self.getVelocity());
    },
  });

  rotator(reduceMotion);
  if (reduceMotion) return;

  heroIntro();
  sectionTitles();
  reveals();
  marquees();
  backgroundWords();
  timelineProgress();
  counters();
}
