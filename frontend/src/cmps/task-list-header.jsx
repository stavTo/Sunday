import { useSelector } from 'react-redux'
import { TaskSelection } from './task-selection'
import { useDispatch } from 'react-redux'
import { REMOVE_CHECKED_TASKS, ADD_CHECKED_TASKS } from '../store/selected-task.reducer'
import { useRef } from 'react'
import { saveBoardDebounced } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'

export function TaskListHeader({ task, group, isGroupSelected, setIsGroupSelected }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const dragStartX = useRef()
	const draggedCmpIdx = useRef()
	const dispatch = useDispatch()
	const debouncedSaveBoard = useRef(saveBoardDebounced())

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

	function onMouseDown(ev) {
		startResize(ev)
		document.addEventListener('mousemove', resize)
		document.addEventListener('mouseup', () => document.removeEventListener('mousemove', resize))
	}

	function resize(ev) {
		const dx = ev.screenX - dragStartX.current
		const selectedCmp = board.cmpsOrder[draggedCmpIdx.current]
		dragStartX.current = ev.screenX
		const oldWidth = parseInt(selectedCmp.defaultWidth)
		const minWidth = parseInt(selectedCmp.minWidth)
		const newWidth = Math.max(minWidth, oldWidth + dx) + 'px'
		const newBoard = { ...board }
		newBoard.cmpsOrder[draggedCmpIdx.current] = {
			...newBoard.cmpsOrder[draggedCmpIdx.current],
			defaultWidth: newWidth,
		}
		try {
			debouncedSaveBoard.current(newBoard)
		} catch {
			showErrorMsg('Something went wrong')
		}
	}

	function startResize(ev) {
		draggedCmpIdx.current = ev.target.dataset.idx
		dragStartX.current = ev.screenX
	}

	return (
		<ul
			className="task-list-header task-row clean-list"
			style={{ borderInlineStart: `6px solid ${group.style.color}` }}
		>
			<TaskSelection isChecked={isGroupSelected} onCheck={toggleGroupChecked} />
			<li style={{ width: '400px' }} className="task-title-header">
				Task
			</li>
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

				return (
					cmpTitle && (
						<li key={cmp.id} style={{ width: cmp.defaultWidth }}>
							{cmpTitle}
							<div onMouseDown={onMouseDown} className={`resizing-container`} data-idx={idx}></div>
						</li>
					)
				)
			})}
		</ul>
	)
}
