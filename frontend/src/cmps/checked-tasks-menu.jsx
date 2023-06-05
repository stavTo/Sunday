import { useDispatch } from 'react-redux'
import { ICON_CLOSE } from '../assets/icons/icons'
import { SET_CHECKED_TASKS } from '../store/selected-task.reducer'

export function CheckedTasksMenu({ checkedTaskIds }) {
	const dispatch = useDispatch()

	function onCloseModal() {
		dispatch({ type: SET_CHECKED_TASKS, taskIds: [] })
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
					<span className="action-item">{ICON_CLOSE} Duplicate</span>
					<span className="action-item">{ICON_CLOSE} Export</span>
					<span className="action-item">{ICON_CLOSE} Delete</span>
					<span className="action-item">{ICON_CLOSE} Move to</span>
				</div>
			</div>
			<div className="close-checked-modal" onClick={onCloseModal}>
				{ICON_CLOSE}
			</div>
		</div>
	)
}
