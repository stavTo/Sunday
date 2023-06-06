import { useSelector } from 'react-redux'

export function MemberSummary({ defaultWidth, group }) {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	function getAllGroupCollaborators() {
		const collaborators = group.tasks.reduce((acc, task) => {
			task.collaborators.forEach(collaborator => {
				const isExisting = acc.find(c => c._id === collaborator._id)
				if (!isExisting) acc.push(collaborator)
			})
			return acc
		}, [])
		return collaborators
	}

	return (
		<div className="member-summary" style={{ width: defaultWidth }}>
			<div className="collaborator-img-container">
				{getAllGroupCollaborators().map(collaborator => (
					<img key={collaborator._id} src={collaborator.imgUrl} alt="member img" />
				))}
			</div>
		</div>
	)
}
