import type {
  Task, ScheduleBlock, Habit, HabitLog, WellnessLog, Note,
  Project, Person, Chore, Book, Meal, FinanceCategory,
  FinanceTransaction, BusinessMetrics,
} from './types'

const UID = 'demo-user'
const TODAY = new Date().toISOString().split('T')[0]

export const DEMO_TASKS: Task[] = [
  { id: 't1', user_id: UID, text: 'Send Q1 invoice to Aperture Co.', priority: 1, done: false, project: 'Business', time: '9:30', due_date: TODAY, created_at: TODAY, updated_at: TODAY },
  { id: 't2', user_id: UID, text: 'Review pull requests', priority: 2, done: true, project: 'Work', time: null, due_date: null, created_at: TODAY, updated_at: TODAY },
  { id: 't3', user_id: UID, text: 'Call dentist to reschedule', priority: 1, done: false, project: 'Health', time: null, due_date: null, created_at: TODAY, updated_at: TODAY },
  { id: 't4', user_id: UID, text: 'Water the monstera & fiddle leaf', priority: 3, done: false, project: 'Home', time: null, due_date: null, created_at: TODAY, updated_at: TODAY },
  { id: 't5', user_id: UID, text: 'Draft proposal — Chen foundation', priority: 1, done: false, project: 'Business', time: '14:00', due_date: null, created_at: TODAY, updated_at: TODAY },
  { id: 't6', user_id: UID, text: "Reply to Marguerite's email", priority: 2, done: false, project: 'People', time: null, due_date: null, created_at: TODAY, updated_at: TODAY },
  { id: 't7', user_id: UID, text: 'Pick up dry cleaning', priority: 3, done: false, project: 'Home', time: null, due_date: null, created_at: TODAY, updated_at: TODAY },
  { id: 't8', user_id: UID, text: 'Read chapter 4 — "Slouching Towards Bethlehem"', priority: 3, done: false, project: 'Reading', time: null, due_date: null, created_at: TODAY, updated_at: TODAY },
]

export const DEMO_SCHEDULE: ScheduleBlock[] = [
  { id: 's1', user_id: UID, title: 'Morning pages', start_ts: `${TODAY}T07:00:00`, end_ts: `${TODAY}T07:30:00`, kind: 'ritual', created_at: TODAY, updated_at: TODAY },
  { id: 's2', user_id: UID, title: 'Deep work — Chen proposal', start_ts: `${TODAY}T09:00:00`, end_ts: `${TODAY}T11:00:00`, kind: 'focus', created_at: TODAY, updated_at: TODAY },
  { id: 's3', user_id: UID, title: 'Stand-up', start_ts: `${TODAY}T11:00:00`, end_ts: `${TODAY}T11:30:00`, kind: 'meeting', created_at: TODAY, updated_at: TODAY },
  { id: 's4', user_id: UID, title: 'Lunch w/ Dev', start_ts: `${TODAY}T12:30:00`, end_ts: `${TODAY}T13:30:00`, kind: 'personal', created_at: TODAY, updated_at: TODAY },
  { id: 's5', user_id: UID, title: 'Client call — Aperture', start_ts: `${TODAY}T14:00:00`, end_ts: `${TODAY}T15:00:00`, kind: 'meeting', created_at: TODAY, updated_at: TODAY },
  { id: 's6', user_id: UID, title: 'Gym', start_ts: `${TODAY}T17:00:00`, end_ts: `${TODAY}T18:00:00`, kind: 'wellness', created_at: TODAY, updated_at: TODAY },
  { id: 's7', user_id: UID, title: 'Dinner & reading', start_ts: `${TODAY}T19:00:00`, end_ts: `${TODAY}T21:00:00`, kind: 'personal', created_at: TODAY, updated_at: TODAY },
]

export const DEMO_HABITS: Habit[] = [
  { id: 'h1', user_id: UID, name: 'Morning pages', icon: 'pen', created_at: TODAY },
  { id: 'h2', user_id: UID, name: 'Move 30 min', icon: 'run', created_at: TODAY },
  { id: 'h3', user_id: UID, name: 'Read', icon: 'book', created_at: TODAY },
  { id: 'h4', user_id: UID, name: 'No phone before 9', icon: 'moon', created_at: TODAY },
  { id: 'h5', user_id: UID, name: 'Meditate', icon: 'circle', created_at: TODAY },
]

export const DEMO_HABIT_LOGS: HabitLog[] = [
  // Last 7 days per habit (simple pattern)
  ...['h1'].flatMap((hid) => [1,1,1,1,1,0,1].map((done, i) => ({
    id: `hl-${hid}-${i}`, user_id: UID, habit_id: hid,
    date: offsetDate(TODAY, i - 6), done: !!done,
  }))),
  ...['h2'].flatMap((hid) => [1,0,1,1,1,1,0].map((done, i) => ({
    id: `hl-${hid}-${i}`, user_id: UID, habit_id: hid,
    date: offsetDate(TODAY, i - 6), done: !!done,
  }))),
  ...['h3'].flatMap((hid) => [1,1,1,1,1,1,1].map((done, i) => ({
    id: `hl-${hid}-${i}`, user_id: UID, habit_id: hid,
    date: offsetDate(TODAY, i - 6), done: !!done,
  }))),
  ...['h4'].flatMap((hid) => [1,1,0,1,1,1,0].map((done, i) => ({
    id: `hl-${hid}-${i}`, user_id: UID, habit_id: hid,
    date: offsetDate(TODAY, i - 6), done: !!done,
  }))),
  ...['h5'].flatMap((hid) => [1,1,1,0,1,1,1].map((done, i) => ({
    id: `hl-${hid}-${i}`, user_id: UID, habit_id: hid,
    date: offsetDate(TODAY, i - 6), done: !!done,
  }))),
]

export const DEMO_WELLNESS: WellnessLog = {
  id: 'w1', user_id: UID, date: TODAY,
  sleep_hours: 7.4, water_cups: 4, steps: 3240, mood: 7, mood_note: 'steady',
  created_at: TODAY,
}

export const DEMO_NOTES: Note[] = [
  { id: 'n1', user_id: UID, title: 'Proposal outline — Chen', body: 'Lead with the diagnostic, not the methodology. They care about outcomes, not our process…', tag: 'work', created_at: TODAY, updated_at: TODAY },
  { id: 'n2', user_id: UID, title: 'Seeds for spring garden', body: 'Tomato (San Marzano, Brandywine), basil, shishito, calendula for bees…', tag: 'home', created_at: TODAY, updated_at: TODAY },
  { id: 'n3', user_id: UID, title: 'Things Dev said', body: '"The antidote to anxiety is specificity." — worth sitting with.', tag: 'journal', created_at: TODAY, updated_at: TODAY },
]

export const DEMO_PROJECTS: Project[] = [
  { id: 'p1', user_id: UID, name: 'Chen proposal', due_date: offsetDate(TODAY, 6), progress: 45, created_at: TODAY, updated_at: TODAY },
  { id: 'p2', user_id: UID, name: 'Studio website', due_date: offsetDate(TODAY, 24), progress: 20, created_at: TODAY, updated_at: TODAY },
  { id: 'p3', user_id: UID, name: 'Spring garden', due_date: null, progress: 70, created_at: TODAY, updated_at: TODAY },
  { id: 'p4', user_id: UID, name: 'Tax filing', due_date: offsetDate(TODAY, -3), progress: 100, created_at: TODAY, updated_at: TODAY },
]

export const DEMO_PEOPLE: Person[] = [
  { id: 'pe1', user_id: UID, name: 'Marguerite', relation: 'friend', last_contact_at: offsetDate(TODAY, -14), created_at: TODAY },
  { id: 'pe2', user_id: UID, name: 'Dad', relation: 'family', last_contact_at: offsetDate(TODAY, -4), created_at: TODAY },
  { id: 'pe3', user_id: UID, name: 'Dev', relation: 'partner', last_contact_at: offsetDate(TODAY, -1), created_at: TODAY },
  { id: 'pe4', user_id: UID, name: 'Sam at Aperture', relation: 'client', last_contact_at: offsetDate(TODAY, -7), created_at: TODAY },
]

export const DEMO_CHORES: Chore[] = [
  { id: 'c1', user_id: UID, name: 'Laundry', frequency: 'Weekly', last_done_at: offsetDate(TODAY, -4), created_at: TODAY },
  { id: 'c2', user_id: UID, name: 'Water plants', frequency: 'Every 3d', last_done_at: TODAY, created_at: TODAY },
  { id: 'c3', user_id: UID, name: 'Take out trash', frequency: 'Weekly', last_done_at: offsetDate(TODAY, -6), created_at: TODAY },
  { id: 'c4', user_id: UID, name: 'Clean bathroom', frequency: 'Weekly', last_done_at: offsetDate(TODAY, -3), created_at: TODAY },
]

export const DEMO_BOOKS: Book[] = [
  { id: 'b1', user_id: UID, title: 'Slouching Towards Bethlehem', author: 'Joan Didion', progress: 62, status: 'reading', created_at: TODAY, updated_at: TODAY },
  { id: 'b2', user_id: UID, title: 'The Creative Act', author: 'Rick Rubin', progress: 100, status: 'done', created_at: TODAY, updated_at: TODAY },
  { id: 'b3', user_id: UID, title: 'A Pattern Language', author: 'Christopher Alexander', progress: 14, status: 'reading', created_at: TODAY, updated_at: TODAY },
  { id: 'b4', user_id: UID, title: 'Four Thousand Weeks', author: 'Oliver Burkeman', progress: 0, status: 'queued', created_at: TODAY, updated_at: TODAY },
]

export const DEMO_MEALS: Meal[] = [
  { id: 'm1', user_id: UID, day_of_week: 'Mon', slot: 'breakfast', name: 'Oats + berries' },
  { id: 'm2', user_id: UID, day_of_week: 'Mon', slot: 'lunch', name: 'Leftover soup' },
  { id: 'm3', user_id: UID, day_of_week: 'Mon', slot: 'dinner', name: 'Sheet pan salmon' },
  { id: 'm4', user_id: UID, day_of_week: 'Tue', slot: 'breakfast', name: 'Eggs on toast' },
  { id: 'm5', user_id: UID, day_of_week: 'Tue', slot: 'lunch', name: 'Grain bowl' },
  { id: 'm6', user_id: UID, day_of_week: 'Tue', slot: 'dinner', name: 'Pasta e fagioli' },
  { id: 'm7', user_id: UID, day_of_week: 'Wed', slot: 'breakfast', name: 'Yogurt & nuts' },
  { id: 'm8', user_id: UID, day_of_week: 'Wed', slot: 'lunch', name: 'Out — café' },
  { id: 'm9', user_id: UID, day_of_week: 'Wed', slot: 'dinner', name: 'Roast chicken' },
  { id: 'm10', user_id: UID, day_of_week: 'Thu', slot: 'breakfast', name: 'Smoothie' },
  { id: 'm11', user_id: UID, day_of_week: 'Thu', slot: 'lunch', name: 'Leftover chx' },
  { id: 'm12', user_id: UID, day_of_week: 'Thu', slot: 'dinner', name: 'Tacos' },
  { id: 'm13', user_id: UID, day_of_week: 'Fri', slot: 'breakfast', name: 'Oats + berries' },
  { id: 'm14', user_id: UID, day_of_week: 'Fri', slot: 'lunch', name: 'Grain bowl' },
  { id: 'm15', user_id: UID, day_of_week: 'Fri', slot: 'dinner', name: 'Pizza night' },
]

export const DEMO_FINANCE_CATEGORIES: FinanceCategory[] = [
  { id: 'fc1', user_id: UID, name: 'Rent', monthly_budget: 1650 },
  { id: 'fc2', user_id: UID, name: 'Groceries', monthly_budget: 500 },
  { id: 'fc3', user_id: UID, name: 'Dining', monthly_budget: 250 },
  { id: 'fc4', user_id: UID, name: 'Transit', monthly_budget: 150 },
  { id: 'fc5', user_id: UID, name: 'Business', monthly_budget: 800 },
  { id: 'fc6', user_id: UID, name: 'Other', monthly_budget: 850 },
]

export const DEMO_FINANCE_TRANSACTIONS: FinanceTransaction[] = [
  { id: 'ft1', user_id: UID, category_id: 'fc1', amount: 1650, occurred_on: offsetDate(TODAY, -15), note: 'Rent' },
  { id: 'ft2', user_id: UID, category_id: 'fc2', amount: 312, occurred_on: offsetDate(TODAY, -5), note: null },
  { id: 'ft3', user_id: UID, category_id: 'fc3', amount: 189, occurred_on: offsetDate(TODAY, -2), note: null },
  { id: 'ft4', user_id: UID, category_id: 'fc4', amount: 84, occurred_on: offsetDate(TODAY, -8), note: null },
  { id: 'ft5', user_id: UID, category_id: 'fc5', amount: 412, occurred_on: offsetDate(TODAY, -10), note: null },
  { id: 'ft6', user_id: UID, category_id: 'fc6', amount: 200, occurred_on: offsetDate(TODAY, -3), note: null },
]

export const DEMO_BUSINESS: BusinessMetrics = {
  id: 'bm1', user_id: UID,
  month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  mrr: 8400, clients: 6, invoices_outstanding: 2, created_at: TODAY,
}

function offsetDate(base: string, days: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export const DEMO_HABIT_STREAKS: Record<string, number> = {
  h1: 23, h2: 5, h3: 41, h4: 8, h5: 12,
}
