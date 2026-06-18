import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import HomePage from '../views/HomePage.vue';
import LoginAdmin from '../admin/LoginAdmin.vue';
import Dashboard from '../admin/DashBoard.vue';
import ProjectDetail from '../views/ProjectShow.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/admin', component: LoginAdmin },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/project/:id', component: ProjectDetail }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const allowedEmails = ['alexanderzoet@gmail.com', 'aidenderksen2007@gmail.com']

// Wacht eenmalig op de huidige Firebase-gebruiker.
function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) return next()

  const user = await getCurrentUser()
  if (!user || !allowedEmails.includes(user.email)) {
    return next('/admin')
  }
  next()
})

export default router;
