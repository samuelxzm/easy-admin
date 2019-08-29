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
    path: '/',
    name: '用户',
    component: () => import('@/components/Layout'),
    children: [
      {
        path: 'table',
        name: '表格',
        meta:{serviceName:"ts-table"},
        component: () => import('@/views/table/index.vue')
      },
      {
        path: 'fieldmanage',
        name: '索引管理',
        meta:{serviceName:"ts-table"},
        component: () => import('@/views/table/fieldmanage.vue')
      },
      {
        path: 'indexmanage',
        name: '字段管理',
        meta:{serviceName:"ts-table"},
        component: () => import('@/views/table/indexmanage.vue')
      }
    ]
  }
]
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
global.antRouter=[]
const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

export default router
