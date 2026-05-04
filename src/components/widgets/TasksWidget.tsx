'use client'

import { useState, useTransition, useOptimistic } from 'react'
import { useRouter } from 'next/navigation'
import { CheckSquare, Check, Plus } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import { toggleTask, deleteTask } from '@/app/actions/tasks'
import type { Task, Priority } from '@/lib/types'

const PRIORITY_LABEL: Record<Priority, string> = { 1: '!', 2: '·', 3: '' }

interface Props {
  tasks: Task[]
}

type Filter = 'all' | 'open' | 'p1' | 'done'

export default function TasksWidget({ tasks }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('open')
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

  return (
    <Widget
      icon={<CheckSquare size={14} />}
      title="Tasks"
      subtitle={`${openCount} open · ${doneCount} done`}
    >
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
          <p className="font-body text-sm text-ink-4 py-4 text-center italic">
            {filter === 'open' ? 'All clear.' : 'Nothing here.'}
          </p>
        )}
        {filtered.map((task, idx) => (
          <TaskRow
            key={task.id}
            task={task}
            isLast={idx === filtered.length - 1}
            onToggle={() => handleToggle(task)}
          />
        ))}
      </div>

      {/* Quick add hint */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-rule-2">
        <Plus size={12} className="text-ink-4" />
        <span className="font-body text-xs text-ink-4">
          Use the header bar to add tasks
        </span>
      </div>
    </Widget>
  )
}

function TaskRow({
  task,
  isLast,
  onToggle,
}: {
  task: Task
  isLast: boolean
  onToggle: () => void
}) {
  const prioColor = task.priority === 1 ? 'text-accent' : task.priority === 2 ? 'text-ink-3' : 'text-ink-4'

  return (
    <div
      className={`flex items-center gap-2.5 py-2 ${
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
    </div>
  )
}
