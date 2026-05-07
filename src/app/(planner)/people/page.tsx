import { createClient } from '@/lib/supabase/server'
import { DEMO_PEOPLE } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
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
      cadence: 'monthly',
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

export default async function PeoplePage() {
  let people: Person[] = DEMO_PEOPLE

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('people')
          .select('*')
          .eq('user_id', user.id)
          .order('last_contact_at', { ascending: true })
        if (data?.length) people = data as Person[]
      }
    } catch {
      // use demo data
    }
  }

  const rows = enrichPeople(people).sort((a, b) => daysSince(b.last_contact_at) - daysSince(a.last_contact_at))
  const overdue = rows.filter((person) => person.due === 'overdue' || person.due === 'never')
  const thisWeek = rows.filter((person) => person.due === 'this week')

  return (
    <PageShell
      title="People"
      subtitle={`${overdue.length} overdue · ${rows.length} total`}
      action={(
        <button className="px-3.5 py-2 border border-rule bg-card text-ink rounded-sm font-body text-xs hover:border-ink transition-colors cursor-pointer">
          Add person
        </button>
      )}
    >
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-[var(--gap)] mb-6">
        <StatCard label="Overdue" big={String(overdue.length)} sub={overdue.map((p) => p.name).join(', ') || 'none'} />
        <StatCard label="This week" big={String(thisWeek.length)} sub={thisWeek.map((p) => p.name).join(', ') || 'none'} />
        <StatCard label="Streaks" big="4" sub="weekly with Dev" />
        <StatCard label="Last seen" big={rows[0]?.name ?? '—'} sub={rows[0] ? lastSeenLabel(daysSince(rows[0].last_contact_at)) : 'no contacts yet'} />
      </div>

      <SectionTitle>Keep in touch</SectionTitle>
      <div className="bg-card border border-rule rounded-sm divide-y divide-dashed divide-rule">
        {rows.map((person) => {
          const days = daysSince(person.last_contact_at)
          return (
            <div key={person.id} className="flex items-center gap-4 px-4 py-4">
              <div className="w-9 h-9 rounded-full bg-paper-alt border border-rule flex items-center justify-center font-display italic text-[15px] text-ink-2 shrink-0">
                {person.name[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="font-body text-sm font-medium text-ink truncate">{person.name}</p>
                  <span className={`font-mono text-[9px] uppercase tracking-[0.45px] ${relationClass(person.relation)}`}>
                    {person.relation}
                  </span>
                </div>
                <p className="font-display italic text-[12px] leading-relaxed text-ink-3 mt-1">
                  {person.note}
                </p>
              </div>

              <div className="hidden xl:block text-right shrink-0">
                <p className="font-mono text-[10px] text-ink-3">{lastSeenLabel(days)}</p>
                <p className="font-mono text-[9px] text-ink-4 mt-1">{person.cadence}</p>
              </div>

              <div className={`w-20 shrink-0 text-right font-mono text-[9px] uppercase tracking-[0.45px] ${dueClass(person.due)}`}>
                {person.due}
              </div>
            </div>
          )
        })}

        {rows.length === 0 && (
          <p className="p-5 text-center font-body text-sm text-ink-4 italic">No contacts yet.</p>
        )}
      </div>
    </PageShell>
  )
}

function StatCard({ label, big, sub }: { label: string; big: string; sub: string }) {
  return (
    <div className="bg-card border border-rule rounded-sm p-4">
      <p className="mono-label text-ink-4 mb-2">{label}</p>
      <p className="font-display italic text-[30px] text-ink leading-none">{big}</p>
      <p className="font-mono text-[10px] text-ink-3 mt-2">{sub}</p>
    </div>
  )
}
