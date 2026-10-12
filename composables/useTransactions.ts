// composables/useTransactions.ts
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

export function useTransactions() {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  const transactionsList = ref<any[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const searchQuery = ref('')
  const selectedType = ref<'expense' | 'income' | undefined>(undefined)

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
    Revenu: {
      color: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      icon: '💰',
    },
  }

  function getCategoryMeta(catName: string) {
    return (
      categoryStyles[catName] || {
        color: 'bg-slate-100 text-slate-700 border border-slate-200',
        icon: '💳',
      }
    )
  }

  const totalBalance = computed(() => {
    return transactionsList.value.reduce(
      (acc, tx) => acc + (Number(tx.amount) || 0),
      0,
    )
  })

  function formatDate(dateString: string) {
    if (!dateString) return { date: "Aujourd'hui", time: '12:00' }
    const txDate = new Date(dateString)
    const time = txDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    const dateLabel = txDate.toLocaleDateString('fr-FR')

    return { date: dateLabel, time }
  }

  async function fetchTransactions() {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const token =
        authStore.token ||
        (import.meta.client ? localStorage.getItem('token') : null)
      if (!token) {
        navigateTo('/login')
        return
      }

      const data = await $fetch<any[]>(`${config.public.apiBase}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (Array.isArray(data)) {
        transactionsList.value = data.map((tx: any, index: number) => {
          const formatted = formatDate(tx.createdAt || tx.date)
          const catMeta = getCategoryMeta(tx.category)

          return {
            id: tx._id || tx.id || `tx-${index}`,
            date: formatted.date,
            time: formatted.time,
            merchant: tx.title || tx.merchant || 'Opération',
            details: tx.description || 'Transaction Nexis',
            category: tx.category || 'Autre',
            categoryColor: catMeta.color,
            categoryIcon: catMeta.icon,
            paymentMethod: tx.paymentMethod || 'Carte bancaire',
            paymentIcon: '💳',
            amount: Number(tx.amount) || 0,
            type: tx.type || (tx.amount > 0 ? 'income' : 'expense'),
          }
        })
      } else {
        transactionsList.value = []
      }
    } catch (error: any) {
      console.error('Erreur chargement transactions:', error)
      errorMessage.value = "Impossible de charger l'historique depuis MongoDB."
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTransaction(id: string) {
    if (!confirm('Voulez-vous vraiment supprimer cette transaction ?')) return

    try {
      const token =
        authStore.token ||
        (import.meta.client ? localStorage.getItem('token') : null)
      if (!token) return

      await $fetch(`${config.public.apiBase}/transactions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      await fetchTransactions()
    } catch (error: any) {
      console.error('Erreur lors de la suppression :', error)
      alert(
        error.data?.message || 'Erreur lors de la suppression de la transaction.',
      )
    }
  }

  function editTransaction(tx: any) {
    navigateTo(`/transactions/add?id=${tx.id}`)
  }

  const filteredTransactions = computed(() => {
    return transactionsList.value.filter((tx) => {
      const merchant = tx.merchant || ''
      const category = tx.category || ''
      const matchesSearch =
        merchant.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        category.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesType = !selectedType.value || tx.type === selectedType.value
      return matchesSearch && matchesType
    })
  })

  return {
    transactionsList,
    isLoading,
    errorMessage,
    searchQuery,
    selectedType,
    totalBalance,
    filteredTransactions,
    fetchTransactions,
    deleteTransaction,
    editTransaction,
  }
}