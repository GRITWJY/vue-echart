import Vue from 'vue'
import VueRouter from 'vue-router'
import screen from "@/views/ScreenPage"

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		redirect:'/screen'
	},
	{
		path: '/screen',
		component: screen
	}
]

const router = new VueRouter({
  routes
})

export default router
