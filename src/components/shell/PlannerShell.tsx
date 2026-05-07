'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'
import BottomNav from './BottomNav'
import AgentButton from '@/components/agent/AgentButton'
import AgentPanel from '@/components/agent/AgentPanel'
import ThemeSync from '@/components/ThemeSync'
import type { ViewName } from '@/lib/types'

interface Props {
  children: React.ReactNode
  openTaskCount: number
  greetingName: string
}

function deriveView(pathname: string): ViewName {
  if (pathname === '/week') return 'Week'
  if (pathname === '/month') return 'Month'
  if (pathname === '/all') return 'All'
  return 'Today'
}

export default function PlannerShell({ children, openTaskCount, greetingName }: Props) {
  const pathname = usePathname()
  const [view, setView] = useState<ViewName>(() => deriveView(pathname))
  const [agentOpen, setAgentOpen] = useState(false)

  useEffect(() => {
    setView(deriveView(pathname))
  }, [pathname])

  return (
    <>
      <ThemeSync />
      <div className="flex h-full flex-col overflow-hidden">
        <AppHeader
          view={view}
          onViewChange={setView}
          openTaskCount={openTaskCount}
          greetingName={greetingName}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar — desktop only */}
          <div className="hidden lg:flex">
            <AppSidebar openTaskCount={openTaskCount} />
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto" id="main-content">
            {children}

            {/* Footer */}
            <footer className="mt-6 border-t border-rule px-[var(--pad)] py-5">
              <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.3px] text-ink-4 sm:flex-row sm:justify-between">
                <span>— end of page —</span>
                <span>
                  pg.{' '}
                  {Math.ceil(
                    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) /
                      86400000,
                  )}{' '}
                  of 365 · {new Date().getFullYear()}
                </span>
              </div>
            </footer>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>

      {/* AI Agent */}
      {!agentOpen && <AgentButton onOpen={() => setAgentOpen(true)} />}
      {agentOpen && (
        <AgentPanel onClose={() => setAgentOpen(false)} />
      )}
    </>
  )
}
