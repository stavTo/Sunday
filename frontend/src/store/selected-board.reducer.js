import { boardService } from '../services/board.service.local'

export const SET_BOARD = 'SET_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
// export const ADD_TASK = 'ADD_TASK'
// export const UPDATE_TASK = 'UPDATE_TASK'
// export const REMOVE_TASK = 'REMOVE_TASK'
// export const ADD_GROUP = 'ADD_GROUP'
// export const UPDATE_GROUP = 'UPDATE_GROUP'
// export const REMOVE_GROUP = 'REMOVE_GROUP'

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
