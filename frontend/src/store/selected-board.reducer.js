import { boardService } from '../services/board.service.local'

export const SET_BOARD = 'SET_BOARD'
export const SET_IS_LOADING_BOARD = 'SET_IS_LOADING_BOARD'
export const SET_IS_MODAL_OPEN = 'SET_IS_MODAL_OPEN'

const initialState = {
	selectedBoard: boardService.getEmptyBoard(),
	isLoadingBoard: false,
	isModalOpen: false,
}

export function selectedBoardReducer(state = initialState, action) {
	switch (action.type) {
		case SET_BOARD:
			return { ...state, selectedBoard: action.board }
		case SET_IS_LOADING_BOARD:
			return { ...state, isLoadingBoard: action.isLoading }
		case SET_IS_MODAL_OPEN:
			return { ...state, isModalOpen: action.isModalOpen }

		default:
			return { ...state }
	}
}
