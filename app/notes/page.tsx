'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { useNotes } from '@/lib/hooks/useNotes'
import NoteCard from '@/components/notes/NoteCard'
import BottomNav from '@/components/layout/BottomNav'

export default function NotesPage() {
  const { notes, loading, createNote, deleteNote } = useNotes()
  const router = useRouter()

  async function handleCreate() {
    const note = await createNote({ title: null, content: null })
    if (note) router.push(`/notes/${note.id}`)
  }

  return (
    <div className="min-h-dvh pb-nav">
      <header className="sticky top-0 z-10 px-4 pt-12 pb-4" style={{ background: 'var(--cream)' }}>
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <span>📓</span> Notes
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        </div>
      </header>

      <main className="px-4 max-w-lg mx-auto">
        {loading && (
          <div className="text-center py-16" style={{ color: 'var(--muted)' }}>Loading…</div>
        )}

        {!loading && notes.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <span className="text-6xl">📓</span>
            <p className="font-medium" style={{ color: 'var(--muted)' }}>No notes yet. Tap + to write one!</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pb-4">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      </main>

      <BottomNav onFab={handleCreate} />
    </div>
  )
}
