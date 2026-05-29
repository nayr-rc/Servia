export interface User {
  id: string
  name: string
  email: string
  role: 'client' | 'provider' | 'admin'
  avatar_url?: string
  created_at: string
}

export interface Provider {
  id: string
  user_id: string
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
  active: boolean
  created_at: string
  updated_at: string
  categories?: Category[]
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
}

export interface Review {
  id: string
  provider_id: string
  user_id: string
  rating: number
  comment?: string
  created_at: string
  user_name?: string
  user_avatar?: string
}

export interface JwtPayload {
  userId: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}
