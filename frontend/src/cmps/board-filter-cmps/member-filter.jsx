import { boardService } from '../../services/board.service'
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
					<TippyContainer key={member._id} txt={member.fullname} offset={[0, 10]}>
						<li>
							<img src={member.imgUrl} alt="member" onClick={() => onSetFilter(member._id)} />
						</li>
					</TippyContainer>
				))}
			</ul>
		</div>
	)
}
