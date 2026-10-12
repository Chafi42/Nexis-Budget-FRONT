// composables/useSettings.ts
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

export function useSettings() {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  const activeTab = ref('profil')

  const firstName = ref('')
  const lastName = ref('')
  const email = ref('')

  const currentPassword = ref('')
  const newPassword = ref('')

  const successMessage = ref('')
  const errorMessage = ref('')
  const successPasswordMessage = ref('')
  const errorPasswordMessage = ref('')

  const alertBudget = ref(true)
  const alertMonthly = ref(true)
  const alertExpense = ref(false)
  const twoFactorAuth = ref(false)

  onMounted(() => {
    if (authStore.user) {
      firstName.value = authStore.user.firstName || ''
      lastName.value = authStore.user.lastName || ''
      email.value = authStore.user.email || ''
    }
  })

  async function updateProfile() {
    successMessage.value = ''
    errorMessage.value = ''
    try {
      const token = authStore.token || (import.meta.client ? localStorage.getItem('token') : null)
      if (!token) return

      const res = await $fetch<any>(`${config.public.apiBase}/auth/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: { firstName: firstName.value, lastName: lastName.value, email: email.value }
      })

      if (res && res.user) {
        authStore.user = res.user
      }
      successMessage.value = 'Informations mises à jour avec succès !'
    } catch (error: any) {
      console.error('Erreur profil:', error)
      errorMessage.value = error.data?.message || 'Erreur lors de la mise à jour.'
    }
  }

  async function updatePassword() {
    successPasswordMessage.value = ''
    errorPasswordMessage.value = ''
    try {
      const token = authStore.token || (import.meta.client ? localStorage.getItem('token') : null)
      if (!token) return

      await $fetch(`${config.public.apiBase}/auth/password`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: { currentPassword: currentPassword.value, newPassword: newPassword.value }
      })

      successPasswordMessage.value = 'Mot de passe modifié avec succès !'
      currentPassword.value = ''
      newPassword.value = ''
    } catch (error: any) {
      console.error('Erreur mot de passe:', error)
      errorPasswordMessage.value = error.data?.message || 'Erreur lors de la modification du mot de passe.'
    }
  }

  return {
    activeTab,
    firstName,
    lastName,
    email,
    currentPassword,
    newPassword,
    successMessage,
    errorMessage,
    successPasswordMessage,
    errorPasswordMessage,
    alertBudget,
    alertMonthly,
    alertExpense,
    twoFactorAuth,
    updateProfile,
    updatePassword,
  }
}