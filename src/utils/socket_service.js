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

	//存储回调函数
	callBackMapping = {}

	//标识是否连接成功了
	connected = false
	//重试次数
	sendRetryCount = 0

	//定义连接服务器的方法
	connect() {
		//连接服务器
		if (!window.WebSocket) {
			return console.log("你的浏览器不支持WebSocket")
		}
		this.ws = new WebSocket('ws://localhost:9998')

		//连接成功事件
		this.ws.onopen = () => {
			console.log("连接服务端成功了")
			this.connected = true
		}

		//连接服务端失败
		this.ws.onclose = () => {
			console.log("连接服务端失败")
			this.connected = true
		}

		//得到服务端发送的数据
		this.ws.onmessage = msg => {
			console.log("从服务端获取到了数据")
			//真正服务端发送过来的原始数据在msg中data子弹
			const recvData = JSON.parse(msg.data)
			const socketType = recvData.socketType
			//判断回调函数是否存在
			if (this.callBackMapping[socketType]) {
				const action = recvData.action
				if (action === 'getData') {
					const realData = JSON.parse(recvData.data)
					this.callBackMapping[socketType].call(this, realData)
				} else if(action === 'fullScreen') {

				} else if(action === 'themeChange') {

				}
			}

		}
	}

	//回调函数的注册
	registerCallBack(socketType, callBack){
		this.callBackMapping[socketType] = callBack
	}

	//取消某一个回调函数
	unRegisterCallBack(socketType) {
		this.callBackMapping[socketType] = null
	}

	//发送数据方法
	send(data) {
		//判断此时此刻是否连接成功
		if (this.connected){
			this.sendRetryCount = 0
			this.ws.send(JSON.stringify(data))
		} else {
			this.sendRetryCount++
			setTimeout(()=>{
				this.send(data)
			},this.sendRetryCount * 500)
		}
	}
}
