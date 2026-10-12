<!-- client/pages/dashboard.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useDashboard } from '~/composables/useDashboard'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const {
  dashboardData,
  errorMessage,
  currentMonthName,
  totalBalance,
  totalIncome,
  totalExpense,
  formatFriendlyDate,
  fetchDashboardData
} = useDashboard()

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <div class="p-6 lg:p-8 space-y-8 overflow-y-auto">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Bonjour {{ authStore.user?.firstName || 'Utilisateur' }} 👋
        </h1>
        <p class="text-xs text-slate-500 mt-3">
          Voici le récapitulatif de votre budget.
        </p>
      </div>

      <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl">
        {{ errorMessage }}
      </div>

      <!-- Cartes de synthèse dynamiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 flex w-full flex-wrap justify-between">
        <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <span class="my-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">REVENUS DE {{ currentMonthName }}</span>
          <p class="text-3xl font-extrabold text-emerald-600">+ {{ (Number(totalIncome) || 0).toFixed(2) }} €</p>
        </div>

        <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <span class="my-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">DÉPENSES DE {{ currentMonthName }}</span>
          <p class="text-3xl font-extrabold text-rose-600">- {{ (Number(totalExpense) || 0).toFixed(2) }} €</p>
        </div>

        <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <span class="my-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">SOLDE TOTAL DISPONIBLE</span>
          <p class="text-3xl font-extrabold tracking-tight" :class="(Number(totalBalance) || 0) >= 0 ? 'text-emerald-600' : 'text-rose-700'">
            {{ (Number(totalBalance) || 0) > 0 ? '+' : (Number(totalBalance) || 0) < 0 ? '-' : '' }}{{ Math.abs(Number(totalBalance) || 0).toFixed(2) }} €
          </p>
        </div>
      </div>

      <!-- Section basse -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Transactions récentes -->
        <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-slate-900">💳 Dernières Transactions Récentes</h3>
          <div v-if="dashboardData.transactions.length === 0" class="text-xs text-slate-400 py-4">
            Aucune transaction enregistrée.
          </div>
          <div v-else class="space-y-2">
            <div v-for="tx in dashboardData.transactions.slice(0, 5)" :key="tx._id" class="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl text-xs">
              <div>
                <p class="font-bold text-slate-900">{{ tx.title }}</p>
                <p class="text-[10px] text-slate-400">{{ tx.category }}</p>
              </div>
              <span :class="(Number(tx.amount) || 0) > 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'">
                {{ (Number(tx.amount) || 0) > 0 ? '+' : '' }}{{ (Number(tx.amount) || 0).toFixed(2) }} €
              </span>
            </div>
          </div>
        </div>

        <!-- Budgets -->
        <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-slate-900">🎯 Vos Budgets fixés</h3>
          <div v-if="dashboardData.budgets.length === 0" class="text-xs text-slate-400 py-4">
            Aucun budget spécifique configuré pour le moment.
          </div>
          <div v-else class="space-y-3">
            <div v-for="budget in dashboardData.budgets" :key="budget._id" class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
              <span class="font-bold text-slate-800">{{ budget.category }}</span>
              <span class="text-indigo-950 font-extrabold">
                {{ (Number(budget.amount || budget.limit) || 0).toFixed(2) }} €
              </span>
            </div>
          </div>
        </div>

        <!-- Journal d'audit -->
        <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
          <h3 class="text-sm font-bold text-slate-900">🧾 Journal d’audit</h3>
          <div v-if="dashboardData.auditLogs.length === 0" class="text-xs text-slate-400 py-4">
            Aucun événement d’audit enregistré.
          </div>
          <div v-else class="space-y-2">
            <div v-for="log in dashboardData.auditLogs" :key="log._id" class="flex justify-between items-center gap-4 p-2.5 bg-slate-50 rounded-xl text-xs">
              <div>
                <p class="font-bold text-slate-900">
                  {{ log.action || log.event || log.title || 'Événement enregistré' }}
                </p>
                <p v-if="log.description || log.details" class="text-[10px] text-slate-500 mt-0.5">
                  {{ log.description || log.details }}
                </p>
              </div>
              <time v-if="log.createdAt || log.timestamp" class="text-[10px] text-slate-400 shrink-0 font-medium">
                {{ formatFriendlyDate(log.createdAt || log.timestamp) }}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>