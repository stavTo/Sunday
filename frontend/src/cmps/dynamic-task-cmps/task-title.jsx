import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../../services/event-bus.service'
import { saveTask } from '../../store/selected-board.actions'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'
import { ICON_CONVERSATION, ICON_CONVERSATION_EMPTY } from '../../assets/icons/icons'

import { TippyContainer } from '../tippy-container'

export function TaskTitle({ task, groupId }) {
	const [isInputVisible, setIsInputVisible] = useState(false)
	const [isInputFocused, setIsInputFocused] = useState(false)
	const [titleToChange, setTitleToChange] = useState(task.title)
	const titleRef = useRef()
	const [titleHasEllipsis, setTitleHasEllipsis] = useState(false)
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

	useEffect(() => {
		const element = titleRef.current.children[0]
		if (!element) return
		const isOverflowing = element.scrollWidth > element.clientWidth
		setTitleHasEllipsis(isOverflowing)
	}, [task, titleRef])

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
			const action = {
				description: titleToChange,
				type: 'Rename task',
				oldTaskTitle: task.title,
				nameTaskTitle: titleToChange,
			}
			await saveTask(board._id, groupId, newTask, action)
		} catch {
			showErrorMsg('Cant save task')
		}
	}

	return (
		<li className="task-title">
			<div ref={titleRef} className="title-main-container">
				{!isInputVisible && (
					<TippyContainer txt={titleHasEllipsis ? task.title : ''}>
						<span onClick={handleClick}>{task.title}</span>
					</TippyContainer>
				)}
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
						<TippyContainer txt="Open item page">
							<div className="open">Open</div>
						</TippyContainer>
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
