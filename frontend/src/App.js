import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { store } from './store/store'
import { HomePage } from './pages/home-page'
import { BoardDetails } from './pages/board-details'
import { SideBar } from './cmps/side-bar'
import { UserDetails } from './pages/user-details'
import { TaskDetails } from './cmps/task-details'
import { UserMsg } from './cmps/user-msg'
function App() {
	return (
		<div className="App">
			<Provider store={store}>
				<Router>
					<SideBar />
					<main>
						<Routes>
							<Route path="/" element={<HomePage />}></Route>
							<Route path="/boards/:boardId" element={<BoardDetails />}>
								<Route path="pulses/:taskId" element={<TaskDetails />} />
							</Route>
							<Route path="/users/:userId" element={<UserDetails />}></Route>
						</Routes>
					</main>
					<UserMsg />
				</Router>
			</Provider>
		</div>
	)
}

export default App
