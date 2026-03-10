'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotes } from '@/lib/hooks/useNotes'
import { useTodos } from '@/lib/hooks/useTodos'
import NoteCard from '@/components/notes/NoteCard'
import TodoForm from '@/components/todos/TodoForm'
import BottomNav from '@/components/layout/BottomNav'

export default function NotesPage() {
  const { notes, loading, createNote, deleteNote } = useNotes()
  const { createTodo } = useTodos()
  const router = useRouter()
  const [showTodoForm, setShowTodoForm] = useState(false)

  async function handleCreateNote() {
    const note = await createNote({ title: null, content: null })
    if (note) router.push(`/notes/${note.id}`)
  }

  return (
    <div className="min-h-dvh pb-nav">
      <header className="px-5 pt-14 pb-2" style={{ background: 'var(--cream)' }}>
        <div className="max-w-lg mx-auto">
          <p className="text-[13px] font-medium mb-0.5" style={{ color: 'var(--muted)' }}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-[28px] font-bold leading-tight" style={{ color: 'var(--text)' }}>
            My Notes
          </h1>
        </div>
      </header>

      <main className="px-4 pt-3 max-w-lg mx-auto animate-in">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          </div>
        )}

        {!loading && notes.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center gap-3">
            <span className="text-6xl">📝</span>
            <p className="font-medium text-[15px]" style={{ color: 'var(--muted)' }}>
              Tap + to write your first note
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pb-4">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      </main>

      <BottomNav onCreateTodo={() => setShowTodoForm(true)} onCreateNote={handleCreateNote} />

      {showTodoForm && (
        <TodoForm
          onSubmit={fields => createTodo(fields)}
          onClose={() => setShowTodoForm(false)}
        />
      )}
    </div>
  )
}
