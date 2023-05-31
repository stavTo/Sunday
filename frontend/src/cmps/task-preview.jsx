import { useSelector } from 'react-redux'
import { LabelPicker } from './task-cmps/label-picker'
import { TaskTitle } from './task-cmps/task-title'
import { DatePicker } from './task-cmps/date-picker'
import { MemberPicker } from './task-cmps/member-picker'

export function TaskPreview({ task }) {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	return (
		<ul className="task-preview clean-list" style={{ border: '1px solid black' }}>
			<TaskTitle task={task} />
			{board.cmpsOrder.map((cmpName, idx) => {
				switch (cmpName) {
					case 'status-picker':
					case 'priority-picker':
						return <LabelPicker key={idx} type={cmpName} task={task} />
					case 'date-picker':
						return <DatePicker key={idx} task={task} />
					case 'owner-picker':
					case 'collaborator-picker':
						return <MemberPicker type={cmpName} key={idx} task={task} />
				}
			})}
		</ul>
	)
}
