'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createNote(title: string, body: string, tag: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('notes')
    .insert({ user_id: user.id, title, body, tag })
    .select()
    .single()

  revalidatePath('/notes')
  return data
}

export async function updateNote(noteId: string, title: string, body: string, tag: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('notes')
    .update({ title, body, tag, updated_at: new Date().toISOString() })
    .eq('id', noteId)
    .eq('user_id', user.id)

  revalidatePath('/notes')
}

export async function deleteNote(noteId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('notes').delete().eq('id', noteId).eq('user_id', user.id)
  revalidatePath('/notes')
}
