import { useNavigate, useParams } from 'react-router-dom'
import { BoardList } from '../cmps/board-list'
import { BoardHeader } from '../cmps/board-header'
import { GroupList } from '../cmps/group-list'
import { boardService } from '../services/board.service.local'
import { useEffect, useState } from 'react'
import { showErrorMsg } from '../services/event-bus.service'

export function BoardDetails() {
	const { boardId } = useParams()
	const [board, setBoard] = useState(boardService.getEmptyBoard())
	useEffect(() => {
		if (boardId) loadBoard()
	}, [boardId])

	async function loadBoard() {
		try {
			const board = await boardService.getById(boardId)
			setBoard(board)
		} catch (err) {
			console.log(err)
			showErrorMsg(`Board ${boardId} does not exists.`)
		}
	}
	return (
		<section className="board-details">
			<BoardList />
			<section className="board-container">
				<BoardHeader board={board} />
				<GroupList groups={board.groups} />
			</section>
		</section>
	)
}
