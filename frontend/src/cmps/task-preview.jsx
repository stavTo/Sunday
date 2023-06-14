import { useSelector } from 'react-redux'
import { LabelPicker } from './dynamic-task-cmps/label-picker'
import { TaskTitle } from './dynamic-task-cmps/task-title'
import { DatePicker } from './dynamic-task-cmps/date-picker'
import { TimelinePicker } from './dynamic-task-cmps/timeline-picker'
import { MemberPicker } from './dynamic-task-cmps/member-picker'
import { TaskSelection } from './task-selection'
import { ICON_OPTIONS } from '../assets/icons/icons'
import { useDispatch } from 'react-redux'
import { TOGGLE_CHECKED_TASK } from '../store/selected-task.reducer'
import { useEffect, useState } from 'react'
import { TaskOptionsMenu } from './task-options-menu'
import { usePopper } from 'react-popper'
import { useLongPress } from '../customHooks/useLongPress'

const STATUS_PICKER = 'statusPicker'
const PRIORITY_PICKER = 'priorityPicker'
const DATE_PICKER = 'datePicker'
const TIMELINE_PICKER = 'timelinePicker'
const OWNER_PICKER = 'ownerPicker'
const COLLABORATOR_PICKER = 'collaboratorPicker'

export function TaskPreview({ task, group, checkedTaskIds, setIsGroupSelected, snapshot }) {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const [isOptionOpen, setIsOptionOpen] = useState(false)

	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)
	const { styles, attributes } = usePopper(referenceElement, popperElement)

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

	function onSetOptionClose(ev) {
		if (ev.target.closest('.options-menu')) return
		setIsOptionOpen(false)
	}

	function onLongPress() {
		setIsOptionOpen(true)
	}

	const longPressEvent = useLongPress(onLongPress, () => {}, {
		shouldPreventDefault: false,
	})

	return (
		<>
			{isOptionOpen && (
				<div className="popper-container" ref={setPopperElement} style={styles.popper} {...attributes.popper}>
					<TaskOptionsMenu task={task} group={group} setIsOptionOpen={setIsOptionOpen} />
				</div>
			)}
			<ul className="task-preview task-row clean-list" {...longPressEvent}>
				<div className="task-option-container" ref={setReferenceElement}>
					<div onClick={() => setIsOptionOpen(prev => !prev)} className="task-option btn-primary">
						{ICON_OPTIONS}
					</div>
				</div>
				<div className="main-preview-container">
					<div className="sticky-container">
						<div className="colored-border" style={{ backgroundColor: group.style.color }}></div>
						<TaskSelection onCheck={handleCheck} isChecked={checkedTaskIds.includes(task.id)} />
						<TaskTitle groupId={group.id} task={task} />
					</div>
					{board.cmpsOrder.map(cmp => {
						if (!cmp.isShown) return null
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
					<div className="line-end"></div>
				</div>
			</ul>
		</>
	)
}
