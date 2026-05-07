import Link from 'next/link'
import { Users } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import type { Person } from '@/lib/types'

function daysSince(dateStr: string | null): number {
  if (!dateStr) return Infinity
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function dueLabel(days: number) {
  if (!isFinite(days)) return { label: 'never', color: 'text-[#B45B47]' }
  if (days > 14) return { label: 'overdue', color: 'text-[#B45B47]' }
  if (days > 7) return { label: 'this week', color: 'text-accent' }
  return { label: `${days}d ago`, color: 'text-ink-3' }
}

export default function PeopleWidget({ people }: { people: Person[] }) {
  const overdue = people.filter((person) => daysSince(person.last_contact_at) > 14).length

  return (
    <Widget
      icon={<Users size={14} />}
      title="Keep in touch"
      subtitle={`${overdue} overdue`}
      action={(
        <Link
          href="/people"
          className="rounded-sm border border-rule bg-paper-alt px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3px] text-ink-3 transition-colors hover:text-ink"
        >
          Open
        </Link>
      )}
    >
      <div>
        {people.slice(0, 4).map((person, index) => {
          const { label, color } = dueLabel(daysSince(person.last_contact_at))
          return (
            <div key={person.id} className={`flex items-center gap-3 py-2 ${index === people.slice(0, 4).length - 1 ? '' : 'border-b border-dashed border-rule'}`}>
              <div className="w-7 h-7 rounded-full bg-paper-alt border border-rule flex items-center justify-center font-display italic text-xs text-ink-2 shrink-0">
                {person.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-ink truncate">{person.name}</p>
                <p className="font-mono text-[10px] text-ink-4 capitalize mt-0.5">{person.relation}</p>
              </div>
              <div className={`font-mono text-[9px] uppercase tracking-[0.4px] ${color}`}>{label}</div>
            </div>
          )
        })}
        {people.length === 0 && (
          <div className="rounded-sm border border-dashed border-rule bg-paper-alt/35 px-4 py-5 text-center">
            <p className="font-display text-base italic text-ink-3">No people yet.</p>
            <p className="mt-1 font-body text-xs leading-relaxed text-ink-4">
              Add the names you want to keep warm, not the whole address book.
            </p>
            <Link
              href="/people"
              className="mt-3 inline-flex rounded-sm border border-ink bg-ink px-2.5 py-1.5 font-body text-[11px] text-paper transition-opacity hover:opacity-90"
            >
              Add a person
            </Link>
          </div>
        )}
      </div>
    </Widget>
  )
}
