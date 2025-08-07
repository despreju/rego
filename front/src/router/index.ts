import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../pages/Login.vue';
import Home from '../pages/Home.vue';
import { useCheck } from '../composables/useAuth';

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { requiresAuth: false, layout: 'AuthLayout' },
  },
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true, layout: 'MainLayout' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {  
  const auth = useAuthStore();
  console.log('auth.isAuthenticated:', auth.isAuthenticated);
  if (auth.isAuthenticated && to.meta.requiresAuth) {
    next();
  } else if (to.meta.requiresAuth) {
    const checkMutation = useCheck();
    await checkMutation.mutateAsync();
    if (auth.isAuthenticated) {
      next();
    }
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      next('/login');
    }
  }
  next();

});

export default router;
