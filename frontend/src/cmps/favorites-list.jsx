import { useEffect } from 'react'
import { loadBoards, removeBoard } from '../store/board.actions'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { ICON_BOARD_LIST, ICON_STAR_STARRED, ICON_TRASH } from '../assets/icons/icons'

import imgNoFavorites from '../assets/img/favorites-no-bg.gif'
import { showErrorMsg } from '../services/event-bus.service'

export function FavoritesList() {
	const boards = useSelector(({ boardModule }) => boardModule.boards)
	const selectedBoard = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	useEffect(() => {
		onLoadBoards()
	}, [])

	async function onLoadBoards() {
		try {
			await loadBoards()
		} catch {
			showErrorMsg("Can't Load Boards")
		}
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
				<div className="favorites-title">
					<h4 className="icon-star">{ICON_STAR_STARRED}</h4>
					<h4>Favorites</h4>
				</div>
			</div>
			<div className="separator"></div>
			{!!boards.filter(b => b.isStarred).length ? (
				<ul className="board-list clean-list flex column">
					{boards.map(board => {
						if (board.isStarred) {
							return (
								<Link key={board._id} to={`/boards/${board._id}`}>
									<li
										className={`board-title-preview flex pointer btn-primary ${
											board._id === selectedBoard._id ? 'active' : ''
										}`}
									>
										<div className="board-name-container">
											{ICON_BOARD_LIST}
											<span>{board.title}</span>
										</div>
										<span
											className="delete-board-icon"
											onClick={ev => onDeleteBoard(ev, board._id)}
										>
											{ICON_TRASH}
										</span>
									</li>
								</Link>
							)
						}
						return
					})}
				</ul>
			) : (
				<div className="empty-favorites">
					<img src={imgNoFavorites} alt="" />
					<span>No favorite boards yet</span>
					<p>"Star" any board so what you can easily access it later</p>
				</div>
			)}
		</section>
	)
}
