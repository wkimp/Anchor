import { createClient } from '@/lib/supabase/server'
import { DEMO_NOTES } from '@/lib/demo-data'
import { NotesPageClient } from './NotesClient'
import type { Note } from '@/lib/types'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'

export default async function NotesPage() {
  let notes: Note[] = DEMO_NOTES

  if (hasSupabasePublicEnv()) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
        if (data) notes = data as Note[]
      }
    } catch { /* use demo */ }
  }

  return <NotesPageClient notes={notes} />
}
