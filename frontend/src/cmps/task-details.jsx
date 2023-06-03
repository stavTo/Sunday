import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { boardService } from '../services/board.service.local'
import { ReactQuillWrapper } from './dynamic-task-cmps/react-quill-wrapper'
import { ICON_CLOSE } from '../assets/icons/icons'

export function TaskDetails() {
	const { taskId } = useParams()
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [group, setGroup] = useState(boardService.getGroupByTask(board, taskId))
	const [task, setTask] = useState({})
	const [isEditorOpen, setIsEditorOpen] = useState(false)
	const [commentToEdit, setCommentToEdit] = useState(boardService.getEmptyComment())
	const [comments, setComments] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		if (taskId && group?.id) {
			loadGroup()
			loadTask()
			loadComments()
		}
	}, [taskId, group, comments])

	function loadTask() {
		const task = boardService.getTaskById(board, group.id, taskId)
		setTask(task)
	}

	function loadGroup() {
		const newGroup = boardService.getGroupByTask(board, taskId)
		setGroup(newGroup)
	}

	function onCloseModal() {
		navigate(`/boards/${board._id}`)
	}

	async function onSaveComment() {
		const newComment = await boardService.saveComment(board, group.id, taskId, commentToEdit)
		setComments(prevComments => [newComment, ...prevComments])
		setIsEditorOpen(false)
	}

	function loadComments() {
		const currGroup = board.groups.find(g => g.id === group.id)
		const task = currGroup.tasks.find(t => t.id === taskId)
		// console.log(task)
		setComments(task.comments)
	}
	// console.log(board)
	// console.log(comments)
	if (!task) return
	return (
		<section className="task-details">
			<div className="close-modal-btn" onClick={onCloseModal}>
				{ICON_CLOSE}
			</div>
			<h1 className="task-details-title">{task.title}</h1>
			<div>
				<ul className="clean-list flex nav-bar">
					<li>
						<a className="btn-primary" href="">Updates |</a>
					</li>
					<li>
						<a className="btn-primary" href="">Files |</a>
					</li>
					<li>
						<a className="btn-primary" href="">Activity Log</a>
					</li>
				</ul>
			</div>
			<div className="separator"></div>

			<section className="editor-container">
				{isEditorOpen ? (
					<>
						<div className="new-post editor">
							<ReactQuillWrapper setCommentToEdit={setCommentToEdit} />
							{/* <div className="editor-toolbar">
                            Editing tool
                            </div>
                            <div className="separator"></div>
                        <textarea name="" id="" cols="30" rows="10"></textarea> */}
						</div>
						<div className="update-btn" onClick={onSaveComment}>
							Update
						</div>
					</>
				) : (
					<div className="new-post" onClick={() => setIsEditorOpen(true)}>
						Write an update...
					</div>
				)}

				<section className="comments-conatiner">
					<ul className="clean-list">
						{comments.map(comment => (
							<li className="comment" key={comment.id}>
								<div dangerouslySetInnerHTML={{ __html: comment.txt }}></div>
							</li>
						))}
					</ul>
				</section>
			</section>
		</section>
	)
}
