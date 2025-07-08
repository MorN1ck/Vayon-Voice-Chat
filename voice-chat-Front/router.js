import { createRouter, createWebHistory } from 'vue-router'
import Home from './src/views/Home.vue'
import Room from './src/views/Room.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/room/:roomCode', component: Room },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router