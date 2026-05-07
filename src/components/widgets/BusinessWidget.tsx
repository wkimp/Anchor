import { Briefcase } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import type { BusinessMetrics } from '@/lib/types'

export default function BusinessWidget({ metrics }: { metrics: BusinessMetrics }) {
  const growth = (((metrics.mrr - 7950) / 7950) * 100).toFixed(1)

  return (
    <Widget icon={<Briefcase size={14} />} title="Business" subtitle={`${metrics.clients} active clients`}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="mono-label text-ink-4 mb-1">MRR</p>
          <p className="font-display italic text-2xl text-ink">${metrics.mrr.toLocaleString()}</p>
          <p className="font-mono text-[10px] text-accent mt-1">↗ +{growth}% vs last mo</p>
        </div>
        <div>
          <p className="mono-label text-ink-4 mb-1">Outstanding</p>
          <p className="font-display italic text-2xl text-ink">{metrics.invoices_outstanding}</p>
          <p className="font-mono text-[10px] text-ink-3 mt-1">invoices</p>
        </div>
      </div>

      <div className="p-3 bg-paper-alt border-l-2 border-accent">
        <p className="font-mono text-[9px] uppercase tracking-[0.45px] text-ink-3 mb-1">Next up</p>
        <p className="font-body text-sm text-ink-2">Send Q1 invoice to Aperture Co. and follow up with Chen Foundation.</p>
      </div>
    </Widget>
  )
}
