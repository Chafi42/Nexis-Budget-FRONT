// client/utils/transactionHelpers.ts

export const categoryStyles: Record<string, { color: string; icon: string }> = {
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
  Revenu: {
    color: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    icon: '💰',
  },
}

export function getCategoryMeta(catName: string) {
  return (
    categoryStyles[catName] || {
      color: 'bg-slate-100 text-slate-700 border border-slate-200',
      icon: '💳',
    }
  )
}

export function formatTransactionDate(dateString?: string) {
  if (!dateString) return { date: "Aujourd'hui", time: '12:00' }
  const txDate = new Date(dateString)

  const time = txDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const dateLabel = txDate.toLocaleDateString('fr-FR')

  return { date: dateLabel, time }
}