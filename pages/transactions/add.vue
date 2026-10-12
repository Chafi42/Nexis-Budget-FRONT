<!-- client/pages/transactions/add.vue -->
<script setup lang="ts">
import { useTransactionForm } from '~/composables/useTransactionForm'

definePageMeta({
  layout: 'auth',
})

const {
  editId,
  form,
  categories,
  addAmount,
  clearAmount,
  submitTransaction,
} = useTransactionForm()
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <div class="p-6 lg:p-8 space-y-6 overflow-y-auto">
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-3xl font-extrabold text-slate-900 tracking-tight mt-1"
          >
            {{ editId ? "Modifier l'opération" : "Ajouter une opération" }}
          </h1>
          <p class="text-xs text-slate-500 mt-3">
            Enregistrez instantanément vos flux monétaires dans MongoDB.
          </p>
        </div>
        <NuxtLink
          to="/transactions"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
        >
          ← Retour à l'historique
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Formulaire Gauche -->
        <div
          class="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <!-- Switch Dépense / Revenu -->
          <div class="space-y-2">
            <p
              class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            >
              TYPE D'OPÉRATION
            </p>
            <div
              class="bg-slate-100 p-1 rounded-2xl grid grid-cols-2 gap-1 text-xs font-bold"
            >
              <button
                @click="form.type = 'expense'"
                class="py-3 rounded-xl flex items-center justify-center gap-2 transition"
                :class="
                  form.type === 'expense'
                    ? 'bg-rose-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                "
              >
                <span>↓</span> Dépense
              </button>
              <button
                @click="form.type = 'income'"
                class="py-3 rounded-xl flex items-center justify-center gap-2 transition"
                :class="
                  form.type === 'income'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                "
              >
                <span>↑</span> Revenu
              </button>
            </div>
          </div>

          <!-- Montant dynamique -->
          <div
            class="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 space-y-4"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                >MONTANT DE LA TRANSACTION</span
              >
              <span
                class="text-[9px] font-bold px-2 py-0.5 rounded-full"
                :class="
                  form.type === 'expense'
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-emerald-600 bg-emerald-50'
                "
              >
                {{ form.type === 'expense' ? 'DÉBIT (-)' : 'CRÉDIT (+)' }}
              </span>
            </div>

            <div class="flex items-center justify-between text-slate-900">
              <span
                class="text-3xl font-extrabold"
                :class="
                  form.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'
                "
              >
                {{ form.type === 'expense' ? '-' : '+' }}
              </span>
              <input
                v-model.number="form.amount"
                type="number"
                step="0.01"
                class="bg-transparent text-4xl sm:text-5xl font-extrabold text-center focus:outline-none w-full"
              />
              <span class="text-3xl font-extrabold text-slate-300">€</span>
            </div>

            <div
              class="flex items-center justify-between gap-2 text-xs font-bold pt-2"
            >
              <button
                @click="addAmount(10)"
                class="flex-1 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
              >
                +10 €
              </button>
              <button
                @click="addAmount(25)"
                class="flex-1 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
              >
                +25 €
              </button>
              <button
                @click="addAmount(50)"
                class="flex-1 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
              >
                +50 €
              </button>
              <button
                @click="addAmount(100)"
                class="flex-1 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
              >
                +100 €
              </button>
              <button
                @click="clearAmount"
                class="px-3 py-2 bg-slate-200/60 text-slate-600 rounded-xl hover:bg-slate-300 transition text-[11px]"
              >
                ⌫ Effacer
              </button>
            </div>
          </div>

          <!-- Catégorie -->
          <div class="space-y-3">
            <p
              class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            >
              CATÉGORIE BUDGÉTAIRE
            </p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                v-for="cat in categories"
                :key="cat.id"
                @click="form.category = cat.id"
                class="p-3.5 border rounded-2xl text-left transition flex flex-col justify-between space-y-2"
                :class="
                  form.category === cat.id
                    ? 'border-indigo-950 bg-indigo-50/40 ring-1 ring-indigo-950'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                "
              >
                <span class="text-xl">{{ cat.icon }}</span>
                <p class="text-xs font-bold text-slate-900">{{ cat.label }}</p>
              </button>
            </div>
          </div>

          <!-- Intitulé -->
          <div class="space-y-1">
            <label
              class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
              >INTITULÉ OU COMMERÇANT</label
            >
            <input
              v-model="form.merchant"
              type="text"
              placeholder="Ex: Loyer, Courses..."
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-950"
            />
          </div>

          <!-- Boutons -->
          <div class="flex items-center gap-4 pt-2">
            <button
              @click="submitTransaction"
              class="flex-1 py-3.5 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-2xl shadow-md transition"
            >
              ✓ {{ editId ? "Mettre à jour" : "Enregistrer dans MongoDB" }}
            </button>
            <button
              @click="clearAmount"
              class="px-6 py-3.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <!-- Aperçu à droite -->
        <div class="lg:col-span-5 space-y-6">
          <div
            class="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <span class="text-emerald-600 text-[10px] font-bold"
              >● APERÇU EN DIRECT</span
            >
            <div
              class="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-2"
            >
              <p class="text-xs font-extrabold text-slate-900">
                {{ form.merchant || "Opération" }}
              </p>
              <p
                class="text-[10px]"
                :class="
                  form.type === 'expense'
                    ? 'text-rose-600 font-bold'
                    : 'text-emerald-600 font-bold'
                "
              >
                {{ form.category }} • {{ form.type === 'expense' ? '-' : '+'
                }}{{ form.amount }} €
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>