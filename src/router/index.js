import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '../views/Dashboard'
import Browser from '../views/Browser'
import Geolocalization from '../views/Geolocalization'
import Request from '../views/Request'
import Status from '../views/Status'
import Robot from '../views/Robot'
import FAQ from '../views/FAQ'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'oui-sidebar-link_active',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Dashboard
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/browser',
      name: 'Browser',
      component: Browser
    },
    {
      path: '/geolocalization',
      name: 'Geolocalization',
      component: Geolocalization
    },
    {
      path: '/request',
      name: 'Request',
      component: Request
    },
    {
      path: '/robot',
      name: 'Robot',
      component: Robot
    },
    {
      path: '/status',
      name: 'Status',
      component: Status
    },
    {
      path: '/faq',
      name: 'FAQ',
      component: FAQ
    }
  ]
})
