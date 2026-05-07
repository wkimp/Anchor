import { createClient } from '@/lib/supabase/server'
import { DEMO_CHORES } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import type { Chore } from '@/lib/types'

const DEMO_PLANTS = [
  { name: 'Monstera', where: 'Living room', water: 'weekly', last: '3d ago' },
  { name: 'Fiddle leaf', where: 'Living room', water: 'weekly', last: '3d ago' },
  { name: 'Pothos', where: 'Bedroom', water: '10d', last: '5d ago' },
  { name: 'Snake plant', where: 'Office', water: '2w', last: '1w ago' },
  { name: 'Basil', where: 'Kitchen', water: 'daily', last: 'today' },
  { name: 'Calathea', where: 'Bathroom', water: 'weekly', last: '4d ago' },
]

const DEMO_SUBSCRIPTIONS = [
  { name: 'Electricity', amt: 87, next: 'May 1' },
  { name: 'Internet', amt: 65, next: 'May 3' },
  { name: 'Streaming (3)', amt: 42, next: 'Apr 28' },
  { name: 'Groceries avg', amt: 310, next: 'weekly' },
]

function daysSince(dateStr: string | null): number {
  if (!dateStr) return Infinity
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function choreStatus(chore: Chore) {
  const days = daysSince(chore.last_done_at)
  const frequency = chore.frequency.toLowerCase()
  const dueWindow = frequency.includes('3d') ? 3 : frequency.includes('bi-weekly') ? 14 : frequency.includes('month') ? 30 : 7
  if (!isFinite(days) || days >= dueWindow) return 'overdue'
  if (days >= dueWindow - 1) return 'soon'
  return 'ok'
}

function dueClass(label: string) {
  if (label === 'overdue') return 'text-[#B45B47]'
  if (label === 'soon') return 'text-accent'
  return 'text-ink-3'
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
    } catch {
      // use demo chores
    }
  }

  const recurringSpend = DEMO_SUBSCRIPTIONS.reduce((sum, item) => sum + item.amt, 0)

  return (
    <PageShell title="Home" subtitle="a small household, running quietly">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <div>
          <SectionTitle>Chores</SectionTitle>
          <div className="bg-card border border-rule rounded-sm divide-y divide-dashed divide-rule">
            {chores.map((chore) => {
              const status = choreStatus(chore)
              const days = daysSince(chore.last_done_at)

              return (
                <div key={chore.id} className="flex items-center gap-3 px-4 py-3">
                  <span aria-hidden="true" className={`w-4 h-4 rounded-[2px] border shrink-0 ${status === 'overdue' ? 'border-[#B45B47]' : status === 'soon' ? 'border-accent' : 'border-ink-4'}`} />
                  <div className="flex-1 font-body text-sm text-ink">{chore.name}</div>
                  <div className="w-24 font-mono text-[10px] text-ink-4">{chore.frequency}</div>
                  <div className="w-24 font-mono text-[10px] text-ink-3">{isFinite(days) ? `${days}d ago` : 'never'}</div>
                  <div className={`w-20 text-right font-mono text-[9px] uppercase tracking-[0.45px] ${dueClass(status)}`}>{status}</div>
                </div>
              )
            })}
          </div>

          <SectionTitle>Plants</SectionTitle>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {DEMO_PLANTS.map((plant) => (
              <div key={plant.name} className="bg-card border border-rule rounded-sm p-4">
                <p className="font-display italic text-[15px] text-ink">{plant.name}</p>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.35px] text-ink-4 mt-1">{plant.where}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <p className="font-mono text-[10px] text-ink-3">{plant.water} · {plant.last}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle>Subscriptions & bills</SectionTitle>
          <div className="bg-card border border-rule rounded-sm divide-y divide-dashed divide-rule">
            {DEMO_SUBSCRIPTIONS.map((item) => (
              <div key={item.name} className="flex items-baseline justify-between px-4 py-3">
                <div>
                  <p className="font-body text-sm text-ink">{item.name}</p>
                  <p className="font-mono text-[10px] text-ink-4 mt-1">{item.next}</p>
                </div>
                <p className="font-display italic text-[18px] text-ink-2">${item.amt}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-paper-alt border border-rule rounded-sm p-5">
            <p className="mono-label text-ink-4 mb-2">This month</p>
            <p className="font-display italic text-[30px] text-ink leading-none">${recurringSpend}</p>
            <p className="font-mono text-[10px] text-ink-3 mt-3">recurring household · rent billed separately</p>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
