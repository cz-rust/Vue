import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import './assets/global.css'
import './assets/fonts/iconfont.css'
/* 导入模块 */
import axios from 'axios'
/* 配置请求跟路劲 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/* 在vue原型中挂载axios */
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
