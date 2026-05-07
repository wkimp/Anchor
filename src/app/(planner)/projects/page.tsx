import { createClient } from '@/lib/supabase/server'
import { DEMO_PROJECTS } from '@/lib/demo-data'
import { ProjectsPageClient } from './ProjectsClient'
import type { Project } from '@/lib/types'

export default async function ProjectsPage() {
  let projects: Project[] = DEMO_PROJECTS

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (data) projects = data as Project[]
      }
    } catch {
      // use demo projects
    }
  }

  return <ProjectsPageClient projects={projects} />
}
