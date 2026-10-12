<!-- client/pages/login.vue -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default'
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

async function handleLogin() {
  const authStore = useAuthStore() // Appelé bien à l'intérieur de la fonction
  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login({
      email: form.email,
      password: form.password
    })
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Identifiants incorrects ou serveur indisponible.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-[#f8fafc] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-indigo-500 selection:text-white">
    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      <!-- Panneau gauche -->
      <div class="lg:col-span-7 space-y-8">
        <div class="space-y-3">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Pilotez votre avenir avec<br />
            <span class="text-indigo-950">Nexis Budget.</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed">
            L'intelligence financière conçue pour amplifier votre trésorerie en temps réel, sans aucune friction.
          </p>
        </div>
      </div>

      <!-- Panneau droit (Formulaire) -->
      <div class="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-indigo-950 text-white font-bold flex items-center justify-center text-xs">€</div>
            <span class="font-extrabold text-slate-900 text-sm">Nexis Money</span>
          </div>
          <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">● SÉCURISÉ</span>
        </div>

        <!-- Message d'erreur s'il y en a un -->
        <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-700">Email</label>
            <input v-model="form.email" type="email" placeholder="nom@entreprise.fr" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-950" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-700">Mot de passe</label>
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••••••" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-950" />
          </div>

          <button type="submit" :disabled="isLoading" class="w-full py-3 px-4 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2">
            <span>{{ isLoading ? 'Connexion en cours...' : 'Accéder à mon espace' }}</span>
          </button>
        </form>

        <p class="text-center text-xs text-slate-500 mt-4">
          Pas encore de compte ? <NuxtLink to="/register" class="font-bold text-indigo-950 hover:underline">S'inscrire</NuxtLink>
        </p>
      </div>

    </div>
  </div>
</template>