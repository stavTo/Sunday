import { useSelector } from 'react-redux'
import { LabelPicker } from './dynamic-task-cmps/label-picker'
import { TaskTitle } from './dynamic-task-cmps/task-title'
import { OpenCalendar } from './dynamic-task-cmps/date-picker'
import { MemberPicker } from './dynamic-task-cmps/member-picker'

export function TaskPreview({ task, groupId }) {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	return (
		<ul className="task-preview task-row clean-list">
			<TaskTitle groupId={groupId} task={task} />
			{board.cmpsOrder.map(cmp => {
				switch (cmp.cmpName) {
					case 'statusPicker':
					case 'priorityPicker':
						return <LabelPicker key={cmp.id} groupId={groupId} type={cmp.cmpName} task={task} />
					case 'ownerPicker':
					case 'collaboratorPicker':
						return <MemberPicker key={cmp.id} type={cmp.cmpName} groupId={groupId} task={task} />
					case ' datePicker':
						return <DatePicker key={cmp.id} groupId={groupId} task={task} />
					default:
						return null
				}
			})}
		</ul>
	)
}
