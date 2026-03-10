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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold tracking-wide uppercase" style={{ color: 'var(--muted)' }}>
          Sub-tasks{todos.length > 0 && ` (${todos.length})`}
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="text-[13px] font-semibold px-3 py-1 rounded-full transition-colors"
          style={{ color: 'var(--brown)', background: 'rgba(245, 197, 24, 0.12)' }}
        >
          + Add
        </button>
      </div>

      {todos.length === 0 && (
        <div className="text-center py-8 flex flex-col items-center gap-2">
          <span className="text-3xl">🍮</span>
          <p className="text-[13px]" style={{ color: 'var(--muted)' }}>No sub-tasks yet</p>
        </div>
      )}

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleComplete}
          onDelete={deleteTodo}
          onEdit={setEditing}
          compact
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
