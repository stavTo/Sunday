import { useSelector } from 'react-redux'
import { LabelsProgressBar } from './labels-progress-bar'
import { TimelineSummary } from './timeline-summary'
import { DateSummary } from './date-summary'
import { MemberSummary } from './member-summary'

const STATUS_PICKER = 'statusPicker'
const PRIORITY_PICKER = 'priorityPicker'
const DATE_PICKER = 'datePicker'
const TIMELINE_PICKER = 'timelinePicker'
const OWNER_PICKER = 'ownerPicker'
const COLLABORATOR_PICKER = 'collaboratorPicker'

export function GroupSummary({ group, isCollapsed }) {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	return (
		<div className="group-summary flex">
			<div className="empty-margin-footer"></div>

			{board.cmpsOrder.map(cmp => {
				switch (cmp.cmpName) {
					case STATUS_PICKER:
					case PRIORITY_PICKER:
						return (
							<div width={cmp.defaultWidth} key={cmp.id} className="group-summary-data">
								<LabelsProgressBar
									defaultWidth={cmp.defaultWidth}
									group={group}
									type={cmp.cmpName}
									board={board}
								/>
							</div>
						)
					case OWNER_PICKER:
						return (
							<div
								key={cmp.id}
								style={{
									width: cmp.defaultWidth,
									borderInlineStart: `${isCollapsed ? `6px solid ${group.style.color}` : ''}`,
								}}
								className="empty-owner-container group-summary-data"
							></div>
						)
					case DATE_PICKER:
						return (
							<div key={cmp.id} className="group-summary-data flex align-center">
								<div style={{ width: cmp.defaultWidth }}>
									<DateSummary
										defaultWidth={cmp.defaultWidth}
										group={group}
										board={board}
									/>
								</div>
							</div>
						)
					case COLLABORATOR_PICKER:
						return (
							<div key={cmp.id} className="group-summary-data">
								<MemberSummary defaultWidth={cmp.defaultWidth} group={group} />
							</div>
						)
					case TIMELINE_PICKER:
						return (
							<div key={cmp.id} className="group-summary-data flex align-center">
								<div style={{ width: cmp.defaultWidth }}>
									<TimelineSummary
										defaultWidth={cmp.defaultWidth}
										group={group}
										board={board}
									/>
								</div>
							</div>
						)
					default:
						return null
				}
			})}
		</div>
	)
}
