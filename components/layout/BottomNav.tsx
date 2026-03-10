'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function BottomNav({ onFab }: { onFab?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isTodos = pathname.startsWith('/todos')
  const isNotes = pathname.startsWith('/notes')

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around z-50"
      style={{
        background: 'var(--primary)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(64px + env(safe-area-inset-bottom))',
        boxShadow: '0 -2px 12px rgba(139,94,60,0.15)',
      }}
    >
      {/* Todos tab */}
      <Link href="/todos" className="flex flex-col items-center gap-0.5 px-4 py-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isTodos ? 'var(--text)' : 'var(--brown)'} strokeWidth={isTodos ? 2.5 : 1.8}>
          <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xs font-medium" style={{ color: isTodos ? 'var(--text)' : 'var(--brown)' }}>Todos</span>
      </Link>

      {/* FAB */}
      <button
        onClick={onFab}
        className="flex items-center justify-center rounded-full shadow-lg active:scale-95 transition-transform"
        style={{
          width: 56,
          height: 56,
          background: 'var(--text)',
          color: 'var(--primary)',
          marginBottom: 16,
        }}
        aria-label="Add new"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Notes tab */}
      <Link href="/notes" className="flex flex-col items-center gap-0.5 px-4 py-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isNotes ? 'var(--text)' : 'var(--brown)'} strokeWidth={isNotes ? 2.5 : 1.8}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/>
          <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/>
          <polyline points="10 9 9 9 8 9" strokeLinecap="round"/>
        </svg>
        <span className="text-xs font-medium" style={{ color: isNotes ? 'var(--text)' : 'var(--brown)' }}>Notes</span>
      </Link>

      {/* Sign out — small, tucked right */}
      <button onClick={handleSignOut} className="flex flex-col items-center gap-0.5 px-4 py-2">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth={1.8}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round"/>
        </svg>
        <span className="text-xs font-medium" style={{ color: 'var(--brown)' }}>Out</span>
      </button>
    </nav>
  )
}
