import { useEffect, useState } from 'react'
import { boardService } from '../../services/board.service.local'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../../services/event-bus.service'
import { saveTask } from '../../store/selected-board.actions'

export function TaskTitle({ task, groupId }) {
	const [isInputVisible, setIsInputVisible] = useState(false)
	const [titleToChange, setTitleToChange] = useState(task.title)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	useEffect(() => {
		document.addEventListener('click', () => setIsInputVisible(false))
		return () => {
			document.removeEventListener('click', () => setIsInputVisible(false))
		}
	}, [])

	function handleClick(ev) {
		ev.stopPropagation()
		setIsInputVisible(prev => !prev)
	}

	function handleChange({ target }) {
		setTitleToChange(target.value)
	}

	async function setNewTitle(ev) {
		ev.preventDefault()
		const newTask = { ...task, title: titleToChange }
		try {
			await saveTask(board._id, groupId, newTask, 'changed task title')
		} catch {
			showErrorMsg('Cant save task')
		}
	}

	return (
		<li className="task-title">
			{!isInputVisible && <span onClick={handleClick}>{task.title}</span>}
			{isInputVisible && (
				<input
					onBlur={setNewTitle}
					onClick={ev => ev.stopPropagation()}
					className="title-input"
					id="title"
					name="title"
					value={titleToChange}
					onChange={handleChange}></input>
			)}
		</li>
	)
}
