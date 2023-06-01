import { addEmptyGroup, addTaskToFirstGroup } from '../store/selected-board.actions'
import { BoardFilter } from './board-filter'
import { BoardToolbar } from './board-toolbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

export function BoardHeader({ board }) {
	function onAddGroup() {
		addEmptyGroup(board._id, false)
	}

	function onAddTask() {
		addTaskToFirstGroup(board._id)
	}

	return (
		<section className="board-header">
			<div className="board-header-top">
				<h1 className="board-name title-font">{board.title}</h1>
			</div>
			<BoardToolbar />
			<div className="board-header-bottom">
				<button className="btn-new-task btn-text" onClick={onAddTask}>
					New Task
				</button>
				<button className="btn-new-task btn-icon" onClick={onAddGroup}>
					<FontAwesomeIcon icon={faAngleDown} />
				</button>
				<BoardFilter />
			</div>
		</section>
	)
}
