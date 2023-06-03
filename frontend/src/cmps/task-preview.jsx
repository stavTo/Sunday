import { useSelector } from 'react-redux'
import { LabelPicker } from './dynamic-task-cmps/label-picker'
import { TaskTitle } from './dynamic-task-cmps/task-title'
import { DatePicker } from './dynamic-task-cmps/date-picker'
import { TimelinePicker } from './dynamic-task-cmps/timeline-picker'
import { MemberPicker } from './dynamic-task-cmps/member-picker'
import { useState } from 'react'
import { TaskSelection } from './task-selection'

export function TaskPreview({ task, group }) {
	const STATUS_PICKER = 'statusPicker'
	const PRIORITY_PICKER = 'priorityPicker'
	const DATE_PICKER = 'datePicker'
	const TIMELINE_PICKER = 'timelinePicker'
	const OWNER_PICKER = 'ownerPicker'
	const COLLABORATOR_PICKER = 'collaboratorPicker'

	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	function handleSelect() {}

	return (
		<ul
			className="task-preview task-row clean-list"
			style={{ borderInlineStart: `6px solid ${group.style.color}` }}>
			<TaskSelection onSelect={handleSelect} isSelected={false} />
			<TaskTitle groupId={group.id} task={task} />
			{board.cmpsOrder.map(cmp => {
				switch (cmp.cmpName) {
					case STATUS_PICKER:
					case PRIORITY_PICKER:
						return <LabelPicker key={cmp.id} groupId={group.id} type={cmp.cmpName} task={task} />
					case DATE_PICKER:
						return <DatePicker key={cmp.id} groupId={group.id} task={task} />
					case OWNER_PICKER:
					case COLLABORATOR_PICKER:
						return <MemberPicker key={cmp.id} type={cmp.cmpName} groupId={group.id} task={task} />
					case TIMELINE_PICKER:
						return <TimelinePicker key={cmp.id} type={cmp.cmpName} groupId={group.d} task={task} />
					default:
						return null
				}
			})}
		</ul>
	)
}
