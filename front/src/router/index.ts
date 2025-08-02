import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../pages/Login.vue';
import Home from '../pages/Home.vue';

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true, layout: 'default' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
   const auth = useAuthStore();
   if (to.meta.requiresAuth && !auth.isAuthenticated) {
     next('/login');
   } else if (!to.meta.requiresAuth && auth.isAuthenticated && to.path === '/login') {
     next('/');
   } else {
     next();
   }
 });

export default router;
