import { useDispatch } from 'react-redux'
import { ICON_CLOSE } from '../assets/icons/icons'
import { SET_CHECKED_TASKS } from '../store/selected-task.reducer'
import { VscTrash } from 'react-icons/vsc'
import { IoDocumentsOutline } from 'react-icons/io5'
import { duplicateTask, removeBatchTasks } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { boardService } from '../services/board.service'
import { useEffect, useState } from 'react'
export function CheckedTasksMenu({ checkedTaskIds }) {
	const dispatch = useDispatch()
	const [groupColors, setGroupColors] = useState([])
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	function onCloseModal() {
		dispatch({ type: SET_CHECKED_TASKS, taskIds: [] })
	}

	useEffect(() => {
		getAllTaskColors()
		// eslint-disable-next-line
	}, [checkedTaskIds])

	function getAllTaskColors() {
		const colors = checkedTaskIds.map(taskId => boardService.getGroupByTask(board, taskId).style.color)
		setGroupColors(colors)
	}

	async function onRemove() {
		const actions = checkedTaskIds.map(taskId => {
			const group = boardService.getGroupByTask(board, taskId)
			const task = boardService.getTaskById(board, taskId)
			return {
				description: task.title,
				groupTitle: group.title,
				groupColor: group.style.color,
				type: 'Deleted task',
			}
		})
		try {
			await removeBatchTasks(board._id, checkedTaskIds, actions)
		} catch {
			showErrorMsg('Error deleting tasks')
		}
	}

	async function onDuplicate() {
		for (let taskId of checkedTaskIds) {
			try {
				const group = await boardService.getGroupByTask(board, taskId)
				const task = await boardService.getTaskById(board, taskId)
				await duplicateTask(board._id, group, task, true)
			} catch (err) {
				showErrorMsg('Error duplicating tasks')
			}
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
					<span className="dots">
						{groupColors.map((color, idx) => (
							<div key={idx} className="dot" style={{ backgroundColor: color }}></div>
						))}
					</span>
				</div>
				<div className="actions-container">
					<span className="action-item" onClick={onDuplicate}>
						<IoDocumentsOutline /> Duplicate
					</span>
					<span className="action-item" onClick={onRemove}>
						<VscTrash /> Delete
					</span>
					{/* <span className="action-item">
						<HiOutlineArrowRightCircle /> Move to
					</span> */}
				</div>
			</div>
			<div className="close-checked-modal" onClick={onCloseModal}>
				{ICON_CLOSE}
			</div>
		</div>
	)
}
