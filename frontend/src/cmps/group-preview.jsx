import { TaskList } from './task-list'

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

			<TaskList groupId={group.id} tasks={group.tasks} />
		</article>
	)
}
