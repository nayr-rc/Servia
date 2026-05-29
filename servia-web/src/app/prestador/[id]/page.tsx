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
      {/* Card principal */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xl flex-shrink-0">
            {provider.photo_url
              ? <img src={provider.photo_url} className="w-16 h-16 rounded-xl object-cover" alt={provider.display_name} />
              : provider.display_name.slice(0, 2).toUpperCase()
            }
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-gray-900">{provider.display_name}</h1>
              {provider.verified && <BadgeCheck size={18} className="text-violet-500" />}
              {provider.plan !== 'free' && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  provider.plan === 'pro' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {provider.plan === 'pro' ? 'Pro' : 'Destaque'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
              <MapPin size={13} />
              <span>{provider.city}, {provider.state}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StarRating value={Math.round(provider.avg_rating)} size={16} />
              <span className="text-sm font-medium text-gray-700">{Number(provider.avg_rating).toFixed(1)}</span>
              <span className="text-sm text-gray-400">({provider.review_count} avaliações)</span>
            </div>
          </div>
        </div>

        {provider.bio && (
          <p className="text-sm text-gray-600 leading-relaxed mb-5 pb-5 border-b border-gray-100">
            {provider.bio}
          </p>
        )}

        {/* Categorias */}
        {provider.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {provider.categories.map(c => (
              <span key={c.id} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-3 py-1 rounded-full">
                {c.name}
              </span>
            ))}
          </div>
        )}

        {/* Botão de contato */}
        {provider.whatsapp && (
          <button
            onClick={handleContact}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors"
          >
            <MessageCircle size={18} />
            Falar pelo WhatsApp
          </button>
        )}
      </div>

      {/* Avaliações */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Avaliações ({reviews.length})</h2>

        {/* Formulário de avaliação */}
        {user && user.id !== (provider as any).user_id && (
          <form onSubmit={submitReview} className="mb-6 pb-6 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Deixe sua avaliação</p>
            <StarRating value={rating} onChange={setRating} size={24} />
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Descreva sua experiência (opcional)..."
              rows={3}
              className="mt-3 w-full text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
            />
            {reviewError && <p className="text-xs text-red-500 mt-1">{reviewError}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="mt-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              {submitting ? 'Enviando...' : 'Enviar avaliação'}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">Nenhuma avaliação ainda. Seja o primeiro!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 flex-shrink-0">
                  {r.user_name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">{r.user_name}</span>
                    <StarRating value={r.rating} size={12} />
                  </div>
                  {r.comment && <p className="text-sm text-gray-500 leading-relaxed">{r.comment}</p>}
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(r.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
