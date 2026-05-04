import { createClient } from '@/lib/supabase/server'
import {
  DEMO_TASKS, DEMO_SCHEDULE, DEMO_HABITS, DEMO_HABIT_LOGS,
  DEMO_WELLNESS, DEMO_NOTES, DEMO_HABIT_STREAKS,
} from '@/lib/demo-data'
import TasksWidget from '@/components/widgets/TasksWidget'
import ScheduleWidget from '@/components/widgets/ScheduleWidget'
import HabitsWidget from '@/components/widgets/HabitsWidget'
import WellnessWidget from '@/components/widgets/WellnessWidget'
import NotesWidget from '@/components/widgets/NotesWidget'
import type { Task, ScheduleBlock, Habit, HabitLog, WellnessLog, Note } from '@/lib/types'

async function getData() {
  const today = new Date().toISOString().split('T')[0]

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return buildFromDemo(today)
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return buildFromDemo(today)

    const uid = user.id
    const [tasks, schedule, habits, habitLogs, wellness, notes] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      supabase.from('schedule_blocks').select('*').eq('user_id', uid).gte('start_ts', `${today}T00:00:00`).lte('start_ts', `${today}T23:59:59`),
      supabase.from('habits').select('*').eq('user_id', uid).order('created_at'),
      supabase.from('habit_logs').select('*').eq('user_id', uid).gte('date', offsetDate(today, -30)),
      supabase.from('wellness_logs').select('*').eq('user_id', uid).eq('date', today).single(),
      supabase.from('notes').select('*').eq('user_id', uid).order('updated_at', { ascending: false }).limit(6),
    ])

    return buildHabitRows(
      (tasks.data ?? []) as Task[],
      (schedule.data ?? []) as ScheduleBlock[],
      (habits.data ?? []) as Habit[],
      (habitLogs.data ?? []) as HabitLog[],
      (wellness.data as WellnessLog | null) ?? null,
      (notes.data ?? []) as Note[],
      today,
    )
  } catch {
    return buildFromDemo(today)
  }
}

function buildFromDemo(today: string) {
  return buildHabitRows(
    DEMO_TASKS,
    DEMO_SCHEDULE,
    DEMO_HABITS,
    DEMO_HABIT_LOGS,
    DEMO_WELLNESS,
    DEMO_NOTES,
    today,
  )
}

function buildHabitRows(
  tasks: Task[],
  schedule: ScheduleBlock[],
  habits: Habit[],
  logs: HabitLog[],
  wellness: WellnessLog | null,
  notes: Note[],
  today: string,
) {
  const habitRows = habits.map((habit) => {
    const weekDone = Array.from({ length: 7 }, (_, i) => {
      const d = offsetDate(today, i - 6)
      return logs.some((l) => l.habit_id === habit.id && l.date === d && l.done)
    })
    const streak = computeStreak(logs.filter((l) => l.habit_id === habit.id), today)
    return { ...habit, streak, weekDone }
  })
  return { tasks, schedule, habitRows, wellness, notes, today }
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

export default async function TodayPage() {
  const { tasks, schedule, habitRows, wellness, notes, today } = await getData()

  return (
    <div className="p-[var(--pad)] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--gap)]">
      <TasksWidget tasks={tasks} />
      <ScheduleWidget blocks={schedule} />
      <HabitsWidget habits={habitRows} todayDate={today} />
      <WellnessWidget log={wellness} />
      <NotesWidget notes={notes} />
    </div>
  )
}
