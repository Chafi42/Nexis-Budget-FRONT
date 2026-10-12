// composables/useDashboard.ts
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import type { Transaction, Budget, AuditLog } from '~/types/dashboard'

export function useDashboard() {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  const dashboardData = ref({
    transactions: [] as Transaction[],
    budgets: [] as Budget[],
    auditLogs: [] as AuditLog[]
  })

  const isLoading = ref(true)
  const errorMessage = ref('')

  const currentMonthName = computed(() => {
    return new Date().toLocaleString('fr-FR', { month: 'long' }).toUpperCase()
  })

  const totalBalance = computed(() => {
    if (!Array.isArray(dashboardData.value.transactions)) return 0
    return dashboardData.value.transactions.reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0)
  })

  const totalIncome = computed(() => {
    if (!Array.isArray(dashboardData.value.transactions)) return 0
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return dashboardData.value.transactions
      .filter(tx => {
        const txDate = tx.createdAt ? new Date(tx.createdAt) : new Date()
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear && (Number(tx.amount) || 0) > 0
      })
      .reduce((acc, tx) => acc + Number(tx.amount), 0)
  })

  const totalExpense = computed(() => {
    if (!Array.isArray(dashboardData.value.transactions)) return 0
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return dashboardData.value.transactions
      .filter(tx => {
        const txDate = tx.createdAt ? new Date(tx.createdAt) : new Date()
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear && (Number(tx.amount) || 0) < 0
      })
      .reduce((acc, tx) => acc + Math.abs(Number(tx.amount)), 0)
  })

  function formatFriendlyDate(dateString?: string) {
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

  async function fetchDashboardData() {
    try {
      const token = authStore.token || (import.meta.client ? localStorage.getItem('token') : null)
      if (!token) {
        navigateTo('/login')
        return
      }

      const [txRes, budgetRes, auditRes] = await Promise.all([
        $fetch<any>(`${config.public.apiBase}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => []),
        $fetch<any>(`${config.public.apiBase}/budgets`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => []),
        $fetch<any>(`${config.public.apiBase}/logs`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => [])
      ])

      dashboardData.value.transactions = Array.isArray(txRes) ? txRes : (txRes?.transactions || txRes?.data || [])
      dashboardData.value.budgets = Array.isArray(budgetRes) ? budgetRes : (budgetRes?.budgets || budgetRes?.data || [])
      
      const logsList = Array.isArray(auditRes) ? auditRes : (auditRes?.logs || auditRes?.data || auditRes?.auditLogs || [])
      dashboardData.value.auditLogs = Array.isArray(logsList) ? logsList : []
    } catch (error: any) {
      console.error('Erreur dashboard:', error)
      errorMessage.value = "Impossible de charger les données."
    } finally {
      isLoading.value = false
    }
  }

  return {
    dashboardData,
    isLoading,
    errorMessage,
    currentMonthName,
    totalBalance,
    totalIncome,
    totalExpense,
    formatFriendlyDate,
    fetchDashboardData
  }
}