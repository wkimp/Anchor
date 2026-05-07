'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Flame } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import { toggleHabit } from '@/app/actions/habits'
import type { Habit, HabitLog } from '@/lib/types'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

interface HabitRow extends Habit {
  streak: number
  weekDone: boolean[]
}

interface Props {
  habits: HabitRow[]
  todayDate: string
}

export default function HabitsWidget({ habits, todayDate }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleToggle(habitId: string, dayIndex: number, currentDone: boolean) {
    const d = new Date(todayDate)
    d.setDate(d.getDate() - (6 - dayIndex))
    const dateStr = d.toISOString().split('T')[0]
    startTransition(async () => {
      await toggleHabit(habitId, dateStr, !currentDone)
      router.refresh()
    })
  }

  return (
    <Widget
      icon={<Flame size={14} />}
      title="Habits"
      subtitle="7-day view"
      action={(
        <Link
          href="/habits"
          className="rounded-sm border border-rule bg-paper-alt px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3px] text-ink-3 transition-colors hover:text-ink"
        >
          Open
        </Link>
      )}
    >
      {/* Day header */}
      <div className="flex items-center gap-1 mb-2 pl-[140px]">
        {DAY_LABELS.map((d, i) => (
          <span key={i} className="w-7 text-center font-mono text-[9px] text-ink-4">
            {d}
          </span>
        ))}
        <span className="ml-2 font-mono text-[9px] text-ink-4 w-8 text-right">STR</span>
      </div>

      {habits.length === 0 && (
        <div className="rounded-sm border border-dashed border-rule bg-paper-alt/35 px-4 py-5 text-center">
          <p className="font-display text-base italic text-ink-3">No habits yet.</p>
          <p className="mt-1 font-body text-xs leading-relaxed text-ink-4">
            Start with one small repeat you want to keep visible this week.
          </p>
          <Link
            href="/habits"
            className="mt-3 inline-flex rounded-sm border border-ink bg-ink px-2.5 py-1.5 font-body text-[11px] text-paper transition-opacity hover:opacity-90"
          >
            Add a habit
          </Link>
        </div>
      )}

      {habits.map((habit) => (
        <div key={habit.id} className="flex items-center gap-1 py-1.5 border-b border-rule-2 last:border-b-0">
          <span className="flex-1 font-body text-sm text-ink-2 truncate" style={{ minWidth: 120, maxWidth: 132 }}>
            {habit.name}
          </span>
          <div className="flex gap-1">
            {habit.weekDone.map((done, i) => (
              <button
                key={i}
                onClick={() => handleToggle(habit.id, i, done)}
                disabled={isPending}
                aria-pressed={done}
                aria-label={`${done ? 'Mark incomplete' : 'Mark complete'} for ${habit.name} on ${DAY_LABELS[i]}`}
                className={`w-7 h-7 rounded-sm transition-all cursor-pointer flex items-center justify-center ${
                  done
                    ? 'bg-accent text-paper'
                    : 'bg-paper-alt border border-rule text-ink-4 hover:border-ink-3'
                }`}
              >
                {done && <span className="text-[10px]">✓</span>}
              </button>
            ))}
          </div>
          <span className="ml-2 font-mono text-[11px] text-ink-3 w-8 text-right">
            {habit.streak}
          </span>
        </div>
      ))}
    </Widget>
  )
}
