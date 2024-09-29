// src/theme.js
import { ref } from 'vue';

const savedTheme = localStorage.getItem('theme') || 'light';
export const theme = ref(savedTheme);