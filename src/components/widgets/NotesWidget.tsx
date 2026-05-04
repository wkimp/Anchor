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
    <Widget icon={<StickyNote size={14} />} title="Notes" subtitle={`${notes.length} total`}>
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
          <p className="font-body text-sm text-ink-4 italic py-2 text-center">No notes yet.</p>
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
