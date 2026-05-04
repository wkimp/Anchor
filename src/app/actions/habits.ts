'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleHabit(habitId: string, date: string, done: boolean) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Upsert the habit log
  await supabase.from('habit_logs').upsert(
    { user_id: user.id, habit_id: habitId, date, done },
    { onConflict: 'user_id,habit_id,date' },
  )

  revalidatePath('/')
  revalidatePath('/habits')
}

export async function createHabit(name: string, icon: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('habits').insert({ user_id: user.id, name, icon })
  revalidatePath('/habits')
}

export async function deleteHabit(habitId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('habits').delete().eq('id', habitId).eq('user_id', user.id)
  revalidatePath('/habits')
}
