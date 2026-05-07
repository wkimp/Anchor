import {
  DEMO_BOOKS,
  DEMO_BUSINESS,
  DEMO_CHORES,
  DEMO_FINANCE_CATEGORIES,
  DEMO_FINANCE_TRANSACTIONS,
  DEMO_HABITS,
  DEMO_HABIT_LOGS,
  DEMO_MEALS,
  DEMO_NOTES,
  DEMO_PEOPLE,
  DEMO_PROJECTS,
  DEMO_SCHEDULE,
  DEMO_TASKS,
  DEMO_WELLNESS,
} from '@/lib/demo-data'
import { createClient } from '@/lib/supabase/server'
import type {
  Book,
  BusinessMetrics,
  Chore,
  FinanceCategory,
  FinanceTransaction,
  Habit,
  HabitLog,
  Meal,
  Note,
  Person,
  Project,
  ScheduleBlock,
  Task,
  WellnessLog,
} from '@/lib/types'

export type HabitRow = Habit & {
  streak: number
  weekDone: boolean[]
}

export async function getPlannerDashboardData() {
  const today = new Date().toISOString().split('T')[0]

  let tasks: Task[] = DEMO_TASKS
  let schedule: ScheduleBlock[] = DEMO_SCHEDULE
  let habits: Habit[] = DEMO_HABITS
  let habitLogs: HabitLog[] = DEMO_HABIT_LOGS
  let wellness: WellnessLog | null = DEMO_WELLNESS
  let notes: Note[] = DEMO_NOTES
  let projects: Project[] = DEMO_PROJECTS
  let people: Person[] = DEMO_PEOPLE
  let chores: Chore[] = DEMO_CHORES
  let books: Book[] = DEMO_BOOKS
  let meals: Meal[] = DEMO_MEALS
  let financeCategories: FinanceCategory[] = DEMO_FINANCE_CATEGORIES
  let financeTransactions: FinanceTransaction[] = DEMO_FINANCE_TRANSACTIONS
  let business: BusinessMetrics = DEMO_BUSINESS

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const uid = user.id
        const [t, s, h, hl, w, n, p, pe, c, b, m, fc, ft, bm] = await Promise.all([
          supabase.from('tasks').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
          supabase.from('schedule_blocks').select('*').eq('user_id', uid).gte('start_ts', `${today}T00:00:00`).lte('start_ts', `${today}T23:59:59`),
          supabase.from('habits').select('*').eq('user_id', uid).order('created_at'),
          supabase.from('habit_logs').select('*').eq('user_id', uid).gte('date', offsetDate(today, -30)),
          supabase.from('wellness_logs').select('*').eq('user_id', uid).eq('date', today).single(),
          supabase.from('notes').select('*').eq('user_id', uid).order('updated_at', { ascending: false }).limit(6),
          supabase.from('projects').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
          supabase.from('people').select('*').eq('user_id', uid).order('last_contact_at', { ascending: true }),
          supabase.from('chores').select('*').eq('user_id', uid).order('created_at'),
          supabase.from('books').select('*').eq('user_id', uid).order('created_at'),
          supabase.from('meals').select('*').eq('user_id', uid).order('day_of_week'),
          supabase.from('finance_categories').select('*').eq('user_id', uid),
          supabase.from('finance_transactions').select('*').eq('user_id', uid).order('occurred_on', { ascending: false }),
          supabase.from('business_metrics').select('*').eq('user_id', uid).order('month', { ascending: false }).limit(1).single(),
        ])

        tasks = (t.data ?? []) as Task[]
        schedule = (s.data ?? []) as ScheduleBlock[]
        habits = (h.data ?? []) as Habit[]
        habitLogs = (hl.data ?? []) as HabitLog[]
        wellness = (w.data as WellnessLog | null) ?? null
        notes = (n.data ?? []) as Note[]
        projects = (p.data ?? []) as Project[]
        people = (pe.data ?? []) as Person[]
        chores = (c.data ?? []) as Chore[]
        books = (b.data ?? []) as Book[]
        meals = (m.data ?? []) as Meal[]
        financeCategories = (fc.data ?? []) as FinanceCategory[]
        financeTransactions = (ft.data ?? []) as FinanceTransaction[]
        business = (bm.data as BusinessMetrics | null) ?? DEMO_BUSINESS
      }
    } catch {
      // fall back to demo data
    }
  }

  return {
    today,
    tasks,
    schedule,
    habitRows: buildHabitRows(habits, habitLogs, today),
    wellness,
    notes,
    projects,
    people,
    chores,
    books,
    meals,
    financeCategories,
    financeTransactions,
    business,
  }
}

function buildHabitRows(habits: Habit[], logs: HabitLog[], today: string): HabitRow[] {
  return habits.map((habit) => {
    const weekDone = Array.from({ length: 7 }, (_, i) => {
      const d = offsetDate(today, i - 6)
      return logs.some((l) => l.habit_id === habit.id && l.date === d && l.done)
    })
    const streak = computeStreak(logs.filter((l) => l.habit_id === habit.id), today)
    return { ...habit, streak, weekDone }
  })
}

function computeStreak(logs: HabitLog[], today: string): number {
  let streak = 0
  let d = today
  while (true) {
    const found = logs.find((l) => l.date === d && l.done)
    if (!found) break
    streak++
    d = offsetDate(d, -1)
  }
  return streak
}

function offsetDate(base: string, days: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}
