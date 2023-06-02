import { useSelector } from 'react-redux'
import { loadBoards } from '../store/board.actions'
import {
	ICON_BOARD_LIST,
	ICON_OPTIONS,
	ICON_SEARCH_WORKSPACE,
	ICON_FILTER_SEARCHBAR,
	ICON_PLUS,
} from '../assets/icons/icons'

loadBoards()

export function BoardList() {
	const { boards } = useSelector(storeState => storeState.boardModule)
	return (
		<section className="board-list">
			<div className="board-list-header flex column">
				<div className="workspace-title flex row align-center space-between">
					<h4>Main workspace</h4>
					{ICON_OPTIONS}
				</div>
				<div className="searchbox-container flex space-between stretch">
					<div className="searchbox-wrapper flex align-center">
						{ICON_SEARCH_WORKSPACE}
						<input className="board-searchbox" placeholder="Search" type="text"></input>
						{ICON_FILTER_SEARCHBAR}
					</div>
					<div className="add-btn">{ICON_PLUS}</div>
				</div>
			</div>
			<ul className="board-list clean-list flex column">
				{boards.map(board => (
					<li className="board-title-preview flex" key={board._id}>
						{ICON_BOARD_LIST}
						{board.title}
						{ICON_OPTIONS}
					</li>
				))}
			</ul>
		</section>
	)
}
