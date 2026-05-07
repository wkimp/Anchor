import { createClient } from '@/lib/supabase/server'
import { DEMO_BUSINESS, DEMO_PEOPLE } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import type { BusinessMetrics } from '@/lib/types'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'

const REVENUE_SERIES = [4200, 4200, 4800, 5600, 5600, 6400, 6800, 7200, 7800, 7600, 7950, 8400]
const REVENUE_MONTHS = ['M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'J', 'F', 'M', 'A']

const DEMO_CLIENTS = [
  { name: 'Aperture Co.', mrr: 4200, status: 'active', owes: 4200, since: 'Jan 2025' },
  { name: 'Meridian Studio', mrr: 1800, status: 'active', owes: 0, since: 'Aug 2024' },
  { name: 'Chen Foundation', mrr: 0, status: 'proposal', owes: 0, since: 'Apr 2026' },
  { name: 'Porter & Mills', mrr: 1200, status: 'active', owes: 0, since: 'Nov 2024' },
  { name: 'Holtz', mrr: 800, status: 'active', owes: 0, since: 'Feb 2025' },
  { name: 'Voss', mrr: 400, status: 'paused', owes: 0, since: 'Jun 2024' },
]

const DEMO_INVOICES = [
  { num: '#2026-014', client: 'Aperture Co.', amount: 4200, status: 'sent', due: 'Apr 22' },
  { num: '#2026-013', client: 'Meridian Studio', amount: 1800, status: 'paid', due: 'Apr 10' },
  { num: '#2026-012', client: 'Porter & Mills', amount: 1200, status: 'paid', due: 'Apr 3' },
  { num: '#2026-011', client: 'Holtz', amount: 800, status: 'paid', due: 'Apr 1' },
  { num: '#2026-015', client: 'Chen Foundation', amount: 6500, status: 'draft', due: '—' },
]

function statusClass(status: string) {
  if (status === 'proposal' || status === 'draft') return 'text-[#B45B47]'
  if (status === 'sent' || status === 'active') return 'text-accent'
  return 'text-ink-4'
}

export default async function BusinessPage() {
  let metrics: BusinessMetrics = DEMO_BUSINESS

  if (hasSupabasePublicEnv()) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('business_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('month', { ascending: false })
          .limit(1)
          .single()
        if (data) metrics = data as BusinessMetrics
      }
    } catch {
      // use demo metrics
    }
  }

  const prevMRR = REVENUE_SERIES[REVENUE_SERIES.length - 2]
  const growth = (((metrics.mrr - prevMRR) / prevMRR) * 100).toFixed(1)
  const ytdRevenue = REVENUE_SERIES.reduce((sum, value) => sum + value, 0)
  const activeClientContacts = DEMO_PEOPLE.filter((person) => person.relation === 'client').length

  return (
    <PageShell
      title="Business"
      subtitle="overview · april"
      action={(
        <button className="px-3.5 py-2 border border-ink bg-ink text-paper rounded-sm font-body text-xs hover:opacity-90 transition-opacity cursor-pointer">
          New invoice
        </button>
      )}
    >
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-[var(--gap)] mb-6">
        <StatCard label="MRR" big={`$${metrics.mrr.toLocaleString()}`} sub={`+${growth}% vs Mar`} accent />
        <StatCard label="Outstanding" big="$4,200" sub="1 invoice · Apr 22" />
        <StatCard label="Clients" big={String(metrics.clients)} sub={`${activeClientContacts} recent contacts`} />
        <StatCard label="YTD revenue" big={`$${ytdRevenue.toLocaleString()}`} sub="target $60,000" />
      </div>

      <div className="bg-card border border-rule rounded-sm p-5 mb-6">
        <p className="mono-label text-ink-4 mb-4">MRR · last 12 months</p>
        <div className="flex items-end gap-2 h-32">
          {REVENUE_SERIES.map((value, index) => {
            const height = (value / 10000) * 100
            const current = index === REVENUE_SERIES.length - 1
            return (
              <div key={`${value}-${index}`} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full ${current ? 'bg-accent' : 'bg-ink-3/50'}`}
                  style={{ height: `${height}%` }}
                />
                <span className={`font-mono text-[9px] ${current ? 'text-accent' : 'text-ink-4'}`}>{REVENUE_MONTHS[index]}</span>
              </div>
            )
          })}
        </div>
      </div>

      <SectionTitle>Clients</SectionTitle>
      <div className="bg-card border border-rule rounded-sm divide-y divide-dashed divide-rule mb-6">
        {DEMO_CLIENTS.map((client) => (
          <div key={client.name} className="grid grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-4 py-3 items-center">
            <div>
              <p className="font-body text-sm text-ink font-medium">{client.name}</p>
              <p className="font-mono text-[10px] text-ink-4 mt-1">since {client.since}</p>
            </div>
            <p className="hidden xl:block font-mono text-[11px] text-ink-2">${client.mrr.toLocaleString()}/mo</p>
            <p className={`font-mono text-[10px] uppercase tracking-[0.4px] ${statusClass(client.status)}`}>{client.status}</p>
            <p className={`hidden xl:block font-mono text-[10px] ${client.owes ? 'text-[#B45B47]' : 'text-ink-4'}`}>
              {client.owes ? `owes $${client.owes.toLocaleString()}` : 'settled'}
            </p>
            <span className="justify-self-end text-ink-4">›</span>
          </div>
        ))}
      </div>

      <SectionTitle>Recent invoices</SectionTitle>
      <div className="bg-card border border-rule rounded-sm divide-y divide-dashed divide-rule">
        {DEMO_INVOICES.map((invoice) => (
          <div key={invoice.num} className="grid grid-cols-2 xl:grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-3 px-4 py-3 items-center">
            <p className="font-mono text-[11px] text-ink-3">{invoice.num}</p>
            <p className="hidden xl:block font-body text-sm text-ink">{invoice.client}</p>
            <p className="font-mono text-[11px] text-ink-2">${invoice.amount.toLocaleString()}</p>
            <p className={`hidden xl:block font-mono text-[10px] uppercase tracking-[0.4px] ${statusClass(invoice.status)}`}>{invoice.status}</p>
            <p className="hidden xl:block font-mono text-[10px] text-ink-4">due {invoice.due}</p>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

function StatCard({
  label,
  big,
  sub,
  accent = false,
}: {
  label: string
  big: string
  sub: string
  accent?: boolean
}) {
  return (
    <div className="bg-card border border-rule rounded-sm p-4">
      <p className="mono-label text-ink-4 mb-2">{label}</p>
      <p className="font-display italic text-[30px] text-ink leading-none">{big}</p>
      <p className={`font-mono text-[10px] mt-2 ${accent ? 'text-accent' : 'text-ink-3'}`}>{sub}</p>
    </div>
  )
}
