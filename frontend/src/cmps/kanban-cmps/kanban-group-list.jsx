import { useSelector } from 'react-redux'
import { addGroup, saveBoard } from '../../store/selected-board.actions'
import { KanbanGroupPreview } from './kanban-group-preview'
import { ICON_ADD_GROUP } from '../../assets/icons/icons'
import { boardService } from '../../services/board.service'
import { showErrorMsg } from '../../services/event-bus.service'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'

export function KanbanGroupList({ groups }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [isDragDisabled, setIsDragDisabled] = useState(false)
	const [groupsByLabels, setGroupsByLabels] = useState()

	useEffect(() => {
		onSetGroupsByLabels()
	}, [board])

	function onSetGroupsByLabels() {
		const newGroups = board.statusLabels.reduce((acc, status) => {
			groups.forEach(group =>
				group.tasks.forEach(task => {
					if (task.status === status.id) {
						if (acc[status.id]) acc[status.id].push(task)
						else acc[status.id] = [task]
					}
				})
			)
			return acc
		}, {})
		setGroupsByLabels(newGroups)
	}

	async function handleDrag(result) {
		if (!result.destination) return //if moved outside of containers, we exit.
		if (result.type === 'group') handleGroupDrag(result)
		else handleTaskDrag(result)
		setIsDragDisabled(false)
	}

	async function handleGroupDrag(result) {}

	async function handleTaskDrag(result) {
		const destinationGroupId = result.destination.droppableId
		const sourceGroupId = result.source.droppableId
		const destinationIdx = result.destination.index
		const sourceIdx = result.source.index
		const boardToSave = structuredClone(board)
		if (sourceGroupId === destinationGroupId && sourceIdx == destinationIdx) return
	}

	function onDragStart() {
		setIsDragDisabled(true)
	}

	console.log(groupsByLabels)
	if (!board._id || !groupsByLabels) return

	return (
		<DragDropContext onDragEnd={handleDrag} onDragStart={onDragStart} disableDraggingDuringDrag={isDragDisabled}>
			<Droppable droppableId={board._id} direction="horizontal" type="group">
				{provided => (
					<ul {...provided.droppableProps} ref={provided.innerRef} className="kanban-group-list clean-list">
						{Object.keys(groupsByLabels).map((labelId, idx) => (
							<Draggable key={labelId} draggableId={labelId} index={idx}>
								{provided => (
									<li
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
									>
										<KanbanGroupPreview
											statusLabel={boardService.getStatusLabelById(board, labelId)}
											group={groupsByLabels[labelId]}
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
