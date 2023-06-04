import { object } from 'prop-types'
import { useSelector } from 'react-redux'
import { LabelsProgressBar } from './group-summary-calc'

const STATUS_PICKER = 'statusPicker'
const PRIORITY_PICKER = 'priorityPicker'
const DATE_PICKER = 'datePicker'
const TIMELINE_PICKER = 'timelinePicker'
const OWNER_PICKER = 'ownerPicker'
const COLLABORATOR_PICKER = 'collaboratorPicker'

export function GroupSummary({ group }) {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	return (
		<div className="group-summary flex">
			<div className="empty-margin-footer"></div>
			{/* <div style={{ width: 400 + 'px' }}></div> */}
			<div className="empty-owner-container group-summary-data"></div>
			{board.cmpsOrder.map(cmp => {
				switch (cmp.cmpName) {
					case STATUS_PICKER:
					case PRIORITY_PICKER:
						return (
							<div className="group-summary-data">
								<LabelsProgressBar key={cmp.id} group={group} type={cmp.cmpName} board={board} />
							</div>
						)
					case DATE_PICKER:
						return (
							<div className="group-summary-data">
								<div key={cmp.id}>{cmp.cmpName}</div>
							</div>
						)
					case COLLABORATOR_PICKER:
						return (
							<div className="group-summary-data">
								<div key={cmp.id}>{cmp.cmpName}</div>
							</div>
						)
					case TIMELINE_PICKER:
						return (
							<div className="group-summary-data">
								<div key={cmp.id}>{cmp.cmpName}</div>
							</div>
						)
					default:
						return null
				}
			})}
		</div>
	)
}
