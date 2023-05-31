import { useSelector } from 'react-redux'
import { loadBoards } from '../store/board.actions'
loadBoards()
export function BoardList() {
	const { boards } = useSelector(storeState => storeState.boardModule)
	return (
		<ul className="board-list clean-list">
			{boards.map(board => (
				<li key={board._id}>{board.title}</li>
			))}
		</ul>
	)
}
