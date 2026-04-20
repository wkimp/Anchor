// Shared state, design tokens, and mock data for the planner.

// ─────────────────────────────────────────────────────────────
// Tweakable defaults (editable via Tweaks panel)
// ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "ochre",
  "typeface": "newsreader",
  "mode": "light",
  "density": "spacious",
  "widgets": {
    "tasks": true,
    "schedule": true,
    "habits": true,
    "wellness": true,
    "notes": true,
    "finance": true,
    "meals": true,
    "reading": true,
    "projects": true,
    "people": true,
    "home": true,
    "business": true
  }
}/*EDITMODE-END*/;

// Theme palettes — all share chroma/lightness, vary hue (oklch-derived hex)
const THEMES = {
  ochre:    { accent: '#B0763A', accentSoft: '#E8D7BE', name: 'Ochre' },
  olive:    { accent: '#6B7A3A', accentSoft: '#DBE0C4', name: 'Olive' },
  terracotta:{ accent: '#B45B47', accentSoft: '#ECC9BD', name: 'Terracotta' },
  ink:      { accent: '#3A4A6B', accentSoft: '#C4D0E0', name: 'Ink' },
  plum:     { accent: '#7A4A6B', accentSoft: '#E0C4D4', name: 'Plum' },
};

const TYPEFACES = {
  newsreader: { display: '"Newsreader", Georgia, serif', body: '"Inter", system-ui, sans-serif', mono: '"JT Mono", "IBM Plex Mono", monospace' },
  spectral:   { display: '"Spectral", Georgia, serif', body: '"Inter", system-ui, sans-serif', mono: '"JT Mono", monospace' },
  sans:       { display: '"Inter", system-ui, sans-serif', body: '"Inter", system-ui, sans-serif', mono: '"JT Mono", monospace' },
};

// Light/Dark palette (paper-planner feel)
const PALETTE = {
  light: {
    paper:    '#F5F1E8',
    paperAlt: '#EDE7D8',
    card:     '#FBF8F1',
    ink:      '#1C1A15',
    ink2:     '#3D3A32',
    ink3:     '#706A5C',
    ink4:     '#9A9484',
    rule:     '#D9D2C0',
    rule2:    '#E5DFCD',
    check:    '#1C1A15',
    complete: '#9A9484',
  },
  dark: {
    paper:    '#17161A',
    paperAlt: '#1E1C20',
    card:     '#212025',
    ink:      '#F0EDE4',
    ink2:     '#C9C5BA',
    ink3:     '#8A8578',
    ink4:     '#5A574F',
    rule:     '#2E2C30',
    rule2:    '#35333A',
    check:    '#F0EDE4',
    complete: '#5A574F',
  },
};

// ─────────────────────────────────────────────────────────────
// Mock data — realistic, no slop
// ─────────────────────────────────────────────────────────────

const todayISO = '2026-04-18'; // static for prototype

const INITIAL_TASKS = [
  { id: 't1', text: 'Send Q1 invoice to Aperture Co.', priority: 1, done: false, project: 'Business', time: '9:30' },
  { id: 't2', text: 'Review pull requests', priority: 2, done: true, project: 'Work' },
  { id: 't3', text: 'Call dentist to reschedule', priority: 1, done: false, project: 'Health' },
  { id: 't4', text: 'Water the monstera & fiddle leaf', priority: 3, done: false, project: 'Home' },
  { id: 't5', text: 'Draft proposal — Chen foundation', priority: 1, done: false, project: 'Business', time: '14:00' },
  { id: 't6', text: 'Reply to Marguerite\'s email', priority: 2, done: false, project: 'People' },
  { id: 't7', text: 'Pick up dry cleaning', priority: 3, done: false, project: 'Home' },
  { id: 't8', text: 'Read chapter 4 — "Slouching Towards Bethlehem"', priority: 3, done: false, project: 'Reading' },
];

const SCHEDULE = [
  { id: 's1', title: 'Morning pages', start: 7,    end: 7.5,  kind: 'ritual' },
  { id: 's2', title: 'Deep work — Chen proposal', start: 9,  end: 11,   kind: 'focus' },
  { id: 's3', title: 'Stand-up',    start: 11,    end: 11.5, kind: 'meeting' },
  { id: 's4', title: 'Lunch w/ Dev', start: 12.5, end: 13.5, kind: 'personal' },
  { id: 's5', title: 'Client call — Aperture', start: 14,  end: 15,   kind: 'meeting' },
  { id: 's6', title: 'Gym',         start: 17,    end: 18,   kind: 'wellness' },
  { id: 's7', title: 'Dinner & reading', start: 19, end: 21, kind: 'personal' },
];

const HABITS = [
  { id: 'h1', name: 'Morning pages', streak: 23, done: [1,1,1,1,1,0,1], icon: 'pen' },
  { id: 'h2', name: 'Move 30 min',   streak: 5,  done: [1,0,1,1,1,1,0], icon: 'run' },
  { id: 'h3', name: 'Read',          streak: 41, done: [1,1,1,1,1,1,1], icon: 'book' },
  { id: 'h4', name: 'No phone before 9', streak: 8, done: [1,1,0,1,1,1,0], icon: 'moon' },
  { id: 'h5', name: 'Meditate',      streak: 12, done: [1,1,1,0,1,1,1], icon: 'circle' },
];

const WELLNESS = {
  sleep: { hours: 7.4, quality: 82, bedtime: '23:14', wake: '06:38' },
  water: { cups: 4, goal: 8 },
  steps: { count: 3240, goal: 8000 },
  mood:  { score: 7, note: 'steady' },
};

const NOTES = [
  { id: 'n1', title: 'Proposal outline — Chen', snippet: 'Lead with the diagnostic, not the methodology. They care about outcomes, not our process…', date: 'Apr 16', tag: 'work' },
  { id: 'n2', title: 'Seeds for spring garden',  snippet: 'Tomato (San Marzano, Brandywine), basil, shishito, calendula for bees…', date: 'Apr 12', tag: 'home' },
  { id: 'n3', title: 'Things Dev said',          snippet: '"The antidote to anxiety is specificity." — worth sitting with.', date: 'Apr 9',  tag: 'journal' },
];

const FINANCE = {
  month: 'April',
  spent: 2847,
  budget: 4200,
  categories: [
    { name: 'Rent',      amount: 1650, of: 1650 },
    { name: 'Groceries', amount: 312,  of: 500 },
    { name: 'Dining',    amount: 189,  of: 250 },
    { name: 'Transit',   amount: 84,   of: 150 },
    { name: 'Business',  amount: 412,  of: 800 },
    { name: 'Other',     amount: 200,  of: 850 },
  ],
  income: 5800,
  saved: 1400,
};

const MEALS = [
  { day: 'Mon', breakfast: 'Oats + berries', lunch: 'Leftover soup', dinner: 'Sheet pan salmon' },
  { day: 'Tue', breakfast: 'Eggs on toast',  lunch: 'Grain bowl',    dinner: 'Pasta e fagioli' },
  { day: 'Wed', breakfast: 'Yogurt & nuts',  lunch: 'Out — café',    dinner: 'Roast chicken' },
  { day: 'Thu', breakfast: 'Smoothie',       lunch: 'Leftover chx',  dinner: 'Tacos' },
  { day: 'Fri', breakfast: 'Oats + berries', lunch: 'Grain bowl',    dinner: 'Pizza night' },
];

const READING = [
  { title: 'Slouching Towards Bethlehem', author: 'Joan Didion', progress: 62, status: 'reading' },
  { title: 'The Creative Act',            author: 'Rick Rubin',  progress: 100, status: 'done' },
  { title: 'A Pattern Language',          author: 'Christopher Alexander', progress: 14, status: 'reading' },
  { title: 'Four Thousand Weeks',         author: 'Oliver Burkeman', progress: 0,  status: 'queued' },
];

const PROJECTS = [
  { name: 'Chen proposal',    due: 'Apr 24', progress: 45, tasks: 7,  done: 3 },
  { name: 'Studio website',   due: 'May 12', progress: 20, tasks: 14, done: 3 },
  { name: 'Spring garden',    due: 'Ongoing', progress: 70, tasks: 5,  done: 4 },
  { name: 'Tax filing',       due: 'Apr 15', progress: 100, tasks: 4, done: 4 },
];

const PEOPLE = [
  { name: 'Marguerite',  last: '2 weeks ago', due: 'overdue',  relation: 'friend' },
  { name: 'Dad',         last: '4 days ago',  due: 'this week', relation: 'family' },
  { name: 'Dev',         last: 'yesterday',   due: 'ok',       relation: 'partner' },
  { name: 'Sam at Aperture', last: '1 week',  due: 'this week', relation: 'client' },
];

const HOME = [
  { chore: 'Laundry',       freq: 'Weekly',  last: '4 days ago', due: 'soon' },
  { chore: 'Water plants',  freq: 'Every 3d',last: 'Today',      due: 'ok' },
  { chore: 'Take out trash',freq: 'Weekly',  last: '6 days ago', due: 'overdue' },
  { chore: 'Clean bathroom',freq: 'Weekly',  last: '3 days ago', due: 'soon' },
];

const BUSINESS = {
  mrr: 8400,
  lastMonth: 7950,
  clients: 6,
  invoicesOutstanding: 2,
  nextInvoice: 'Aperture Co. — $4,200',
};

const TEAM_1O1_DATA = {
  'professional-services': {
    name: 'Professional Services',
    manager: 'with Jordan Lee',
    nextMeeting: 'Mon Apr 21',
    lastMeeting: 'Apr 14',
    lastMeetingDate: '1 week ago',
    teamSize: 6,
    agenda: [
      { topic: 'Q2 project pipeline review', context: 'Three new SOWs in progress — need resource allocation clarity.', owner: 'You', priority: 'high' },
      { topic: 'Escalation: Meridian onboarding delay', context: 'Client citing unclear handoff from Sales. Discuss remediation.', owner: 'Jordan', priority: 'high' },
      { topic: 'PS team capacity for May', context: 'Confirm bandwidth before committing two new projects.', owner: 'You', priority: 'medium' },
      { topic: 'Training: new implementation methodology', context: 'Roll out to team by end of month.', owner: 'Jordan', priority: 'medium' },
      { topic: '1:1 check-in — career goals', context: null, owner: 'Jordan', priority: 'low' },
    ],
    notes: [
      {
        date: 'April 14, 2026',
        content: 'Discussed Meridian onboarding — root cause is gap in sales-to-PS handoff doc. Jordan will work with Sales Ops to create a standard handoff template. Capacity for May looks tight with two new projects landing; we agreed to flag if a third comes in. Jordan shared interest in moving toward a senior role — want to revisit in Q3 review.',
        keyPoints: [
          'Handoff template: Jordan + Sales Ops by Apr 28',
          'May capacity ceiling: 2 projects max without headcount',
          'Career growth conversation queued for Q3',
        ],
      },
      {
        date: 'April 7, 2026',
        content: 'Reviewed Q1 close — PS delivered 3 of 4 projects on time. Chen Foundation kicked off; early engagement positive. Team morale good but headcount pressure starting to show. Discussed adding a contractor for Q2.',
        keyPoints: [
          'Q1: 3/4 projects on time, 1 delayed by scope creep',
          'Chen Foundation kicked off — strong start',
          'Contractor option: revisit budget in May',
        ],
      },
    ],
    actionItems: [
      { task: 'Create sales-to-PS handoff template', owner: 'Jordan', due: 'Apr 28', status: 'in-progress', context: 'Coordinate with Sales Ops' },
      { task: 'Resource plan for May — 2 new projects', owner: 'You', due: 'Apr 22', status: 'open', context: null },
      { task: 'Schedule new methodology training session', owner: 'Jordan', due: 'Apr 30', status: 'open', context: 'Full team, 90 min block' },
      { task: 'Follow up with Meridian client re: timeline', owner: 'You', due: 'Apr 21', status: 'open', context: null },
      { task: 'Q1 retrospective doc', owner: 'Jordan', due: 'Apr 10', status: 'done', context: null },
      { task: 'Contractor research for Q2', owner: 'You', due: 'Apr 14', status: 'done', context: null },
    ],
    history: [
      { date: 'Apr 14, 2026', duration: '45 min', summary: 'Meridian escalation, May capacity planning, career check-in with Jordan.', completedActions: 2 },
      { date: 'Apr 7, 2026',  duration: '50 min', summary: 'Q1 close review, Chen Foundation kickoff, headcount discussion.', completedActions: 3 },
      { date: 'Mar 31, 2026', duration: '40 min', summary: 'Pipeline update, training needs assessment, team morale.', completedActions: 1 },
      { date: 'Mar 24, 2026', duration: '45 min', summary: 'Q1 forecast vs actuals, scope creep discussion on Project Voss.', completedActions: 4 },
    ],
  },
  'managed-services': {
    name: 'Managed Services',
    manager: 'with Priya Mehta',
    nextMeeting: 'Tue Apr 22',
    lastMeeting: 'Apr 15',
    lastMeetingDate: '1 week ago',
    teamSize: 8,
    agenda: [
      { topic: 'SLA scorecard — April mid-month', context: 'Two clients under 95% SLA. Need root cause and remediation plan.', owner: 'Priya', priority: 'high' },
      { topic: 'NOC staffing for holiday coverage', context: 'Memorial Day weekend — need 24/7 coverage plan.', owner: 'You', priority: 'high' },
      { topic: 'Client churn risk: Holtz account', context: 'Usage down 40%, last invoice question unanswered.', owner: 'Priya', priority: 'high' },
      { topic: 'Tooling: upgrade to monitoring v3.2', context: 'Planned for Q2 — confirm test window.', owner: 'Priya', priority: 'medium' },
      { topic: 'Team recognition — April wins', context: null, owner: 'You', priority: 'low' },
    ],
    notes: [
      {
        date: 'April 15, 2026',
        content: 'SLA misses traced to overnight alert fatigue — team missing P2 tickets after midnight. Priya proposing rotating on-call schedule upgrade. Holtz account flagged as churn risk; Priya will set up a QBR. Monitoring upgrade planned for last weekend of April.',
        keyPoints: [
          'SLA fix: rotating on-call + alert triaging by priority',
          'Holtz QBR: Priya scheduling for Apr 25',
          'Monitoring v3.2: test window Apr 26–27',
        ],
      },
      {
        date: 'April 8, 2026',
        content: 'Reviewed March SLA performance — 97.8% overall, above target. Aperture Co. flagged a slow dashboard bug; engineering on it. Discussed adding a self-service portal to reduce L1 ticket volume.',
        keyPoints: [
          'March SLA: 97.8% — above 97% target',
          'Aperture dashboard bug: eng ticket open, ETA Apr 12',
          'Self-service portal: research phase, report back in 2 weeks',
        ],
      },
    ],
    actionItems: [
      { task: 'Redesign on-call rotation schedule', owner: 'Priya', due: 'Apr 22', status: 'in-progress', context: 'Address overnight SLA gaps' },
      { task: 'Schedule Holtz QBR', owner: 'Priya', due: 'Apr 25', status: 'open', context: null },
      { task: 'Holiday coverage plan — Memorial Day', owner: 'You', due: 'Apr 30', status: 'open', context: '24/7 NOC staffing' },
      { task: 'Monitoring upgrade test plan', owner: 'Priya', due: 'Apr 24', status: 'open', context: 'Window: Apr 26–27' },
      { task: 'Self-service portal requirements doc', owner: 'Priya', due: 'Apr 22', status: 'in-progress', context: null },
      { task: 'March SLA report to leadership', owner: 'You', due: 'Apr 10', status: 'done', context: null },
    ],
    history: [
      { date: 'Apr 15, 2026', duration: '45 min', summary: 'SLA miss root cause, Holtz churn risk, monitoring upgrade timeline.', completedActions: 1 },
      { date: 'Apr 8, 2026',  duration: '40 min', summary: 'March SLA review, Aperture bug, self-service portal scoping.', completedActions: 2 },
      { date: 'Apr 1, 2026',  duration: '50 min', summary: 'Q1 review, team capacity, tooling roadmap alignment.', completedActions: 3 },
      { date: 'Mar 25, 2026', duration: '45 min', summary: 'Incident debrief — P1 outage, process gaps, response time improvements.', completedActions: 4 },
    ],
  },
  'sales-operations': {
    name: 'Sales Operations',
    manager: 'with Marcus Webb',
    nextMeeting: 'Wed Apr 23',
    lastMeeting: 'Apr 16',
    lastMeetingDate: '5 days ago',
    teamSize: 4,
    agenda: [
      { topic: 'CRM data quality initiative', context: 'Q2 goal: 95% field completeness. Currently at 78%.', owner: 'Marcus', priority: 'high' },
      { topic: 'Q2 sales forecast accuracy', context: 'Last quarter forecast was 22% off. Process review needed.', owner: 'You', priority: 'high' },
      { topic: 'Commission structure update', context: 'New plan effective May 1 — comms plan for reps?', owner: 'Marcus', priority: 'medium' },
      { topic: 'Contract renewal pipeline', context: 'Four renewals due in June. Early outreach strategy.', owner: 'Marcus', priority: 'medium' },
      { topic: 'Sales enablement material refresh', context: 'Case studies outdated. Prioritize PS and MS use cases.', owner: 'You', priority: 'low' },
    ],
    notes: [
      {
        date: 'April 16, 2026',
        content: 'CRM completeness gap traced to reps skipping the "Deal Context" field — Marcus adding it to required fields and briefing team. Forecast accuracy discussion revealed pipeline hygiene issue; agreed to weekly forecast review cadence. Commission structure change needs clear comms — Marcus drafting FAQ doc.',
        keyPoints: [
          'CRM fix: "Deal Context" field now required effective Apr 21',
          'Weekly forecast review: Mondays, Marcus + You',
          'Commission FAQ doc: Marcus by Apr 23',
        ],
      },
      {
        date: 'April 9, 2026',
        content: 'Reviewed Q1 pipeline — strong inbound but conversion rate dipped to 28% (target 35%). Three deals pushed to Q2. Marcus identified follow-up gap in mid-funnel. Discussed hiring a sales ops analyst for H2.',
        keyPoints: [
          'Q1 conversion: 28% vs 35% target — 3 deals pushed to Q2',
          'Mid-funnel gap: reps not following up within 48h',
          'Analyst hire: budget review in June planning',
        ],
      },
    ],
    actionItems: [
      { task: 'Make "Deal Context" CRM field required', owner: 'Marcus', due: 'Apr 21', status: 'in-progress', context: null },
      { task: 'Draft commission FAQ doc for reps', owner: 'Marcus', due: 'Apr 23', status: 'open', context: 'New plan effective May 1' },
      { task: 'Set up weekly forecast review cadence', owner: 'You', due: 'Apr 22', status: 'open', context: 'Mondays, 30 min' },
      { task: 'June renewal outreach plan', owner: 'Marcus', due: 'May 1', status: 'open', context: '4 accounts due for renewal' },
      { task: 'Sales enablement material audit', owner: 'Marcus', due: 'May 15', status: 'open', context: 'PS and MS case studies priority' },
      { task: 'Q1 pipeline report', owner: 'Marcus', due: 'Apr 12', status: 'done', context: null },
      { task: 'CRM data quality baseline report', owner: 'Marcus', due: 'Apr 14', status: 'done', context: null },
    ],
    history: [
      { date: 'Apr 16, 2026', duration: '40 min', summary: 'CRM quality fix, forecast accuracy process, commission comms plan.', completedActions: 2 },
      { date: 'Apr 9, 2026',  duration: '45 min', summary: 'Q1 pipeline review, conversion rate dip, mid-funnel follow-up gap.', completedActions: 1 },
      { date: 'Apr 2, 2026',  duration: '50 min', summary: 'Q2 goal setting, CRM initiative launch, headcount discussion.', completedActions: 3 },
      { date: 'Mar 26, 2026', duration: '35 min', summary: 'Q1 close prep, renewal pipeline review, tool stack audit.', completedActions: 2 },
    ],
  },
  'project-coordinator': {
    name: 'Project Coordinator',
    manager: 'with Sasha Rivera',
    nextMeeting: 'Thu Apr 24',
    lastMeeting: 'Apr 17',
    lastMeetingDate: '4 days ago',
    teamSize: 3,
    agenda: [
      { topic: 'Project status board — Q2 snapshot', context: 'Six active projects. Two behind schedule.', owner: 'Sasha', priority: 'high' },
      { topic: 'Resource conflict: PS + MS double-booking', context: 'Two engineers requested by both teams for same week.', owner: 'You', priority: 'high' },
      { topic: 'Project intake process improvement', context: 'Intake form not capturing enough info. Rework needed.', owner: 'Sasha', priority: 'medium' },
      { topic: 'Client-facing status update cadence', context: 'Move from bi-weekly to weekly for active projects?', owner: 'Sasha', priority: 'medium' },
      { topic: 'Lessons learned: Q1 project retros', context: null, owner: 'You', priority: 'low' },
    ],
    notes: [
      {
        date: 'April 17, 2026',
        content: 'Project board review: Chen Foundation and Meridian projects behind. Chen delayed due to client-side approvals; Sasha following up. Meridian slipped from the onboarding handoff issue (connected to PS). Resource conflict resolved — Eng team confirmed one resource can split time. Intake form redesign scoped for 2 weeks.',
        keyPoints: [
          'Chen delay: client approval bottleneck — Sasha escalating',
          'Meridian: tied to PS handoff fix — unblocks Apr 22',
          'Resource conflict resolved: split-time arrangement confirmed',
          'Intake form redesign: 2-week timeline, Sasha leading',
        ],
      },
      {
        date: 'April 10, 2026',
        content: 'Five active projects, all within tolerance except Holtz (waiting on MS). Discussed adding Gantt view to project board for leadership visibility. Sasha proposing a weekly sync between PS, MS, and PC — good idea, worth piloting.',
        keyPoints: [
          'Holtz project: blocked by MS team, escalated',
          'Gantt view: Sasha to prototype by Apr 17',
          'Cross-team weekly sync: pilot for 4 weeks starting Apr 21',
        ],
      },
    ],
    actionItems: [
      { task: 'Escalate Chen Foundation client approval bottleneck', owner: 'Sasha', due: 'Apr 21', status: 'in-progress', context: 'Contact client PM directly' },
      { task: 'Redesign project intake form', owner: 'Sasha', due: 'May 1', status: 'open', context: 'Include resource, scope, risk fields' },
      { task: 'Pilot cross-team weekly sync (PS, MS, PC)', owner: 'You', due: 'Apr 21', status: 'open', context: '4-week pilot' },
      { task: 'Client status update cadence proposal', owner: 'Sasha', due: 'Apr 25', status: 'open', context: 'Weekly vs bi-weekly' },
      { task: 'Q1 project retrospective summary', owner: 'Sasha', due: 'Apr 30', status: 'open', context: null },
      { task: 'Project board Gantt prototype', owner: 'Sasha', due: 'Apr 17', status: 'done', context: null },
      { task: 'Resource conflict resolution — Eng team', owner: 'You', due: 'Apr 18', status: 'done', context: null },
    ],
    history: [
      { date: 'Apr 17, 2026', duration: '45 min', summary: 'Q2 project board review, resource conflict resolution, intake form redesign scoping.', completedActions: 2 },
      { date: 'Apr 10, 2026', duration: '40 min', summary: 'Holtz escalation, Gantt prototype, cross-team sync proposal.', completedActions: 1 },
      { date: 'Apr 3, 2026',  duration: '50 min', summary: 'Q1 close retrospective, Q2 project kickoffs, coordination process gaps.', completedActions: 4 },
      { date: 'Mar 27, 2026', duration: '45 min', summary: 'Resource planning for Q2, intake review, client communication standards.', completedActions: 3 },
    ],
  },
};

const SERVICE_DELIVERY_GOALS = [
  {
    objective: 'Achieve 98% client SLA compliance across all accounts',
    description: 'Drive consistent service delivery that meets or exceeds contracted SLAs, reducing escalations and building client trust.',
    status: 'at-risk',
    progress: 72,
    owner: 'Priya Mehta',
    dueDate: 'Jun 30, 2026',
    keyResults: [
      { result: 'Reach 98% SLA compliance by end of Q2', metric: 'Currently 96.2% · 2 accounts below target', done: false, owner: 'MS Team' },
      { result: 'Implement upgraded on-call rotation for NOC', metric: 'Resolves overnight alert gap', done: false, owner: 'Priya Mehta' },
      { result: 'Complete SLA root cause analysis for all misses', metric: '3 of 5 complete', done: false, owner: 'Priya Mehta' },
      { result: 'Publish monthly SLA scorecard to leadership', metric: 'Started Apr 1', done: true, owner: 'You' },
    ],
  },
  {
    objective: 'Reduce project delivery timeline slippage to under 10%',
    description: 'Improve project coordination processes so that projects are delivered on time, improving client satisfaction and team predictability.',
    status: 'on-track',
    progress: 58,
    owner: 'Sasha Rivera',
    dueDate: 'Jun 30, 2026',
    keyResults: [
      { result: 'Redesign project intake form with resource and risk fields', metric: 'In progress — due May 1', done: false, owner: 'Sasha Rivera' },
      { result: 'Implement weekly cross-team sync (PS, MS, PC)', metric: '4-week pilot starts Apr 21', done: false, owner: 'You' },
      { result: 'Reduce average project slippage from 18% to 10%', metric: 'Q1 average: 18% · Q2 target: 10%', done: false, owner: 'Sasha Rivera' },
      { result: 'Q1 project retrospective completed', metric: 'Summary shared with leadership', done: true, owner: 'Sasha Rivera' },
    ],
  },
  {
    objective: 'Standardize the Sales-to-Service-Delivery handoff',
    description: 'Create a repeatable, documented handoff process from Sales close to PS/MS onboarding to eliminate miscommunication and set client expectations correctly.',
    status: 'on-track',
    progress: 40,
    owner: 'Jordan Lee',
    dueDate: 'May 15, 2026',
    keyResults: [
      { result: 'Create and pilot sales-to-PS handoff template', metric: 'Draft due Apr 28', done: false, owner: 'Jordan Lee' },
      { result: 'Align Sales Ops on required pre-handoff fields in CRM', metric: 'CRM changes in progress', done: false, owner: 'Marcus Webb' },
      { result: 'Reduce post-handoff client escalations by 50%', metric: 'Baseline: 4 per quarter', done: false, owner: 'You' },
      { result: 'Document current-state handoff gaps', metric: 'Completed Apr 14', done: true, owner: 'Jordan Lee' },
    ],
  },
  {
    objective: 'Grow Professional Services revenue by 20% in Q2',
    description: 'Expand PS engagement scope with existing clients and accelerate new project kickoffs to increase billable revenue.',
    status: 'at-risk',
    progress: 25,
    owner: 'Jordan Lee',
    dueDate: 'Jun 30, 2026',
    keyResults: [
      { result: 'Close 2 new PS SOWs in April', metric: 'Chen Foundation in progress · 1 more needed', done: false, owner: 'Jordan Lee' },
      { result: 'Upsell expanded scope to 2 existing MS clients', metric: 'Aperture and Porter & Mills identified', done: false, owner: 'Jordan Lee' },
      { result: 'Hire or contract 1 PS engineer for Q2 capacity', metric: 'Pending budget approval', done: false, owner: 'You' },
      { result: 'Q1 PS revenue baseline established', metric: '$31,200 Q1 actuals', done: true, owner: 'You' },
    ],
  },
  {
    objective: 'Implement self-service client portal by end of Q2',
    description: 'Reduce inbound L1 ticket volume by 30% by giving clients a portal for status checks, ticket submission, and knowledge base access.',
    status: 'on-track',
    progress: 20,
    owner: 'Priya Mehta',
    dueDate: 'Jun 30, 2026',
    keyResults: [
      { result: 'Complete requirements doc and vendor shortlist', metric: 'Due Apr 30', done: false, owner: 'Priya Mehta' },
      { result: 'Select vendor and begin implementation', metric: 'Target: May 15', done: false, owner: 'Priya Mehta' },
      { result: 'Pilot portal with 2 beta clients', metric: 'Target: Jun 1', done: false, owner: 'Priya Mehta' },
      { result: 'Measure L1 ticket baseline for comparison', metric: 'Q1 avg: 48 L1 tickets/week', done: true, owner: 'Priya Mehta' },
    ],
  },
];

Object.assign(window, {
  TWEAK_DEFAULTS, THEMES, TYPEFACES, PALETTE, todayISO,
  INITIAL_TASKS, SCHEDULE, HABITS, WELLNESS, NOTES, FINANCE,
  MEALS, READING, PROJECTS, PEOPLE, HOME, BUSINESS,
  TEAM_1O1_DATA, SERVICE_DELIVERY_GOALS,
});
