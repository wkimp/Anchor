import { DollarSign } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import type { FinanceCategory, FinanceTransaction } from '@/lib/types'

export default function FinanceWidget({
  categories,
  transactions,
}: {
  categories: FinanceCategory[]
  transactions: FinanceTransaction[]
}) {
  const spentByCategory = categories.map((category) => {
    const spent = transactions
      .filter((transaction) => transaction.category_id === category.id)
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    return { ...category, spent }
  })
  const totalSpent = spentByCategory.reduce((sum, category) => sum + category.spent, 0)
  const totalBudget = categories.reduce((sum, category) => sum + category.monthly_budget, 0)
  const pct = totalBudget > 0 ? totalSpent / totalBudget : 0

  return (
    <Widget icon={<DollarSign size={14} />} title="Finances" subtitle={`${Math.round(pct * 100)}% of budget`}>
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <p className="font-display italic text-[28px] text-ink">${totalSpent.toLocaleString()}</p>
          <p className="font-mono text-[11px] text-ink-3">/ ${totalBudget.toLocaleString()}</p>
        </div>
        <div className="h-1 bg-rule relative">
          <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${Math.min(100, pct * 100)}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        {spentByCategory.slice(0, 4).map((category) => (
          <div key={category.id} className="flex items-center gap-3">
            <div className="w-20 font-body text-xs text-ink-2">{category.name}</div>
            <div className="flex-1 h-0.5 bg-rule relative">
              <div
                className={`absolute inset-y-0 left-0 ${category.spent > category.monthly_budget ? 'bg-[#B45B47]' : 'bg-ink-3'}`}
                style={{ width: `${Math.min(100, (category.spent / category.monthly_budget) * 100)}%` }}
              />
            </div>
            <div className="w-24 text-right font-mono text-[10px] text-ink-3">${category.spent} / ${category.monthly_budget}</div>
          </div>
        ))}
      </div>
    </Widget>
  )
}
