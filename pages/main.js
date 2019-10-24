import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import Ea from 'easy-admin-framework'
//引入Easyadmin依赖
import 'easy-admin-framework/lib/veasyadmin.css'
//引入Easyadmin样式
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(elementUI)
Vue.use(Ea)
// document.title = 'easy-admin'
// 加载全部svg
const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context('./assets/icons/svg', true, /\.svg$/);
requireAll(req);
//引入路由配置文件
let routerList = require('./router.json')
//菜单根据路由配置生成
global.menu = routerList.routerList
//复制一份作为路由数据
let Routerdata = JSON.parse(JSON.stringify(routerList))
//根据路由配置中component路径字段引入组件
function setLayer(obj) {
    return obj.map(e => {
        let a = e
        let path = a.component
        a.component = () =>
            import(`./views/${path}`)
        if ('children' in e) {
            a.children = setLayer(e.children)
        }
        return a
    })
}
setLayer(Routerdata.routerList)
//将路由数据传入Ea.RouterSet方法，返回路由实例
let router = Ea.RouterSet(Routerdata)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')