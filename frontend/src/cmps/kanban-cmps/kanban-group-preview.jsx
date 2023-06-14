import { Draggable, Droppable } from 'react-beautiful-dnd'
import { KanbanTaskPreview } from './kanban-task-preview'

export function KanbanGroupPreview({ group, statusLabel, groupSnapshot }) {
	return (
		<div className="kanban-group-preview clean-list" style={{ rotate: groupSnapshot.isDragging ? '5deg' : '' }}>
			<div className="group-title" style={{ background: statusLabel.color }}>
				{statusLabel.title || 'Blank'} / {group.length}
			</div>
			<Droppable droppableId={statusLabel.id}>
				{(provided, snapshot) => (
					<ul
						className="kanban-task-list clean-list"
						style={{
							backgroundColor: snapshot.isDraggingOver ? '#dcdfec' : '',
						}}
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{group.map((task, idx) => (
							<Draggable key={task.id} draggableId={task.id} index={idx}>
								{(provided, snapshot) => (
									<li
										{...provided.dragHandleProps}
										{...provided.draggableProps}
										ref={provided.innerRef}
									>
										<KanbanTaskPreview task={task} />
									</li>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</ul>
				)}
			</Droppable>
		</div>
	)
}
