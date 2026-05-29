export interface User {
  id: string
  name: string
  email: string
  role: 'client' | 'provider' | 'admin'
  avatar_url?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
}

export interface Provider {
  id: string
  display_name: string
  bio?: string
  city: string
  state: string
  whatsapp?: string
  photo_url?: string
  plan: 'free' | 'destaque' | 'pro'
  avg_rating: number
  review_count: number
  verified: boolean
  categories: Category[]
}

export interface Review {
  id: string
  rating: number
  comment?: string
  created_at: string
  user_name: string
  user_avatar?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
