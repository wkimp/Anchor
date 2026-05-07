import { createClient } from '@/lib/supabase/server'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'

function toDisplayName(value?: string | null) {
  if (!value) return null

  const normalized = value
    .replace(/[_\-+.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized) return null

  return normalized
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export async function getGreetingName() {
  if (!hasSupabasePublicEnv()) return 'Friend'

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const metadataName =
      toDisplayName(user?.user_metadata?.full_name) ??
      toDisplayName(user?.user_metadata?.name) ??
      toDisplayName(user?.user_metadata?.first_name)

    if (metadataName) {
      return metadataName.split(' ')[0]
    }

    const emailName = toDisplayName(user?.email?.split('@')[0])
    return emailName ?? 'Friend'
  } catch {
    return 'Friend'
  }
}
