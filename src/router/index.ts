import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/index/index.vue"),
    },
    {
      path: "/recharge",
      name: "recharge",
      component: () => import("../views/recharge/index.vue"),
    },
    {
      path: "/singleLogin",
      name: "singleLogin",
      component: () => import("../views/singleLogin/index.vue"),
    },
    {
      path: "/blog",
      name: "blog",
      component: () => import("../views/blog/index.vue"),
    },
    {
      path: "/pay",
      name: "pay",
      component: () => import("../views/pay/index.vue"),
    },
    {
      path: "/loading",
      name: "loading",
      component: () => import("../views/loading/index.vue"),
    },
    {
      path: "/result",
      name: "result",
      component: () => import("../views/result/index.vue"),
    },
    {
      path: "/miniLogin",
      name: "miniLogin",
      component: () => import("../views/miniLogin/index.vue"),
    },
  ],
});

export default router;
