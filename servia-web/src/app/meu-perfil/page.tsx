'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { Provider, Category } from '@/types'
import { LayoutDashboard, User, Star, Phone, MapPin, Eye, TrendingUp, BadgeCheck, Edit3, Check, X } from 'lucide-react'
import Link from 'next/link'

interface Dashboard {
  total_contacts: number
  contacts_last_30_days: number
  avg_rating: number
  review_count: number
}

export default function MeuPerfilPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [provider, setProvider] = useState<Provider | null>(null)
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  // form de edição
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ display_name: '', bio: '', city: '', state: '', whatsapp: '' })
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // form criação de perfil
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    Promise.all([
      api.get<{ data: Category[] }>('/categories'),
      api.get<{ data: Provider }>('/providers/me').catch(() => ({ data: null })),
      api.get<{ data: Dashboard }>('/categories/dashboard').catch(() => ({ data: null })),
    ]).then(([cats, prov, dash]) => {
      setCategories(cats.data)
      setProvider(prov.data as Provider | null)
      setDashboard(dash.data)
      if (prov.data) {
        const p = prov.data as Provider
        setForm({
          display_name: p.display_name,
          bio: p.bio || '',
          city: p.city,
          state: p.state,
          whatsapp: p.whatsapp || '',
        })
        setSelectedCats(p.categories?.map(c => c.id) || [])
      }
    }).finally(() => setPageLoading(false))
  }, [user])

  async function handleSave() {
    if (!provider) return
    setSaving(true)
    setSaveError('')
    try {
      const res = await api.patch<{ data: Provider }>(`/providers/${provider.id}`, {
        ...form,
        category_ids: selectedCats,
      })
      setProvider(res.data)
      setEditing(false)
    } catch (err: any) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setCreateError('')
    try {
      const res = await api.post<{ data: Provider }>('/providers', {
        ...form,
        category_ids: selectedCats,
      })
      setProvider(res.data)
      setCreating(false)
    } catch (err: any) {
      setCreateError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function toggleCat(id: string) {
    setSelectedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  if (authLoading || pageLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
      <div className="h-28 bg-white rounded-2xl border border-gray-100" />
      <div className="h-48 bg-white rounded-2xl border border-gray-100" />
    </div>
  )

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Olá, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
        </div>
        {provider && (
          <Link
            href={`/prestador/${provider.id}`}
            className="text-xs text-violet-600 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
          >
            Ver perfil público →
          </Link>
        )}
      </div>

      {/* Métricas */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Contatos totais', value: dashboard.total_contacts, icon: Phone },
            { label: 'Últimos 30 dias', value: dashboard.contacts_last_30_days, icon: TrendingUp },
            { label: 'Nota média', value: Number(dashboard.avg_rating).toFixed(1), icon: Star },
            { label: 'Avaliações', value: dashboard.review_count, icon: Eye },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className="text-violet-400" />
                <p className="text-xs text-gray-400">{label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Perfil de prestador */}
      {!provider && !creating ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
          <p className="text-3xl mb-3">🚀</p>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Crie seu perfil de prestador</h2>
          <p className="text-sm text-gray-400 mb-5">Apareça nas buscas e comece a receber clientes.</p>
          <button
            onClick={() => setCreating(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Criar perfil agora
          </button>
        </div>
      ) : creating ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Criar perfil de prestador</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Nome de exibição *</label>
                <input
                  required
                  value={form.display_name}
                  onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                  placeholder="Como quer aparecer nas buscas"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">WhatsApp</label>
                <input
                  value={form.whatsapp}
                  onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                  placeholder="11999999999"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Cidade *</label>
                <input
                  required
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="Sua cidade"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Estado (UF) *</label>
                <input
                  required
                  value={form.state}
                  onChange={e => setForm(f => ({ ...f, state: e.target.value.toUpperCase().slice(0, 2) }))}
                  placeholder="BA"
                  maxLength={2}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Descrição / Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Conte um pouco sobre você e seus serviços..."
                rows={3}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Categorias</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCat(c.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      selectedCats.includes(c.id)
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-violet-300'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            {createError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-100">{createError}</p>}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                {saving ? 'Salvando...' : 'Criar perfil'}
              </button>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="text-sm text-gray-400 hover:text-gray-600 px-4 py-2.5"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : provider ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Meu perfil de prestador</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs text-violet-600 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
              >
                <Edit3 size={13} /> Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-60"
                >
                  <Check size={13} /> {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:text-gray-600"
                >
                  <X size={13} /> Cancelar
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold">
                  {provider.display_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{provider.display_name}</p>
                    {provider.verified && <BadgeCheck size={15} className="text-violet-500" />}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      provider.plan === 'pro' ? 'bg-violet-100 text-violet-700' :
                      provider.plan === 'destaque' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{provider.plan}</span>
                  </div>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {provider.city}, {provider.state}
                  </p>
                </div>
              </div>
              {provider.bio && <p className="text-sm text-gray-600 leading-relaxed">{provider.bio}</p>}
              {provider.whatsapp && (
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <Phone size={13} className="text-green-500" /> {provider.whatsapp}
                </p>
              )}
              {provider.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                  {provider.categories.map(c => (
                    <span key={c.id} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-3 py-1 rounded-full">{c.name}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Nome de exibição</label>
                  <input
                    value={form.display_name}
                    onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">WhatsApp</label>
                  <input
                    value={form.whatsapp}
                    onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Cidade</label>
                  <input
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Estado (UF)</label>
                  <input
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value.toUpperCase().slice(0, 2) }))}
                    maxLength={2}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Categorias</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCat(c.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selectedCats.includes(c.id)
                          ? 'bg-violet-600 text-white border-violet-600'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-violet-300'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              {saveError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-100">{saveError}</p>}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
