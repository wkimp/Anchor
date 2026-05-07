'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import PageShell, { EmptyState, SectionTitle } from '@/components/ui/PageShell'
import InlineStatus from '@/components/ui/InlineStatus'
import HabitsWidget from '@/components/widgets/HabitsWidget'
import { createHabit, deleteHabit, updateHabit } from '@/app/actions/habits'
import type { Habit, HabitLog } from '@/lib/types'

const ICONS = ['circle', 'pen', 'run', 'book', 'moon', 'sparkle', 'heart']

type HabitRow = Habit & {
  streak: number
  weekDone: boolean[]
}

function offsetDate(base: string, days: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function computeStreak(logs: HabitLog[], today: string): number {
  let streak = 0
  let cursor = today
  while (logs.some((log) => log.date === cursor && log.done)) {
    streak++
    cursor = offsetDate(cursor, -1)
  }
  return streak
}

export function HabitsPageClient({
  habits: initialHabits,
  logs,
  today,
  last30,
}: {
  habits: HabitRow[]
  logs: HabitLog[]
  today: string
  last30: string[]
}) {
  const router = useRouter()
  const [habits, setHabits] = useState<HabitRow[]>(initialHabits)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const longestStreak = Math.max(...habits.map((habit) => habit.streak), 0)
  const completedToday = habits.filter((habit) => habit.weekDone[6]).length

  const logsByHabit = useMemo(() => {
    const map = new Map<string, HabitLog[]>()
    for (const log of logs) {
      const bucket = map.get(log.habit_id) ?? []
      bucket.push(log)
      map.set(log.habit_id, bucket)
    }
    return map
  }, [logs])

  function handleCreate(payload: { name: string; icon: string }) {
    const now = new Date().toISOString()
    const optimistic: HabitRow = {
      id: `tmp-${Date.now()}`,
      user_id: 'demo',
      name: payload.name,
      icon: payload.icon,
      created_at: now,
      streak: 0,
      weekDone: Array(7).fill(false),
    }
    setHabits((current) => [...current, optimistic])
    setCreating(false)
    setMessage('Habit added.')

    startTransition(async () => {
      await createHabit(payload.name, payload.icon)
      router.refresh()
    })
  }

  function handleUpdate(habitId: string, payload: { name: string; icon: string }) {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === habitId ? { ...habit, name: payload.name, icon: payload.icon } : habit,
      ),
    )
    setEditingId(null)
    setMessage('Habit updated.')

    startTransition(async () => {
      await updateHabit(habitId, payload.name, payload.icon)
      router.refresh()
    })
  }

  function handleDelete(habitId: string) {
    setHabits((current) => current.filter((habit) => habit.id !== habitId))
    setEditingId(null)
    setMessage('Habit removed.')

    startTransition(async () => {
      await deleteHabit(habitId)
      router.refresh()
    })
  }

  return (
    <PageShell
      title="Habits"
      subtitle={`${habits.length} tracked · longest streak: ${longestStreak} days`}
      action={(
        <button
          onClick={() => {
            setCreating((current) => !current)
            setEditingId(null)
            setMessage('')
          }}
          className="rounded-sm border border-rule bg-card px-3.5 py-2 font-body text-xs text-ink transition-colors hover:border-ink cursor-pointer"
        >
          {creating ? 'Close' : 'Add habit'}
        </button>
      )}
    >
      {creating && (
        <HabitEditorCard
          title="Add a habit to keep warm"
          submitLabel="Save habit"
          pending={isPending}
          onCancel={() => setCreating(false)}
          onSubmit={handleCreate}
        />
      )}

      {(message || isPending) && (
        <InlineStatus
          tone={isPending ? 'info' : 'success'}
          message={isPending ? 'Refreshing habit progress…' : message}
        />
      )}

      <div className="mb-6 grid grid-cols-2 gap-[var(--gap)] xl:grid-cols-4">
        <StatCard label="Tracked" big={String(habits.length)} sub="habits in rotation" />
        <StatCard label="Done today" big={String(completedToday)} sub={`${Math.max(habits.length - completedToday, 0)} still open`} />
        <StatCard label="Longest streak" big={`${longestStreak}`} sub="days in a row" />
        <StatCard label="Most consistent" big={habits[0]?.name ?? '—'} sub={habits[0] ? `${habits[0].streak} day streak` : 'no habits yet'} />
      </div>

      <SectionTitle>This week</SectionTitle>
      {habits.length === 0 ? (
        <EmptyState
          title="No habits yet."
          body="Start with one or two tiny repeats you want to actually keep, then let the week view make the pattern visible."
        />
      ) : (
        <div className="space-y-3">
          <HabitsWidget habits={habits} todayDate={today} />
          <div className="rounded-sm border border-rule bg-card divide-y divide-dashed divide-rule">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-body text-sm font-medium text-ink">{habit.name}</p>
                    <span className="rounded-sm bg-paper-alt px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.3px] text-ink-4">
                      {habit.icon}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-ink-3">
                    {habit.streak} day streak · {habit.weekDone.filter(Boolean).length}/7 this week
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingId(habit.id)
                    setCreating(false)
                    setMessage('')
                  }}
                  className="rounded-sm border border-rule bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3px] text-ink-3 transition-colors hover:border-ink hover:text-ink cursor-pointer"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <SectionTitle>30-day grid</SectionTitle>
      {habits.length === 0 ? (
        <EmptyState
          title="Nothing to chart yet."
          body="Once you add a habit and start checking it off, the month grid will show the pattern at a glance."
        />
      ) : (
        <div className="overflow-x-auto rounded-sm border border-rule bg-card p-5">
          {habits.map((habit) => {
            const habitLogs = logsByHabit.get(habit.id) ?? []
            const isEditing = editingId === habit.id

            if (isEditing) {
              return (
                <div key={habit.id} className="mb-4 last:mb-0">
                  <HabitEditorCard
                    title={`Edit ${habit.name}`}
                    submitLabel="Save changes"
                    pending={isPending}
                    initialName={habit.name}
                    initialIcon={habit.icon}
                    onCancel={() => setEditingId(null)}
                    onSubmit={(payload) => handleUpdate(habit.id, payload)}
                    onDelete={() => handleDelete(habit.id)}
                    embedded
                  />
                </div>
              )
            }

            return (
              <div key={habit.id} className="mb-2 flex items-center gap-2 last:mb-0">
                <span className="w-36 flex-shrink-0 truncate font-body text-sm text-ink-2">{habit.name}</span>
                <div className="flex gap-0.5">
                  {last30.map((date) => {
                    const done = habitLogs.some((log) => log.date === date && log.done)
                    return (
                      <div
                        key={date}
                        title={date}
                        className={`h-3 w-3 rounded-sm ${done ? 'bg-accent' : 'bg-rule'}`}
                      />
                    )
                  })}
                </div>
                <span className="ml-2 w-8 font-mono text-[11px] text-ink-3">{computeStreak(habitLogs, today)}d</span>
              </div>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}

function StatCard({ label, big, sub }: { label: string; big: string; sub: string }) {
  return (
    <div className="rounded-sm border border-rule bg-card p-4">
      <p className="mono-label mb-2 text-ink-4">{label}</p>
      <p className="font-display text-[30px] italic leading-none text-ink">{big}</p>
      <p className="mt-2 font-mono text-[10px] text-ink-3">{sub}</p>
    </div>
  )
}

function HabitEditorCard({
  title,
  submitLabel,
  pending,
  initialName = '',
  initialIcon = 'circle',
  onCancel,
  onSubmit,
  onDelete,
  embedded = false,
}: {
  title: string
  submitLabel: string
  pending: boolean
  initialName?: string
  initialIcon?: string
  onCancel: () => void
  onSubmit: (payload: { name: string; icon: string }) => void
  onDelete?: () => void
  embedded?: boolean
}) {
  const [name, setName] = useState(initialName)
  const [icon, setIcon] = useState(initialIcon)

  return (
    <div className={`${embedded ? '' : 'mb-[var(--gap)]'} rounded-sm border border-rule bg-card p-4 sm:p-5`}>
      <p className="mb-3 font-display text-xl italic text-ink">{title}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!name.trim()) return
          onSubmit({ name: name.trim(), icon })
        }}
        className="space-y-3"
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Habit name"
          className="w-full rounded-sm border border-rule bg-paper-alt px-3 py-2 font-body text-sm text-ink outline-none placeholder-ink-4"
        />

        <div className="rounded-sm border border-rule bg-paper-alt p-3">
          <p className="mb-2 font-body text-sm text-ink-2">Icon label</p>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setIcon(option)}
                className={`rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3px] transition-colors cursor-pointer ${
                  icon === option ? 'bg-ink text-paper' : 'bg-card text-ink-3 hover:text-ink'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
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
              Delete habit
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
