import Vue from 'vue'

// Remove the 300ms delay from mobile
import Fastclick from 'fastclick'
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    Fastclick.attach(document.body);
  }, false);
}

// Drag and drop plugin
import { Vue2Dragula } from 'vue2-dragula'
Vue.use(Vue2Dragula, {
  copySortSource: true
})

// Firebase bindings
// TODO: Swap out local storage for Firebase storage
//var VueFire = require('vuefire')
//var Firebase = require('firebase')
//Vue.use(VueFire)

import App from './App.vue'
import Board from './components/Board.vue'

// Init router
import VueRouter from 'vue-router'
Vue.use(VueRouter)

console.log(window.location.pathname);
// Set up possible routes
const routes = [
  { path: '*', exact: true, name: 'board', component: Board },
  //{ path: '/:board', name: 'board', component: Board }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active',
  transitionOnLoad: true,
  root: '/'
})

const app = new Vue({
  router,
  el: '#app',
  render: h => h(App)
})