import { gsap } from 'gsap';
import { projects, certificates, certCategories } from './data.js';
import { caseStudyHTML } from './render.js';
import { bindLiquid } from './glass.js';

let lastFocus = null;

function openDialog(dlg) {
  if (dlg.open) return;
  lastFocus = document.activeElement;
  dlg.showModal();
  document.documentElement.classList.add('modal-open');
  const panel = dlg.querySelector('.dialog__panel');
  gsap.fromTo(panel, { y: 34, scale: 0.97, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.55, ease: 'power3.out' });
}

function closeDialog(dlg) {
  if (!dlg.open || dlg.dataset.closing) return;
  dlg.dataset.closing = '1';
  const panel = dlg.querySelector('.dialog__panel');
  gsap.to(panel, {
    y: 18,
    scale: 0.98,
    autoAlpha: 0,
    duration: 0.24,
    ease: 'power2.in',
    onComplete: () => {
      delete dlg.dataset.closing;
      dlg.close();
    },
  });
}

function wireDialog(dlg) {
  let downOnBackdrop = false;
  dlg.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeDialog(dlg);
  });
  dlg.addEventListener('pointerdown', (e) => {
    downOnBackdrop = e.target === dlg;
  });
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg && downOnBackdrop) closeDialog(dlg);
  });
  dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => closeDialog(dlg)));
  dlg.addEventListener('close', () => {
    document.documentElement.classList.remove('modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
  });
}

export function initDialogs() {
  const caseDlg = document.getElementById('case-dialog');
  const certDlg = document.getElementById('cert-dialog');
  [caseDlg, certDlg].forEach((d) => d && wireDialog(d));

  /* ---- project case studies ---- */
  const caseBody = document.getElementById('case-body');
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-case]');
    if (!trigger || !caseDlg) return;
    const project = projects.find((p) => p.id === trigger.dataset.case);
    if (!project) return;
    caseBody.innerHTML = caseStudyHTML(project);
    caseBody.scrollTop = 0;
    caseBody.querySelectorAll('.lg-btn').forEach(bindLiquid);
    openDialog(caseDlg);
  });

  /* ---- certificate lightbox ---- */
  if (!certDlg) return;
  const img = document.getElementById('cert-img');
  const title = document.getElementById('cert-title');
  const cat = document.getElementById('cert-cat');
  const issuer = document.getElementById('cert-issuer');
  const note = document.getElementById('cert-note');
  const openFull = document.getElementById('cert-open');
  let current = 0;

  const visibleIndexes = () =>
    [...document.querySelectorAll('#cert-grid .cert')]
      .filter((el) => el.style.display !== 'none')
      .map((el) => Number(el.dataset.cert));

  function show(index) {
    const c = certificates[index];
    if (!c) return;
    current = index;
    const src = `/certificates/${c.slug}.webp`;
    img.src = src;
    img.alt = `Certificate: ${c.title}, issued by ${c.issuer}`;
    title.textContent = c.title;
    cat.textContent = `${certCategories[c.cat]}${c.date ? ` · ${c.date}` : ''}`;
    issuer.textContent = c.issuer;
    note.textContent = c.note;
    openFull.href = src;
  }

  function step(dir) {
    const list = visibleIndexes();
    if (!list.length) return;
    const pos = list.indexOf(current);
    const next = list[(pos + dir + list.length) % list.length];
    gsap.fromTo(img, { autoAlpha: 0, x: 24 * dir }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out' });
    show(next);
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-cert]');
    if (!card) return;
    show(Number(card.dataset.cert));
    openDialog(certDlg);
  });

  document.getElementById('cert-prev').addEventListener('click', () => step(-1));
  document.getElementById('cert-next').addEventListener('click', () => step(1));
  certDlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}
