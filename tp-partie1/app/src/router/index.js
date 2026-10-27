import { createRouter, createWebHistory } from '@ionic/vue-router';
import TabsPage from '@/views/TabsPage.vue';

const routes = [
  { path: '/', redirect: '/tabs/menu' },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      { path: '', redirect: '/tabs/menu' },
      { path: 'menu', component: () => import('@/views/MenuPage.vue') },
      { path: 'panier', component: () => import('@/views/PanierPage.vue') },
      { path: 'commandes', component: () => import('@/views/CommandesPage.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
