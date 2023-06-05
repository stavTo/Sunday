import { addEmptyGroup, addTaskToFirstGroup, saveBoard } from '../store/selected-board.actions'
import { ICON_INFO, ICON_STAR, ICON_INVITE_MEMBERS, ICON_MENU_DOTS, ICON_STAR_STARRED } from '../assets/icons/icons'
import { BoardFilter } from './board-filter'
import { BoardToolbar } from './board-toolbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { TippyContainer } from './tippy-container'

export function BoardHeader({ board }) {
	function onAddGroup() {
		addEmptyGroup(board._id, false)
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
						<TippyContainer txt="Add to favorites">
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
					<div className="invite-container btn-primary">
						{ICON_INVITE_MEMBERS}
						Invite / 3
					</div>
					<div className="menu-container btn-primary">{ICON_MENU_DOTS}</div>
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
	)
}
