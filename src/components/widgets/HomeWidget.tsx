import { House } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import type { Chore } from '@/lib/types'

function status(chore: Chore) {
  if (!chore.last_done_at) return 'overdue'
  const days = Math.floor((Date.now() - new Date(chore.last_done_at).getTime()) / 86400000)
  if (days >= 6) return 'overdue'
  if (days >= 3) return 'soon'
  return 'ok'
}

export default function HomeWidget({ chores }: { chores: Chore[] }) {
  return (
    <Widget icon={<House size={14} />} title="Home & chores">
      <div>
        {chores.slice(0, 4).map((chore, index) => {
          const state = status(chore)
          return (
            <div key={chore.id} className={`flex items-center gap-3 py-2 ${index === chores.slice(0, 4).length - 1 ? '' : 'border-b border-dashed border-rule'}`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${state === 'overdue' ? 'bg-[#B45B47]' : state === 'soon' ? 'bg-accent' : 'bg-ink-4'}`} />
              <div className="flex-1 font-body text-sm text-ink">{chore.name}</div>
              <div className="font-mono text-[10px] text-ink-4">{chore.frequency}</div>
            </div>
          )
        })}
      </div>
    </Widget>
  )
}
