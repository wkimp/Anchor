import TasksWidget from '@/components/widgets/TasksWidget'
import ScheduleWidget from '@/components/widgets/ScheduleWidget'
import HabitsWidget from '@/components/widgets/HabitsWidget'
import WellnessWidget from '@/components/widgets/WellnessWidget'
import NotesWidget from '@/components/widgets/NotesWidget'
import BusinessWidget from '@/components/widgets/BusinessWidget'
import { getPlannerDashboardData } from '@/lib/planner-dashboard'
import { createClient } from '@/lib/supabase/server'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'

function toDisplayName(value?: string | null) {
  if (!value) return null

  const normalized = value
    .replace(/[_\-+.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized) return null

  return normalized
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

async function getGreetingName() {
  if (!hasSupabasePublicEnv()) return 'Friend'

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const metadataName =
      toDisplayName(user?.user_metadata?.full_name) ??
      toDisplayName(user?.user_metadata?.name) ??
      toDisplayName(user?.user_metadata?.first_name)

    if (metadataName) {
      return metadataName.split(' ')[0]
    }

    const emailName = toDisplayName(user?.email?.split('@')[0])
    return emailName ?? 'Friend'
  } catch {
    return 'Friend'
  }
}

export default async function TodayPage() {
  const { tasks, schedule, habitRows, wellness, notes, today, business } = await getPlannerDashboardData()
  const greetingName = await getGreetingName()

  return (
    <div className="p-[var(--pad)]">
      <section className="paper-panel paper-inset mb-[var(--gap)] rounded-sm border px-5 py-5 sm:px-6">
        <p className="mono-label text-ink-3 mb-3">today</p>
        <h1 className="font-display text-3xl italic leading-none text-ink sm:text-[38px]">
          Hello {greetingName}
        </h1>
        <p className="mt-3 text-sm text-ink-3 sm:text-base">
          Stay anchored. Drift Less. Do more.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-[var(--gap)] md:grid-cols-2 xl:grid-cols-3">
        <TasksWidget tasks={tasks} />
        <ScheduleWidget blocks={schedule} />
        <HabitsWidget habits={habitRows} todayDate={today} />
        <WellnessWidget log={wellness} />
        <BusinessWidget metrics={business} />
        <NotesWidget notes={notes} />
      </div>
    </div>
  )
}
