import { Outlet, useNavigate, useParams } from 'react-router-dom'
// import { WorkspaceBoardList } from '../cmps/board-list'
import { BoardHeader } from '../cmps/board-header'
import { GroupList } from '../cmps/group-list'
import { useEffect } from 'react'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { loadBoard } from '../store/selected-board.actions'
import { SideBar } from '../cmps/side-bar'
import { BoardLoader } from '../cmps/board-loader'
import { UserCardLoader } from '../cmps/user-card-loader'
import { CheckedTasksMenu } from '../cmps/checked-tasks-menu'

export function BoardDetails() {
	const { boardId } = useParams()
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const isLoading = useSelector(({ selectedBoardModule }) => selectedBoardModule.isLoading)
	const checkedTaskIds = useSelector(({ selectedTaskModule }) => selectedTaskModule.checkedTaskIds)
	const navigate = useNavigate()
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
			showErrorMsg(`Board ${boardId} does not exist. `)
			navigate('/')
		}
	}
	if (isLoading) return <BoardLoader />
	return (
		<section className="board-details">
			<SideBar />
			{/* <WorkspaceBoardList /> */}
			<section className="board-container">
				<BoardHeader board={board} />
				<GroupList groups={board.groups} />
			</section>
			{!!checkedTaskIds.length && <CheckedTasksMenu checkedTaskIds={checkedTaskIds} />}
			<Outlet />
		</section>
	)
}
