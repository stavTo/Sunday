import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useLocation } from 'react-router-dom'
import { boardService } from '../services/board.service'
import { ReactQuillWrapper } from './dynamic-task-cmps/react-quill-wrapper'
import { DEFAULT_USER, ICON_CLOCK, ICON_CLOSE, ICON_HOUSE, ICON_TRASH } from '../assets/icons/icons'
import { saveTask } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { utilService } from '../services/util.service'
import imgEmptyPage from '../assets/img/pulse-page-empty-state.svg'
import { ActivityPreview } from './activity-log-cmps/activity-preview'
import { userService } from '../services/user.service'

export function TaskDetails() {
	const { taskId, boardId } = useParams()
	const [task, setTask] = useState({})
	const [isEditorOpen, setIsEditorOpen] = useState(false)
	const [commentToEdit, setCommentToEdit] = useState('')
	const [isInputVisible, setIsInputVisible] = useState(false)
	const [titleToChange, setTitleToChange] = useState('')
	const [activeTab, setActiveTab] = useState('updates')
	const location = useLocation()
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()

	useEffect(() => {
		if (taskId && board._id) loadGroup()
		// eslint-disable-next-line
	}, [taskId, board])

	function handleKeyPressed(key) {
		if (key.key === 'Enter') setNewTitle()
		if (key.key === 'Escape') onEmptyInput()
	}

	function onEmptyInput() {
		setTitleToChange(task.title)
		setIsInputVisible(false)
	}

	async function loadGroup() {
		try {
			const currTask = boardService.getTaskById(board, taskId)
			setTitleToChange(currTask.title)
			setTask(currTask)
		} catch (err) {
			showErrorMsg('Had issue loading group')
		}
	}

	async function onCloseModal() {
		if (location.pathname.includes('kanban')) navigate(`/boards/${boardId}/views/kanban`)
		else navigate(`/boards/${boardId}`)
	}

	async function onSaveComment() {
		const newComment = {
			txt: commentToEdit,
			id: utilService.makeId(),
			by:
				user ||
				userService.getEmptyUser(
					'qwe23',
					'Stav Tohami',
					'https://res.cloudinary.com/diyikz4gq/image/upload/v1686577125/nb9ei638achmm1nsvhr6.jpg',
					'tohami2014@gmail.com'
				),
			createdAt: Date.now(),
		}
		const newTask = { ...task, comments: [newComment, ...task.comments] }
		try {
			const group = boardService.getGroupByTask(board, taskId)
			await saveTask(boardId, group.id, newTask, 'saved new comment')
			setCommentToEdit('')
			setIsEditorOpen(false)
		} catch (err) {
			showErrorMsg('Cant save comment')
		}
	}

	async function onDeleteComment(commentId) {
		const newTask = { ...task, comments: task.comments.filter(c => c.id !== commentId) }
		try {
			const group = boardService.getGroupByTask(board, taskId)
			await saveTask(boardId, group.id, newTask, 'saved new comment')
			setIsEditorOpen(false)
		} catch (err) {
			showErrorMsg("Can't remove comment")
		}
	}

	function handleClick(ev) {
		ev.stopPropagation()
		setIsInputVisible(prev => !prev)
	}

	function handleChange({ target }) {
		setTitleToChange(target.value)
	}

	async function setNewTitle() {
		setIsInputVisible(false)
		try {
			const newGroup = boardService.getGroupByTask(board, taskId)
			const newTask = { ...task, title: titleToChange }
			setTask(prev => ({ ...prev, title: titleToChange }))
			await saveTask(boardId, newGroup.id, newTask, 'changed task title')
		} catch {
			showErrorMsg('Cant save task')
		}
	}
	if (!task || !task.comments) return
	return (
		<>
			<div className="details-back-panel"></div>
			<section className="task-details">
				<span className="close-modal-btn" onClick={onCloseModal}>
					{ICON_CLOSE}
				</span>
				<div className="task-details-title">
					{!isInputVisible && <div onClick={handleClick}>{task.title}</div>}
					{isInputVisible && (
						<input
							autoFocus={true}
							onBlur={setNewTitle}
							onClick={ev => ev.stopPropagation()}
							onKeyDown={handleKeyPressed}
							className="title-input"
							id="title"
							name="title"
							value={titleToChange}
							onChange={handleChange}
						></input>
					)}
				</div>

				<ul className="clean-list flex board-nav-bar">
					<li
						onClick={() => setActiveTab('updates')}
						className={`${activeTab === 'updates' ? 'active' : ''}`}
					>
						<div className="btn-primary">
							<span href="#">{ICON_HOUSE} Updates</span>
						</div>
					</li>
					<li
						onClick={() => setActiveTab('activity')}
						className={`${activeTab === 'activity' ? 'active' : ''}`}
					>
						<div className="btn-primary">
							<span href="#">Activity Log</span>
						</div>
					</li>
				</ul>

				{/* Condition rendering starts here */}
				{activeTab === 'updates' ? (
					<section className="editor-container ">
						{isEditorOpen ? (
							<>
								<div className="new-post editor text-cursor">
									<ReactQuillWrapper setCommentToEdit={setCommentToEdit} />
								</div>
								<div className="update-btn pointer" onClick={onSaveComment}>
									Update
								</div>
							</>
						) : (
							<div className="new-post" onClick={() => setIsEditorOpen(true)}>
								Write an update...
							</div>
						)}

						<section className="comments-container">
							<ul className="clean-list">
								{!!task.comments.length ? (
									task.comments.map(comment => (
										<li className="comment" key={comment.id}>
											<div className="top-container">
												<div className="userinfo">
													<img src={comment?.by?.imgUrl || DEFAULT_USER} alt="user img" />
													<span className="user">{comment.by.fullname}</span>
												</div>
												<div className="comment-toolbar">
													<span
														onClick={() => onDeleteComment(comment.id)}
														className="trash-container btn-primary"
													>
														{ICON_TRASH}
													</span>
													<span className="time-since">
														{ICON_CLOCK}
														<span>{utilService.timeSince(comment.createdAt)}</span>
													</span>
												</div>
											</div>
											<div
												className="txt-container"
												dangerouslySetInnerHTML={{ __html: comment.txt }}
											></div>
										</li>
									))
								) : (
									<div className="no-comments">
										<div className="img-container">
											<img src={imgEmptyPage} alt="" />
										</div>
										<div className="titles-container">
											<h2>No updates yet for this item</h2>
											<p>
												Be the first one to update about progress, mention someone or upload
												files to share with your team members
											</p>
										</div>
									</div>
								)}
							</ul>
						</section>
					</section>
				) : (
					<TaskActivityLog board={board} taskId={taskId} />
				)}
			</section>
		</>
	)
}

function TaskActivityLog({ board, taskId }) {
	const [activities, setActivities] = useState([])
	const [filter, setFilter] = useState(boardService.getActivityFilter(taskId))

	useEffect(() => {
		setActivities(boardService.loadActivities(board, filter))
	}, [filter, board])

	return (
		<div className="activity-list">
			<ul className="clean-list">
				{activities.map(activity => {
					return (
						<li key={activity.id}>
							<ActivityPreview activity={activity} filter={filter} />
						</li>
					)
				})}
			</ul>
		</div>
	)
}
