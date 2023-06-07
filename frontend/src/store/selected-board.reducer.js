import { boardService } from '../services/board.service'

export const SET_BOARD = 'SET_BOARD'
export const UNDO_SET_BOARD = 'UNDO_SET_BOARD'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
	selectedBoard: boardService.getEmptyBoard(),
	lastBoardState: null,
	isLoading: false,
}

export function selectedBoardReducer(state = initialState, action) {
	switch (action.type) {
		case SET_BOARD:
			const lastBoardState = state.selectedBoard
			return { ...state, selectedBoard: action.board, lastBoardState }
		case UNDO_SET_BOARD:
			if (state.lastBoardState) {
				return { ...state, selectedBoard: state.lastBoardState, lastBoardState: null }
			}
			return { ...state }
		case SET_IS_LOADING:
			return { ...state, isLoading: action.isLoading }

		default:
			return { ...state }
	}
}
