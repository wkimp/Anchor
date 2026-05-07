import PlannerShell from '@/components/shell/PlannerShell'
import { createClient } from '@/lib/supabase/server'
import { DEMO_TASKS } from '@/lib/demo-data'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'
import { getGreetingName } from '@/lib/user-greeting'

export default async function PlannerLayout({ children }: { children: React.ReactNode }) {
  let openTaskCount = DEMO_TASKS.filter((t) => !t.done).length
  let greetingName = 'Friend'

  // If Supabase is configured, fetch real count
  if (hasSupabasePublicEnv()) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { count } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('done', false)
        openTaskCount = count ?? 0
      }
    } catch {
      // fallback to demo count
    }
  }

  greetingName = await getGreetingName()

  return (
    <PlannerShell openTaskCount={openTaskCount} greetingName={greetingName}>
      {children}
    </PlannerShell>
  )
}
