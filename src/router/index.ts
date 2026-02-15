import { createRouter, createWebHistory } from 'vue-router'

import FormBuilderPage from '../pages/FormBuilderPage.vue';
import FormPreviewPage from '../pages/FormPreviewPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: FormBuilderPage },
    { path: '/form', component: FormPreviewPage },
  ],
})

export default router
