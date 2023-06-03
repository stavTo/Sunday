import { useSelector } from 'react-redux'
import { TaskSelection } from './task-selection'

export function TaskListHeader({ task, group }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	return (
		<ul
			className="task-list-header task-row clean-list"
			style={{ borderInlineStart: `6px solid ${group.style.color}` }}>
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
				return cmpTitle && <li key={cmp.id}>{cmpTitle}</li> //if not in switch case don't render
			})}
		</ul>
	)
}
