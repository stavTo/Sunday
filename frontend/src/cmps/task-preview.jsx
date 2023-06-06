import { useSelector } from 'react-redux'
import { LabelPicker } from './dynamic-task-cmps/label-picker'
import { TaskTitle } from './dynamic-task-cmps/task-title'
import { DatePicker } from './dynamic-task-cmps/date-picker'
import { TimelinePicker } from './dynamic-task-cmps/timeline-picker'
import { MemberPicker } from './dynamic-task-cmps/member-picker'
import { TaskSelection } from './task-selection'
import { ICON_OPTIONS } from '../assets/icons/icons'
import { removeTask } from '../store/selected-board.actions'
import { useDispatch } from 'react-redux'
import { TOGGLE_CHECKED_TASK } from '../store/selected-task.reducer'
import { useEffect, useState } from 'react'
import { TaskOptionsMenu } from './task-options-menu'
import { showErrorMsg } from '../services/event-bus.service'

const STATUS_PICKER = 'statusPicker'
const PRIORITY_PICKER = 'priorityPicker'
const DATE_PICKER = 'datePicker'
const TIMELINE_PICKER = 'timelinePicker'
const OWNER_PICKER = 'ownerPicker'
const COLLABORATOR_PICKER = 'collaboratorPicker'

export function TaskPreview({ task, group, checkedTaskIds, setIsGroupSelected }) {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const [isOptionOpen, setIsOptionOpen] = useState(false)

	const dispatch = useDispatch()

	useEffect(() => {
		document.addEventListener('mousedown', onSetOptionClose)
		return () => {
			document.removeEventListener('mousedown', onSetOptionClose)
		}
	}, [])

	function handleCheck(isChecked) {
		if (!isChecked) setIsGroupSelected(false)
		dispatch({ type: TOGGLE_CHECKED_TASK, taskId: task.id })
	}

	async function onRemoveTask() {
		setIsOptionOpen(false)
		try {
			await removeTask(task.id)
		} catch {
			showErrorMsg('cant delete task')
		}
	}

	function onSetOptionClose(ev) {
		if (ev.target.closest('.options-menu')) return
		setIsOptionOpen(false)
	}
	return (
		<>
			{isOptionOpen && (
				<TaskOptionsMenu
					task={task}
					group={group}
					onRemoveTask={onRemoveTask}
					setIsOptionOpen={setIsOptionOpen}
				/>
			)}
			<ul
				className="task-preview task-row clean-list"
				style={{
					borderInlineStart: `6px solid ${group.style.color}`,
				}}
			>
				<li onClick={() => setIsOptionOpen(prev => !prev)} className="task-option btn-primary">
					{ICON_OPTIONS}
				</li>
				<TaskSelection onCheck={handleCheck} isChecked={checkedTaskIds.includes(task.id)} />
				<TaskTitle groupId={group.id} task={task} />
				{board.cmpsOrder.map(cmp => {
					switch (cmp.cmpName) {
						case STATUS_PICKER:
						case PRIORITY_PICKER:
							return (
								<LabelPicker
									defaultWidth={cmp.defaultWidth}
									key={cmp.id}
									groupId={group.id}
									type={cmp.cmpName}
									task={task}
								/>
							)
						case DATE_PICKER:
							return (
								<DatePicker
									defaultWidth={cmp.defaultWidth}
									key={cmp.id}
									groupId={group.id}
									task={task}
								/>
							)
						case OWNER_PICKER:
						case COLLABORATOR_PICKER:
							return (
								<MemberPicker
									defaultWidth={cmp.defaultWidth}
									key={cmp.id}
									type={cmp.cmpName}
									groupId={group.id}
									task={task}
								/>
							)
						case TIMELINE_PICKER:
							return (
								<TimelinePicker
									defaultWidth={cmp.defaultWidth}
									key={cmp.id}
									type={cmp.cmpName}
									groupId={group.id}
									task={task}
								/>
							)
						default:
							return null
					}
				})}
			</ul>
		</>
	)
}
