import { boardService } from '../services/board.service.local'

export const SET_BOARD = 'SET_BOARD'

const initialState = {
	selectedBoard: boardService.getEmptyBoard(),
	//TODO MAKE THIS FIRST BOARD IN LIST
}

export function selectedBoardReducer(state = initialState, action) {
	switch (action.type) {
		case SET_BOARD:
			return { ...state, selectedBoard: action.board }
		default:
			return { ...state }
	}
}
