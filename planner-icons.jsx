// Icons — thin line, 1.5 stroke, paper-planner feel
// All 20×20 viewBox unless noted; inherit currentColor

const Icon = ({ name, size = 18, style = {} }) => {
  const s = { width: size, height: size, display: 'inline-block', flexShrink: 0, ...style };
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'check': return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M4 10.5l4 4 8-9"/></svg>;
    case 'plus':  return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M10 4v12M4 10h12"/></svg>;
    case 'x':     return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M5 5l10 10M15 5L5 15"/></svg>;
    case 'dot':   return <svg viewBox="0 0 20 20" style={s}><circle cx="10" cy="10" r="2" fill="currentColor"/></svg>;
    case 'circle': return <svg viewBox="0 0 20 20" style={s}><circle {...common} cx="10" cy="10" r="6"/></svg>;
    case 'square': return <svg viewBox="0 0 20 20" style={s}><rect {...common} x="4" y="4" width="12" height="12" rx="1"/></svg>;
    case 'chevron-r': return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M8 5l5 5-5 5"/></svg>;
    case 'chevron-l': return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M12 5l-5 5 5 5"/></svg>;
    case 'chevron-d': return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M5 8l5 5 5-5"/></svg>;
    case 'chevron-u': return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M5 12l5-5 5 5"/></svg>;
    case 'clock': return <svg viewBox="0 0 20 20" style={s}><circle {...common} cx="10" cy="10" r="7"/><path {...common} d="M10 6v4l2.5 2.5"/></svg>;
    case 'cal':   return <svg viewBox="0 0 20 20" style={s}><rect {...common} x="3" y="5" width="14" height="12" rx="1"/><path {...common} d="M3 9h14M7 3v4M13 3v4"/></svg>;
    case 'pen':   return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M3 17l1-4 10-10 3 3L7 16l-4 1z"/></svg>;
    case 'book':  return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M3 4h6a3 3 0 013 3v10a2 2 0 00-2-2H3V4zM17 4h-6a3 3 0 00-3 3v10a2 2 0 012-2h7V4z"/></svg>;
    case 'run':   return <svg viewBox="0 0 20 20" style={s}><circle {...common} cx="13" cy="4" r="1.5"/><path {...common} d="M9 17l2-4-3-2 2-4 3 2 3-1M6 10l-2 3"/></svg>;
    case 'moon':  return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M16 11A6 6 0 019 4a6 6 0 107 7z"/></svg>;
    case 'heart': return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M10 16s-6-4-6-8a3 3 0 016-1 3 3 0 016 1c0 4-6 8-6 8z"/></svg>;
    case 'droplet': return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M10 3s-5 6-5 10a5 5 0 0010 0c0-4-5-10-5-10z"/></svg>;
    case 'dollar':  return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M13 6H8.5a2 2 0 100 4h3a2 2 0 110 4H7M10 3v14"/></svg>;
    case 'fork':   return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M6 3v5a2 2 0 004 0V3M8 8v9M13 3c-1 2-1 4 0 6l1 1v7"/></svg>;
    case 'people': return <svg viewBox="0 0 20 20" style={s}><circle {...common} cx="10" cy="7" r="3"/><path {...common} d="M4 17c0-3 3-5 6-5s6 2 6 5"/></svg>;
    case 'home':   return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M3 10l7-6 7 6v7a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1v-7z"/></svg>;
    case 'briefcase': return <svg viewBox="0 0 20 20" style={s}><rect {...common} x="3" y="6" width="14" height="11" rx="1"/><path {...common} d="M7 6V4h6v2M3 11h14"/></svg>;
    case 'note':   return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M4 3h9l3 3v11H4V3zM13 3v3h3"/></svg>;
    case 'folder': return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M3 6a1 1 0 011-1h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1V6z"/></svg>;
    case 'search': return <svg viewBox="0 0 20 20" style={s}><circle {...common} cx="9" cy="9" r="5"/><path {...common} d="M13 13l4 4"/></svg>;
    case 'settings': return <svg viewBox="0 0 20 20" style={s}><circle {...common} cx="10" cy="10" r="2.5"/><path {...common} d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.5 1.5M14 14l1.5 1.5M4.5 15.5L6 14M14 6l1.5-1.5"/></svg>;
    case 'more':  return <svg viewBox="0 0 20 20" style={s}><circle cx="5" cy="10" r="1.5" fill="currentColor"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/></svg>;
    case 'sparkle': return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M10 3l1.5 4L16 8.5 11.5 10 10 14.5 8.5 10 4 8.5 8.5 7 10 3z"/></svg>;
    case 'flag':  return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M5 3v14M5 4h9l-2 3 2 3H5"/></svg>;
    case 'arrow-r': return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M4 10h12M11 5l5 5-5 5"/></svg>;
    case 'menu':  return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M3 6h14M3 10h14M3 14h14"/></svg>;
    case 'filter': return <svg viewBox="0 0 20 20" style={s}><path {...common} d="M3 5h14l-5 6v5l-4 1v-6L3 5z"/></svg>;
    case 'mic':   return <svg viewBox="0 0 20 20" style={s}><rect {...common} x="8" y="3" width="4" height="9" rx="2"/><path {...common} d="M5 10a5 5 0 0010 0M10 15v3M7 18h6"/></svg>;
    case 'grip':  return <svg viewBox="0 0 20 20" style={s}><circle cx="7" cy="6" r="1.2" fill="currentColor"/><circle cx="13" cy="6" r="1.2" fill="currentColor"/><circle cx="7" cy="10" r="1.2" fill="currentColor"/><circle cx="13" cy="10" r="1.2" fill="currentColor"/><circle cx="7" cy="14" r="1.2" fill="currentColor"/><circle cx="13" cy="14" r="1.2" fill="currentColor"/></svg>;
    default: return null;
  }
};

window.Icon = Icon;
