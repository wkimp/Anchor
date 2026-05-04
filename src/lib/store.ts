'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tweaks, ThemeName, ModeName, TypefaceName, DensityName, WidgetKey, Task } from './types'

const DEFAULT_TWEAKS: Tweaks = {
  theme: 'ochre',
  typeface: 'newsreader',
  mode: 'light',
  density: 'spacious',
  widgets: {
    tasks: true, schedule: true, habits: true, wellness: true, notes: true,
    finance: true, meals: true, reading: true, projects: true, people: true,
    home: true, business: true,
  },
}

interface AppStore {
  tweaks: Tweaks
  agentOpen: boolean
  demoMode: boolean
  // Client-side task cache for optimistic updates
  taskCache: Task[] | null

  setTweaks: (patch: Partial<Tweaks>) => void
  setTheme: (t: ThemeName) => void
  setMode: (m: ModeName) => void
  setTypeface: (f: TypefaceName) => void
  setDensity: (d: DensityName) => void
  toggleWidget: (k: WidgetKey) => void
  setAgentOpen: (open: boolean) => void
  setDemoMode: (on: boolean) => void
  setTaskCache: (tasks: Task[] | null) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      tweaks: DEFAULT_TWEAKS,
      agentOpen: false,
      demoMode: true,
      taskCache: null,

      setTweaks: (patch) =>
        set((s) => ({ tweaks: { ...s.tweaks, ...patch } })),
      setTheme: (theme) =>
        set((s) => ({ tweaks: { ...s.tweaks, theme } })),
      setMode: (mode) =>
        set((s) => ({ tweaks: { ...s.tweaks, mode } })),
      setTypeface: (typeface) =>
        set((s) => ({ tweaks: { ...s.tweaks, typeface } })),
      setDensity: (density) =>
        set((s) => ({ tweaks: { ...s.tweaks, density } })),
      toggleWidget: (k) =>
        set((s) => ({
          tweaks: {
            ...s.tweaks,
            widgets: { ...s.tweaks.widgets, [k]: !s.tweaks.widgets[k] },
          },
        })),
      setAgentOpen: (agentOpen) => set({ agentOpen }),
      setDemoMode: (demoMode) => set({ demoMode }),
      setTaskCache: (taskCache) => set({ taskCache }),
    }),
    {
      name: 'anchor-ui-prefs',
      partialize: (s) => ({ tweaks: s.tweaks, demoMode: s.demoMode }),
    },
  ),
)
