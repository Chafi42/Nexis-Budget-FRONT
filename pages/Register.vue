<!-- client/pages/register.vue -->
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default'
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  acceptTerms: false
})

const hasMinLength = computed(() => form.password.length >= 10)
const hasUppercase = computed(() => /[A-Z]/.test(form.password))
const hasNumber = computed(() => /[0-9]/.test(form.password))
const hasSymbol = computed(() => /[^A-Za-z0-9]/.test(form.password))

const passwordStrength = computed(() => {
  let score = 0
  if (hasMinLength.value) score += 25
  if (hasUppercase.value) score += 25
  if (hasNumber.value) score += 25
  if (hasSymbol.value) score += 25
  return score
})

async function handleRegister() {
  const authStore = useAuthStore()
  if (!form.acceptTerms) {
    alert('Veuillez accepter les conditions générales.')
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password
    })
  } catch (error: any) {
    errorMessage.value = error.data?.message || "Une erreur est survenue lors de l'inscription."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-indigo-500 selection:text-white">
    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      <!-- Panneau gauche -->
      <div class="lg:col-span-5 bg-slate-100 border border-slate-200 rounded-3xl p-8 space-y-4">
        <h1 class="text-3xl font-extrabold text-slate-900 leading-tight">
          Prenez le contrôle de votre budget, sans prise de tête.
        </h1>
        <p class="text-xs text-slate-500">Suivez vos dépenses et atteignez vos objectifs d'épargne.</p>
      </div>

      <!-- Panneau droit (Formulaire) -->
      <div class="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6">
        <div class="space-y-1">
          <h2 class="text-2xl font-extrabold text-slate-900">Créer votre compte</h2>
          <p class="text-xs text-slate-400">Configuration en moins de 3 minutes.</p>
        </div>

        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-700">Prénom</label>
              <input v-model="form.firstName" type="text" placeholder="Jean" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-950" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-700">Nom</label>
              <input v-model="form.lastName" type="text" placeholder="Dupont" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-950" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-700">Adresse électronique</label>
            <input v-model="form.email" type="email" placeholder="jean.dupont@entreprise.fr" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-950" />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-700">Mot de passe d'accès</label>
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Au moins 10 caractères" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-950" />
            
            <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div class="h-full bg-indigo-950 transition-all duration-300" :style="{ width: `${passwordStrength}%` }"></div>
            </div>
          </div>

          <label class="flex items-start gap-2.5 cursor-pointer pt-2">
            <input v-model="form.acceptTerms" type="checkbox" required class="mt-0.5 rounded border-slate-300 text-indigo-950" />
            <span class="text-[11px] text-slate-600">J'accepte les Conditions Générales d'Utilisation.</span>
          </label>

          <button type="submit" :disabled="isLoading" class="w-full py-3 px-4 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4">
            <span>{{ isLoading ? 'Création en cours...' : 'Initialiser mon compte sécurisé' }}</span>
          </button>

          <p class="text-center text-xs text-slate-500 mt-4">
            Déjà inscrit ? <NuxtLink to="/login" class="font-bold text-indigo-950 hover:underline">Se connecter</NuxtLink>
          </p>
        </form>
      </div>

    </div>
  </div>
</template>