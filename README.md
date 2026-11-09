# Josiah Arun · Portfolio

Personal portfolio of **Josiah Arun**, an Electronics & Communication Engineering student at SRM IST, Chennai.

**Live:** https://josiaharun.onrender.com

- **3D background** (Three.js): a morphing liquid core, a rotating ring of 3D text, orbiting electrons, a circuit-grid floor and floating chips, all reacting to scroll and cursor
- **Liquid glass UI**: translucent, blurred and tinted buttons and panels with magnetic drift, cursor-following highlights and jelly press feedback
- **Scroll animation** (GSAP ScrollTrigger): split-text reveals, scroll-reactive marquees, parallax words and a progress-drawn timeline
- **Hardware Lab**: an interactive simulation of the Smart Room Automation people counter, running the same flip-flop logic as the real circuit
- Project case studies, a filterable certificate gallery with a lightbox, and a 3D on/off switch

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Editing content

All text content lives in `src/data.js` (projects, skills, timeline, certificates).
Images are in `public/images` and `public/certificates`.

## Deploy

Deployed on Render as a static site (`render.yaml`): build command `npm ci --include=dev && npm run build`, publish directory `dist`.
