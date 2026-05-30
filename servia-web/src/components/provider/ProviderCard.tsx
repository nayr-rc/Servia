import Link from 'next/link'
import { Provider } from '@/types'
import { Star, MapPin, BadgeCheck, Zap } from 'lucide-react'
import clsx from 'clsx'

export function ProviderCard({ provider }: { provider: Provider }) {
  const initials = provider.display_name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <Link href={`/prestador/${provider.id}`} className="block group">
      <div className={clsx(
        'rounded-2xl border p-5.5 transition-all duration-300',
        provider.plan === 'pro' && 'border-violet-200 bg-gradient-to-b from-white to-violet-50/10 shadow-sm hover:border-violet-300 hover:shadow-premium-hover hover:-translate-y-1',
        provider.plan === 'destaque' && 'border-amber-200 bg-gradient-to-b from-white to-amber-50/10 shadow-sm hover:border-amber-300 hover:shadow-premium-hover hover:-translate-y-1',
        provider.plan === 'free' && 'border-slate-100 bg-white shadow-xs hover:border-slate-200 hover:shadow-premium-hover hover:-translate-y-1'
      )}>

        {/* Topo */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className={clsx(
            'w-13 h-13 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden shadow-xs border border-slate-100/60',
            provider.plan === 'pro' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'
          )}>
            {provider.photo_url ? (
              <img
                src={provider.photo_url}
                alt={provider.display_name}
                className="w-13 h-13 rounded-xl object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <span className="group-hover:scale-105 transition-transform duration-500">{initials}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-800 text-[15px] tracking-tight truncate group-hover:text-violet-600 transition-colors duration-200">
                {provider.display_name}
              </span>
              {provider.verified && (
                <BadgeCheck size={16} className="text-violet-500 flex-shrink-0 fill-violet-50" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[13px] text-slate-400 mt-1">
              <MapPin size={12} className="text-slate-300" />
              <span>{provider.city}, {provider.state}</span>
            </div>
          </div>

          {provider.plan !== 'free' && (
            <span className={clsx(
              'text-[11px] px-2.5 py-0.5 rounded-full font-bold flex-shrink-0 tracking-wide uppercase',
              provider.plan === 'pro' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'
            )}>
              {provider.plan === 'pro' ? 'Pro' : 'Destaque'}
            </span>
          )}
        </div>

        {/* Bio */}
        {provider.bio && (
          <p className="text-[13px] text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {provider.bio}
          </p>
        )}

        {/* Categorias */}
        {provider.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {provider.categories.slice(0, 3).map(cat => (
              <span key={cat.id} className="text-[11px] font-medium bg-slate-50 text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-100/60 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-150">
                {cat.name}
              </span>
            ))}
            {provider.categories.length > 3 && (
              <span className="text-[11px] font-bold text-slate-400 self-center">+{provider.categories.length - 3}</span>
            )}
          </div>
        )}

        {/* Rodapé */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100/60">
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-[13px] font-bold text-slate-700">
              {Number(provider.avg_rating).toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              ({provider.review_count} avaliações)
            </span>
          </div>
          <span className="text-xs text-violet-600 font-bold tracking-wide group-hover:translate-x-0.5 transition-transform duration-200">
            Ver perfil →
          </span>
        </div>
      </div>
    </Link>
  )
}
