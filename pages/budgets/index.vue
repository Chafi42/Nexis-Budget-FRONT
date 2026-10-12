<!-- client/pages/budgets/index.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useBudgets } from '~/composables/useBudgets'
import { categoriesList } from '~/utils/budgetHelpers'

definePageMeta({
  layout: 'auth',
})

const {
  isLoading,
  errorMessage,
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
} = useBudgets()

onMounted(() => {
  fetchBudgets()
})
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <div class="p-6 lg:p-8 space-y-6 overflow-y-auto">
      <!-- Carte de synthèse des budgets -->
      <div
        class="bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/30 border border-indigo-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm"
      >
        <div class="space-y-2">
          <div class="flex items-baseline gap-3">
            <h2 class="text-4xl font-extrabold tracking-tight text-indigo-950">
              {{ totalBudgetsAmount.toFixed(2) }} €
            </h2>
            <span class="text-xs font-bold text-slate-400"
              >TOTAL DES BUDGETS</span
            >
          </div>
          <p class="text-xs text-slate-500">
            GÉREZ VOS BUDGETS.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="openAddModal"
            class="px-4 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <span>+</span> Ajouter un budget
          </button>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl"
      >
        {{ errorMessage }}
      </div>

      <!-- Liste sous forme de Tableau -->
      <div
        class="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4"
      >
        <div
          class="flex items-center justify-between text-xs text-slate-400 font-bold border-b border-slate-100 pb-3"
        >
          <span>BUDGETS & OBJECTIFS FIXÉS (MONGODB)</span>
        </div>

        <div v-if="isLoading" class="text-xs text-slate-400 py-8 text-center">
          Chargement des budgets...
        </div>
        <div
          v-else-if="filteredBudgets.length === 0"
          class="text-xs text-slate-400 py-8 text-center"
        >
          Aucun budget spécifique configuré pour le moment.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr
                class="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2"
              >
                <th class="pb-3 font-semibold">CATÉGORIE</th>
                <th class="pb-3 font-semibold text-right">MONTANT FIXÉ</th>
                <th class="pb-3 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="b in filteredBudgets"
                :key="b.id"
                class="hover:bg-slate-50/50 transition"
              >
                <td class="py-4">
                  <span
                    class="px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2"
                    :class="b.color"
                  >
                    <span class="text-sm">{{ b.icon }}</span> {{ b.category }}
                  </span>
                </td>
                <td
                  class="py-4 text-right font-extrabold text-sm text-slate-900"
                >
                  {{ b.amount.toFixed(2) }} €
                </td>
                <td class="py-4 text-right space-x-2">
                  <button
                    @click="openEditModal(b)"
                    class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] transition"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    @click="deleteBudget(b.id)"
                    class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-[10px] transition"
                  >
                    🗑️ Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modale d'ajout / modification -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-6">
        <div
          class="flex items-center justify-between border-b border-slate-100 pb-4"
        >
          <h3 class="font-extrabold text-sm text-slate-900">
            {{ isEditing ? 'Modifier le budget' : 'Définir un nouveau budget' }}
          </h3>
          <button
            @click="showModal = false"
            class="text-slate-400 hover:text-slate-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Catégorie</label>
            <select
              v-model="formCategory"
              class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:outline-none"
            >
              <option v-for="cat in categoriesList" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1"
              >Montant limite (€)</label
            >
            <input
              v-model="formAmount"
              type="number"
              step="0.01"
              placeholder="300"
              class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-950 focus:outline-none font-bold"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            @click="showModal = false"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
          >
            Annuler
          </button>
          <button
            @click="saveBudget"
            class="px-4 py-2 bg-indigo-950 hover:bg-indigo-900 text-white font-bold rounded-xl text-xs shadow-md transition"
          >
            {{ isEditing ? 'Mettre à jour' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>