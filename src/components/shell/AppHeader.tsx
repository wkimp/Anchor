'use client'

import { useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { quickAddTask } from '@/app/actions/tasks'
import type { ViewName } from '@/lib/types'

const VIEWS: ViewName[] = ['Today', 'Week', 'Month', 'All']
const VIEW_ROUTES: Record<ViewName, string> = {
  Today: '/',
  Week: '/week',
  Month: '/month',
  All: '/all',
}

interface Props {
  view: ViewName
  onViewChange: (v: ViewName) => void
  openTaskCount: number
  greetingName: string
}

function parseQuickAdd(text: string): { label: string; kind: 'day' | 'time' | 'text' }[] {
  const chips: { label: string; kind: 'day' | 'time' | 'text' }[] = []
  const dayMatch = text.match(/\b(mon|tue|wed|thu|fri|sat|sun)\w*/i)
  const timeMatch = text.match(/\b(\d{1,2})(:\d{2})?\s?(am|pm)?\b/i)
  if (dayMatch) chips.push({ label: dayMatch[0].slice(0, 3).toUpperCase(), kind: 'day' })
  if (timeMatch) chips.push({ label: timeMatch[0], kind: 'time' })
  const rest = text
    .replace(dayMatch?.[0] ?? '', '')
    .replace(timeMatch?.[0] ?? '', '')
    .trim()
  if (rest) chips.push({ label: rest.slice(0, 24), kind: 'text' })
  return chips
}

export default function AppHeader({ view, onViewChange, openTaskCount, greetingName }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const demoMode = useAppStore((s) => s.demoMode)
  const [value, setValue] = useState('')
  const [isPending, startTransition] = useTransition()

  const now = new Date()
  const month = now.toLocaleDateString('en-US', { month: 'long' })
  const day = now.getDate()
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' })
  const weekNum = Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7)

  const chips = value ? parseQuickAdd(value) : []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    const text = value
      .replace(/\b(mon|tue|wed|thu|fri|sat|sun)\w*/gi, '')
      .replace(/\b\d{1,2}(:\d{2})?\s?(am|pm)?\b/gi, '')
      .trim()
    if (!text) return

    startTransition(async () => {
      await quickAddTask(text, demoMode)
      router.refresh()
    })
    setValue('')
  }

  function handleViewChange(nextView: ViewName) {
    onViewChange(nextView)
    const nextRoute = VIEW_ROUTES[nextView]
    if (pathname !== nextRoute) {
      router.push(nextRoute)
    }
  }

  return (
    <header className="border-b border-rule bg-paper px-[var(--pad)] pt-[22px] pb-[16px] flex-shrink-0 sm:pt-[26px] sm:pb-[18px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        {/* Date */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-8">
          <div>
            <p className="mono-label mb-1.5 text-ink-3 sm:mb-2">
              {weekday.toUpperCase()} · WEEK {weekNum}
            </p>
            <div className="relative inline-block font-display text-[36px] italic leading-none tracking-[-0.6px] text-ink sm:text-[45px]">
              {month} {day}
              <svg
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                className="absolute left-0 -bottom-1 w-full"
                style={{ height: 6 }}
              >
                <path
                  d="M1 5 Q 25 1, 50 4 T 99 4"
                  stroke="var(--accent)"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {view === 'Today' && (
            <div className="max-w-[520px] pb-0.5 sm:pb-1">
              <h2 className="font-display text-[28px] italic leading-none tracking-[-0.5px] text-ink sm:text-[36px]">
                Hello {greetingName}
              </h2>
              <p className="mt-2 text-sm text-ink-3 sm:text-base">
                Stay anchored. Drift Less. Do more.
              </p>
            </div>
          )}
        </div>

        {/* View switcher */}
        <div className="-mx-1 flex gap-0.5 overflow-x-auto rounded-sm border border-rule bg-card p-0.5 sm:mx-0">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => handleViewChange(v)}
              className={`shrink-0 cursor-pointer px-3 py-1.5 text-xs font-body font-medium uppercase tracking-[0.2px] transition-colors ${
                view === v
                  ? 'bg-ink text-paper'
                  : 'text-ink-2 hover:bg-paper-alt hover:text-ink'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Quick-add */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="paper-panel flex items-center gap-2 rounded-sm px-3 py-2.5 sm:gap-2.5 sm:px-3.5">
          <Plus size={15} className="text-ink-3 flex-shrink-0" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Add anything… try "dentist Tuesday 3pm"`}
            className="min-w-0 flex-1 bg-transparent border-none font-body text-sm text-ink outline-none placeholder-ink-4"
          />
          {!value && (
            <span className="hidden rounded-sm border border-rule bg-paper-alt px-1.5 py-0.5 font-mono text-[10px] text-ink-4 sm:flex">
              ⏎
            </span>
          )}
          {value && (
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-sm border border-rule bg-paper-alt px-1.5 py-0.5 font-mono text-[10px] text-ink-4 transition-colors hover:text-ink"
            >
              {isPending ? '…' : 'Add'}
            </button>
          )}
        </div>

        {/* Parse preview */}
        {chips.length > 0 && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="font-body text-xs text-ink-3">Parsed as:</span>
            {chips.map((c, i) => (
              <span
                key={i}
                className={`font-mono text-[10.5px] px-1.5 py-0.5 rounded-sm ${
                  c.kind === 'day'
                    ? 'bg-accent-soft text-accent'
                    : 'bg-rule-2 text-ink-2'
                }`}
              >
                {c.label}
              </span>
            ))}
          </div>
        )}
      </form>
    </header>
  )
}
