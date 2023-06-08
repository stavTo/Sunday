import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../../services/event-bus.service'
import { saveTask } from '../../store/selected-board.actions'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'
import { ICON_CONVERSATION, ICON_CONVERSATION_EMPTY } from '../../assets/icons/icons'
import { socketService, SOCKET_EVENT_LOAD_BOARD, SOCKET_EMIT_SEND_BOARD } from '../../services/socket.service'

import { TippyContainer } from '../tippy-container'

export function TaskTitle({ task, groupId }) {
	const [isInputVisible, setIsInputVisible] = useState(false)
	const [isInputFocused, setIsInputFocused] = useState(false)
	const [titleToChange, setTitleToChange] = useState(task.title)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	useEffect(() => {
		document.addEventListener('click', setInputInvisible)
		return () => {
			document.removeEventListener('click', setInputInvisible)
		}
	}, [])

	function handleKeyPressed(key) {
		if (key.key === 'Enter') setNewTitle()
		if (key.key === 'Escape') onEmptyInput()
	}

	function setInputInvisible() {
		setIsInputVisible(false)
	}
	function onEmptyInput() {
		setTitleToChange(task.title)
		setIsInputVisible(false)
	}

	function handleClick(ev) {
		ev.stopPropagation()
		setIsInputVisible(prev => !prev)
	}

	function handleChange({ target }) {
		setTitleToChange(target.value)
	}

	async function setNewTitle() {
		const newTask = { ...task, title: titleToChange }
		setIsInputFocused(false)
		try {
			await saveTask(board._id, groupId, newTask, 'changed task title')
			socketService.emit(SOCKET_EMIT_SEND_BOARD)
		} catch {
			showErrorMsg('Cant save task')
		}
	}

	return (
		<li className="task-title" style={{ width: '400px' }}>
			<div className="title-main-container">
				{!isInputVisible && <span onClick={handleClick}>{task.title}</span>}
				{isInputVisible && (
					<input
						autoFocus={true}
						onBlur={setNewTitle}
						onKeyDown={handleKeyPressed}
						onFocus={() => setIsInputFocused(true)}
						onClick={ev => ev.stopPropagation()}
						className="title-input"
						id="title"
						name="title"
						value={titleToChange}
						onChange={handleChange}
					></input>
				)}
				{!isInputFocused && (
					<Link className="open-task-details" to={`/boards/${board._id}/tasks/${task.id}`}>
						<div className="icon">
							<FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} style={{ color: '#5e6b83' }} />
						</div>
						<div className="open">Open</div>
					</Link>
				)}
			</div>
			<Link
				className={`conversation-icon-container ${task.comments.length ? 'comments-available' : ''}`}
				to={`/boards/${board._id}/tasks/${task.id}`}
			>
				{!task.comments.length && (
					<TippyContainer txt="Start conversation">
						<div>{ICON_CONVERSATION_EMPTY}</div>
					</TippyContainer>
				)}
				{!!task.comments.length && (
					<TippyContainer txt="Add to conversation">
						<div>
							{ICON_CONVERSATION} <span className="updates-count">{task.comments.length}</span>
						</div>
					</TippyContainer>
				)}
			</Link>
		</li>
	)
}
