import { boardService } from '../services/board.service.local'
import { SET_BOARD, SET_IS_LOADING_BOARD } from './selected-board.reducer'
import { store } from './store'

export async function loadBoard(boardId, filter = {}) {
	!filter && store.dispatch({ type: SET_IS_LOADING_BOARD, isLoading: true })
	try {
		const board = await boardService.getById(boardId, filter)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log(err)
		throw err
	} finally {
		store.dispatch({ type: SET_IS_LOADING_BOARD, isLoading: false })
	}
}

export async function addEmptyGroup(boardId, pushToTop = false, activity = '') {
	try {
		const board = await boardService.addEmptyGroup(boardId, pushToTop)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log('cant save task')
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

export async function addTask(boardId, groupId, task, activity = '') {
	try {
		const board = await boardService.addTask(boardId, groupId, task, activity)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log('cant add task')
		throw err
	}
}

export async function addTaskToFirstGroup(boardId, activity = '') {
	try {
		const board = await boardService.addTaskToFirstGroup(boardId, activity)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log('cant add task')
		throw err
	}
}

export async function removeTask(boardId, groupId, taskId, activity = '') {
	try {
		const board = await boardService.removeTask(boardId, groupId, taskId, activity)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log('cant remove task')
		throw err
	}
}

export async function updateLabelInTask(boardId, groupId, taskId, labelTaskName, label) {
	try {
		const board = await boardService.updateLabelInTask(boardId, groupId, taskId, labelTaskName, label)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log('cant remove task')
		throw err
	}
}

export async function updateGroup(boardId, group, activity = '') {
	try {
		const board = await boardService.updateGroup(boardId, group)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log('cant update group')
		throw err
	}
}
