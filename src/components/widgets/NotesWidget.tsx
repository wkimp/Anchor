import Link from 'next/link'
import { StickyNote } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import type { Note } from '@/lib/types'

interface Props {
  notes: Note[]
}

export default function NotesWidget({ notes }: Props) {
  const recent = notes.slice(0, 3)

  return (
    <Widget
      icon={<StickyNote size={14} />}
      title="Notes"
      subtitle={`${notes.length} total`}
      action={(
        <Link
          href="/notes"
          className="rounded-sm border border-rule bg-paper-alt px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3px] text-ink-3 transition-colors hover:text-ink"
        >
          Open
        </Link>
      )}
    >
      <div className="space-y-2">
        {recent.map((note) => (
          <Link
            key={note.id}
            href={`/notes?id=${note.id}`}
            className="block p-3 bg-paper-alt rounded-sm hover:bg-rule-2 transition-colors group"
          >
            <p className="font-body text-sm text-ink font-medium truncate group-hover:text-accent transition-colors">
              {note.title}
            </p>
            <p className="font-body text-xs text-ink-3 mt-0.5 line-clamp-2">
              {note.body}
            </p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="font-mono text-[9px] text-ink-4 uppercase tracking-[0.3px] bg-rule px-1.5 py-0.5 rounded-sm">
                {note.tag}
              </span>
              <span className="font-mono text-[9px] text-ink-4">
                {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </Link>
        ))}
        {notes.length === 0 && (
          <div className="rounded-sm border border-dashed border-rule bg-paper-alt/35 px-4 py-5 text-center">
            <p className="font-display text-base italic text-ink-3">No notes yet.</p>
            <p className="mt-1 font-body text-xs leading-relaxed text-ink-4">
              Capture a thought, a quote, or something you do not want to lose.
            </p>
            <Link
              href="/notes"
              className="mt-3 inline-flex rounded-sm border border-ink bg-ink px-2.5 py-1.5 font-body text-[11px] text-paper transition-opacity hover:opacity-90"
            >
              Write a note
            </Link>
          </div>
        )}
      </div>
      {notes.length > 3 && (
        <Link href="/notes" className="block mt-3 text-center font-mono text-[10px] text-ink-3 hover:text-ink uppercase tracking-[0.3px] transition-colors">
          View all {notes.length} →
        </Link>
      )}
    </Widget>
  )
}
