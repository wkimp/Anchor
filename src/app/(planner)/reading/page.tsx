import { createClient } from '@/lib/supabase/server'
import { DEMO_BOOKS } from '@/lib/demo-data'
import PageShell, { EmptyState, SectionTitle } from '@/components/ui/PageShell'
import type { Book } from '@/lib/types'

export default async function ReadingPage() {
  let books: Book[] = DEMO_BOOKS

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('books')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (data?.length) books = data as Book[]
      }
    } catch {
      // use demo data
    }
  }

  const reading = books.filter((book) => book.status === 'reading')
  const queued = books.filter((book) => book.status === 'queued')
  const done = books.filter((book) => book.status === 'done')

  return (
    <PageShell title="Reading" subtitle={`${reading.length} in progress · ${queued.length} queued · ${done.length} done`}>
      <SectionTitle>In progress</SectionTitle>
      <BookList books={reading} showProgress />

      {queued.length > 0 && (
        <>
          <SectionTitle>Up next</SectionTitle>
          <BookList books={queued} />
        </>
      )}

      {done.length > 0 && (
        <>
          <SectionTitle>Finished</SectionTitle>
          <BookList books={done} />
        </>
      )}
    </PageShell>
  )
}

function BookList({ books, showProgress = false }: { books: Book[]; showProgress?: boolean }) {
  if (!books.length) {
    return (
      <EmptyState
        title="Nothing here yet."
        body="Add a book when you want this shelf to feel like a living reading life instead of a blank ledger."
      />
    )
  }

  return (
    <div className="bg-card border border-rule rounded-sm divide-y divide-dashed divide-rule mb-6">
      {books.map((book) => (
        <div key={book.id} className="px-4 py-4">
          <div className="flex items-baseline gap-3 mb-1">
            <p className="flex-1 font-display italic text-[16px] text-ink truncate">{book.title}</p>
            <span className="font-mono text-[10px] text-ink-4">
              {book.status === 'done' ? '✓' : book.status === 'queued' ? '—' : `${book.progress}%`}
            </span>
          </div>
          <p className="font-body text-xs text-ink-3 mb-3">{book.author}</p>
          {showProgress && book.progress > 0 && (
            <div className="h-1 bg-rule overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${book.progress}%` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
