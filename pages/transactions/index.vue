<!-- client/pages/transactions/index.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useTransactions } from '~/composables/useTransactions'

definePageMeta({
  layout: 'auth',
})

const {
  isLoading,
  errorMessage,
  searchQuery,
  selectedType,
  totalBalance,
  filteredTransactions,
  fetchTransactions,
  deleteTransaction,
  editTransaction,
} = useTransactions()

onMounted(() => {
  fetchTransactions()
})
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <div class="p-6 lg:p-8 space-y-6 overflow-y-auto">
      <div
        class="bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/30 border border-emerald-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm"
      >
        <div class="space-y-4">
          <div class="flex items-baseline gap-3">
            <h2
              class="text-4xl font-extrabold tracking-tight"
              :class="totalBalance >= 0 ? 'text-emerald-800' : 'text-rose-700'"
            >
              {{ totalBalance > 0 ? '+' : totalBalance < 0 ? '-' : ''
              }}{{ Math.abs(totalBalance).toFixed(2) }} €
            </h2>
            <span class="text-xs font-bold text-slate-400"
              >Solde réel calculé</span
            >
          </div>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/transactions/add"
            class="px-4 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <span>+</span> Transaction
          </NuxtLink>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="relative flex-1 max-w-sm">
          <span
            class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs"
            >🔍</span
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Commerçant, libellé, tag ou montant..."
            class="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-950"
          />
        </div>

        <div class="flex items-center gap-2 flex-wrap text-xs">
          <button
            @click="
              selectedType = selectedType === 'expense' ? undefined : 'expense'
            "
            class="px-3 py-1.5 rounded-xl font-bold transition"
            :class="
              selectedType === 'expense'
                ? 'bg-indigo-950 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            "
          >
            ● Dépenses
          </button>
          <button
            @click="
              selectedType = selectedType === 'income' ? undefined : 'income'
            "
            class="px-3 py-1.5 rounded-xl font-bold transition"
            :class="
              selectedType === 'income'
                ? 'bg-indigo-950 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            "
          >
            ● Revenus
          </button>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl"
      >
        {{ errorMessage }}
      </div>

      <div
        class="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4"
      >
        <div
          class="flex items-center justify-between text-xs text-slate-400 font-bold border-b border-slate-100 pb-3"
        >
          <span> TRANSACTIONS PASSÉES</span>
        </div>

        <div v-if="isLoading" class="text-xs text-slate-400 py-8 text-center">
          Chargement des données...
        </div>
        <div
          v-else-if="filteredTransactions.length === 0"
          class="text-xs text-slate-400 py-8 text-center"
        >
          Aucune transaction enregistrée.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr
                class="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2"
              >
                <th class="pb-3 font-semibold text-center">DATE</th>
                <th class="pb-3 font-semibold text-center">TRANSACTION</th>
                <th class="pb-3 font-semibold text-center">CATÉGORIE</th>
                <th class="pb-3 font-semibold text-center text-right">
                  MONTANT
                </th>
                <th class="pb-3 font-semibold text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="tx in filteredTransactions"
                :key="tx.id"
                class="hover:bg-slate-50/50 transition"
              >
                <td class="py-4">
                  <p class="font-bold text-slate-900">{{ tx.date }}</p>
                </td>
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold"
                    >
                      {{ tx.categoryIcon }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-900">{{ tx.merchant }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-max"
                    :class="tx.categoryColor"
                  >
                    <span>{{ tx.categoryIcon }}</span> {{ tx.category }}
                  </span>
                </td>

                <td
                  class="py-4 text-right font-extrabold text-sm"
                  :class="tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'"
                >
                  {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount.toFixed(2) }} €
                </td>
                <td class="py-4 text-right space-x-2">
                  <button
                    @click="editTransaction(tx)"
                    class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] transition"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    @click="deleteTransaction(tx.id)"
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
  </div>
</template>