'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import {
  DEMO_TASKS, DEMO_NOTES, DEMO_HABITS, DEMO_PROJECTS,
  DEMO_PEOPLE, DEMO_BOOKS, DEMO_MEALS, DEMO_WELLNESS,
} from '@/lib/demo-data'
import type { ThemeName, ModeName, DensityName, TypefaceName, WidgetKey } from '@/lib/types'

const THEMES: { id: ThemeName; accent: string; name: string }[] = [
  { id: 'ochre', accent: '#B0763A', name: 'Ochre' },
  { id: 'olive', accent: '#6B7A3A', name: 'Olive' },
  { id: 'terracotta', accent: '#B45B47', name: 'Terracotta' },
  { id: 'ink', accent: '#3A4A6B', name: 'Ink' },
  { id: 'plum', accent: '#7A4A6B', name: 'Plum' },
]

const TYPEFACES: { id: TypefaceName; label: string }[] = [
  { id: 'newsreader', label: 'Newsreader (default)' },
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
  const { tweaks, setTheme, setMode, setDensity, setTypeface, toggleWidget, demoMode, setDemoMode } = useAppStore()
  const [clearStep, setClearStep] = useState(0)
  const [loggingOut, setLoggingOut] = useState(false)
  const [deleteStep, setDeleteStep] = useState(0)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [accountMessage, setAccountMessage] = useState('')
  const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  function handleClearDemo() {
    if (clearStep === 0) { setClearStep(1); return }
    setDemoMode(false)
    setClearStep(0)
  }

  function handleExport() {
    const data = {
      tasks: DEMO_TASKS, notes: DEMO_NOTES, habits: DEMO_HABITS,
      projects: DEMO_PROJECTS, people: DEMO_PEOPLE, books: DEMO_BOOKS,
      meals: DEMO_MEALS, wellness: DEMO_WELLNESS,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `anchor-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
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
    <PageShell title="Settings" subtitle="Manage your planner">
      {/* Theme */}
      <SectionTitle>Theme</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-5">
        <div className="flex gap-3 flex-wrap">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-sm border cursor-pointer transition-colors font-body text-sm ${
                tweaks.theme === t.id ? 'border-ink bg-paper-alt text-ink' : 'border-rule text-ink-2 hover:border-ink'
              }`}
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.accent }} />
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mode & Density */}
      <SectionTitle>Appearance</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-ink-2">Mode</span>
          <div className="flex gap-1 border border-rule rounded-sm p-0.5">
            {(['light', 'dark'] as ModeName[]).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1 text-xs font-body capitalize cursor-pointer transition-colors ${tweaks.mode === m ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-ink-2">Density</span>
          <div className="flex gap-1 border border-rule rounded-sm p-0.5">
            {(['spacious', 'compact'] as DensityName[]).map((d) => (
              <button key={d} onClick={() => setDensity(d)}
                className={`px-3 py-1 text-xs font-body capitalize cursor-pointer transition-colors ${tweaks.density === d ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-ink-2">Typeface</span>
          <select
            value={tweaks.typeface}
            onChange={(e) => setTypeface(e.target.value as TypefaceName)}
            className="bg-paper-alt border border-rule rounded-sm px-2 py-1.5 font-body text-xs text-ink cursor-pointer outline-none"
          >
            {TYPEFACES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* Widgets on Today */}
      <SectionTitle>Today page widgets</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
      <div className="bg-card border border-rule rounded-sm p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-sm text-ink">Log out</p>
            <p className="font-body text-xs text-ink-4 mt-0.5">
              End your current session on this device.
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="font-body text-xs border border-rule text-ink-2 px-3 py-2 rounded-sm cursor-pointer hover:border-ink hover:text-ink transition-colors disabled:opacity-50"
          >
            {loggingOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>

        <div className="border-t border-rule-2 pt-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-sm text-[#B45B47]">Delete account</p>
            <p className="font-body text-xs text-ink-4 mt-0.5">
              Permanently delete your login and all planner data.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={deleteLoading || !supabaseConfigured}
            className={`font-body text-xs px-3 py-2 rounded-sm transition-colors border disabled:opacity-50 ${
              deleteStep === 1
                ? 'border-[#B45B47] text-[#B45B47] bg-[#F6E4DE]'
                : 'border-rule text-ink-2 hover:border-[#B45B47] hover:text-[#B45B47]'
            }`}
          >
            {deleteLoading ? 'Deleting…' : deleteStep === 1 ? 'Confirm delete' : 'Delete account'}
          </button>
        </div>

        {!supabaseConfigured && (
          <p className="font-body text-xs text-ink-4">
            Configure Supabase to enable logout and permanent account deletion.
          </p>
        )}

        {accountMessage && (
          <p className="font-body text-xs text-[#B45B47]">{accountMessage}</p>
        )}
      </div>

      {/* Data management */}
      <SectionTitle>Data</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-ink">Export data</p>
            <p className="font-body text-xs text-ink-4 mt-0.5">Download all your data as JSON</p>
          </div>
          <button onClick={handleExport}
            className="font-body text-xs border border-rule text-ink-2 px-3 py-2 rounded-sm cursor-pointer hover:border-ink hover:text-ink transition-colors">
            Export JSON
          </button>
        </div>

        <div className="border-t border-rule-2 pt-3 flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-ink">Demo data</p>
            <p className="font-body text-xs text-ink-4 mt-0.5">
              {demoMode ? 'Demo mode is active' : 'Demo data cleared'}
            </p>
          </div>
          <div className="flex gap-2">
            {!demoMode && (
              <button onClick={() => setDemoMode(true)}
                className="font-body text-xs border border-rule text-ink-2 px-3 py-2 rounded-sm cursor-pointer hover:border-ink hover:text-ink transition-colors">
                Restore demo
              </button>
            )}
            {demoMode && (
              <button onClick={handleClearDemo}
                className={`font-body text-xs px-3 py-2 rounded-sm cursor-pointer transition-colors border ${
                  clearStep === 1 ? 'border-[#B45B47] text-[#B45B47] bg-[#F6E4DE]' : 'border-rule text-ink-2 hover:border-ink hover:text-ink'
                }`}>
                {clearStep === 1 ? 'Confirm clear' : 'Clear demo data'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* About */}
      <SectionTitle>About</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-5">
        <p className="font-display italic text-xl text-ink mb-1">Anchor</p>
        <p className="font-body text-sm text-ink-3">A quiet, paper-planner-inspired life management app.</p>
        <p className="font-mono text-[10px] text-ink-4 mt-3 uppercase tracking-[0.3px]">
          v1.0.0 · Built with Next.js + Supabase + Claude
        </p>
      </div>
    </PageShell>
  )
}
