import { createClient } from '@/lib/supabase/server'
import { DEMO_SCHEDULE, DEMO_TASKS } from '@/lib/demo-data'
import PageShell from '@/components/ui/PageShell'
import type { ScheduleBlock, Task } from '@/lib/types'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'

function getMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstOffset = (first.getDay() + 6) % 7
  const cells: Array<{ num: number; muted: boolean; monthLabel: 'prev' | 'current' | 'next' }> = []

  const prevMonthDays = new Date(year, month, 0).getDate()
  for (let i = 0; i < firstOffset; i++) {
    cells.push({ num: prevMonthDays - firstOffset + i + 1, muted: true, monthLabel: 'prev' })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ num: i, muted: false, monthLabel: 'current' })
  }

  while (cells.length % 7 !== 0) {
    cells.push({ num: cells.length - daysInMonth - firstOffset + 1, muted: true, monthLabel: 'next' })
  }

  while (cells.length < 42) {
    cells.push({ num: cells.length - daysInMonth - firstOffset + 1, muted: true, monthLabel: 'next' })
  }

  return { cells, daysInMonth }
}

function isoForCell(year: number, month: number, cell: { num: number; muted: boolean; monthLabel: 'prev' | 'current' | 'next' }) {
  if (cell.monthLabel === 'current') {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.num).padStart(2, '0')}`
  }
  if (cell.monthLabel === 'prev') {
    const date = new Date(year, month - 1, cell.num)
    return date.toISOString().split('T')[0]
  }
  const date = new Date(year, month + 1, cell.num)
  return date.toISOString().split('T')[0]
}

function formatMonthTitle(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

type Marker = {
  label: string
  kind: 'deadline' | 'work' | 'social' | 'health'
}

function markerKindClass(kind: Marker['kind']) {
  if (kind === 'deadline') return 'bg-[#B45B47]'
  if (kind === 'work') return 'bg-accent'
  if (kind === 'health') return 'bg-[#8E6C3C]'
  return 'bg-ink-3'
}

export default async function MonthPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const todayIso = now.toISOString().split('T')[0]
  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`

  let tasks: Task[] = DEMO_TASKS
  let blocks: ScheduleBlock[] = DEMO_SCHEDULE

  if (hasSupabasePublicEnv()) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const [taskResult, blockResult] = await Promise.all([
          supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .gte('due_date', monthStart)
            .lte('due_date', monthEnd)
            .order('due_date'),
          supabase
            .from('schedule_blocks')
            .select('*')
            .eq('user_id', user.id)
            .gte('start_ts', `${monthStart}T00:00:00`)
            .lte('start_ts', `${monthEnd}T23:59:59`)
            .order('start_ts'),
        ])

        if (taskResult.data) tasks = taskResult.data as Task[]
        if (blockResult.data) blocks = blockResult.data as ScheduleBlock[]
      }
    } catch {
      // fall back to demo data
    }
  }

  const { cells } = getMonthGrid(year, month)

  const markersByDay = new Map<string, Marker[]>()

  tasks.forEach((task) => {
    if (!task.due_date) return
    const kind: Marker['kind'] = task.priority === 1 ? 'deadline' : task.project === 'Health' ? 'health' : task.project === 'Business' ? 'work' : 'social'
    const current = markersByDay.get(task.due_date) ?? []
    current.push({ label: task.text, kind })
    markersByDay.set(task.due_date, current)
  })

  blocks.forEach((block) => {
    const date = block.start_ts.split('T')[0]
    const current = markersByDay.get(date) ?? []
    const kind: Marker['kind'] = block.kind === 'meeting' || block.kind === 'focus' ? 'work' : block.kind === 'wellness' ? 'health' : 'social'
    current.push({ label: block.title, kind })
    markersByDay.set(date, current)
  })

  const deadlines = tasks
    .filter((task) => task.due_date && !task.done)
    .sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''))

  return (
    <PageShell title={formatMonthTitle(now)} subtitle="month view">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px] xl:gap-6">
        <div>
          <div className="overflow-x-auto rounded-sm border border-rule bg-card">
            <div className="grid min-w-[680px] grid-cols-7 border-b border-rule">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.45px] text-ink-4 text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid min-w-[680px] grid-cols-7">
              {cells.map((cell, index) => {
                const iso = isoForCell(year, month, cell)
                const markers = markersByDay.get(iso) ?? []
                const isToday = iso === todayIso
                const visible = markers.slice(0, 2)
                const hiddenCount = Math.max(0, markers.length - 2)

                return (
                  <div
                    key={`${cell.monthLabel}-${cell.num}-${index}`}
                    className={`relative min-h-[88px] border-r border-t border-rule p-2 sm:min-h-[96px] ${((index + 1) % 7 === 0) ? 'border-r-0' : ''} ${cell.muted ? 'opacity-35' : ''} ${isToday ? 'bg-paper-alt' : ''}`}
                  >
                    <div className={`mb-1 font-display italic leading-none ${isToday ? 'text-accent text-[17px] sm:text-[18px]' : 'text-ink text-[14px] sm:text-[15px]'}`}>
                      {cell.num}
                      {isToday && (
                        <svg width="24" height="6" viewBox="0 0 24 6" className="block mt-1">
                          <path d="M1 3 Q 6 1, 12 3 T 23 3" stroke="var(--accent)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>

                    {visible.map((marker, markerIndex) => (
                      <div key={`${marker.label}-${markerIndex}`} className="flex items-center gap-1 mb-1">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${markerKindClass(marker.kind)}`} />
                        <div className="font-body text-[10px] text-ink-2 truncate">{marker.label}</div>
                      </div>
                    ))}

                    {hiddenCount > 0 && (
                      <div className="font-mono text-[9px] text-ink-3 mt-1">+{hiddenCount} more</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.4px] text-ink-3 sm:mt-4">
            {[
              { label: 'work', kind: 'work' as const },
              { label: 'deadline', kind: 'deadline' as const },
              { label: 'social', kind: 'social' as const },
              { label: 'health', kind: 'health' as const },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${markerKindClass(item.kind)}`} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border border-rule bg-card p-4">
            <p className="mono-label text-ink-4 mb-3">Deadlines this month</p>
            <div className="space-y-3">
              {deadlines.length === 0 && (
                <p className="font-body text-sm text-ink-4 italic">No deadlines this month.</p>
              )}

              {deadlines.map((task) => (
                <div key={task.id} className="pb-3 border-b border-dashed border-rule last:border-b-0 last:pb-0">
                  <p className="font-body text-sm text-ink">{task.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] text-ink-4">{task.due_date}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.35px] text-ink-4 bg-paper-alt px-1.5 py-0.5 rounded-sm">
                      {task.project}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-rule bg-card p-4">
            <p className="mono-label text-ink-4 mb-2">Month notes</p>
            <p className="font-display italic text-lg text-ink leading-snug">
              A slower month, but several sharp edges. Protect the business deadlines and keep the rest spacious.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
