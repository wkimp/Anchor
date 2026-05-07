'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import PageShell, { EmptyState } from '@/components/ui/PageShell'
import InlineStatus from '@/components/ui/InlineStatus'
import { createProject, deleteProject, updateProject } from '@/app/actions/projects'
import type { Project } from '@/lib/types'

type ProjectMeta = {
  area: string
  next: string
  note: string
  tasks: number
  done: number
}

type EditableProject = Project & ProjectMeta

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
      tasks: Math.max(4, Math.ceil(Math.max(project.progress, 20) / 12)),
      done: Math.round((project.progress / 100) * Math.max(4, Math.ceil(Math.max(project.progress, 20) / 12))),
    }

    return { ...project, ...meta }
  })
}

export function ProjectsPageClient({ projects: initialProjects }: { projects: Project[] }) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const rows = useMemo(() => enrichedProjects(projects), [projects])
  const active = rows.filter((project) => project.progress < 100)
  const complete = rows.filter((project) => project.progress >= 100)

  function handleCreate(payload: { name: string; due_date: string; progress: number }) {
    const now = new Date().toISOString()
    const optimistic: Project = {
      id: `tmp-${Date.now()}`,
      user_id: 'demo',
      name: payload.name,
      due_date: payload.due_date || null,
      progress: payload.progress,
      created_at: now,
      updated_at: now,
    }
    setProjects((current) => [optimistic, ...current])
    setCreating(false)
    setMessage('Project added.')

    startTransition(async () => {
      await createProject(payload)
      router.refresh()
    })
  }

  function handleUpdate(projectId: string, payload: { name: string; due_date: string; progress: number }) {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, name: payload.name, due_date: payload.due_date || null, progress: payload.progress }
          : project,
      ),
    )
    setEditingId(null)
    setMessage('Project updated.')

    startTransition(async () => {
      await updateProject(projectId, payload)
      router.refresh()
    })
  }

  function handleDelete(projectId: string) {
    setProjects((current) => current.filter((project) => project.id !== projectId))
    setEditingId(null)
    setMessage('Project removed.')

    startTransition(async () => {
      await deleteProject(projectId)
      router.refresh()
    })
  }

  return (
    <PageShell
      title="Projects"
      subtitle={`${active.length} active · ${complete.length} complete`}
      action={(
        <button
          onClick={() => {
            setCreating((current) => !current)
            setEditingId(null)
            setMessage('')
          }}
          className="w-full rounded-sm border border-ink bg-ink px-3.5 py-2 font-body text-xs text-paper transition-opacity hover:opacity-90 sm:w-auto cursor-pointer"
        >
          {creating ? 'Close' : 'New project'}
        </button>
      )}
    >
      {creating && (
        <ProjectEditorCard
          title="Start a new project"
          submitLabel="Save project"
          pending={isPending}
          onCancel={() => setCreating(false)}
          onSubmit={handleCreate}
        />
      )}

      {(message || isPending) && (
        <InlineStatus
          tone={isPending ? 'info' : 'success'}
          message={isPending ? 'Updating project details…' : message}
        />
      )}

      {rows.length === 0 ? (
        <EmptyState
          title="No projects yet."
          body="Start with one outcome you want to move forward this month, then give it a due date or a rough level of progress."
        />
      ) : (
        <div className="grid grid-cols-1 gap-[var(--gap)] xl:grid-cols-2">
          {rows.map((project) => {
            const isDone = project.progress >= 100
            const urgent = project.due_date && new Date(project.due_date) < new Date(Date.now() + 8 * 86400000) && !isDone
            const isEditing = editingId === project.id

            if (isEditing) {
              return (
                <ProjectEditorCard
                  key={project.id}
                  title={`Edit ${project.name}`}
                  submitLabel="Save changes"
                  pending={isPending}
                  initialName={project.name}
                  initialDueDate={project.due_date ?? ''}
                  initialProgress={project.progress}
                  onCancel={() => setEditingId(null)}
                  onSubmit={(payload) => handleUpdate(project.id, payload)}
                  onDelete={() => handleDelete(project.id)}
                />
              )
            }

            return (
              <article
                key={project.id}
                className={`rounded-sm border border-rule bg-card p-4 sm:p-5 ${isDone ? 'opacity-65' : ''}`}
              >
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className={`font-display italic text-[20px] text-ink leading-tight ${isDone ? 'line-through' : ''}`}>
                      {project.name}
                    </h2>
                    <p className={`mt-2 font-mono text-[11px] leading-relaxed ${urgent ? 'text-[#B45B47]' : 'text-ink-3'}`}>
                      due {formatDue(project.due_date)} · {project.done}/{project.tasks} tasks
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-fit bg-paper-alt px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.4px] text-ink-4">
                      {project.area}
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(project.id)
                        setCreating(false)
                        setMessage('')
                      }}
                      className="rounded-sm border border-rule bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3px] text-ink-3 transition-colors hover:border-ink hover:text-ink cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <div className="mb-4 flex gap-1">
                  {Array.from({ length: project.tasks }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 ${index < project.done ? 'bg-accent' : 'bg-rule'}`}
                    />
                  ))}
                </div>

                <div className={`border-l-2 bg-paper-alt p-3 ${isDone ? 'border-ink-4' : 'border-accent'}`}>
                  <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.45px] text-ink-3">Next</p>
                  <p className="mb-2 font-body text-sm text-ink">{project.next}</p>
                  <p className="font-display text-[12px] italic leading-relaxed text-ink-3">
                    &ldquo;{project.note}&rdquo;
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}

function ProjectEditorCard({
  title,
  submitLabel,
  pending,
  initialName = '',
  initialDueDate = '',
  initialProgress = 0,
  onCancel,
  onSubmit,
  onDelete,
}: {
  title: string
  submitLabel: string
  pending: boolean
  initialName?: string
  initialDueDate?: string
  initialProgress?: number
  onCancel: () => void
  onSubmit: (payload: { name: string; due_date: string; progress: number }) => void
  onDelete?: () => void
}) {
  const [name, setName] = useState(initialName)
  const [dueDate, setDueDate] = useState(initialDueDate)
  const [progress, setProgress] = useState(initialProgress)

  return (
    <div className="mb-[var(--gap)] rounded-sm border border-rule bg-card p-4 sm:p-5">
      <p className="mb-3 font-display text-xl italic text-ink">{title}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!name.trim()) return
          onSubmit({ name: name.trim(), due_date: dueDate, progress })
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.6fr_1fr]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Project name"
            aria-label="Project name"
            className="w-full rounded-sm border border-rule bg-paper-alt px-3 py-2 font-body text-sm text-ink outline-none placeholder-ink-4"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            aria-label="Project due date"
            className="w-full rounded-sm border border-rule bg-paper-alt px-3 py-2 font-body text-sm text-ink outline-none"
          />
        </div>

        <div className="rounded-sm border border-rule bg-paper-alt p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="font-body text-sm text-ink-2">Progress</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3px] text-ink-4">{progress}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={progress}
            onChange={(event) => setProgress(Number(event.target.value))}
            aria-label="Project progress"
            className="w-full accent-[var(--accent)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={pending || !name.trim()}
            className="rounded-sm bg-ink px-3 py-1.5 font-body text-xs text-paper transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {submitLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="font-body text-xs text-ink-3 transition-colors hover:text-ink cursor-pointer"
          >
            Cancel
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="ml-auto rounded-sm border border-rule px-3 py-1.5 font-body text-xs text-[#B45B47] transition-colors hover:border-[#B45B47] cursor-pointer"
            >
              Delete project
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
