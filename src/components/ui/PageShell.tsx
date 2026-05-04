interface Props {
  title: string
  subtitle?: string
  children: React.ReactNode
  action?: React.ReactNode
}

export default function PageShell({ title, subtitle, children, action }: Props) {
  return (
    <div className="px-[var(--pad)] py-[var(--pad)]">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-[36px] italic text-ink tracking-[-0.5px] leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="mono-label text-ink-3 mt-2">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0 mt-1">{action}</div>}
      </div>
      {children}
    </div>
  )
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mono-label text-ink-4 mb-3 mt-6 first:mt-0">{children}</h2>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-16 text-center">
      <p className="font-display text-xl italic text-ink-3">{title}</p>
      <p className="font-body text-sm text-ink-4 mt-2 max-w-sm mx-auto">{body}</p>
    </div>
  )
}
