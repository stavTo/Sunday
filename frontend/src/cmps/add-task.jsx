import { useRef, useState } from 'react'
import { boardService } from '../services/board.service'
import { addTask } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { TaskSelection } from './task-selection'
import { utilService } from '../services/util.service'

export function AddTask({ group }) {
	const [taskToAdd, setTaskToAdd] = useState(boardService.getEmptyTask())
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const elInput = useRef()

	function handleKeyPressed(key) {
		if (key.key === 'Enter') onAddTask()
		if (key.key === 'Escape') onEmptyInput()
	}

	async function onAddTask() {
		if (taskToAdd.title.replace(/\s/g, '') === '') return
		elInput.current.blur()
		try {
			const action = {
				description: taskToAdd.title,
				groupTitle: group.title,
				groupColor: group.style.color,
				type: 'Created task',
			}
			await addTask(board._id, group.id, taskToAdd, action)
			setTaskToAdd(prevTask => ({ ...prevTask, title: '' }))
		} catch (err) {
			showErrorMsg("Can't add task")
		}
	}

	function onEmptyInput() {
		setTaskToAdd(prev => ({ ...prev, title: '' }))
		elInput.current.blur()
	}

	function handleChange({ target }) {
		setTaskToAdd(prev => ({ ...prev, title: target.value }))
	}

	return (
		<ul
			className="add-task clean-list"
			onClick={() => {
				elInput.current.focus()
			}}
		>
			<div className="sticky-container">
				<div className="empty-option-container"></div>
				<div
					className="colored-border"
					style={{ backgroundColor: utilService.hexToRgba(group.style.color, 0.6) }}
				></div>
				<TaskSelection isDisabled={true} />
				<li>
					<input
						className="add-task-input"
						ref={elInput}
						onKeyDown={handleKeyPressed}
						placeholder="+ Add item"
						value={taskToAdd.title}
						onBlur={onAddTask}
						onChange={handleChange}
					></input>
				</li>
			</div>
		</ul>
	)
}
