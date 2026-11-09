import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initCertFilter({ reduceMotion = false } = {}) {
  const control = document.querySelector('.seg-control');
  if (!control) return;
  const thumb = control.querySelector('.seg-control__thumb');
  const buttons = [...control.querySelectorAll('button[data-filter]')];
  const cards = () => [...document.querySelectorAll('#cert-grid .cert')];
  let active = buttons.find((b) => b.getAttribute('aria-pressed') === 'true') || buttons[0];

  function moveThumb(btn, instant = false) {
    const vars = { x: btn.offsetLeft, width: btn.offsetWidth };
    if (instant || reduceMotion) gsap.set(thumb, vars);
    else {
      gsap.to(thumb, { ...vars, duration: 0.75, ease: 'elastic.out(1, 0.7)', overwrite: true });
      gsap.fromTo(thumb, { scaleY: 0.82 }, { scaleY: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    }
  }

  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      if (btn === active) return;
      active = btn;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      moveThumb(btn);

      const filter = btn.dataset.filter;
      const all = cards();
      const state = Flip.getState(all);
      all.forEach((c) => {
        c.style.display = filter === 'all' || c.dataset.cat === filter ? '' : 'none';
      });

      if (reduceMotion) {
        ScrollTrigger.refresh();
        return;
      }
      Flip.from(state, {
        duration: 0.65,
        ease: 'power3.inOut',
        scale: true,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.88 }, { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'power3.out' }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.88, duration: 0.4, ease: 'power2.in' }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    })
  );

  const sync = () => moveThumb(active, true);
  requestAnimationFrame(sync);
  window.addEventListener('resize', sync);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
}
