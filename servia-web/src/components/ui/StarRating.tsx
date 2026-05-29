'use client'
import { Star } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  value: number
  onChange?: (v: number) => void
  size?: number
}

export function StarRating({ value, onChange, size = 20 }: Props) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type={onChange ? 'button' : undefined}
          onClick={() => onChange?.(n)}
          className={clsx(onChange && 'cursor-pointer hover:scale-110 transition-transform')}
          disabled={!onChange}
        >
          <Star
            size={size}
            className={clsx(
              n <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
            )}
          />
        </button>
      ))}
    </div>
  )
}
