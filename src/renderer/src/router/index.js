import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'search',
    component: () => import('../views/SearchView.vue'),
    meta:{ keepAlive: true}
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
    meta:{ keepAlive: true}
  },
  {
    path: '/list',
    name: 'list',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ListView.vue'),
    meta:{ keepAlive: true}
  }
]

const index = createRouter({
  history: createWebHashHistory(),
  routes
})

export default index
