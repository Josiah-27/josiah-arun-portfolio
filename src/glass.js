import { gsap } from 'gsap';

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Liquid glass buttons: magnetic drift toward the cursor, a caustic highlight that follows it,
 * and a jelly squash-and-stretch on press with an elastic release.
 */
export function bindLiquid(btn) {
  if (btn.dataset.liquid) return;
  btn.dataset.liquid = '1';

  const isIcon = btn.classList.contains('lg-icon');
  const pull = isIcon ? 0.32 : 0.2;
  const xTo = gsap.quickTo(btn, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.45)' });
  const yTo = gsap.quickTo(btn, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.45)' });

  const release = () =>
    gsap.to(btn, { scaleX: 1, scaleY: 1, duration: 1.1, ease: 'elastic.out(1.2, 0.3)', overwrite: 'auto' });

  btn.addEventListener('pointermove', (e) => {
    const r = btn.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    btn.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    btn.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    if (e.pointerType === 'mouse' && !btn.disabled) {
      xTo((px - 0.5) * r.width * pull);
      yTo((py - 0.5) * r.height * pull * 1.3);
    }
  });

  btn.addEventListener('pointerleave', () => {
    xTo(0);
    yTo(0);
    release();
  });

  btn.addEventListener('pointerdown', () => {
    if (btn.disabled) return;
    gsap.to(btn, { scaleX: 1.07, scaleY: 0.9, duration: 0.16, ease: 'power2.out', overwrite: 'auto' });
  });
  btn.addEventListener('pointerup', release);
  btn.addEventListener('pointercancel', release);

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      gsap.fromTo(
        btn,
        { scaleX: 1.06, scaleY: 0.92 },
        { scaleX: 1, scaleY: 1, duration: 0.9, ease: 'elastic.out(1.2, 0.3)', overwrite: 'auto' }
      );
    }
  });
}

export function initLiquid(root = document) {
  root.querySelectorAll('.lg-btn').forEach(bindLiquid);
}

/** Cursor-tracking light on glass cards ([data-glow]). */
export function initGlow(root = document) {
  if (!finePointer()) return;
  root.querySelectorAll('[data-glow]').forEach((el) => {
    if (el.dataset.glowBound) return;
    el.dataset.glowBound = '1';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`);
      el.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`);
    });
  });
}

/** Subtle 3D tilt toward the pointer ([data-tilt="maxDegrees"]). */
export function initTilt(root = document) {
  if (!finePointer() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.querySelectorAll('[data-tilt]').forEach((el) => {
    const max = parseFloat(el.dataset.tilt) || 6;
    gsap.set(el, { transformPerspective: 1000 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * max);
      ry(px * max);
    });
    el.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  });
}
