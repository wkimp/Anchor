// Planner — the main app UI. Responsive: reads container width and adapts.
// Requires: planner-data.jsx, planner-icons.jsx

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function useTheme(tweaks) {
  const theme = THEMES[tweaks.theme] || THEMES.ochre;
  const type = TYPEFACES[tweaks.typeface] || TYPEFACES.newsreader;
  const pal  = PALETTE[tweaks.mode] || PALETTE.light;
  const dens = tweaks.density === 'compact'
    ? { pad: 14, gap: 10, row: 36, h1: 28, h2: 18, body: 14, micro: 11 }
    : { pad: 22, gap: 16, row: 44, h1: 36, h2: 22, body: 15, micro: 12 };
  return { theme, type, pal, dens };
}

function HR({ pal, style = {} }) {
  return <div style={{ height: 1, background: pal.rule, ...style }} />;
}

function SmallCaps({ children, color, style = {} }) {
  return <div style={{
    fontSize: 10.5, fontWeight: 500, textTransform: 'uppercase',
    letterSpacing: '0.14em', color, ...style,
  }}>{children}</div>;
}

// ─────────────────────────────────────────────────────────────
// Header — date, today, quick-add
// ─────────────────────────────────────────────────────────────
function PlannerHeader({ t, onQuickAdd, quickAdd, onView, view, compact }) {
  const { pal, type, theme, dens } = t;
  const date = new Date('2026-04-18T09:00:00');
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNum = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });

  const views = ['Today', 'Week', 'Month', 'All'];

  return (
    <div style={{
      padding: compact ? '16px 18px 12px' : '26px 32px 18px',
      borderBottom: `1px solid ${pal.rule}`,
      background: pal.paper,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <SmallCaps color={pal.ink3} style={{ marginBottom: 6 }}>
            {weekday} · week 16
          </SmallCaps>
          <div style={{
            fontFamily: type.display,
            fontSize: compact ? 28 : dens.h1 + 8,
            fontWeight: 400,
            color: pal.ink,
            letterSpacing: -0.5,
            lineHeight: 1,
            fontStyle: 'italic',
          }}>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              {month} {dayNum}
              <svg width="100%" height="8" viewBox="0 0 100 8" preserveAspectRatio="none" style={{
                position: 'absolute', left: 0, bottom: -4, width: '100%', height: 6,
              }}>
                <path d="M1 5 Q 25 1, 50 4 T 99 4" stroke={theme.accent} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2, border: `1px solid ${pal.rule}`, borderRadius: 2, padding: 2 }}>
          {views.map(v => (
            <button key={v} onClick={() => onView(v)} style={{
              border: 'none', background: view === v ? pal.ink : 'transparent',
              color: view === v ? pal.paper : pal.ink2,
              fontFamily: type.body, fontSize: compact ? 10 : 12, letterSpacing: 0.2,
              padding: compact ? '5px 9px' : '6px 12px', cursor: 'pointer',
              textTransform: 'uppercase', fontWeight: 500,
            }}>{v}</button>
          ))}
        </div>
      </div>

      {/* Quick-add */}
      <div style={{
        marginTop: compact ? 14 : 18,
        display: 'flex', alignItems: 'center', gap: 10,
        border: `1px solid ${pal.rule}`,
        background: pal.card,
        padding: '10px 14px',
        borderRadius: 2,
      }}>
        <Icon name="plus" size={15} style={{ color: pal.ink3 }} />
        <input
          value={quickAdd}
          onChange={e => onQuickAdd(e.target.value, 'typing')}
          onKeyDown={e => { if (e.key === 'Enter') onQuickAdd(quickAdd, 'submit'); }}
          placeholder="Add anything… try &quot;dentist Tuesday 3pm&quot;"
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: type.body, fontSize: 14, color: pal.ink,
          }}
        />
        <div style={{
          fontFamily: type.mono, fontSize: 10, color: pal.ink4,
          display: compact ? 'none' : 'flex', alignItems: 'center', gap: 4,
          padding: '2px 6px', border: `1px solid ${pal.rule}`, borderRadius: 2,
        }}>⏎</div>
      </div>

      {/* Parsed preview */}
      {quickAdd && (
        <div style={{
          marginTop: 8, fontFamily: type.body, fontSize: 12, color: pal.ink3,
          display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <Icon name="sparkle" size={12} style={{ color: theme.accent }} />
          <span>Parsed as:</span>
          {parseQuickAdd(quickAdd, theme, pal, type).map((chip, i) => (
            <span key={i} style={{
              fontFamily: type.mono, fontSize: 10.5, padding: '2px 7px',
              background: chip.bg, color: chip.fg, borderRadius: 2,
            }}>{chip.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function parseQuickAdd(text, theme, pal, type) {
  // Very simple parser for demo
  const chips = [];
  const m = text.match(/\b(mon|tue|wed|thu|fri|sat|sun)\w*/i);
  if (m) chips.push({ label: m[0].slice(0,3).toUpperCase(), bg: theme.accentSoft, fg: theme.accent });
  const t = text.match(/\b(\d{1,2})(:\d{2})?\s?(am|pm)?\b/i);
  if (t) chips.push({ label: t[0], bg: pal.rule2, fg: pal.ink2 });
  const rest = text.replace(m?.[0] ?? '', '').replace(t?.[0] ?? '', '').trim();
  if (rest) chips.push({ label: rest.slice(0, 20), bg: pal.rule2, fg: pal.ink2 });
  return chips;
}

// ─────────────────────────────────────────────────────────────
// Tasks widget — checklist, swipe, drag
// ─────────────────────────────────────────────────────────────
function Tasks({ t, tasks, setTasks, compact }) {
  const { pal, type, theme, dens } = t;
  const [filter, setFilter] = useState('all');
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [swipeId, setSwipeId] = useState(null);
  const [swipeX, setSwipeX] = useState(0);

  const toggle = (id) => setTasks(prev => prev.map(x => x.id === id ? { ...x, done: !x.done, _justDone: !x.done } : x));
  const remove = (id) => setTasks(prev => prev.filter(x => x.id !== id));

  const list = tasks.filter(x => {
    if (filter === 'open') return !x.done;
    if (filter === 'done') return x.done;
    if (filter === 'p1') return x.priority === 1 && !x.done;
    return true;
  });

  const prioLabel = (p) => p === 1 ? '!' : p === 2 ? '·' : '';
  const prioColor = (p) => p === 1 ? theme.accent : p === 2 ? pal.ink3 : pal.ink4;

  return (
    <Widget t={t} icon="check" title="Tasks" subtitle={`${tasks.filter(x=>!x.done).length} open · ${tasks.filter(x=>x.done).length} done`}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, fontFamily: type.body, fontSize: 11 }}>
        {['all','open','p1','done'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            border: 'none', background: filter === f ? pal.paperAlt : 'transparent',
            color: filter === f ? pal.ink : pal.ink3,
            padding: '4px 10px', cursor: 'pointer', borderRadius: 2,
            textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10.5, fontWeight: 500,
          }}>{f === 'p1' ? '!' : f}</button>
        ))}
      </div>

      <div>
        {list.map((task, idx) => {
          const isDragging = dragId === task.id;
          const isOver = overId === task.id;
          const isSwipe = swipeId === task.id;
          return (
            <div key={task.id}
              style={{ position: 'relative', overflow: 'hidden' }}
              draggable
              onDragStart={() => setDragId(task.id)}
              onDragEnd={() => { setDragId(null); setOverId(null); }}
              onDragOver={e => { e.preventDefault(); setOverId(task.id); }}
              onDrop={e => {
                e.preventDefault();
                if (dragId && dragId !== task.id) {
                  setTasks(prev => {
                    const arr = [...prev];
                    const from = arr.findIndex(x => x.id === dragId);
                    const to = arr.findIndex(x => x.id === task.id);
                    const [m] = arr.splice(from, 1);
                    arr.splice(to, 0, m);
                    return arr;
                  });
                }
              }}
            >
              {/* swipe background */}
              {isSwipe && swipeX < -40 && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'flex-end', paddingRight: 16,
                  background: swipeX < -120 ? '#B45B47' : pal.paperAlt,
                  color: swipeX < -120 ? '#fff' : pal.ink3,
                  fontFamily: type.body, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                  <Icon name="x" size={14} />
                </div>
              )}
              {isSwipe && swipeX > 40 && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 16,
                  background: swipeX > 120 ? theme.accent : pal.paperAlt,
                  color: swipeX > 120 ? '#fff' : pal.ink3,
                }}>
                  <Icon name="check" size={14} />
                </div>
              )}
              <div
                onPointerDown={e => {
                  if (e.pointerType === 'mouse') return;
                  setSwipeId(task.id); setSwipeX(0);
                  const startX = e.clientX;
                  const move = (ev) => setSwipeX(ev.clientX - startX);
                  const up = (ev) => {
                    const dx = ev.clientX - startX;
                    if (dx < -120) remove(task.id);
                    else if (dx > 120) toggle(task.id);
                    setSwipeId(null); setSwipeX(0);
                    window.removeEventListener('pointermove', move);
                    window.removeEventListener('pointerup', up);
                  };
                  window.addEventListener('pointermove', move);
                  window.addEventListener('pointerup', up);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: compact ? '7px 0' : '9px 0',
                  borderBottom: idx === list.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
                  opacity: isDragging ? 0.3 : 1,
                  transform: isSwipe ? `translateX(${swipeX}px)` : 'none',
                  background: pal.card,
                  borderTop: isOver ? `2px solid ${theme.accent}` : 'none',
                  cursor: 'grab', userSelect: 'none',
                  transition: isSwipe ? 'none' : 'transform 0.2s ease',
                }}
              >
                <button onClick={() => toggle(task.id)} style={{
                  border: `1.5px solid ${task.done ? pal.complete : pal.ink3}`,
                  background: task.done ? pal.complete : 'transparent',
                  width: 18, height: 18, borderRadius: 2, padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.2s ease', color: pal.card,
                }}>
                  {task.done && <Icon name="check" size={12} />}
                </button>
                <span style={{
                  color: prioColor(task.priority), fontFamily: type.display,
                  fontSize: 14, width: 8, fontStyle: 'italic', textAlign: 'center',
                  opacity: task.done ? 0.3 : 1,
                }}>{prioLabel(task.priority)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: type.body, fontSize: 14, color: pal.ink,
                    textDecoration: task.done ? 'line-through' : 'none',
                    opacity: task.done ? 0.5 : 1,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{task.text}</div>
                </div>
                {task.time && (
                  <div style={{ fontFamily: type.mono, fontSize: 11, color: pal.ink3 }}>{task.time}</div>
                )}
                <div style={{
                  fontFamily: type.body, fontSize: 10.5, color: pal.ink3,
                  padding: '2px 7px', background: pal.paperAlt, borderRadius: 2,
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>{task.project}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}

// ─────────────────────────────────────────────────────────────
// Widget — shared card wrapper
// ─────────────────────────────────────────────────────────────
function Widget({ t, icon, title, subtitle, children, action, span = 1, collapsible = true, defaultOpen = true }) {
  const { pal, type, theme } = t;
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: pal.card,
      border: `1px solid ${pal.rule}`,
      padding: 20,
      borderRadius: 2,
      gridColumn: `span ${span}`,
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
        paddingBottom: 12, borderBottom: `1px solid ${pal.rule}`,
      }}>
        {icon && <Icon name={icon} size={14} style={{ color: pal.ink3 }} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: type.display, fontSize: 17, color: pal.ink,
            letterSpacing: -0.2, fontStyle: 'italic',
          }}>{title}</div>
          {subtitle && (
            <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3, marginTop: 2, letterSpacing: 0.3 }}>
              {subtitle}
            </div>
          )}
        </div>
        {action}
        {collapsible && (
          <button onClick={() => setOpen(!open)} style={{
            border: 'none', background: 'transparent', color: pal.ink3,
            cursor: 'pointer', padding: 4, display: 'flex',
          }}>
            <Icon name={open ? 'chevron-u' : 'chevron-d'} size={14} />
          </button>
        )}
      </div>
      {open && <div style={{ flex: 1 }}>{children}</div>}
    </div>
  );
}

window.useTheme = useTheme;
window.HR = HR;
window.SmallCaps = SmallCaps;
window.PlannerHeader = PlannerHeader;
window.Tasks = Tasks;
window.Widget = Widget;
