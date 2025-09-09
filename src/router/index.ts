import { createRouter, createWebHistory } from 'vue-router'

import FormBuilderPage from '../pages/FormBuilderPage.vue';
import FormPage from '../pages/FormPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: FormBuilderPage },
    { path: '/form', component: FormPage },
  ],
})

export default router
