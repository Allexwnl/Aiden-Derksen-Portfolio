import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginAdmin from '../admin/LoginAdmin.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/admin', component: LoginAdmin },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const user = supabase.auth.user()
  const allowedEmails = ['alexanderzoet@gmail.com', 'aidenderksen2007@gmail.com'] // jouw admin emails

  if (requiresAuth) {
    if (!user || !allowedEmails.includes(user.email)) {
      return next('/login') // redirect naar login als niet ingelogd of geen admin
    }
  }
  next()
})

export default router;
