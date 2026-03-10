'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BottomNav({ onCreateTodo, onCreateNote }: { onCreateTodo?: () => void; onCreateNote?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)

  const isTodos = pathname.startsWith('/todos')
  const isNotes = pathname.startsWith('/notes')

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Overlay to close menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}

      {/* FAB menu */}
      {menuOpen && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pop-in">
          <button
            onClick={() => { setMenuOpen(false); onCreateTodo?.() }}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg"
            style={{ background: 'var(--card)', boxShadow: 'var(--shadow-lg)', minWidth: 180 }}
          >
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'var(--primary-lt)' }}>
              ✓
            </span>
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>New Todo</span>
          </button>
          <button
            onClick={() => { setMenuOpen(false); onCreateNote?.() }}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg"
            style={{ background: 'var(--card)', boxShadow: 'var(--shadow-lg)', minWidth: 180 }}
          >
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'var(--card-alt)' }}>
              📝
            </span>
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>New Note</span>
          </button>
          <button
            onClick={() => { setMenuOpen(false); handleSignOut() }}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg"
            style={{ background: 'var(--card)', boxShadow: 'var(--shadow-lg)', minWidth: 180 }}
          >
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: '#FDE8E8' }}>
              👋
            </span>
            <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>Sign Out</span>
          </button>
        </div>
      )}

      {/* Bottom bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Glass background */}
        <div
          className="flex items-center justify-around px-2"
          style={{
            background: 'rgba(255, 248, 231, 0.85)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            borderTop: '1px solid rgba(139, 94, 60, 0.08)',
            height: 68,
          }}
        >
          {/* Todos tab */}
          <Link
            href="/todos"
            className="flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all"
            style={isTodos ? { background: 'rgba(245, 197, 24, 0.15)' } : {}}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isTodos ? 'var(--primary)' : 'none'} stroke={isTodos ? 'var(--brown)' : 'var(--muted)'} strokeWidth={isTodos ? 2 : 1.5}>
              <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[10px] font-semibold" style={{ color: isTodos ? 'var(--brown)' : 'var(--muted)' }}>Todos</span>
          </Link>

          {/* FAB */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center justify-center rounded-full transition-all active:scale-90"
            style={{
              width: 52,
              height: 52,
              background: menuOpen ? 'var(--text)' : 'var(--primary)',
              color: menuOpen ? 'var(--primary)' : 'var(--text)',
              boxShadow: 'var(--shadow-lg)',
              transform: `translateY(-8px) rotate(${menuOpen ? '45deg' : '0deg'})`,
              transition: 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1), background 0.2s, color 0.2s',
            }}
            aria-label="Create new"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Notes tab */}
          <Link
            href="/notes"
            className="flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all"
            style={isNotes ? { background: 'rgba(245, 197, 24, 0.15)' } : {}}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isNotes ? 'var(--primary-lt)' : 'none'} stroke={isNotes ? 'var(--brown)' : 'var(--muted)'} strokeWidth={isNotes ? 2 : 1.5}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/>
              <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] font-semibold" style={{ color: isNotes ? 'var(--brown)' : 'var(--muted)' }}>Notes</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
