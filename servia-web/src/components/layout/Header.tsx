'use client'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search, User, LogOut, LayoutDashboard } from 'lucide-react'
import clsx from 'clsx'

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-gray-900 text-lg">Servia</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/buscar" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-violet-600 transition-colors">
            <Search size={15} />
            Buscar serviços
          </Link>
        </nav>

        {/* Ações desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/meu-perfil"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-violet-600 transition-colors"
              >
                <LayoutDashboard size={15} />
                Painel
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut size={15} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Anunciar serviço
              </Link>
            </>
          )}
        </div>

        {/* Botão mobile */}
        <button
          className="md:hidden p-2 text-gray-500"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu mobile */}
      <div className={clsx(
        'md:hidden border-t border-gray-100 bg-white overflow-hidden transition-all duration-200',
        menuOpen ? 'max-h-60' : 'max-h-0'
      )}>
        <div className="px-4 py-4 flex flex-col gap-4">
          <Link href="/buscar" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Buscar serviços</Link>
          {user ? (
            <>
              <Link href="/meu-perfil" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Meu painel</Link>
              <button onClick={handleLogout} className="text-sm text-red-500 text-left">Sair</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link href="/cadastro" className="text-sm font-medium text-violet-600" onClick={() => setMenuOpen(false)}>Anunciar serviço</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
