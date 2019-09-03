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
    path: '/table',
    name: '首页lay',
    component: () => import('@/components/Layout'),
    children: [
      {
        path: 'index',
        name: '首页',
        iconCls:'table',
        meta:{serviceName:"ts-table"},
        component: () => import('@/views/dashboard/index.vue')
      }
    ]
  }
]
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
global.antRouter=constantRoutes
const router = createRouter()

export default router
