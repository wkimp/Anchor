'use client'

import { Clock } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import type { ScheduleBlock } from '@/lib/types'

const KIND_COLORS: Record<ScheduleBlock['kind'], string> = {
  ritual: 'bg-accent-soft text-accent',
  focus: 'bg-ink text-paper',
  meeting: 'bg-rule text-ink-2',
  personal: 'bg-rule-2 text-ink-2',
  wellness: 'bg-accent-soft text-accent',
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function blockHeightPx(start: string, end: string): number {
  const s = new Date(start)
  const e = new Date(end)
  const mins = (e.getTime() - s.getTime()) / 60000
  return Math.max(36, (mins / 60) * 60)
}

interface Props {
  blocks: ScheduleBlock[]
}

export default function ScheduleWidget({ blocks }: Props) {
  const hours = Array.from({ length: 16 }, (_, i) => i + 6) // 6am–10pm

  const nowHour = new Date().getHours() + new Date().getMinutes() / 60

  return (
    <Widget icon={<Clock size={14} />} title="Schedule" subtitle="today">
      <div className="relative">
        {/* Hour lines */}
        {hours.map((h) => (
          <div key={h} className="flex items-start gap-2 h-[60px]">
            <span className="font-mono text-[9px] text-ink-4 w-8 text-right pt-0.5 flex-shrink-0 uppercase">
              {h === 12 ? '12p' : h > 12 ? `${h - 12}p` : `${h}a`}
            </span>
            <div className="flex-1 border-t border-rule-2 relative" />
          </div>
        ))}

        {/* Now indicator */}
        {nowHour >= 6 && nowHour <= 22 && (
          <div
            className="absolute left-10 right-0 flex items-center gap-1 pointer-events-none z-10"
            style={{ top: `${(nowHour - 6) * 60}px` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            <div className="flex-1 h-px bg-accent opacity-60" />
          </div>
        )}

        {/* Blocks */}
        {blocks.map((block) => {
          const startH = new Date(block.start_ts).getHours() + new Date(block.start_ts).getMinutes() / 60
          const topPx = (startH - 6) * 60
          const heightPx = blockHeightPx(block.start_ts, block.end_ts)
          if (startH < 6 || startH > 22) return null
          return (
            <div
              key={block.id}
              className={`absolute left-10 right-0 px-2 py-1 rounded-sm text-xs font-body overflow-hidden ${KIND_COLORS[block.kind]}`}
              style={{ top: topPx, height: heightPx }}
            >
              <p className="font-medium truncate leading-tight">{block.title}</p>
              <p className="font-mono text-[9px] mt-0.5 opacity-70">
                {fmtTime(block.start_ts)} – {fmtTime(block.end_ts)}
              </p>
            </div>
          )
        })}
      </div>
    </Widget>
  )
}
