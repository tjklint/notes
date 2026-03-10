'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import type { Todo } from '@/types/database'

const PRIORITY_LABELS = { low: 'Low', medium: 'Med', high: 'High' } as const
const PRIORITY_COLORS = {
  low: { bg: 'rgba(107, 191, 122, 0.12)', text: '#4A9E5C' },
  medium: { bg: 'rgba(245, 197, 24, 0.15)', text: '#B8940E' },
  high: { bg: 'rgba(224, 123, 90, 0.12)', text: '#C85A32' },
}

interface TodoItemProps {
  todo: Todo
  onToggle: (todo: Todo) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
  compact?: boolean
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit, compact }: TodoItemProps) {
  const [swiped, setSwiped] = useState(false)
  const [bouncing, setBouncing] = useState(false)
  const startX = useRef(0)

  const isCompleted = todo.completed ?? false

  function handleToggle() {
    setBouncing(true)
    onToggle(todo)
    setTimeout(() => setBouncing(false), 300)
  }

  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = startX.current - e.changedTouches[0].clientX
    if (diff > 80) setSwiped(true)
    else if (diff < -80) setSwiped(false)
  }

  return (
    <div className="relative overflow-hidden" style={{ borderRadius: 'var(--radius-md)' }}>
      {/* Swipe-behind actions */}
      <div
        className="absolute inset-0 flex items-center justify-end gap-2 px-4"
        style={{ background: 'var(--danger)', borderRadius: 'var(--radius-md)' }}
      >
        <button onClick={() => onDelete(todo.id)} className="text-white font-semibold text-sm">Delete</button>
      </div>

      {/* Card */}
      <div
        className="card relative flex items-start gap-3 px-4 py-3.5"
        style={{
          transform: swiped ? 'translateX(-80px)' : 'translateX(0)',
          transition: 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
          borderLeft: todo.color ? `3px solid ${todo.color}` : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${bouncing ? 'check-bounce' : ''}`}
          style={{
            borderColor: isCompleted ? 'var(--success)' : 'rgba(139, 94, 60, 0.3)',
            background: isCompleted ? 'var(--success)' : 'transparent',
          }}
        >
          {isCompleted && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2.5}>
              <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0" onClick={() => onEdit(todo)} style={{ cursor: 'pointer' }}>
          <div className="flex items-center gap-2">
            <span
              className={`text-[15px] leading-snug ${isCompleted ? 'todo-completed' : 'font-medium'}`}
              style={{ color: isCompleted ? 'var(--muted)' : 'var(--text)' }}
            >
              {todo.title || <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontWeight: 400 }}>Untitled</span>}
            </span>
          </div>

          {!compact && todo.description && (
            <p className="text-[13px] truncate mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
              {todo.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {todo.priority && (
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: PRIORITY_COLORS[todo.priority].bg, color: PRIORITY_COLORS[todo.priority].text }}
              >
                {PRIORITY_LABELS[todo.priority]}
              </span>
            )}
            {todo.due_date && (
              <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(139, 94, 60, 0.06)', color: 'var(--muted)' }}>
                {new Date(todo.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            )}
            {todo.tags?.map(tag => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245, 197, 24, 0.12)', color: 'var(--brown)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Chevron to sub-todos */}
        <Link
          href={`/todos/${todo.id}`}
          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 transition-colors"
          style={{ background: 'rgba(139, 94, 60, 0.04)' }}
          aria-label="View sub-todos"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth={2}>
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}
