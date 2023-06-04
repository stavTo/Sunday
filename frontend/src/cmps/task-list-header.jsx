import { useSelector } from 'react-redux'
import { TaskSelection } from './task-selection'

export function TaskListHeader({ task, group }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	return (
		<ul
			className="task-list-header task-row clean-list"
			style={{ borderInlineStart: `6px solid ${group.style.color}` }}
		>
			<TaskSelection />
			<li className="task-title-header">Task</li>
			{board.cmpsOrder.map((cmp, idx) => {
				let cmpTitle
				switch (cmp.cmpName) {
					case 'statusPicker':
						cmpTitle = 'Status'
						break
					case 'priorityPicker':
						cmpTitle = 'Priority'
						break
					case 'ownerPicker':
						cmpTitle = 'Owner'
						break
					case 'collaboratorPicker':
						cmpTitle = 'Collaborators'
						break
					case 'datePicker':
						cmpTitle = 'Date'
						break
					case 'timelinePicker':
						cmpTitle = 'Timeline'
						break
				}
				return cmpTitle && <li key={cmp.id}>{cmpTitle}</li>
			})}
		</ul>
	)
}
