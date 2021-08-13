import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from "@/views/SellerPage"
import TrendPage from "@/views/TrendPage";
import MapPage from "@/views/MapPage";
import trankPage from "@/views/trankPage";
import HotPage from "@/views/HotPage";
import StoxkPage from "@/views/StoxkPage";

Vue.use(VueRouter)

const routes = [
	{
		path:'/sellerpage',
		component:SellerPage
	},
	{
		path:'/trendpage',
		component: TrendPage
	},
	{
		path:'/mappage',
		component: MapPage
	},
	{
		path: '/rankpage',
		component: trankPage
	},
	{
		path: '/hotpage',
		component: HotPage
	},
	{
		path: '/stockpage',
		component: StoxkPage
	}
]

const router = new VueRouter({
  routes
})

export default router
