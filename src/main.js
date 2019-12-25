import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import './assets/global.css'
import './assets/fonts/iconfont.css'
import treeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
/* 导入模块 */
import axios from 'axios'
/* 配置请求跟路劲 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/* 为axios拦截器设添加token，在请求头中使用 Authorization字段提供token令牌 */

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')

  return config
})
/* 在vue原型中挂载axios */
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-Table', treeTable)
/* 时间过滤器 */
Vue.filter('dateFormat', function(dt) {
  const t = new Date(dt)
  const y = t.getFullYear()
  const m = (t.getMonth() + 1 + '').padStart(2, '0')
  const d = (t.getDate() + '').padStart(2, '0')
  const h = (t.getHours() + '').padStart(2, '0')
  const f = (t.getMinutes() + '').padStart(2, '0')
  const s = (t.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${f}:${s}`
})
/* 富文本编辑器 */
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
