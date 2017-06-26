import 'lib-flexible'
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router/index'
import store from './store/index'
import LoadingPlugin from '../src/plugins/loading/index.js'
import ConfirmPlugin from '../src/plugins/confirm/index.js'
import ToastPlugin from '../src/plugins/toast/index.js'
import '../static/css/ionicons.min.css'
/*判断 iphone or android 添加class*/
const isIPhone = window.navigator.appVersion.match(/iphone/gi);
if (isIPhone) {
  document.body.className = 'is-iPhone'
} else {
  document.body.className = 'is-android'
}
Vue.use(VueRouter)
let router = new VueRouter({
  routes
})
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
const FastClick = require('fastclick')
FastClick.attach(document.body)

