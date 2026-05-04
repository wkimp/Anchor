// ── Domain types ──────────────────────────────────────────────

export type Priority = 1 | 2 | 3

export interface Task {
  id: string
  user_id: string
  text: string
  priority: Priority
  done: boolean
  project: string
  due_date?: string | null
  time?: string | null
  created_at: string
  updated_at: string
}

export interface ScheduleBlock {
  id: string
  user_id: string
  title: string
  start_ts: string
  end_ts: string
  kind: 'ritual' | 'focus' | 'meeting' | 'personal' | 'wellness'
  created_at: string
  updated_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  icon: string
  created_at: string
}

export interface HabitLog {
  id: string
  user_id: string
  habit_id: string
  date: string
  done: boolean
}

export interface WellnessLog {
  id: string
  user_id: string
  date: string
  sleep_hours: number | null
  water_cups: number | null
  steps: number | null
  mood: number | null
  mood_note: string | null
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  body: string
  tag: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  due_date: string | null
  progress: number
  created_at: string
  updated_at: string
}

export interface Person {
  id: string
  user_id: string
  name: string
  relation: string
  last_contact_at: string | null
  created_at: string
}

export interface Chore {
  id: string
  user_id: string
  name: string
  frequency: string
  last_done_at: string | null
  created_at: string
}

export interface Book {
  id: string
  user_id: string
  title: string
  author: string
  progress: number
  status: 'reading' | 'queued' | 'done'
  created_at: string
  updated_at: string
}

export interface Meal {
  id: string
  user_id: string
  day_of_week: string
  slot: 'breakfast' | 'lunch' | 'dinner'
  name: string
}

export interface FinanceCategory {
  id: string
  user_id: string
  name: string
  monthly_budget: number
}

export interface FinanceTransaction {
  id: string
  user_id: string
  category_id: string
  amount: number
  occurred_on: string
  note: string | null
}

export interface BusinessMetrics {
  id: string
  user_id: string
  month: string
  mrr: number
  clients: number
  invoices_outstanding: number
  created_at: string
}

// ── UI / App state types ───────────────────────────────────────

export type ThemeName = 'ochre' | 'olive' | 'terracotta' | 'ink' | 'plum'
export type ModeName = 'light' | 'dark'
export type TypefaceName = 'newsreader' | 'spectral' | 'sans'
export type DensityName = 'spacious' | 'compact'
export type ViewName = 'Today' | 'Week' | 'Month' | 'All'

export type WidgetKey =
  | 'tasks' | 'schedule' | 'habits' | 'wellness' | 'notes'
  | 'finance' | 'meals' | 'reading' | 'projects' | 'people'
  | 'home' | 'business'

export interface Tweaks {
  theme: ThemeName
  typeface: TypefaceName
  mode: ModeName
  density: DensityName
  widgets: Record<WidgetKey, boolean>
}

export type NavId =
  | 'today' | 'week' | 'upcoming' | 'someday'
  | 'business' | 'projects' | 'people' | 'home'
  | 'health' | 'finance' | 'reading' | 'meals'
  | 'notes' | 'habits' | 'review' | 'settings'

// ── Agent types ────────────────────────────────────────────────

export interface AgentMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AgentContext {
  today: string
  openTasks: Task[]
  schedule: ScheduleBlock[]
  habits: Array<Habit & { streak: number; weekDone: boolean[] }>
  wellness: WellnessLog | null
  finances: { income: number; spent: number; budget: number } | null
  projects: Project[]
  people: Array<Person & { daysSince: number }>
}
