'use client'

import { useState, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface NoteEditorProps {
  title: string
  content: string
  onTitleChange: (v: string) => void
  onContentChange: (v: string) => void
  onImageUpload: (file: File) => Promise<string | null>
}

export default function NoteEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onImageUpload,
}: NoteEditorProps) {
  const [preview, setPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const insertAtCursor = useCallback((text: string) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = content.slice(0, start) + text + content.slice(end)
    onContentChange(next)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + text.length
      el.focus()
    })
  }, [content, onContentChange])

  async function handleImageFile(file: File) {
    setUploading(true)
    const url = await onImageUpload(file)
    if (url) insertAtCursor(`\n![${file.name}](${url})\n`)
    setUploading(false)
  }

  async function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await handleImageFile(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-3 flex-1">
      {/* Title */}
      <input
        className="input text-xl font-bold"
        placeholder="Note title…"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        style={{ border: 'none', background: 'transparent', fontSize: '1.3rem', padding: '0.25rem 0' }}
      />

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          className="btn-ghost text-sm py-1 px-3"
          style={{ background: !preview ? 'var(--primary-lt)' : undefined }}
          onClick={() => setPreview(false)}
        >
          Edit
        </button>
        <button
          className="btn-ghost text-sm py-1 px-3"
          style={{ background: preview ? 'var(--primary-lt)' : undefined }}
          onClick={() => setPreview(true)}
        >
          Preview
        </button>
        <div className="flex-1" />
        {!preview && (
          <>
            <button className="btn-ghost text-sm py-1 px-2 font-bold" onClick={() => insertAtCursor('**bold**')}>B</button>
            <button className="btn-ghost text-sm py-1 px-2 italic" onClick={() => insertAtCursor('*italic*')}>I</button>
            <button className="btn-ghost text-sm py-1 px-2" onClick={() => insertAtCursor('\n- ')}>List</button>
            <button className="btn-ghost text-sm py-1 px-2" onClick={() => insertAtCursor('\n## ')}>H2</button>
            <button
              className="btn-ghost text-sm py-1 px-2"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? '…' : '📷'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFilePick} />
          </>
        )}
      </div>

      {/* Editor or preview */}
      {preview ? (
        <div
          className="flex-1 p-4 rounded-xl overflow-y-auto prose prose-sm max-w-none"
          style={{
            background: 'var(--cream)',
            border: '1.5px solid var(--brown)',
            borderRadius: 'var(--radius-md)',
            minHeight: 300,
            color: 'var(--text)',
          }}
        >
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            <p style={{ color: 'var(--muted)' }}>Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          className="input flex-1 font-mono text-sm resize-none"
          placeholder="Write in markdown…"
          value={content}
          onChange={e => onContentChange(e.target.value)}
          style={{ minHeight: 300, lineHeight: 1.6 }}
          onDrop={async e => {
            e.preventDefault()
            const file = e.dataTransfer.files[0]
            if (file?.type.startsWith('image/')) await handleImageFile(file)
          }}
          onDragOver={e => e.preventDefault()}
        />
      )}
    </div>
  )
}
