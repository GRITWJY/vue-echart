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
}
