'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface Props {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
  span?: 1 | 2 | 3
  collapsible?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function Widget({
  icon,
  title,
  subtitle,
  action,
  span = 1,
  collapsible = true,
  defaultOpen = true,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className="bg-card border border-rule rounded-sm p-5 flex flex-col relative"
      style={{ gridColumn: span > 1 ? `span ${span}` : undefined }}
    >
      {/* Widget header */}
      <div className="flex items-center gap-2.5 mb-3.5 pb-3 border-b border-rule">
        {icon && <span className="text-ink-3 flex-shrink-0">{icon}</span>}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-[17px] italic text-ink tracking-[-0.2px] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="font-mono text-[10px] text-ink-3 mt-0.5 tracking-[0.3px]">
              {subtitle}
            </p>
          )}
        </div>
        {action}
        {collapsible && (
          <button
            onClick={() => setOpen(!open)}
            className="text-ink-3 hover:text-ink transition-colors p-1 cursor-pointer"
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {open && <div className="flex-1">{children}</div>}
    </div>
  )
}
