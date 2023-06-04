import { useState } from 'react'
import { AddTask } from './add-task.jsx'
import { TaskListHeader } from './task-list-header.jsx'
import { TaskPreview } from './task-preview.jsx'
import { Droppable, Draggable } from 'react-beautiful-dnd'

export function TaskList({ tasks, group }) {
	return (
		<Droppable droppableId={group.id}>
			{provided => (
				<ul className="task-list clean-list" {...provided.droppableProps} ref={provided.innerRef}>
					<TaskListHeader group={group} tasks={tasks} />
					{tasks.map((task, idx) => (
						<Draggable key={task.id} draggableId={task.id} index={idx}>
							{provided => (
								<li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
									<TaskPreview group={group} task={task} />
								</li>
							)}
						</Draggable>
					))}
					<li>
						<AddTask group={group} />
					</li>
					{provided.placeholder}
				</ul>
			)}
		</Droppable>
	)
}
