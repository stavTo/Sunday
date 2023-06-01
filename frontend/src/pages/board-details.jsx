import { useParams } from 'react-router-dom'
// import { BoardList } from '../cmps/board-list'
import { BoardHeader } from '../cmps/board-header'
import { GroupList } from '../cmps/group-list'
import { useEffect } from 'react'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { loadBoard } from '../store/selected-board.actions'
import { SideBar } from '../cmps/side-bar'

export function BoardDetails() {
	const { boardId } = useParams()
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	useEffect(() => {
		if (boardId) onLoadBoard(boardId)
	}, [boardId])

	useEffect(() => {
		document.title = board.title || document.title // if empty, don't input
	}, [board])

	async function onLoadBoard(boardId) {
		try {
			await loadBoard(boardId)
		} catch {
			showErrorMsg(`Board ${boardId} does not exists. `)
		}
	}

	return (
		<section className="board-details">
			<SideBar />
			{/* <BoardList /> */}
			<section className="board-container">
				<BoardHeader board={board} />
				<GroupList groups={board.groups} />
			</section>
		</section>
	)
}
