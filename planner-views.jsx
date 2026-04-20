// Week view — 7-day spread like a paper planner (Mon–Sun columns)
// Month view — classic 5-6 week calendar grid

function WeekView({ t, tasks, setTasks, compact }) {
  const { pal, type, theme } = t;
  const days = [
    { name: 'Monday',    short: 'Mon', num: 13 },
    { name: 'Tuesday',   short: 'Tue', num: 14 },
    { name: 'Wednesday', short: 'Wed', num: 15 },
    { name: 'Thursday',  short: 'Thu', num: 16 },
    { name: 'Friday',    short: 'Fri', num: 17 },
    { name: 'Saturday',  short: 'Sat', num: 18, today: true },
    { name: 'Sunday',    short: 'Sun', num: 19 },
  ];

  // Synthetic distribution of tasks and events across the week
  const weekData = {
    13: { tasks: ['Call insurance', 'Review sprint backlog'], events: [{ t: '10:00', label: 'Team retro' }] },
    14: { tasks: ['Dentist 3pm', 'Groceries'], events: [{ t: '15:00', label: 'Dentist' }, { t: '18:30', label: 'Run club' }] },
    15: { tasks: ['Draft proposal — Chen'], events: [{ t: '09:00', label: 'Deep work' }, { t: '13:00', label: 'Lunch w/ Priya' }] },
    16: { tasks: ['Invoice Aperture', 'Laundry'], events: [{ t: '11:30', label: 'Standup' }] },
    17: { tasks: ['Ship website copy'], events: [{ t: '16:00', label: 'Studio visit' }] },
    18: { tasks: ['Chen proposal', 'Water plants', 'Reply to Marguerite'], events: [{ t: '09:00', label: 'Deep work' }, { t: '14:00', label: 'Client call' }, { t: '19:00', label: 'Dinner' }] },
    19: { tasks: ['Weekly review', 'Meal prep'], events: [{ t: '10:00', label: 'Farmers market' }] },
  };

  return (
    <div style={{ padding: compact ? 14 : 24 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${pal.rule}`,
      }}>
        <div style={{ fontFamily: type.display, fontSize: compact ? 20 : 26, fontStyle: 'italic', color: pal.ink, letterSpacing: -0.3 }}>
          Week of April 13
        </div>
        <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3, letterSpacing: 0.3, textTransform: 'uppercase' }}>
          week 16 of 52
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: compact ? '1fr' : 'repeat(7, 1fr)',
        gap: compact ? 10 : 0,
        border: compact ? 'none' : `1px solid ${pal.rule}`,
        background: pal.card,
      }}>
        {days.map((d, i) => {
          const data = weekData[d.num] || { tasks: [], events: [] };
          return (
            <div key={d.name} style={{
              borderRight: compact ? 'none' : (i < 6 ? `1px solid ${pal.rule}` : 'none'),
              border: compact ? `1px solid ${pal.rule}` : 'none',
              minHeight: compact ? 'auto' : 360,
              padding: 12,
              background: d.today ? pal.paperAlt : 'transparent',
              position: 'relative',
            }}>
              {/* Day header */}
              <div style={{
                paddingBottom: 8, marginBottom: 10,
                borderBottom: `1px solid ${pal.rule}`,
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{
                    fontFamily: type.mono, fontSize: 9.5, color: d.today ? theme.accent : pal.ink4,
                    letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: d.today ? 600 : 400,
                  }}>{compact ? d.name : d.short}</div>
                  <div style={{
                    fontFamily: type.display, fontSize: 22, fontStyle: 'italic',
                    color: d.today ? theme.accent : pal.ink, lineHeight: 1.1, marginTop: 2,
                  }}>{d.num}</div>
                </div>
                {d.today && (
                  <div style={{
                    fontFamily: type.mono, fontSize: 8, color: theme.accent,
                    letterSpacing: 0.5, textTransform: 'uppercase',
                  }}>today</div>
                )}
              </div>

              {/* Events */}
              {data.events.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  {data.events.map((ev, j) => (
                    <div key={j} style={{
                      display: 'flex', gap: 6, alignItems: 'baseline', padding: '3px 0',
                    }}>
                      <span style={{ fontFamily: type.mono, fontSize: 9.5, color: pal.ink4, width: 36, flexShrink: 0 }}>{ev.t}</span>
                      <span style={{ fontFamily: type.body, fontSize: 11.5, color: pal.ink,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {data.events.length > 0 && data.tasks.length > 0 && (
                <div style={{ height: 1, borderTop: `1px dashed ${pal.rule}`, margin: '6px 0 8px' }} />
              )}

              {/* Tasks */}
              {data.tasks.map((tk, j) => (
                <div key={j} style={{
                  display: 'flex', gap: 6, alignItems: 'flex-start', padding: '3px 0',
                }}>
                  <div style={{
                    width: 10, height: 10, border: `1.5px solid ${pal.ink3}`,
                    borderRadius: 1, flexShrink: 0, marginTop: 3,
                  }} />
                  <span style={{ fontFamily: type.body, fontSize: 11.5, color: pal.ink, lineHeight: 1.3 }}>{tk}</span>
                </div>
              ))}

              {data.events.length === 0 && data.tasks.length === 0 && (
                <div style={{ fontFamily: type.display, fontSize: 12, fontStyle: 'italic', color: pal.ink4, textAlign: 'center', paddingTop: 20 }}>
                  open
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly intentions / goals strip */}
      <div style={{
        marginTop: 20, padding: 18,
        border: `1px solid ${pal.rule}`, background: pal.card,
      }}>
        <SmallCaps color={pal.ink3} style={{ marginBottom: 10 }}>This week's intentions</SmallCaps>
        <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { label: 'Ship', text: 'Chen proposal draft to team by Friday' },
            { label: 'Nurture', text: 'One long walk · two unhurried meals' },
            { label: 'Rest', text: 'No screens after 9pm, at least 3 nights' },
          ].map((g, i) => (
            <div key={i} style={{ borderLeft: `2px solid ${theme.accent}`, paddingLeft: 12 }}>
              <div style={{ fontFamily: type.mono, fontSize: 9, color: theme.accent, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{g.label}</div>
              <div style={{ fontFamily: type.display, fontSize: 14, fontStyle: 'italic', color: pal.ink, lineHeight: 1.4 }}>{g.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MonthView({ t, tasks, compact }) {
  const { pal, type, theme } = t;
  // April 2026: starts Wednesday, 30 days
  // Use Mon-first grid. Apr 1 2026 = Wednesday → offset 2 from Monday.
  const firstOffset = 2;
  const daysInMonth = 30;
  const cells = [];
  for (let i = 0; i < firstOffset; i++) cells.push({ num: 30 - firstOffset + i + 1, muted: true, m: 'Mar' });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ num: i, m: 'Apr' });
  while (cells.length % 7 !== 0) cells.push({ num: cells.length - daysInMonth - firstOffset + 1, muted: true, m: 'May' });
  while (cells.length < 42) cells.push({ num: cells.length - daysInMonth - firstOffset + 1, muted: true, m: 'May' });

  // Events by day (Apr)
  const dayEvents = {
    3: [{ label: 'Tax filing', kind: 'deadline' }],
    8: [{ label: 'Studio opening', kind: 'social' }],
    14: [{ label: 'Dentist', kind: 'health' }],
    15: [{ label: 'Tax deadline', kind: 'deadline' }],
    18: [{ label: 'Client call', kind: 'work' }, { label: 'Dinner', kind: 'social' }],
    22: [{ label: 'Dad\'s birthday', kind: 'social' }],
    24: [{ label: 'Chen proposal due', kind: 'deadline' }],
    27: [{ label: 'Studio retreat', kind: 'work' }],
  };

  const kindColor = (k) => ({
    deadline: '#B45B47', work: theme.accent, social: pal.ink3, health: theme.accent,
  }[k] || pal.ink3);

  const dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <div style={{ padding: compact ? 14 : 24 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${pal.rule}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: pal.ink3, padding: 4, display: 'flex' }}>
            <Icon name="chevron-l" size={18} />
          </button>
          <div style={{ fontFamily: type.display, fontSize: compact ? 22 : 30, fontStyle: 'italic', color: pal.ink, letterSpacing: -0.3 }}>
            April <span style={{ color: pal.ink3 }}>2026</span>
          </div>
          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: pal.ink3, padding: 4, display: 'flex' }}>
            <Icon name="chevron-r" size={18} />
          </button>
        </div>
        <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3, letterSpacing: 0.3, textTransform: 'uppercase' }}>
          q2 · spring
        </div>
      </div>

      {/* Day header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 0 }}>
        {dayNames.map(d => (
          <div key={d} style={{
            fontFamily: type.mono, fontSize: 9.5, color: pal.ink4,
            textTransform: 'uppercase', letterSpacing: 0.5,
            padding: '8px 10px', borderBottom: `1px solid ${pal.rule}`,
          }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        border: `1px solid ${pal.rule}`, borderTop: 'none', background: pal.card,
      }}>
        {cells.map((c, i) => {
          const isToday = !c.muted && c.num === 18;
          const evs = !c.muted && c.m === 'Apr' ? (dayEvents[c.num] || []) : [];
          return (
            <div key={i} style={{
              minHeight: compact ? 64 : 96,
              borderRight: (i + 1) % 7 !== 0 ? `1px solid ${pal.rule}` : 'none',
              borderTop: i >= 7 ? `1px solid ${pal.rule}` : 'none',
              padding: 8,
              background: isToday ? pal.paperAlt : 'transparent',
              opacity: c.muted ? 0.35 : 1,
              position: 'relative',
              cursor: 'pointer',
            }}>
              <div style={{
                fontFamily: type.display, fontSize: isToday ? 18 : 14,
                fontStyle: 'italic',
                color: isToday ? theme.accent : pal.ink,
                lineHeight: 1, marginBottom: 6,
              }}>
                {c.num}
                {isToday && (
                  <svg width="24" height="6" viewBox="0 0 24 6" style={{ display: 'block', marginTop: 1 }}>
                    <path d="M1 3 Q 6 1, 12 3 T 23 3" stroke={theme.accent} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              {evs.slice(0, compact ? 1 : 2).map((ev, j) => (
                <div key={j} style={{
                  display: 'flex', gap: 4, alignItems: 'center', marginBottom: 2,
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: kindColor(ev.kind), flexShrink: 0 }} />
                  <div style={{
                    fontFamily: type.body, fontSize: 10, color: pal.ink2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{ev.label}</div>
                </div>
              ))}
              {evs.length > (compact ? 1 : 2) && (
                <div style={{ fontFamily: type.mono, fontSize: 9, color: pal.ink3 }}>
                  +{evs.length - (compact ? 1 : 2)} more
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: 18, display: 'flex', gap: 18, flexWrap: 'wrap',
        fontFamily: type.mono, fontSize: 10, color: pal.ink3, letterSpacing: 0.3,
      }}>
        {[
          { k: 'work', label: 'work' },
          { k: 'deadline', label: 'deadline' },
          { k: 'social', label: 'social' },
          { k: 'health', label: 'health' },
        ].map(l => (
          <div key={l.k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: kindColor(l.k) }} />
            <span style={{ textTransform: 'uppercase' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { WeekView, MonthView });
