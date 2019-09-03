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
    name: '用户',
    component: () => import('@/components/Layout'),
    children: [
      {
        path: 'index',
        name: '表格',
        iconCls:'table',
        meta:{serviceName:"ts-table"},
        component: () => import('@/views/table/index.vue')
      },
      {
        path: 'fieldmanage',
        name: '索引管理',
        type:'hidden',
        meta:{serviceName:"ts-table"},
        component: () => import('@/views/table/fieldmanage.vue')
      },
      {
        path: 'indexmanage',
        name: '字段管理',
        type:'inner',
        meta:{serviceName:"ts-table"},
        component: () => import('@/views/menusmanage/index.vue')
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
