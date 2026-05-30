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
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-100/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <span className="text-white font-extrabold text-sm tracking-wider">S</span>
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-violet-600 transition-colors duration-200">Servia</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/buscar" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-violet-600 transition-all duration-200 hover:-translate-y-0.5">
            <Search size={15} />
            Buscar serviços
          </Link>
        </nav>

        {/* Ações desktop */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/meu-perfil"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-violet-600 transition-all duration-200 hover:-translate-y-0.5"
              >
                <LayoutDashboard size={15} />
                Painel
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors duration-200 cursor-pointer"
              >
                <LogOut size={15} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors duration-200">
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold px-4.5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-[0.98]"
              >
                Anunciar serviço
              </Link>
            </>
          )}
        </div>

        {/* Botão mobile */}
        <button
          className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu mobile */}
      <div className={clsx(
        'md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md overflow-hidden transition-all duration-300 ease-in-out',
        menuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="px-4 py-4 flex flex-col gap-4">
          <Link href="/buscar" className="text-sm font-medium text-slate-700 hover:text-violet-600 transition-colors" onClick={() => setMenuOpen(false)}>Buscar serviços</Link>
          {user ? (
            <>
              <Link href="/meu-perfil" className="text-sm font-medium text-slate-700 hover:text-violet-600 transition-colors" onClick={() => setMenuOpen(false)}>Meu painel</Link>
              <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-600 text-left transition-colors cursor-pointer">Sair</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-violet-600 transition-colors" onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link href="/cadastro" className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors" onClick={() => setMenuOpen(false)}>Anunciar serviço</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
