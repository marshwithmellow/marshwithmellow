import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/index/index.vue') },
    { path: '/recharge', name: 'recharge', component: () => import('../views/recharge/index.vue') },
    { path: '/singleLogin', name: 'singleLogin', component: () => import('../views/singleLogin/index.vue') }
  ]
})

export default router
