import Vue from 'vue'
import { Button, Select, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
/* 挂载到vue实例通过this就可调用 */
Vue.prototype.$message = Message
