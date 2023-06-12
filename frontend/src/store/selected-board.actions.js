import { boardService } from '../services/board.service'
import { showErrorMsg } from '../services/event-bus.service'
import { UPDATE_BOARD } from './board.reducer'
import { SET_BOARD, SET_IS_LOADING, UNDO_SET_BOARD } from './selected-board.reducer'
import { REMOVE_CHECKED_TASK, REMOVE_CHECKED_TASKS } from './selected-task.reducer'
import { store } from './store'

export async function loadBoard(boardId, filter = {}) {
	try {
		const board = await boardService.getById(boardId, filter)

		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}

export async function initialLoadBoard(boardId, skipLoading = false) {
	if (!skipLoading) store.dispatch({ type: SET_IS_LOADING, isLoading: true })
	try {
		const board = await boardService.getById(boardId)

		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
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

export async function addGroup(boardId, pushToTop = false) {
	try {
		const board = await boardService.addGroup(boardId, pushToTop)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}

export async function duplicateGroup(boardId, group, action = {}) {
	try {
		const board = await boardService.duplicateGroup(boardId, group, action)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}

export async function duplicateTask(boardId, group, task, boolean, action) {
	try {
		const board = await boardService.duplicateTask(boardId, group, task, boolean, action)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}

export async function updateLabels(board, labelsName, labels, action) {
	try {
		const currBoard = await boardService.updateLabels(board, labelsName, labels, action)
		store.dispatch({ type: SET_BOARD, board: currBoard })
	} catch (err) {
		throw err
	}
}

export async function saveTask(boardId, groupId, task, action = {}) {
	try {
		const board = await boardService.saveTask(boardId, groupId, task, action)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}

export async function addTask(boardId, groupId, task, action = {}) {
	try {
		const board = await boardService.addTask(boardId, groupId, task, action)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}

export async function addTaskToFirstGroup(boardId, action = {}) {
	try {
		const board = await boardService.addTaskToFirstGroup(boardId, action)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}

export async function removeTask(boardId, taskId, action = {}) {
	try {
		const board = await boardService.removeTask(boardId, taskId, action)
		store.dispatch({ type: REMOVE_CHECKED_TASK, taskId })
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}

export async function removeBatchTasks(boardId, taskIds, actions = []) {
	try {
		const board = await boardService.removeBatchTasks(boardId, taskIds, actions)
		store.dispatch({ type: REMOVE_CHECKED_TASKS, taskIds })
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}

export async function updateLabelInTask(boardId, groupId, taskId, labelTaskName, label) {
	try {
		const board = await boardService.updateLabelInTask(boardId, groupId, taskId, labelTaskName, label)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}

export async function updateGroup(boardId, group, action = {}) {
	try {
		const board = await boardService.updateGroup(boardId, group, action)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}

export async function removeGroup(boardId, groupId, action = {}) {
	try {
		const board = await boardService.removeGroup(boardId, groupId, action)
		store.dispatch({ type: SET_BOARD, board })
	} catch (err) {
		throw err
	}
}
