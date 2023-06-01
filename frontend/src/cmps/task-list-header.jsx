import { useSelector } from 'react-redux'

export function TaskListHeader({ task, groupId }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	return (
		<ul className="task-list-header task-row clean-list">
			<li>Task</li>
			{board.cmpsOrder.map(cmp => (
				<li key={cmp.id}>{cmp.cmpName}</li>
			))}
		</ul>
	)
}
