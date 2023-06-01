import { boardService } from '../services/board.service.local'
import { SET_BOARD } from './selected-board.reducer'
import { store } from './store'

export async function loadBoard(boardId) {
	console.log(boardId)
	try {
		const board = await boardService.getById(boardId)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log(err)
		throw err
	}
}

export async function saveTask(boardId, groupId, task, activity = '') {
	try {
		const board = await boardService.saveTask(boardId, groupId, task, activity)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log('cant save task')
		throw err
	}
}
