import { useSelector } from 'react-redux'
import { TaskSelection } from './task-selection'
import { useDispatch } from 'react-redux'
import { REMOVE_CHECKED_TASKS, ADD_CHECKED_TASKS } from '../store/selected-task.reducer'
import { useRef, useState } from 'react'
import { saveBoardDebounced } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'

export function TaskListHeader({ task, group, isGroupSelected, setIsGroupSelected, isCollapsed }) {
	// state to make sure resizer stays visible during drag
	const [activeResizerIdx, setActiveResizerIdx] = useState()
	const dragStartX = useRef()
	// updating states takes time for react, so we useRef to make better calculation.
	const draggedCmpIdx = useRef()
	// no need to update every second, so only update after long time without moving
	const debouncedSaveBoard = useRef(saveBoardDebounced(1000))
	const dispatch = useDispatch()
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

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

	// start movement, set Idx for state and ref, and add movement listeners
	function onMouseDown(ev, idx) {
		draggedCmpIdx.current = idx
		setActiveResizerIdx(idx)
		dragStartX.current = ev.screenX
		document.addEventListener('mousemove', resize)
		document.addEventListener('mouseup', () => {
			// when movement stops, stop listener and reset state/ref
			document.removeEventListener('mousemove', resize)
			draggedCmpIdx.current = ''
			setActiveResizerIdx('')
		})
	}

	function resize(ev) {
		// get dx (difference)
		const dx = ev.screenX - dragStartX.current
		// get cmp by its index
		const selectedCmp = board.cmpsOrder[draggedCmpIdx.current]
		// get new x offset for drag
		dragStartX.current = ev.screenX
		// get width before drag
		const oldWidth = parseInt(selectedCmp.defaultWidth)
		const minWidth = parseInt(selectedCmp.minWidth)
		// make sure new width isn't smaller than minWidth
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

	return (
		<ul className={`task-list-header task-row clean-list ${isCollapsed ? 'collapsed' : ''}`}>
			<div className={`sticky-container ${isCollapsed ? 'collapsed' : ''}`}>
				<div className="empty-option-container"></div>
				<div className="colored-border" style={{ backgroundColor: group.style.color }}></div>
				{!isCollapsed && (
					<>
						<TaskSelection isChecked={isGroupSelected} onCheck={toggleGroupChecked} />
						<li className="task-title-header">Task</li>
					</>
				)}
			</div>

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
					default:
						cmpTitle = null
				}

				return (
					cmpTitle &&
					cmp.isShown && (
						<li key={cmp.id} style={{ width: cmp.defaultWidth }}>
							{cmpTitle}
							<div
								onMouseDown={ev => onMouseDown(ev, idx)}
								className={`resizing-container ${activeResizerIdx === idx ? 'is-dragging' : ''}`}
							></div>
						</li>
					)
				)
			})}
			<li className="line-end"></li>
		</ul>
	)
}
