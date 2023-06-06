import { useSelector } from 'react-redux'

export function MemberSummary() {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	return <div className="member-summary"></div>
}
