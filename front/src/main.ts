import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index';
import { VueQueryPlugin } from '@tanstack/vue-query';
import './assets/main.css'
import VueApexCharts from "vue3-apexcharts";
import { useAuthStore } from './stores/auth';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

app.component('apexchart', VueApexCharts)

app.mount('#app')


