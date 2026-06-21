/* Glass icon system — custom SVG badges, not bare emojis */
(function (global) {
  'use strict';

  const SVGS = {
    tie: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2L8 8v14h8V8L12 2z" fill="url(#g1)"/><path d="M10 8h4v2h-4z" fill="rgba(255,255,255,.5)"/><defs><linearGradient id="g1" x1="8" y1="2" x2="16" y2="22"><stop stop-color="#7eb8da"/><stop offset="1" stop-color="#4a7fa5"/></linearGradient></defs></svg>',
    audio: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 10v4h4l5 4V6L8 10H4z" fill="url(#ga)"/><path d="M16 8a4 4 0 010 8M18 6a7 7 0 010 12" stroke="#e8c547" stroke-width="2" stroke-linecap="round"/><defs><linearGradient id="ga" x1="4" y1="6" x2="14" y2="18"><stop stop-color="#f4a4c4"/><stop offset="1" stop-color="#e8919f"/></linearGradient></defs></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 4h12v3a6 6 0 01-12 0V4z" fill="url(#gt)"/><path d="M8 20h8M10 17h4v3h-4z" fill="#e8c547"/><path d="M4 4H2v2a4 4 0 004 4M20 4h2v2a4 4 0 01-4 4" stroke="#e8c547" stroke-width="1.5"/><defs><linearGradient id="gt" x1="6" y1="4" x2="18" y2="13"><stop stop-color="#f5e6a3"/><stop offset="1" stop-color="#e8c547"/></linearGradient></defs></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="12" width="4" height="8" rx="1" fill="#7eb8da"/><rect x="10" y="8" width="4" height="12" rx="1" fill="#f4a4c4"/><rect x="16" y="4" width="4" height="16" rx="1" fill="#e8c547"/></svg>',
    idcard: '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" fill="url(#gid)" stroke="rgba(255,255,255,.4)" stroke-width="1"/><circle cx="8" cy="12" r="2.5" fill="rgba(255,255,255,.6)"/><rect x="12" y="10" width="8" height="1.5" rx=".5" fill="rgba(255,255,255,.5)"/><rect x="12" y="13" width="6" height="1.5" rx=".5" fill="rgba(255,255,255,.35)"/><defs><linearGradient id="gid" x1="2" y1="5" x2="22" y2="19"><stop stop-color="#7eb8da"/><stop offset="1" stop-color="#4a7fa5"/></linearGradient></defs></svg>',
    scroll: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 3h10a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" fill="url(#gs)"/><path d="M8 8h8M8 12h8M8 16h5" stroke="rgba(255,255,255,.6)" stroke-width="1.5" stroke-linecap="round"/><circle cx="17" cy="17" r="4" fill="#e8c547" stroke="#c9a832" stroke-width="1"/><defs><linearGradient id="gs" x1="4" y1="3" x2="18" y2="21"><stop stop-color="#faf6e8"/><stop offset="1" stop-color="#e8dcc0"/></linearGradient></defs></svg>',
    dna: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 3c2 4 2 8 0 12s-2 8 0 12M16 3c-2 4-2 8 0 12s2 8 0 12" stroke="#f4a4c4" stroke-width="2"/><line x1="8" y1="7" x2="16" y2="7" stroke="#7eb8da" stroke-width="1.5"/><line x1="8" y1="12" x2="16" y2="12" stroke="#7eb8da" stroke-width="1.5"/><line x1="8" y1="17" x2="16" y2="17" stroke="#7eb8da" stroke-width="1.5"/></svg>',
    scales: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18M6 7h12" stroke="#e8c547" stroke-width="2"/><path d="M4 7l4 6H4zM20 7l-4 6h4z" fill="url(#gsc)"/><defs><linearGradient id="gsc" x1="4" y1="7" x2="20" y2="13"><stop stop-color="#7eb8da"/><stop offset="1" stop-color="#4a7fa5"/></linearGradient></defs></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#f4a4c4" stroke-width="1.5"/><circle cx="12" cy="12" r="5" stroke="#7eb8da" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="#e8c547"/></svg>',
    meter: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 18h16" stroke="rgba(255,255,255,.3)" stroke-width="2"/><path d="M6 18A8 8 0 0118 18" stroke="url(#gm)" stroke-width="3" stroke-linecap="round"/><circle cx="12" cy="18" r="1.5" fill="#e8c547"/><defs><linearGradient id="gm" x1="6" y1="10" x2="18" y2="18"><stop stop-color="#f4a4c4"/><stop offset="1" stop-color="#e74c3c"/></linearGradient></defs></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H8l-4 4V5z" fill="url(#gc)"/><path d="M8 10h8M8 13h5" stroke="rgba(255,255,255,.7)" stroke-width="1.5" stroke-linecap="round"/><defs><linearGradient id="gc" x1="4" y1="5" x2="20" y2="20"><stop stop-color="#7eb8da"/><stop offset="1" stop-color="#f4a4c4"/></linearGradient></defs></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" fill="url(#gcal)"/><rect x="3" y="5" width="18" height="5" fill="#e8c547"/><line x1="8" y1="3" x2="8" y2="7" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="3" x2="16" y2="7" stroke="#fff" stroke-width="2" stroke-linecap="round"/><defs><linearGradient id="gcal" x1="3" y1="10" x2="21" y2="21"><stop stop-color="#fce4ec"/><stop offset="1" stop-color="#e3f2fd"/></linearGradient></defs></svg>',
    news: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" fill="url(#gn)"/><rect x="6" y="8" width="8" height="5" rx="1" fill="rgba(255,255,255,.4)"/><line x1="6" y1="15" x2="18" y2="15" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/><line x1="6" y1="17" x2="14" y2="17" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/><defs><linearGradient id="gn" x1="3" y1="4" x2="21" y2="20"><stop stop-color="#4a7fa5"/><stop offset="1" stop-color="#1a1a2e"/></linearGradient></defs></svg>',
    receipt: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3z" fill="url(#gr)"/><line x1="9" y1="8" x2="15" y2="8" stroke="rgba(0,0,0,.2)" stroke-width="1.5"/><line x1="9" y1="12" x2="15" y2="12" stroke="rgba(0,0,0,.15)" stroke-width="1.5"/><defs><linearGradient id="gr" x1="6" y1="3" x2="18" y2="21"><stop stop-color="#fffef5"/><stop offset="1" stop-color="#f5f0e0"/></linearGradient></defs></svg>',
    siren: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3L4 19h16L12 3z" fill="url(#gsi)"/><circle cx="12" cy="15" r="2" fill="#fff"/><path d="M12 6v2M8 10l1.5 1.5M16 10l-1.5 1.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><defs><linearGradient id="gsi" x1="4" y1="3" x2="20" y2="19"><stop stop-color="#e74c3c"/><stop offset="1" stop-color="#922b21"/></linearGradient></defs></svg>',
    slot: '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" fill="#1a1a2e" stroke="#e8c547" stroke-width="1.5"/><rect x="5" y="8" width="4" height="8" rx="1" fill="#f4a4c4"/><rect x="10" y="8" width="4" height="8" rx="1" fill="#7eb8da"/><rect x="15" y="8" width="4" height="8" rx="1" fill="#e8c547"/></svg>',
    radar: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#0f0" stroke-width="1.5" opacity=".6"/><circle cx="12" cy="12" r="5" stroke="#0f0" stroke-width="1" opacity=".4"/><path d="M12 12L12 3" stroke="#0f0" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="1.5" fill="#0f0"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 4h8v16H4a2 2 0 01-2-2V6a2 2 0 012-2zM12 4h8a2 2 0 012 2v12a2 2 0 01-2 2h-8V4z" fill="url(#gb)"/><line x1="7" y1="8" x2="9" y2="8" stroke="rgba(0,0,0,.2)" stroke-width="1"/><defs><linearGradient id="gb" x1="2" y1="4" x2="22" y2="20"><stop stop-color="#faf6e8"/><stop offset="1" stop-color="#e8c547"/></linearGradient></defs></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-8-5.5-8-11a5 5 0 019-3 5 5 0 019 3c0 5.5-8 11-8 11z" fill="url(#gh)"/><defs><linearGradient id="gh" x1="4" y1="7" x2="20" y2="21"><stop stop-color="#f4a4c4"/><stop offset="1" stop-color="#e8919f"/></linearGradient></defs></svg>',
    hammer: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="14" width="14" height="4" rx="1" transform="rotate(-45 10 16)" fill="#8b6914"/><rect x="14" y="4" width="6" height="8" rx="1" transform="rotate(-45 17 8)" fill="url(#ghm)"/><defs><linearGradient id="ghm" x1="14" y1="4" x2="20" y2="12"><stop stop-color="#7eb8da"/><stop offset="1" stop-color="#4a7fa5"/></linearGradient></defs></svg>',
    medal: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="14" r="6" fill="url(#gmd)"/><path d="M9 4l3 5 3-5H9z" fill="#e74c3c"/><text x="12" y="16" text-anchor="middle" fill="#fff" font-size="6" font-weight="bold">★</text><defs><linearGradient id="gmd" x1="6" y1="8" x2="18" y2="20"><stop stop-color="#f5e6a3"/><stop offset="1" stop-color="#e8c547"/></linearGradient></defs></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" fill="url(#glk)"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#e8c547" stroke-width="2"/><defs><linearGradient id="glk" x1="5" y1="11" x2="19" y2="21"><stop stop-color="#4a7fa5"/><stop offset="1" stop-color="#1a1a2e"/></linearGradient></defs></svg>',
    sandwich: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 8h16v2H4zM3 11h18v2H3zM4 14h16v2H4z" fill="url(#gsw)"/><ellipse cx="12" cy="8" rx="8" ry="2" fill="#e8c547"/><defs><linearGradient id="gsw" x1="3" y1="8" x2="21" y2="16"><stop stop-color="#d4a574"/><stop offset="1" stop-color="#8b6914"/></linearGradient></defs></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="2" fill="url(#gcm)"/><circle cx="12" cy="13" r="4" stroke="#fff" stroke-width="1.5"/><rect x="8" y="4" width="4" height="3" rx="1" fill="rgba(255,255,255,.5)"/><defs><linearGradient id="gcm" x1="2" y1="6" x2="22" y2="20"><stop stop-color="#7eb8da"/><stop offset="1" stop-color="#f4a4c4"/></linearGradient></defs></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="10" rx="2" fill="url(#gsp)"/><circle cx="8" cy="13" r="2.5" fill="#1a1a2e"/><circle cx="15" cy="13" r="2.5" fill="#1a1a2e"/><rect x="10" y="5" width="4" height="3" rx="1" fill="#e8c547"/><defs><linearGradient id="gsp" x1="3" y1="8" x2="21" y2="18"><stop stop-color="#fce4ec"/><stop offset="1" stop-color="#e3f2fd"/></linearGradient></defs></svg>',
    concern: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="url(#gcn)"/><circle cx="9" cy="10" r="1.2" fill="#1a1a2e"/><circle cx="15" cy="10" r="1.2" fill="#1a1a2e"/><path d="M8 16c1.5-2 6.5-2 8 0" stroke="#1a1a2e" stroke-width="1.5" stroke-linecap="round"/><defs><linearGradient id="gcn" x1="3" y1="3" x2="21" y2="21"><stop stop-color="#f5e6a3"/><stop offset="1" stop-color="#f4a4c4"/></linearGradient></defs></svg>',
    water: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3c-4 6-6 9-6 12a6 6 0 0012 0c0-3-2-6-6-12z" fill="url(#gw)"/><defs><linearGradient id="gw" x1="6" y1="3" x2="18" y2="21"><stop stop-color="#7eb8da"/><stop offset="1" stop-color="#4a7fa5"/></linearGradient></defs></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" fill="url(#gsh)"/><defs><linearGradient id="gsh" x1="4" y1="2" x2="20" y2="22"><stop stop-color="#7eb8da"/><stop offset="1" stop-color="#4a7fa5"/></linearGradient></defs></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none"><path d="M18 14a7 7 0 01-9-9 7 7 0 109 9z" fill="url(#gmo)"/><defs><linearGradient id="gmo" x1="9" y1="5" x2="18" y2="16"><stop stop-color="#f5e6a3"/><stop offset="1" stop-color="#e8c547"/></linearGradient></defs></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14 2 9.5h7.5L12 2z" fill="url(#gst)"/><defs><linearGradient id="gst" x1="2" y1="2" x2="22" y2="22"><stop stop-color="#f5e6a3"/><stop offset="1" stop-color="#e8c547"/></linearGradient></defs></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none"><rect x="6" y="2" width="12" height="20" rx="2" fill="url(#gph)"/><circle cx="12" cy="18" r="1.5" fill="rgba(255,255,255,.6)"/><defs><linearGradient id="gph" x1="6" y1="2" x2="18" y2="22"><stop stop-color="#1a1a2e"/><stop offset="1" stop-color="#4a7fa5"/></linearGradient></defs></svg>',
    boom: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6l2-6z" fill="url(#gbm)"/><defs><linearGradient id="gbm" x1="4" y1="2" x2="20" y2="22"><stop stop-color="#e74c3c"/><stop offset="1" stop-color="#922b21"/></linearGradient></defs></svg>',
    horn: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 14h4l8-6v12l-8-6H4V14z" fill="url(#ghn)"/><circle cx="18" cy="12" r="2" fill="#e8c547"/><defs><linearGradient id="ghn" x1="4" y1="6" x2="20" y2="18"><stop stop-color="#f4a4c4"/><stop offset="1" stop-color="#e8919f"/></linearGradient></defs></svg>',
    trombone: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 16h12v2H4zM16 10v8" stroke="#7eb8da" stroke-width="2"/><circle cx="16" cy="10" r="3" fill="#e8c547"/><path d="M7 16c0-3 2-5 4-5" stroke="#f4a4c4" stroke-width="1.5" fill="none"/></svg>',
    sleep: '<svg viewBox="0 0 24 24" fill="none"><text x="4" y="16" fill="#7eb8da" font-size="10" font-weight="bold">Zzz</text><circle cx="16" cy="12" r="6" fill="url(#gsl)"/><defs><linearGradient id="gsl" x1="10" y1="6" x2="22" y2="18"><stop stop-color="#4a7fa5"/><stop offset="1" stop-color="#1a1a2e"/></linearGradient></defs></svg>',
  };

  function glassIcon(name, size = 'md', accent = 'default') {
    const svg = SVGS[name] || SVGS.star;
    const sizes = { sm: 'g-emoji--sm', md: '', lg: 'g-emoji--lg', xl: 'g-emoji--xl' };
    const accents = {
      default: '',
      pink: 'g-emoji--pink',
      blue: 'g-emoji--blue',
      gold: 'g-emoji--gold',
      red: 'g-emoji--red',
    };
    const sizeCls = sizes[size] || '';
    const accentCls = accents[accent] || '';
    return `<span class="g-emoji ${sizeCls} ${accentCls}" role="img" aria-hidden="true"><span class="g-emoji__shine"></span><span class="g-emoji__inner">${svg}</span></span>`;
  }

  function glassChar(char, size = 'md', accent = 'default') {
    const sizes = { sm: 'g-emoji--sm', md: '', lg: 'g-emoji--lg', xl: 'g-emoji--xl' };
    const accents = { default: '', pink: 'g-emoji--pink', blue: 'g-emoji--blue', gold: 'g-emoji--gold', red: 'g-emoji--red' };
    return `<span class="g-emoji ${sizes[size] || ''} ${accents[accent] || ''} g-emoji--char" role="img" aria-hidden="true"><span class="g-emoji__shine"></span><span class="g-emoji__char">${char}</span></span>`;
  }

  function injectSectionIcons() {
    document.querySelectorAll('[data-gicon]').forEach((el) => {
      const name = el.dataset.gicon;
      const size = el.dataset.gsize || 'md';
      const accent = el.dataset.gaccent || 'default';
      el.outerHTML = glassIcon(name, size, accent);
    });
  }

  global.Icons = { glassIcon, glassChar, injectSectionIcons, SVGS };
})(window);
