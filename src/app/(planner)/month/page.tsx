import { createClient } from '@/lib/supabase/server'
import { DEMO_TASKS, DEMO_SCHEDULE } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import type { Task, ScheduleBlock } from '@/lib/types'

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay() // 0=Sun
}

export default async function MonthPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const todayDate = now.getDate()
  const todayISO = now.toISOString().split('T')[0]

  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const daysInMonth = getDaysInMonth(year, month)
  const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${daysInMonth}`

  let tasks: Task[] = DEMO_TASKS
  let blocks: ScheduleBlock[] = DEMO_SCHEDULE

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const [t, b] = await Promise.all([
          supabase.from('tasks').select('*').eq('user_id', user.id).gte('due_date', monthStart).lte('due_date', monthEnd),
          supabase.from('schedule_blocks').select('*').eq('user_id', user.id).gte('start_ts', `${monthStart}T00:00:00`).lte('start_ts', `${monthEnd}T23:59:59`),
        ])
        if (t.data) tasks = t.data as Task[]
        if (b.data) blocks = b.data as ScheduleBlock[]
      }
    } catch { /* use demo */ }
  }

  const firstDay = getFirstDayOfMonth(year, month)
  const blanks = firstDay === 0 ? 6 : firstDay - 1 // start on Monday
  const totalCells = blanks + daysInMonth
  const rows = Math.ceil(totalCells / 7)

  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Upcoming deadlines (tasks with due dates this month)
  const deadlines = tasks.filter((t) => t.due_date && !t.done)
    .sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''))

  return (
    <PageShell title={monthName} subtitle="month view">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        {/* Calendar grid */}
        <div className="bg-card border border-rule rounded-sm overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-rule">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="px-2 py-2 text-center font-mono text-[9px] text-ink-4 uppercase tracking-[0.3px]">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {Array.from({ length: rows * 7 }, (_, i) => {
              const dayNum = i - blanks + 1
              const isValid = dayNum >= 1 && dayNum <= daysInMonth
              const iso = isValid ? `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` : ''
              const isToday = iso === todayISO
              const dayTasks = isValid ? tasks.filter((t) => t.due_date === iso) : []
              const dayBlocks = isValid ? blocks.filter((b) => b.start_ts.startsWith(iso)) : []
              const dots = dayTasks.length + dayBlocks.length

              return (
                <div
                  key={i}
                  className={`min-h-[72px] p-1.5 border-b border-r border-rule-2 last-of-type:border-b-0 ${isValid ? '' : 'opacity-20'} ${isToday ? 'bg-accent-soft/30' : ''}`}
                >
                  {isValid && (
                    <>
                      <span className={`font-mono text-xs ${isToday ? 'text-accent font-bold' : 'text-ink-3'}`}>
                        {dayNum}
                      </span>
                      {dots > 0 && (
                        <div className="flex gap-0.5 mt-1 flex-wrap">
                          {dayBlocks.slice(0, 2).map((b, bi) => (
                            <span key={bi} className="w-1.5 h-1.5 rounded-full bg-ink" title={b.title} />
                          ))}
                          {dayTasks.slice(0, 3).map((t, ti) => (
                            <span key={ti} className="w-1.5 h-1.5 rounded-full bg-accent" title={t.text} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Deadline list */}
        <div>
          <SectionTitle>Deadlines this month</SectionTitle>
          <div className="bg-card border border-rule rounded-sm divide-y divide-rule-2">
            {deadlines.length === 0 && (
              <p className="font-body text-sm text-ink-4 italic p-4 text-center">No deadlines.</p>
            )}
            {deadlines.map((task) => (
              <div key={task.id} className="px-3 py-2.5">
                <p className="font-body text-sm text-ink truncate">{task.text}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10px] text-ink-4">{task.due_date}</span>
                  <span className="font-mono text-[9px] text-ink-4 bg-paper-alt px-1.5 py-0.5 rounded-sm uppercase tracking-[0.3px]">
                    {task.project}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
