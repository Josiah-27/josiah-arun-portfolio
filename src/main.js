import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './styles/base.css';
import './styles/glass.css';
import './styles/sections.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

import { renderContent } from './render.js';
import { initScene } from './scene.js';
import { initLiquid, initGlow, initTilt } from './glass.js';
import { initDialogs } from './dialogs.js';
import { initSimulator } from './simulator.js';
import { initCertFilter } from './certs.js';
import { initNav } from './nav.js';
import { initAnimations } from './animations.js';

gsap.registerPlugin(ScrollTrigger, Flip);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

renderContent();

let scene = null;
try {
  scene = initScene(document.getElementById('scene'), { reduceMotion });
} catch (err) {
  console.error('3D scene unavailable:', err);
  document.documentElement.classList.add('no-webgl');
}

initLiquid();
initGlow();
initTilt();
initDialogs();
initSimulator({ reduceMotion });
initCertFilter({ reduceMotion });
initNav({ onSection: (id) => scene?.setSection(id), reduceMotion });

// Un-hide the hero first: GSAP's from() tweens read the current (visible) values as their end state.
document.documentElement.classList.add('is-ready');
initAnimations({ reduceMotion, scene });

/* ---- 3D background on/off switch (remembered per device) ---- */
const toggle = document.getElementById('toggle-3d');
if (toggle) {
  if (!scene) {
    toggle.hidden = true;
  } else {
    let saved = null;
    try {
      saved = localStorage.getItem('ja-3d');
    } catch {
      /* storage unavailable */
    }
    if (saved === 'off') {
      scene.setEnabled(false);
      toggle.setAttribute('aria-checked', 'false');
    }
    toggle.addEventListener('click', () => {
      const on = toggle.getAttribute('aria-checked') !== 'true';
      toggle.setAttribute('aria-checked', String(on));
      scene.setEnabled(on);
      try {
        localStorage.setItem('ja-3d', on ? 'on' : 'off');
      } catch {
        /* storage unavailable */
      }
    });
  }
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

// Re-measure scroll positions once web fonts and images have settled.
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
