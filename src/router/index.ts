import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Intro",
    component: () =>
      import(/* webpackChunkName: "intro" */ "../views/Intro.vue"),
  },
  {
    path: "/game/:id",
    name: "Game",
    component: () => import(/* webpackChunkName: "game" */ "../views/Game.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
