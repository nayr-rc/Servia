'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Provider, Category, PaginatedResponse } from '@/types'
import { ProviderCard } from '@/components/provider/ProviderCard'
import { Search } from 'lucide-react'

function BuscarContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [providers, setProviders] = useState<Provider[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState({ total: 0, pages: 1, page: 1 })

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '')

  useEffect(() => {
    api.get<{ data: Category[] }>('/categories').then(r => setCategories(r.data))
  }, [])

  useEffect(() => {
    fetchProviders()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchProviders(page = 1) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (city) params.set('city', city)
      if (selectedCat) params.set('category', selectedCat)
      params.set('page', String(page))
      params.set('limit', '12')
      const res = await api.get<PaginatedResponse<Provider>>(`/providers?${params}`)
      setProviders(res.data)
      setMeta(res.meta)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    fetchProviders()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Buscar Prestadores de Serviço</h1>
        <p className="text-sm text-slate-400 mt-1">Encontre profissionais qualificados e fale diretamente com eles</p>
      </div>

      {/* Filtros */}
      <form onSubmit={handleSearch} className="glass-panel border border-slate-100 p-5 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-stretch shadow-sm">
        <div className="flex-1 relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar serviço ou prestador..."
            className="w-full pl-10 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200"
          />
        </div>
        
        <div className="md:w-48 relative">
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Cidade"
            className="w-full px-4 py-3 text-sm text-slate-700 placeholder-slate-400 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200"
          />
        </div>

        <div className="md:w-56">
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="w-full px-4 py-3 text-sm text-slate-700 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200 cursor-pointer"
          >
            <option value="">Todas as categorias</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-violet-500/10 cursor-pointer active:scale-[0.98] whitespace-nowrap"
        >
          Buscar
        </button>
      </form>

      {/* Resultados meta */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-slate-500">
          {loading ? 'Buscando prestadores...' : `${meta.total} prestador${meta.total !== 1 ? 'es' : ''} encontrado${meta.total !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Lista ou Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse h-48 flex flex-col justify-between">
              <div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                </div>
              </div>
              <div className="h-4 bg-slate-100 rounded w-1/4 pt-3 border-t border-slate-50" />
            </div>
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-100 rounded-3xl shadow-xs">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhum prestador encontrado</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">Tente buscar por outras palavras-chave ou confira a grafia da cidade.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map(p => <ProviderCard key={p.id} provider={p} />)}
          </div>
          {meta.pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: meta.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => fetchProviders(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                    p === meta.page 
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/10' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600 hover:-translate-y-0.5'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function BuscarPage() {
  return <Suspense><BuscarContent /></Suspense>
}
