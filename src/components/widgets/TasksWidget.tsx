'use client'

import { useState, useTransition, useOptimistic } from 'react'
import { useRouter } from 'next/navigation'
import { CheckSquare, Check, Trash2 } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import { createTask, toggleTask, deleteTask } from '@/app/actions/tasks'
import type { Task, Priority } from '@/lib/types'

const PRIORITY_LABEL: Record<Priority, string> = { 1: '!', 2: '·', 3: '' }
const PRIORITY_OPTIONS: Priority[] = [1, 2, 3]

interface Props {
  tasks: Task[]
}

type Filter = 'all' | 'open' | 'p1' | 'done'

export default function TasksWidget({ tasks }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('open')
  const [draft, setDraft] = useState('')
  const [draftProject, setDraftProject] = useState('Inbox')
  const [draftPriority, setDraftPriority] = useState<Priority>(2)
  const [isPending, startTransition] = useTransition()

  const [optimisticTasks, updateOptimistic] = useOptimistic(
    tasks,
    (state, { id, done }: { id: string; done: boolean }) =>
      state.map((t) => (t.id === id ? { ...t, done } : t)),
  )

  const filtered = optimisticTasks.filter((t) => {
    if (filter === 'open') return !t.done
    if (filter === 'done') return t.done
    if (filter === 'p1') return t.priority === 1 && !t.done
    return true
  })

  const openCount = optimisticTasks.filter((t) => !t.done).length
  const doneCount = optimisticTasks.filter((t) => t.done).length

  function handleToggle(task: Task) {
    startTransition(async () => {
      updateOptimistic({ id: task.id, done: !task.done })
      await toggleTask(task.id, !task.done)
      router.refresh()
    })
  }

  function handleDelete(taskId: string) {
    startTransition(async () => {
      await deleteTask(taskId)
      router.refresh()
    })
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return

    const nextText = draft.trim()
    const nextProject = draftProject.trim() || 'Inbox'
    const nextPriority = draftPriority

    setDraft('')
    setDraftProject('Inbox')
    setDraftPriority(2)

    startTransition(async () => {
      await createTask({
        text: nextText,
        project: nextProject,
        priority: nextPriority,
      })
      router.refresh()
    })
  }

  return (
    <Widget
      icon={<CheckSquare size={14} />}
      title="Tasks"
      subtitle={`${openCount} open · ${doneCount} done`}
    >
      <form onSubmit={handleCreate} className="mb-3 rounded-sm border border-rule bg-paper-alt/70 p-3">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a task for today…"
            className="min-w-0 flex-1 bg-transparent border-none font-body text-sm text-ink outline-none placeholder-ink-4"
          />
          <button
            type="submit"
            disabled={isPending || !draft.trim()}
            className="rounded-sm bg-ink px-2.5 py-1.5 font-body text-[11px] text-paper transition-opacity hover:opacity-90 disabled:opacity-45 cursor-pointer"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            value={draftProject}
            onChange={(event) => setDraftProject(event.target.value)}
            placeholder="Project"
            className="min-w-[110px] flex-1 rounded-sm border border-rule bg-card px-2 py-1.5 font-body text-xs text-ink outline-none placeholder-ink-4"
          />
          <div className="flex gap-1 rounded-sm border border-rule bg-card p-0.5">
            {PRIORITY_OPTIONS.map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => setDraftPriority(priority)}
                className={`rounded-sm px-2 py-1 font-mono text-[10px] transition-colors cursor-pointer ${
                  draftPriority === priority ? 'bg-ink text-paper' : 'text-ink-3 hover:text-ink'
                }`}
              >
                {priority === 1 ? 'P1' : priority === 2 ? 'P2' : 'P3'}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Filters */}
      <div className="flex gap-1 mb-3">
        {(['all', 'open', 'p1', 'done'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 text-[10.5px] font-body uppercase tracking-[0.5px] font-medium rounded-sm cursor-pointer transition-colors ${
              filter === f ? 'bg-paper-alt text-ink' : 'text-ink-3 hover:text-ink'
            }`}
          >
            {f === 'p1' ? '!' : f}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div>
        {filtered.length === 0 && (
          <div className="rounded-sm border border-dashed border-rule bg-paper-alt/35 px-4 py-5 text-center">
            <p className="font-display text-base italic text-ink-3">
              {filter === 'open' ? 'All clear.' : 'Nothing here.'}
            </p>
            <p className="mt-1 font-body text-xs leading-relaxed text-ink-4">
              {filter === 'open' ? 'Add the next small thing so the page stays alive.' : 'Try a different filter or capture something new above.'}
            </p>
          </div>
        )}
        {filtered.map((task, idx) => (
          <TaskRow
            key={task.id}
            task={task}
            isLast={idx === filtered.length - 1}
            onToggle={() => handleToggle(task)}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </div>
    </Widget>
  )
}

function TaskRow({
  task,
  isLast,
  onToggle,
  onDelete,
}: {
  task: Task
  isLast: boolean
  onToggle: () => void
  onDelete: () => void
}) {
  const prioColor = task.priority === 1 ? 'text-accent' : task.priority === 2 ? 'text-ink-3' : 'text-ink-4'

  return (
    <div
      className={`group flex items-center gap-2.5 py-2 ${
        !isLast ? 'border-b border-dashed border-rule' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-[18px] h-[18px] rounded-sm border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
          task.done
            ? 'border-complete bg-complete text-card'
            : 'border-ink-3 bg-transparent hover:border-ink'
        }`}
      >
        {task.done && <Check size={11} />}
      </button>

      <span className={`font-display italic text-sm w-2 text-center flex-shrink-0 ${prioColor} ${task.done ? 'opacity-30' : ''}`}>
        {PRIORITY_LABEL[task.priority]}
      </span>

      <div className="flex-1 min-w-0">
        <span
          className={`font-body text-sm text-ink ${
            task.done ? 'line-through opacity-50' : ''
          } truncate block`}
        >
          {task.text}
        </span>
      </div>

      {task.time && (
        <span className="font-mono text-[11px] text-ink-3 flex-shrink-0">
          {task.time}
        </span>
      )}

      <span className="font-body text-[10.5px] text-ink-3 bg-paper-alt px-1.5 py-0.5 rounded-sm uppercase tracking-[0.5px] flex-shrink-0">
        {task.project}
      </span>

      <button
        onClick={onDelete}
        className="opacity-0 transition-opacity text-ink-4 hover:text-[#B45B47] group-hover:opacity-100 cursor-pointer"
        aria-label="Delete task"
      >
        <Trash2 size={12} />
      </button>
    </div>
  )
}
