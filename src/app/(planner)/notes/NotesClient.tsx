'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, StickyNote, Pencil } from 'lucide-react'
import PageShell, { SectionTitle } from '@/components/ui/PageShell'
import InlineStatus from '@/components/ui/InlineStatus'
import { createNote, deleteNote, updateNote } from '@/app/actions/notes'
import type { Note } from '@/lib/types'

const TAGS = ['work', 'home', 'journal', 'ideas', 'other']

export function NotesPageClient({ notes: initialNotes }: { notes: Note[] }) {
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tag, setTag] = useState('work')
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const now = new Date().toISOString()
    const optimistic: Note = {
      id: `tmp-${Date.now()}`, user_id: 'demo',
      title, body, tag, created_at: now, updated_at: now,
    }
    setNotes((n) => [optimistic, ...n])
    const t = title; const b = body; const tg = tag
    setMessage('Note added.')
    setCreating(false); setTitle(''); setBody(''); setTag('work')
    startTransition(async () => { await createNote(t, b, tg); router.refresh() })
  }

  function beginEdit(note: Note) {
    setCreating(true)
    setEditingId(note.id)
    setTitle(note.title)
    setBody(note.body)
    setTag(note.tag)
    setMessage('')
  }

  function resetComposer() {
    setCreating(false)
    setEditingId(null)
    setTitle('')
    setBody('')
    setTag('work')
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    if (!editingId) {
      handleCreate(e)
      return
    }

    setNotes((current) =>
      current.map((note) =>
        note.id === editingId ? { ...note, title, body, tag, updated_at: new Date().toISOString() } : note,
      ),
    )
    const noteId = editingId
    const nextTitle = title
    const nextBody = body
    const nextTag = tag
    setMessage('Note updated.')
    resetComposer()
    startTransition(async () => {
      await updateNote(noteId, nextTitle, nextBody, nextTag)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    setNotes((n) => n.filter((x) => x.id !== id))
    setMessage('Note removed.')
    startTransition(async () => { await deleteNote(id); router.refresh() })
  }

  return (
    <PageShell
      title="Notes"
      subtitle={`${notes.length} captured`}
      action={
        <button
          onClick={() => {
            if (creating && !editingId) {
              resetComposer()
              return
            }
            setCreating(true)
            setEditingId(null)
            setMessage('')
          }}
          className="flex items-center gap-1.5 border border-rule bg-card text-ink-2 font-body text-xs px-3 py-2 rounded-sm hover:text-ink transition-colors cursor-pointer"
        >
          <Plus size={13} /> {creating && !editingId ? 'Close' : 'New note'}
        </button>
      }
    >
      {creating && (
        <div className="bg-card border border-rule rounded-sm p-5 mb-[var(--gap)]">
          <form onSubmit={handleSave} className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title…"
              className="w-full bg-paper-alt border border-rule rounded-sm px-3 py-2 font-body text-sm text-ink placeholder-ink-4 outline-none focus:border-ink"
              autoFocus
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write anything…"
              rows={4}
              className="w-full bg-paper-alt border border-rule rounded-sm px-3 py-2 font-body text-sm text-ink placeholder-ink-4 outline-none resize-none focus:border-ink"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1">
                {TAGS.map((t) => (
                  <button key={t} type="button" onClick={() => setTag(t)}
                    className={`font-mono text-[10px] uppercase tracking-[0.3px] px-2 py-1 rounded-sm cursor-pointer transition-colors ${tag === t ? 'bg-ink text-paper' : 'bg-paper-alt text-ink-3 hover:text-ink'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <button type="button" onClick={resetComposer} className="font-body text-xs text-ink-3 hover:text-ink cursor-pointer">Cancel</button>
                <button type="submit" disabled={isPending} className="font-body text-xs bg-ink text-paper px-3 py-1.5 rounded-sm cursor-pointer hover:opacity-90 disabled:opacity-50">{editingId ? 'Save changes' : 'Save'}</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {(message || isPending) && (
        <InlineStatus
          tone={isPending ? 'info' : 'success'}
          message={isPending ? 'Saving your note changes…' : message}
        />
      )}

      <SectionTitle>All notes</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--gap)]">
        {notes.map((note) => (
          <div key={note.id} className="bg-card border border-rule rounded-sm p-4 group relative">
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={() => beginEdit(note)}
                className="text-ink-4 hover:text-ink cursor-pointer"
                aria-label="Edit note"
              >
                <Pencil size={12} />
              </button>
              <button onClick={() => handleDelete(note.id)}
                className="text-ink-4 hover:text-ink cursor-pointer"
                aria-label="Delete note">
                <X size={12} />
              </button>
            </div>
            <h3 className="font-body text-sm font-medium text-ink mb-1 pr-4">{note.title}</h3>
            <p className="font-body text-xs text-ink-3 line-clamp-3 leading-relaxed">{note.body}</p>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-rule-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.3px] text-ink-4 bg-paper-alt px-1.5 py-0.5 rounded-sm">{note.tag}</span>
              <span className="font-mono text-[9px] text-ink-4">
                {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
        {notes.length === 0 && !creating && (
          <div className="col-span-full py-16 text-center">
            <StickyNote size={24} className="text-ink-4 mx-auto mb-3" />
            <p className="font-display italic text-xl text-ink-3">No notes yet.</p>
          </div>
        )}
      </div>
    </PageShell>
  )
}
