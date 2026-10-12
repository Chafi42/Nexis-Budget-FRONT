<!-- components/Header.vue -->
<template>
  <header class="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between w-full">
    <NuxtLink to="/" class="flex items-center gap-2">
      <div class="w-32 h-32 flex items-center justify-center font-bold text-indigo-950 text-xs">
        <img :src="nexisBudget" class="w-full h-full object-contain" alt="Nexis Budget Logo" />
      </div>
    </NuxtLink>

    <div class="flex items-center gap-3">
      <NuxtLink to="/login" class="text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition">
        Accès espace
      </NuxtLink>
      <NuxtLink to="/register" class="text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-950 text-white hover:bg-indigo-900 transition shadow-sm">
        Inscription
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import nexisBudget from '~/assets/images/nexisbudget.png'
</script>