import { useState } from 'react'
import { boardService } from '../../services/board.service'
import { usePopper } from 'react-popper'

export function MemberFilter({ board, setFilter }) {
	function onSetFilter(memberId) {
		setFilter(prev => ({ ...prev, memberId }))
	}

	return (
		<div className="member-filter">
			<span>Quick person filter</span>
			<span>Filter items by person</span>
			<ul className="member-list clean-list">
				{boardService.getBoardMembers(board).map(member => (
					<li key={member._id}>
						<img src={member.imgUrl} alt="member" onClick={() => onSetFilter(member._id)} />
					</li>
				))}
			</ul>
		</div>
	)
}
