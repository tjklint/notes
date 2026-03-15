'use client'

export const dynamic = 'force-dynamic'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTodos } from '@/lib/hooks/useTodos'
import { getCachedTodo } from '@/lib/cache'
import TodoForm from '@/components/todos/TodoForm'
import SubTodoList from '@/components/todos/SubTodoList'
import type { Todo } from '@/types/database'

const PRIORITY_COLORS = {
  low: { bg: 'rgba(107, 191, 122, 0.12)', text: '#4A9E5C' },
  medium: { bg: 'rgba(245, 197, 24, 0.15)', text: '#B8940E' },
  high: { bg: 'rgba(224, 123, 90, 0.12)', text: '#C85A32' },
}

export default function TodoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [parent, setParent] = useState<Todo | null>(() => getCachedTodo(id))
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { updateTodo, deleteTodo, toggleComplete } = useTodos()
  const router = useRouter()

  // Background refresh to get latest data
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single()
      .then((result: { data: Todo | null }) => {
        if (result.data) setParent(result.data)
      })
  }, [id])

  if (!parent) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  async function handleDelete() {
    await deleteTodo(id)
    router.push('/todos')
  }

  function handleToggle() {
    toggleComplete(parent!)
    setParent(p => p ? { ...p, completed: !p.completed } : p)
  }

  const isCompleted = parent.completed ?? false

  return (
    <div className="min-h-dvh animate-in" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <header className="px-4 pt-14 pb-4">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <button
            onClick={() => router.push('/todos')}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors"
            style={{ background: 'rgba(139, 94, 60, 0.06)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="flex-1" />
          <button
            onClick={() => setEditing(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors"
            style={{ background: 'rgba(139, 94, 60, 0.06)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={handleDelete} className="px-3 py-2 rounded-2xl text-[13px] font-semibold text-white" style={{ background: 'var(--danger)' }}>
                Delete
              </button>
              <button onClick={() => setConfirmDelete(false)} className="px-3 py-2 rounded-2xl text-[13px] font-medium" style={{ color: 'var(--muted)' }}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors"
              style={{ background: 'rgba(224, 123, 90, 0.06)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth={2}>
                <polyline points="3 6 5 6 21 6" strokeLinecap="round"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </header>

      <main className="px-4 max-w-lg mx-auto flex flex-col gap-5 pb-12">
        {/* Main card */}
        <div className="card p-5" style={{ borderLeft: parent.color ? `3px solid ${parent.color}` : undefined }}>
          <div className="flex items-start gap-3">
            <button
              onClick={handleToggle}
              className="flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all"
              style={{
                borderColor: isCompleted ? 'var(--success)' : 'rgba(139, 94, 60, 0.3)',
                background: isCompleted ? 'var(--success)' : 'transparent',
              }}
            >
              {isCompleted && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2.5}>
                  <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <div className="flex-1">
              <h2 className={`text-xl font-bold ${isCompleted ? 'todo-completed' : ''}`} style={{ color: isCompleted ? 'var(--muted)' : 'var(--text)' }}>
                {parent.title || <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontWeight: 400 }}>Untitled</span>}
              </h2>
              {parent.description && (
                <p className="text-[14px] mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {parent.description}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                {parent.priority && (
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: PRIORITY_COLORS[parent.priority].bg, color: PRIORITY_COLORS[parent.priority].text }}>
                    {parent.priority}
                  </span>
                )}
                {parent.due_date && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(139, 94, 60, 0.06)', color: 'var(--muted)' }}>
                    {new Date(parent.due_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                )}
                {parent.tags?.map(tag => (
                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(245, 197, 24, 0.12)', color: 'var(--brown)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-todos */}
        <SubTodoList parentId={id} />
      </main>

      {editing && (
        <TodoForm
          initial={parent}
          onSubmit={async fields => {
            await updateTodo(id, fields)
            setParent(p => p ? { ...p, ...fields } : p)
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  )
}
