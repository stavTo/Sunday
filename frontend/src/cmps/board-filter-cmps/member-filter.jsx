import { useState } from 'react'
import { boardService } from '../../services/board.service'
import { usePopper } from 'react-popper'
import { TippyContainer } from '../tippy-container'

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
					<TippyContainer txt={member.fullname} offset={[0, 10]}>
						<li key={member._id}>
							<img src={member.imgUrl} alt="member" onClick={() => onSetFilter(member._id)} />
						</li>
					</TippyContainer>
				))}
			</ul>
		</div>
	)
}
