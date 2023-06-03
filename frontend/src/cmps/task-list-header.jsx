import { useSelector } from 'react-redux'
import { TaskSelection } from './task-selection'

export function TaskListHeader({ task, groupId }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	return (
		<ul className="task-list-header task-row clean-list">
			<TaskSelection />
			<li>Task</li>
			{board.cmpsOrder.map(cmp => {
				let cmpTitle
				switch (cmp.cmpName) {
					case 'statusPicker':
						cmpTitle = 'Status'
						break
					case 'priorityPicker':
						cmpTitle = 'Priority'
						break
					case 'ownerPicker':
						cmpTitle = 'owner'
						break
					case 'collaboratorPicker':
						cmpTitle = 'collaborators'
						break
					case 'datePicker':
						cmpTitle = 'Timeline'
						break
				}
				return <li key={cmp.id}>{cmpTitle}</li>
			})}
		</ul>
	)
}
