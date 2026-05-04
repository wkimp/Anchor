import PageShell from '@/components/ui/PageShell'

export default function SomedayPage() {
  const items = [
    'Learn to play the guitar',
    'Do a week-long digital detox',
    'Build a cabin in the woods',
    'Write a short story',
  ]

  return (
    <PageShell title="Someday" subtitle="Parking lot for vague maybes">
      <div className="bg-card border border-rule rounded-sm p-5 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-rule-2 last:border-b-0">
            <div className="w-4 h-4 rounded-sm border border-rule flex-shrink-0" />
            <p className="font-body text-sm text-ink-2">{item}</p>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
