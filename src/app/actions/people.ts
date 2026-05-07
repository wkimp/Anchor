'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function revalidatePeopleSurfaces() {
  revalidatePath('/people')
  revalidatePath('/')
  revalidatePath('/all')
}

export async function createPerson(data: {
  name: string
  relation: string
  last_contact_at?: string
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: person } = await supabase
    .from('people')
    .insert({
      user_id: user.id,
      name: data.name,
      relation: data.relation,
      last_contact_at: data.last_contact_at || null,
    })
    .select()
    .single()

  revalidatePeopleSurfaces()
  return person
}

export async function updatePerson(personId: string, data: {
  name: string
  relation: string
  last_contact_at?: string
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('people')
    .update({
      name: data.name,
      relation: data.relation,
      last_contact_at: data.last_contact_at || null,
    })
    .eq('id', personId)
    .eq('user_id', user.id)

  revalidatePeopleSurfaces()
}

export async function deletePerson(personId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('people')
    .delete()
    .eq('id', personId)
    .eq('user_id', user.id)

  revalidatePeopleSurfaces()
}
