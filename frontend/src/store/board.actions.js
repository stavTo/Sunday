import { boardService } from '../services/board.service.local'
import { ADD_BOARD, REMOVE_BOARD, SET_BOARDS, UPDATE_BOARD } from './board.reducer'
import { store } from './store'

export async function loadBoards() {
	try {
		const boards = await boardService.query()
		store.dispatch({ type: SET_BOARDS, boards })
	} catch (err) {
		console.log('Cannot load boards')
		throw err
	}
}

export async function removeBoard(boardId) {
	try {
		await boardService.remove(boardId)
		store.dispatch({ type: REMOVE_BOARD, boardId })
	} catch (err) {
		console.log('Cannot remove board')
		throw err
	}
}

export async function addBoard(board) {
	try {
		const newBoard = await boardService.addBoard(board)
		store.dispatch({ type: ADD_BOARD, board: newBoard })
	} catch (err) {
		console.log('Cannot add board')
		throw err
	}
}

export async function updateBoard(board) {
	try {
		const newBoard = await boardService.save(board)
		store.dispatch({ type: UPDATE_BOARD, board: newBoard })
	} catch (err) {
		console.log('cannot update board')
		throw err
	}
}

// commit(ACTION) // dispatch(ACTION)
