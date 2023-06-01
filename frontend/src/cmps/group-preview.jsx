<<<<<<< HEAD
import { TaskList } from "./task-list"
=======
import { TaskList } from './task-list'
>>>>>>> 5d6c3a02c1123564e6be2ad64fd14b056dffe8d3

export function GroupPreview({ group }) {
	return (
		<article className="group-preview">
			<div>{group.tasks.length} Tasks</div>
			<div>
				<h4>{group.title}</h4>
			</div>
			<div>
				<button>Collapse group</button>
			</div>

<<<<<<< HEAD

    return (
        <article className="group-preview">
            <div>{group.tasks.length}</div>
            <div> <h4>{group.title}</h4> </div>
            <div> <button>Collapse group</button>  </div>

            <TaskList tasks={group.tasks} />


        </article>
    )
}
=======
			<TaskList tasks={group.tasks} />
		</article>
	)
}
>>>>>>> 5d6c3a02c1123564e6be2ad64fd14b056dffe8d3
