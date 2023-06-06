import { addGroup, addTaskToFirstGroup, saveBoard } from '../store/selected-board.actions'
import { ICON_INFO, ICON_STAR, ICON_INVITE_MEMBERS, ICON_STAR_STARRED } from '../assets/icons/icons'
import { BoardFilter } from './board-filter'
import { BoardToolbar } from './board-toolbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconContext } from 'react-icons/lib'
import { TfiClose } from 'react-icons/tfi'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { TippyContainer } from './tippy-container'
import { useState } from 'react'

export function BoardHeader({ board }) {
	const [isInviteOpen, setIsInviteOpen] = useState(false)

	function onAddGroup() {
		addGroup(board._id, false)
	}

	function onAddTask() {
		addTaskToFirstGroup(board._id)
	}

	function onToggleStarState() {
		const isStarred = board.isStarred
		const newBoard = { ...board, isStarred: !isStarred }
		saveBoard(newBoard)
	}

	return (
		<>
			<section className="board-header">
				<div className="board-header-top">
					<div className="board-header-top-left">
						<TippyContainer txt="Click to Edit">
							<h1 className="board-name title-font">{board.title}</h1>
						</TippyContainer>
						<TippyContainer txt="Show board description">
							<span className="info-icon header-icon btn-primary">{ICON_INFO}</span>
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
					<div className="board-header-top-right">
						<div className="activity-container btn-primary">
							Activity
							<div className="user-img-container"></div>
						</div>
						<div onClick={() => setIsInviteOpen(prev => !prev)} className="invite-container btn-primary">
							{ICON_INVITE_MEMBERS}
							Invite / 3
						</div>
					</div>
				</div>
				<BoardToolbar />
				<div className="board-header-bottom">
					<button className="btn-new-task btn-text" onClick={onAddTask}>
						New Task
					</button>
					<button className="btn-new-task btn-icon" onClick={onAddGroup}>
						<FontAwesomeIcon icon={faAngleDown} />
					</button>
					<BoardFilter board={board} />
				</div>
			</section>
			{isInviteOpen && (
				<>
					<div className="invite-members-modal">
						<span className="close-modal-btn btn-primary" onClick={() => setIsInviteOpen(false)}>
							<TfiClose />
						</span>
						<span className="modal-title">Board Members</span>
						<input type="text" placeholder="Enter name" />
						<ul className="user-list clean-list">
							{/* //TODO make this find all users EXCEPT logged in user */}
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
		</>
	)
}
