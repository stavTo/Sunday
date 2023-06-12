import { useEffect, useState } from 'react'
import { AddTask } from './add-task.jsx'
import { TaskPreview } from './task-preview.jsx'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'

export function TaskList({ tasks, group, setIsGroupSelected }) {
	const [activeTask, setActiveTask] = useState('')
	const checkedTaskIds = useSelector(({ selectedTaskModule }) => selectedTaskModule.checkedTaskIds)

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
			{(provided, snapshot) => (
				<ul className="task-list clean-list task-row" {...provided.droppableProps} ref={provided.innerRef}>
					{tasks.map((task, idx) => (
						<Draggable key={task.id} draggableId={task.id} index={idx}>
							{(provided, snapshot) => (
								<li
									className={`${activeTask === task.id && 'active'}`}
									onClick={() => setActiveTask(task.id)}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
									ref={provided.innerRef}
								>
									<TaskPreview
										setIsGroupSelected={setIsGroupSelected}
										checkedTaskIds={checkedTaskIds}
										group={group}
										task={task}
									/>
								</li>
							)}
						</Draggable>
					))}
					{provided.placeholder}
					<li>
						<AddTask group={group} />
					</li>
				</ul>
			)}
		</Droppable>
	)
}
