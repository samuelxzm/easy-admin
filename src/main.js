import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'normalize.css'
import './icons' // icon
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from '@/store'
import axios from 'axios';
import '@/router/getRouters.js'//这里进行路由后台获取的模拟
Vue.prototype.$axios = axios;

Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
