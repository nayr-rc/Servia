import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { Header } from '@/components/layout/Header'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'Servia — Encontre prestadores de serviço',
  description: 'Conectamos você com prestadores verificados na sua cidade.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body className="bg-slate-50/50 min-h-screen antialiased">
        <AuthProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <footer className="border-t border-gray-100 py-8 mt-16">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Servia</span>
              </div>
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} Servia. Conectando pessoas e serviços.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
