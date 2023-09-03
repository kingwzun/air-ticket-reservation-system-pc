import Vue from 'vue'
import VueRouter from 'vue-router'
import IndexView from '../views/index.vue'
import {Message} from 'element-ui';
import login from '../views/login.vue';
import statistics from '../views/charts/statistics.vue';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '',
    component: login,
    hidden: true,
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/index',
    name: '首页',
    component: IndexView,
    iconCls: 'el-icon-tickets',
    children: [{
      path: '/charts/statistics',
      name: '数据可视化',
      component: statistics,
      meta: {
        requireAuth: true
      }
    },{
      path: '/person/employee',
      name: 'employee',
      component: () => import('../views/person/employee.vue')
    },{
      path: '/person/agent',
      name: 'agent',
      component: () => import('../views/person/agent.vue')
    },{
      path: '/person/user',
      name: 'user',
      component: () => import('../views/person/user.vue')
    },{
        path: '/person/vip',
        name: 'user',
        component: () => import('../views/person/vip.vue')
      },{
      path: '/fly/airport',
      name: 'airport',
      component: () => import('../views/fly/airport.vue')
    },{
      path: '/fly/airway',
      name: 'airway',
      component: () => import('../views/fly/airway.vue')
    },{
      path: '/fly/flight',
      name: 'flight',
      component: () => import('../views/fly/flight.vue')
    },{
      path: '/order/order',
      name: 'order',
      component: () => import('../views/order/order.vue')
    },{
      path: '/plane/planeMsg',
      name: 'planeMsg',
      component: () => import('../views/plane/planeMsg.vue')
    },{
      path: '/plane/planeType',
      name: 'planeType',
      component: () => import('../views/plane/planeType')
    },{
      path: '/baggage/baggage',
      name: 'baggage',
      component: () => import('../views/order/baggage.vue')
    },{
      path: '/announcement/announcement',
      name: 'announcement',
      component: () => import('../views/announcement/announcement.vue')
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/reg') {
    return next()
  } else {
    let user = sessionStorage.getItem('token')
    if (user != null) {
      //校验token
      return next()
    } else {
      Message.error('用户未登录')
      return next('/')
    }
  }
})
export default router
