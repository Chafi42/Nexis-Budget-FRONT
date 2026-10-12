<!-- pages/index.vue -->
<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'default',
  title: 'Nexis Money - Gérez vos dépenses et votre budget, simplement.',
  meta: [
    {
      name: 'description',
      content: 'Catégorisez vos achats (logement, nourriture, loisirs), définissez vos limites mensuelles et gardez le contrôle sur votre argent.'
    }
  ]
})

const currentMonthBalance = ref('1 850,00 €')
const remainingBudget = ref('450 €')
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 pt-4 pb-12">
    <!-- HERO SECTION -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div class="lg:col-span-8 space-y-4 pt-2">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
          Gérez vos dépenses et<br />votre budget, simplement.
        </h1>
        <p class="text-slate-500 text-xs sm:text-sm max-w-xl leading-relaxed">
          Catégorisez vos achats (logement, nourriture, loisirs), définissez vos limites mensuelles et gardez le contrôle sur votre argent.
        </p>
      </div>

      <div class="lg:col-span-4 flex justify-end">
        <div class="bg-white border border-slate-200/80 shadow-sm rounded-xl p-3.5 flex items-center justify-between gap-4 w-full max-w-xs">
          <div class="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Rendement moyen optimisé</p>
            <div class="flex items-baseline justify-end gap-1 mt-0.5">
              <span class="text-lg font-extrabold text-slate-900">{{ remainingBudget }}</span>
              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">/ MOIS</span>
            </div>
            <p class="text-[9px] text-slate-400 mt-0.5">🛡️ Données 100% privées & sécurisées.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>