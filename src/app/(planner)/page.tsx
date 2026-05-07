import TasksWidget from '@/components/widgets/TasksWidget'
import ScheduleWidget from '@/components/widgets/ScheduleWidget'
import HabitsWidget from '@/components/widgets/HabitsWidget'
import WellnessWidget from '@/components/widgets/WellnessWidget'
import NotesWidget from '@/components/widgets/NotesWidget'
import BusinessWidget from '@/components/widgets/BusinessWidget'
import { getPlannerDashboardData } from '@/lib/planner-dashboard'

export default async function TodayPage() {
  const { tasks, schedule, habitRows, wellness, notes, today, business } = await getPlannerDashboardData()

  return (
    <div className="p-[var(--pad)] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--gap)]">
      <TasksWidget tasks={tasks} />
      <ScheduleWidget blocks={schedule} />
      <HabitsWidget habits={habitRows} todayDate={today} />
      <WellnessWidget log={wellness} />
      <BusinessWidget metrics={business} />
      <NotesWidget notes={notes} />
    </div>
  )
}
