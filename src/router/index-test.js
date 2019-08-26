import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    name: '登陆',
    component: () => import('@/views/Login')
  },
  {
    path: '/user',
    name: '用户',
    component: () => import('@/views/user/index.vue')
  },
  {
    path: '/table',
    name: '表格',
    component: () => import('@/views/table/index.vue')
  },
  {
    path: '/module',
    name: '模块',
    component: () => import('@/views/module/index.vue')
  }
]
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

export default router
