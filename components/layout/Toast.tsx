'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  toast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = nextId++
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-12 left-0 right-0 z-[80] flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map(t => (
          <div
            key={t.id}
            className="pop-in pointer-events-auto px-5 py-3 rounded-2xl flex items-center gap-2.5 max-w-sm w-full"
            style={{
              background: 'var(--card)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <span className="text-base">
              {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : '💡'}
            </span>
            <span className="text-[14px] font-medium flex-1" style={{ color: 'var(--text)' }}>
              {t.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
