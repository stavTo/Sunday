import { legacy_createStore as createStore, combineReducers } from 'redux'

import { userReducer } from './user.reducer.js'
import { boardReducer } from './board.reducer.js'
import { selectedBoardReducer } from './selected-board.reducer.js'
import { selectedTaskReducer } from './selected-task.reducer.js'

const rootReducer = combineReducers({
	userModule: userReducer,
	boardModule: boardReducer,
	selectedBoardModule: selectedBoardReducer,
	selectedTaskModule: selectedTaskReducer,
})

const middleware = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
	? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
	: undefined
export const store = createStore(rootReducer, middleware)

// store.subscribe(() => {
// 	console.log('**** Store state changed: ****');
// 	console.log('storeState:\n', store.getState());
// 	console.log('*******************************');
// });
