import { Outlet, useNavigate, useParams } from 'react-router'
import { useLocation } from 'react-router-dom'
import { BoardHeader } from '../cmps/board-header'
import { SideBar } from '../cmps/side-bar'
import { useSelector } from 'react-redux'
import { BoardLoader } from '../cmps/board-loader'
import { initialLoadBoard, loadBoard } from '../store/selected-board.actions'
import { useEffect } from 'react'
import { showErrorMsg } from '../services/event-bus.service'
import { KanbanGroupList } from '../cmps/kanban-cmps/kanban-group-list'
import { SOCKET_EVENT_LOAD_BOARD, socketService } from '../services/socket.service'

export function Kanban() {
	const { boardId } = useParams()
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	const isLoading = useSelector(({ selectedBoardModule }) => selectedBoardModule.isLoading)
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (boardId) onLoadBoard(boardId, location.state)
		// eslint-disable-next-line
	}, [boardId, location])

	useEffect(() => {
		socketService.on(SOCKET_EVENT_LOAD_BOARD, onSetBoard)

		return () => {
			socketService.off(SOCKET_EVENT_LOAD_BOARD, onSetBoard)
		}
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		document.title = board.title || document.title // if empty, don't input
	}, [board])

	function onSetBoard() {
		loadBoard(boardId)
	}

	async function onLoadBoard(boardId, skipLoading) {
		try {
			await initialLoadBoard(boardId, skipLoading)
		} catch {
			showErrorMsg(`Board ${boardId} does not exist. `)
			navigate('/')
		}
	}

	if (isLoading) return <BoardLoader />
	return (
		<section className="kanban">
			<SideBar />
			<section className="board-container default-scroll">
				<BoardHeader board={board} />
				<KanbanGroupList groups={board.groups} />
			</section>
			<Outlet />
		</section>
	)
}
