<template>
    <v-card>
        <v-card-title>
            <span class="text-h6">Details</span>
        </v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item v-for="(detail, index) in details" :key="index">
                    <v-list-item-content>
                        <v-list-item-title>{{ detail.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ detail.subtitle }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';

const details = ref([
    { title: 'Detail 1', subtitle: 'This is the first detail' },
    { title: 'Detail 2', subtitle: 'This is the second detail' },
    { title: 'Detail 3', subtitle: 'This is the third detail' },
]);
</script>

<style scoped>
/* Add any scoped styles here */
</style>