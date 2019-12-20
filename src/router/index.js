import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import home from '../components/Home.vue'
import welcome from '../components/Welcome.vue'
import users from '../components/users/Users.vue'

Vue.use(VueRouter)
/* const routes = [

] */

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: welcome },
        { path: '/users', component: users }
      ]
    }
  ]
})
/* 路由导航守卫 to表示跳转的页面，from表示从来个页面跳转，next表示跳转地址或者放行 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const taktoken = window.sessionStorage.getItem('token')
  if (!taktoken) return next('/login')
  next()
})

export default router
