import { useNavigate, useParams } from 'react-router-dom'
import { BoardList } from '../cmps/board-list'
import { BoardHeader } from '../cmps/board-header'
import { GroupList } from '../cmps/group-list'
import { boardService } from '../services/board.service.local'
import { useEffect, useState } from 'react'
import { showErrorMsg } from '../services/event-bus.service'
import { useSelector } from 'react-redux'
import { loadBoard } from '../store/selected-board.actions'

export function BoardDetails() {
	const { boardId } = useParams()
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)
	useEffect(() => {
		if (boardId) loadBoard(boardId)
	}, [boardId])

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
