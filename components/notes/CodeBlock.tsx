'use client'

import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

interface CodeBlockProps {
  children: string
  className?: string
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null)
  const language = className?.replace('language-', '') ?? 'text'

  useEffect(() => {
    codeToHtml(children.trimEnd(), {
      lang: language,
      theme: 'catppuccin-latte',
    })
      .then(setHtml)
      .catch(() => setHtml(null))
  }, [children, language])

  if (!html) {
    return (
      <code
        className={className}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--brown)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.15em 0.4em',
          fontSize: '0.875em',
          color: 'var(--brown)',
        }}
      >
        {children}
      </code>
    )
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', fontSize: '0.875rem' }}
    />
  )
}
