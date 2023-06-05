import { useEffect, useState } from 'react'
import { loadBoards } from '../store/board.actions'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
	ICON_BOARD_LIST,
	ICON_OPTIONS,
	ICON_SEARCH_WORKSPACE,
	ICON_FILTER_SEARCHBAR,
	ICON_PLUS,
} from '../assets/icons/icons'

export function WorkspaceBoardList() {
	const [toggleOptions, setToggleOptions] = useState(false)
	const boards = useSelector(({ boardModule }) => boardModule.boards)
	document.title = 'My Boards'

	useEffect(() => {
		onLoadBoards()
	}, [])

	async function onLoadBoards() {
		try {
			await loadBoards()
		} catch {
			console.log("couldn't load boards")
		}
	}

	return (
		<section className="board-list">
			<div className="board-list-header flex column">
				<div className="workspace-title flex row align-center justify-center">
					<h4>Main workspace</h4>
				</div>
				<div className="searchbox-container flex space-between stretch p-1em">
					<div className="searchbox-wrapper flex align-center">
						{ICON_SEARCH_WORKSPACE}
						<input autoFocus className="board-searchbox" placeholder="Search" type="text"></input>
						{ICON_FILTER_SEARCHBAR}
					</div>
					<div className="add-btn">{ICON_PLUS}</div>
				</div>
			</div>
			<ul className="board-list clean-list flex column">
				{boards.map(board => (
					<li className="board-title-preview flex pointer" key={board._id}>
						{/* onMouseEnter={() => setToggleOptions(true)}
						onMouseLeave={() => setToggleOptions(false)} */}
						<Link to={`/boards/${board._id}`}>
							<span>
								{ICON_BOARD_LIST}
								{board.title}
							</span>
						</Link>
						{/* {toggleOptions && */}
						<span className="options">{ICON_OPTIONS}</span>
						{/* } */}
					</li>
				))}
			</ul>
		</section>
	)
}
