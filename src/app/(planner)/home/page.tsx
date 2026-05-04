import { createClient } from '@/lib/supabase/server'
import { DEMO_CHORES } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import type { Chore } from '@/lib/types'

function daysSince(dateStr: string | null): number {
  if (!dateStr) return Infinity
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function choreStatus(chore: Chore): { label: string; color: string } {
  const days = daysSince(chore.last_done_at)
  const freqDays = chore.frequency.toLowerCase().includes('3d') ? 3
    : chore.frequency.toLowerCase().includes('week') ? 7 : 7
  if (!isFinite(days) || days > freqDays) return { label: 'overdue', color: 'text-[#B45B47] bg-[#F6E4DE]' }
  if (days >= freqDays - 1) return { label: 'soon', color: 'text-accent bg-accent-soft' }
  return { label: 'ok', color: 'text-ink-3 bg-paper-alt' }
}

export default async function HomePage() {
  let chores: Chore[] = DEMO_CHORES

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('chores')
          .select('*')
          .eq('user_id', user.id)
          .order('last_done_at', { ascending: true })
        if (data?.length) chores = data as Chore[]
      }
    } catch { /* use demo */ }
  }

  const overdue = chores.filter((c) => choreStatus(c).label === 'overdue')
  const soon = chores.filter((c) => choreStatus(c).label === 'soon')
  const ok = chores.filter((c) => choreStatus(c).label === 'ok')

  return (
    <PageShell
      title="Home"
      subtitle={`${chores.length} tasks · ${overdue.length} overdue`}
    >
      {overdue.length > 0 && (
        <>
          <SectionTitle>Overdue</SectionTitle>
          <ChoreList chores={overdue} />
        </>
      )}

      {soon.length > 0 && (
        <>
          <SectionTitle>Coming up</SectionTitle>
          <ChoreList chores={soon} />
        </>
      )}

      <SectionTitle>All good</SectionTitle>
      <ChoreList chores={ok} />
    </PageShell>
  )
}

function ChoreList({ chores }: { chores: Chore[] }) {
  if (!chores.length) {
    return <p className="font-body text-sm text-ink-4 italic py-2">Nothing here.</p>
  }
  return (
    <div className="bg-card border border-rule rounded-sm divide-y divide-rule-2 mb-6">
      {chores.map((c) => {
        const { label, color } = choreStatus(c)
        const days = daysSince(c.last_done_at)
        return (
          <div key={c.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-body text-sm text-ink">{c.name}</p>
              <p className="font-mono text-[10px] text-ink-4 mt-0.5">
                {c.frequency} · last {isFinite(days) ? `${days}d ago` : 'never'}
              </p>
            </div>
            <span className={`font-mono text-[9.5px] uppercase tracking-[0.3px] px-2 py-1 rounded-sm ${color}`}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
