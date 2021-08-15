import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios"
import store from './store'
//引入全局样式文件
import './assets/css/global.less'
import './assets/font/iconfont.css'
import SocketService from "@/utils/socket_service";

axios.defaults.baseURL = 'http://127.0.0.1:8008/api/'
//对服务端进行websocket的连接
SocketService.Instance.connect()
Vue.config.productionTip = false
Vue.prototype.$echarts = window.echarts
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
