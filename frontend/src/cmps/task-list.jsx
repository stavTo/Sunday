import { useEffect, useState } from 'react'
import { AddTask } from './add-task.jsx'
import { TaskListHeader } from './task-list-header.jsx'
import { TaskPreview } from './task-preview.jsx'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { GroupSummary } from './group-summary.jsx'

export function TaskList({ tasks, group }) {
	const [activeTask, setActiveTask] = useState('')

	useEffect(() => {
		document.addEventListener('mousedown', unsetActiveTask)

		return () => {
			document.removeEventListener('mousedown', unsetActiveTask)
		}
	}, [])

	function unsetActiveTask() {
		setActiveTask('')
	}

	return (
		<Droppable droppableId={group.id}>
			{provided => (
				<ul className="task-list clean-list task-row" {...provided.droppableProps} ref={provided.innerRef}>
					<TaskListHeader group={group} tasks={tasks} />
					{tasks.map((task, idx) => (
						<Draggable key={task.id} draggableId={task.id} index={idx}>
							{provided => (
								<li
									className={`${activeTask === task.id && 'active'}`}
									onClick={() => setActiveTask(task.id)}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
									ref={provided.innerRef}
								>
									<TaskPreview group={group} task={task} />
								</li>
							)}
						</Draggable>
					))}
					{provided.placeholder}
					<li>
						<AddTask group={group} />
					</li>

					<li>
						<GroupSummary group={group} />
					</li>
				</ul>
			)}
		</Droppable>
	)
}
