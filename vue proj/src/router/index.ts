import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

import LayoutView from '@/views/LayoutView.vue'
import DynamicView from '@/views/DynamicView.vue'
import WebServicesView from '@/views/WebServicesView.vue'
import AppWebState from '@/views/AppWebState.vue'


Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
 ,
  {
    path: '/tsblockchain',
    name: 'WebServices',
    component: WebServicesView
  }]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
