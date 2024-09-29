<template>
  <v-app class="app">
    <v-main class="fixed-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const theme = ref('light');
</script>

<style>
.fixed-app {
  height: 100vh;
  /* Full viewport height */
  overflow: hidden;
  /* Disable scrolling */
}

.fixed-main {
  height: 100%;
  /* Full height of the app */
  overflow: hidden;
  /* Disable scrolling */
}

html,
body {
  height: 100%;
  overflow: auto;
  /* Disable scrolling */
  margin: 0;
  /* Remove default margin */
  padding: 0;
  /* Remove default padding */
}

#app {
  height: 100%;
  overflow: hidden;
  /* Disable scrolling */
}


#app {
  text-transform: uppercase;
  font-family: 'JetBrains Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>