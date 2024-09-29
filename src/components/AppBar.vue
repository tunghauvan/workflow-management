<template>
    <!-- disable floating -->
    <v-app-bar app>
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Celery Workflow Managements</v-toolbar-title>
        <v-spacer></v-spacer>
    </v-app-bar>
</template>

<script setup>
const emit = defineEmits(['toggle-drawer']);

function toggleDrawer() {
    emit('toggle-drawer');
}
</script>

<style scoped>
/* Add any scoped styles here */
/* Set Appbar fixed to top and hide overflow */
.v-app-bar {
    position: fixed;
    top: 0;
    z-index: 1000;
    overflow: hidden; /* Hide overflow */
}
.v-toolbar__title {
    font-size: 1.2rem;
}
</style>