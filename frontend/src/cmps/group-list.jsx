import { useSelector } from 'react-redux'
import { addEmptyGroup, saveBoard } from '../store/selected-board.actions'
import { GroupPreview } from './group-preview'
import { ICON_ADD_GROUP } from '../assets/icons/icons'
import { boardService } from '../services/board.service.local'
import { showErrorMsg } from '../services/event-bus.service'
import { DragDropContext } from 'react-beautiful-dnd'
import { useState } from 'react'
export function GroupList({ groups }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [isDragDisabled, setIsDragDisabled] = useState(false)
	function onAddGroup() {
		addEmptyGroup(board._id, true)
	}

	async function handleDrag(result) {
		if (!result.destination) return //if moved outside of containers, we exit.

		// find groupId and taskIdx in destination and source.
		const destinationGroupId = result.destination.droppableId
		const sourceGroupId = result.source.droppableId
		const destinationIdx = result.destination.index
		const sourceIdx = result.source.index
		const boardToSave = structuredClone(board)

		//if no changes were made, we exit.
		if (sourceGroupId === destinationGroupId && sourceIdx == destinationIdx) return

		// get the groups by ID
		const destinationGroup = boardService.getGroupById(board, destinationGroupId)
		const sourceGroup = boardService.getGroupById(board, sourceGroupId)

		//if group is the same, we use only source group. else, we use both groups.
		//TODO make this code DRY
		if (sourceGroupId === destinationGroupId) {
			const [task] = sourceGroup.tasks.splice(sourceIdx, 1)
			sourceGroup.tasks.splice(destinationIdx, 0, task)
		} else {
			const [task] = sourceGroup.tasks.splice(sourceIdx, 1)
			destinationGroup.tasks.splice(destinationIdx, 0, task)
		}

		// save changed groups to board. Source first, so if the change was made in source, we exit.
		boardToSave.groups = boardToSave.groups.map(g => {
			if (g.id === sourceGroupId) return sourceGroup
			else if (g.id === destinationGroupId) return destinationGroup
			return g
		})

		try {
			await saveBoard(boardToSave)
		} catch {
			showErrorMsg('failed')
		} finally {
			setIsDragDisabled(false)
		}
	}

	function onDragStart() {
		setIsDragDisabled(true)
	}

	return (
		<DragDropContext onDragEnd={handleDrag} onDragStart={onDragStart} disableDraggingDuringDrag={isDragDisabled}>
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
