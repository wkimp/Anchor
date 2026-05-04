import { createClient } from '@/lib/supabase/server'
import { DEMO_HABITS, DEMO_HABIT_LOGS, DEMO_HABIT_STREAKS } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import HabitsWidget from '@/components/widgets/HabitsWidget'
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
        if (h.data?.length) { habits = h.data as Habit[]; logs = (l.data ?? []) as HabitLog[] }
      }
    } catch { /* use demo */ }
  }

  const habitRows = habits.map((h) => ({
    ...h,
    streak: computeStreak(logs.filter((l) => l.habit_id === h.id), today),
    weekDone: Array.from({ length: 7 }, (_, i) => {
      const d = offsetDate(today, i - 6)
      return logs.some((l) => l.habit_id === h.id && l.date === d && l.done)
    }),
  }))

  // Build last 30-day grid for full page
  const last30 = Array.from({ length: 30 }, (_, i) => offsetDate(today, i - 29))

  return (
    <PageShell
      title="Habits"
      subtitle={`${habits.length} tracked · longest streak: ${Math.max(...habitRows.map((h) => h.streak), 0)} days`}
    >
      <SectionTitle>This week</SectionTitle>
      <HabitsWidget habits={habitRows} todayDate={today} />

      <SectionTitle>30-day grid</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-5 overflow-x-auto">
        {habitRows.map((habit) => (
          <div key={habit.id} className="flex items-center gap-2 mb-2 last:mb-0">
            <span className="font-body text-sm text-ink-2 w-36 flex-shrink-0 truncate">{habit.name}</span>
            <div className="flex gap-0.5">
              {last30.map((date) => {
                const done = logs.some((l) => l.habit_id === habit.id && l.date === date && l.done)
                return (
                  <div
                    key={date}
                    title={date}
                    className={`w-3 h-3 rounded-sm ${done ? 'bg-accent' : 'bg-rule'}`}
                  />
                )
              })}
            </div>
            <span className="font-mono text-[11px] text-ink-3 ml-2">{habit.streak}d</span>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
