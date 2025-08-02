import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index.ts';
import { VueQueryPlugin } from '@tanstack/vue-query';
import 'vfonts/FiraCode.css'
import naive from 'naive-ui'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)
app.use(naive)
app.mount('#app')


