/*
 * @Descripttion: your project
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-07 15:35:03
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-24 15:03:17
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '../store'

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/new'
    },
    {
      path: '/login',
      component: () => import('../views/login/index.vue')
    },
    {
      path: '/login/github',
      component: () => import('../views/login/github.vue')
    },
    {
      path: '/login/gitee',
      component: () => import('../views/login/gitee.vue')
    },
    {
      path: '/new',
      component: () => import('../views/create.vue')
    },
    {
      path: '/manage',
      redirect: '/manage/list',
      component: () => import('../views/manage/index.vue'),
      children: [
        {
          path: 'list',
          component: () => import('../views/manage/manage.vue')
        },
        {
          path: '/manage/:id',
          component: () => import('../views/manage/edit.vue')
        }
      ]
    },
    {
      path: '/lang',
      component: () => import('../views/lang.vue')
    }
  ]
})

router.beforeEach((form, to, next) => {
  const store = useStore()
  const noAuths = ['/login', '/login/gitee', '/home.html']
  if (store.isLogin) {
    if (noAuths.includes(form.path)) {
      next('/new')
      return
    }
    next()
  } else {
    if (noAuths.includes(form.path)) {
      next()
    } else {
      window.location.href = '/home.html'
    }
  }
})

export default router