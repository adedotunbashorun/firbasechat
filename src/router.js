import Vue from 'vue'
import Router from 'vue-router'
import Chat from './components/Chat.vue'
import Dashboard from './components/Dashboard.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/chat/:nickname/:roomid/:roomname',
      name: 'Chat',
      component: Chat,
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
  ]
})
export default router;