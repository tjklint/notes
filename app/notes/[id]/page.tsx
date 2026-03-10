'use client'

export const dynamic = 'force-dynamic'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useNote } from '@/lib/hooks/useNotes'
import { useNotes } from '@/lib/hooks/useNotes'
import NoteEditor from '@/components/notes/NoteEditor'
import BottomNav from '@/components/layout/BottomNav'

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { note, loading, setNote } = useNote(id)
  const { updateNote, deleteNote, uploadImage } = useNotes()
  const router = useRouter()
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title ?? '')
      setContent(note.content ?? '')
    }
  }, [note])

  function scheduleSave(newTitle: string, newContent: string) {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      await updateNote(id, { title: newTitle || null, content: newContent || null })
      setSaving(false)
    }, 800)
  }

  function handleTitleChange(v: string) {
    setTitle(v)
    scheduleSave(v, content)
  }

  function handleContentChange(v: string) {
    setContent(v)
    scheduleSave(title, v)
  }

  async function handleDelete() {
    await deleteNote(id)
    router.push('/notes')
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ color: 'var(--muted)' }}>
        Loading…
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ color: 'var(--muted)' }}>
        Note not found.
      </div>
    )
  }

  return (
    <div className="min-h-dvh pb-nav flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 px-4 pt-12 pb-3 flex items-center gap-3" style={{ background: 'var(--cream)' }}>
        <button onClick={() => router.push('/notes')} className="btn-ghost p-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={2}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="flex-1 text-sm" style={{ color: 'var(--muted)' }}>
          {saving ? 'Saving…' : 'Auto-saved'}
        </span>
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg"
          style={{ color: 'var(--danger)' }}
          aria-label="Delete note"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="3 6 5 6 21 6" strokeLinecap="round"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11v6M14 11v6" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      <main className="flex-1 px-4 max-w-lg mx-auto w-full flex flex-col">
        <NoteEditor
          title={title}
          content={content}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          onImageUpload={uploadImage}
        />
      </main>

      <BottomNav />
    </div>
  )
}
