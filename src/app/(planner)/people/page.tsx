import { createClient } from '@/lib/supabase/server'
import { DEMO_PEOPLE } from '@/lib/demo-data'
import { PeoplePageClient } from './PeopleClient'
import type { Person } from '@/lib/types'

export default async function PeoplePage() {
  let people: Person[] = DEMO_PEOPLE

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('people')
          .select('*')
          .eq('user_id', user.id)
          .order('last_contact_at', { ascending: true })
        if (data) people = data as Person[]
      }
    } catch {
      // use demo data
    }
  }

  return <PeoplePageClient people={people} />
}
