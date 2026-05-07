import { createClient } from '@/lib/supabase/server'
import { DEMO_HABITS, DEMO_HABIT_LOGS } from '@/lib/demo-data'
import { HabitsPageClient } from './HabitsClient'
import type { Habit, HabitLog } from '@/lib/types'

function offsetDate(base: string, days: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function computeStreak(logs: HabitLog[], today: string): number {
  let s = 0
  let d = today
  while (logs.some((l) => l.date === d && l.done)) {
    s++
    d = offsetDate(d, -1)
  }
  return s
}

export default async function HabitsPage() {
  const today = new Date().toISOString().split('T')[0]
  let habits: Habit[] = DEMO_HABITS
  let logs: HabitLog[] = DEMO_HABIT_LOGS

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const [h, l] = await Promise.all([
          supabase.from('habits').select('*').eq('user_id', user.id).order('created_at'),
          supabase.from('habit_logs').select('*').eq('user_id', user.id).gte('date', offsetDate(today, -60)),
        ])
        if (h.data) habits = h.data as Habit[]
        if (l.data) logs = l.data as HabitLog[]
      }
    } catch {
      // use demo
    }
  }

  const habitRows = habits.map((h) => ({
    ...h,
    streak: computeStreak(logs.filter((l) => l.habit_id === h.id), today),
    weekDone: Array.from({ length: 7 }, (_, i) => {
      const d = offsetDate(today, i - 6)
      return logs.some((l) => l.habit_id === h.id && l.date === d && l.done)
    }),
  }))

  const last30 = Array.from({ length: 30 }, (_, i) => offsetDate(today, i - 29))

  return (
    <HabitsPageClient
      habits={habitRows}
      logs={logs}
      today={today}
      last30={last30}
    />
  )
}
