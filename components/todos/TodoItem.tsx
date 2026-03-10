'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Todo } from '@/types/database'

const PRIORITY_COLORS = {
  low: 'var(--success)',
  medium: 'var(--primary)',
  high: 'var(--danger)',
}

interface TodoItemProps {
  todo: Todo
  onToggle: (todo: Todo) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isCompleted = todo.completed ?? false

  return (
    <div
      className="card flex items-center gap-3 px-4 py-3 group"
      style={todo.color ? { borderLeft: `4px solid ${todo.color}` } : {}}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo)}
        className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
        style={{
          borderColor: isCompleted ? 'var(--success)' : 'var(--brown)',
          background: isCompleted ? 'var(--success)' : 'transparent',
        }}
        aria-label="Toggle complete"
      >
        {isCompleted && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2}>
            <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {todo.priority && (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: PRIORITY_COLORS[todo.priority] }}
            />
          )}
          <span
            className={`font-medium truncate ${isCompleted ? 'todo-completed' : ''}`}
            style={{ color: isCompleted ? 'var(--muted)' : 'var(--text)' }}
          >
            {todo.title ?? <em style={{ color: 'var(--muted)' }}>Untitled</em>}
          </span>
        </div>
        {todo.description && (
          <p className="text-sm truncate mt-0.5" style={{ color: 'var(--muted)' }}>
            {todo.description}
          </p>
        )}
        {todo.due_date && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Due: {new Date(todo.due_date).toLocaleDateString()}
          </p>
        )}
        {todo.tags && todo.tags.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {todo.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--primary-lt)', color: 'var(--brown)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          href={`/todos/${todo.id}`}
          className="p-1.5 rounded-lg hover:bg-yellow-100"
          aria-label="View sub-todos"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2}>
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <button onClick={() => onEdit(todo)} className="p-1.5 rounded-lg hover:bg-yellow-100" aria-label="Edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {confirmDelete ? (
          <>
            <button
              onClick={() => onDelete(todo.id)}
              className="text-xs px-2 py-1 rounded-lg font-semibold"
              style={{ background: 'var(--danger)', color: 'white' }}
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ color: 'var(--muted)' }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded-lg hover:bg-red-50"
            aria-label="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth={2}>
              <polyline points="3 6 5 6 21 6" strokeLinecap="round"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 11v6M14 11v6" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
