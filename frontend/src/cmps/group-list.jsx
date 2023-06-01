import { useSelector } from 'react-redux'
import { addEmptyGroup } from '../store/selected-board.actions'
import { GroupPreview } from './group-preview'

export function GroupList({ groups }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	function onAddGroup() {
		addEmptyGroup(board._id, true)
	}

	return (
		<section className="group-list">
			<ul className="clean-list">
				{groups.map(group => (
					<li key={group.id}>
						<GroupPreview group={group} />
					</li>
				))}
			</ul>

			<button onClick={onAddGroup}>Add new group</button>
		</section>
	)
}
