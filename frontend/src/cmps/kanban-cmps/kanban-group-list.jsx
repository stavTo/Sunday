import { useSelector } from 'react-redux'
import { addGroup, saveBoard } from '../../store/selected-board.actions'
import { KanbanGroupPreview } from './kanban-group-preview'
import { ICON_ADD_GROUP } from '../../assets/icons/icons'
import { boardService } from '../../services/board.service.local'
import { showErrorMsg } from '../../services/event-bus.service'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useState } from 'react'

export function KanbanGroupList({ groups }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [isDragDisabled, setIsDragDisabled] = useState(false)
	function onAddGroup() {
		addGroup(board._id, true)
	}

	async function handleDrag(result) {
		if (!result.destination) return //if moved outside of containers, we exit.
		if (result.type === 'group') handleGroupDrag(result)
		else handleTaskDrag(result)
		setIsDragDisabled(false)
	}

	async function handleGroupDrag(result) {
		const newBoard = structuredClone(board)
		const groupToMove = newBoard.groups.splice(result.source.index, 1)[0]
		newBoard.groups.splice(result.destination.index, 0, groupToMove)
		// console.log(result)
		// console.log(newBoard)
		saveBoard(newBoard)
	}

	async function handleTaskDrag(result) {
		// find groupId and taskIdx in destination and source.
		const destinationGroupId = result.destination.droppableId
		const sourceGroupId = result.source.droppableId
		const destinationIdx = result.destination.index
		const sourceIdx = result.source.index
		const boardToSave = structuredClone(board)

		//if no changes were made, we exit.
		if (sourceGroupId === destinationGroupId && sourceIdx == destinationIdx) return

		// get the groups by ID
		const destinationGroup = boardService.getGroupById(board, destinationGroupId)
		const sourceGroup = boardService.getGroupById(board, sourceGroupId)

		//if group is the same, we use only source group. else, we use both groups.
		//TODO make this code DRY
		if (sourceGroupId === destinationGroupId) {
			const [task] = sourceGroup.tasks.splice(sourceIdx, 1)
			sourceGroup.tasks.splice(destinationIdx, 0, task)
		} else {
			const [task] = sourceGroup.tasks.splice(sourceIdx, 1)
			destinationGroup.tasks.splice(destinationIdx, 0, task)
		}

		// save changed groups to board. Source first, so if the change was made in source, we exit.
		boardToSave.groups = boardToSave.groups.map(g => {
			if (g.id === sourceGroupId) return sourceGroup
			else if (g.id === destinationGroupId) return destinationGroup
			return g
		})

		try {
			await saveBoard(boardToSave)
		} catch {
			showErrorMsg('failed')
		}
	}

	function onDragStart() {
		setIsDragDisabled(true)
	}

	if (!board._id) return

	return (
		<DragDropContext onDragEnd={handleDrag} onDragStart={onDragStart} disableDraggingDuringDrag={isDragDisabled}>
			<Droppable droppableId={board._id} type="group">
				{provided => (
					<section {...provided.droppableProps} ref={provided.innerRef} className="kanban-group-list">
						<ul className="clean-list">
							{groups.map((group, idx) => (
								<Draggable key={group.id} draggableId={group.id} index={idx}>
									{provided => (
										<li
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											ref={provided.innerRef}
										>
											<KanbanGroupPreview group={group} />
										</li>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</ul>
					</section>
				)}
			</Droppable>
		</DragDropContext>
	)
}