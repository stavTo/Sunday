import { useState } from 'react'
import { AddTask } from './add-task.jsx'
import { TaskListHeader } from './task-list-header.jsx'
import { TaskPreview } from './task-preview.jsx'

export function TaskList({ tasks, group }) {
	return (
		<ul className="task-list clean-list">
			<TaskListHeader group={group} tasks={tasks} />
			{tasks.map(task => (
				<li key={task.id}>
					<TaskPreview group={group} task={task} />
				</li>
			))}
			<li>
				<AddTask group={group} />
			</li>
		</ul>
	)
}
