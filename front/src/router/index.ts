import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../pages/Login.vue';
import Home from '../pages/Home.vue';
import Orders from '../pages/Orders.vue';
import Shopify from '../pages/Shopify.vue';
import Ads from '../pages/Ads.vue';
import Payment from '../pages/Payment.vue';
import Users from '../pages/Users.vue';
import { check } from '../api/authApi';

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
  {
    path: '/shopify',
    component: Shopify,
    meta: { requiresAuth: true, layout: 'app' },
  },
  {
    path: '/ads',
    component: Ads,
    meta: { requiresAuth: true, layout: 'app' },
  },
  {
    path: '/payment',
    component: Payment,
    meta: { requiresAuth: true, layout: 'app' },
  },
  {
    path: '/users',
    component: Users,
    meta: { requiresAuth: true, layout: 'app' },
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, _, next) => {
  console.log('beforeEach')
  const auth = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;

  if (auth.isAuthenticated) {
    // Authentifié, pas besoin de check
    return next();
  }

  if (!requiresAuth) {
    // Pas besoin d'être authentifié
    return next();
  }

  // L'utilisateur n'est pas encore authentifié mais essaie d'accéder à une route protégée
  try {
    const res = await check()
    const authStore = useAuthStore()
    authStore.check(res.user)
    if (auth.isAuthenticated) {
      return next();
    } else {
      return next('/login');
    }
  } catch (error) {
    return next('/login');
  }
});

export default router;
