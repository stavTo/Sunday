import { ICON_HOUSE } from '../assets/icons/icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function BoardToolbar() {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const navigate = useNavigate()
	const currWindow = window.location.href

	function onNavigate(navigateTo) {
		navigate(navigateTo, { state: true })
	}

	return (
		<ul className="clean-list flex board-nav-bar board-toolbar ">
			<li
				onClick={() => onNavigate(`/boards/${board._id}`)}
				className={` ${!currWindow.includes('/kanban') ? 'active-page' : ''}`}
			>
				<div className="btn-primary">
					<span>{ICON_HOUSE} Main Table</span>
				</div>
			</li>
			<li
				onClick={() => onNavigate(`/boards/${board._id}/views/kanban`)}
				className={` ${currWindow.includes('/kanban') ? 'active-page' : ''}`}
			>
				<div className="btn-primary">
					<span>Kanban</span>
				</div>
			</li>
		</ul>
	)
}
