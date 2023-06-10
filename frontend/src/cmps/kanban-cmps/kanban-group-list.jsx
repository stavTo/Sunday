import { useSelector } from 'react-redux'
import { KanbanGroupPreview } from './kanban-group-preview'
import { boardService } from '../../services/board.service'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'
import { saveTask } from '../../store/selected-board.actions'
import { showErrorMsg } from '../../services/event-bus.service'

export function KanbanGroupList({ groups }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [isDragDisabled, setIsDragDisabled] = useState(false)
	const [groupsByLabels, setGroupsByLabels] = useState()

	useEffect(() => {
		onSetGroupsByLabels()
	}, [board])

	function onSetGroupsByLabels() {
		const newGroups = board.statusLabels.reduce(
			(acc, status) => {
				groups.forEach(group =>
					group.tasks.forEach(task => {
						if (task.status === status.id) {
							if (acc[status.id]) acc[status.id].push(task)
							else acc[status.id] = [task]
						}
					})
				)
				return acc
			},
			{ order: ['s101', 's102', 's103', 's104', 's105'] }
		)
		console.log(newGroups)
		setGroupsByLabels(newGroups)
	}

	async function handleDrag(result) {
		if (!result.destination) return //if moved outside of containers, we exit.
		if (result.type === 'group') await handleGroupDrag(result)
		else await handleTaskDrag(result)
		setIsDragDisabled(false)
	}

	async function handleGroupDrag(result) {}

	async function handleTaskDrag(result) {
		const destinationStatus = result.destination.droppableId
		const sourceGroupId = result.source.droppableId
		const destinationIdx = result.destination.index
		const sourceIdx = result.source.index
		const taskId = result.draggableId
		// const boardToSave = structuredClone(board)
		if (sourceGroupId === destinationStatus && sourceIdx === destinationIdx) return
		//TODO find task
		//TODO find if same group rearange, if different group change status

		if (sourceGroupId === destinationStatus) {
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

	return (
		<DragDropContext onDragEnd={handleDrag} onDragStart={onDragStart} disableDraggingDuringDrag={isDragDisabled}>
			<Droppable droppableId={board._id} direction="horizontal" type="group">
				{provided => (
					<ul {...provided.droppableProps} ref={provided.innerRef} className="kanban-group-list clean-list">
						{Object.keys(groupsByLabels).map((labelId, idx) => {
							if (labelId === 'order') return
							return (
								<Draggable key={labelId} draggableId={labelId} index={idx}>
									{(provided, snapshot) => (
										<li
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											ref={provided.innerRef}
										>
											<KanbanGroupPreview
												isDragDisabled={isDragDisabled}
												statusLabel={boardService.getStatusLabelById(board, labelId)}
												group={groupsByLabels[labelId]}
											/>
										</li>
									)}
								</Draggable>
							)
						})}
						{provided.placeholder}
					</ul>
				)}
			</Droppable>
		</DragDropContext>
	)
}
