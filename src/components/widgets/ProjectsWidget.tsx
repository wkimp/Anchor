import { Folder } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import type { Project } from '@/lib/types'

export default function ProjectsWidget({ projects }: { projects: Project[] }) {
  const active = projects.filter((project) => project.progress < 100)

  return (
    <Widget icon={<Folder size={14} />} title="Projects" subtitle={`${active.length} active`}>
      <div>
        {projects.slice(0, 4).map((project, index) => (
          <div key={project.id} className={`py-3 ${index === projects.slice(0, 4).length - 1 ? '' : 'border-b border-dashed border-rule'}`}>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="flex-1 font-body text-sm text-ink font-medium">{project.name}</p>
              <span className="font-mono text-[10px] text-ink-4">{project.progress}%</span>
              {project.due_date && <span className="font-mono text-[10px] text-ink-4">{project.due_date}</span>}
            </div>
            <div className="h-1 bg-rule overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Widget>
  )
}
