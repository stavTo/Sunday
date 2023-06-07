import { boardService } from '../services/board.service.local'
import { showErrorMsg } from '../services/event-bus.service'
import { UPDATE_BOARD } from './board.reducer'
import { SET_BOARD, SET_IS_LOADING, UNDO_SET_BOARD } from './selected-board.reducer'
import { REMOVE_CHECKED_TASK } from './selected-task.reducer'
import { store } from './store'

export async function loadBoard(boardId, filter = {}) {
	!Object.keys(filter).length && store.dispatch({ type: SET_IS_LOADING, isLoading: true })
	try {
		const board = await boardService.getById(boardId, filter)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log(err)
		throw err
	} finally {
		store.dispatch({ type: SET_IS_LOADING, isLoading: false })
	}
}

export async function saveBoard(board) {
	store.dispatch({ type: SET_BOARD, board })
	store.dispatch({ type: UPDATE_BOARD, board })
	try {
		await boardService.save(board)
	} catch (err) {
		console.log('cant save task')
		store.dispatch({ type: UNDO_SET_BOARD })
		throw err
	}
}

/*  This is used for things that need to be saved, but not as importantly (such as cmp width)
	Get this function into a useRef, then call it with the board on ref.current*/
export function saveBoardDebounced(timeout = 300) {
	async function saveOnServer(board) {
		try {
			await boardService.save(board)
		} catch (err) {
			console.log(err)
			store.dispatch({ type: UNDO_SET_BOARD })
			showErrorMsg('Something went wrong')
		}
	}
	let timer
	return board => {
		store.dispatch({ type: SET_BOARD, board })

		clearTimeout(timer)
		timer = setTimeout(() => {
			saveOnServer(board)
		}, timeout)
	}
}

export async function addGroup(boardId, pushToTop = false, activity = '') {
	try {
		const board = await boardService.addGroup(boardId, pushToTop)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log('cant save task')
		throw err
	}
}

export async function duplicateGroup(boardId, group, activity = '') {
	try {
		const board = await boardService.duplicateGroup(boardId, group)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log('cant save task')
		throw err
	}
}

export async function duplicateTask(boardId, group, task, boolean) {
	try {
		const board = await boardService.duplicateTask(boardId, group, task, boolean)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log('cant save task')
		throw err
	}
}

export async function updateLabels(board, labelsName, labels) {
	try {
		const currBoard = await boardService.updateLabels(board, labelsName, labels)
		store.dispatch({ type: SET_BOARD, board: currBoard })
	} catch (err) {
		console.log('cant add new label')
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

export async function removeTask(boardId, taskId) {
	try {
		const board = await boardService.removeTask(boardId, taskId)
		store.dispatch({ type: REMOVE_CHECKED_TASK, taskId })
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

export async function removeGroup(boardId, groupId, activity = '') {
	try {
		const board = await boardService.removeGroup(boardId, groupId, activity)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		console.log('cant remove group')
		throw err
	}
}
