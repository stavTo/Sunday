import { useSelector } from 'react-redux'
import { MemberPicker } from '../dynamic-task-cmps/member-picker'
import { ICON_CONVERSATION, ICON_CONVERSATION_EMPTY, ICON_OPTIONS } from '../../assets/icons/icons'
import { boardService } from '../../services/board.service'
import { LabelPicker } from '../dynamic-task-cmps/label-picker'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TippyContainer } from '../tippy-container'
import { TaskOptionsMenu } from '../task-options-menu'
import { BoardLoader } from '../board-loader'

export function KanbanTaskPreview({ task }) {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const [isOptionOpen, setIsOptionOpen] = useState()
	const [group, setGroup] = useState(boardService.getGroupByTask(board, task.id))

	useEffect(() => {
		document.addEventListener('mousedown', onSetOptionClose)
		return () => {
			document.removeEventListener('mousedown', onSetOptionClose)
		}
	}, [])

	function onSetOptionClose(ev) {
		if (ev.target.closest('.options-menu')) return
		setIsOptionOpen(false)
	}

	console.log(task.status)

	return (
		<div className="kanban-task-preview">
			<div className="kanban-task-header">
				<span className="kanban-task-title">{task.title}</span>
				<div className="kanban-task-toolbar">
					<Link
						className={`conversation-icon-container ${task.comments.length ? 'comments-available' : ''}`}
						to={`/boards/${board._id}/views/kanban/tasks/${task.id}`}
					>
						{!task.comments.length && (
							<TippyContainer txt="Start conversation">
								<div>{ICON_CONVERSATION_EMPTY}</div>
							</TippyContainer>
						)}
						{!!task.comments.length && (
							<TippyContainer txt="Add to conversation">
								<div>
									{ICON_CONVERSATION} <span className="updates-count">{task.comments.length}</span>
								</div>
							</TippyContainer>
						)}
					</Link>
					<div className="options-container">
						<div onClick={() => setIsOptionOpen(prev => !prev)} className="task-options btn-primary">
							{ICON_OPTIONS}
						</div>
						{isOptionOpen && (
							<TaskOptionsMenu
								kanbanStatus={task.status}
								task={task}
								group={group}
								setIsOptionOpen={setIsOptionOpen}
							/>
						)}
					</div>
				</div>
			</div>
			<ul className="kanban-member-picker clean-list kanban-row">
				<li>Owner</li>
				<MemberPicker groupId={group.id} type="ownerPicker" task={task} defaultWidth="140px" />
			</ul>
			<ul className="kanban-priority-picker clean-list kanban-row">
				<li>Priority</li>
				<LabelPicker type="priorityPicker" task={task} groupId={group.id} defaultWidth="140px" />
			</ul>
		</div>
	)
}
