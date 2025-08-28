import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '../supabase/supabase.js'
import HomePage from '../views/HomePage.vue';
import LoginAdmin from '../admin/LoginAdmin.vue';
import Dashboard from '../admin/Dashboard.vue';


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
  const { data: { session } } = await supabase.auth.getSession()
  const allowedEmails = ['alexanderzoet@gmail.com', 'aidenderksen2007@gmail.com']

  if (requiresAuth) {
    if (!session || !allowedEmails.includes(session.user.email)) {
      return next('/admin') // redirect naar login
    }
  }
  next()
})


export default router;
