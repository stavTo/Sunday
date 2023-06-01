import { useSelector } from 'react-redux'
import { loadBoards } from '../store/board.actions'
import { ICON_BOARD_LIST, ICON_OPTIONS } from '../assets/icons/icons'

loadBoards()

export function BoardList({ isHovered, isFixed }) {
	const { boards } = useSelector(storeState => storeState.boardModule)
	return (
		<ul className="board-list clean-list flex column">
			{boards.map(board => (
				<li className="board-title-preview flex" key={board._id}>
					{ICON_BOARD_LIST}{board.title}{ICON_OPTIONS}
				</li>
			))}
		</ul>
	)
}
