import { createClient } from '@/lib/supabase/server'
import { DEMO_SCHEDULE, DEMO_TASKS } from '@/lib/demo-data'
import PageShell from '@/components/ui/PageShell'
import type { ScheduleBlock, Task } from '@/lib/types'

function getWeekDays(date: Date) {
  const start = new Date(date)
  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diff)

  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(start)
    next.setDate(start.getDate() + index)
    return next
  })
}

function formatTimeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase()
}

function formatWeekLabel(days: Date[]) {
  return `Week of ${days[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
}

function weekNumber(date: Date) {
  const first = new Date(date.getFullYear(), 0, 1)
  const diff = Math.floor((date.getTime() - first.getTime()) / 86400000)
  return Math.ceil((diff + first.getDay() + 1) / 7)
}

const WEEKLY_INTENTIONS = [
  { label: 'Ship', text: 'Chen proposal draft to team by Friday' },
  { label: 'Nurture', text: 'One long walk and two unhurried meals' },
  { label: 'Rest', text: 'No screens after 9pm at least three nights' },
]

export default async function WeekPage() {
  const today = new Date()
  const weekDays = getWeekDays(today)
  const todayIso = today.toISOString().split('T')[0]
  const weekStart = weekDays[0].toISOString().split('T')[0]
  const weekEnd = weekDays[6].toISOString().split('T')[0]

  let tasks: Task[] = DEMO_TASKS
  let blocks: ScheduleBlock[] = DEMO_SCHEDULE

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const [taskResult, blockResult] = await Promise.all([
          supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .gte('due_date', weekStart)
            .lte('due_date', weekEnd)
            .order('due_date'),
          supabase
            .from('schedule_blocks')
            .select('*')
            .eq('user_id', user.id)
            .gte('start_ts', `${weekStart}T00:00:00`)
            .lte('start_ts', `${weekEnd}T23:59:59`)
            .order('start_ts'),
        ])

        if (taskResult.data) tasks = taskResult.data as Task[]
        if (blockResult.data) blocks = blockResult.data as ScheduleBlock[]
      }
    } catch {
      // fall back to demo data
    }
  }

  return (
    <PageShell title={formatWeekLabel(weekDays)} subtitle={`week ${weekNumber(today)} of 52`}>
      <div className="border border-rule bg-card overflow-x-auto">
        <div className="grid grid-cols-1 xl:grid-cols-7 min-w-[760px]">
          {weekDays.map((day, index) => {
            const iso = day.toISOString().split('T')[0]
            const isToday = iso === todayIso
            const dayBlocks = blocks.filter((block) => block.start_ts.startsWith(iso))
            const dayTasks = tasks.filter((task) => task.due_date === iso)

            return (
              <section
                key={iso}
                className={`min-h-[360px] p-3 xl:p-3.5 ${index < 6 ? 'xl:border-r xl:border-rule' : ''} ${index > 0 ? 'border-t xl:border-t-0 border-rule' : ''} ${isToday ? 'bg-paper-alt' : ''}`}
              >
                <div className="pb-2 mb-3 border-b border-rule flex items-end justify-between gap-3">
                  <div>
                    <p className={`font-mono text-[10px] uppercase tracking-[0.45px] ${isToday ? 'text-accent' : 'text-ink-4'}`}>
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className={`font-display italic text-[24px] leading-none mt-1 ${isToday ? 'text-accent' : 'text-ink'}`}>
                      {day.getDate()}
                    </p>
                  </div>

                  {isToday && (
                    <span className="font-mono text-[8px] uppercase tracking-[0.45px] text-accent">
                      today
                    </span>
                  )}
                </div>

                {dayBlocks.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {dayBlocks.map((block) => (
                      <div key={block.id} className="flex items-baseline gap-2">
                        <span className="w-12 shrink-0 font-mono text-[10px] text-ink-4">
                          {formatTimeLabel(block.start_ts)}
                        </span>
                        <span className="font-body text-[11.5px] text-ink truncate">
                          {block.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {dayBlocks.length > 0 && dayTasks.length > 0 && (
                  <div className="border-t border-dashed border-rule my-3" />
                )}

                <div className="space-y-2">
                  {dayTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-2">
                      <div className="w-[10px] h-[10px] mt-1 shrink-0 rounded-[2px] border border-ink-3" />
                      <span className={`font-body text-[11.5px] leading-[1.35] ${task.done ? 'text-ink-4 line-through' : 'text-ink'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>

                {dayBlocks.length === 0 && dayTasks.length === 0 && (
                  <p className="pt-5 text-center font-display italic text-sm text-ink-4">open</p>
                )}
              </section>
            )
          })}
        </div>
      </div>

      <div className="mt-5 bg-card border border-rule p-5">
        <p className="mono-label text-ink-4 mb-3">This week&apos;s intentions</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WEEKLY_INTENTIONS.map((item) => (
            <div key={item.label} className="border-l-2 border-accent pl-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.45px] text-accent mb-1.5">{item.label}</p>
              <p className="font-display italic text-[15px] text-ink leading-snug">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
