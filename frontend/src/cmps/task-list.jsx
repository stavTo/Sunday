import { taskService } from '../services/task.service.js'
import { TaskListHeader } from './task-list-header.jsx'
import { TaskPreview } from './task-preview.jsx'

export function TaskList({ board, tasks }) {
	return (
		<ul className="task-list clean-list">
			<TaskListHeader tasks={tasks} />
			{tasks.map(task => (
				<li key={task.id}>
					<TaskPreview board={board} task={task} />
				</li>
			))}
		</ul>
	)
}
