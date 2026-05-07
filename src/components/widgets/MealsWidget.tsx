import { Utensils } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import type { Meal } from '@/lib/types'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const SLOTS = ['breakfast', 'lunch', 'dinner'] as const

export default function MealsWidget({ meals }: { meals: Meal[] }) {
  const rows = DAYS.map((day) => ({
    day,
    breakfast: meals.find((meal) => meal.day_of_week === day && meal.slot === 'breakfast')?.name ?? '—',
    lunch: meals.find((meal) => meal.day_of_week === day && meal.slot === 'lunch')?.name ?? '—',
    dinner: meals.find((meal) => meal.day_of_week === day && meal.slot === 'dinner')?.name ?? '—',
  }))

  return (
    <Widget icon={<Utensils size={14} />} title="Meals this week" subtitle="planned">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-rule">
            <th className="py-1 pr-2 font-mono text-[9px] uppercase tracking-[0.4px] text-ink-4" />
            {SLOTS.map((slot) => (
              <th key={slot} className="py-1 pr-2 font-mono text-[9px] uppercase tracking-[0.4px] text-ink-4">
                {slot}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.day} className="border-b border-dashed border-rule last:border-b-0">
              <td className="py-2 pr-2 font-mono text-[10px] text-ink-3">{row.day}</td>
              <td className="py-2 pr-2 font-body text-xs text-ink">{row.breakfast}</td>
              <td className="py-2 pr-2 font-body text-xs text-ink">{row.lunch}</td>
              <td className="py-2 pr-2 font-body text-xs text-ink">{row.dinner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Widget>
  )
}
