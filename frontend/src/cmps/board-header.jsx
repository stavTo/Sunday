import { addEmptyGroup, addTaskToFirstGroup } from '../store/selected-board.actions'
import { ICON_INFO, ICON_STAR, ICON_INVITE_MEMBERS, ICON_MENU_DOTS } from '../assets/icons/icons'
import { BoardFilter } from './board-filter'
import { BoardToolbar } from './board-toolbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { setTippy } from '../services/tippy.service'

export function BoardHeader({ board }) {
	function onAddGroup() {
		addEmptyGroup(board._id, false)
	}

	function onAddTask() {
		addTaskToFirstGroup(board._id)
	}

	setTippy('.board-name', 'Click to Edit')
	setTippy('.info-icon', 'Show board description')
	setTippy('.star-icon', 'Add to favorites')

	return (
		<section className="board-header">
			<div className="board-header-top">
				<div className="board-header-top-left">
					<h1 className="board-name title-font">{board.title}</h1>
					<span className="info-icon header-icon btn-primary">{ICON_INFO}</span>
					<span className="star-icon header-icon btn-primary">{ICON_STAR}</span>
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
