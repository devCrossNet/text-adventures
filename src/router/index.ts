import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Intro',
    component: () => import('../views/Intro.vue'),
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: () => import('../views/Game.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
