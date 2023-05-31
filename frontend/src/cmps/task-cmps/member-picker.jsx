export function MemberPicker({ type, task }) {
	console.log(task)
	return <li>{task?.memberIds}</li>
}
