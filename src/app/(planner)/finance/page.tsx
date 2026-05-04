import { createClient } from '@/lib/supabase/server'
import {
  DEMO_FINANCE_CATEGORIES, DEMO_FINANCE_TRANSACTIONS,
} from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import type { FinanceCategory, FinanceTransaction } from '@/lib/types'

const INCOME = 5800
const SAVINGS = 1400

export default async function FinancePage() {
  let categories: FinanceCategory[] = DEMO_FINANCE_CATEGORIES
  let transactions: FinanceTransaction[] = DEMO_FINANCE_TRANSACTIONS

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const [c, t] = await Promise.all([
          supabase.from('finance_categories').select('*').eq('user_id', user.id),
          supabase.from('finance_transactions').select('*').eq('user_id', user.id).order('occurred_on', { ascending: false }),
        ])
        if (c.data?.length) { categories = c.data as FinanceCategory[]; transactions = (t.data ?? []) as FinanceTransaction[] }
      }
    } catch { /* use demo */ }
  }

  const spentByCategory = categories.map((cat) => {
    const spent = transactions.filter((t) => t.category_id === cat.id).reduce((s, t) => s + t.amount, 0)
    return { ...cat, spent }
  })

  const totalSpent = spentByCategory.reduce((s, c) => s + c.spent, 0)
  const totalBudget = categories.reduce((s, c) => s + c.monthly_budget, 0)

  const month = new Date().toLocaleDateString('en-US', { month: 'long' })

  return (
    <PageShell
      title="Finances"
      subtitle={`${month} · $${totalSpent.toLocaleString()} of $${totalBudget.toLocaleString()} budget`}
    >
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-[var(--gap)] mb-6">
        {[
          { label: 'Income', value: `$${INCOME.toLocaleString()}`, note: 'this month' },
          { label: 'Spent', value: `$${totalSpent.toLocaleString()}`, note: `of $${totalBudget.toLocaleString()}` },
          { label: 'Saved', value: `$${SAVINGS.toLocaleString()}`, note: `${Math.round((SAVINGS / INCOME) * 100)}% rate` },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-rule rounded-sm p-4">
            <p className="mono-label text-ink-4 mb-1">{kpi.label}</p>
            <p className="font-display italic text-2xl text-ink">{kpi.value}</p>
            <p className="font-mono text-[10px] text-ink-3 mt-0.5">{kpi.note}</p>
          </div>
        ))}
      </div>

      <SectionTitle>By category</SectionTitle>
      <div className="bg-card border border-rule rounded-sm p-5 space-y-4">
        {spentByCategory.map((cat) => {
          const pct = Math.min(100, (cat.spent / cat.monthly_budget) * 100)
          const over = cat.spent > cat.monthly_budget
          return (
            <div key={cat.id}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-body text-sm text-ink-2">{cat.name}</span>
                <span className={`font-mono text-[11px] ${over ? 'text-[#B45B47]' : 'text-ink-3'}`}>
                  ${cat.spent.toLocaleString()} / ${cat.monthly_budget.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-rule rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? 'bg-[#B45B47]' : 'bg-accent'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <SectionTitle>Recent transactions</SectionTitle>
      <div className="bg-card border border-rule rounded-sm divide-y divide-rule-2">
        {transactions.slice(0, 10).map((tx) => {
          const cat = categories.find((c) => c.id === tx.category_id)
          return (
            <div key={tx.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-body text-sm text-ink">{tx.note ?? cat?.name ?? 'Transaction'}</p>
                <p className="font-mono text-[10px] text-ink-4 mt-0.5">{tx.occurred_on}</p>
              </div>
              <span className="font-body text-sm font-medium text-ink">−${tx.amount.toLocaleString()}</span>
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
