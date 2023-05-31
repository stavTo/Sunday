import { userService } from '../services/user.service.js'

export const SET_USER = 'SET_USER'
export const SET_WATCHED_USER = 'SET_WATCHED_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const SET_USERS = 'SET_USERS'
export const SET_SCORE = 'SET_SCORE'

const initialState = {
	count: 10,
	user: userService.getLoggedInUser(),
	users: [],
	watchedUser: null,
}

export function userReducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return { ...state, user: action.user }

		case SET_WATCHED_USER:
			return { ...state, watchedUser: action.user }
		case REMOVE_USER:
			return {
				...state,
				users: state.users.filter(user => user._id !== action.userId),
			}

		case SET_USERS:
			return { ...state, users: action.users }

		case SET_SCORE:
			return { ...state, user: { ...state.user, score: action.score } }
		default:
			return { ...state }
	}
}
