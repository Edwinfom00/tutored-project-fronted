import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Sidebar } from "@/components/layout/Sidebar"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IDS AI System',
  description: 'Système de détection d\'intrusion enrichi par l\'IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex">
          <aside className="w-64 border-r min-h-screen">
            <Sidebar />
          </aside>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
