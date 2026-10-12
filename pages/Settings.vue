<!-- client/pages/Settings.vue -->
<script setup lang="ts">
import { useSettings } from '~/composables/useSettings'
import { settingsTabs, defaultCategories } from '~/utils/settingsHelper'
definePageMeta({
  layout: 'auth'
})

const {
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
} = useSettings()
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0 bg-slate-50/50">
    
    <!-- Top Header de la page Paramètres -->
    <header class="bg-white border-b border-slate-200 px-6 py-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900">Paramètres du compte</h1>
          <p class="text-xs text-slate-500 mt-1">Gérez vos informations et vos préférences de sécurité.</p>
        </div>
        <button @click="updateProfile" class="bg-indigo-950 hover:bg-indigo-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition self-start sm:self-auto">
          Enregistrer les modifications
        </button>
      </div>

      <!-- Navigation par onglets dynamique -->
      <div class="flex items-center justify-around gap-2 overflow-x-auto pt-2 border-t border-slate-100 text-xs font-bold">
        <button 
          v-for="tab in settingsTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap"
          :class="activeTab === tab.id ? 'bg-indigo-950 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          <span>{{ tab.icon }}</span> {{ tab.label }}
        </button>
      </div>
    </header>

    <!-- Contenu des onglets -->
    <div class="p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl">

      <!-- ================= ONGLET 1 : MON PROFIL ================= -->
      <div v-if="activeTab === 'profil'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 class="text-sm font-extrabold text-slate-900">Informations Personnelles</h3>
                <p class="text-[10px] text-slate-400 mt-0.5">Coordonnées de contact et données du profil.</p>
              </div>
              <span class="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-[10px] rounded-full">
                COMPTE ACTIF
              </span>
            </div>

            <div v-if="successMessage" class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">
              {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">
              {{ errorMessage }}
            </div>

            <div class="flex items-center gap-4 py-2">
              <div class="w-14 h-14 bg-indigo-100 text-indigo-950 font-extrabold rounded-2xl flex items-center justify-center text-lg shadow-inner">
                {{ firstName.charAt(0) || 'U' }}
              </div>
              <div class="space-y-1">
                <button class="text-xs font-bold text-indigo-950 hover:underline">Modifier la photo</button>
                <p class="text-[10px] text-slate-400">JPG, PNG ou GIF (Max. 2 Mo)</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Prénom</label>
                <input v-model="firstName" type="text" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:outline-none" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Nom</label>
                <input v-model="lastName" type="text" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:outline-none" />
              </div>
              <div class="sm:col-span-2">
                <label class="block font-bold text-slate-700 mb-1">Adresse email</label>
                <div class="flex gap-2">
                  <input v-model="email" type="email" class="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:outline-none" />
                  <span class="px-3 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-100 text-[10px] flex items-center">
                    ✓ Vérifié
                  </span>
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button @click="updateProfile" class="px-4 py-2 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition">
                Mettre à jour le profil
              </button>
            </div>
          </div>

          <!-- Portefeuilles -->
          <div class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 class="text-sm font-extrabold text-slate-900">Gestion de mes portefeuilles</h3>
                <p class="text-[10px] text-slate-400 mt-0.5">Comptes courants, épargne et portefeuilles actifs.</p>
              </div>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Direct API</span>
            </div>

            <div class="space-y-3">
              <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p class="font-bold text-slate-900">Compte courant</p>
                  <p class="text-[10px] text-slate-400">Carte bancaire • Paiements quotidiens</p>
                </div>
                <div class="text-right">
                  <p class="font-extrabold text-slate-900">2 450,00 €</p>
                  <span class="text-[10px] text-emerald-600 font-bold">Actif</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne Latérale -->
        <div class="space-y-6">
          <div class="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 class="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">🔔 Règles & Alertes</h3>

            <div class="space-y-4 text-xs">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-bold text-slate-800">Alerte de dépassement de budget</p>
                  <p class="text-[10px] text-slate-400">Notification si vous approchez des 80%</p>
                </div>
                <input type="checkbox" v-model="alertBudget" class="w-4 h-4 accent-indigo-950 cursor-pointer" />
              </div>

              <hr class="border-slate-100" />

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-bold text-slate-800">Rappel d'échéance mensuelle</p>
                  <p class="text-[10px] text-slate-400">Notification avant les prélèvements</p>
                </div>
                <input type="checkbox" v-model="alertMonthly" class="w-4 h-4 accent-indigo-950 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ================= ONGLET 2 : MES CATEGORIES ================= -->
      <div v-if="activeTab === 'categories'" class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 class="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-4">🏷️ Gestion personnalisée des Catégories</h3>
        <p class="text-xs text-slate-500">Configurez vos catégories de dépenses et de revenus.</p>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
          <div v-for="cat in defaultCategories" :key="cat.name" class="p-4 border rounded-2xl flex items-center justify-between text-xs font-bold" :class="cat.color">
            <span>{{ cat.icon }} {{ cat.name }}</span>
            <span class="text-[10px] text-slate-400">Défaut</span>
          </div>
        </div>
      </div>

      <!-- ================= ONGLET 3 : ALERTES & RAPPELS ================= -->
      <div v-if="activeTab === 'alertes'" class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 class="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-4">🔔 Notifications & Alertes Intelligentes</h3>
        <p class="text-xs text-slate-500">Personnalisez la fréquence de vos e-mails de synthèse.</p>
      </div>

      <!-- ================= ONGLET 4 : SÉCURITÉ & ACCÈS ================= -->
      <div v-if="activeTab === 'securite'" class="space-y-6 max-w-2xl">
        <div class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 class="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-4">🔒 Modification du mot de passe</h3>

          <div v-if="successPasswordMessage" class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">
            {{ successPasswordMessage }}
          </div>
          <div v-if="errorPasswordMessage" class="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">
            {{ errorPasswordMessage }}
          </div>

          <div class="space-y-4 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Mot de passe actuel</label>
              <input v-model="currentPassword" type="password" placeholder="••••••••" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:outline-none" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Nouveau mot de passe</label>
              <input v-model="newPassword" type="password" placeholder="••••••••" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:outline-none" />
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button @click="updatePassword" class="px-4 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition">
              Mettre à jour le mot de passe
            </button>
          </div>
        </div>

        <div class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">Double authentification (2FA)</h3>
              <p class="text-[10px] text-slate-400">Protégez votre compte avec une couche de sécurité supplémentaire.</p>
            </div>
            <input type="checkbox" v-model="twoFactorAuth" class="w-4 h-4 accent-indigo-950 cursor-pointer" />
          </div>
        </div>
      </div>

    </div>

  </div>
</template>