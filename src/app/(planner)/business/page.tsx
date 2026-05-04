import { createClient } from '@/lib/supabase/server'
import { DEMO_BUSINESS, DEMO_PEOPLE } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import type { BusinessMetrics } from '@/lib/types'

export default async function BusinessPage() {
  let metrics: BusinessMetrics = DEMO_BUSINESS

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
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
    } catch { /* use demo */ }
  }

  const prevMRR = 7950
  const mrrChange = (((metrics.mrr - prevMRR) / prevMRR) * 100).toFixed(1)
  const isUp = metrics.mrr >= prevMRR

  const clients = DEMO_PEOPLE.filter((p) => p.relation === 'client')

  return (
    <PageShell title="Business" subtitle={metrics.month}>
      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-[var(--gap)] mb-6">
        <div className="bg-card border border-rule rounded-sm p-4">
          <p className="mono-label text-ink-4 mb-1">MRR</p>
          <p className="font-display italic text-2xl text-ink">${metrics.mrr.toLocaleString()}</p>
          <p className={`font-mono text-[10px] mt-0.5 ${isUp ? 'text-accent' : 'text-[#B45B47]'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(Number(mrrChange))}% vs last month
          </p>
        </div>
        <div className="bg-card border border-rule rounded-sm p-4">
          <p className="mono-label text-ink-4 mb-1">Clients</p>
          <p className="font-display italic text-2xl text-ink">{metrics.clients}</p>
          <p className="font-mono text-[10px] text-ink-3 mt-0.5">active</p>
        </div>
        <div className="bg-card border border-rule rounded-sm p-4">
          <p className="mono-label text-ink-4 mb-1">Invoices</p>
          <p className="font-display italic text-2xl text-ink">{metrics.invoices_outstanding}</p>
          <p className="font-mono text-[10px] text-ink-3 mt-0.5">outstanding</p>
        </div>
      </div>

      <SectionTitle>Client contacts</SectionTitle>
      <div className="bg-card border border-rule rounded-sm divide-y divide-rule-2">
        {clients.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-body text-sm text-ink">{c.name}</p>
              <p className="font-mono text-[10px] text-ink-4 mt-0.5">
                Last contact: {c.last_contact_at ?? 'never'}
              </p>
            </div>
            <span className="font-mono text-[9.5px] text-ink-3 bg-paper-alt px-2 py-1 rounded-sm uppercase tracking-[0.3px]">
              active
            </span>
          </div>
        ))}
      </div>

      <SectionTitle>Outstanding</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm font-medium text-ink">Aperture Co. — $4,200</p>
            <p className="font-mono text-[10px] text-ink-4 mt-0.5">Due this week</p>
          </div>
          <span className="font-mono text-[9.5px] text-accent bg-accent-soft px-2 py-1 rounded-sm uppercase tracking-[0.3px]">
            pending
          </span>
        </div>
      </div>
    </PageShell>
  )
}
