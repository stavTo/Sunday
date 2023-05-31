export const SET_BOARDS = 'SET_BOARDS'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'

const initialState = {
	boards: [],
}

export function boardReducer(state = initialState, action) {
	let newBoards
	switch (action.type) {
		case SET_BOARDS:
			return { ...state, boards: action.boards }
		case REMOVE_BOARD:
			newBoards = state.boards.filter(board => board._id !== action.boardId)
			return { ...state, boards: newBoards }
		case ADD_BOARD:
			newBoards = [...state.boards, action.board]
			return { ...state, boards: newBoards }
		case UPDATE_BOARD:
			newBoards = state.boards.map(board => (board._id === action.board._id ? action.board : board))
			return { ...state, boards: newBoards }
		default:
			return { ...state }
	}
}
