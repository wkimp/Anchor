import { createClient } from '@/lib/supabase/server'
import { DEMO_FINANCE_CATEGORIES, DEMO_FINANCE_TRANSACTIONS } from '@/lib/demo-data'
import PageShell, { EmptyState, SectionTitle } from '@/components/ui/PageShell'
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
        const [categoryResult, transactionResult] = await Promise.all([
          supabase.from('finance_categories').select('*').eq('user_id', user.id),
          supabase.from('finance_transactions').select('*').eq('user_id', user.id).order('occurred_on', { ascending: false }),
        ])
        if (categoryResult.data?.length) {
          categories = categoryResult.data as FinanceCategory[]
          transactions = (transactionResult.data ?? []) as FinanceTransaction[]
        }
      }
    } catch {
      // use demo data
    }
  }

  const spentByCategory = categories.map((category) => {
    const spent = transactions.filter((transaction) => transaction.category_id === category.id).reduce((sum, transaction) => sum + transaction.amount, 0)
    return { ...category, spent }
  })
  const totalSpent = spentByCategory.reduce((sum, category) => sum + category.spent, 0)
  const totalBudget = categories.reduce((sum, category) => sum + category.monthly_budget, 0)
  const month = new Date().toLocaleDateString('en-US', { month: 'long' })

  return (
    <PageShell title="Finances" subtitle={`${month} · $${totalSpent.toLocaleString()} of $${totalBudget.toLocaleString()} budget`}>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-[var(--gap)] mb-6">
        <MetricCard label="Income" big={`$${INCOME.toLocaleString()}`} sub="this month" />
        <MetricCard label="Spent" big={`$${totalSpent.toLocaleString()}`} sub={`of $${totalBudget.toLocaleString()}`} />
        <MetricCard label="Saved" big={`$${SAVINGS.toLocaleString()}`} sub={`${Math.round((SAVINGS / INCOME) * 100)}% rate`} />
        <MetricCard label="Remaining" big={`$${Math.max(0, totalBudget - totalSpent).toLocaleString()}`} sub="before overages" />
      </div>

      <SectionTitle>By category</SectionTitle>
      {spentByCategory.length === 0 ? (
        <EmptyState
          title="No categories yet."
          body="Add a few spending buckets and this page will start to show what your month is asking of you."
        />
      ) : (
        <div className="bg-card border border-rule rounded-sm p-5 space-y-4 mb-6">
          {spentByCategory.map((category) => {
            const pct = category.monthly_budget > 0 ? Math.min(100, (category.spent / category.monthly_budget) * 100) : 0
            const over = category.spent > category.monthly_budget

            return (
              <div key={category.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-body text-sm text-ink-2">{category.name}</span>
                  <span className={`font-mono text-[11px] ${over ? 'text-[#B45B47]' : 'text-ink-3'}`}>
                    ${category.spent.toLocaleString()} / ${category.monthly_budget.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 bg-rule overflow-hidden">
                  <div className={`${over ? 'bg-[#B45B47]' : 'bg-accent'} h-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <SectionTitle>Recent transactions</SectionTitle>
      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet."
          body="Once spending starts landing here, the recent activity list will make the budget feel much more grounded."
        />
      ) : (
        <div className="bg-card border border-rule rounded-sm divide-y divide-dashed divide-rule">
          {transactions.slice(0, 10).map((transaction) => {
            const category = categories.find((item) => item.id === transaction.category_id)
            return (
              <div key={transaction.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-body text-sm text-ink">{transaction.note ?? category?.name ?? 'Transaction'}</p>
                  <p className="font-mono text-[10px] text-ink-4 mt-1">{transaction.occurred_on}</p>
                </div>
                <p className="font-body text-sm font-medium text-ink">−${transaction.amount.toLocaleString()}</p>
              </div>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}

function MetricCard({ label, big, sub }: { label: string; big: string; sub: string }) {
  return (
    <div className="bg-card border border-rule rounded-sm p-4">
      <p className="mono-label text-ink-4 mb-2">{label}</p>
      <p className="font-display italic text-[30px] text-ink leading-none">{big}</p>
      <p className="font-mono text-[10px] text-ink-3 mt-2">{sub}</p>
    </div>
  )
}
