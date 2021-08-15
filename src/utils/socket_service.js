export default class SocketService {
	/*
	* 单例
	* */

	static instance = null
	static get Instance() {
		if (!this.instance) {
			this.instance = new SocketService()
		}
		return this.instance
	}

	//和服务端连接的socket对象
	ws = null

	//定义连接服务器的方法
	connect() {
		//连接服务器
		if (window.WebSocket) {
			return console.log("你的浏览器不支持WebSocket")
		}
		this.ws = new WebSocket('ws://localhost:9998')
	}
}
