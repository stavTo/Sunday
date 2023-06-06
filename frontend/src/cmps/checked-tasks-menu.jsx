import { useDispatch } from 'react-redux'
import { ICON_CLOSE, ICON_DUPLICATE, ICON_TRASH } from '../assets/icons/icons'
import { SET_CHECKED_TASKS } from '../store/selected-task.reducer'
import { HiOutlineArrowRightCircle } from 'react-icons/hi2'
import { VscTrash } from 'react-icons/vsc'
import { IoDocumentsOutline } from 'react-icons/io5'
import { removeTask } from '../store/selected-board.actions'
export function CheckedTasksMenu({ checkedTaskIds }) {
	const dispatch = useDispatch()

	function onCloseModal() {
		dispatch({ type: SET_CHECKED_TASKS, taskIds: [] })
	}

	async function onRemove() {
		for (let taskId of checkedTaskIds) {
			await removeTask(taskId)
		}
	}

	return (
		<div className="checked-tasks-menu">
			<div className="checked-tasks-count">
				<span>{checkedTaskIds.length}</span>
			</div>
			<div className="main-checked-container">
				<div className="title-section">
					<span className="title">Tasks Selected</span>
					<span>Dots here soon</span>
				</div>
				<div className="actions-container">
					<span className="action-item">
						<IoDocumentsOutline /> Duplicate
					</span>
					{/* <span className="action-item"> Export</span> */}
					<span className="action-item" onClick={onRemove}>
						<VscTrash /> Delete
					</span>
					<span className="action-item">
						<HiOutlineArrowRightCircle /> Move to
					</span>
				</div>
			</div>
			<div className="close-checked-modal" onClick={onCloseModal}>
				{ICON_CLOSE}
			</div>
		</div>
	)
}
