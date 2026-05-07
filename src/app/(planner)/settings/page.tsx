'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import {
  DEMO_BOOKS,
  DEMO_HABITS,
  DEMO_MEALS,
  DEMO_NOTES,
  DEMO_PEOPLE,
  DEMO_PROJECTS,
  DEMO_TASKS,
  DEMO_WELLNESS,
} from '@/lib/demo-data'
import type { DensityName, ModeName, ThemeName, TypefaceName, WidgetKey } from '@/lib/types'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'

const THEMES: { id: ThemeName; accent: string; name: string }[] = [
  { id: 'ochre', accent: '#B0763A', name: 'Ochre' },
  { id: 'olive', accent: '#6B7A3A', name: 'Olive' },
  { id: 'terracotta', accent: '#B45B47', name: 'Terracotta' },
  { id: 'ink', accent: '#3A4A6B', name: 'Ink' },
  { id: 'plum', accent: '#7A4A6B', name: 'Plum' },
]

const TYPEFACES: { id: TypefaceName; label: string }[] = [
  { id: 'newsreader', label: 'Newsreader' },
  { id: 'spectral', label: 'Spectral' },
  { id: 'sans', label: 'Sans-serif' },
]

const WIDGETS: { key: WidgetKey; label: string }[] = [
  { key: 'tasks', label: 'Tasks' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'habits', label: 'Habits' },
  { key: 'wellness', label: 'Wellness' },
  { key: 'notes', label: 'Notes' },
  { key: 'business', label: 'Business' },
  { key: 'projects', label: 'Projects' },
  { key: 'finance', label: 'Finance' },
  { key: 'meals', label: 'Meals' },
  { key: 'reading', label: 'Reading' },
  { key: 'people', label: 'People' },
  { key: 'home', label: 'Home' },
]

export default function SettingsPage() {
  const router = useRouter()
  const {
    tweaks,
    setTheme,
    setMode,
    setDensity,
    setTypeface,
    toggleWidget,
    demoMode,
    setDemoMode,
  } = useAppStore()

  const [clearStep, setClearStep] = useState(0)
  const [loggingOut, setLoggingOut] = useState(false)
  const [deleteStep, setDeleteStep] = useState(0)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [accountMessage, setAccountMessage] = useState('')
  const supabaseConfigured = hasSupabasePublicEnv()

  function handleExport() {
    const data = {
      tasks: DEMO_TASKS,
      notes: DEMO_NOTES,
      habits: DEMO_HABITS,
      projects: DEMO_PROJECTS,
      people: DEMO_PEOPLE,
      books: DEMO_BOOKS,
      meals: DEMO_MEALS,
      wellness: DEMO_WELLNESS,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `anchor-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  function handleClearDemo() {
    if (clearStep === 0) {
      setClearStep(1)
      return
    }
    setDemoMode(false)
    setClearStep(0)
  }

  async function handleLogout() {
    if (!supabaseConfigured) {
      setDemoMode(true)
      router.push('/login')
      router.refresh()
      return
    }

    setLoggingOut(true)
    setAccountMessage('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setDemoMode(true)
      router.push('/login')
      router.refresh()
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : 'Unable to log out')
    } finally {
      setLoggingOut(false)
    }
  }

  async function handleDeleteAccount() {
    if (deleteStep === 0) {
      setDeleteStep(1)
      setAccountMessage('')
      return
    }

    setDeleteLoading(true)
    setAccountMessage('')

    try {
      const response = await fetch('/api/account', { method: 'DELETE' })
      const payload = await response.json().catch(() => null) as { error?: string } | null

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Unable to delete account')
      }

      if (supabaseConfigured) {
        const supabase = createClient()
        await supabase.auth.signOut()
      }

      setDemoMode(true)
      router.push('/login')
      router.refresh()
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : 'Unable to delete account')
      setDeleteStep(0)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <PageShell title="Settings" subtitle="make it yours">
      <SectionTitle>Your data</SectionTitle>
      <div className="bg-card border border-rule rounded-sm divide-y divide-dashed divide-rule">
        <SettingsRow
          label={demoMode ? 'Demo data' : 'Demo data — cleared'}
          sub={demoMode
            ? 'Anchor is pre-filled with realistic sample data — tasks, habits, finances, people, and projects. Clear it to start with a blank planner.'
            : 'Your planner is empty. You can bring the sample data back any time to explore how Anchor works.'}
          action={demoMode ? (
            clearStep === 1 ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setClearStep(0)}
                  className="px-3 py-2 border border-rule bg-card text-ink-2 rounded-sm font-body text-xs hover:border-ink transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearDemo}
                  className="px-3 py-2 border border-[#B45B47] bg-[#B45B47] text-white rounded-sm font-body text-xs cursor-pointer"
                >
                  Yes, clear it
                </button>
              </div>
            ) : (
              <button
                onClick={handleClearDemo}
                className="px-3 py-2 border border-ink bg-transparent text-ink rounded-sm font-body text-xs hover:opacity-80 transition-opacity cursor-pointer"
              >
                Clear demo data
              </button>
            )
          ) : (
            <button
              onClick={() => setDemoMode(true)}
              className="px-3 py-2 border border-ink bg-ink text-paper rounded-sm font-body text-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              Restore demo
            </button>
          )}
        />

        <SettingsRow
          label="Export your planner"
          sub="Download a JSON snapshot of your tasks, notes, habits, finances, meals, and people."
          action={(
            <button
              onClick={handleExport}
              className="px-3 py-2 border border-rule bg-card text-ink rounded-sm font-body text-xs hover:border-ink transition-colors cursor-pointer"
            >
              Export .json
            </button>
          )}
        />

        <SettingsRow
          label="Import"
          sub="Restore from a previous export, or from another planner tool when that flow is ready."
          action={(
            <button
              disabled
              className="px-3 py-2 border border-rule bg-card text-ink-4 rounded-sm font-body text-xs cursor-not-allowed"
            >
              Choose file…
            </button>
          )}
        />
      </div>

      <SectionTitle>Appearance</SectionTitle>
      <div className="space-y-4">
        <div className="bg-card border border-rule rounded-sm p-4 sm:p-5">
          <p className="font-body text-sm text-ink mb-3">Theme</p>
          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`flex items-center gap-2 rounded-sm border px-3 py-2 text-left font-body text-sm transition-colors cursor-pointer ${
                  tweaks.theme === theme.id ? 'border-ink bg-paper-alt text-ink' : 'border-rule text-ink-2 hover:border-ink'
                }`}
              >
                <span className="w-3 h-3 rounded-full" style={{ background: theme.accent }} />
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border border-rule rounded-sm p-4 space-y-4 sm:p-5">
          <ToggleRow
            label="Mode"
            options={['light', 'dark'] as ModeName[]}
            value={tweaks.mode}
            onChange={setMode}
          />

          <ToggleRow
            label="Density"
            options={['spacious', 'compact'] as DensityName[]}
            value={tweaks.density}
            onChange={setDensity}
          />

          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="font-body text-sm text-ink-2">Typeface</span>
            <select
              value={tweaks.typeface}
              onChange={(event) => setTypeface(event.target.value as TypefaceName)}
              className="w-full rounded-sm border border-rule bg-paper-alt px-2 py-1.5 font-body text-xs text-ink outline-none sm:w-auto cursor-pointer"
            >
              {TYPEFACES.map((typeface) => (
                <option key={typeface.id} value={typeface.id}>
                  {typeface.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <SectionTitle>Home screen</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-4 sm:p-5">
        <p className="font-body text-sm text-ink-3 mb-3">
          Choose which widgets appear on your planner dashboard.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {WIDGETS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tweaks.widgets[key]}
                onChange={() => toggleWidget(key)}
                className="w-3.5 h-3.5 accent-ink cursor-pointer"
              />
              <span className="font-body text-sm text-ink-2">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <SectionTitle>Account</SectionTitle>
      <div className="bg-card border border-rule rounded-sm divide-y divide-dashed divide-rule">
        <SettingsRow
          label="Log out"
          sub="End your current session on this device."
          action={(
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-3 py-2 border border-rule bg-card text-ink rounded-sm font-body text-xs hover:border-ink transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loggingOut ? 'Logging out…' : 'Log out'}
            </button>
          )}
        />

        <SettingsRow
          label="Delete account"
          sub="Permanently delete your login and all planner data."
          action={(
            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading || !supabaseConfigured}
              className={`px-3 py-2 border rounded-sm font-body text-xs transition-colors disabled:opacity-50 cursor-pointer ${
                deleteStep === 1
                  ? 'border-[#B45B47] bg-[#B45B47] text-white'
                  : 'border-rule bg-card text-[#B45B47] hover:border-[#B45B47]'
              }`}
            >
              {deleteLoading ? 'Deleting…' : deleteStep === 1 ? 'Confirm delete' : 'Delete account'}
            </button>
          )}
        />
      </div>

      {!supabaseConfigured && (
        <p className="font-body text-xs text-ink-4 mt-3">
          Configure Supabase to enable logout and permanent account deletion.
        </p>
      )}

      {accountMessage && (
        <p className="font-body text-xs text-[#B45B47] mt-2">{accountMessage}</p>
      )}

      <SectionTitle>About</SectionTitle>
      <div className="bg-paper-alt border border-rule rounded-sm border-l-[3px] border-l-accent p-4 sm:p-5">
        <p className="font-display italic text-[22px] text-ink leading-snug mb-2">
          Anchor is a quiet life planner.
        </p>
        <p className="font-body text-sm text-ink-2 leading-relaxed">
          Version 1.0 · built with Next.js, Supabase, and Claude. A place to think on paper, even when the paper is a screen.
        </p>
      </div>
    </PageShell>
  )
}

function SettingsRow({
  label,
  sub,
  action,
}: {
  label: string
  sub: string
  action: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
      <div className="flex-1">
        <p className="font-body text-sm font-medium text-ink">{label}</p>
        <p className="font-body text-xs leading-relaxed text-ink-3 mt-1">{sub}</p>
      </div>
      <div className="w-full sm:w-auto sm:shrink-0">{action}</div>
    </div>
  )
}

function ToggleRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: T[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="font-body text-sm text-ink-2">{label}</span>
      <div className="flex w-full gap-1 rounded-sm border border-rule p-0.5 sm:w-auto">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`flex-1 px-3 py-1 text-xs capitalize transition-colors sm:flex-none cursor-pointer ${
              value === option ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
