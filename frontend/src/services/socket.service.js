import io from 'socket.io-client'
// import { userService } from './user.service'

// BOARD
export const SOCKET_EVENT_LOAD_BOARD = 'load-board'
export const SOCKET_EMIT_SEND_BOARD = 'send-board'

// Task comments
export const SOCKET_EVENT_ADD_TASK_MSG = 'task-add-msg'
export const SOCKET_EMIT_SEND_MSG = 'task-send-msg'
export const SOCKET_EMIT_SET_TASK = 'task-set-topic'

// Add task
// export const SOCKET_EVENT_ADD_TASK = 'group-add-task'
export const SOCKET_EMIT_SET_GROUP = 'set-group'

export const SOCKET_EMIT_USER_WATCH = 'user-watch'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EVENT_REVIEW_ADDED = 'review-added'
export const SOCKET_EVENT_REVIEW_ABOUT_YOU = 'review-about-you'

// const SOCKET_EMIT_LOGIN = 'set-user-socket'
// const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = process.env.NODE_ENV === 'production' ? '' : '//localhost:3030'
export const socketService = createSocketService()
// export const socketService = createDummySocketService()

// for debugging from console
window.socketService = socketService

socketService.setup()

function createSocketService() {
	var socket = null
	const socketService = {
		setup() {
			socket = io(baseUrl)
			// const user = userService.getLoggedInUser()
			// if (user) this.login(user._id)
		},
		on(eventName, cb) {
			socket.on(eventName, cb)
		},
		off(eventName, cb = null) {
			if (!socket) return
			if (!cb) socket.removeAllListeners(eventName)
			else socket.off(eventName, cb)
		},
		emit(eventName, data) {
			socket.emit(eventName, data)
		},
		// login(userId) {
		// 	socket.emit(SOCKET_EMIT_LOGIN, userId)
		// },
		// logout() {
		// 	socket.emit(SOCKET_EMIT_LOGOUT)
		// },
		terminate() {
			socket = null
		},
	}
	return socketService
}
