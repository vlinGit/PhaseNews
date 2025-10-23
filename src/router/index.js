import { createRouter, createWebHistory } from 'vue-router'
import { gsap } from 'gsap'
import Flip from "gsap/Flip"
import Draggable from "gsap/Draggable"

gsap.registerPlugin(Flip, Draggable)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/home/home.vue')
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => import('../views/article/index.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/about/index.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/contact/index.vue')
    }
  ],
})

router.beforeEach((to,from) => {
  requestAnimationFrame(() => {
    const page = document.querySelector('.routerClass')
    if (page) {
      gsap.fromTo(page, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
    }
  })
})

export default router
