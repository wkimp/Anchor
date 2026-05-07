import { createClient } from '@/lib/supabase/server'
import { DEMO_WELLNESS } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import WellnessWidget from '@/components/widgets/WellnessWidget'
import type { WellnessLog } from '@/lib/types'

function buildDemoLogs(today: string) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(date.getDate() - index)
    return {
      ...DEMO_WELLNESS,
      date: date.toISOString().split('T')[0],
      sleep_hours: 6.4 + ((index * 7) % 15) / 10,
      steps: 2600 + index * 670,
      mood: 5 + (index % 5),
    }
  })
}

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
          todayLog = logs.find((log) => log.date === today) ?? null
        }
      }
    } catch {
      // use demo data
    }
  }

  const displayLogs = logs.length ? logs.slice(0, 7) : buildDemoLogs(today)
  const avg7Sleep = (displayLogs.reduce((sum, log) => sum + (log.sleep_hours ?? 0), 0) / displayLogs.length).toFixed(1)
  const avg7Steps = Math.round(displayLogs.reduce((sum, log) => sum + (log.steps ?? 0), 0) / displayLogs.length)
  const avg7Mood = (displayLogs.reduce((sum, log) => sum + (log.mood ?? 0), 0) / displayLogs.length).toFixed(1)

  return (
    <PageShell title="Health" subtitle="body, sleep, movement">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-[var(--gap)] mb-6">
        <MetricCard label="Sleep avg" big={`${avg7Sleep}h`} sub="7-day · target 7.5" />
        <MetricCard label="Mood avg" big={avg7Mood} sub="out of 10" />
        <MetricCard label="Steps" big={avg7Steps.toLocaleString()} sub="this week" />
        <MetricCard label="Workouts" big="3 / 4" sub="Mon, Wed, Fri" />
      </div>

      <SectionTitle>Today</SectionTitle>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[var(--gap)] mb-6">
        <WellnessWidget log={todayLog} />
      </div>

      <SectionTitle>Sleep · last 7 nights</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-5 mb-6">
        <div className="flex items-end gap-3 h-36">
          {displayLogs.slice().reverse().map((log, index) => {
            const height = Math.min(100, ((log.sleep_hours ?? 0) / 10) * 100)
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <p className="font-mono text-[10px] text-ink-3">{log.sleep_hours?.toFixed(1)}h</p>
                <div className="w-full h-full bg-rule relative">
                  <div className="absolute inset-x-0 bottom-0 bg-accent" style={{ height: `${height}%` }} />
                </div>
                <p className="font-mono text-[9px] text-ink-4">{new Date(`${log.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'narrow' })}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-dashed border-rule flex justify-between font-mono text-[10px] text-ink-3">
          <span>bedtime avg · 23:18</span>
          <span>wake avg · 06:34</span>
          <span>quality · 78%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <SectionTitle>Movement</SectionTitle>
          <div className="bg-card border border-rule rounded-sm p-5">
            <div className="flex items-end gap-2 h-28">
              {displayLogs.slice().reverse().map((log, index) => {
                const height = Math.min(100, ((log.steps ?? 0) / 8000) * 100)
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full h-full bg-rule relative">
                      <div className="absolute inset-x-0 bottom-0 bg-ink-3/70" style={{ height: `${height}%` }} />
                    </div>
                    <p className="font-mono text-[9px] text-ink-4">{new Date(`${log.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'narrow' })}</p>
                  </div>
                )
              })}
            </div>
            <p className="mt-3 font-mono text-[10px] text-ink-3">daily goal · 8,000 steps</p>
          </div>
        </div>

        <div>
          <SectionTitle>Mood</SectionTitle>
          <div className="bg-card border border-rule rounded-sm p-5">
            <div className="flex items-end gap-3 h-28">
              {displayLogs.slice().reverse().map((log, index) => {
                const height = Math.min(100, ((log.mood ?? 0) / 10) * 100)
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full h-full flex items-end justify-center">
                      <div className="w-3 rounded-full border border-accent bg-accent-soft" style={{ height: `${Math.max(12, height)}%` }} />
                    </div>
                    <p className="font-mono text-[9px] text-ink-4">{new Date(`${log.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'narrow' })}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

function MetricCard({ label, big, sub }: { label: string; big: string; sub: string }) {
  return (
    <div className="bg-card border border-rule rounded-sm p-4">
      <p className="mono-label text-ink-4 mb-2">{label}</p>
      <p className="font-display italic text-[30px] text-ink leading-none">{big}</p>
      <p className="font-mono text-[10px] text-ink-3 mt-2">{sub}</p>
    </div>
  )
}
