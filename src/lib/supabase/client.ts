'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabasePublicEnv } from './config'

export function createClient() {
  const { url, anonKey } = getSupabasePublicEnv()

  return createBrowserClient(
    url,
    anonKey,
  )
}
