<template>
  <v-app>
    <v-main>
      <NavBar />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import NavBar from '@/components/NavBar.vue'
</script>
