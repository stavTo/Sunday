import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ICON_CLOSE, ICON_SEARCH } from '../../assets/icons/icons'
import { EMPTY_MEMBER } from '../../assets/icons/icons'
import { userService } from '../../services/user.service'
import { useSelector } from 'react-redux'
import { saveTask } from '../../store/selected-board.actions'
import { usePopper } from 'react-popper'
import { boardService } from '../../services/board.service'
import { showErrorMsg } from '../../services/event-bus.service'

export function MemberPicker({ groupId, type, task, defaultWidth }) {
	const [isPickerOpen, setIsPickerOpen] = useState(false)
	const [memberToSearch, setMemberToSearch] = useState('')
	const elSearchInputRef = useRef()
	const fullMemberList = useRef()
	const [memberList, setMemberList] = useState()
	const [assignedMembers, setAssignedMembers] = useState([])
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
		board._id && loadUsers()
		document.addEventListener('mousedown', onClosePicker)
		return () => {
			document.removeEventListener('mousedown', onClosePicker)
		}
	}, [])

	async function loadUsers() {
		try {
			const boardUsers = await boardService.getBoardUsers(board._id)
			setMemberList(boardUsers)
			fullMemberList.current = boardUsers
		} catch {
			console.log('err')
		}
	}

	useEffect(() => {
		onSearchMember()
	}, [memberToSearch])

	async function onSearchMember() {
		try {
			const filteredMembers = await boardService.getBoardUsers(board._id, memberToSearch)
			setMemberList(filteredMembers)
		} catch {
			showErrorMsg('cant load users')
		}
	}

	//this happens BEFORE dom renders, so that modal changes before it displays. (no jumps in display)
	useLayoutEffect(() => {
		isPickerOpen && onSetAssignedMembers()
	}, [isPickerOpen])

	function onToggleModal(ev) {
		if (ev.target.closest('.member-picker-modal')) return
		ev.stopPropagation()
		setIsPickerOpen(prev => !prev)
	}

	// new users are only shown once component is closed and re-opened.
	function onSetAssignedMembers() {
		let filteredMembers
		if (type === 'ownerPicker' && task.owner) {
			filteredMembers = fullMemberList.current.filter(member => member._id !== task.owner._id)
			task.owner?._id && setAssignedMembers([task.owner]) //only set if owner exists, and not an empty obj
		} else if (type === 'collaboratorPicker' && task.collaborators) {
			filteredMembers = memberList.filter(
				member => !task.collaborators.some(collaborator => member._id === collaborator._id)
			)
			setAssignedMembers(task.collaborators)
		}
		setMemberList(filteredMembers)
	}

	function onRemoveAssignedMember(member) {
		const filteredMembers = assignedMembers.filter(m => m._id !== member._id)
		let newTask
		if (type === 'ownerPicker') {
			newTask = { ...task, owner: {} }
		} else if (type === 'collaboratorPicker') {
			newTask = { ...task, collaborators: filteredMembers }
		}
		saveTask(board._id, groupId, newTask, 'removed member ')
		setAssignedMembers(filteredMembers)
		setMemberList(prev => [...prev, member])
	}

	function onSetMember(member) {
		setIsPickerOpen(false)
		let newTask
		if (type === 'ownerPicker') {
			newTask = { ...task, owner: member }
		} else if (type === 'collaboratorPicker') {
			newTask = { ...task, collaborators: [...task.collaborators, member] }
		}
		saveTask(board._id, groupId, newTask, 'Set new member ')
	}

	function onClosePicker(ev) {
		if (ev.target.closest('.member-picker-modal')) return
		setIsPickerOpen(false)
		setMemberToSearch('')
	}

	function handleSearch({ target }) {
		setMemberToSearch(target.value)
	}

	return (
		<li
			className="member-picker"
			style={{ width: defaultWidth }}
			ref={setReferenceElement}
			onClick={ev => onToggleModal(ev)}
		>
			{type === 'ownerPicker' && task?.owner?._id && <img src={task.owner.imgUrl} alt="member img" />}
			{type === 'collaboratorPicker' && !!task.collaborators?.length && (
				<div className="collaborator-img-container">
					{task.collaborators.map(collaborator => (
						<img key={collaborator._id} src={collaborator.imgUrl} alt="member img" />
					))}
				</div>
			)}
			{/* if not any of the above, show default image. */}
			{((type === 'ownerPicker' && !task?.owner?._id) ||
				(type === 'collaboratorPicker' && !task.collaborators?.length)) && (
				<img src={EMPTY_MEMBER} alt="member img" />
			)}
			{isPickerOpen && (
				<div
					className="member-picker-modal"
					ref={setPopperElement}
					style={styles.popper}
					{...attributes.popper}
				>
					<div className="modal-up-arrow" ref={setArrowElement} style={styles.arrow}></div>
					<div className="assigned-members">
						{assignedMembers?.map(member => (
							<div key={member._id} className="member">
								<img src={member.imgUrl} className="img-container"></img>
								<div className="fullname-container">{member.fullname}</div>
								<div className="icon-container" onClick={() => onRemoveAssignedMember(member)}>
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
							value={memberToSearch}
							onChange={handleSearch}
						/>
						<span
							className={`svg-container btn-primary ${memberToSearch ? 'active-search' : ''}`}
							onClick={() => setMemberToSearch('')}
						>
							{memberToSearch ? <span>{ICON_CLOSE}</span> : <span>{ICON_SEARCH}</span>}
						</span>
					</div>
					<div className="scroll-container">
						<div className="suggested-people">
							<span>Suggested people </span>
						</div>
						<ul className="members-list clean-list">
							{memberList.map(member => (
								<li key={member._id} className="btn-primary" onClick={() => onSetMember(member)}>
									<img src={member.imgUrl} alt="member img" />
									<span>{member.fullname}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</li>
	)
}
