// Full-page views for each sidebar menu item
// These replace the widget grid when a sidebar item is selected.

function PageShell({ t, title, subtitle, action, children, compact }) {
  const { pal, type } = t;
  return (
    <div style={{ padding: compact ? 14 : 28 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        paddingBottom: 18, marginBottom: 22,
        borderBottom: `1px solid ${pal.rule}`, gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          {subtitle && (
            <SmallCaps color={pal.ink3} style={{ marginBottom: 6 }}>{subtitle}</SmallCaps>
          )}
          <div style={{
            fontFamily: type.display, fontSize: compact ? 26 : 36, fontStyle: 'italic',
            color: pal.ink, letterSpacing: -0.5, lineHeight: 1,
          }}>{title}</div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ t, children, right }) {
  const { pal, type } = t;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      marginBottom: 12, marginTop: 24,
    }}>
      <div style={{ fontFamily: type.display, fontSize: 18, fontStyle: 'italic', color: pal.ink, letterSpacing: -0.2 }}>
        {children}
      </div>
      {right}
    </div>
  );
}

function StatCard({ t, label, big, sub, trend, width = '1fr' }) {
  const { pal, type, theme } = t;
  return (
    <div style={{ padding: 18, border: `1px solid ${pal.rule}`, background: pal.card }}>
      <SmallCaps color={pal.ink3} style={{ marginBottom: 10 }}>{label}</SmallCaps>
      <div style={{ fontFamily: type.display, fontSize: 32, fontStyle: 'italic', color: pal.ink, lineHeight: 1 }}>
        {big}
      </div>
      {sub && <div style={{ fontFamily: type.mono, fontSize: 10.5, color: pal.ink3, marginTop: 6 }}>{sub}</div>}
      {trend && <div style={{ fontFamily: type.mono, fontSize: 10.5, color: theme.accent, marginTop: 4 }}>{trend}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Upcoming — agenda-style list across next 14 days
// ─────────────────────────────────────────────────────────────
function UpcomingPage({ t, compact }) {
  const { pal, type, theme } = t;
  const groups = [
    { day: 'Tomorrow · Sun Apr 19', items: [
      { t: '10:00', label: 'Farmers market', tag: 'personal' },
      { t: null, label: 'Meal prep for the week', tag: 'home' },
      { t: null, label: 'Weekly review', tag: 'reflect' },
    ]},
    { day: 'Mon Apr 20', items: [
      { t: '09:00', label: 'Design review — studio site', tag: 'work' },
      { t: '12:30', label: 'Lunch w/ Priya', tag: 'people' },
      { t: null, label: 'Send Chen invoice', tag: 'business' },
    ]},
    { day: 'Tue Apr 21', items: [
      { t: '15:00', label: 'Dentist appointment', tag: 'health' },
    ]},
    { day: 'Wed Apr 22', items: [
      { t: null, label: 'Dad\'s birthday · call', tag: 'people' },
      { t: '18:00', label: 'Run club', tag: 'health' },
    ]},
    { day: 'Fri Apr 24', items: [
      { t: null, label: 'Chen proposal due', tag: 'deadline' },
    ]},
    { day: 'Mon Apr 27', items: [
      { t: null, label: 'Studio retreat begins', tag: 'work' },
    ]},
  ];
  const tagColor = (x) => ({
    deadline: '#B45B47', work: theme.accent, people: pal.ink3,
    business: theme.accent, health: theme.accent, home: pal.ink3,
    personal: pal.ink3, reflect: pal.ink3,
  }[x] || pal.ink3);

  return (
    <PageShell t={t} title="Upcoming" subtitle="next 14 days" compact={compact}>
      {groups.map((g, i) => (
        <div key={i} style={{ marginBottom: 22 }}>
          <div style={{
            fontFamily: type.mono, fontSize: 10.5, color: pal.ink3,
            letterSpacing: 0.3, textTransform: 'uppercase',
            paddingBottom: 8, borderBottom: `1px solid ${pal.rule}`, marginBottom: 8,
          }}>{g.day}</div>
          {g.items.map((it, j) => (
            <div key={j} style={{
              display: 'flex', gap: 14, alignItems: 'baseline',
              padding: '10px 0', borderBottom: `1px dashed ${pal.rule}`,
            }}>
              <div style={{ width: 52, fontFamily: type.mono, fontSize: 11, color: pal.ink3, flexShrink: 0 }}>
                {it.t || '—'}
              </div>
              <div style={{ flex: 1, fontFamily: type.body, fontSize: 14, color: pal.ink }}>{it.label}</div>
              <div style={{
                fontFamily: type.mono, fontSize: 9, color: tagColor(it.tag),
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>{it.tag}</div>
            </div>
          ))}
        </div>
      ))}
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Someday — parking lot for ideas, broken into columns
// ─────────────────────────────────────────────────────────────
function SomedayPage({ t, compact }) {
  const { pal, type, theme } = t;
  const cols = [
    { title: 'Someday', items: [
      'Visit Kyoto in autumn',
      'Learn to throw pottery',
      'Write a long-form essay on rest',
      'Host a supper club',
      'Build a standing desk',
    ]},
    { title: 'Maybe', items: [
      'Switch to a standing phone holder setup',
      'Cook through Samin Nosrat\'s book',
      'Redesign the home office',
      'Take a watercolor class',
    ]},
    { title: 'Waiting on', items: [
      'Aperture contract signature',
      'Sam\'s edit on the proposal',
      'Landlord re: dishwasher',
    ]},
  ];
  return (
    <PageShell t={t} title="Someday" subtitle="no deadline, still worth holding" compact={compact}>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(3, 1fr)', gap: 18 }}>
        {cols.map((c, i) => (
          <div key={i} style={{ border: `1px solid ${pal.rule}`, background: pal.card, padding: 18 }}>
            <div style={{
              fontFamily: type.display, fontSize: 15, fontStyle: 'italic',
              color: pal.ink, marginBottom: 12, paddingBottom: 10,
              borderBottom: `1px solid ${pal.rule}`,
            }}>{c.title}</div>
            {c.items.map((it, j) => (
              <div key={j} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0',
                borderBottom: j === c.items.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
              }}>
                <span style={{ fontFamily: type.display, fontStyle: 'italic', color: theme.accent, fontSize: 14 }}>·</span>
                <span style={{ fontFamily: type.body, fontSize: 13, color: pal.ink2, lineHeight: 1.4 }}>{it}</span>
              </div>
            ))}
            <button style={{
              marginTop: 12, border: `1px dashed ${pal.rule}`, background: 'transparent',
              width: '100%', padding: '8px 10px', color: pal.ink3,
              fontFamily: type.body, fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
            }}>
              <Icon name="plus" size={12} /> add
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Business — detailed dashboard
// ─────────────────────────────────────────────────────────────
function BusinessPage({ t, compact }) {
  const { pal, type, theme } = t;
  const b = BUSINESS;
  const growth = ((b.mrr - b.lastMonth) / b.lastMonth * 100).toFixed(1);
  const clients = [
    { name: 'Aperture Co.',      mrr: 4200, status: 'active', owes: 4200, since: 'Jan 2025' },
    { name: 'Meridian Studio',   mrr: 1800, status: 'active', owes: 0, since: 'Aug 2024' },
    { name: 'Chen Foundation',   mrr: 0,    status: 'proposal', owes: 0, since: 'Apr 2026' },
    { name: 'Porter & Mills',    mrr: 1200, status: 'active', owes: 0, since: 'Nov 2024' },
    { name: 'Holtz',             mrr: 800,  status: 'active', owes: 0, since: 'Feb 2025' },
    { name: 'Voss',              mrr: 400,  status: 'paused', owes: 0, since: 'Jun 2024' },
  ];
  const invoices = [
    { num: '#2026-014', client: 'Aperture Co.',    amount: 4200, status: 'sent',    due: 'Apr 22' },
    { num: '#2026-013', client: 'Meridian Studio', amount: 1800, status: 'paid',    due: 'Apr 10' },
    { num: '#2026-012', client: 'Porter & Mills',  amount: 1200, status: 'paid',    due: 'Apr 3' },
    { num: '#2026-011', client: 'Holtz',           amount: 800,  status: 'paid',    due: 'Apr 1' },
    { num: '#2026-015', client: 'Chen Foundation', amount: 6500, status: 'draft',   due: '—' },
  ];
  const statusColor = (s) => ({
    paid: pal.ink3, sent: theme.accent, draft: pal.ink4, active: theme.accent,
    paused: pal.ink4, proposal: '#B45B47',
  }[s]);

  return (
    <PageShell t={t} title="Business" subtitle="overview · april" compact={compact}
      action={<button style={{
        padding: '8px 14px', border: `1px solid ${pal.ink}`, background: pal.ink, color: pal.paper,
        fontFamily: type.body, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}><Icon name="plus" size={12}/> New invoice</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14 }}>
        <StatCard t={t} label="MRR"          big={`$${b.mrr.toLocaleString()}`} trend={`↗ +${growth}% vs Mar`} />
        <StatCard t={t} label="Outstanding"  big={`$${4200}`} sub="1 invoice · Apr 22" />
        <StatCard t={t} label="Clients"      big={b.clients} sub="4 active · 1 paused · 1 proposal" />
        <StatCard t={t} label="Ytd revenue"  big="$31,200" sub="target $60,000" />
      </div>

      {/* Revenue sparkline */}
      <div style={{ marginTop: 18, padding: 22, border: `1px solid ${pal.rule}`, background: pal.card }}>
        <SmallCaps color={pal.ink3} style={{ marginBottom: 14 }}>MRR · last 12 months</SmallCaps>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
          {[4200, 4200, 4800, 5600, 5600, 6400, 6800, 7200, 7800, 7600, 7950, 8400].map((v, i) => {
            const h = (v / 10000) * 100;
            const mo = ['M','J','J','A','S','O','N','D','J','F','M','A'][i];
            const isCur = i === 11;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%', height: `${h}%`,
                  background: isCur ? theme.accent : pal.ink3,
                  opacity: isCur ? 1 : 0.4,
                }} />
                <div style={{ fontFamily: type.mono, fontSize: 9, color: isCur ? theme.accent : pal.ink4 }}>{mo}</div>
              </div>
            );
          })}
        </div>
      </div>

      <SectionTitle t={t}>Clients</SectionTitle>
      <div style={{ border: `1px solid ${pal.rule}`, background: pal.card }}>
        {clients.map((c, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: compact ? '1fr auto' : '2fr 1fr 1fr 1fr auto',
            gap: 12, padding: '12px 16px',
            borderBottom: i === clients.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: type.body, fontSize: 14, color: pal.ink, fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4, marginTop: 2 }}>since {c.since}</div>
            </div>
            {!compact && (
              <>
                <div style={{ fontFamily: type.mono, fontSize: 12, color: pal.ink2 }}>${c.mrr.toLocaleString()}/mo</div>
                <div style={{
                  fontFamily: type.mono, fontSize: 10, color: statusColor(c.status),
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>{c.status}</div>
                <div style={{ fontFamily: type.mono, fontSize: 11, color: c.owes ? '#B45B47' : pal.ink4 }}>
                  {c.owes ? `owes $${c.owes}` : 'settled'}
                </div>
              </>
            )}
            <Icon name="chevron-r" size={14} style={{ color: pal.ink4 }} />
          </div>
        ))}
      </div>

      <SectionTitle t={t}>Recent invoices</SectionTitle>
      <div style={{ border: `1px solid ${pal.rule}`, background: pal.card }}>
        {invoices.map((inv, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: compact ? '1fr auto' : '1fr 2fr 1fr 1fr 1fr',
            gap: 12, padding: '12px 16px',
            borderBottom: i === invoices.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
            alignItems: 'center',
          }}>
            <div style={{ fontFamily: type.mono, fontSize: 11, color: pal.ink3 }}>{inv.num}</div>
            {!compact && <div style={{ fontFamily: type.body, fontSize: 13, color: pal.ink }}>{inv.client}</div>}
            <div style={{ fontFamily: type.mono, fontSize: 12, color: pal.ink2, textAlign: compact ? 'right' : 'left' }}>${inv.amount.toLocaleString()}</div>
            {!compact && <div style={{
              fontFamily: type.mono, fontSize: 10, color: statusColor(inv.status),
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>{inv.status}</div>}
            {!compact && <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4 }}>due {inv.due}</div>}
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Projects — detailed project list with kanban-ish cards
// ─────────────────────────────────────────────────────────────
function ProjectsPage({ t, compact }) {
  const { pal, type, theme } = t;
  const projects = [
    { name: 'Chen proposal', due: 'Apr 24', progress: 45, tasks: 7, done: 3,
      next: 'Write the diagnostic section',
      note: 'Lead with outcomes. Reference the 2024 engagement.',
      area: 'Business' },
    { name: 'Studio website', due: 'May 12', progress: 20, tasks: 14, done: 3,
      next: 'Finalize color palette with Dev',
      note: 'Hold on layout until copy lands.',
      area: 'Business' },
    { name: 'Spring garden', due: 'Ongoing', progress: 70, tasks: 5, done: 4,
      next: 'Plant the calendula this weekend',
      note: 'Tomatoes in by May 1.',
      area: 'Home' },
    { name: 'Tax filing', due: 'Apr 15', progress: 100, tasks: 4, done: 4,
      next: 'Done — archive folder',
      note: 'Filed Apr 14. Refund expected 3 weeks.',
      area: 'Finance' },
    { name: 'Read Pattern Language', due: 'Jun 30', progress: 14, tasks: 10, done: 1,
      next: 'Chapter 2 — Independent Regions',
      note: 'Light reading, not a sprint.',
      area: 'Reading' },
  ];

  return (
    <PageShell t={t} title="Projects" subtitle={`${projects.filter(p=>p.progress<100).length} active · ${projects.filter(p=>p.progress===100).length} complete`} compact={compact}
      action={<button style={{
        padding: '8px 14px', border: `1px solid ${pal.ink}`, background: pal.ink, color: pal.paper,
        fontFamily: type.body, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}><Icon name="plus" size={12}/> New project</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(2, 1fr)', gap: 14 }}>
        {projects.map((p, i) => {
          const isDone = p.progress === 100;
          const isUrgent = p.due === 'Apr 15' || p.due === 'Apr 24';
          return (
            <div key={i} style={{
              border: `1px solid ${pal.rule}`, background: pal.card, padding: 20,
              opacity: isDone ? 0.65 : 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                <div style={{
                  fontFamily: type.display, fontSize: 18, fontStyle: 'italic', color: pal.ink,
                  letterSpacing: -0.2, flex: 1,
                  textDecoration: isDone ? 'line-through' : 'none',
                }}>{p.name}</div>
                <div style={{
                  fontFamily: type.mono, fontSize: 10, color: pal.ink4,
                  padding: '2px 7px', background: pal.paperAlt, letterSpacing: 0.3, textTransform: 'uppercase',
                }}>{p.area}</div>
              </div>
              <div style={{ fontFamily: type.mono, fontSize: 11, color: isUrgent && !isDone ? '#B45B47' : pal.ink3, marginBottom: 14 }}>
                due {p.due} · {p.done}/{p.tasks} tasks
              </div>

              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {Array.from({length: p.tasks}).map((_, j) => (
                  <div key={j} style={{
                    flex: 1, height: 4, background: j < p.done ? theme.accent : pal.rule,
                  }} />
                ))}
              </div>

              <div style={{
                padding: 12, background: pal.paperAlt, borderLeft: `2px solid ${isDone ? pal.ink4 : theme.accent}`,
              }}>
                <div style={{
                  fontFamily: type.mono, fontSize: 9, color: pal.ink3,
                  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
                }}>Next</div>
                <div style={{ fontFamily: type.body, fontSize: 13, color: pal.ink, marginBottom: 6 }}>{p.next}</div>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 12, color: pal.ink3, lineHeight: 1.4 }}>
                  "{p.note}"
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// People — relationship tracker
// ─────────────────────────────────────────────────────────────
function PeoplePage({ t, compact }) {
  const { pal, type, theme } = t;
  const people = [
    { name: 'Marguerite', rel: 'friend', last: '2 weeks ago', cadence: 'monthly', due: 'overdue', note: 'Check in after her move' },
    { name: 'Dad',        rel: 'family', last: '4 days ago',  cadence: 'weekly',  due: 'this week', note: 'Birthday on Apr 22' },
    { name: 'Dev',        rel: 'partner',last: 'yesterday',   cadence: 'daily',   due: 'ok',       note: 'Plan weekend hike' },
    { name: 'Sam',        rel: 'client', last: '1 week ago',  cadence: 'bi-weekly', due: 'this week', note: 'Aperture Q2 kickoff' },
    { name: 'Priya',      rel: 'friend', last: '3 weeks ago', cadence: 'monthly', due: 'overdue',  note: 'Lunch on Monday' },
    { name: 'Mom',        rel: 'family', last: '6 days ago',  cadence: 'weekly',  due: 'soon',     note: '—' },
    { name: 'Nate',       rel: 'friend', last: '2 months ago',cadence: 'quarterly', due: 'soon', note: 'He said he\'d moved' },
    { name: 'Jules',      rel: 'friend', last: '5 weeks ago', cadence: 'monthly', due: 'overdue', note: 'Owed her a book' },
  ];
  const dueColor = (d) => d === 'overdue' ? '#B45B47' : d === 'this week' ? theme.accent : pal.ink3;
  const relColor = (r) => ({
    family: theme.accent, partner: theme.accent, friend: pal.ink2, client: pal.ink3,
  }[r] || pal.ink3);

  return (
    <PageShell t={t} title="People" subtitle={`${people.filter(p=>p.due==='overdue').length} overdue · ${people.length} total`} compact={compact}
      action={<button style={{
        padding: '8px 14px', border: `1px solid ${pal.rule}`, background: pal.card, color: pal.ink,
        fontFamily: type.body, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}><Icon name="plus" size={12}/> Add person</button>}>

      <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard t={t} label="Overdue" big="3" sub="Marguerite, Priya, Jules" />
        <StatCard t={t} label="This week" big="2" sub="Dad, Sam" />
        <StatCard t={t} label="Streaks" big="4" sub="weekly with Dev" />
        <StatCard t={t} label="Last seen" big="Dev" sub="yesterday" />
      </div>

      <SectionTitle t={t}>Keep in touch</SectionTitle>
      <div style={{ border: `1px solid ${pal.rule}`, background: pal.card }}>
        {people.map((p, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14, alignItems: 'center',
            padding: '14px 18px',
            borderBottom: i === people.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: pal.paperAlt, border: `1px solid ${pal.rule}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: type.display, fontSize: 15, color: pal.ink2, fontStyle: 'italic',
              flexShrink: 0,
            }}>{p.name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <div style={{ fontFamily: type.body, fontSize: 14, color: pal.ink, fontWeight: 500 }}>{p.name}</div>
                <div style={{
                  fontFamily: type.mono, fontSize: 9, color: relColor(p.rel),
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>{p.rel}</div>
              </div>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 12, color: pal.ink3, marginTop: 2, lineHeight: 1.3 }}>
                {p.note}
              </div>
            </div>
            {!compact && (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: type.mono, fontSize: 10.5, color: pal.ink3 }}>{p.last}</div>
                <div style={{ fontFamily: type.mono, fontSize: 9, color: pal.ink4, marginTop: 2 }}>{p.cadence}</div>
              </div>
            )}
            <div style={{
              fontFamily: type.mono, fontSize: 9, color: dueColor(p.due),
              textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0, width: 70, textAlign: 'right',
            }}>{p.due}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Home — chores, plants, subscriptions
// ─────────────────────────────────────────────────────────────
function HomePage({ t, compact }) {
  const { pal, type, theme } = t;
  const chores = [
    { name: 'Laundry',         freq: 'Weekly',     last: '4 days ago',  next: 'Sat',  due: 'soon' },
    { name: 'Water plants',    freq: 'Every 3d',   last: 'Today',       next: 'Mon',  due: 'ok' },
    { name: 'Take out trash',  freq: 'Weekly',     last: '6 days ago',  next: 'Today',due: 'overdue' },
    { name: 'Clean bathroom',  freq: 'Weekly',     last: '3 days ago',  next: 'Sun',  due: 'soon' },
    { name: 'Vacuum',          freq: 'Bi-weekly',  last: '10 days ago', next: 'Sat',  due: 'soon' },
    { name: 'Wash sheets',     freq: 'Bi-weekly',  last: '8 days ago',  next: 'Sun',  due: 'soon' },
    { name: 'Deep clean kitchen', freq: 'Monthly', last: '3 weeks ago', next: 'Next Sat', due: 'ok' },
    { name: 'Defrost freezer', freq: 'Quarterly',  last: '2 months',    next: 'May 15', due: 'ok' },
  ];
  const plants = [
    { name: 'Monstera',       where: 'Living room', water: 'weekly',  last: '3d ago' },
    { name: 'Fiddle leaf',    where: 'Living room', water: 'weekly',  last: '3d ago' },
    { name: 'Pothos',         where: 'Bedroom',     water: '10d',     last: '5d ago' },
    { name: 'Snake plant',    where: 'Office',      water: '2w',      last: '1w ago' },
    { name: 'Basil',          where: 'Kitchen',     water: 'daily',   last: 'today' },
    { name: 'Calathea',       where: 'Bathroom',    water: 'weekly',  last: '4d ago' },
  ];
  const subs = [
    { name: 'Electricity',    amt: 87,  next: 'May 1' },
    { name: 'Internet',       amt: 65,  next: 'May 3' },
    { name: 'Streaming (3)',  amt: 42,  next: 'Apr 28' },
    { name: 'Groceries avg',  amt: 310, next: 'weekly' },
  ];
  const dueColor = (d) => d === 'overdue' ? '#B45B47' : d === 'soon' ? theme.accent : pal.ink3;

  return (
    <PageShell t={t} title="Home" subtitle="a small household, running quietly" compact={compact}>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '2fr 1fr', gap: 18 }}>
        <div>
          <SectionTitle t={t} right={
            <button style={{ border: 'none', background: 'transparent', color: pal.ink3, cursor: 'pointer', fontFamily: type.body, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="plus" size={12}/> add chore
            </button>
          }>Chores</SectionTitle>
          <div style={{ border: `1px solid ${pal.rule}`, background: pal.card }}>
            {chores.map((c, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 16px',
                borderBottom: i === chores.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
              }}>
                <button style={{
                  width: 16, height: 16, border: `1.5px solid ${dueColor(c.due)}`,
                  background: 'transparent', borderRadius: 2, padding: 0, cursor: 'pointer', flexShrink: 0,
                }} />
                <div style={{ flex: 1, fontFamily: type.body, fontSize: 13, color: pal.ink }}>{c.name}</div>
                <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4, width: 80 }}>{c.freq}</div>
                <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3, width: 80 }}>{c.last}</div>
                <div style={{
                  fontFamily: type.mono, fontSize: 9, color: dueColor(c.due),
                  textTransform: 'uppercase', letterSpacing: 0.5, width: 80, textAlign: 'right',
                }}>{c.due}</div>
              </div>
            ))}
          </div>

          <SectionTitle t={t}>Plants</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 10 }}>
            {plants.map((p, i) => (
              <div key={i} style={{ border: `1px solid ${pal.rule}`, background: pal.card, padding: 14 }}>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 14, color: pal.ink }}>{p.name}</div>
                <div style={{ fontFamily: type.mono, fontSize: 9.5, color: pal.ink4, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.4 }}>{p.where}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 10 }}>
                  <Icon name="droplet" size={11} style={{ color: theme.accent }}/>
                  <span style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3 }}>{p.water} · {p.last}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle t={t}>Subscriptions & bills</SectionTitle>
          <div style={{ border: `1px solid ${pal.rule}`, background: pal.card, padding: 4 }}>
            {subs.map((s, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '10px 14px',
                borderBottom: i === subs.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
              }}>
                <div>
                  <div style={{ fontFamily: type.body, fontSize: 13, color: pal.ink }}>{s.name}</div>
                  <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4, marginTop: 2 }}>{s.next}</div>
                </div>
                <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 16, color: pal.ink2 }}>${s.amt}</div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 16, padding: 18,
            border: `1px solid ${pal.rule}`, background: pal.paperAlt,
          }}>
            <SmallCaps color={pal.ink3} style={{ marginBottom: 8 }}>This month</SmallCaps>
            <div style={{ fontFamily: type.display, fontSize: 28, fontStyle: 'italic', color: pal.ink, lineHeight: 1 }}>
              $504
            </div>
            <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3, marginTop: 6 }}>
              recurring household · rent billed separately
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Health — wellness dashboard
// ─────────────────────────────────────────────────────────────
function HealthPage({ t, compact }) {
  const { pal, type, theme } = t;
  const sleep7 = [7.2, 6.8, 7.8, 7.1, 8.2, 6.4, 7.4];
  const steps7 = [4200, 6100, 3800, 7400, 5200, 2100, 3240];
  const moods7 = [7, 6, 8, 7, 9, 5, 7];

  return (
    <PageShell t={t} title="Health" subtitle="body, sleep, movement" compact={compact}>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14 }}>
        <StatCard t={t} label="Sleep avg" big="7.3h" sub="7-day · target 7.5" />
        <StatCard t={t} label="Mood avg"  big="7.0"  sub="out of 10" />
        <StatCard t={t} label="Steps"     big="32,040" sub="this week" />
        <StatCard t={t} label="Workouts"  big="3 / 4" sub="this week · Mon, Wed, Fri" />
      </div>

      <SectionTitle t={t}>Sleep · last 7 nights</SectionTitle>
      <div style={{ padding: 22, border: `1px solid ${pal.rule}`, background: pal.card }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
          {sleep7.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3 }}>{h}h</div>
              <div style={{
                width: '100%', height: `${(h / 10) * 100}%`,
                background: h >= 7 ? theme.accent : pal.ink3, opacity: h >= 7 ? 1 : 0.5,
              }} />
              <div style={{ fontFamily: type.mono, fontSize: 9, color: pal.ink4 }}>{'MTWTFSS'[i]}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${pal.rule}`, display: 'flex', justifyContent: 'space-between', fontFamily: type.mono, fontSize: 10, color: pal.ink3 }}>
          <span>bedtime avg · 23:18</span>
          <span>wake avg · 06:34</span>
          <span>quality · 78%</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: 18, marginTop: 22 }}>
        <div>
          <SectionTitle t={t}>Movement</SectionTitle>
          <div style={{ padding: 20, border: `1px solid ${pal.rule}`, background: pal.card }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
              {steps7.map((s, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%', height: `${(s / 8000) * 100}%`,
                    background: s >= 8000 ? theme.accent : pal.ink3, opacity: 0.7,
                  }} />
                  <div style={{ fontFamily: type.mono, fontSize: 9, color: pal.ink4 }}>{'MTWTFSS'[i]}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3, marginTop: 12 }}>
              daily goal · 8,000 steps
            </div>
          </div>
        </div>

        <div>
          <SectionTitle t={t}>Mood</SectionTitle>
          <div style={{ padding: 20, border: `1px solid ${pal.rule}`, background: pal.card }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
              {moods7.map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: theme.accent, opacity: m / 10,
                    marginBottom: `${(m / 10) * 80}px`,
                  }} />
                  <div style={{ fontFamily: type.mono, fontSize: 9, color: pal.ink4, marginTop: 'auto' }}>{'MTWTFSS'[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Finance page
// ─────────────────────────────────────────────────────────────
function FinancePage({ t, compact }) {
  const { pal, type, theme } = t;
  const f = FINANCE;
  const txs = [
    { date: 'Apr 18', label: 'Blue Bottle',        cat: 'Dining',    amt: -7.25 },
    { date: 'Apr 17', label: 'Trader Joe\'s',      cat: 'Groceries', amt: -84.12 },
    { date: 'Apr 16', label: 'Meridian Studio',    cat: 'Income',    amt: 1800 },
    { date: 'Apr 15', label: 'Muni fare',          cat: 'Transit',   amt: -2.50 },
    { date: 'Apr 14', label: 'Pharmacy',           cat: 'Health',    amt: -18.40 },
    { date: 'Apr 13', label: 'Rent',               cat: 'Rent',      amt: -1650 },
    { date: 'Apr 12', label: 'Farmers market',     cat: 'Groceries', amt: -42.80 },
    { date: 'Apr 11', label: 'Dinner at Tartine',  cat: 'Dining',    amt: -68.00 },
  ];

  return (
    <PageShell t={t} title="Finances" subtitle={`${f.month} 2026`} compact={compact}>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14 }}>
        <StatCard t={t} label="Income"   big={`$${f.income.toLocaleString()}`} sub="this month" />
        <StatCard t={t} label="Spent"    big={`$${f.spent.toLocaleString()}`} sub={`of $${f.budget.toLocaleString()}`} />
        <StatCard t={t} label="Saved"    big={`$${f.saved.toLocaleString()}`} trend="↗ 24% rate" />
        <StatCard t={t} label="Net worth" big="$48.2k" trend="↗ +$1.9k this mo" />
      </div>

      <SectionTitle t={t}>Budget by category</SectionTitle>
      <div style={{ padding: 20, border: `1px solid ${pal.rule}`, background: pal.card }}>
        {f.categories.map((c, i) => {
          const p = c.amount / c.of;
          return (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: type.body, fontSize: 13, color: pal.ink, marginBottom: 6 }}>
                <span>{c.name}</span>
                <span style={{ fontFamily: type.mono, fontSize: 11, color: pal.ink3 }}>
                  ${c.amount} <span style={{ color: pal.ink4 }}>/ ${c.of}</span>
                </span>
              </div>
              <div style={{ height: 4, background: pal.rule, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, right: `${(1 - Math.min(1, p)) * 100}%`, background: p > 0.9 ? '#B45B47' : theme.accent }} />
              </div>
            </div>
          );
        })}
      </div>

      <SectionTitle t={t}>Recent transactions</SectionTitle>
      <div style={{ border: `1px solid ${pal.rule}`, background: pal.card }}>
        {txs.map((tx, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14, alignItems: 'baseline',
            padding: '11px 16px',
            borderBottom: i === txs.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
          }}>
            <div style={{ width: 56, fontFamily: type.mono, fontSize: 10.5, color: pal.ink4 }}>{tx.date}</div>
            <div style={{ flex: 1, fontFamily: type.body, fontSize: 13, color: pal.ink }}>{tx.label}</div>
            <div style={{
              fontFamily: type.mono, fontSize: 9, color: pal.ink3,
              textTransform: 'uppercase', letterSpacing: 0.5, width: 80,
            }}>{tx.cat}</div>
            <div style={{
              fontFamily: type.mono, fontSize: 13, width: 80, textAlign: 'right',
              color: tx.amt > 0 ? theme.accent : pal.ink,
            }}>
              {tx.amt > 0 ? '+' : ''}${Math.abs(tx.amt).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Reading page
// ─────────────────────────────────────────────────────────────
function ReadingPage({ t, compact }) {
  const { pal, type, theme } = t;
  const current = READING.filter(r => r.status === 'reading');
  const done    = READING.filter(r => r.status === 'done');
  const queue   = READING.filter(r => r.status === 'queued');
  const shelf = [
    { title: 'Bluets', author: 'Maggie Nelson', year: 2009 },
    { title: 'Gilead', author: 'Marilynne Robinson', year: 2004 },
    { title: 'The Unbearable Lightness of Being', author: 'Milan Kundera', year: 1984 },
    { title: 'The Dispossessed', author: 'Ursula K. Le Guin', year: 1974 },
  ];

  const BookRow = ({ r, showProgress = true }) => (
    <div style={{
      display: 'flex', gap: 14, padding: '14px 0',
      borderBottom: `1px dashed ${pal.rule}`,
    }}>
      <div style={{
        width: 40, height: 58, background: pal.paperAlt,
        border: `1px solid ${pal.rule}`, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: type.display, fontStyle: 'italic', fontSize: 10, color: pal.ink3,
        writingMode: 'vertical-rl',
        padding: '6px 4px',
        overflow: 'hidden',
      }}>{r.title.slice(0, 18)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 15, color: pal.ink, lineHeight: 1.2 }}>{r.title}</div>
        <div style={{ fontFamily: type.body, fontSize: 12, color: pal.ink3, marginTop: 3 }}>{r.author}</div>
        {showProgress && r.status !== 'queued' && (
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 2, background: pal.rule, position: 'relative', marginBottom: 4 }}>
              <div style={{ position: 'absolute', inset: 0, right: `${100 - r.progress}%`, background: r.status === 'done' ? pal.complete : theme.accent }} />
            </div>
            <div style={{ fontFamily: type.mono, fontSize: 9.5, color: pal.ink4 }}>
              {r.status === 'done' ? 'finished' : `${r.progress}%`}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <PageShell t={t} title="Reading" subtitle={`${current.length} reading · ${queue.length} queued · ${done.length + 8} finished in 2026`} compact={compact}>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(3, 1fr)', gap: 22 }}>
        <div>
          <SectionTitle t={t}>Currently reading</SectionTitle>
          {current.map((r, i) => <BookRow key={i} r={r} />)}
        </div>
        <div>
          <SectionTitle t={t}>Next up</SectionTitle>
          {queue.map((r, i) => <BookRow key={i} r={r} />)}
          {shelf.map((r, i) => <BookRow key={i} r={{...r, status: 'queued'}} />)}
        </div>
        <div>
          <SectionTitle t={t}>Recently finished</SectionTitle>
          {done.map((r, i) => <BookRow key={i} r={r} />)}
          <div style={{
            marginTop: 22, padding: 18, background: pal.paperAlt, borderLeft: `2px solid ${theme.accent}`,
          }}>
            <SmallCaps color={pal.ink3} style={{ marginBottom: 8 }}>2026 goal</SmallCaps>
            <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, color: pal.ink, lineHeight: 1 }}>
              9 <span style={{ color: pal.ink3, fontSize: 14 }}>of 24</span>
            </div>
            <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3, marginTop: 6 }}>
              two books a month
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Meals — weekly plan + pantry
// ─────────────────────────────────────────────────────────────
function MealsPage({ t, compact }) {
  const { pal, type, theme } = t;
  const week = [
    { day: 'Mon', b: 'Oats + berries', l: 'Leftover soup', d: 'Sheet pan salmon', snack: 'Apple' },
    { day: 'Tue', b: 'Eggs on toast',  l: 'Grain bowl',    d: 'Pasta e fagioli',  snack: 'Nuts' },
    { day: 'Wed', b: 'Yogurt & nuts',  l: 'Out — café',    d: 'Roast chicken',    snack: 'Cheese' },
    { day: 'Thu', b: 'Smoothie',       l: 'Leftover chx',  d: 'Tacos',            snack: 'Fruit' },
    { day: 'Fri', b: 'Oats + berries', l: 'Grain bowl',    d: 'Pizza night',      snack: '—' },
    { day: 'Sat', b: 'Pancakes',       l: 'Sandwich',      d: 'Out — Tartine',    snack: '—' },
    { day: 'Sun', b: 'Eggs + greens',  l: 'Farmers mkt',   d: 'Meal prep night',  snack: '—' },
  ];
  const shopping = [
    'Salmon fillet (1lb)', 'Spinach', 'Sourdough', 'Eggs (dozen)',
    'Yogurt', 'Chicken thighs', 'Tomatoes (6)', 'Basil', 'Olive oil', 'Pasta',
  ];
  const pantry = {
    low: ['Olive oil', 'Rice', 'Coffee beans'],
    stocked: ['Canned tomatoes', 'Pasta', 'Lentils', 'Flour', 'Sugar', 'Salt', 'Oats'],
  };

  return (
    <PageShell t={t} title="Meals" subtitle="week of april 13" compact={compact}
      action={<button style={{
        padding: '8px 14px', border: `1px solid ${pal.rule}`, background: pal.card, color: pal.ink,
        fontFamily: type.body, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}><Icon name="sparkle" size={12}/> Plan next week</button>}>

      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '2fr 1fr', gap: 22 }}>
        <div>
          <SectionTitle t={t}>This week's plan</SectionTitle>
          <div style={{ border: `1px solid ${pal.rule}`, background: pal.card, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(3, 1fr)', borderBottom: `1px solid ${pal.rule}`, background: pal.paperAlt }}>
              <div />
              {['Breakfast','Lunch','Dinner'].map(h => (
                <div key={h} style={{
                  padding: '10px 12px',
                  fontFamily: type.mono, fontSize: 9.5, color: pal.ink3,
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>{h}</div>
              ))}
            </div>
            {week.map((d, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '60px repeat(3, 1fr)',
                borderBottom: i === week.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
                background: d.day === 'Sat' ? pal.paperAlt : 'transparent',
              }}>
                <div style={{
                  padding: '14px 12px',
                  fontFamily: type.display, fontStyle: 'italic', fontSize: 14,
                  color: d.day === 'Sat' ? theme.accent : pal.ink2,
                }}>{d.day}</div>
                <div style={{ padding: '14px 12px', fontFamily: type.body, fontSize: 12.5, color: pal.ink }}>{d.b}</div>
                <div style={{ padding: '14px 12px', fontFamily: type.body, fontSize: 12.5, color: pal.ink }}>{d.l}</div>
                <div style={{ padding: '14px 12px', fontFamily: type.body, fontSize: 12.5, color: pal.ink }}>{d.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle t={t}>Shopping list</SectionTitle>
          <div style={{ padding: 16, border: `1px solid ${pal.rule}`, background: pal.card }}>
            {shopping.map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0',
                borderBottom: i === shopping.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
              }}>
                <div style={{ width: 14, height: 14, border: `1.5px solid ${pal.ink3}`, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: type.body, fontSize: 12.5, color: pal.ink }}>{s}</span>
              </div>
            ))}
          </div>

          <SectionTitle t={t}>Pantry</SectionTitle>
          <div style={{ padding: 16, border: `1px solid ${pal.rule}`, background: pal.card }}>
            <SmallCaps color="#B45B47" style={{ marginBottom: 6 }}>Running low</SmallCaps>
            <div style={{ marginBottom: 14, fontFamily: type.body, fontSize: 12.5, color: pal.ink2, lineHeight: 1.6 }}>
              {pantry.low.join(' · ')}
            </div>
            <SmallCaps color={pal.ink3} style={{ marginBottom: 6 }}>Stocked</SmallCaps>
            <div style={{ fontFamily: type.body, fontSize: 12.5, color: pal.ink3, lineHeight: 1.6 }}>
              {pantry.stocked.join(' · ')}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Notes page — richer list with search
// ─────────────────────────────────────────────────────────────
function NotesPage({ t, compact }) {
  const { pal, type, theme } = t;
  const notes = [
    { title: 'Proposal outline — Chen', snippet: 'Lead with the diagnostic, not the methodology. They care about outcomes, not our process. Three sections: the situation, the opportunity, the path.', date: 'Apr 16', tag: 'work' },
    { title: 'Seeds for spring garden', snippet: 'Tomato (San Marzano, Brandywine), basil, shishito, calendula for bees. Start indoors April, move out after last frost.', date: 'Apr 12', tag: 'home' },
    { title: 'Things Dev said',          snippet: '"The antidote to anxiety is specificity." Also: "You can rest without earning it." Worth sitting with.', date: 'Apr 9',  tag: 'journal' },
    { title: 'Studio website principles', snippet: 'Quiet, not empty. Generous whitespace. Let the work breathe. No hover tricks. One serif, one mono, one weight.', date: 'Apr 7', tag: 'work' },
    { title: 'Books that changed me',    snippet: 'Gilead. The Creative Act. Four Thousand Weeks. A Pattern Language. Bluets. Not a list, a constellation.', date: 'Apr 3', tag: 'journal' },
    { title: 'Meal prep rhythms',        snippet: 'Sunday: grains, roasted veg, one protein. Wednesday: reset. Don\'t overcomplicate. Leftovers are a gift.', date: 'Mar 29', tag: 'home' },
  ];
  const tagColor = (x) => ({ work: theme.accent, home: pal.ink3, journal: pal.ink2 }[x] || pal.ink3);

  return (
    <PageShell t={t} title="Notes" subtitle="thinking, quietly" compact={compact}
      action={<button style={{
        padding: '8px 14px', border: `1px solid ${pal.ink}`, background: pal.ink, color: pal.paper,
        fontFamily: type.body, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}><Icon name="pen" size={12}/> New note</button>}>

      <div style={{
        display: 'flex', gap: 10, alignItems: 'center',
        border: `1px solid ${pal.rule}`, background: pal.card, padding: '10px 14px', marginBottom: 18,
      }}>
        <Icon name="search" size={14} style={{ color: pal.ink3 }} />
        <input placeholder="Search your notes…" style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: type.body, fontSize: 13, color: pal.ink,
        }} />
        <div style={{ display: 'flex', gap: 4 }}>
          {['all','work','home','journal'].map(tg => (
            <button key={tg} style={{
              border: 'none', background: tg === 'all' ? pal.paperAlt : 'transparent',
              color: pal.ink3, padding: '4px 9px', fontFamily: type.mono, fontSize: 9.5,
              textTransform: 'uppercase', letterSpacing: 0.5, cursor: 'pointer', borderRadius: 2,
            }}>{tg}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(2, 1fr)', gap: 14 }}>
        {notes.map((n, i) => (
          <div key={i} style={{
            padding: 20, border: `1px solid ${pal.rule}`, background: pal.card,
            cursor: 'pointer', transition: 'background 0.15s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 17, color: pal.ink, lineHeight: 1.2 }}>{n.title}</div>
            </div>
            <div style={{ fontFamily: type.body, fontSize: 13, color: pal.ink2, lineHeight: 1.6, marginBottom: 12 }}>
              {n.snippet}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                fontFamily: type.mono, fontSize: 9, color: tagColor(n.tag),
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>{n.tag}</div>
              <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4 }}>{n.date}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Habits page — expanded view
// ─────────────────────────────────────────────────────────────
function HabitsPage({ t, compact }) {
  const { pal, type, theme } = t;
  const habits = [
    { name: 'Morning pages', streak: 23, best: 45, rate: 0.82, icon: 'pen',
      month: [1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1] },
    { name: 'Move 30 min',   streak: 5,  best: 18, rate: 0.64, icon: 'run',
      month: [1,0,1,1,1,1,0,0,1,1,0,1,1,0,1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,1] },
    { name: 'Read',          streak: 41, best: 41, rate: 0.95, icon: 'book',
      month: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] },
    { name: 'No phone before 9', streak: 8, best: 14, rate: 0.70, icon: 'moon',
      month: [1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1] },
    { name: 'Meditate',      streak: 12, best: 28, rate: 0.78, icon: 'circle',
      month: [1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1] },
  ];

  return (
    <PageShell t={t} title="Habits" subtitle="practices, not resolutions" compact={compact}
      action={<button style={{
        padding: '8px 14px', border: `1px solid ${pal.rule}`, background: pal.card, color: pal.ink,
        fontFamily: type.body, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}><Icon name="plus" size={12}/> Add habit</button>}>

      <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <StatCard t={t} label="Longest streak" big="41d" sub="Read" />
        <StatCard t={t} label="Current" big="5" sub="active streaks" />
        <StatCard t={t} label="This month" big="78%" sub="completion rate" />
        <StatCard t={t} label="Days perfect" big="12 / 30" sub="all habits done" />
      </div>

      <SectionTitle t={t}>April · by habit</SectionTitle>
      <div style={{ border: `1px solid ${pal.rule}`, background: pal.card, padding: 18 }}>
        {habits.map((h, i) => (
          <div key={i} style={{
            padding: '14px 0',
            borderBottom: i === habits.length - 1 ? 'none' : `1px dashed ${pal.rule}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
              <Icon name={h.icon} size={14} style={{ color: pal.ink3 }} />
              <div style={{ flex: 1, fontFamily: type.body, fontSize: 14, color: pal.ink, fontWeight: 500 }}>{h.name}</div>
              <div style={{ fontFamily: type.mono, fontSize: 10, color: theme.accent }}>streak {h.streak}d</div>
              <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink4 }}>best {h.best}d</div>
              <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3 }}>{Math.round(h.rate * 100)}%</div>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {h.month.map((d, j) => (
                <div key={j} style={{
                  flex: 1, aspectRatio: '1', minWidth: 8, maxWidth: 16,
                  background: d ? theme.accent : pal.rule,
                  opacity: d ? (0.3 + (j / h.month.length) * 0.7) : 1,
                  borderRadius: 1,
                }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────
// Weekly review — reflection prompts
// ─────────────────────────────────────────────────────────────
function ReviewPage({ t, compact }) {
  const { pal, type, theme } = t;
  const prompts = [
    { q: 'What went well this week?',                    a: 'Landed the Aperture invoice early. Read two long essays. Cooked four nights out of seven.' },
    { q: 'What took more energy than expected?',          a: 'The Chen proposal framing. I kept rewriting the diagnostic.' },
    { q: 'Who did I see or miss?',                        a: 'Lunch with Dev was easy. Haven\'t called Marguerite in two weeks.' },
    { q: 'What do I want to carry into next week?',       a: 'Shorter mornings at the desk. Walks after lunch. Less context-switching.' },
    { q: 'One thing to set down?',                        a: 'The need to have the proposal feel clever. It just needs to be clear.' },
  ];
  const metrics = [
    { label: 'Tasks completed', big: '24', sub: 'of 31 planned' },
    { label: 'Deep work',       big: '18h', sub: 'across 6 sessions' },
    { label: 'Exercise',        big: '3', sub: 'of 4 planned' },
    { label: 'Sleep avg',       big: '7.3h', sub: 'target 7.5h' },
  ];

  return (
    <PageShell t={t} title="Weekly review" subtitle="april 13 – 19" compact={compact}
      action={<button style={{
        padding: '8px 14px', border: `1px solid ${pal.ink}`, background: pal.ink, color: pal.paper,
        fontFamily: type.body, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}><Icon name="check" size={12}/> Complete review</button>}>

      <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        {metrics.map((m, i) => <StatCard key={i} t={t} {...m} />)}
      </div>

      <SectionTitle t={t}>Reflection</SectionTitle>
      <div style={{ display: 'grid', gap: 14 }}>
        {prompts.map((p, i) => (
          <div key={i} style={{ padding: 22, border: `1px solid ${pal.rule}`, background: pal.card }}>
            <div style={{
              fontFamily: type.display, fontSize: 17, fontStyle: 'italic',
              color: pal.ink, marginBottom: 12, letterSpacing: -0.2,
            }}>{p.q}</div>
            <div style={{
              fontFamily: type.body, fontSize: 14, color: pal.ink2,
              lineHeight: 1.7, paddingLeft: 14, borderLeft: `2px solid ${theme.accentSoft}`,
            }}>{p.a}</div>
          </div>
        ))}

        <div style={{
          padding: 22, border: `1px solid ${pal.rule}`, background: pal.paperAlt,
          borderLeft: `3px solid ${theme.accent}`,
        }}>
          <SmallCaps color={theme.accent} style={{ marginBottom: 10 }}>Next week's anchor</SmallCaps>
          <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 22, color: pal.ink, lineHeight: 1.3 }}>
            Clear beats clever. Ship the Chen draft by Wednesday.
          </div>
        </div>
      </div>
    </PageShell>
  );
}

Object.assign(window, {
  UpcomingPage, SomedayPage, BusinessPage, ProjectsPage, PeoplePage,
  HomePage, HealthPage, FinancePage, ReadingPage, MealsPage,
  NotesPage, HabitsPage, ReviewPage,
});
