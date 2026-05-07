'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'

function revalidateHabitSurfaces() {
  revalidatePath('/')
  revalidatePath('/all')
  revalidatePath('/habits')
}

export async function toggleHabit(habitId: string, date: string, done: boolean) {
  if (!hasSupabasePublicEnv()) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Upsert the habit log
  await supabase.from('habit_logs').upsert(
    { user_id: user.id, habit_id: habitId, date, done },
    { onConflict: 'user_id,habit_id,date' },
  )

  revalidateHabitSurfaces()
}

export async function createHabit(name: string, icon: string) {
  if (!hasSupabasePublicEnv()) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('habits').insert({ user_id: user.id, name, icon })
  revalidateHabitSurfaces()
}

export async function updateHabit(habitId: string, name: string, icon: string) {
  if (!hasSupabasePublicEnv()) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('habits')
    .update({ name, icon })
    .eq('id', habitId)
    .eq('user_id', user.id)

  revalidateHabitSurfaces()
}

export async function deleteHabit(habitId: string) {
  if (!hasSupabasePublicEnv()) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('habits').delete().eq('id', habitId).eq('user_id', user.id)
  revalidateHabitSurfaces()
}
