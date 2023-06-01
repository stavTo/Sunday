import { AddTask } from './add-task.jsx'
import { TaskListHeader } from './task-list-header.jsx'
import { TaskPreview } from './task-preview.jsx'

export function TaskList({ tasks, groupId }) {
	return (
		<ul className="task-list clean-list">
			<TaskListHeader groupId={groupId} tasks={tasks} />
			{tasks.map(task => (
				<li key={task.id}>
					<TaskPreview groupId={groupId} task={task} />
				</li>
			))}
			<li>
				<AddTask groupId={groupId} />
			</li>
		</ul>
	)
}
