import { taskService } from "../services/task.service.js"
import { TaskListHeader } from './task-list-header.jsx'
import { TaskPreview } from "./task-preview.jsx"

export function TaskList(tasks) {


    return (
        <ul className="task-list">
            <TaskListHeader task={task} />
            {tasks.map((task) => {
                <li key={task._id}>
                    <TaskPreview task={task} />
                </li>
            })}
        </ul>
    )
}