import { createRouter, createWebHistory } from 'vue-router'
import Home from './src/views/Home.vue'
import Room from './src/views/Room.vue'
import NotFound from './src/views/NotFound.vue'
import PrivacyPolicy from './src/views/Privacy.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/room/:roomCode', component: Room },
  { path: '/not-found', component: NotFound },
  { path: '/:catchAll(.*)', redirect: '/not-found' },
  { path: '/privacy-policy', component: PrivacyPolicy },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router