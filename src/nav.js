import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initNav({ onSection, reduceMotion = false } = {}) {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const blob = nav.querySelector('.nav__blob');
  const wrap = nav.querySelector('.nav__links-wrap');
  const links = [...nav.querySelectorAll('[data-nav]')];
  let activeLink = null;

  /* ---- liquid droplet that glides between links ---- */
  function moveBlob(link, instant = false) {
    if (!blob) return;
    if (!link) {
      gsap.to(blob, { autoAlpha: 0, duration: 0.3 });
      return;
    }
    const vars = { x: link.offsetLeft, width: link.offsetWidth, autoAlpha: 1 };
    if (instant || reduceMotion) {
      gsap.set(blob, vars);
      return;
    }
    gsap.to(blob, { ...vars, duration: 0.8, ease: 'elastic.out(1, 0.65)', overwrite: true });
    gsap.fromTo(blob, { scaleY: 0.78 }, { scaleY: 1, duration: 0.7, ease: 'elastic.out(1, 0.35)' });
  }

  links.forEach((l) => l.addEventListener('pointerenter', () => moveBlob(l)));
  wrap?.addEventListener('pointerleave', () => moveBlob(activeLink));

  function setActive(id) {
    onSection?.(id);
    const link = links.find((l) => l.hash === `#${id}`) || null;
    links.forEach((l) => {
      const on = l === link;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
    if (link !== activeLink) {
      activeLink = link;
      moveBlob(activeLink);
    }
  }

  document.querySelectorAll('[data-section]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && setActive(section.id),
    });
  });

  ScrollTrigger.create({
    start: 40,
    end: 'max',
    onToggle: (self) => nav.classList.toggle('is-scrolled', self.isActive),
  });

  window.addEventListener('resize', () => moveBlob(activeLink, true));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveBlob(activeLink, true));

  /* ---- mobile menu ---- */
  const burger = nav.querySelector('.nav__burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;
  const panel = menu.querySelector('.mobile-menu__panel');
  const items = menu.querySelectorAll('.mm-link, .mobile-menu__social > *');

  function openMenu() {
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    gsap.fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
    gsap.fromTo(panel, { y: -16, scale: 0.97, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power3.out' });
    gsap.fromTo(items, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.035, delay: 0.08, ease: 'power3.out' });
    menu.querySelector('.mm-link')?.focus({ preventScroll: true });
  }

  function closeMenu(restoreFocus = true) {
    if (menu.hidden) return;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    gsap.to(menu, {
      autoAlpha: 0,
      duration: 0.25,
      onComplete: () => {
        menu.hidden = true;
      },
    });
    if (restoreFocus) burger.focus({ preventScroll: true });
  }

  burger.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu(false);
    else if (!e.target.closest('.mobile-menu__panel')) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) closeMenu();
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (mq) => mq.matches && closeMenu(false));
}
