<<<<<<< HEAD
=======
import { taskService } from '../services/task.service.js'
>>>>>>> 5d6c3a02c1123564e6be2ad64fd14b056dffe8d3
import { TaskListHeader } from './task-list-header.jsx'
import { TaskPreview } from './task-preview.jsx'

<<<<<<< HEAD
export function TaskList(tasks) {

    return (
        <ul className="task-list">
            <TaskListHeader task={tasks} />
            {tasks.map((task) => 
                <li key={task._id}>
                    <TaskPreview task={task} />
                </li>
            )}
        </ul>
    )
}
=======
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
>>>>>>> 5d6c3a02c1123564e6be2ad64fd14b056dffe8d3
