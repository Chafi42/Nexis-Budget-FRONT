// utils/budgetHelpers.ts
export const categoriesList = [
  'Alimentation',
  'Logement',
  'Transport',
  'Loisirs',
  'Santé',
  'Autre',
]

const categoryStyles: Record<string, { color: string; icon: string }> = {
  Alimentation: {
    color: 'bg-amber-100 text-amber-800 border border-amber-200',
    icon: '🍽️',
  },
  Logement: {
    color: 'bg-blue-100 text-blue-800 border border-blue-200',
    icon: '🏠',
  },
  Transport: {
    color: 'bg-purple-100 text-purple-800 border border-purple-200',
    icon: '🚆',
  },
  Loisirs: {
    color: 'bg-pink-100 text-pink-800 border border-pink-200',
    icon: '🎮',
  },
  Santé: {
    color: 'bg-rose-100 text-rose-800 border border-rose-200',
    icon: '🩺',
  },
  Autre: {
    color: 'bg-slate-100 text-slate-800 border border-slate-200',
    icon: '📦',
  },
}

export function getCategoryMeta(catName: string) {
  return (
    categoryStyles[catName] || {
      color: 'bg-slate-100 text-slate-700 border border-slate-200',
      icon: '🎯',
    }
  )
}