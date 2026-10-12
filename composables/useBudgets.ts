// composables/useBudgets.ts
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { getCategoryMeta } from '~/utils/budgetHelpers'

export function useBudgets() {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  const budgetsList = ref<any[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const searchQuery = ref('')

  const showModal = ref(false)
  const isEditing = ref(false)
  const currentBudgetId = ref<string | null>(null)
  const formCategory = ref('Alimentation')
  const formAmount = ref('')

  const totalBudgetsAmount = computed(() => {
    return budgetsList.value.reduce((acc, b) => acc + (Number(b.amount) || 0), 0)
  })

  async function fetchBudgets() {
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

      const data = await $fetch<any[]>(`${config.public.apiBase}/budgets`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (Array.isArray(data)) {
        budgetsList.value = data.map((b: any) => {
          const meta = getCategoryMeta(b.category)
          return {
            id: b._id || b.id,
            category: b.category || 'Autre',
            amount: Number(b.amount || b.limit) || 0,
            color: meta.color,
            icon: meta.icon,
          }
        })
      } else {
        budgetsList.value = []
      }
    } catch (error: any) {
      console.error('Erreur chargement budgets:', error)
      errorMessage.value = 'Impossible de charger les budgets depuis MongoDB.'
    } finally {
      isLoading.value = false
    }
  }

  function openAddModal() {
    isEditing.value = false
    currentBudgetId.value = null
    formCategory.value = 'Alimentation'
    formAmount.value = ''
    showModal.value = true
  }

  function openEditModal(budget: any) {
    isEditing.value = true
    currentBudgetId.value = budget.id
    formCategory.value = budget.category
    formAmount.value = budget.amount.toString()
    showModal.value = true
  }

  async function saveBudget() {
    const numericAmount = Number(formAmount.value)

    if (!formCategory.value || isNaN(numericAmount) || numericAmount <= 0) {
      alert('Veuillez entrer un montant valide.')
      return
    }

    try {
      const token =
        authStore.token ||
        (import.meta.client ? localStorage.getItem('token') : null)
      if (!token) return

      const payload = {
        category: formCategory.value,
        amount: numericAmount,
        limit: numericAmount,
      }

      if (isEditing.value && currentBudgetId.value) {
        await $fetch(
          `${config.public.apiBase}/budgets/${currentBudgetId.value}`,
          {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: payload,
          },
        )
      } else {
        await $fetch(`${config.public.apiBase}/budgets`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        })
      }

      showModal.value = false
      await fetchBudgets()
    } catch (error: any) {
      console.error('Erreur sauvegarde budget:', error)
      alert(
        error.data?.message ||
          error.data?.errors?.[0]?.message ||
          'Erreur lors de la sauvegarde du budget.',
      )
    }
  }

  async function deleteBudget(id: string) {
    if (!confirm('Voulez-vous vraiment supprimer ce budget ?')) return

    try {
      const token =
        authStore.token ||
        (import.meta.client ? localStorage.getItem('token') : null)
      if (!token) return

      await $fetch(`${config.public.apiBase}/budgets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      await fetchBudgets()
    } catch (error: any) {
      console.error('Erreur suppression budget:', error)
      alert(error.data?.message || 'Erreur lors de la suppression.')
    }
  }

  const filteredBudgets = computed(() => {
    return budgetsList.value.filter((b) =>
      b.category.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  })

  return {
    budgetsList,
    isLoading,
    errorMessage,
    searchQuery,
    showModal,
    isEditing,
    formCategory,
    formAmount,
    totalBudgetsAmount,
    filteredBudgets,
    fetchBudgets,
    openAddModal,
    openEditModal,
    saveBudget,
    deleteBudget,
  }
}