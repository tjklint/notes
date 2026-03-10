'use client'

import Link from 'next/link'
import type { Note } from '@/types/database'

export default function NoteCard({ note, onDelete }: { note: Note; onDelete: (id: string) => void }) {
  const preview = note.content?.slice(0, 120).replace(/[#*`_[\]]/g, '') ?? ''

  return (
    <div className="card flex flex-col overflow-hidden group relative">
      {note.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={note.cover_image} alt="" className="w-full h-28 object-cover" />
      )}
      <Link href={`/notes/${note.id}`} className="flex-1 p-4 block">
        <h3
          className="font-semibold text-base leading-snug mb-1 line-clamp-2"
          style={{ color: 'var(--text)' }}
        >
          {note.title ?? <em style={{ color: 'var(--muted)' }}>Untitled</em>}
        </h3>
        {preview && (
          <p className="text-sm line-clamp-3" style={{ color: 'var(--muted)' }}>{preview}</p>
        )}
        <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
          {new Date(note.updated_at).toLocaleDateString()}
        </p>
      </Link>

      {/* Delete button */}
      <button
        onClick={() => onDelete(note.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: 'var(--danger)', color: 'white' }}
        aria-label="Delete note"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}
