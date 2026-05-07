type Tone = 'success' | 'error' | 'info'

const TONE_CLASSES: Record<Tone, string> = {
  success: 'border-accent/30 bg-accent-soft/45 text-ink-2',
  error: 'border-[#B45B47]/35 bg-[#F3E3DE] text-[#7F3A2F]',
  info: 'border-rule bg-paper-alt/70 text-ink-3',
}

export default function InlineStatus({
  message,
  tone = 'info',
}: {
  message: string
  tone?: Tone
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mb-4 rounded-sm border px-3 py-2 font-body text-xs ${TONE_CLASSES[tone]}`}
    >
      {message}
    </div>
  )
}
