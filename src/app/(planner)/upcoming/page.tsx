import { createClient } from '@/lib/supabase/server'
import { DEMO_TASKS } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import type { Task } from '@/lib/types'

function groupByWeek(tasks: Task[]) {
  const groups: Record<string, Task[]> = {}
  tasks.forEach((t) => {
    const key = t.due_date ?? 'No date'
    if (!groups[key]) groups[key] = []
    groups[key].push(t)
  })
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
}

export default async function UpcomingPage() {
  const today = new Date().toISOString().split('T')[0]
  let tasks: Task[] = DEMO_TASKS.filter((t) => t.due_date && t.due_date >= today && !t.done)

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
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
    } catch { /* use demo */ }
  }

  const groups = groupByWeek(tasks)

  return (
    <PageShell title="Upcoming" subtitle={`${tasks.length} items`}>
      {groups.length === 0 && (
        <p className="font-body text-sm text-ink-4 italic py-8 text-center">
          Nothing upcoming. You&rsquo;re all clear.
        </p>
      )}
      {groups.map(([date, items]) => (
        <div key={date}>
          <SectionTitle>{date}</SectionTitle>
          <div className="bg-card border border-rule rounded-sm divide-y divide-rule-2 mb-4">
            {items.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1">
                  <p className="font-body text-sm text-ink">{task.text}</p>
                  <p className="font-mono text-[10px] text-ink-4 mt-0.5">{task.project}</p>
                </div>
                {task.time && (
                  <span className="font-mono text-[11px] text-ink-3">{task.time}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </PageShell>
  )
}
