// composables/useTransactionForm.ts
import { reactive, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

export function useTransactionForm() {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const route = useRoute()

  const editId = route.query.id as string

  const form = reactive({
    type: 'expense' as 'expense' | 'income',
    amount: 0.0,
    category: 'Alimentation',
    merchant: 'Courses Bio Monoprix',
  })

  const categories = [
    { id: 'Alimentation', label: 'Alimentation', sub: 'Courses, restos', icon: '🍽️' },
    { id: 'Logement', label: 'Logement', sub: 'Loyer, charges', icon: '🏠' },
    { id: 'Transport', label: 'Transport', sub: 'Essence, pass', icon: '🚆' },
    { id: 'Loisirs', label: 'Loisirs', sub: 'Sorties, culture', icon: '🎮' },
    { id: 'Santé', label: 'Santé', sub: 'Pharmacie, soins', icon: '🩺' },
    { id: 'Revenu', label: 'Revenu', sub: 'Salaire, prestations', icon: '💰' },
  ]

  function addAmount(val: number) {
    form.amount = Number((form.amount + val).toFixed(2))
  }

  function clearAmount() {
    form.amount = 0
  }

  onMounted(async () => {
    if (editId) {
      try {
        const token =
          authStore.token ||
          (import.meta.client ? localStorage.getItem('token') : null)
        if (!token) return

        const tx: any = await $fetch(
          `${config.public.apiBase}/transactions/${editId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (tx) {
          form.merchant = tx.title || tx.merchant || ''
          form.amount = Math.abs(Number(tx.amount) || 0)
          form.category = tx.category || 'Alimentation'
          form.type = tx.type || (tx.amount < 0 ? 'expense' : 'income')
        }
      } catch (error) {
        console.error('Erreur chargement transaction pour édition:', error)
      }
    }
  })

  async function submitTransaction() {
    try {
      const token =
        authStore.token ||
        (import.meta.client ? localStorage.getItem('token') : null)
      if (!token) {
        navigateTo('/login')
        return
      }

      const payload = {
        title: form.merchant,
        amount: Math.abs(form.amount),
        category: form.category,
        type: form.type,
      }

      if (editId) {
        await $fetch(`${config.public.apiBase}/transactions/${editId}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        })
      } else {
        await $fetch(`${config.public.apiBase}/transactions`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        })
      }
      
      await navigateTo('/transactions')
    } catch (error: any) {
      console.error("Erreur d'enregistrement:", error)
      alert(
        error.data?.message ||
          "Erreur lors de l'enregistrement dans la base de données.",
      )
    }
  }

  return {
    editId,
    form,
    categories,
    addAmount,
    clearAmount,
    submitTransaction,
  }
}