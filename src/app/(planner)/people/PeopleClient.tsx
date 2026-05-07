'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import PageShell, { EmptyState, SectionTitle } from '@/components/ui/PageShell'
import InlineStatus from '@/components/ui/InlineStatus'
import { createPerson, deletePerson, updatePerson } from '@/app/actions/people'
import type { Person } from '@/lib/types'

type EnrichedPerson = Person & {
  cadence: string
  note: string
  due: 'overdue' | 'this week' | 'soon' | 'ok' | 'never'
}

const DEMO_PERSON_META: Record<string, { cadence: string; note: string }> = {
  Marguerite: { cadence: 'monthly', note: 'Check in after her move.' },
  Dad: { cadence: 'weekly', note: 'Birthday coming up soon.' },
  Dev: { cadence: 'daily', note: 'Plan the weekend hike.' },
  'Sam at Aperture': { cadence: 'bi-weekly', note: 'Aperture Q2 kickoff is due for a follow-up.' },
}

const RELATIONS = ['friend', 'family', 'partner', 'client', 'colleague', 'neighbor']

function daysSince(dateStr: string | null): number {
  if (!dateStr) return Infinity
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function dueState(days: number): EnrichedPerson['due'] {
  if (!isFinite(days)) return 'never'
  if (days >= 14) return 'overdue'
  if (days >= 7) return 'this week'
  if (days >= 4) return 'soon'
  return 'ok'
}

function dueClass(due: EnrichedPerson['due']) {
  if (due === 'overdue' || due === 'never') return 'text-[#B45B47]'
  if (due === 'this week') return 'text-accent'
  return 'text-ink-3'
}

function relationClass(relation: string) {
  if (relation === 'family' || relation === 'partner') return 'text-accent'
  if (relation === 'client') return 'text-ink-3'
  return 'text-ink-2'
}

function lastSeenLabel(days: number) {
  if (!isFinite(days)) return 'never'
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}

function enrichPeople(people: Person[]): EnrichedPerson[] {
  return people.map((person) => {
    const days = daysSince(person.last_contact_at)
    const meta = DEMO_PERSON_META[person.name] ?? {
      cadence: person.relation === 'client' ? 'bi-weekly' : 'monthly',
      note: 'Add a note so this relationship feels easier to resume.',
    }

    return {
      ...person,
      cadence: meta.cadence,
      note: meta.note,
      due: dueState(days),
    }
  })
}

export function PeoplePageClient({ people: initialPeople }: { people: Person[] }) {
  const router = useRouter()
  const [people, setPeople] = useState<Person[]>(initialPeople)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const rows = useMemo(
    () => enrichPeople(people).sort((a, b) => daysSince(b.last_contact_at) - daysSince(a.last_contact_at)),
    [people],
  )
  const overdue = rows.filter((person) => person.due === 'overdue' || person.due === 'never')
  const thisWeek = rows.filter((person) => person.due === 'this week')

  function handleCreate(payload: { name: string; relation: string; last_contact_at: string }) {
    const now = new Date().toISOString()
    const optimistic: Person = {
      id: `tmp-${Date.now()}`,
      user_id: 'demo',
      name: payload.name,
      relation: payload.relation,
      last_contact_at: payload.last_contact_at || null,
      created_at: now,
    }
    setPeople((current) => [optimistic, ...current])
    setCreating(false)
    setMessage('Person added.')

    startTransition(async () => {
      await createPerson(payload)
      router.refresh()
    })
  }

  function handleUpdate(personId: string, payload: { name: string; relation: string; last_contact_at: string }) {
    setPeople((current) =>
      current.map((person) =>
        person.id === personId
          ? { ...person, name: payload.name, relation: payload.relation, last_contact_at: payload.last_contact_at || null }
          : person,
      ),
    )
    setEditingId(null)
    setMessage('Person updated.')

    startTransition(async () => {
      await updatePerson(personId, payload)
      router.refresh()
    })
  }

  function handleDelete(personId: string) {
    setPeople((current) => current.filter((person) => person.id !== personId))
    setEditingId(null)
    setMessage('Person removed.')

    startTransition(async () => {
      await deletePerson(personId)
      router.refresh()
    })
  }

  return (
    <PageShell
      title="People"
      subtitle={`${overdue.length} overdue · ${rows.length} total`}
      action={(
        <button
          onClick={() => {
            setCreating((current) => !current)
            setEditingId(null)
            setMessage('')
          }}
          className="rounded-sm border border-rule bg-card px-3.5 py-2 font-body text-xs text-ink transition-colors hover:border-ink cursor-pointer"
        >
          {creating ? 'Close' : 'Add person'}
        </button>
      )}
    >
      {creating && (
        <PersonEditorCard
          title="Add someone to keep in touch with"
          submitLabel="Save person"
          pending={isPending}
          onCancel={() => setCreating(false)}
          onSubmit={handleCreate}
        />
      )}

      {(message || isPending) && (
        <InlineStatus
          tone={isPending ? 'info' : 'success'}
          message={isPending ? 'Updating your contact list…' : message}
        />
      )}

      <div className="mb-6 grid grid-cols-2 gap-[var(--gap)] xl:grid-cols-4">
        <StatCard label="Overdue" big={String(overdue.length)} sub={overdue.map((p) => p.name).join(', ') || 'none'} />
        <StatCard label="This week" big={String(thisWeek.length)} sub={thisWeek.map((p) => p.name).join(', ') || 'none'} />
        <StatCard label="Streaks" big="4" sub="weekly with Dev" />
        <StatCard label="Last seen" big={rows[0]?.name ?? '—'} sub={rows[0] ? lastSeenLabel(daysSince(rows[0].last_contact_at)) : 'no contacts yet'} />
      </div>

      <SectionTitle>Keep in touch</SectionTitle>
      {rows.length === 0 ? (
        <EmptyState
          title="No contacts yet."
          body="Add the few people you want to remember with more intention, then give yourself a simple last-contact baseline."
        />
      ) : (
        <div className="rounded-sm border border-rule bg-card divide-y divide-dashed divide-rule">
          {rows.map((person) => {
            const days = daysSince(person.last_contact_at)
            const isEditing = editingId === person.id

            if (isEditing) {
              return (
                <div key={person.id} className="p-4">
                  <PersonEditorCard
                    title={`Edit ${person.name}`}
                    submitLabel="Save changes"
                    pending={isPending}
                    initialName={person.name}
                    initialRelation={person.relation}
                    initialLastContactAt={person.last_contact_at ? person.last_contact_at.split('T')[0] : ''}
                    onCancel={() => setEditingId(null)}
                    onSubmit={(payload) => handleUpdate(person.id, payload)}
                    onDelete={() => handleDelete(person.id)}
                    embedded
                  />
                </div>
              )
            }

            return (
              <div key={person.id} className="group flex items-center gap-4 px-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rule bg-paper-alt font-display text-[15px] italic text-ink-2">
                  {person.name[0]}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="truncate font-body text-sm font-medium text-ink">{person.name}</p>
                    <span className={`font-mono text-[9px] uppercase tracking-[0.45px] ${relationClass(person.relation)}`}>
                      {person.relation}
                    </span>
                  </div>
                  <p className="mt-1 font-display text-[12px] italic leading-relaxed text-ink-3">
                    {person.note}
                  </p>
                </div>

                <div className="hidden shrink-0 text-right xl:block">
                  <p className="font-mono text-[10px] text-ink-3">{lastSeenLabel(days)}</p>
                  <p className="mt-1 font-mono text-[9px] text-ink-4">{person.cadence}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`w-20 shrink-0 text-right font-mono text-[9px] uppercase tracking-[0.45px] ${dueClass(person.due)}`}>
                    {person.due}
                  </div>
                  <button
                    onClick={() => {
                      setEditingId(person.id)
                      setCreating(false)
                      setMessage('')
                    }}
                    className="opacity-0 rounded-sm border border-rule bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3px] text-ink-3 transition-all hover:border-ink hover:text-ink group-hover:opacity-100 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
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

function PersonEditorCard({
  title,
  submitLabel,
  pending,
  initialName = '',
  initialRelation = 'friend',
  initialLastContactAt = '',
  onCancel,
  onSubmit,
  onDelete,
  embedded = false,
}: {
  title: string
  submitLabel: string
  pending: boolean
  initialName?: string
  initialRelation?: string
  initialLastContactAt?: string
  onCancel: () => void
  onSubmit: (payload: { name: string; relation: string; last_contact_at: string }) => void
  onDelete?: () => void
  embedded?: boolean
}) {
  const [name, setName] = useState(initialName)
  const [relation, setRelation] = useState(initialRelation)
  const [lastContactAt, setLastContactAt] = useState(initialLastContactAt)

  return (
    <div className={`${embedded ? '' : 'mb-[var(--gap)]'} rounded-sm border border-rule bg-card p-4 sm:p-5`}>
      <p className="mb-3 font-display text-xl italic text-ink">{title}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!name.trim()) return
          onSubmit({
            name: name.trim(),
            relation,
            last_contact_at: lastContactAt,
          })
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            className="w-full rounded-sm border border-rule bg-paper-alt px-3 py-2 font-body text-sm text-ink outline-none placeholder-ink-4"
          />
          <select
            value={relation}
            onChange={(event) => setRelation(event.target.value)}
            className="w-full rounded-sm border border-rule bg-paper-alt px-3 py-2 font-body text-sm text-ink outline-none cursor-pointer"
          >
            {RELATIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={lastContactAt}
            onChange={(event) => setLastContactAt(event.target.value)}
            className="w-full rounded-sm border border-rule bg-paper-alt px-3 py-2 font-body text-sm text-ink outline-none"
          />
        </div>

        <p className="font-body text-xs leading-relaxed text-ink-4">
          Add the last time you spoke so Anchor can gently surface who might need a nudge.
        </p>

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
              Delete person
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
