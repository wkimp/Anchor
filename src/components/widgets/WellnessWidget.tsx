import { Heart } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import type { WellnessLog } from '@/lib/types'

interface Props {
  log: WellnessLog | null
}

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-body text-xs text-ink-2">{label}</span>
        <span className="font-mono text-[10px] text-ink-3">
          {value}/{max}
        </span>
      </div>
      <div className="h-1.5 bg-rule rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

const MOOD_LABELS = ['', 'Low', 'Low', 'Meh', 'Meh', 'OK', 'Good', 'Good', 'Great', 'Great', 'Peak']

export default function WellnessWidget({ log }: Props) {
  if (!log) {
    return (
      <Widget icon={<Heart size={14} />} title="Wellness" subtitle="no log yet">
        <p className="font-body text-sm text-ink-4 italic py-4 text-center">Nothing logged today.</p>
      </Widget>
    )
  }

  return (
    <Widget
      icon={<Heart size={14} />}
      title="Wellness"
      subtitle={log.mood_note ?? 'today'}
    >
      <div className="space-y-3">
        {/* Sleep */}
        <div className="flex items-center justify-between py-2 border-b border-rule-2">
          <span className="font-body text-xs text-ink-2">Sleep</span>
          <div className="text-right">
            <span className="font-display italic text-lg text-ink">{log.sleep_hours}h</span>
          </div>
        </div>

        {/* Steps */}
        {log.steps !== null && (
          <Bar value={log.steps} max={8000} label="Steps" />
        )}

        {/* Water */}
        {log.water_cups !== null && (
          <Bar value={log.water_cups} max={8} label="Water (cups)" />
        )}

        {/* Mood */}
        {log.mood !== null && (
          <div className="flex items-center justify-between pt-1">
            <span className="font-body text-xs text-ink-2">Mood</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < (log.mood ?? 0) ? 'bg-accent' : 'bg-rule'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] text-ink-3">
                {MOOD_LABELS[log.mood ?? 0]}
              </span>
            </div>
          </div>
        )}
      </div>
    </Widget>
  )
}
