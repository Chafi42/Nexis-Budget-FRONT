<!-- client/layouts/auth.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import nexisBudget from '~/assets/images/nexisbudget.png'

const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

function handleLogout() {
  authStore.logout()
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans text-slate-800">
    
    <!-- ================= TOPBAR MOBILE (Visible uniquement sous lg) ================= -->
    <div class="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div class="flex items-center gap-2">
        <img :src="nexisBudget" class="w-32 h-32 object-contain" alt="Nexis Budget Logo" />
      </div>

      <!-- Bouton Burger -->
      <button 
        @click="isMobileMenuOpen = !isMobileMenuOpen" 
        class="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none transition"
        aria-label="Ouvrir le menu"
      >
        <span class="text-xl">{{ isMobileMenuOpen ? 'X' : '☰' }}</span>
      </button>
    </div>

    <!-- Overlay sombre pour mobile -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="closeMobileMenu"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
    ></div>

    <!-- ================= SIDEBAR (Bureau & Tiroir Mobile) ================= -->
    <aside 
      class="fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="space-y-8">
        <!-- Logo -->
        <div class="flex justify-center items-center gap-2">
          <div class="w-32 h-24 rounded-xl text-white font-bold flex items-center justify-center text-sm">
            <img :src="nexisBudget" class="w-full h-full object-contain" alt="Nexis Budget Logo" />    
          </div>
        </div>

        <!-- Navigation -->
        <div class="space-y-1">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Navigation</p>

          <NuxtLink 
            to="/dashboard" 
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            active-class="!bg-indigo-950 !text-white !font-bold shadow-sm"
          >
            <span>📊</span> Tableau de bord
          </NuxtLink>

          <NuxtLink 
            to="/transactions" 
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            active-class="!bg-indigo-950 !text-white !font-bold shadow-sm"
          >
            <span>💳</span> Transactions
          </NuxtLink>

          <NuxtLink 
            to="/budgets" 
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            active-class="!bg-indigo-950 !text-white !font-bold shadow-sm"
          >
            <span>🎯</span> Budgets & Objectifs
          </NuxtLink>

          <NuxtLink 
            to="/settings" 
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            active-class="!bg-indigo-950 !text-white !font-bold shadow-sm"
          >
            <span>⚙️</span> Paramètres
          </NuxtLink>
        </div>
      </div>

      <!-- Utilisateur connecté & Déconnexion -->
      <div class="border-t border-slate-100 pt-4 space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-indigo-100 text-indigo-950 font-bold flex items-center justify-center text-xs">
            {{ authStore.user?.firstName?.[0] || 'U' }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-slate-900 truncate">
              {{ authStore.user?.firstName || 'Utilisateur' }} {{ authStore.user?.lastName || '' }}
            </p>
            <p class="text-[10px] text-slate-400 truncate">
              {{ authStore.user?.email || 'connecté' }}
            </p>
          </div>
        </div>

        <button 
          @click="handleLogout" 
          class="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition"
        >
          Se déconnecter
        </button>
      </div>
    </aside>

    <!-- ================= CONTENEUR PRINCIPAL & TOPBAR ================= -->
    <main class="flex-1 flex flex-col min-w-0">
      
      <!-- Topbar Globale -->
      <header class="h-16 bg-white border-b border-slate-200 px-6 hidden lg:flex items-center justify-between">
        <div class="relative w-96">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">🔍</span>
          <input 
            type="text" 
            placeholder="Rechercher opération, catégorie, montant..." 
            class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-950"
          />
        </div>

        <div class="flex items-center gap-4">
          <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            ● Connecté
          </span>
        </div>
      </header>

      <!-- Injection de la page -->
      <slot />
    </main>

  </div>
</template>