import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios"
import store from './store'
//引入全局样式文件
import './assets/css/global.less'

axios.defaults.baseURL = 'http://127.0.0.1:8008/api/'

Vue.config.productionTip = false
Vue.prototype.$echarts = window.echarts
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
