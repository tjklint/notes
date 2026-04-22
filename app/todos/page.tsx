'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTodos } from '@/lib/hooks/useTodos'
import { useNotes } from '@/lib/hooks/useNotes'
import TodoItem from '@/components/todos/TodoItem'
import TodoForm from '@/components/todos/TodoForm'
import BottomNav from '@/components/layout/BottomNav'
import type { Todo } from '@/types/database'

type PriorityGroup = 'high' | 'medium' | 'low' | 'none'

const GROUP_ORDER: PriorityGroup[] = ['high', 'medium', 'low', 'none']
const GROUP_LABELS: Record<PriorityGroup, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
  none: 'No priority',
}
const GROUP_DOTS: Record<PriorityGroup, string> = {
  high: 'var(--danger, #E56B6F)',
  medium: 'var(--primary)',
  low: 'var(--muted)',
  none: 'var(--muted)',
}

export default function TodosPage() {
  const { todos, loading, createTodo, updateTodo, deleteTodo, toggleComplete } = useTodos()
  const { createNote } = useNotes()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Todo | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'due'>('newest')
  const [collapsed, setCollapsed] = useState<Record<PriorityGroup, boolean>>({
    high: false,
    medium: false,
    low: true,
    none: false,
  })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const f = localStorage.getItem('todos:filter')
    const s = localStorage.getItem('todos:sort')
    const c = localStorage.getItem('todos:collapsed')
    if (f === 'all' || f === 'active' || f === 'done') setFilter(f)
    if (s === 'newest' || s === 'oldest' || s === 'due') setSort(s)
    if (c) {
      try {
        const parsed = JSON.parse(c)
        setCollapsed(prev => ({ ...prev, ...parsed }))
      } catch {}
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('todos:filter', filter)
  }, [filter, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('todos:sort', sort)
  }, [sort, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('todos:collapsed', JSON.stringify(collapsed))
  }, [collapsed, hydrated])

  const filtered = todos
    .filter(t => {
      if (filter === 'active') return !t.completed
      if (filter === 'done') return t.completed
      return true
    })
    .sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'due': {
          if (!a.due_date && !b.due_date) return 0
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        }
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const grouped: Record<PriorityGroup, Todo[]> = { high: [], medium: [], low: [], none: [] }
  for (const t of filtered) {
    grouped[(t.priority ?? 'none') as PriorityGroup].push(t)
  }

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

          {/* Sort */}
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: 'var(--muted)' }}>Sort</span>
            <div className="flex gap-1">
              {([
                { key: 'newest', label: 'Newest' },
                { key: 'oldest', label: 'Oldest' },
                { key: 'due', label: 'Due date' },
              ] as const).map(s => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                  style={{
                    background: sort === s.key ? 'var(--text)' : 'transparent',
                    color: sort === s.key ? 'var(--cream)' : 'var(--muted)',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
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

        {!loading && GROUP_ORDER.map(group => {
          const items = grouped[group]
          if (items.length === 0) return null
          const isCollapsed = collapsed[group]
          return (
            <section key={group} className="flex flex-col gap-2">
              <button
                onClick={() => setCollapsed(c => ({ ...c, [group]: !c[group] }))}
                className="flex items-center gap-2 px-1 py-1 text-left"
                aria-expanded={!isCollapsed}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className="transition-transform"
                  style={{
                    color: 'var(--muted)',
                    transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                  }}
                >
                  <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: GROUP_DOTS[group] }}
                />
                <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: 'var(--muted)' }}>
                  {GROUP_LABELS[group]}
                </span>
                <span
                  className="text-[11px] font-semibold px-1.5 rounded-full"
                  style={{ background: 'rgba(139, 94, 60, 0.08)', color: 'var(--muted)' }}
                >
                  {items.length}
                </span>
              </button>
              {!isCollapsed && (
                <div className="flex flex-col gap-2">
                  {items.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleComplete}
                      onDelete={deleteTodo}
                      onEdit={setEditing}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}
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
