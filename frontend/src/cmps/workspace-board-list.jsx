import { useEffect } from 'react'
import { addBoard, loadBoards, removeBoard } from '../store/board.actions'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
	ICON_BOARD_LIST,
	ICON_SEARCH_WORKSPACE,
	ICON_FILTER_SEARCHBAR,
	ICON_PLUS,
	ICON_TRASH,
	ICON_HOUSE_FILLED,
} from '../assets/icons/icons'
import { boardService } from '../services/board.service'
import { showErrorMsg } from '../services/event-bus.service'

export function WorkspaceBoardList() {
	const boards = useSelector(({ boardModule }) => boardModule.boards)
	const selectedBoard = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	useEffect(() => {
		onLoadBoards()
	}, [])

	async function onLoadBoards() {
		try {
			await loadBoards()
		} catch {
			showErrorMsg('Cant load boards')
		}
	}

	function onAddNewBoard() {
		const board = boardService.getNewBoard()
		addBoard(board)
	}

	function onDeleteBoard(ev, boardId) {
		ev.preventDefault() //stops opening link when deleting
		if (boards.length === 1) return showErrorMsg('Cant delete last board')
		if (boardId === selectedBoard._id) return showErrorMsg('Cant delete opened board')
		removeBoard(boardId)
	}

	return (
		<section className="workspace-board-list">
			<div className="board-list-header flex column">
				<div className="workspace-title flex align-center">
					<span className="workspace-icon">
						M <span className="house-icon">{ICON_HOUSE_FILLED}</span>
					</span>
					<h4>Main workspace</h4>
				</div>
				<div className="searchbox-container flex space-between stretch p-1em">
					<div className="searchbox-wrapper flex align-center">
						{ICON_SEARCH_WORKSPACE}
						<input autoFocus className="board-searchbox" placeholder="Search" type="text"></input>
						{ICON_FILTER_SEARCHBAR}
					</div>
					<div className="add-btn" onClick={onAddNewBoard}>
						{ICON_PLUS}
					</div>
				</div>
			</div>
			<ul className="board-list clean-list flex column">
				{boards.map(board => (
					<Link key={board._id} to={`/boards/${board._id}`}>
						<li
							className={`board-title-preview flex pointer btn-primary ${
								board._id === selectedBoard._id ? 'active' : ''
							}`}
						>
							<div className="board-name-container">
								{ICON_BOARD_LIST}
								<div className="board-name">{board.title}</div>
							</div>

							<span className="delete-board-icon" onClick={ev => onDeleteBoard(ev, board._id)}>
								{ICON_TRASH}
							</span>
						</li>
					</Link>
				))}
			</ul>
		</section>
	)
}
