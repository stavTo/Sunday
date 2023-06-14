import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { store } from './store/store'
import { HomePage } from './pages/home-page'
import { BoardDetails } from './pages/board-details'
import { ChangePassword, PersonalInfo, UserDetails } from './pages/user-details'
import { TaskDetails } from './cmps/task-details'
import { UserMsg } from './cmps/user-msg'
import { BoardIndex } from './pages/board-index'
import { Kanban } from './pages/kanban'
import { ActivityDetails } from './cmps/activity-log-cmps/activity-details'
import { LoginSignUp } from './pages/login-signup'
import { PageNotFound } from './pages/page-not-found'

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
							<Route path="/users/:userId" element={<UserDetails />}>
								<Route path="personal_info" element={<PersonalInfo />} />
								<Route path="password" element={<ChangePassword />} />
							</Route>
							<Route path="/boards" element={<BoardIndex />} />
							<Route path="/auth">
								<Route path="login" element={<LoginSignUp />} />
								<Route path="sign-up" element={<LoginSignUp />} />
							</Route>
							<Route path="*" element={<PageNotFound />} />
						</Routes>
					</main>
					<UserMsg />
				</Router>
			</Provider>
		</div>
	)
}

export default App
