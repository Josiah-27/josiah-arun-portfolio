// Small line-icon set (24×24, stroke = currentColor).
const wrap = (inner) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;

export const icons = {
  robot: wrap(
    '<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 8V4.5"/><circle cx="12" cy="3.5" r="1"/><circle cx="9.5" cy="13" r="1.2"/><circle cx="14.5" cy="13" r="1.2"/><path d="M9.5 16.5h5M3 12v3M21 12v3"/>'
  ),
  cpu: wrap(
    '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'
  ),
  wafer: wrap(
    '<circle cx="12" cy="12" r="9.5"/><path d="M5 9h14M5 15h14M9 4.5v15M15 4.5v15"/><rect x="10.3" y="10.3" width="3.4" height="3.4" rx=".6"/>'
  ),
  board: wrap(
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h4v6H7zM14 9h3M14 12h3M14 15h3M7 2v3M12 2v3M17 2v3M7 19v3M12 19v3M17 19v3"/>'
  ),
  network: wrap(
    '<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M6.7 7.1l3.6 3.8M6.7 16.9l3.6-3.8M13.7 10.9l3.6-3.8M13.7 13.1l3.6 3.8"/>'
  ),
  wave: wrap('<path d="M2 12h3l2-6 3 12 3-9 2 3h7"/>'),
  code: wrap('<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>'),
  stack: wrap(
    '<rect x="3" y="3" width="8" height="15" rx="2"/><path d="M6 15h2"/><rect x="14" y="4" width="7" height="6" rx="1.5"/><rect x="14" y="13" width="7" height="6" rx="1.5"/><path d="M16.5 7h2M16.5 16h2"/>'
  ),
  shield: wrap('<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>'),
  drum: wrap(
    '<ellipse cx="12" cy="9" rx="8" ry="3"/><path d="M4 9v7c0 1.7 3.6 3 8 3s8-1.3 8-3V9"/><path d="M7 3.5l3.5 4M17.5 2.5L14 7.5"/>'
  ),
  arrowRight: wrap('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  arrowUpRight: wrap('<path d="M7 17L17 7M9 7h8v8"/>'),
  plus: wrap('<path d="M12 5v14M5 12h14"/>'),
  doc: wrap('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>'),
  book: wrap('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>'),
  github:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
};

export const icon = (name, cls = 'i') => icons[name].replace('<svg ', `<svg class="${cls}" `);
