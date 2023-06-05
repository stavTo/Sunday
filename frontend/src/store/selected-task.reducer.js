export const SET_CHECKED_TASKS = 'SET_CHECKED_TASKS'
export const ADD_CHECKED_TASK = 'ADD_CHECKED_TASK'
export const ADD_CHECKED_TASKS = 'ADD_CHECKED_TASKS'
export const REMOVE_CHECKED_TASK = 'REMOVE_CHECKED_TASK'
export const REMOVE_CHECKED_TASKS = 'REMOVE_CHECKED_TASKS'
export const TOGGLE_CHECKED_TASK = 'TOGGLE_CHECKED_TASK'

const initialState = {
	checkedTaskIds: [],
}

export function selectedTaskReducer(state = initialState, action) {
	let newCheckedTaskIds
	switch (action.type) {
		case SET_CHECKED_TASKS:
			return { ...state, checkedTaskIds: action.taskIds }
		case ADD_CHECKED_TASK:
			newCheckedTaskIds = Array.from(new Set([...state.checkedTaskIds, action.taskId]))
			return { ...state, checkedTaskIds: newCheckedTaskIds }
		case ADD_CHECKED_TASKS:
			newCheckedTaskIds = Array.from(new Set([...state.checkedTaskIds, ...action.taskIds]))
			return { ...state, checkedTaskIds: newCheckedTaskIds }
		case REMOVE_CHECKED_TASK:
			newCheckedTaskIds = state.checkedTaskIds.filter(taskId => taskId !== action.taskId)
			return { ...state, checkedTaskIds: newCheckedTaskIds }
		case REMOVE_CHECKED_TASKS:
			newCheckedTaskIds = state.checkedTaskIds.filter(taskId => !action.taskIds.includes(taskId))
			return { ...state, checkedTaskIds: newCheckedTaskIds }
		case TOGGLE_CHECKED_TASK:
			if (state.checkedTaskIds.includes(action.taskId)) {
				newCheckedTaskIds = state.checkedTaskIds.filter(taskId => taskId !== action.taskId)
			} else {
				newCheckedTaskIds = [...state.checkedTaskIds, action.taskId]
			}
			return { ...state, checkedTaskIds: newCheckedTaskIds }
		default:
			return { ...state }
	}
}
