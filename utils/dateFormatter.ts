// client/utils/dateFormatter.ts

export function formatFriendlyDate(dateString?: string): string {
  if (!dateString) return ''
  const txDate = new Date(dateString)
  if (isNaN(txDate.getTime())) return dateString

  const now = new Date()
  const isToday = txDate.toDateString() === now.toDateString()
  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = txDate.toDateString() === yesterday.toDateString()

  const time = txDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  if (isToday) return `Aujourd'hui à ${time}`
  if (isYesterday) return `Hier à ${time}`
  return `${txDate.toLocaleDateString('fr-FR')} à ${time}`
}