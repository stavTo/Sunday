import { faBarsStaggered, faCalendarDays, faCircleUser, faCrown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ICON_PRIORITY, ICON_STATUS } from '../../assets/icons/icons'
import { useDispatch } from 'react-redux'
import { SET_BOARD } from '../../store/selected-board.reducer'
export function HideColumns({ board }) {
	const dispatch = useDispatch()

	async function onSetHiddenColumn(cmp) {
		const newCmp = { ...cmp, isShown: !cmp.isShown }
		const boardCmps = board.cmpsOrder.map(cmp => (cmp.id === newCmp.id ? newCmp : cmp))
		const newBoard = structuredClone(board)
		newBoard.cmpsOrder = boardCmps

		dispatch({ type: SET_BOARD, board: newBoard })
	}

	return (
		<div className="hide-columns">
			<div className="hide-columns-title">Choose columns to display</div>
			<div className="separator"></div>
			<ul className="hide-columns-list clean-list">
				{board.cmpsOrder.map((cmp, idx) => {
					let cmpTitle
					switch (cmp.cmpName) {
						case 'statusPicker':
							cmpTitle = 'Status'
							break
						case 'priorityPicker':
							cmpTitle = 'Priority'
							break
						case 'ownerPicker':
							cmpTitle = 'Owner'
							break
						case 'collaboratorPicker':
							cmpTitle = 'Collaborators'
							break
						case 'datePicker':
							cmpTitle = 'Date'
							break
						case 'timelinePicker':
							cmpTitle = 'Timeline'
							break
						default:
							cmpTitle = null
					}

					return (
						cmpTitle && (
							<li onClick={() => onSetHiddenColumn(cmp)} className="column-item btn-primary" key={cmp.id}>
								<span className="icon-name-container">
									<DynamicSVG type={cmp.cmpName} />
									<span>{cmpTitle}</span>
								</span>
								<input type="checkbox" checked={cmp.isShown} readOnly />
							</li>
						)
					)
				})}
			</ul>
		</div>
	)
}

function DynamicSVG({ type }) {
	switch (type) {
		case 'datePicker':
			return <FontAwesomeIcon icon={faCalendarDays} />
		case 'timelinePicker':
			return <FontAwesomeIcon icon={faBarsStaggered} />
		case 'ownerPicker':
			return <FontAwesomeIcon icon={faCrown} />
		case 'collaboratorPicker':
			return <FontAwesomeIcon icon={faCircleUser} />
		case 'statusPicker':
			return <span>{ICON_STATUS}</span>
		case 'priorityPicker':
			return <span>{ICON_PRIORITY}</span>

		default:
			return
	}
}
