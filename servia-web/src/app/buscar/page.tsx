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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="bg-white border border-gray-100 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar serviço ou prestador..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
          />
        </div>
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Cidade"
          className="md:w-40 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
        />
        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          className="md:w-48 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white"
        >
          <option value="">Todas as categorias</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
          Buscar
        </button>
      </form>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {loading ? 'Buscando...' : `${meta.total} prestador${meta.total !== 1 ? 'es' : ''} encontrado${meta.total !== 1 ? 's' : ''}`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-44" />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum prestador encontrado</h3>
          <p className="text-sm text-gray-400">Tente buscar por outra categoria ou cidade.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map(p => <ProviderCard key={p.id} provider={p} />)}
          </div>
          {meta.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: meta.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => fetchProviders(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    p === meta.page ? 'bg-violet-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'
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
