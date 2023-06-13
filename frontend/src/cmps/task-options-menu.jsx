import { useParams } from 'react-router'
import { useLocation } from 'react-router-dom'
import { ICON_ADD_GROUP, ICON_COPY_LINK, ICON_DUPLICATE, ICON_OPEN, ICON_TRASH } from '../assets/icons/icons'
import { Link } from 'react-router-dom'
import { duplicateTask, removeTask } from '../store/selected-board.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service'

export function TaskOptionsMenu({ task, group, setIsOptionOpen, kanbanStatus }) {
	const { boardId } = useParams()
	const location = useLocation()

	async function onDuplicateTask(boolean) {
		setIsOptionOpen(false)
		let newTask
		if (kanbanStatus) {
			boolean = true
			newTask = boardService.getEmptyTask('New Task', kanbanStatus)
		} else {
			newTask = task
		}
		try {
			const action = {
				description: newTask.title,
				groupTitle: group.title,
				groupColor: group.style.color,
				type: 'Duplicated task',
			}
			await duplicateTask(boardId, group, newTask, boolean, action)
		} catch {
			showErrorMsg('cant duplicate task')
		}
	}

	async function onRemoveTask() {
		setIsOptionOpen(false)
		try {
			const action = {
				description: task.title,
				groupTitle: group.title,
				groupColor: group.style.color,
				type: 'Deleted task',
			}
			await removeTask(boardId, task.id, action)
		} catch {
			showErrorMsg('cant delete task')
		}
	}

	async function getUrlTaskDetails() {
		setIsOptionOpen(false)
		try {
			await navigator.clipboard.writeText(window.location.href + `/tasks/${task.id}`)
			showSuccessMsg('Link copied')
		} catch (err) {
			showErrorMsg('Failed to copy URL to clipboard')
		}
	}

	return (
		<section className="task-options-menu">
			<section className="options-menu">
				<Link
					onClick={() => setIsOptionOpen(false)}
					className="btn-primary"
					to={location.pathname + `/tasks/${task.id}`}
				>
					<span className="option-group-icon">{ICON_OPEN}</span>
					<span className="title">Open</span>
				</Link>
				<div onClick={() => onDuplicateTask(true)} className="btn-primary">
					<span className="option-group-icon">{ICON_DUPLICATE}</span>
					<span className="title"> Duplicate this task</span>
				</div>
				<div onClick={getUrlTaskDetails} className="btn-primary">
					<span className="option-group-icon">{ICON_COPY_LINK} </span>
					<span className="title">Copy task link</span>
				</div>
				<div onClick={() => onDuplicateTask(false)} className="btn-primary">
					<span className="option-group-icon">{ICON_ADD_GROUP}</span>
					<span className="title"> Create new task below</span>
				</div>
				<div onClick={onRemoveTask} className="remove-group btn-primary">
					<span className="option-group-icon">{ICON_TRASH}</span>
					<span className="title"> Delete task</span>
				</div>
			</section>
		</section>
	)
}
