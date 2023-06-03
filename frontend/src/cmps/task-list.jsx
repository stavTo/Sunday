import { useState } from 'react'
import { AddTask } from './add-task.jsx'
import { TaskListHeader } from './task-list-header.jsx'
import { TaskPreview } from './task-preview.jsx'

export function TaskList({ tasks, group }) {
	return (
		<ul className="task-list clean-list" style={{ borderInlineStart: `6px solid ${group.style.color}` }}>
			<TaskListHeader groupId={group.id} tasks={tasks} />
			{tasks.map(task => (
				<li key={task.id}>
					<TaskPreview groupId={group.id} task={task} />
				</li>
			))}
			<li>
				<AddTask groupId={group.id} />
			</li>
		</ul>
	)
}
