import type { Metadata, Viewport } from 'next'
import { ToastProvider } from '@/components/layout/Toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pompompurin Notes',
  description: 'Todo list and markdown notepad',
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Purin',
  },
}

export const viewport: Viewport = {
  themeColor: '#F5C518',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
