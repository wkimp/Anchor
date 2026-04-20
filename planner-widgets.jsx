// Remaining widgets for the planner

// ─────────────────────────────────────────────────────────────
// Schedule — timeline (7am–10pm), scrubbable
// ─────────────────────────────────────────────────────────────
function Schedule({ t, compact }) {
  const { pal, type, theme } = t;
  const [now, setNow] = React.useState(10.15); // current hour
  const [scrubbing, setScrubbing] = React.useState(false);
  const railRef = React.useRef(null);

  const START = 6, END = 22;
  const hoursToPct = (h) => ((h - START) / (END - START)) * 100;

  const onScrub = (e) => {
    const rect = railRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setNow(START + pct * (END - START));
  };

  const eventColor = (kind) => ({
    focus: theme.accent,
    meeting: pal.ink2,
    personal: pal.ink3,
    wellness: theme.accent,
    ritual: pal.ink3,
  }[kind] || pal.ink3);

  return (
    <Widget t={t} icon="clock" title="Today's schedule" subtitle={`now · ${formatHour(now)}`}>
      <div style={{ display: 'flex', gap: 10, position: 'relative', height: compact ? 340 : 420 }}>
        {/* hour rail */}
        <div
          ref={railRef}
          onPointerDown={e => { setScrubbing(true); onScrub(e); }}
          onPointerMove={e => scrubbing && onScrub(e)}
          onPointerUp={() => setScrubbing(false)}
          onPointerLeave={() => setScrubbing(false)}
          style={{
            width: 46, flexShrink: 0, position: 'relative',
            borderRight: `1px solid ${pal.rule}`,
            cursor: 'ns-resize', userSelect: 'none',
          }}
        >
          {Array.from({ length: END - START + 1 }).map((_, i) => {
            const h = START + i;
            return (
              <div key={h} style={{
                position: 'absolute', top: `${hoursToPct(h)}%`, left: 0, right: 0,
                fontFamily: type.mono, fontSize: 9.5, color: pal.ink4,
                transform: 'translateY(-50%)', padding: '0 6px', textAlign: 'right',
              }}>{String(h).padStart(2,'0')}</div>
            );
          })}
          {/* now indicator */}
          <div style={{
            position: 'absolute', top: `${hoursToPct(now)}%`, left: 0, right: 0,
            height: 2, background: theme.accent, zIndex: 5,
            transform: 'translateY(-1px)',
          }}>
            <div style={{
              position: 'absolute', left: -4, top: -4, width: 10, height: 10,
              borderRadius: '50%', background: theme.accent,
            }} />
          </div>
        </div>

        {/* events */}
        <div style={{ flex: 1, position: 'relative' }}>
          {/* hour guides */}
          {Array.from({ length: END - START + 1 }).map((_, i) => {
            const h = START + i;
            return (
              <div key={h} style={{
                position: 'absolute', top: `${hoursToPct(h)}%`, left: 0, right: 0,
                height: 1, background: i % 3 === 0 ? pal.rule : pal.rule2,
              }} />
            );
          })}
          {/* now line */}
          <div style={{
            position: 'absolute', top: `${hoursToPct(now)}%`, left: 0, right: 0,
            height: 1, background: theme.accent, zIndex: 4, opacity: 0.6,
          }} />
          {SCHEDULE.map(ev => {
            const top = hoursToPct(ev.start);
            const height = hoursToPct(ev.end) - hoursToPct(ev.start);
            const past = ev.end < now;
            return (
              <div key={ev.id} style={{
                position: 'absolute', top: `${top}%`, height: `${height}%`,
                left: 4, right: 4,
                background: pal.card,
                borderLeft: `3px solid ${eventColor(ev.kind)}`,
                padding: '4px 8px', overflow: 'hidden',
                opacity: past ? 0.4 : 1,
                boxShadow: `0 1px 0 ${pal.rule}, 1px 0 0 ${pal.rule}, 0 -1px 0 ${pal.rule}, -1px 0 0 ${pal.rule}`,
              }}>
                <div style={{
                  fontFamily: type.body, fontSize: 12, color: pal.ink,
                  fontWeight: 500, lineHeight: 1.2,
                  textDecoration: past ? 'line-through' : 'none',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{ev.title}</div>
                <div style={{ fontFamily: type.mono, fontSize: 9.5, color: pal.ink3, marginTop: 2 }}>
                  {formatHour(ev.start)}–{formatHour(ev.end)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Widget>
  );
}

function formatHour(h) {
  const hr = Math.floor(h);
  const m = Math.round((h - hr) * 60);
  return `${String(hr).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

// ─────────────────────────────────────────────────────────────
// Habits — 7-day grid with satisfying tap
// ─────────────────────────────────────────────────────────────
function Habits({ t }) {
  const { pal, type, theme } = t;
  const [habits, setHabits] = React.useState(HABITS);
  const [pulse, setPulse] = React.useState(null);
  const days = ['M','T','W','T','F','S','S'];
  const today = 6; // Sat for demo

  const toggle = (hid, di) => {
    setHabits(prev => prev.map(h => h.id === hid ? {
      ...h,
      done: h.done.map((d, i) => i === di ? (d ? 0 : 1) : d),
    } : h));
    setPulse(`${hid}-${di}`);
    setTimeout(() => setPulse(null), 600);
  };

  return (
    <Widget t={t} icon="sparkle" title="Habits" subtitle="this week">
      <div>
        {/* day header */}
        <div style={{ display: 'flex', gap: 6, paddingLeft: 140, marginBottom: 10 }}>
          {days.map((d, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center',
              fontFamily: type.mono, fontSize: 10, color: i === today ? theme.accent : pal.ink4,
              fontWeight: i === today ? 600 : 400,
            }}>{d}</div>
          ))}
        </div>
        {habits.map(h => (
          <div key={h.id} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 0', borderBottom: `1px dashed ${pal.rule}`,
          }}>
            <div style={{ width: 100, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <Icon name={h.icon} size={13} style={{ color: pal.ink3 }} />
              <span style={{ fontFamily: type.body, fontSize: 13, color: pal.ink,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</span>
            </div>
            <div style={{ width: 40, fontFamily: type.mono, fontSize: 10, color: pal.ink3, flexShrink: 0 }}>
              {h.streak}d
            </div>
            <div style={{ display: 'flex', gap: 6, flex: 1 }}>
              {h.done.map((d, i) => {
                const isPulse = pulse === `${h.id}-${i}`;
                return (
                  <button key={i} onClick={() => toggle(h.id, i)} style={{
                    flex: 1, aspectRatio: '1', minWidth: 18, maxWidth: 28,
                    border: `1px solid ${d ? theme.accent : pal.rule}`,
                    background: d ? theme.accent : 'transparent',
                    color: pal.card, padding: 0, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    transform: isPulse ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: isPulse ? `0 0 0 6px ${theme.accentSoft}` : 'none',
                    borderRadius: 1,
                  }}>
                    {d ? <Icon name="check" size={10} /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

// ─────────────────────────────────────────────────────────────
// Wellness
// ─────────────────────────────────────────────────────────────
function Wellness({ t }) {
  const { pal, type, theme } = t;
  const w = WELLNESS;
  return (
    <Widget t={t} icon="heart" title="Wellness" subtitle="today">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Stat label="Sleep" big={w.sleep.hours + 'h'} sub={`${w.sleep.bedtime} → ${w.sleep.wake}`} t={t} />
        <Stat label="Mood"  big={w.mood.score + '/10'} sub={w.mood.note} t={t} />
        <Stat label="Water" big={`${w.water.cups}/${w.water.goal}`} sub="cups" bar={w.water.cups/w.water.goal} t={t} />
        <Stat label="Steps" big={w.steps.count.toLocaleString()} sub={`goal ${w.steps.goal.toLocaleString()}`} bar={w.steps.count/w.steps.goal} t={t} />
      </div>
    </Widget>
  );
}

function Stat({ label, big, sub, bar, t }) {
  const { pal, type, theme } = t;
  return (
    <div>
      <SmallCaps color={pal.ink3} style={{ marginBottom: 6 }}>{label}</SmallCaps>
      <div style={{ fontFamily: type.display, fontSize: 24, color: pal.ink, fontStyle: 'italic', lineHeight: 1 }}>
        {big}
      </div>
      <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3, marginTop: 4 }}>{sub}</div>
      {bar !== undefined && (
        <div style={{ marginTop: 6, height: 2, background: pal.rule, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, right: `${(1-bar)*100}%`, background: theme.accent }} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Notes
// ─────────────────────────────────────────────────────────────
function Notes({ t }) {
  const { pal, type, theme } = t;
  return (
    <Widget t={t} icon="note" title="Notes & journal" subtitle="recent">
      {NOTES.map((n, i) => (
        <div key={n.id} style={{
          padding: '10px 0',
          borderBottom: i === NOTES.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: type.display, fontSize: 14, color: pal.ink, fontStyle: 'italic', marginBottom: 3 }}>
              {n.title}
            </div>
            <div style={{
              fontFamily: type.body, fontSize: 12, color: pal.ink3, lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>{n.snippet}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4 }}>{n.date}</div>
            <div style={{
              fontFamily: type.mono, fontSize: 9, color: theme.accent,
              textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4,
            }}>{n.tag}</div>
          </div>
        </div>
      ))}
    </Widget>
  );
}

// ─────────────────────────────────────────────────────────────
// Finance
// ─────────────────────────────────────────────────────────────
function Finance({ t }) {
  const { pal, type, theme } = t;
  const f = FINANCE;
  const pct = f.spent / f.budget;
  return (
    <Widget t={t} icon="dollar" title="Finances" subtitle={`${f.month} · ${Math.round(pct*100)}% of budget`}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
          <span style={{ fontFamily: type.display, fontSize: 28, fontStyle: 'italic', color: pal.ink }}>${f.spent.toLocaleString()}</span>
          <span style={{ fontFamily: type.mono, fontSize: 11, color: pal.ink3 }}>/ ${f.budget.toLocaleString()}</span>
        </div>
        <div style={{ height: 3, background: pal.rule, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, right: `${(1-pct)*100}%`, background: theme.accent }} />
        </div>
      </div>
      {f.categories.slice(0, 5).map(c => {
        const p = c.amount / c.of;
        return (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
            <div style={{ width: 80, fontFamily: type.body, fontSize: 12, color: pal.ink2 }}>{c.name}</div>
            <div style={{ flex: 1, height: 2, background: pal.rule, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, right: `${(1-Math.min(1,p))*100}%`, background: p > 0.9 ? '#B45B47' : pal.ink3 }} />
            </div>
            <div style={{ width: 90, fontFamily: type.mono, fontSize: 10.5, color: pal.ink3, textAlign: 'right' }}>
              ${c.amount} / ${c.of}
            </div>
          </div>
        );
      })}
    </Widget>
  );
}

// ─────────────────────────────────────────────────────────────
// Meals
// ─────────────────────────────────────────────────────────────
function Meals({ t }) {
  const { pal, type, theme } = t;
  return (
    <Widget t={t} icon="fork" title="Meals this week" subtitle="planned">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: type.body, fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '4px 6px', fontWeight: 400, color: pal.ink4, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, width: 40 }}></th>
            {['Breakfast','Lunch','Dinner'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '4px 6px', fontWeight: 400, color: pal.ink4, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `1px solid ${pal.rule}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MEALS.map((d, i) => (
            <tr key={i}>
              <td style={{ padding: '8px 6px', fontFamily: type.mono, fontSize: 10, color: pal.ink3, borderBottom: `1px dashed ${pal.rule}` }}>{d.day}</td>
              <td style={{ padding: '8px 6px', color: pal.ink, borderBottom: `1px dashed ${pal.rule}` }}>{d.breakfast}</td>
              <td style={{ padding: '8px 6px', color: pal.ink, borderBottom: `1px dashed ${pal.rule}` }}>{d.lunch}</td>
              <td style={{ padding: '8px 6px', color: pal.ink, borderBottom: `1px dashed ${pal.rule}` }}>{d.dinner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  );
}

// ─────────────────────────────────────────────────────────────
// Reading
// ─────────────────────────────────────────────────────────────
function Reading({ t }) {
  const { pal, type, theme } = t;
  return (
    <Widget t={t} icon="book" title="Reading" subtitle={`${READING.filter(r=>r.status==='reading').length} in progress`}>
      {READING.map((r, i) => (
        <div key={i} style={{ padding: '10px 0', borderBottom: i === READING.length - 1 ? 'none' : `1px dashed ${pal.rule}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <div style={{ flex: 1, fontFamily: type.display, fontSize: 13, color: pal.ink, fontStyle: 'italic',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
            <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4 }}>
              {r.status === 'done' ? '✓' : r.status === 'queued' ? '—' : `${r.progress}%`}
            </div>
          </div>
          <div style={{ fontFamily: type.body, fontSize: 11, color: pal.ink3, marginBottom: 6 }}>{r.author}</div>
          {r.status !== 'queued' && (
            <div style={{ height: 2, background: pal.rule, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, right: `${100-r.progress}%`, background: r.status === 'done' ? pal.complete : theme.accent }} />
            </div>
          )}
        </div>
      ))}
    </Widget>
  );
}

// ─────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────
function Projects({ t }) {
  const { pal, type, theme } = t;
  return (
    <Widget t={t} icon="folder" title="Projects" subtitle={`${PROJECTS.filter(p=>p.progress<100).length} active`}>
      {PROJECTS.map((p, i) => (
        <div key={i} style={{ padding: '10px 0', borderBottom: i === PROJECTS.length - 1 ? 'none' : `1px dashed ${pal.rule}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <div style={{ flex: 1, fontFamily: type.body, fontSize: 13, color: pal.ink, fontWeight: 500 }}>{p.name}</div>
            <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3 }}>{p.done}/{p.tasks}</div>
            <div style={{ fontFamily: type.mono, fontSize: 10, color: p.due === 'Apr 15' ? '#B45B47' : pal.ink4 }}>{p.due}</div>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({length: p.tasks}).map((_, j) => (
              <div key={j} style={{
                flex: 1, height: 4, background: j < p.done ? theme.accent : pal.rule,
              }} />
            ))}
          </div>
        </div>
      ))}
    </Widget>
  );
}

// ─────────────────────────────────────────────────────────────
// People
// ─────────────────────────────────────────────────────────────
function People({ t }) {
  const { pal, type, theme } = t;
  const dueColor = (d) => d === 'overdue' ? '#B45B47' : d === 'this week' ? theme.accent : pal.ink3;
  return (
    <Widget t={t} icon="people" title="Keep in touch" subtitle={`${PEOPLE.filter(p=>p.due==='overdue').length} overdue`}>
      {PEOPLE.map((p, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '8px 0', borderBottom: i === PEOPLE.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: pal.paperAlt, border: `1px solid ${pal.rule}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: type.display, fontSize: 12, color: pal.ink2, fontStyle: 'italic',
            flexShrink: 0,
          }}>{p.name[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: type.body, fontSize: 13, color: pal.ink,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
            <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3, marginTop: 1 }}>{p.last}</div>
          </div>
          <div style={{
            fontFamily: type.mono, fontSize: 9, color: dueColor(p.due),
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>{p.due}</div>
        </div>
      ))}
    </Widget>
  );
}

// ─────────────────────────────────────────────────────────────
// Home chores
// ─────────────────────────────────────────────────────────────
function Home({ t }) {
  const { pal, type, theme } = t;
  return (
    <Widget t={t} icon="home" title="Home & chores">
      {HOME.map((c, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 0', borderBottom: i === HOME.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: c.due === 'overdue' ? '#B45B47' : c.due === 'soon' ? theme.accent : pal.ink4,
            flexShrink: 0,
          }} />
          <div style={{ flex: 1, fontFamily: type.body, fontSize: 13, color: pal.ink }}>{c.chore}</div>
          <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3 }}>{c.freq}</div>
          <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4, width: 80, textAlign: 'right' }}>{c.last}</div>
        </div>
      ))}
    </Widget>
  );
}

// ─────────────────────────────────────────────────────────────
// Business
// ─────────────────────────────────────────────────────────────
function Business({ t }) {
  const { pal, type, theme } = t;
  const b = BUSINESS;
  const growth = ((b.mrr - b.lastMonth) / b.lastMonth * 100).toFixed(1);
  return (
    <Widget t={t} icon="briefcase" title="Business" subtitle={`${b.clients} active clients`}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <SmallCaps color={pal.ink3} style={{ marginBottom: 6 }}>MRR</SmallCaps>
          <div style={{ fontFamily: type.display, fontSize: 24, color: pal.ink, fontStyle: 'italic', lineHeight: 1 }}>
            ${b.mrr.toLocaleString()}
          </div>
          <div style={{ fontFamily: type.mono, fontSize: 10, color: theme.accent, marginTop: 4 }}>
            ↗ +{growth}% vs last mo
          </div>
        </div>
        <div>
          <SmallCaps color={pal.ink3} style={{ marginBottom: 6 }}>Outstanding</SmallCaps>
          <div style={{ fontFamily: type.display, fontSize: 24, color: pal.ink, fontStyle: 'italic', lineHeight: 1 }}>
            {b.invoicesOutstanding}
          </div>
          <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3, marginTop: 4 }}>invoices</div>
        </div>
      </div>
      <div style={{
        padding: 10, background: pal.paperAlt, borderLeft: `2px solid ${theme.accent}`,
        fontFamily: type.body, fontSize: 12, color: pal.ink2,
      }}>
        <div style={{ fontFamily: type.mono, fontSize: 9, color: pal.ink3, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Next up
        </div>
        {b.nextInvoice}
      </div>
    </Widget>
  );
}

Object.assign(window, {
  Schedule, Habits, Wellness, Notes, Finance, Meals,
  Reading, Projects, People, Home, Business, formatHour,
});
