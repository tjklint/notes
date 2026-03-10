'use client'

import { useState } from 'react'
import { useTodos } from '@/lib/hooks/useTodos'
import TodoItem from './TodoItem'
import TodoForm from './TodoForm'
import type { Todo } from '@/types/database'

export default function SubTodoList({ parentId }: { parentId: string }) {
  const { todos, loading, createTodo, updateTodo, deleteTodo, toggleComplete } = useTodos(parentId)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Todo | null>(null)

  if (loading) return <div className="text-sm py-2" style={{ color: 'var(--muted)' }}>Loading…</div>

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
          Sub-tasks ({todos.length})
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="text-sm btn-ghost py-1 px-2"
          style={{ fontSize: '0.8rem' }}
        >
          + Add
        </button>
      </div>

      {todos.length === 0 && (
        <p className="text-sm py-3 text-center" style={{ color: 'var(--muted)' }}>No sub-tasks yet 🍮</p>
      )}

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleComplete}
          onDelete={deleteTodo}
          onEdit={setEditing}
        />
      ))}

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
