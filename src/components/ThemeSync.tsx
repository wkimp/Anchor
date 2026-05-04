'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'

// Syncs Zustand tweaks → HTML data attributes so CSS variables update
export default function ThemeSync() {
  const tweaks = useAppStore((s) => s.tweaks)

  useEffect(() => {
    const html = document.documentElement
    html.dataset.theme = tweaks.theme
    html.dataset.mode = tweaks.mode
    html.dataset.density = tweaks.density
    html.dataset.typeface = tweaks.typeface
  }, [tweaks])

  return null
}
