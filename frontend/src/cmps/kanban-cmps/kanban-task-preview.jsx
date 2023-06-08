import { useSelector } from 'react-redux'
import { MemberPicker } from '../dynamic-task-cmps/member-picker'
import { ICON_CONVERSATION, ICON_CONVERSATION_EMPTY } from '../../assets/icons/icons'
import { boardService } from '../../services/board.service'
import { LabelPicker } from '../dynamic-task-cmps/label-picker'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TippyContainer } from '../tippy-container'

export function KanbanTaskPreview({ task }) {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const [groupId, setGroupId] = useState()

	useEffect(() => {
		setGroupId(boardService.getGroupByTask(board, task.id).id)
	}, [task])

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
					<span className="task-options"></span>
				</div>
			</div>
			<ul className="kanban-member-picker clean-list kanban-row">
				<li>Owner</li>
				<MemberPicker groupId={groupId} type="ownerPicker" task={task} defaultWidth="140px" />
			</ul>
			<ul className="kanban-priority-picker clean-list kanban-row">
				<li>Priority</li>
				<LabelPicker type="priorityPicker" task={task} groupId={groupId} defaultWidth="140px" />
			</ul>
		</div>
	)
}
