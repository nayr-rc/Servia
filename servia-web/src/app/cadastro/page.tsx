'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function CadastroPage() {
  const { register } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'client' | 'provider'>('client')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password, role)
      router.push(role === 'provider' ? '/meu-perfil' : '/buscar')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-400/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-md shadow-violet-500/10">
            <span className="text-white font-extrabold text-base tracking-wider">S</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Criar conta no Servia</h1>
          <p className="text-sm text-slate-400 mt-1">Cadastre-se gratuitamente para começar</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm">
          {/* Tipo de conta */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-50 border border-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                role === 'client'
                  ? 'bg-white shadow-sm text-violet-600 border border-slate-100'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Quero contratar
            </button>
            <button
              type="button"
              onClick={() => setRole('provider')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                role === 'provider'
                  ? 'bg-white shadow-sm text-violet-600 border border-slate-100'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Quero anunciar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Seu nome"
                className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 bg-red-50 border border-red-100/60 px-3.5 py-2.5 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-violet-500/10 cursor-pointer active:scale-[0.98]"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-violet-600 hover:text-violet-700 font-bold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
