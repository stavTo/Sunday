import { useState } from 'react'
import { ICON_HOUSE } from '../assets/icons/icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function BoardToolbar() {
	const [activeTab, setActiveTab] = useState('main')
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const currWindow = window.location.href
	return (
		<ul className="clean-list flex board-nav-bar board-toolbar">
			<li className={` ${!currWindow.includes('/kanban') ? 'active-page' : ''}`}>
				<Link className="btn-primary" to={`/boards/${board._id}`}>
					<span>{ICON_HOUSE} Main Table</span>
				</Link>
			</li>
			<li className={` ${currWindow.includes('/kanban') ? 'active-page' : ''}`}>
				<Link className="btn-primary" to={`/boards/${board._id}/views/kanban`}>
					<span>Kanban</span>
				</Link>
			</li>
		</ul>
	)
}
