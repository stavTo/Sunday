import { useSelector } from 'react-redux'

export function TaskListHeader({ task, groupId }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	console.log(board)
	return (
		<ul className="task-list-header task-row clean-list">
			{board.cmpsOrder.map(cmp => (
				<li key={cmp.id}>{cmp.cmpName}</li>
			))}
		</ul>
	)
}
