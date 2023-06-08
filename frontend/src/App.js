import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { store } from './store/store'
import { HomePage } from './pages/home-page'
import { BoardDetails } from './pages/board-details'
import { UserDetails } from './pages/user-details'
import { TaskDetails } from './cmps/task-details'
import { UserMsg } from './cmps/user-msg'
import { BoardIndex } from './pages/board-index'
import { Kanban } from './pages/kanban'
import { ActivityDetails } from './cmps/activity-log-cmps/activity-details'

function App() {
	return (
		<div className="App">
			<Provider store={store}>
				<Router>
					<main>
						<Routes>
							<Route path="/" element={<HomePage />}></Route>
							<Route path="/boards/:boardId" element={<BoardDetails />}>
								<Route path="tasks/:taskId" element={<TaskDetails />} />
								<Route path="activity_log" element={<ActivityDetails />} />
							</Route>
							<Route path="/boards/:boardId/views/kanban" element={<Kanban />}>
								<Route path="tasks/:taskId" element={<TaskDetails />} />
							</Route>
							<Route path="/users/:userId" element={<UserDetails />}></Route>
							<Route path="/index" element={<BoardIndex />}></Route>
						</Routes>
					</main>
					<UserMsg />
				</Router>
			</Provider>
		</div>
	)
}

export default App
