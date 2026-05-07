import { createClient } from '@/lib/supabase/server'
import { DEMO_TASKS } from '@/lib/demo-data'
import PageShell from '@/components/ui/PageShell'
import type { Task } from '@/lib/types'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'

type UpcomingRow = {
  label: string
  time: string | null
  tag: string
}

function formatDayLabel(date: string) {
  const dt = new Date(`${date}T12:00:00`)
  return dt.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function groupUpcoming(tasks: Task[]) {
  const groups: Record<string, UpcomingRow[]> = {}

  tasks.forEach((task) => {
    const key = task.due_date ?? 'No date'
    if (!groups[key]) groups[key] = []
    groups[key].push({
      label: task.text,
      time: task.time ?? null,
      tag: task.project.toLowerCase(),
    })
  })

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({
      date,
      label: date === 'No date' ? 'No date' : formatDayLabel(date),
      items,
    }))
}

function tagClass(tag: string) {
  if (tag === 'business' || tag === 'work') return 'text-accent'
  if (tag === 'health') return 'text-[#8E6C3C]'
  if (tag === 'home' || tag === 'people') return 'text-ink-3'
  return 'text-[#B45B47]'
}

export default async function UpcomingPage() {
  const today = new Date().toISOString().split('T')[0]
  let tasks: Task[] = DEMO_TASKS.filter((t) => t.due_date && t.due_date >= today && !t.done)

  if (hasSupabasePublicEnv()) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('done', false)
          .gte('due_date', today)
          .order('due_date')
        if (data) tasks = data as Task[]
      }
    } catch {
      // fall back to demo mode
    }
  }

  const groups = groupUpcoming(tasks)

  return (
    <PageShell title="Upcoming" subtitle="next 14 days">
      {groups.length === 0 && (
        <div className="bg-card border border-dashed border-rule rounded-sm px-8 py-16 text-center">
          <p className="font-display italic text-xl text-ink-3">Nothing upcoming</p>
          <p className="font-body text-sm text-ink-4 mt-2">Add a due date to a task and it will show up here.</p>
        </div>
      )}

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.date}>
            <div className="font-mono text-[10.5px] text-ink-3 uppercase tracking-[0.35px] pb-2 mb-2 border-b border-rule">
              {group.label}
            </div>

            <div className="bg-card border border-rule rounded-sm">
              {group.items.map((item, index) => (
                <div
                  key={`${group.date}-${item.label}`}
                  className={`flex items-baseline gap-4 px-4 py-3 ${index === group.items.length - 1 ? '' : 'border-b border-dashed border-rule'}`}
                >
                  <div className="w-14 shrink-0 font-mono text-[11px] text-ink-4">
                    {item.time ?? '—'}
                  </div>
                  <div className="flex-1 font-body text-sm text-ink">{item.label}</div>
                  <div className={`shrink-0 font-mono text-[9px] uppercase tracking-[0.45px] ${tagClass(item.tag)}`}>
                    {item.tag}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  )
}
