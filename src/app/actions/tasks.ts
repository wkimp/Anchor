'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Priority } from '@/lib/types'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'

function revalidateTaskSurfaces() {
  revalidatePath('/')
  revalidatePath('/all')
  revalidatePath('/week')
  revalidatePath('/month')
  revalidatePath('/upcoming')
}

function parsePriority(text: string): Priority {
  if (/\b(urgent|asap|!\s*$)/i.test(text)) return 1
  if (/\b(important|soon)\b/i.test(text)) return 2
  return 2
}

export async function quickAddTask(text: string, demoMode: boolean) {
  if (!text.trim()) return

  if (demoMode || !hasSupabasePublicEnv()) {
    // In demo mode, client handles optimistic state — nothing to persist server-side
    return
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const priority = parsePriority(text)
  await supabase.from('tasks').insert({
    user_id: user.id,
    text: text.trim(),
    priority,
    done: false,
    project: 'Inbox',
  })

  revalidateTaskSurfaces()
}

export async function toggleTask(taskId: string, done: boolean) {
  if (!hasSupabasePublicEnv()) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('tasks')
    .update({ done, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('user_id', user.id)

  revalidateTaskSurfaces()
}

export async function deleteTask(taskId: string) {
  if (!hasSupabasePublicEnv()) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', user.id)

  revalidateTaskSurfaces()
}

export async function createTask(data: {
  text: string
  priority: Priority
  project: string
  due_date?: string
  time?: string
}) {
  if (!hasSupabasePublicEnv()) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('tasks').insert({ ...data, user_id: user.id, done: false })
  revalidateTaskSurfaces()
}
