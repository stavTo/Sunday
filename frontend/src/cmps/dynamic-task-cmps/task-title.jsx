import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../../services/event-bus.service'
import { saveTask } from '../../store/selected-board.actions'
import { setTippy } from '../../services/tippy.service'

export function TaskTitle({ task, groupId }) {
	const [isInputVisible, setIsInputVisible] = useState(false)
	const [titleToChange, setTitleToChange] = useState(task.title)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	// setTippy(`#${task.id}`, task.title)

	useEffect(() => {
		document.addEventListener('click', setInputInvisible)
		return () => {
			document.removeEventListener('click', setInputInvisible)
		}
	}, [])

	function setInputInvisible() {
		setIsInputVisible(false)
	}

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
					autoFocus={true}
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
