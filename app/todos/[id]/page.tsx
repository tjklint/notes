'use client'

export const dynamic = 'force-dynamic'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTodos } from '@/lib/hooks/useTodos'
import TodoItem from '@/components/todos/TodoItem'
import TodoForm from '@/components/todos/TodoForm'
import SubTodoList from '@/components/todos/SubTodoList'
import BottomNav from '@/components/layout/BottomNav'
import type { Todo } from '@/types/database'

export default function TodoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [parent, setParent] = useState<Todo | null>(null)
  const [editing, setEditing] = useState(false)
  const { updateTodo, deleteTodo, toggleComplete } = useTodos()
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.from('todos').select('*').eq('id', id).single().then(({ data }) => setParent(data))
  }, [id])

  if (!parent) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ color: 'var(--muted)' }}>
        Loading…
      </div>
    )
  }

  async function handleDelete() {
    await deleteTodo(id)
    router.push('/todos')
  }

  return (
    <div className="min-h-dvh pb-nav">
      {/* Header */}
      <header className="sticky top-0 z-10 px-4 pt-12 pb-4" style={{ background: 'var(--cream)' }}>
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => router.push('/todos')} className="btn-ghost p-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-bold flex-1 truncate" style={{ color: 'var(--text)' }}>
            {parent.title ?? <em style={{ color: 'var(--muted)' }}>Untitled</em>}
          </h1>
          <button onClick={() => setEditing(true)} className="btn-ghost p-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="px-4 max-w-lg mx-auto flex flex-col gap-4">
        {/* Parent todo card */}
        <TodoItem
          todo={parent}
          onToggle={t => { toggleComplete(t); setParent({ ...t, completed: !t.completed }) }}
          onDelete={handleDelete}
          onEdit={() => setEditing(true)}
        />

        {/* Details */}
        {parent.description && (
          <div className="card p-4">
            <p style={{ color: 'var(--text)' }}>{parent.description}</p>
          </div>
        )}

        {/* Sub-todos */}
        <SubTodoList parentId={id} />
      </main>

      <BottomNav />

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
