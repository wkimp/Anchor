import { createClient } from '@/lib/supabase/server'
import { DEMO_PEOPLE } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import type { Person } from '@/lib/types'

function daysSince(dateStr: string | null): number {
  if (!dateStr) return Infinity
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function statusLabel(days: number): { label: string; color: string } {
  if (!isFinite(days)) return { label: 'never', color: 'text-[#B45B47]' }
  if (days > 14) return { label: 'overdue', color: 'text-[#B45B47]' }
  if (days > 7) return { label: 'this week', color: 'text-accent' }
  return { label: `${days}d ago`, color: 'text-ink-3' }
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
    } catch { /* use demo */ }
  }

  const sorted = [...people].sort((a, b) => daysSince(a.last_contact_at) > daysSince(b.last_contact_at) ? -1 : 1)
  const overdue = sorted.filter((p) => daysSince(p.last_contact_at) > 14)
  const rest = sorted.filter((p) => daysSince(p.last_contact_at) <= 14)

  return (
    <PageShell
      title="People"
      subtitle={`${people.length} contacts · ${overdue.length} overdue`}
    >
      {overdue.length > 0 && (
        <>
          <SectionTitle>Reach out</SectionTitle>
          <div className="bg-card border border-rule rounded-sm divide-y divide-rule-2 mb-6">
            {overdue.map((p) => <PersonRow key={p.id} person={p} />)}
          </div>
        </>
      )}

      <SectionTitle>All contacts</SectionTitle>
      <div className="bg-card border border-rule rounded-sm divide-y divide-rule-2">
        {rest.map((p) => <PersonRow key={p.id} person={p} />)}
        {people.length === 0 && (
          <p className="font-body text-sm text-ink-4 italic p-5 text-center">No contacts yet.</p>
        )}
      </div>
    </PageShell>
  )
}

function PersonRow({ person }: { person: Person }) {
  const days = daysSince(person.last_contact_at)
  const { label, color } = statusLabel(days)
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="font-body text-sm font-medium text-ink">{person.name}</p>
        <p className="font-mono text-[10px] text-ink-4 mt-0.5 capitalize">{person.relation}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-mono text-[10px] ${color}`}>{label}</span>
        <button className="font-body text-xs border border-rule bg-paper-alt text-ink-2 px-2.5 py-1 rounded-sm hover:border-ink hover:text-ink transition-colors cursor-pointer">
          Ping →
        </button>
      </div>
    </div>
  )
}
