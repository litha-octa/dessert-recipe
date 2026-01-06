import { RecipeCategory } from '@/types/recipe'

export const CATEGORY_CONFIG: Record<RecipeCategory, {
  label: string
  color: string
  bgColor: string
  icon: string
}> = {
  cake: {
    label: 'Cakes',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    icon: '🎂'
  },
  cookie: {
    label: 'Cookies',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: '🍪'
  },
  pastry: {
    label: 'Pastries',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: '🥐'
  },
  pudding: {
    label: 'Puddings',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: '🍮'
  },
  'ice-cream': {
    label: 'Ice Cream',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: '🍨'
  },
  tart: {
    label: 'Tarts & Pies',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: '🥧'
  }
}

export const DIFFICULTY_CONFIG = {
  easy: {
    label: 'Easy',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  hard: {
    label: 'Hard',
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
}

export const CATEGORIES = Object.keys(CATEGORY_CONFIG) as RecipeCategory[]
