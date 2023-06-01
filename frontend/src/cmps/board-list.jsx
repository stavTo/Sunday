import { useSelector } from 'react-redux'
import { loadBoards } from '../store/board.actions'
import { ICON_BOARD_LIST, ICON_OPTIONS } from '../assets/icons/icons'

loadBoards()

export function BoardList({ isHovered, isFixed }) {
	const { boards } = useSelector(storeState => storeState.boardModule)
	return (
		<>
			<div className="board-list-header flex column align-center space-evenly">
				<div className="workspace-title flex row align-center space-between">
					<h4>Main workspace</h4>{ICON_OPTIONS}
				</div>
				<input type="text"></input>
			</div>
			<ul className="board-list clean-list flex column">
				{boards.map(board => (
					<li className="board-title-preview flex" key={board._id}>
						{ICON_BOARD_LIST}{board.title}{ICON_OPTIONS}
					</li>
				))}
			</ul>
		</>
	)
}
