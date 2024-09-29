<template>
    <AppBar :drawer="drawer" @toggleDrawer="toggleDrawer"></AppBar>
    <v-navigation-drawer v-model="drawer" app>
        <v-list-item title="Workflows Managements" subtitle="Celery Director" style="height: 100px;"></v-list-item>
        <v-divider></v-divider>
        <v-list density="compact" nav>
            <v-list-group class="customPrepend customPadding">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" title="Workflows" prepend-icon="mdi-cogs"
                        class="customPrepend"></v-list-item>
                </template>
                <v-list-item v-for="(workflow, index) in workflows" :key="index" :title="workflow.title"
                    :prepend-icon="workflow.icon" :to="workflow.link" class="sub-menu-item"></v-list-item>
            </v-list-group>
        </v-list>
        <v-divider></v-divider>
        <v-list-item class="toggleThemeButton">
            <v-btn icon @click="toggleTheme">
                <v-icon>{{ themeIcon }}</v-icon>
            </v-btn>
        </v-list-item>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useTheme } from 'vuetify';

const drawer = ref(JSON.parse(localStorage.getItem('drawerState')) || false);

const workflows = [
    { title: 'Create Workflow', icon: 'mdi-plus', link: '/create-workflow' },
    { title: 'Manage Workflows', icon: 'mdi-wrench', link: '/manage-workflows' },
    { title: 'Tasks', icon: 'mdi-format-list-bulleted', link: '/tasks' },
    { title: 'Schedules', icon: 'mdi-calendar-clock', link: '/schedules' },
    { title: 'Settings', icon: 'mdi-cog', link: '/settings' },
];

const theme = useTheme();
const themeIcon = ref(theme.global.current.value.dark ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny');

const toggleDrawer = () => {
    drawer.value = !drawer.value;
};

const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
    themeIcon.value = theme.global.current.value.dark ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny';
    localStorage.setItem('theme', theme.global.current.value.dark ? 'dark' : 'light');
};

watch(drawer, (newVal) => {
    localStorage.setItem('drawerState', JSON.stringify(newVal));
});

onMounted(() => {
    console.log('Initial workflows:', workflows);
});
</script>

<style scoped>
.customPrepend :deep(.v-list-item__prepend .v-list-item__spacer) {
    width: 10px;
}

.customPrepend :deep(.sub-menu-item .v-list-item__spacer) {
    padding-left: 8px;
}

.customPadding :deep(.v-list-group__items .v-list-item) {
    padding-inline-start: 32px !important;
}

.toggleThemeButton {
    position: absolute;
    bottom: 0;
    left: 0;
}

.toggleThemeButton :deep(.v-list-item__content) {
    justify-content: center;
    padding: 5px;
}
</style>