import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../pages/Login.vue';
import Home from '../pages/Home.vue';
import Orders from '../pages/Orders.vue';
import { useCheck } from '../composables/useAuth';

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { requiresAuth: false, layout: 'login' },
  },
  {
    path: '/home',
    component: Home,
    meta: { requiresAuth: true, layout: 'app' },
  },
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true, layout: 'app' },
  },
  {
    path: '/orders',
    component: Orders,
    meta: { requiresAuth: true, layout: 'app' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, _, next) => {
  const auth = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;

  if (auth.isAuthenticated) {
    // Authentifié, pas besoin de check
    console.log('Utilisateur authentifié, accès autorisé à la route :', to.path);
    return next();
  }

  if (!requiresAuth) {
    // Pas besoin d'être authentifié
    return next();
  }

  // L'utilisateur n'est pas encore authentifié mais essaie d'accéder à une route protégée
  try {
    const checkMutation = useCheck();
    await checkMutation.mutateAsync();

    if (auth.isAuthenticated) {
      return next();
    } else {
      return next('/login');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de session :', error);
    return next('/login');
  }
});

export default router;
