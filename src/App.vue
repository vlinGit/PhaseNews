<template>
  <RouterView />
  <div class="footer">
    <div class="wrapper">
      <p>&copy; {{ year }} Phase News</p>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import '@/main.css';

const year = new Date().getFullYear()
</script>

<style scoped>
</style>
