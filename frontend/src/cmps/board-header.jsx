import { addGroup, addTaskToFirstGroup, saveBoard } from '../store/selected-board.actions'
import { ICON_INFO, ICON_STAR, ICON_INVITE_MEMBERS, ICON_STAR_STARRED, ICON_OPTIONS } from '../assets/icons/icons'
import { BoardFilter } from './board-filter-cmps/board-filter'
import { BoardToolbar } from './board-toolbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TfiClose } from 'react-icons/tfi'
import { faAngleDown, faTableList } from '@fortawesome/free-solid-svg-icons'
import { TippyContainer } from './tippy-container'
import { useEffect, useState } from 'react'
import { showErrorMsg } from '../services/event-bus.service'
import { BoardInfo } from './board-info'
import { Link } from 'react-router-dom'

export function BoardHeader({ board }) {
	const [isInviteOpen, setIsInviteOpen] = useState(false)
	const [isInfoOpen, setIsInfoOpen] = useState(false)
	const [titleToChange, setTitleToChange] = useState(board.title)
	const [isInputVisible, setIsInputVisible] = useState(false)
	const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false)
	const [isMenuToggle, setIsMenuToggle] = useState(false)

	useEffect(() => {
		document.addEventListener('mousedown', onSetOptionClose)
		return () => {
			document.removeEventListener('mousedown', onSetOptionClose)
		}
	}, [])

	function onSetOptionClose(ev) {
		if (ev.target.closest('.add-group-modal')) return
		setIsAddGroupModalOpen(false)
	}

	function onAddGroup() {
		addGroup(board._id, false)
	}

	function onAddTask() {
		const action = {
			description: 'New task',
			groupTitle: board.groups[0].title,
			groupColor: board.groups[0].style.color,
			type: 'Created task',
		}
		addTaskToFirstGroup(board._id, action)
	}

	function onToggleStarState() {
		const isStarred = board.isStarred
		const newBoard = { ...board, isStarred: !isStarred }
		saveBoard(newBoard)
	}

	function handleClick(ev) {
		ev.stopPropagation()
		setIsInputVisible(prev => !prev)
	}

	function handleChange({ target }) {
		setTitleToChange(target.value)
	}

	function handleKeyPressed(key) {
		if (key.key === 'Enter') setNewTitle()
		if (key.key === 'Escape') onEmptyInput()
	}

	function onEmptyInput() {
		setTitleToChange(board.title)
		setIsInputVisible(false)
	}

	async function setNewTitle() {
		setIsInputVisible(false)
		try {
			const boardToEdit = { ...board, title: titleToChange }
			await saveBoard(boardToEdit)
		} catch {
			showErrorMsg('Cant save task')
		}
	}

	return (
		<>
			<section className="board-header">
				<div className="board-header-top">
					<div className="board-header-top-left">
						<TippyContainer txt="Click to Edit">
							<div className="board-name title-font">
								{!isInputVisible && <div onClick={handleClick}>{board.title}</div>}
								{isInputVisible && (
									<input
										autoFocus={true}
										onBlur={setNewTitle}
										onClick={ev => ev.stopPropagation()}
										onKeyDown={handleKeyPressed}
										className="title-input"
										id="title"
										name="title"
										value={titleToChange}
										onChange={handleChange}
									></input>
								)}
							</div>
						</TippyContainer>
						<TippyContainer txt="Show board description">
							<span
								className="info-icon header-icon btn-primary"
								onClick={() => setIsInfoOpen(prev => !prev)}
							>
								{ICON_INFO}
							</span>
						</TippyContainer>
						{!board.isStarred && (
							<TippyContainer txt="Add to favorites">
								<span onClick={onToggleStarState} className="star-icon header-icon btn-primary">
									{ICON_STAR}
								</span>
							</TippyContainer>
						)}
						{board.isStarred && (
							<TippyContainer txt="Remove from favorites">
								<span onClick={onToggleStarState} className="star-icon header-icon btn-primary starred">
									{ICON_STAR_STARRED}
								</span>
							</TippyContainer>
						)}
					</div>
					<div className="menu-btn btn-primary" onClick={() => setIsMenuToggle(prev => !prev)}>
						{ICON_OPTIONS}
					</div>
					<div className={`board-header-top-right  ${isMenuToggle ? 'open-menu' : ''}`}>
						<Link
							className="open-task-details activity-container btn-primary"
							to={`/boards/${board._id}/activity_log/`}
						>
							Activity
							<div className="img-container">
								<img src="https://res.cloudinary.com/diyikz4gq/image/upload/v1686151189/ido-img_ryaaxn.jpg" alt="user" />
								<img src="https://res.cloudinary.com/diyikz4gq/image/upload/v1686151190/roni-img_rvqeda.jpg" alt="user" />
							</div>

							<div className="user-img-container"></div>

						</Link>
						<div onClick={() => setIsInviteOpen(prev => !prev)} className="invite-container btn-primary">
							{ICON_INVITE_MEMBERS}
							Invite / 5
						</div>
					</div>
				</div>
				<span className="board-info">{board.description}</span>
				<BoardToolbar />
				<div className="board-header-bottom">
					<button className="btn-new-task btn-text" onClick={onAddTask}>
						New Task
					</button>
					<button className="btn-new-task btn-icon" onClick={() => setIsAddGroupModalOpen(prev => !prev)}>
						<FontAwesomeIcon icon={faAngleDown} />
					</button>
					{isAddGroupModalOpen && <AddGroupModal onAddGroup={onAddGroup} />}
					<BoardFilter board={board} />
				</div>
			</section>
			{isInviteOpen && (
				<>
					<div className="invite-members-modal">
						<span className="close-modal-btn btn-primary" onClick={() => setIsInviteOpen(false)}>
							<TfiClose />
						</span>
						<span className="modal-title">{board.title}</span>
						<input type="text" placeholder="Enter name" />
						<ul className="user-list clean-list">
							{board.members.map(member => (
								<li key={member._id}>
									<img src={member.imgUrl} alt="member img" />
									<span>{member.fullname}</span>
								</li>
							))}
						</ul>
					</div>
					<div className="modal-overlay" onClick={() => setIsInviteOpen(false)}></div>
				</>
			)}
			{isInfoOpen && <BoardInfo board={board} setIsInfoOpen={setIsInfoOpen} />}
		</>
	)
}

function AddGroupModal({ onAddGroup }) {
	return (
		<section className="add-group-modal">
			<span onClick={onAddGroup} className="btn-primary">
				<span className="icon">
					<FontAwesomeIcon icon={faTableList} style={{ color: '#676879' }} />
				</span>
				<span className="title">New group of tasks</span>
			</span>
		</section>
	)
}
