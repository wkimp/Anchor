import { createClient } from '@/lib/supabase/server'
import { DEMO_TASKS, DEMO_SCHEDULE } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import type { Task, ScheduleBlock } from '@/lib/types'

function getWeekDays(date: Date) {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay() + 1) // Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export default async function WeekPage() {
  const today = new Date()
  const weekDays = getWeekDays(today)
  const todayISO = today.toISOString().split('T')[0]

  let tasks: Task[] = DEMO_TASKS
  let blocks: ScheduleBlock[] = DEMO_SCHEDULE

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const weekStart = weekDays[0].toISOString().split('T')[0]
        const weekEnd = weekDays[6].toISOString().split('T')[0]
        const [t, b] = await Promise.all([
          supabase.from('tasks').select('*').eq('user_id', user.id).gte('due_date', weekStart).lte('due_date', weekEnd),
          supabase.from('schedule_blocks').select('*').eq('user_id', user.id).gte('start_ts', `${weekStart}T00:00:00`).lte('start_ts', `${weekEnd}T23:59:59`),
        ])
        if (t.data) tasks = t.data as Task[]
        if (b.data) blocks = b.data as ScheduleBlock[]
      }
    } catch { /* use demo */ }
  }

  const weekLabel = `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

  return (
    <PageShell title="This week" subtitle={weekLabel}>
      <div className="grid grid-cols-7 gap-2 overflow-x-auto min-w-[560px]">
        {weekDays.map((day) => {
          const iso = day.toISOString().split('T')[0]
          const isToday = iso === todayISO
          const dayBlocks = blocks.filter((b) => b.start_ts.startsWith(iso))
          const dayTasks = tasks.filter((t) => t.due_date === iso)

          return (
            <div
              key={iso}
              className={`rounded-sm p-2 min-h-32 border ${isToday ? 'border-accent bg-accent-soft/20' : 'border-rule bg-card'}`}
            >
              <div className="mb-2">
                <p className={`font-mono text-[9px] uppercase tracking-[0.3px] ${isToday ? 'text-accent' : 'text-ink-4'}`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={`font-display italic text-lg ${isToday ? 'text-accent' : 'text-ink'}`}>
                  {day.getDate()}
                </p>
              </div>

              {dayBlocks.map((b) => (
                <div
                  key={b.id}
                  className="text-[10px] font-body bg-ink text-paper px-1.5 py-1 rounded-sm mb-1 truncate"
                  title={`${b.title} · ${fmtTime(b.start_ts)}`}
                >
                  {b.title}
                </div>
              ))}

              {dayTasks.map((t) => (
                <div
                  key={t.id}
                  className={`text-[10px] font-body px-1.5 py-1 rounded-sm mb-1 truncate ${t.done ? 'line-through text-ink-4 bg-paper-alt' : 'text-ink-2 bg-paper-alt'}`}
                >
                  {t.text}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
