'use client'

import { Sparkles } from 'lucide-react'

interface Props {
  onOpen: () => void
}

export default function AgentButton({ onOpen }: Props) {
  return (
    <button
      onClick={onOpen}
      title="Ask Anchor"
      className="fixed right-5 bottom-20 lg:bottom-5 z-40 w-[52px] h-[52px] rounded-full bg-ink text-paper border border-ink flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
      style={{ boxShadow: '0 10px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1)' }}
    >
      <Sparkles size={20} />
    </button>
  )
}
