<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
</script>