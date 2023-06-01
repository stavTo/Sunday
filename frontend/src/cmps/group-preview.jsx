import { TaskList } from './task-list'

export function GroupPreview({ group }) {
	return (
		<section className="group-preview">
			<div className="group-header">
				<button>V</button>
				<div>
					<h4>{group.title}</h4>
				</div>
				<div>{group.tasks?.length} Tasks</div>
			</div>
			<TaskList groupId={group.id} tasks={group.tasks} />
		</section>
	)
}
