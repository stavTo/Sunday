import { TaskListHeader } from './task-list-header.jsx'
import { TaskPreview } from './task-preview.jsx'

export function TaskList({ board, tasks, groupId }) {
	return (
		<ul className="task-list clean-list">
			<TaskListHeader groupId={groupId} tasks={tasks} />
			{tasks.map(task => (
				<li key={task.id}>
					<TaskPreview groupId={groupId} board={board} task={task} />
				</li>
			))}
		</ul>
	)
}
