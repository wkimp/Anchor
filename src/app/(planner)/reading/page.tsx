import { createClient } from '@/lib/supabase/server'
import { DEMO_BOOKS } from '@/lib/demo-data'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
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
    } catch { /* use demo */ }
  }

  const reading = books.filter((b) => b.status === 'reading')
  const queued = books.filter((b) => b.status === 'queued')
  const done = books.filter((b) => b.status === 'done')

  return (
    <PageShell
      title="Reading"
      subtitle={`${reading.length} in progress · ${queued.length} queued · ${done.length} done`}
    >
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
    return <p className="font-body text-sm text-ink-4 italic py-3">Nothing here yet.</p>
  }
  return (
    <div className="bg-card border border-rule rounded-sm divide-y divide-rule-2 mb-6">
      {books.map((book) => (
        <div key={book.id} className="px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-medium text-ink">{book.title}</p>
              <p className="font-body text-xs text-ink-3 mt-0.5">{book.author}</p>
            </div>
            {showProgress && (
              <span className="font-mono text-[11px] text-ink-3 flex-shrink-0">{book.progress}%</span>
            )}
          </div>
          {showProgress && book.progress > 0 && (
            <div className="mt-2 h-1 bg-rule rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${book.progress}%` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
