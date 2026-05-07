import PageShell from '@/components/ui/PageShell'

const COLUMNS = [
  {
    title: 'Someday',
    items: [
      'Visit Kyoto in autumn',
      'Learn to throw pottery',
      'Write a long-form essay on rest',
      'Host a supper club',
      'Build a standing desk',
    ],
  },
  {
    title: 'Maybe',
    items: [
      'Switch to a standing phone holder setup',
      'Cook through Samin Nosrat\'s book',
      'Redesign the home office',
      'Take a watercolor class',
    ],
  },
  {
    title: 'Waiting on',
    items: [
      'Aperture contract signature',
      'Sam\'s edit on the proposal',
      'Landlord re: dishwasher',
    ],
  },
]

export default function SomedayPage() {
  return (
    <PageShell title="Someday" subtitle="No deadline, still worth holding">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[var(--gap)]">
        {COLUMNS.map((column) => (
          <section key={column.title} className="bg-card border border-rule rounded-sm p-5">
            <div className="pb-3 mb-3 border-b border-rule">
              <h2 className="font-display italic text-lg text-ink">{column.title}</h2>
            </div>

            <div className="space-y-0">
              {column.items.map((item, index) => (
                <div
                  key={item}
                  className={`flex items-start gap-3 py-3 ${index === column.items.length - 1 ? '' : 'border-b border-dashed border-rule'}`}
                >
                  <span className="font-display italic text-accent text-base leading-none mt-0.5">·</span>
                  <p className="font-body text-sm leading-relaxed text-ink-2">{item}</p>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full border border-dashed border-rule rounded-sm px-3 py-2 font-body text-xs text-ink-3 hover:border-ink hover:text-ink transition-colors cursor-pointer">
              Add item
            </button>
          </section>
        ))}
      </div>
    </PageShell>
  )
}
