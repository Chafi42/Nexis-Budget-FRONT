<!-- components/Footer.vue -->
<template>
  <footer class="bg-white border-t border-slate-200 py-8 text-[10px] text-slate-400 mt-12">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="space-y-1 text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start ">
          <img :src="nexisBudget" class="w-32 h-32 object-contain" alt="Nexis Budget Logo" />   
        </div>
        <p class="max-w-xs">
          Plateforme financière de nouvelle génération. Clarté, prévoyance et gestion budgétaire à haute précision.
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-6 text-slate-500 font-medium">
        <a href="#" class="hover:underline">Mentions légales</a>
        <a href="#" class="hover:underline">Confidentialité</a>
        <a href="#" class="hover:underline">Sécurité bancaire</a>
        <a href="#" class="hover:underline">Support</a>
      </div>

      <p class="text-slate-400">
        © 2026 Chafi AADSSI. Tous droits réservés.
      </p>
    </div>
  </footer>
</template>



<script setup lang="ts">
import nexisBudget from '~/assets/images/nexisbudget.png'
</script>