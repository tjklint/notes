'use client'

import { useState, useEffect } from 'react'
import type { Todo } from '@/types/database'

interface TodoFormProps {
  initial?: Partial<Todo>
  onSubmit: (fields: Partial<Todo>) => Promise<void>
  onClose: () => void
}

const PRIORITIES = ['low', 'medium', 'high'] as const

const COLORS = ['#F5C518', '#E07B5A', '#7DBF82', '#8B5E3C', '#A78BFA', '#60A5FA', '#F472B6']

export default function TodoForm({ initial, onSubmit, onClose }: TodoFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [dueDate, setDueDate] = useState(initial?.due_date ? initial.due_date.slice(0, 16) : '')
  const [priority, setPriority] = useState<Todo['priority']>(initial?.priority ?? null)
  const [color, setColor] = useState<string | null>(initial?.color ?? null)
  const [tags, setTags] = useState(initial?.tags?.join(', ') ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSubmit({
      title: title || null,
      description: description || null,
      due_date: dueDate || null,
      priority,
      color,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : null,
    })
    setSaving(false)
    onClose()
  }

  return (
    <div
      className="sheet-overlay fixed inset-0 z-50 flex items-end justify-center"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl p-6 pb-8 flex flex-col gap-4"
        style={{ background: 'var(--card)', maxHeight: '90dvh', overflowY: 'auto' }}
      >
        <div className="w-10 h-1.5 rounded-full mx-auto mb-2" style={{ background: 'var(--muted)' }} />
        <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
          {initial?.id ? 'Edit todo' : 'New todo'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="input" placeholder="Title (optional)" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea
            className="input resize-none"
            placeholder="Description (optional)"
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input className="input" type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />

          {/* Priority */}
          <div className="flex gap-2">
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(priority === p ? null : p)}
                className="flex-1 py-1.5 rounded-lg text-sm font-medium capitalize transition-all"
                style={{
                  background: priority === p
                    ? p === 'low' ? 'var(--success)' : p === 'medium' ? 'var(--primary)' : 'var(--danger)'
                    : 'var(--cream)',
                  color: priority === p ? (p === 'medium' ? 'var(--text)' : 'white') : 'var(--muted)',
                  border: `1.5px solid ${p === 'low' ? 'var(--success)' : p === 'medium' ? 'var(--primary)' : 'var(--danger)'}`,
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Color picker */}
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(color === c ? null : c)}
                className="w-7 h-7 rounded-full transition-transform"
                style={{
                  background: c,
                  transform: color === c ? 'scale(1.3)' : 'scale(1)',
                  boxShadow: color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : 'none',
                }}
              />
            ))}
          </div>

          <input className="input" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />

          <div className="flex gap-2 pt-1">
            <button type="button" className="btn-ghost flex-1" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
