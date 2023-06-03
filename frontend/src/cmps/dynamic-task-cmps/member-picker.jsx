import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ICON_CLOSE, ICON_SEARCH } from '../../assets/icons/icons'
import { EMPTY_PERSON } from '../../assets/icons/icons'
import { userService } from '../../services/user.service'
import { useSelector } from 'react-redux'
import { UPDATE_BOARD } from '../../store/board.reducer'
import { saveTask } from '../../store/selected-board.actions'
import { usePopper } from 'react-popper'

export function MemberPicker({ groupId, type, task }) {
	const [isPickerOpen, setIsPickerOpen] = useState(false)
	const [userToSearch, setUserToSearch] = useState('')
	const elSearchInputRef = useRef()
	const fullUserList = useRef(userService.getDemoUsers()) // so we don't call userService twice
	const [userList, setUserList] = useState(fullUserList.current)
	const [assignedUsers, setAssignedUsers] = useState([])
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)
	const [arrowElement, setArrowElement] = useState(null)
	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		modifiers: [
			{ name: 'arrow', options: { element: arrowElement } },
			{ name: 'offset', options: { offset: [0, 8] } },
		],
	})

	useEffect(() => {
		document.addEventListener('mousedown', onClosePicker)
		return () => {
			document.removeEventListener('mousedown', onClosePicker)
		}
	}, [])

	useEffect(() => {
		setUserList(userService.getDemoUsers(userToSearch))
	}, [userToSearch])

	//this happens BEFORE dom renders, so that modal changes before it displays. (no jumps in display)
	useLayoutEffect(() => {
		isPickerOpen && onSetAssignedUsers()
	}, [isPickerOpen])

	function onToggleModal(ev) {
		if (ev.target.closest('.member-picker-modal')) return
		ev.stopPropagation()
		setIsPickerOpen(prev => !prev)
	}

	// new users are only shown once component is closed and re-opened.
	function onSetAssignedUsers() {
		let filteredUsers
		if (type === 'ownerPicker' && task.owner) {
			filteredUsers = fullUserList.current.filter(user => user._id !== task.owner._id)
			task.owner?._id && setAssignedUsers([task.owner]) //only set if owner exists, and not an empty obj
		} else if (type === 'collaboratorPicker' && task.collaborators) {
			filteredUsers = userList.filter(
				user => !task.collaborators.some(collaborator => user._id === collaborator._id)
			)
			setAssignedUsers(task.collaborators)
		}
		setUserList(filteredUsers)
	}

	function onRemoveAssignedUser(user) {
		const filteredUsers = assignedUsers.filter(u => u._id !== user._id)
		let newTask
		if (type === 'ownerPicker') {
			newTask = { ...task, owner: {} }
		} else if (type === 'collaboratorPicker') {
			newTask = { ...task, collaborators: filteredUsers }
		}
		saveTask(board._id, groupId, newTask, 'removed member ')
		setAssignedUsers(filteredUsers)
		setUserList(prev => [...prev, user])
	}

	function onSetUser(user) {
		setIsPickerOpen(false)
		let newTask
		if (type === 'ownerPicker') {
			newTask = { ...task, owner: user }
		} else if (type === 'collaboratorPicker') {
			newTask = { ...task, collaborators: [...task.collaborators, user] }
		}
		saveTask(board._id, groupId, newTask, 'Set new member ')
	}

	function onClosePicker(ev) {
		if (ev.target.closest('.member-picker-modal')) return
		setIsPickerOpen(false)
		setUserToSearch('')
	}

	function handleSearch({ target }) {
		setUserToSearch(target.value)
	}
	return (
		<li className="member-picker" ref={setReferenceElement} onClick={ev => onToggleModal(ev)}>
			{type === 'ownerPicker' && task?.owner?._id && <img src={task.owner.imgUrl} alt="person" />}
			{type === 'collaboratorPicker' && !!task.collaborators?.length && (
				<div className="collaborator-img-container">
					{task.collaborators.map(collaborator => (
						<img key={collaborator._id} src={collaborator.imgUrl} alt="person" />
					))}
				</div>
			)}
			{/* if not any of the above, show default image. */}
			{((type === 'ownerPicker' && !task?.owner?._id) ||
				(type === 'collaboratorPicker' && !task.collaborators?.length)) && (
				<img src={EMPTY_PERSON} alt="person" />
			)}
			{isPickerOpen && (
				<div
					className="member-picker-modal"
					ref={setPopperElement}
					style={styles.popper}
					{...attributes.popper}>
					<div className="modal-up-arrow" ref={setArrowElement} style={styles.arrow}></div>
					<div className="assigned-members">
						{assignedUsers?.map(user => (
							<div key={user._id} className="member">
								<img src={user.imgUrl} className="img-container"></img>
								<div className="fullname-container">{user.fullname}</div>
								<div className="icon-container" onClick={() => onRemoveAssignedUser(user)}>
									{ICON_CLOSE}
								</div>
							</div>
						))}
					</div>
					<div className="input-container " onClick={() => elSearchInputRef.current.focus()}>
						<input
							autoFocus
							type="text"
							placeholder="Search names"
							ref={elSearchInputRef}
							value={userToSearch}
							onChange={handleSearch}
						/>
						<span
							className={`svg-container btn-primary ${userToSearch ? 'active-search' : ''}`}
							onClick={() => setUserToSearch('')}>
							{userToSearch ? <span>{ICON_CLOSE}</span> : <span>{ICON_SEARCH}</span>}
						</span>
					</div>
					<div className="scroll-container">
						<div className="suggested-people">
							<span>Suggested people </span>
						</div>
						<ul className="members-list clean-list">
							{userList.map(user => (
								<li key={user._id} className="btn-primary" onClick={() => onSetUser(user)}>
									<img src={user.imgUrl} alt="user img" />
									<span>{user.fullname}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</li>
	)
}
