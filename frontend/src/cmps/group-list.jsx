import { useSelector } from 'react-redux'
import { addEmptyGroup, updateGroup } from '../store/selected-board.actions'
import { GroupPreview } from './group-preview'
import { ICON_ADD_GROUP } from '../assets/icons/icons'
import { DragDropContext } from 'react-beautiful-dnd'
import { boardService } from '../services/board.service.local'
export function GroupList({ groups }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)

	function onAddGroup() {
		addEmptyGroup(board._id, true)
	}

	function handleDrag(result) {
		const taskId = result.draggableId
		const destinationGroupId = result.destination.droppableId
		const sourceGroupId = result.source.droppableId
		const destinationIdx = result.destination.index
		const sourceIdx = result.source.index

		const destinationGroup = boardService.getGroupById(board, destinationGroupId)
		console.log(destinationGroup)
		const sourceGroup = boardService.getGroupById(board, sourceGroupId)
		// destinationGroup.splice(destinationIdx, 1)

		//Todo update both groups, then send to updateGroup
		// updateGroup(board._id, sourceGroup, activity='moved groups')
		// updateGroup(board._id, destinationGroup, activity='moved groups')
		// const items = Array.from(groups[0].tasks)
		// const [reorderedItem] = items.splice(result.source.index, 1)
		// items.splice(result.destination.index, 0, reorderedItem)
		// console.log(items)
	}

	return (
		<DragDropContext onDragEnd={handleDrag}>
			<section className="group-list">
				<ul className="clean-list">
					{groups.map(group => (
						<li key={group.id}>
							<GroupPreview group={group} />
						</li>
					))}
				</ul>

				<div className="add-group-btn flex" onClick={onAddGroup}>
					<span className="icon">{ICON_ADD_GROUP}</span>
					<span className="txt">Add new group</span>
				</div>
			</section>
		</DragDropContext>
	)
}
