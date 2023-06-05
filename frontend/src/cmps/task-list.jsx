import { useEffect, useState } from 'react'
import { AddTask } from './add-task.jsx'
import { TaskListHeader } from './task-list-header.jsx'
import { TaskPreview } from './task-preview.jsx'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { GroupSummary } from './group-summary.jsx'
import { useSelector } from 'react-redux'
import { useEffectUpdate } from '../customHooks/useEffectUpdate.js'

export function TaskList({ tasks, group }) {
	const [activeTask, setActiveTask] = useState('')
	const checkedTaskIds = useSelector(({ selectedTaskModule }) => selectedTaskModule.checkedTaskIds)
	const [isGroupSelected, setIsGroupSelected] = useState(false)

	useEffect(() => {
		document.addEventListener('mousedown', unsetActiveTask)

		return () => {
			document.removeEventListener('mousedown', unsetActiveTask)
		}
	}, [])

	//TODO make this code better
	useEffectUpdate(() => {
		if (!checkedTaskIds.length) setIsGroupSelected(false)
	}, [checkedTaskIds])

	function unsetActiveTask() {
		setActiveTask('')
	}

	return (
		<Droppable droppableId={group.id}>
			{(provided, snapshot) => (
				<ul className="task-list clean-list task-row" {...provided.droppableProps} ref={provided.innerRef}>
					<TaskListHeader
						group={group}
						tasks={tasks}
						isGroupSelected={isGroupSelected}
						setIsGroupSelected={setIsGroupSelected}
					/>
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
					{console.log(provided.placeholder)}

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
