'use client'

import { useState } from 'react'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'

const SECTIONS = [
  { key: 'worked', label: 'What worked', placeholder: 'What went well this week? What momentum did you build?' },
  { key: 'didnt', label: "What didn't", placeholder: "What got in the way? What would you do differently?" },
  { key: 'intention', label: "Next week's intention", placeholder: "One clear intention for the week ahead." },
]

export default function WeeklyReviewPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  function handleSave() {
    // In a real app, persist to Supabase
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const week = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  return (
    <PageShell
      title="Weekly review"
      subtitle={`week of ${week}`}
      action={
        <button
          onClick={handleSave}
          className="font-body text-xs bg-ink text-paper px-3 py-2 rounded-sm cursor-pointer hover:opacity-90 transition-opacity"
        >
          {saved ? 'Saved ✓' : 'Save review'}
        </button>
      }
    >
      <div className="space-y-6 max-w-2xl">
        {SECTIONS.map((section) => (
          <div key={section.key}>
            <SectionTitle>{section.label}</SectionTitle>
            <textarea
              value={values[section.key] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [section.key]: e.target.value }))}
              placeholder={section.placeholder}
              rows={4}
              className="w-full bg-card border border-rule rounded-sm px-4 py-3 font-body text-sm text-ink placeholder-ink-4 outline-none focus:border-ink resize-none leading-relaxed"
            />
          </div>
        ))}
      </div>
    </PageShell>
  )
}
