import { createClient } from '@/lib/supabase/server'
import { DEMO_WELLNESS } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import WellnessWidget from '@/components/widgets/WellnessWidget'
import type { WellnessLog } from '@/lib/types'

export default async function HealthPage() {
  const today = new Date().toISOString().split('T')[0]
  let logs: WellnessLog[] = []
  let todayLog: WellnessLog | null = DEMO_WELLNESS

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('wellness_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(30)
        if (data?.length) {
          logs = data as WellnessLog[]
          todayLog = logs.find((l) => l.date === today) ?? null
        }
      }
    } catch { /* use demo */ }
  }

  const displayLogs = logs.length ? logs : Array.from({ length: 7 }, (_, i) => ({
    ...DEMO_WELLNESS, date: (() => { const d = new Date(today); d.setDate(d.getDate() - i); return d.toISOString().split('T')[0] })(),
    sleep_hours: 6.5 + Math.random(), steps: Math.floor(3000 + Math.random() * 5000), mood: Math.floor(5 + Math.random() * 5),
  }))

  const avg7Sleep = (displayLogs.slice(0, 7).reduce((a, l) => a + (l.sleep_hours ?? 0), 0) / 7).toFixed(1)
  const avg7Steps = Math.round(displayLogs.slice(0, 7).reduce((a, l) => a + (l.steps ?? 0), 0) / 7)
  const avg7Mood = (displayLogs.slice(0, 7).reduce((a, l) => a + (l.mood ?? 0), 0) / 7).toFixed(1)

  return (
    <PageShell
      title="Health"
      subtitle={`${avg7Sleep}h sleep · ${avg7Steps.toLocaleString()} steps · ${avg7Mood}/10 mood (7-day avg)`}
    >
      <SectionTitle>Today</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--gap)] mb-6">
        <WellnessWidget log={todayLog} />
      </div>

      <SectionTitle>7-day sleep</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-5">
        <div className="flex items-end gap-1.5 h-20">
          {displayLogs.slice(0, 7).reverse().map((log, i) => {
            const pct = Math.min(100, ((log.sleep_hours ?? 0) / 9) * 100)
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-paper-alt rounded-sm overflow-hidden" style={{ height: '64px' }}>
                  <div className="w-full bg-accent rounded-sm transition-all" style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }} />
                </div>
                <span className="font-mono text-[9px] text-ink-4">{log.sleep_hours?.toFixed(1)}h</span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <span key={d} className="flex-1 text-center font-mono text-[9px] text-ink-4">{d}</span>
          ))}
        </div>
      </div>

      <SectionTitle>7-day mood</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-5">
        <div className="flex items-end gap-1.5 h-16">
          {displayLogs.slice(0, 7).reverse().map((log, i) => {
            const pct = ((log.mood ?? 0) / 10) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-paper-alt rounded-sm overflow-hidden" style={{ height: '48px' }}>
                  <div className="w-full bg-accent-soft rounded-sm border border-accent transition-all"
                    style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }} />
                </div>
                <span className="font-mono text-[9px] text-ink-4">{log.mood}</span>
              </div>
            )
          })}
        </div>
      </div>
    </PageShell>
  )
}
