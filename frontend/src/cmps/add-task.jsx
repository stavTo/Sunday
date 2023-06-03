import { useRef, useState } from 'react'
import { boardService } from '../services/board.service.local'
import { addTask } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { TaskSelection } from './task-selection'
import { ICON_CHECKBOX } from '../assets/icons/icons'
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
			await addTask(board._id, group.id, taskToAdd, 'Added Task')
		} catch (err) {
			console.log(err)
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
			style={{
				borderInlineStart: `6px solid ${utilService.hexToRgba(group.style.color, 0.6)} `,
			}}
			className="add-task clean-list  task-row"
			onClick={() => {
				elInput.current.focus()
			}}>
			<li className="task-selection">{ICON_CHECKBOX}</li>
			<li>
				<input
					className="add-task-input"
					ref={elInput}
					onKeyDown={handleKeyPressed}
					placeholder="+ Add item"
					value={taskToAdd.title}
					onBlur={onAddTask}
					onChange={handleChange}></input>
			</li>
		</ul>
	)
}
