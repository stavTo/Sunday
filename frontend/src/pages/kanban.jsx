import { Outlet, useNavigate, useParams } from 'react-router'
import { useLocation } from 'react-router-dom'
import { BoardHeader } from '../cmps/board-header'
import { SideBar } from '../cmps/side-bar'
import { useSelector } from 'react-redux'
import { GroupList } from '../cmps/group-list'
import { BoardLoader } from '../cmps/board-loader'
import { loadBoard, saveBoard } from '../store/selected-board.actions'
import { useEffect } from 'react'
import { showErrorMsg } from '../services/event-bus.service'
import { KanbanGroupList } from '../cmps/kanban-cmps/kanban-group-list'

export function Kanban() {
	const { boardId } = useParams()
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const isLoading = useSelector(({ selectedBoardModule }) => selectedBoardModule.isLoading)
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (location.state) saveBoard(location.state)
		else if (boardId) onLoadBoard(boardId)
	}, [boardId])

	useEffect(() => {
		document.title = board.title || document.title // if empty, don't input
	}, [board])

	async function onLoadBoard(boardId) {
		try {
			await loadBoard(boardId)
		} catch {
			showErrorMsg(`Board ${boardId} does not exist. `)
			navigate('/')
		}
	}

	if (isLoading) return <BoardLoader />
	return (
		<section className="kanban">
			<SideBar />
			{/* <WorkspaceBoardList /> */}
			<section className="board-container">
				<BoardHeader board={board} />
				<KanbanGroupList groups={board.groups} />
			</section>
			<Outlet />
			{/* {!!checkedTaskIds.length && <CheckedTasksMenu checkedTaskIds={checkedTaskIds} />} */}
		</section>
	)
}
