import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom'
// import { WorkspaceBoardList } from '../cmps/board-list'
import { BoardHeader } from '../cmps/board-header'
import { GroupList } from '../cmps/group-list'
import { useEffect } from 'react'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { initialLoadBoard, loadBoard } from '../store/selected-board.actions'
import { SideBar } from '../cmps/side-bar'
import { BoardLoader } from '../cmps/board-loader'
import { CheckedTasksMenu } from '../cmps/checked-tasks-menu'
import { socketService, SOCKET_EVENT_LOAD_BOARD } from '../services/socket.service'

export function BoardDetails() {
	const { boardId } = useParams()
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const isLoading = useSelector(({ selectedBoardModule }) => selectedBoardModule.isLoading)
	const location = useLocation()
	const checkedTaskIds = useSelector(({ selectedTaskModule }) => selectedTaskModule.checkedTaskIds)

	const navigate = useNavigate()
	useEffect(() => {
		onLoadBoard(boardId, location.state)
	}, [boardId])

	useEffect(() => {
		socketService.on(SOCKET_EVENT_LOAD_BOARD, onSetBoard)

		return () => {
			socketService.off(SOCKET_EVENT_LOAD_BOARD, onSetBoard)
		}
	}, [])

	function onSetBoard() {
		loadBoard(boardId)
	}

	useEffect(() => {
		document.title = board?.title || document.title // if empty, don't input
	}, [board])

	async function onLoadBoard(boardId, skipLoading) {
		try {
			await initialLoadBoard(boardId, skipLoading)
		} catch {
			showErrorMsg(`Board ${boardId} does not exist. `)
			navigate('/')
		}
	}
	if (isLoading || !board) return <BoardLoader />
	return (
		<section className="board-details">
			<SideBar />
			{/* <WorkspaceBoardList /> */}
			<section className="board-container default-scroll">
				<BoardHeader board={board} />
				<GroupList groups={board.groups} />
			</section>
			<Outlet />
			{!!checkedTaskIds.length && <CheckedTasksMenu checkedTaskIds={checkedTaskIds} />}
		</section>
	)
}
