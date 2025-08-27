import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginAdmin from '../admin/LoginAdmin.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/admin', component: LoginAdmin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
