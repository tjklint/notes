'use client'

import { useState, useEffect } from 'react'
import type { Todo } from '@/types/database'

interface TodoFormProps {
  initial?: Partial<Todo>
  onSubmit: (fields: Partial<Todo>) => Promise<void>
  onClose: () => void
}

const PRIORITIES = ['low', 'medium', 'high'] as const
const PRIORITY_EMOJI = { low: '🟢', medium: '🟡', high: '🔴' }

const COLORS = [
  { value: '#F5C518', label: 'Gold' },
  { value: '#E07B5A', label: 'Coral' },
  { value: '#6BBF7A', label: 'Green' },
  { value: '#8B5E3C', label: 'Brown' },
  { value: '#A78BFA', label: 'Purple' },
  { value: '#60A5FA', label: 'Blue' },
  { value: '#F472B6', label: 'Pink' },
]

export default function TodoForm({ initial, onSubmit, onClose }: TodoFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [dueDate, setDueDate] = useState(initial?.due_date ? initial.due_date.slice(0, 16) : '')
  const [priority, setPriority] = useState<Todo['priority']>(initial?.priority ?? null)
  const [color, setColor] = useState<string | null>(initial?.color ?? null)
  const [tags, setTags] = useState(initial?.tags?.join(', ') ?? '')
  const [saving, setSaving] = useState(false)
  const [showMore, setShowMore] = useState(!!initial?.id)

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
      className="sheet-overlay fixed inset-0 z-[60] flex items-end justify-center"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-lg rounded-t-[28px] p-5 pb-8 flex flex-col gap-4 sheet-enter"
        style={{ background: 'var(--card)', maxHeight: '85dvh', overflowY: 'auto' }}
      >
        {/* Handle */}
        <div className="w-10 h-[5px] rounded-full mx-auto" style={{ background: 'rgba(139, 94, 60, 0.15)' }} />

        {/* Title input — big and prominent */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="text-lg font-semibold w-full outline-none bg-transparent"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
            style={{ color: 'var(--text)', padding: '0.25rem 0' }}
          />

          <textarea
            className="input resize-none text-[14px]"
            placeholder="Add a note..."
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ background: 'rgba(139, 94, 60, 0.03)', border: 'none' }}
          />

          {/* Due date — always visible */}
          <div>
            <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--muted)' }}>Due date</label>
            <input className="input text-[14px]" type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>

          {/* Quick actions row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority pills */}
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(priority === p ? null : p)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all"
                style={{
                  background: priority === p ? 'rgba(139, 94, 60, 0.08)' : 'transparent',
                  border: `1.5px solid ${priority === p ? 'var(--brown)' : 'rgba(139, 94, 60, 0.12)'}`,
                  color: priority === p ? 'var(--text)' : 'var(--muted)',
                }}
              >
                {PRIORITY_EMOJI[p]} {p}
              </button>
            ))}

            {/* More toggle */}
            <button
              type="button"
              onClick={() => setShowMore(s => !s)}
              className="ml-auto px-3 py-1.5 rounded-full text-[13px] font-medium transition-all"
              style={{
                border: '1.5px solid rgba(139, 94, 60, 0.12)',
                color: 'var(--muted)',
              }}
            >
              {showMore ? 'Less' : 'More'}
            </button>
          </div>

          {/* Expandable extras */}
          {showMore && (
            <div className="flex flex-col gap-3 animate-in">
              <div>
                <label className="text-[12px] font-semibold mb-1.5 block" style={{ color: 'var(--muted)' }}>Color</label>
                <div className="flex gap-2.5">
                  {COLORS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(color === c.value ? null : c.value)}
                      className="w-8 h-8 rounded-full transition-all"
                      style={{
                        background: c.value,
                        transform: color === c.value ? 'scale(1.2)' : 'scale(1)',
                        boxShadow: color === c.value ? `0 0 0 2.5px var(--card), 0 0 0 4.5px ${c.value}` : 'inset 0 0 0 1px rgba(0,0,0,0.06)',
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--muted)' }}>Tags</label>
                <input className="input text-[14px]" placeholder="work, personal, urgent..." value={tags} onChange={e => setTags(e.target.value)} />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              className="flex-1 py-2.5 rounded-2xl text-[14px] font-medium transition-colors"
              style={{ color: 'var(--muted)' }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-2xl text-[14px] font-semibold transition-all"
              style={{
                background: 'var(--primary)',
                color: 'var(--text)',
                boxShadow: 'var(--shadow-sm)',
              }}
              disabled={saving}
            >
              {saving ? 'Saving...' : initial?.id ? 'Update' : 'Add Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
