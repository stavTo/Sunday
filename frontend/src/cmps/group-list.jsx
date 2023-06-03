import { useSelector } from 'react-redux'
import { addEmptyGroup } from '../store/selected-board.actions'
import { GroupPreview } from './group-preview'
import { ICON_ADD_GROUP } from '../assets/icons/icons'

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

			<div
				className="add-group-btn flex"
				onClick={onAddGroup}>
				<span className="icon">{ICON_ADD_GROUP}</span>
				<span className="txt">Add new group</span>
			</div>
		</section>
	)
}
