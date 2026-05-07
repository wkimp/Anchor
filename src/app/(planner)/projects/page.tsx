import { createClient } from '@/lib/supabase/server'
import { DEMO_PROJECTS } from '@/lib/demo-data'
import PageShell from '@/components/ui/PageShell'
import type { Project } from '@/lib/types'

type ProjectMeta = {
  area: string
  next: string
  note: string
  tasks: number
  done: number
}

const PROJECT_META: Record<string, ProjectMeta> = {
  'Chen proposal': {
    area: 'Business',
    next: 'Write the diagnostic section',
    note: 'Lead with outcomes. Reference the 2024 engagement.',
    tasks: 7,
    done: 3,
  },
  'Studio website': {
    area: 'Business',
    next: 'Finalize color palette with Dev',
    note: 'Hold on layout until copy lands.',
    tasks: 14,
    done: 3,
  },
  'Spring garden': {
    area: 'Home',
    next: 'Plant the calendula this weekend',
    note: 'Tomatoes in by May 1.',
    tasks: 5,
    done: 4,
  },
  'Tax filing': {
    area: 'Finance',
    next: 'Done — archive folder',
    note: 'Filed Apr 14. Refund expected in about 3 weeks.',
    tasks: 4,
    done: 4,
  },
}

function formatDue(date: string | null) {
  if (!date) return 'Ongoing'
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function enrichedProjects(projects: Project[]) {
  return projects.map((project) => {
    const meta = PROJECT_META[project.name] ?? {
      area: 'General',
      next: 'Define the next meaningful step',
      note: 'Add supporting notes to make this project easier to resume.',
      tasks: Math.max(4, Math.ceil(project.progress / 12)),
      done: Math.round((project.progress / 100) * Math.max(4, Math.ceil(project.progress / 12))),
    }

    return { ...project, ...meta }
  })
}

export default async function ProjectsPage() {
  let projects: Project[] = DEMO_PROJECTS

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (data?.length) projects = data as Project[]
      }
    } catch {
      // use demo projects
    }
  }

  const rows = enrichedProjects(projects)
  const active = rows.filter((project) => project.progress < 100)
  const complete = rows.filter((project) => project.progress >= 100)

  return (
    <PageShell
      title="Projects"
      subtitle={`${active.length} active · ${complete.length} complete`}
      action={(
        <button className="px-3.5 py-2 border border-ink bg-ink text-paper rounded-sm font-body text-xs hover:opacity-90 transition-opacity cursor-pointer">
          New project
        </button>
      )}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[var(--gap)]">
        {rows.map((project) => {
          const isDone = project.progress >= 100
          const urgent = project.due_date && new Date(project.due_date) < new Date(Date.now() + 8 * 86400000) && !isDone

          return (
            <article
              key={project.id}
              className={`bg-card border border-rule rounded-sm p-5 ${isDone ? 'opacity-65' : ''}`}
            >
              <div className="flex items-baseline gap-3 mb-1">
                <h2 className={`flex-1 font-display italic text-[20px] text-ink leading-tight ${isDone ? 'line-through' : ''}`}>
                  {project.name}
                </h2>
                <span className="px-2 py-0.5 bg-paper-alt font-mono text-[9px] uppercase tracking-[0.4px] text-ink-4">
                  {project.area}
                </span>
              </div>

              <p className={`font-mono text-[11px] mb-4 ${urgent ? 'text-[#B45B47]' : 'text-ink-3'}`}>
                due {formatDue(project.due_date)} · {project.done}/{project.tasks} tasks
              </p>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: project.tasks }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 ${index < project.done ? 'bg-accent' : 'bg-rule'}`}
                  />
                ))}
              </div>

              <div className={`bg-paper-alt border-l-2 p-3 ${isDone ? 'border-ink-4' : 'border-accent'}`}>
                <p className="font-mono text-[9px] uppercase tracking-[0.45px] text-ink-3 mb-1.5">Next</p>
                <p className="font-body text-sm text-ink mb-2">{project.next}</p>
                <p className="font-display italic text-[12px] leading-relaxed text-ink-3">
                  &ldquo;{project.note}&rdquo;
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </PageShell>
  )
}
