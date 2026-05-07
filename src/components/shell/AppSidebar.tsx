'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AnchorLogo from '@/components/branding/AnchorLogo'
import {
  Sparkles, Calendar, ArrowRight, Moon,
  Briefcase, Folder, Users, Home, Heart,
  DollarSign, BookOpen, Utensils, StickyNote,
  PenLine, Footprints, Settings, Circle,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  sparkle: Sparkles, cal: Calendar, 'arrow-r': ArrowRight, moon: Moon,
  briefcase: Briefcase, folder: Folder, people: Users, home: Home,
  heart: Heart, dollar: DollarSign, book: BookOpen, fork: Utensils,
  note: StickyNote, pen: PenLine, run: Footprints, circle: Circle,
  settings: Settings,
}

const NAV_SECTIONS = [
  {
    group: 'Plan',
    items: [
      { id: 'today',    href: '/',         label: 'Today',         icon: 'sparkle', showCount: true },
      { id: 'week',     href: '/week',     label: 'This week',     icon: 'cal' },
      { id: 'upcoming', href: '/upcoming', label: 'Upcoming',      icon: 'arrow-r' },
      { id: 'someday',  href: '/someday',  label: 'Someday',       icon: 'moon' },
    ],
  },
  {
    group: 'Areas',
    items: [
      { id: 'business', href: '/business', label: 'Business',  icon: 'briefcase' },
      { id: 'projects', href: '/projects', label: 'Projects',  icon: 'folder' },
      { id: 'people',   href: '/people',   label: 'People',    icon: 'people' },
      { id: 'home',     href: '/home',     label: 'Home',      icon: 'home' },
      { id: 'health',   href: '/health',   label: 'Health',    icon: 'heart' },
      { id: 'finance',  href: '/finance',  label: 'Finances',  icon: 'dollar' },
      { id: 'reading',  href: '/reading',  label: 'Reading',   icon: 'book' },
      { id: 'meals',    href: '/meals',    label: 'Meals',     icon: 'fork' },
    ],
  },
  {
    group: 'Reflect',
    items: [
      { id: 'notes',   href: '/notes',         label: 'Notes',         icon: 'note' },
      { id: 'habits',  href: '/habits',        label: 'Habits',        icon: 'sparkle' },
      { id: 'review',  href: '/weekly-review', label: 'Weekly review', icon: 'pen' },
    ],
  },
  {
    group: 'System',
    items: [
      { id: 'settings', href: '/settings', label: 'Settings', icon: 'settings' },
    ],
  },
]

interface Props {
  openTaskCount: number
}

export default function AppSidebar({ openTaskCount }: Props) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav
      className="w-[226px] flex-shrink-0 overflow-y-auto border-r border-rule bg-paper py-6"
      aria-label="Main navigation"
    >
      <div className="mb-6 px-5">
        <AnchorLogo size="sidebar" href="/" subtitle="Drift Less. Do more." />
      </div>

      {NAV_SECTIONS.map((section, index) => (
        <div key={section.group} className={index === NAV_SECTIONS.length - 1 ? '' : 'mb-6'}>
          <p className="mono-label mb-2.5 px-5 text-ink-4">{section.group}</p>
          {section.items.map((item) => {
            const active = isActive(item.href)
            const IconComp = ICON_MAP[item.icon] ?? Circle
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative flex w-full items-center gap-2.5 px-5 py-[8px] text-sm font-body transition-colors ${
                  active
                    ? 'bg-paper-alt/60 text-ink font-medium'
                    : 'text-ink-2 hover:bg-paper-alt/35 hover:text-ink'
                }`}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
                <IconComp
                  size={14}
                  className={active ? 'text-accent' : 'text-ink-3'}
                />
                <span className="flex-1">{item.label}</span>
                {item.showCount && openTaskCount > 0 && (
                  <span className="rounded-full border border-rule bg-card px-1.5 py-0.5 font-mono text-[10px] text-ink-3">
                    {openTaskCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
