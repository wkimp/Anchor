import { BookOpen } from 'lucide-react'
import Widget from '@/components/ui/Widget'
import type { Book } from '@/lib/types'

export default function ReadingWidget({ books }: { books: Book[] }) {
  const inProgress = books.filter((book) => book.status === 'reading').length

  return (
    <Widget icon={<BookOpen size={14} />} title="Reading" subtitle={`${inProgress} in progress`}>
      <div>
        {books.slice(0, 4).map((book, index) => (
          <div key={book.id} className={`py-3 ${index === books.slice(0, 4).length - 1 ? '' : 'border-b border-dashed border-rule'}`}>
            <div className="flex items-baseline gap-2 mb-1">
              <p className="flex-1 font-display italic text-sm text-ink truncate">{book.title}</p>
              <span className="font-mono text-[10px] text-ink-4">
                {book.status === 'done' ? '✓' : book.status === 'queued' ? '—' : `${book.progress}%`}
              </span>
            </div>
            <p className="font-body text-xs text-ink-3 mb-2">{book.author}</p>
            {book.status !== 'queued' && (
              <div className="h-0.5 bg-rule">
                <div className={`h-full ${book.status === 'done' ? 'bg-complete' : 'bg-accent'}`} style={{ width: `${book.progress}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Widget>
  )
}
