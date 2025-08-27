// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginAdmin from '../admin/LoginAdmin.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/admin',
    name: 'AdminLogin',
    component: LoginAdmin,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
