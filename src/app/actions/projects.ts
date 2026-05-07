'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function revalidateProjectSurfaces() {
  revalidatePath('/projects')
  revalidatePath('/')
  revalidatePath('/all')
}

export async function createProject(data: {
  name: string
  due_date?: string
  progress?: number
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: project } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: data.name,
      due_date: data.due_date || null,
      progress: data.progress ?? 0,
    })
    .select()
    .single()

  revalidateProjectSurfaces()
  return project
}

export async function updateProject(projectId: string, data: {
  name: string
  due_date?: string
  progress: number
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('projects')
    .update({
      name: data.name,
      due_date: data.due_date || null,
      progress: data.progress,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .eq('user_id', user.id)

  revalidateProjectSurfaces()
}

export async function deleteProject(projectId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', user.id)

  revalidateProjectSurfaces()
}
