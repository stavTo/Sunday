import { useSelector } from 'react-redux'
import { addGroup, saveBoard } from '../store/selected-board.actions'
import { GroupPreview } from './group-preview'
import { ICON_ADD_GROUP } from '../assets/icons/icons'
import { boardService } from '../services/board.service'
import { showErrorMsg } from '../services/event-bus.service'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useState } from 'react'
export function GroupList({ groups }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [isDragDisabled, setIsDragDisabled] = useState(false)
	const [allGroupsCollapsed, setAllGroupsCollapsed] = useState(false)

	function onAddGroup() {
		addGroup(board._id, true)
	}

	async function handleDrag(result) {
		if (!result.destination) return //if moved outside of containers, we exit.
		if (result.type === 'group') await handleGroupDrag(result)
		else await handleTaskDrag(result)
		setIsDragDisabled(false)
		setAllGroupsCollapsed(false)
	}

	async function handleGroupDrag(result) {
		const newBoard = structuredClone(board)
		const groupToMove = newBoard.groups.splice(result.source.index, 1)[0]
		newBoard.groups.splice(result.destination.index, 0, groupToMove)
		saveBoard(newBoard)
	}

	async function handleTaskDrag(result) {
		// find groupId and taskIdx in destination and source.
		const destinationGroupId = result.destination.droppableId
		const sourceGroupId = result.source.droppableId
		const destinationIdx = result.destination.index
		const sourceIdx = result.source.index
		const boardToSave = structuredClone(board)

		//if no changes were made, we exit.
		if (sourceGroupId === destinationGroupId && sourceIdx === destinationIdx) return

		// get the groups by ID
		const destinationGroup = boardService.getGroupById(board, destinationGroupId)
		const sourceGroup = boardService.getGroupById(board, sourceGroupId)

		//if group is the same, we use only source group. else, we use both groups.
		const [task] = sourceGroup.tasks.splice(sourceIdx, 1)
		const groupToAppend = sourceGroupId === destinationGroupId ? sourceGroup : destinationGroup
		groupToAppend.tasks.splice(destinationIdx, 0, task)

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
		}
	}

	function onDragStart(ev) {
		setIsDragDisabled(true)
		if (ev.type === 'group') {
			setAllGroupsCollapsed(true)
		}
	}

	if (!board._id) return
	return (
		<DragDropContext
			onDragEnd={handleDrag}
			// onDragStart={onDragStart}
			onBeforeDragStart={onDragStart}
			disableDraggingDuringDrag={isDragDisabled}
		>
			<Droppable droppableId={board._id} type="group">
				{provided => (
					<section {...provided.droppableProps} ref={provided.innerRef} className="group-list">
						<ul className="clean-list">
							{groups.map((group, idx) => (
								<Draggable
									isDragDisabled={isDragDisabled}
									key={group.id}
									draggableId={group.id}
									index={idx}
								>
									{(provided, snapshot) => (
										<li {...provided.draggableProps} ref={provided.innerRef}>
											<GroupPreview
												setAllGroupsCollapsed={setAllGroupsCollapsed}
												isGroupCollapsed={allGroupsCollapsed}
												group={group}
												provided={provided}
											/>
										</li>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</ul>

						<div className="add-group-btn flex" onClick={onAddGroup}>
							<span className="icon">{ICON_ADD_GROUP}</span>
							<span className="txt">Add new group</span>
						</div>
					</section>
				)}
			</Droppable>
		</DragDropContext>
	)
}
