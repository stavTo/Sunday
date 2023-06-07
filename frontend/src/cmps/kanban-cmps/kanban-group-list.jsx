import { useSelector } from 'react-redux'
import { addGroup, saveBoard } from '../../store/selected-board.actions'
import { KanbanGroupPreview } from './kanban-group-preview'
import { ICON_ADD_GROUP } from '../../assets/icons/icons'
import { boardService } from '../../services/board.service'
import { showErrorMsg } from '../../services/event-bus.service'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useState } from 'react'

export function KanbanGroupList({ groups }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [isDragDisabled, setIsDragDisabled] = useState(false)
	function onAddGroup() {
		addGroup(board._id, true)
	}

	async function handleDrag(result) {}

	async function handleGroupDrag(result) {}

	async function handleTaskDrag(result) {}

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
