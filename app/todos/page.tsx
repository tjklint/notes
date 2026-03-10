'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useTodos } from '@/lib/hooks/useTodos'
import TodoItem from '@/components/todos/TodoItem'
import TodoForm from '@/components/todos/TodoForm'
import BottomNav from '@/components/layout/BottomNav'
import type { Todo } from '@/types/database'

export default function TodosPage() {
  const { todos, loading, createTodo, updateTodo, deleteTodo, toggleComplete } = useTodos()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Todo | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  return (
    <div className="min-h-dvh pb-nav">
      {/* Header */}
      <header className="sticky top-0 z-10 px-4 pt-12 pb-4" style={{ background: 'var(--cream)' }}>
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <span>🍮</span> Todos
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {todos.filter(t => !t.completed).length} remaining
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-3 max-w-lg mx-auto">
          {(['all', 'active', 'done'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex-1 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors"
              style={{
                background: filter === f ? 'var(--primary)' : 'var(--card)',
                color: filter === f ? 'var(--text)' : 'var(--muted)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* List */}
      <main className="px-4 max-w-lg mx-auto flex flex-col gap-2 pb-4">
        {loading && (
          <div className="text-center py-16" style={{ color: 'var(--muted)' }}>Loading…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <span className="text-6xl">🍮</span>
            <p className="font-medium" style={{ color: 'var(--muted)' }}>
              {filter === 'done' ? 'Nothing completed yet!' : 'No todos yet. Add one!'}
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

      <BottomNav onFab={() => setShowForm(true)} />

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
