import TasksWidget from '@/components/widgets/TasksWidget'
import ScheduleWidget from '@/components/widgets/ScheduleWidget'
import HabitsWidget from '@/components/widgets/HabitsWidget'
import WellnessWidget from '@/components/widgets/WellnessWidget'
import BusinessWidget from '@/components/widgets/BusinessWidget'
import NotesWidget from '@/components/widgets/NotesWidget'
import ProjectsWidget from '@/components/widgets/ProjectsWidget'
import FinanceWidget from '@/components/widgets/FinanceWidget'
import MealsWidget from '@/components/widgets/MealsWidget'
import ReadingWidget from '@/components/widgets/ReadingWidget'
import PeopleWidget from '@/components/widgets/PeopleWidget'
import HomeWidget from '@/components/widgets/HomeWidget'
import { getPlannerDashboardData } from '@/lib/planner-dashboard'

export default async function AllPage() {
  const {
    tasks,
    schedule,
    habitRows,
    wellness,
    notes,
    today,
    business,
    projects,
    financeCategories,
    financeTransactions,
    meals,
    books,
    people,
    chores,
  } = await getPlannerDashboardData()

  return (
    <div className="p-[var(--pad)] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--gap)]">
      <TasksWidget tasks={tasks} />
      <ScheduleWidget blocks={schedule} />
      <HabitsWidget habits={habitRows} todayDate={today} />
      <WellnessWidget log={wellness} />
      <BusinessWidget metrics={business} />
      <ProjectsWidget projects={projects} />
      <NotesWidget notes={notes} />
      <FinanceWidget categories={financeCategories} transactions={financeTransactions} />
      <MealsWidget meals={meals} />
      <ReadingWidget books={books} />
      <PeopleWidget people={people} />
      <HomeWidget chores={chores} />
    </div>
  )
}
