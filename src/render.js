import { focusAreas, skillGroups, projects, timeline, certificates, certCategories } from './data.js';
import { icons, icon } from './icons.js';
import { viz } from './viz.js';

export const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const LANDSCAPE = new Set([
  'hacksprint-2026',
  'bit-n-build-2026',
  'sustain-agentic-bootcamp',
  'hindustan-open-house',
  'geo-hack-2025',
  'reduce-ewaste-pledge-2026',
  'nasa-roman-boarding-pass',
]);
export const certSize = (slug) => (LANDSCAPE.has(slug) ? [640, 452] : [452, 640]);

const chips = (items) =>
  `<ul class="chip-list" role="list">${items.map((s) => `<li class="chip">${esc(s)}</li>`).join('')}</ul>`;

function renderFocus() {
  const el = document.getElementById('focus-grid');
  if (!el) return;
  el.innerHTML = focusAreas
    .map(
      (f, i) => `
      <article class="focus-card glass" data-reveal data-glow data-tilt="8" style="--c1:${f.c1};--c2:${f.c2}">
        <div class="icon-tile">${icons[f.icon]}</div>
        <span class="focus-card__n">0${i + 1}</span>
        <h4>${esc(f.title)}</h4>
        <p>${esc(f.text)}</p>
      </article>`
    )
    .join('');
}

function renderSkills() {
  const el = document.getElementById('skills-grid');
  if (!el) return;
  el.innerHTML = skillGroups
    .map(
      (g) => `
      <article class="skill-card glass" data-reveal data-glow style="--c1:${g.c1};--c2:${g.c2}">
        <div class="skill-card__head">
          <div class="icon-tile">${icons[g.icon]}</div>
          <div>
            <h3>${esc(g.title)}</h3>
            <p class="skill-card__sub">${esc(g.sub)}</p>
          </div>
        </div>
        ${chips(g.items)}
      </article>`
    )
    .join('');
}

const linkIcon = (l) => icon(l.kind === 'file' ? 'doc' : 'github');

function projectActions(p) {
  const out = [];
  if (p.caseStudy) {
    out.push(
      `<button class="lg-btn lg-btn--violet lg-btn--sm" type="button" data-case="${p.id}" aria-haspopup="dialog">Read case study ${icon('arrowRight')}</button>`
    );
  }
  for (const l of p.links) {
    if (l.kind === 'internal') {
      out.push(`<a class="lg-btn lg-btn--violet lg-btn--sm" href="${l.href}">${esc(l.label)} ${icon('arrowRight')}</a>`);
    } else {
      out.push(
        `<a class="lg-btn lg-btn--clear lg-btn--sm" href="${l.href}" target="_blank" rel="noopener noreferrer">${linkIcon(l)} ${esc(l.label)}</a>`
      );
    }
  }
  return out.join('');
}

/** Image gallery for a case study (poster, plots, console output). Each figure opens full size. */
function galleryHTML(p) {
  if (!p.gallery) return '';
  const figs = p.gallery
    .map(
      (g) => `
      <figure class="case__fig${g.wide ? ' case__fig--wide' : ''}">
        <a href="${g.src}" target="_blank" rel="noopener" aria-label="Open full size: ${esc(g.caption)}">
          <img src="${g.thumb || g.src}" alt="${esc(g.caption)}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async" />
        </a>
        <figcaption>${esc(g.caption)}</figcaption>
      </figure>`
    )
    .join('');
  return `<section class="case__sec"><h3>Poster &amp; program output</h3><div class="case__gallery">${figs}</div></section>`;
}

function renderProjects() {
  const el = document.getElementById('projects-grid');
  if (!el) return;
  el.innerHTML = projects
    .map((p, i) => {
      const idx = String(i + 1).padStart(2, '0');
      return `
      <div class="project-slot${p.featured || p.wide ? ' project-slot--featured' : ''}" data-reveal-3d>
        <article class="project glass${p.featured ? ' project--featured' : ''}${p.wide ? ' project--featured project--wide' : ''}" id="project-${p.id}" data-glow style="--c1:${p.c1};--c2:${p.c2}" aria-labelledby="proj-title-${p.id}">
          <div class="project__viz">
            ${viz[p.viz]()}
            ${p.badge ? `<span class="project__badge">${esc(p.badge)}</span>` : ''}
          </div>
          <div class="project__body">
            <div class="project__meta"><span><span class="idx">${idx}</span> · ${esc(p.kicker)}</span><span>${esc(p.year)}</span></div>
            <h3 class="project__title" id="proj-title-${p.id}">${esc(p.title)}</h3>
            <p class="project__tagline">${esc(p.tagline)}</p>
            <p class="project__summary">${esc(p.summary)}</p>
            <ul class="project__hl">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
            ${chips(p.stack)}
            <div class="project__actions">${projectActions(p)}</div>
          </div>
        </article>
      </div>`;
    })
    .join('');
}

function renderTimeline() {
  const el = document.getElementById('timeline');
  if (!el) return;
  el.innerHTML = timeline
    .map(
      (t) => `
      <li class="tl-item">
        <article class="tl-card glass" data-reveal data-glow>
          <p class="tl-date"><span>${esc(t.date)}</span><span class="tl-tag">${esc(t.tag)}</span></p>
          <h3>${esc(t.title)}</h3>
          <p class="tl-org">${esc(t.org)}</p>
          <p>${esc(t.text)}</p>
        </article>
      </li>`
    )
    .join('');
}

function renderCerts() {
  const el = document.getElementById('cert-grid');
  if (!el) return;
  el.innerHTML = certificates
    .map((c, i) => {
      const [w, h] = certSize(c.slug);
      const meta = `${esc(certCategories[c.cat])}${c.date ? ` · ${esc(c.date)}` : ''}`;
      return `
      <button class="cert glass" type="button" data-cert="${i}" data-cat="${c.cat}" data-glow data-reveal aria-haspopup="dialog" aria-label="View certificate: ${esc(c.title)}, ${esc(c.issuer)}">
        <span class="cert__thumb">
          <img src="/certificates/${c.slug}-thumb.webp" alt="" width="${w}" height="${h}" loading="lazy" decoding="async" />
          <span class="cert__zoom" aria-hidden="true">${icons.plus}</span>
        </span>
        <span class="cert__body">
          <span class="cert__cat">${meta}</span>
          <span class="cert__title">${esc(c.title)}</span>
          <span class="cert__issuer">${esc(c.issuer)}</span>
        </span>
      </button>`;
    })
    .join('');
}

/** Case-study markup for the project dialog. Step descriptions are trusted HTML from data.js. */
export function caseStudyHTML(p) {
  const sections = p.caseStudy
    .map((s) => {
      const body = s.steps
        ? `<ol class="case__steps" role="list">${s.steps.map(([t, d]) => `<li><strong>${esc(t)}.</strong> ${d}</li>`).join('')}</ol>`
        : `<p>${esc(s.p)}</p>`;
      return `<section class="case__sec"><h3>${esc(s.h)}</h3>${body}</section>`;
    })
    .join('');
  const context = p.context ? `<div class="case__context">${p.context.map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</div>` : '';
  const links = p.links
    .filter((l) => l.kind !== 'internal')
    .map(
      (l) =>
        `<a class="lg-btn lg-btn--violet" href="${l.href}" target="_blank" rel="noopener noreferrer">${linkIcon(l)} ${esc(l.label)}</a>`
    )
    .join('');
  return `
    <p class="case__kicker">${esc(p.kicker)} · ${esc(p.year)}</p>
    <h2 class="case__title" id="case-title">${esc(p.title)}</h2>
    <p class="case__tagline">${esc(p.tagline)}</p>
    ${context}
    ${sections}
    ${galleryHTML(p)}
    <div class="case__stack">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>
    ${links ? `<div class="case__actions">${links}</div>` : ''}`;
}

export function renderContent() {
  renderFocus();
  renderSkills();
  renderProjects();
  renderTimeline();
  renderCerts();
}
