'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Note } from '@/types/database'

export default function NoteCard({ note, onDelete }: { note: Note; onDelete: (id: string) => void }) {
  const [confirm, setConfirm] = useState(false)
  const preview = note.content?.slice(0, 100).replace(/[#*`_[\]!]/g, '') ?? ''

  const timeAgo = (() => {
    const diff = Date.now() - new Date(note.updated_at).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(note.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  })()

  return (
    <>
      <div className="card flex flex-col overflow-hidden group relative">
        {note.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={note.cover_image} alt="" className="w-full h-24 object-cover" style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }} />
        )}
        <Link href={`/notes/${note.id}`} className="flex-1 p-4 block">
          <h3
            className="font-bold text-[15px] leading-snug mb-1 line-clamp-2"
            style={{ color: 'var(--text)' }}
          >
            {note.title || <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontWeight: 400 }}>Untitled</span>}
          </h3>
          {preview && (
            <p className="text-[13px] line-clamp-3 leading-relaxed" style={{ color: 'var(--muted)' }}>{preview}</p>
          )}
          <p className="text-[11px] mt-2.5 font-medium" style={{ color: 'rgba(139, 94, 60, 0.4)' }}>
            {timeAgo}
          </p>
        </Link>

        <button
          onClick={() => setConfirm(true)}
          className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(224, 123, 90, 0.1)' }}
          aria-label="Delete note"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth={2.5}>
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Delete confirmation modal */}
      {confirm && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center px-6 sheet-overlay"
          onClick={e => { if (e.target === e.currentTarget) setConfirm(false) }}
        >
          <div className="w-full max-w-xs rounded-3xl p-6 flex flex-col items-center gap-4 pop-in" style={{ background: 'var(--card)', boxShadow: 'var(--shadow-lg)' }}>
            <span className="text-4xl">🗑️</span>
            <div className="text-center">
              <h3 className="text-[16px] font-bold" style={{ color: 'var(--text)' }}>Delete note?</h3>
              <p className="text-[13px] mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                {note.title ? `"${note.title}" will` : 'This note will'} be permanently deleted.
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setConfirm(false)}
                className="flex-1 py-2.5 rounded-2xl text-[14px] font-medium transition-colors"
                style={{ color: 'var(--muted)', background: 'rgba(139, 94, 60, 0.04)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => { onDelete(note.id); setConfirm(false) }}
                className="flex-1 py-2.5 rounded-2xl text-[14px] font-semibold text-white transition-colors"
                style={{ background: 'var(--danger)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
