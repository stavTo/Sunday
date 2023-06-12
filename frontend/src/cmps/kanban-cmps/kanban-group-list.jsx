import { useSelector } from 'react-redux'
import { KanbanGroupPreview } from './kanban-group-preview'
import { boardService } from '../../services/board.service'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useEffect, useMemo, useState } from 'react'
import { saveBoard, saveTask } from '../../store/selected-board.actions'
import { showErrorMsg } from '../../services/event-bus.service'

export function KanbanGroupList({ groups }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [isDragDisabled, setIsDragDisabled] = useState(false)
	// const [groupsByLabels, setGroupsByLabels] = useState()
	// console.log('render')

	// useEffect(() => {
	// 	onSetGroupsByLabels()
	// }, [board])

	// function onSetGroupsByLabels() {
	// 	const groupsByLabels = board.statusLabels.reduce((acc, status, idx) => {
	// 		const tasks = groups.flatMap(group => group.tasks.filter(task => task.status === status.id))
	// 		acc.push({ status: status.id, tasks })
	// 		return acc
	// 	}, [])
	// 	setGroupsByLabels(groupsByLabels)
	// }

	const groupsByLabels = useMemo(() => {
		return board.statusLabels.reduce((acc, status, idx) => {
			const tasks = groups.flatMap(group => group.tasks.filter(task => task.status === status.id))
			acc.push({ status: status.id, tasks })
			return acc
		}, [])
	}, [board])

	async function handleDrag(result) {
		if (!result.destination) return //if moved outside of containers, we exit.
		if (result.type === 'group') await handleGroupDrag(result)
		else await handleTaskDrag(result)
		setIsDragDisabled(false)
	}

	async function handleGroupDrag(result) {
		const newBoard = structuredClone(board)
		const groupToMove = newBoard.statusLabels.splice(result.source.index, 1)[0]
		newBoard.statusLabels.splice(result.destination.index, 0, groupToMove)
		try {
			await saveBoard(newBoard)
		} catch {
			showErrorMsg('Something went wrong')
		}
	}

	async function handleTaskDrag(result) {
		const destinationStatus = result.destination.droppableId
		const sourceStatus = result.source.droppableId
		const destinationIdx = result.destination.index
		const sourceIdx = result.source.index
		const taskId = result.draggableId
		if (sourceStatus === destinationStatus && sourceIdx === destinationIdx) return
		//TODO find task
		//TODO find if same group rearange, if different group change status

		if (sourceStatus === destinationStatus) {
		}
		// change task label
		else {
			const task = boardService.getTaskById(board, taskId)
			const group = boardService.getGroupByTask(board, taskId)
			task.status = destinationStatus

			try {
				await saveTask(board._id, group.id, task)
			} catch {
				showErrorMsg('Something went wrong')
			}
		}
	}

	function onDragStart() {
		setIsDragDisabled(true)
	}

	if (!board._id || !groupsByLabels) return
	// console.log(groupsByLabels)
	return (
		<DragDropContext onDragEnd={handleDrag} onDragStart={onDragStart} disableDraggingDuringDrag={isDragDisabled}>
			<Droppable droppableId={board._id} direction="horizontal" type="group">
				{provided => (
					<ul
						{...provided.droppableProps}
						ref={provided.innerRef}
						className="kanban-group-list clean-list default-scroll"
					>
						{groupsByLabels.map((group, idx) => (
							<Draggable key={group.status} draggableId={group.status} index={idx}>
								{(provided, snapshot) => (
									<li
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
									>
										<KanbanGroupPreview
											isDragDisabled={isDragDisabled}
											statusLabel={boardService.getStatusLabelById(board, group.status)}
											group={group.tasks}
										/>
									</li>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</ul>
				)}
			</Droppable>
		</DragDropContext>
	)
}
