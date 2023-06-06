import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { boardService } from '../services/board.service.local'
import { ReactQuillWrapper } from './dynamic-task-cmps/react-quill-wrapper'
import { ICON_CLOSE, ICON_HOUSE } from '../assets/icons/icons'
import { loadBoard, saveTask } from '../store/selected-board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { UserCardLoader } from './user-card-loader'
import { useSelector } from 'react-redux'
import { utilService } from '../services/util.service'
import imgEmptyPage from '../assets/img/img/pulse-page-empty-state.svg'
import { useEffectUpdate } from '../customHooks/useEffectUpdate'

export function TaskDetails() {
	const { taskId, boardId } = useParams()
	const [task, setTask] = useState({})
	const [isEditorOpen, setIsEditorOpen] = useState(false)
	const [commentToEdit, setCommentToEdit] = useState('')
	const [comments, setComments] = useState([])
	const [isInputVisible, setIsInputVisible] = useState(false)
	const [titleToChange, setTitleToChange] = useState('')
	const [activeTab, setActiveTab] = useState('updates')
	const isLoading = useSelector(({ selectedBoardModule }) => selectedBoardModule.isLoading)
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const navigate = useNavigate()

	useEffect(() => {
		if (taskId && board._id) loadGroup()
	}, [taskId])

	useEffect(() => {
		document.addEventListener('click', onCloseEditor)
		return () => {
			document.removeEventListener('click', onCloseEditor)
		}
	}, [])

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
			const newGroup = boardService.getGroupByTask(board, taskId)
			const currTask = boardService.getTaskById(board, newGroup.id, taskId)
			setTitleToChange(currTask.title)
			setComments(currTask.comments)
			setTask(currTask)
		} catch (err) {
			console.log(err)
			console.log('had issue in load-group')
		}
	}

	function onCloseEditor(ev) {
		if (ev.target.closest('.editor , .update-btn , .new-post, input')) return
		setIsEditorOpen(false)
		setIsInputVisible(false)
	}

	async function onCloseModal() {
		navigate(`/boards/${boardId}`)
	}

	async function onSaveComment() {
		const newComment = { txt: commentToEdit, id: utilService.makeId() }
		const newTask = { ...task, comments: [newComment, ...task.comments] }
		try {
			const group = boardService.getGroupByTask(board, taskId)
			await saveTask(boardId, group.id, newTask, 'saved new comment')

			setComments(prevComments => [newComment, ...prevComments])
			setCommentToEdit('')
			setIsEditorOpen(false)
		} catch (err) {
			console.log('Cant save comment')
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
	if (!task || !comments) return
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
				<div>
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
				</div>

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
							{!!comments.length ? (
								comments.map(comment => (
									<li className="comment" key={comment.id}>
										<div dangerouslySetInnerHTML={{ __html: comment.txt }}></div>
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
											Be the first one to update about progress, mention someone or upload files
											to share with your team members
										</p>
									</div>
								</div>
							)}
						</ul>
					</section>
				</section>
			</section>
		</>
	)
}
