'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTodos } from '@/lib/hooks/useTodos'
import { useNotes } from '@/lib/hooks/useNotes'
import TodoItem from '@/components/todos/TodoItem'
import TodoForm from '@/components/todos/TodoForm'
import BottomNav from '@/components/layout/BottomNav'
import type { Todo } from '@/types/database'

export default function TodosPage() {
  const { todos, loading, createTodo, updateTodo, deleteTodo, toggleComplete } = useTodos()
  const { createNote } = useNotes()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Todo | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  const remaining = todos.filter(t => !t.completed).length

  async function handleCreateNote() {
    const note = await createNote({ title: null, content: null })
    if (note) router.push(`/notes/${note.id}`)
  }

  return (
    <div className="min-h-dvh pb-nav">
      {/* Header */}
      <header className="px-5 pt-14 pb-2" style={{ background: 'var(--cream)' }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-[13px] font-medium mb-0.5" style={{ color: 'var(--muted)' }}>
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-[28px] font-bold leading-tight" style={{ color: 'var(--text)' }}>
                My Todos
              </h1>
            </div>
            <span
              className="text-[13px] font-semibold px-3 py-1 rounded-full"
              style={{ background: remaining > 0 ? 'rgba(245, 197, 24, 0.15)' : 'rgba(107, 191, 122, 0.12)', color: remaining > 0 ? 'var(--brown)' : 'var(--success)' }}
            >
              {remaining > 0 ? `${remaining} left` : 'All done!'}
            </span>
          </div>

          {/* Filter pills */}
          <div
            className="flex gap-1 p-1 rounded-2xl"
            style={{ background: 'rgba(139, 94, 60, 0.04)' }}
          >
            {(['all', 'active', 'done'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 rounded-xl text-[13px] font-medium capitalize transition-all ${filter === f ? 'pill-active' : ''}`}
                style={filter !== f ? { color: 'var(--muted)' } : {}}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* List */}
      <main className="px-4 pt-3 max-w-lg mx-auto flex flex-col gap-2 animate-in">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center gap-3">
            <span className="text-6xl">🍮</span>
            <p className="font-medium text-[15px]" style={{ color: 'var(--muted)' }}>
              {filter === 'done' ? 'Nothing completed yet' : filter === 'active' ? 'All caught up!' : 'Tap + to add your first todo'}
            </p>
          </div>
        )}

        {filtered.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleComplete}
            onDelete={deleteTodo}
            onEdit={setEditing}
          />
        ))}
      </main>

      <BottomNav onCreateTodo={() => setShowForm(true)} onCreateNote={handleCreateNote} />

      {showForm && (
        <TodoForm
          onSubmit={fields => createTodo(fields)}
          onClose={() => setShowForm(false)}
        />
      )}
      {editing && (
        <TodoForm
          initial={editing}
          onSubmit={fields => updateTodo(editing.id, fields)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
