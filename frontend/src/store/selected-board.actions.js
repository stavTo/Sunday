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
