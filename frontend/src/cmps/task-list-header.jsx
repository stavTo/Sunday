import { useSelector } from 'react-redux'
import { TaskSelection } from './task-selection'
import { useDispatch } from 'react-redux'
import { REMOVE_CHECKED_TASKS, ADD_CHECKED_TASKS } from '../store/selected-task.reducer'

export function TaskListHeader({ task, group, isGroupSelected, setIsGroupSelected }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const dispatch = useDispatch()

	function toggleGroupChecked() {
		const taskIds = group.tasks.map(task => task.id)
		if (isGroupSelected) {
			setIsGroupSelected(false)
			dispatch({ type: REMOVE_CHECKED_TASKS, taskIds })
		} else {
			setIsGroupSelected(true)
			dispatch({ type: ADD_CHECKED_TASKS, taskIds })
		}
	}
	return (
		<ul
			className="task-list-header task-row clean-list"
			style={{ borderInlineStart: `6px solid ${group.style.color}` }}
		>
			<TaskSelection isChecked={isGroupSelected} onCheck={toggleGroupChecked} />
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
