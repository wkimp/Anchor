import { createClient } from '@/lib/supabase/server'
import { DEMO_PROJECTS } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import type { Project } from '@/lib/types'

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
    } catch { /* use demo */ }
  }

  const active = projects.filter((p) => p.progress < 100)
  const done = projects.filter((p) => p.progress >= 100)

  return (
    <PageShell
      title="Projects"
      subtitle={`${active.length} active · ${done.length} complete`}
    >
      <SectionTitle>Active</SectionTitle>
      <div className="space-y-3">
        {active.map((p) => (
          <ProjectRow key={p.id} project={p} />
        ))}
        {active.length === 0 && (
          <p className="font-body text-sm text-ink-4 italic py-4">No active projects.</p>
        )}
      </div>

      {done.length > 0 && (
        <>
          <SectionTitle>Complete</SectionTitle>
          <div className="space-y-3 opacity-60">
            {done.map((p) => <ProjectRow key={p.id} project={p} />)}
          </div>
        </>
      )}
    </PageShell>
  )
}

function ProjectRow({ project }: { project: Project }) {
  const isOverdue = project.due_date && new Date(project.due_date) < new Date() && project.progress < 100
  return (
    <div className="bg-card border border-rule rounded-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-body text-sm font-medium text-ink">{project.name}</h3>
          {project.due_date && (
            <p className={`font-mono text-[10px] mt-0.5 ${isOverdue ? 'text-[#B45B47]' : 'text-ink-4'}`}>
              Due {project.due_date}
              {isOverdue && ' — overdue'}
            </p>
          )}
        </div>
        <span className="font-mono text-[11px] text-ink-3 flex-shrink-0">{project.progress}%</span>
      </div>
      <div className="mt-3 h-1.5 bg-rule rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all"
          style={{ width: `${project.progress}%` }}
        />
      </div>
    </div>
  )
}
