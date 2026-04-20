// Planner app — main shell that assembles widgets into a responsive dashboard

const { useState: useStateApp, useEffect: useEffectApp } = React;

function PlannerApp({ tweaks, containerWidth, frame }) {
  const t = useTheme(tweaks);
  const { pal, type, theme, dens } = t;
  const [demoMode, setDemoMode] = useStateApp(true);
  const [tasks, setTasks] = useStateApp(INITIAL_TASKS);
  const [quickAdd, setQuickAdd] = useStateApp('');
  const [view, setView] = useStateApp('Today');
  const [nav, setNav] = useStateApp('today');
  const [agentOpen, setAgentOpen] = useStateApp(false);

  const clearDemo = () => {
    setDemoMode(false);
    setTasks([]);
  };
  const restoreDemo = () => {
    setDemoMode(true);
    setTasks(INITIAL_TASKS);
  };

  const w = containerWidth || 1200;
  const isMobile = w < 500;
  const isTablet = w >= 500 && w < 900;
  const isDesktop = w >= 900;

  // columns for widget grid
  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  const onQuickAdd = (val, mode) => {
    if (mode === 'typing') { setQuickAdd(val); return; }
    if (mode === 'submit' && val.trim()) {
      const newTask = {
        id: 't' + Date.now(),
        text: val.replace(/\b(mon|tue|wed|thu|fri|sat|sun)\w*/i, '').replace(/\b(\d{1,2})(:\d{2})?\s?(am|pm)?\b/i, '').trim(),
        priority: 2, done: false, project: 'Inbox',
      };
      setTasks(prev => [newTask, ...prev]);
      setQuickAdd('');
    }
  };

  // Widgets to show based on tweaks + current view
  const widgets = [];
  if (view === 'Today') {
    if (tweaks.widgets.tasks)    widgets.push(<Tasks t={t} tasks={tasks} setTasks={setTasks} compact={isMobile} key="tasks" />);
    if (tweaks.widgets.schedule) widgets.push(<Schedule t={t} compact={isMobile} key="sched" />);
    if (tweaks.widgets.habits)   widgets.push(<Habits t={t} key="hab" />);
    if (tweaks.widgets.wellness) widgets.push(<Wellness t={t} key="wel" />);
    if (tweaks.widgets.business) widgets.push(<Business t={t} key="biz" />);
    if (tweaks.widgets.notes)    widgets.push(<Notes t={t} key="notes" />);
  } else if (view === 'All') {
    if (tweaks.widgets.tasks)    widgets.push(<Tasks t={t} tasks={tasks} setTasks={setTasks} compact={isMobile} key="tasks" />);
    if (tweaks.widgets.schedule) widgets.push(<Schedule t={t} compact={isMobile} key="sched" />);
    if (tweaks.widgets.habits)   widgets.push(<Habits t={t} key="hab" />);
    if (tweaks.widgets.wellness) widgets.push(<Wellness t={t} key="wel" />);
    if (tweaks.widgets.business) widgets.push(<Business t={t} key="biz" />);
    if (tweaks.widgets.projects) widgets.push(<Projects t={t} key="prj" />);
    if (tweaks.widgets.notes)    widgets.push(<Notes t={t} key="notes" />);
    if (tweaks.widgets.finance)  widgets.push(<Finance t={t} key="fin" />);
    if (tweaks.widgets.meals)    widgets.push(<Meals t={t} key="meals" />);
    if (tweaks.widgets.reading)  widgets.push(<Reading t={t} key="read" />);
    if (tweaks.widgets.people)   widgets.push(<People t={t} key="ppl" />);
    if (tweaks.widgets.home)     widgets.push(<Home t={t} key="home" />);
  }

  return (
    <div style={{
      width: '100%', height: '100%', background: pal.paper,
      fontFamily: type.body,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <PlannerHeader t={t} onQuickAdd={onQuickAdd} quickAdd={quickAdd} onView={setView} view={view} compact={isMobile} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar — desktop only */}
        {isDesktop && (
          <PlannerSidebar t={t} nav={nav} setNav={setNav} tasks={tasks} />
        )}

        {/* Main grid */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {renderMain({ t, view, nav, isDesktop, isMobile, cols, widgets, tasks, setTasks, demoMode, clearDemo, restoreDemo })}
          <PlannerFooter t={t} />
        </div>
      </div>

      {/* Mobile bottom nav */}
      {isMobile && <MobileNav t={t} nav={nav} setNav={setNav} />}

      {/* AI Agent */}
      {!agentOpen && <AIAgentButton t={t} onOpen={() => setAgentOpen(true)} />}
      {agentOpen && <AIAgentPanel t={t} tasks={tasks} onClose={() => setAgentOpen(false)} compact={isMobile} />}
    </div>
  );
}

function PlannerSidebar({ t, nav, setNav, tasks }) {
  const { pal, type, theme } = t;
  const sections = [
    { group: 'Plan', items: [
      { id: 'today',    label: 'Today',    icon: 'sparkle', count: tasks.filter(x=>!x.done).length },
      { id: 'week',     label: 'This week', icon: 'cal' },
      { id: 'upcoming', label: 'Upcoming', icon: 'arrow-r' },
      { id: 'someday',  label: 'Someday',  icon: 'moon' },
    ]},
    { group: 'Areas', items: [
      { id: 'business', label: 'Business', icon: 'briefcase' },
      { id: 'projects', label: 'Projects', icon: 'folder' },
      { id: 'people',   label: 'People',   icon: 'people' },
      { id: 'home',     label: 'Home',     icon: 'home' },
      { id: 'health',   label: 'Health',   icon: 'heart' },
      { id: 'finance',  label: 'Finances', icon: 'dollar' },
      { id: 'reading',  label: 'Reading',  icon: 'book' },
      { id: 'meals',    label: 'Meals',    icon: 'fork' },
    ]},
    { group: 'Team 1:1s', items: [
      { id: 'prof-services',   label: 'Professional Services', icon: 'briefcase' },
      { id: 'managed-services',label: 'Managed Services',      icon: 'circle' },
      { id: 'sales-ops',       label: 'Sales Operations',      icon: 'dollar' },
      { id: 'proj-coordinator',label: 'Project Coordinator',   icon: 'folder' },
      { id: 'sd-goals',        label: 'Service Delivery Goals',icon: 'sparkle' },
    ]},
    { group: 'Reflect', items: [
      { id: 'notes',   label: 'Notes',    icon: 'note' },
      { id: 'habits',  label: 'Habits',   icon: 'sparkle' },
      { id: 'review',  label: 'Weekly review', icon: 'pen' },
    ]},
    { group: 'System', items: [
      { id: 'settings', label: 'Settings', icon: 'circle' },
    ]},
  ];

  return (
    <div style={{
      width: 220, flexShrink: 0, overflow: 'auto',
      borderRight: `1px solid ${pal.rule}`,
      background: pal.paper,
      padding: '20px 0',
    }}>
      {sections.map((s, si) => (
        <div key={si} style={{ marginBottom: 20 }}>
          <SmallCaps color={pal.ink4} style={{ padding: '0 20px', marginBottom: 8 }}>
            {s.group}
          </SmallCaps>
          {s.items.map(it => {
            const active = nav === it.id;
            return (
              <button key={it.id} onClick={() => setNav(it.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '7px 20px',
                border: 'none', background: 'transparent',
                color: active ? pal.ink : pal.ink2,
                cursor: 'pointer', textAlign: 'left',
                fontFamily: type.body, fontSize: 13,
                position: 'relative',
              }}>
                {active && (
                  <div style={{
                    position: 'absolute', left: 0, top: 6, bottom: 6, width: 2,
                    background: theme.accent,
                  }} />
                )}
                <Icon name={it.icon} size={14} style={{ color: active ? theme.accent : pal.ink3 }} />
                <span style={{ flex: 1, fontWeight: active ? 500 : 400 }}>{it.label}</span>
                {it.count !== undefined && (
                  <span style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3 }}>{it.count}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function PlannerFooter({ t }) {
  const { pal, type } = t;
  return (
    <div style={{
      padding: '20px 24px 28px', borderTop: `1px solid ${pal.rule}`,
      marginTop: 24,
      fontFamily: type.mono, fontSize: 10, color: pal.ink4,
      display: 'flex', justifyContent: 'space-between', letterSpacing: 0.3,
    }}>
      <span>— end of page —</span>
      <span>pg. 108 of 365 · 2026</span>
    </div>
  );
}

function MobileNav({ t, nav, setNav }) {
  const { pal, type, theme } = t;
  const items = [
    { id: 'today', label: 'Today', icon: 'sparkle' },
    { id: 'week',  label: 'Week',  icon: 'cal' },
    { id: 'areas', label: 'Areas', icon: 'folder' },
    { id: 'notes', label: 'Notes', icon: 'note' },
    { id: 'settings', label: 'Settings', icon: 'circle' },
  ];
  return (
    <div style={{
      display: 'flex', borderTop: `1px solid ${pal.rule}`,
      background: pal.paper, flexShrink: 0,
      paddingBottom: 20,
    }}>
      {items.map(it => {
        const active = nav === it.id;
        return (
          <button key={it.id} onClick={() => setNav(it.id)} style={{
            flex: 1, border: 'none', background: 'transparent',
            padding: '10px 4px 8px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: active ? theme.accent : pal.ink3,
            cursor: 'pointer', fontFamily: type.body, fontSize: 10,
            letterSpacing: 0.3,
          }}>
            <Icon name={it.icon} size={18} />
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Route sidebar/nav selection to the right main content
function renderMain({ t, view, nav, isDesktop, isMobile, cols, widgets, tasks, setTasks, demoMode, clearDemo, restoreDemo }) {
  const compactMain = !isDesktop;
  if (nav === 'settings') return <SettingsPage t={t} compact={compactMain} demoMode={demoMode} onClearDemo={clearDemo} onRestoreDemo={restoreDemo} />;
  // On mobile, nav comes from the bottom bar
  if (!demoMode) {
    const emptyMap = {
      upcoming: { title: 'No upcoming events', body: 'Add an event or deadline and it will appear here.' },
      someday:  { title: 'Your Someday list is empty', body: 'Capture ideas, maybes, and things you’re waiting on.' },
      business: { title: 'No business data yet', body: 'Add clients and invoices to see MRR and outstanding balances.' },
      projects: { title: 'No projects yet', body: 'Start a project to track its progress, tasks, and next step.' },
      people:   { title: 'No contacts tracked', body: 'Add the people you want to stay in touch with.' },
      home:     { title: 'No chores or plants set up', body: 'Add recurring household tasks and Anchor will remind you when they’re due.' },
      health:   { title: 'No health data', body: 'Log sleep, movement, and mood to see trends.' },
      finance:  { title: 'No financial data', body: 'Set a budget and log transactions to see where your money goes.' },
      reading:  { title: 'Your reading list is empty', body: 'Add books you’re reading, queued, or finished.' },
      meals:    { title: 'No meal plan yet', body: 'Plan a week of meals and build your shopping list.' },
      notes:    { title: 'No notes yet', body: 'Capture ideas, observations, and things worth keeping.' },
      habits:   { title: 'No habits yet', body: 'Pick a practice and start a streak.' },
      review:   { title: 'No reviews yet', body: 'At the end of the week, reflect on what worked.' },
    };
    if (emptyMap[nav]) {
      return (
        <PageShell t={t} title={nav.charAt(0).toUpperCase() + nav.slice(1)} compact={compactMain}>
          <EmptyState t={t} title={emptyMap[nav].title} body={emptyMap[nav].body} />
        </PageShell>
      );
    }
  }
  // On mobile, nav comes from the bottom bar
  if (isMobile) {
    if (nav === 'week')  return <WeekView t={t} tasks={tasks} setTasks={setTasks} compact={true} />;
    if (nav === 'areas') return <AreasIndex t={t} setNav={() => {}} compact={true} />;
    if (nav === 'notes') return <NotesPage t={t} compact={true} />;
    // default: today grid
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 12, padding: 14 }}>
        {widgets}
      </div>
    );
  }
  // Desktop / iPad: respect view switcher when on "today", else follow sidebar nav
  if (nav === 'today' || nav === 'week' || nav === 'upcoming' || nav === 'someday') {
    if (view === 'Week' || nav === 'week')   return <WeekView t={t} tasks={tasks} setTasks={setTasks} compact={false} />;
    if (view === 'Month')                     return <MonthView t={t} tasks={tasks} compact={false} />;
    if (nav === 'upcoming')                   return <UpcomingPage t={t} compact={false} />;
    if (nav === 'someday')                    return <SomedayPage t={t} compact={false} />;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 16, padding: 24 }}>
        {widgets}
      </div>
    );
  }
  const compact = !isDesktop;
  if (nav === 'business') return <BusinessPage t={t} compact={compact} />;
  if (nav === 'projects') return <ProjectsPage t={t} compact={compact} />;
  if (nav === 'people')   return <PeoplePage t={t} compact={compact} />;
  if (nav === 'home')     return <HomePage t={t} compact={compact} />;
  if (nav === 'health')   return <HealthPage t={t} compact={compact} />;
  if (nav === 'finance')  return <FinancePage t={t} compact={compact} />;
  if (nav === 'reading')  return <ReadingPage t={t} compact={compact} />;
  if (nav === 'meals')    return <MealsPage t={t} compact={compact} />;
  if (nav === 'notes')    return <NotesPage t={t} compact={compact} />;
  if (nav === 'habits')   return <HabitsPage t={t} compact={compact} />;
  if (nav === 'review')   return <ReviewPage t={t} compact={compact} />;
  if (nav === 'prof-services')    return <ProfessionalServicesPage t={t} compact={compact} />;
  if (nav === 'managed-services') return <ManagedServicesPage t={t} compact={compact} />;
  if (nav === 'sales-ops')        return <SalesOperationsPage t={t} compact={compact} />;
  if (nav === 'proj-coordinator') return <ProjectCoordinatorPage t={t} compact={compact} />;
  if (nav === 'sd-goals')         return <ServiceDeliveryGoalsPage t={t} compact={compact} />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 16, padding: 24 }}>
      {widgets}
    </div>
  );
}

function AreasIndex({ t, compact }) {
  const { pal, type } = t;
  return (
    <div style={{ padding: 20 }}>
      <div style={{ fontFamily: type.display, fontStyle: 'italic', fontSize: 26, color: pal.ink, marginBottom: 14 }}>Areas</div>
      <div style={{ fontFamily: type.mono, fontSize: 10, color: pal.ink3 }}>open on desktop for full views</div>
    </div>
  );
}

window.PlannerApp = PlannerApp;
window.renderMain = renderMain;
