'use client'
import { useEffect, useState } from 'react'
import { use } from 'react'
import { api } from '@/lib/api'
import { Provider, Review } from '@/types'
import { StarRating } from '@/components/ui/StarRating'
import { useAuth } from '@/hooks/useAuth'
import { MapPin, BadgeCheck, MessageCircle, Star, Phone } from 'lucide-react'

export default function ProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()

  const [provider, setProvider] = useState<Provider | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get<{ data: Provider }>(`/providers/${id}`),
      api.get<{ data: Review[] }>(`/providers/${id}/reviews`),
    ]).then(([p, r]) => {
      setProvider(p.data)
      setReviews(r.data)
    }).finally(() => setLoading(false))
  }, [id])

  async function handleContact() {
    await api.post(`/providers/${id}/contact`, { channel: 'whatsapp' }).catch(() => {})
    if (provider?.whatsapp) {
      window.open(`https://wa.me/55${provider.whatsapp}?text=Olá! Vi seu perfil na Servia e gostaria de contratar seu serviço.`, '_blank')
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setReviewError('')
    try {
      const res = await api.post<{ data: Review }>(`/providers/${id}/reviews`, { rating, comment })
      setReviews(prev => [res.data, ...prev])
      setComment('')
      setRating(5)
    } catch (err: any) {
      setReviewError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-32 bg-white rounded-2xl border border-gray-100 mb-4" />
      <div className="h-64 bg-white rounded-2xl border border-gray-100" />
    </div>
  )

  if (!provider) return (
    <div className="text-center py-20">
      <p className="text-gray-400">Prestador não encontrado.</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Banner Decorativo */}
      <div className="relative h-40 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-slate-100/50 rounded-3xl border border-slate-100/80 overflow-hidden mb-16">
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-xs text-[10px] font-bold text-slate-500 px-3 py-1 rounded-full border border-white/40 tracking-wider uppercase">
          Perfil Verificado
        </div>
        
        {/* Avatar Sobreposto */}
        <div className="absolute -bottom-10 left-6 flex items-end gap-4">
          <div className="w-22 h-22 rounded-2xl bg-white p-1 shadow-md border border-slate-100">
            <div className="w-full h-full rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-2xl overflow-hidden">
              {provider.photo_url ? (
                <img src={provider.photo_url} className="w-full h-full object-cover" alt={provider.display_name} />
              ) : (
                provider.display_name.slice(0, 2).toUpperCase()
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Informações Principais */}
      <div className="space-y-6">
        {/* Bloco de Título e Planos */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{provider.display_name}</h1>
                {provider.verified && (
                  <BadgeCheck size={20} className="text-violet-500 fill-violet-50" />
                )}
                {provider.plan !== 'free' && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase ${
                    provider.plan === 'pro' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {provider.plan === 'pro' ? 'Pro' : 'Destaque'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <MapPin size={14} className="text-slate-300" />
                <span>{provider.city}, {provider.state}</span>
              </div>
            </div>

            {/* Avaliação Média */}
            <div className="bg-slate-50/80 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-100/50 min-w-28 self-start">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="text-base font-bold text-slate-800">{Number(provider.avg_rating).toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{provider.review_count} avaliações</span>
            </div>
          </div>

          {/* Biografia */}
          {provider.bio && (
            <div className="border-t border-slate-100/60 pt-5 mt-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sobre o profissional</h3>
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {provider.bio}
              </p>
            </div>
          )}

          {/* Categorias */}
          {provider.categories?.length > 0 && (
            <div className="border-t border-slate-100/60 pt-5 mt-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Especialidades</h3>
              <div className="flex flex-wrap gap-2">
                {provider.categories.map(c => (
                  <span key={c.id} className="text-[11px] font-bold bg-slate-50 border border-slate-200/50 text-slate-600 px-3.5 py-1 rounded-full transition-colors hover:bg-slate-100 hover:text-slate-700">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botão de contato */}
          {provider.whatsapp && (
            <div className="mt-6 pt-5 border-t border-slate-100/60">
              <button
                onClick={handleContact}
                className="w-full flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold transition-all duration-200 hover:shadow-lg shadow-emerald-500/10 active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle size={18} className="animate-float" />
                Falar pelo WhatsApp
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Avaliações */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-800 mb-5 tracking-tight">Avaliações dos clientes</h2>

          {/* Formulário de avaliação */}
          {user && user.id !== (provider as any).user_id && (
            <form onSubmit={submitReview} className="mb-8 pb-6 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-700 mb-3">Deixe sua avaliação sobre o profissional</p>
              <div className="mb-4">
                <StarRating value={rating} onChange={setRating} size={24} />
              </div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Conte-nos como foi a contratação e o serviço prestado..."
                rows={3}
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200 resize-none bg-slate-50/50"
              />
              {reviewError && <p className="text-xs text-red-500 mt-2 font-medium bg-red-50 border border-red-100/60 px-3 py-2 rounded-lg">{reviewError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="mt-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-md shadow-violet-500/10"
              >
                {submitting ? 'Enviando...' : 'Enviar avaliação'}
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/60">
              <p className="text-3xl mb-2">⭐</p>
              <p className="text-sm font-bold text-slate-700">Ainda não há avaliações</p>
              <p className="text-xs text-slate-400 mt-0.5">Seja o primeiro a avaliar o trabalho deste profissional!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(r => (
                <div key={r.id} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200/50 flex-shrink-0">
                    {r.user_name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-slate-700">{r.user_name}</span>
                      <span className="text-[11px] text-slate-300 font-medium">
                        {new Date(r.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="mb-2">
                      <StarRating value={r.rating} size={13} />
                    </div>
                    {r.comment && <p className="text-[13px] text-slate-500 leading-relaxed">{r.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
