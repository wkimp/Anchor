'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Calendar, Folder, StickyNote, Settings } from 'lucide-react'

const ITEMS = [
  { href: '/',         label: 'Today',    Icon: Sparkles   },
  { href: '/week',     label: 'Week',     Icon: Calendar   },
  { href: '/projects', label: 'Areas',    Icon: Folder     },
  { href: '/notes',    label: 'Notes',    Icon: StickyNote },
  { href: '/settings', label: 'Settings', Icon: Settings   },
]

export default function BottomNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="flex flex-shrink-0 border-t border-rule bg-paper/95 pb-safe backdrop-blur-[1px]" aria-label="Mobile navigation">
      {ITEMS.map(({ href, label, Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-body tracking-[0.3px] transition-colors ${
              active ? 'text-accent' : 'text-ink-3'
            }`}
          >
            {active && (
              <span className="absolute inset-x-5 top-0 h-px bg-accent" />
            )}
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
