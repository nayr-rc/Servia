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
        'bg-white rounded-2xl border p-5 transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5',
        provider.plan === 'pro' && 'border-violet-200 ring-1 ring-violet-100',
        provider.plan === 'destaque' && 'border-amber-200',
        provider.plan === 'free' && 'border-gray-100'
      )}>

        {/* Topo */}
        <div className="flex items-start gap-3 mb-4">
          <div className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0',
            provider.plan === 'pro' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'
          )}>
            {provider.photo_url
              ? <img src={provider.photo_url} alt={provider.display_name} className="w-12 h-12 rounded-xl object-cover" />
              : initials
            }
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm truncate">
                {provider.display_name}
              </span>
              {provider.verified && (
                <BadgeCheck size={15} className="text-violet-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <MapPin size={11} />
              <span>{provider.city}, {provider.state}</span>
            </div>
          </div>

          {provider.plan !== 'free' && (
            <span className={clsx(
              'text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0',
              provider.plan === 'pro' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'
            )}>
              {provider.plan === 'pro' ? 'Pro' : 'Destaque'}
            </span>
          )}
        </div>

        {/* Bio */}
        {provider.bio && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {provider.bio}
          </p>
        )}

        {/* Categorias */}
        {provider.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {provider.categories.slice(0, 3).map(cat => (
              <span key={cat.id} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
                {cat.name}
              </span>
            ))}
            {provider.categories.length > 3 && (
              <span className="text-xs text-gray-400">+{provider.categories.length - 3}</span>
            )}
          </div>
        )}

        {/* Rodapé */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-gray-700">
              {Number(provider.avg_rating).toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({provider.review_count})
            </span>
          </div>
          <span className="text-xs text-violet-600 font-medium group-hover:underline">
            Ver perfil →
          </span>
        </div>
      </div>
    </Link>
  )
}
