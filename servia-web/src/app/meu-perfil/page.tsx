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
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Olá, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-400 mt-1">{user.email}</p>
        </div>
        {provider && (
          <Link
            href={`/prestador/${provider.id}`}
            className="text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200/50 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer self-start sm:self-auto"
          >
            Ver perfil público →
          </Link>
        )}
      </div>

      {/* Métricas */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Contatos totais', value: dashboard.total_contacts, icon: Phone, color: 'text-violet-500 bg-violet-50' },
            { label: 'Últimos 30 dias', value: dashboard.contacts_last_30_days, icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50' },
            { label: 'Nota média', value: Number(dashboard.avg_rating).toFixed(1), icon: Star, color: 'text-amber-500 bg-amber-50' },
            { label: 'Visualizações', value: dashboard.review_count, icon: Eye, color: 'text-indigo-500 bg-indigo-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${color}`}>
                  <Icon size={14} />
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
              </div>
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Perfil de prestador */}
      {!provider && !creating ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center shadow-xs">
          <p className="text-5xl mb-4">🚀</p>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Crie seu perfil de prestador</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">Comece a anunciar seus serviços na nossa plataforma e seja encontrado por clientes locais hoje mesmo.</p>
          <button
            onClick={() => setCreating(true)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-violet-500/10 cursor-pointer active:scale-[0.98]"
          >
            Criar perfil agora
          </button>
        </div>
      ) : creating ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-xs">
          <h2 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">Criar perfil de prestador</h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nome de exibição *</label>
                <input
                  required
                  value={form.display_name}
                  onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                  placeholder="Como quer aparecer nas buscas"
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">WhatsApp (com DDD) *</label>
                <input
                  required
                  value={form.whatsapp}
                  onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                  placeholder="11999999999"
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cidade *</label>
                <input
                  required
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="Sua cidade"
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Estado (UF) *</label>
                <input
                  required
                  value={form.state}
                  onChange={e => setForm(f => ({ ...f, state: e.target.value.toUpperCase().slice(0, 2) }))}
                  placeholder="BA"
                  maxLength={2}
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Descrição / Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Conte um pouco sobre sua experiência, especialidades e serviços oferecidos..."
                rows={4}
                className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Categorias de Atuação</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCat(c.id)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer font-bold ${
                      selectedCats.includes(c.id)
                        ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-600'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            {createError && <p className="text-xs font-medium text-red-500 bg-red-50 border border-red-100/60 px-3.5 py-2.5 rounded-xl">{createError}</p>}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-violet-500/10 cursor-pointer active:scale-[0.98]"
              >
                {saving ? 'Salvando...' : 'Criar perfil'}
              </button>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="text-sm font-bold text-slate-400 hover:text-slate-600 px-4 py-3 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : provider ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100/80 pb-5 mb-6">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Meu perfil de prestador</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200/50 px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Edit3 size={14} /> Editar perfil
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white px-3.5 py-2 rounded-xl disabled:opacity-60 transition-colors cursor-pointer"
                >
                  <Check size={14} /> {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 border border-slate-200 px-3.5 py-2 rounded-xl hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={14} /> Cancelar
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xl shadow-xs border border-slate-100">
                  {provider.display_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-extrabold text-slate-800 text-[17px] tracking-tight">{provider.display_name}</p>
                    {provider.verified && <BadgeCheck size={16} className="text-violet-500 fill-violet-50" />}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase ${
                      provider.plan === 'pro' ? 'bg-violet-100 text-violet-700' :
                      provider.plan === 'destaque' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>{provider.plan}</span>
                  </div>
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <MapPin size={13} className="text-slate-300" /> {provider.city}, {provider.state}
                  </p>
                </div>
              </div>
              
              {provider.bio && (
                <div className="border-t border-slate-100/60 pt-5 mt-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Descrição / Bio</h3>
                  <p className="text-[14px] text-slate-600 leading-relaxed">{provider.bio}</p>
                </div>
              )}

              {provider.whatsapp && (
                <div className="border-t border-slate-100/60 pt-5 mt-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contato do WhatsApp</h3>
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone size={14} className="text-emerald-500 fill-emerald-50" /> {provider.whatsapp}
                  </p>
                </div>
              )}

              {provider.categories?.length > 0 && (
                <div className="border-t border-slate-100/60 pt-5 mt-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Especialidades Ativas</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.categories.map(c => (
                      <span key={c.id} className="text-[11px] font-bold bg-slate-50 border border-slate-200/50 text-slate-500 px-3 py-1 rounded-full">{c.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nome de exibição</label>
                  <input
                    value={form.display_name}
                    onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                    className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">WhatsApp</label>
                  <input
                    value={form.whatsapp}
                    onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                    className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cidade</label>
                  <input
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Estado (UF)</label>
                  <input
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value.toUpperCase().slice(0, 2) }))}
                    maxLength={2}
                    className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bio / Descrição</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Categorias</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCat(c.id)}
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer font-bold ${
                        selectedCats.includes(c.id)
                          ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300 hover:text-violet-600'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              {saveError && <p className="text-xs font-medium text-red-500 bg-red-50 border border-red-100/60 px-3.5 py-2.5 rounded-xl">{saveError}</p>}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
