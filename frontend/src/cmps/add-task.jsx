import { useRef, useState } from 'react'
import { boardService } from '../services/board.service.local'
import { addTask } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'

export function AddTask({ groupId }) {
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
			await addTask(board._id, groupId, taskToAdd, 'Added Task')
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
			className="add-task clean-list  task-row"
			onClick={() => {
				elInput.current.focus()
			}}>
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