import { useEffect, useState } from 'react'
import { TippyContainer } from '../tippy-container'

export function MemberSummary({ defaultWidth, group }) {
	const [allGroupCollaborators, setAllGroupCollaborators] = useState()

	useEffect(() => {
		setAllGroupCollaborators(getAllGroupCollaborators())
		// eslint-disable-next-line
	}, [group])

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

	function getMaximumCollaboratorsToShow() {
		return Math.floor((parseInt(defaultWidth) - 30) / 30)
	}

	function getRemainingCollaboratorNames(idx) {
		let names = []
		{
			for (let i = idx; i < allGroupCollaborators.length; i++) {
				names.push(
					<span key={allGroupCollaborators[i]._id}>
						{allGroupCollaborators[i].fullname}
						{!!(allGroupCollaborators.length - 1 - i) && ','}
						<br />
					</span>
				)
			}
		}

		return names
	}
	if (!allGroupCollaborators) return
	return (
		<div className="member-summary" style={{ width: defaultWidth }}>
			<div className="collaborator-img-container">
				{allGroupCollaborators.map((collaborator, idx) => {
					const maxCollaboratorsToShow = getMaximumCollaboratorsToShow()
					if (idx < maxCollaboratorsToShow) {
						return <img key={collaborator._id} src={collaborator.imgUrl} alt="member img" />
					} else if (idx === maxCollaboratorsToShow) {
						return (
							<TippyContainer key={collaborator._id} txt={getRemainingCollaboratorNames(idx)}>
								<span className="extra-members-box">+{allGroupCollaborators.length - idx}</span>
							</TippyContainer>
						)
					}
				})}
			</div>
		</div>
	)
}
