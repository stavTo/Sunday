import { Draggable, Droppable } from 'react-beautiful-dnd'
import { KanbanTaskPreview } from './kanban-task-preview'

export function KanbanGroupPreview({ group, statusLabel, isDragDisabled }) {
	return (
		<div className="kanban-group-preview clean-list">
			<div className="group-title" style={{ background: statusLabel.color }}>
				{statusLabel.title} / {group.length}
			</div>
			<Droppable droppableId={statusLabel.id}>
				{(provided, snapshot) => (
					<ul
						className="kanban-task-list clean-list"
						style={{
							backgroundColor: snapshot.isDraggingOver ? '#e6e9ef' : '',
						}}
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{group.map((task, idx) => (
							<Draggable key={task.id} draggableId={task.id} index={idx}>
								{provided => (
									<li
										{...provided.draggableProps}
										{...provided.dragHandleProps}
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
