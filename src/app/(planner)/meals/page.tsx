import { createClient } from '@/lib/supabase/server'
import { DEMO_MEALS } from '@/lib/demo-data'
import PageShell, { EmptyState, SectionTitle } from '@/components/ui/PageShell'
import type { Meal } from '@/lib/types'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SLOTS = ['breakfast', 'lunch', 'dinner'] as const

export default async function MealsPage() {
  let meals: Meal[] = DEMO_MEALS

  if (hasSupabasePublicEnv()) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('meals').select('*').eq('user_id', user.id)
        if (data?.length) meals = data as Meal[]
      }
    } catch { /* use demo */ }
  }

  function getMeal(day: string, slot: string) {
    return meals.find((m) => m.day_of_week === day && m.slot === slot)?.name ?? '—'
  }

  // Derive shopping list: unique non-leftover ingredients (simplified)
  const allMealNames = meals.map((m) => m.name).filter((n) => n && n !== '—')
  const shopItems = [...new Set(allMealNames.flatMap((n) => n.split(/[,&+]/)).map((s) => s.trim()).filter(Boolean))]

  return (
    <PageShell title="Meals" subtitle="This week's meal plan">
      <SectionTitle>Weekly plan</SectionTitle>
      {meals.length === 0 ? (
        <EmptyState
          title="No meals planned yet."
          body="Add a few breakfasts, lunches, or dinners and this page will turn into a calmer weekly rhythm instead of a blank grid."
        />
      ) : (
        <div className="bg-card border border-rule rounded-sm overflow-x-auto mb-6">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-rule">
                <th className="font-mono text-[10px] text-ink-4 text-left px-4 py-2 uppercase tracking-[0.3px] w-24">Slot</th>
                {DAYS.map((d) => (
                  <th key={d} className="font-mono text-[10px] text-ink-4 text-left px-3 py-2 uppercase tracking-[0.3px]">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot} className="border-b border-rule-2 last:border-b-0">
                  <td className="px-4 py-2.5 font-mono text-[10px] text-ink-3 uppercase tracking-[0.3px] capitalize">{slot}</td>
                  {DAYS.map((day) => (
                    <td key={day} className="px-3 py-2.5 font-body text-xs text-ink-2">
                      {getMeal(day, slot)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SectionTitle>Shopping list</SectionTitle>
      {shopItems.length === 0 ? (
        <EmptyState
          title="No shopping list yet."
          body="Once meals are on the board, Anchor can turn them into a simple ingredient list here."
        />
      ) : (
        <div className="bg-card border border-rule rounded-sm p-5">
          <div className="columns-2 gap-4">
            {shopItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="w-3.5 h-3.5 rounded-sm border border-rule flex-shrink-0" />
                <span className="font-body text-sm text-ink-2">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  )
}
