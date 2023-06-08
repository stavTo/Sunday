import { Draggable, Droppable } from 'react-beautiful-dnd'
import { KanbanTaskPreview } from './kanban-task-preview'

export function KanbanGroupPreview({ group, statusLabel }) {
	return (
		<div className="kanban-group-preview clean-list">
			<div className="group-title" style={{ background: statusLabel.color }}>
				{statusLabel.title} / {group.length}
			</div>
			<Droppable droppableId={statusLabel.id}>
				{provided => (
					<ul className="kanban-task-list clean-list" {...provided.droppableProps} ref={provided.innerRef}>
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
