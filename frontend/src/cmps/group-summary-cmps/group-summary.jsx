import { useSelector } from 'react-redux'
import { LabelsProgressBar } from './labels-progress-bar'
import { TimelineSummary } from './timeline-summary'
import { MemberSummary } from './member-summary'
import { getGroupDateSummary, groupHasDate } from '../../services/board.service'

const STATUS_PICKER = 'statusPicker'
const PRIORITY_PICKER = 'priorityPicker'
const DATE_PICKER = 'datePicker'
const TIMELINE_PICKER = 'timelinePicker'
const OWNER_PICKER = 'ownerPicker'
const COLLABORATOR_PICKER = 'collaboratorPicker'

export function GroupSummary({ group, isCollapsed }) {
	const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)

	return (
		<div className={`group-summary flex ${isCollapsed ? 'collapsed' : ''}`}>
			<div className="empty-margin-footer"></div>
			<div className="summary-data-container">
				{isCollapsed && <div className="colored-border" style={{ backgroundColor: group.style.color }}></div>}
				{board.cmpsOrder.map(cmp => {
					switch (cmp.cmpName) {
						case STATUS_PICKER:
						case PRIORITY_PICKER:
							return (
								<div
									style={{ width: cmp.defaultWidth, maxWidth: cmp.defaultWidth }}
									key={cmp.id}
									className="group-summary-data"
								>
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
									}}
									className="empty-owner-container group-summary-data"
								></div>
							)
						case DATE_PICKER:
							return (
								<div
									key={cmp.id}
									className="group-summary-data flex align-center"
									style={{ width: cmp.defaultWidth, maxWidth: cmp.defaultWidth }}
								>
									{groupHasDate(group) && (
										<TimelineSummary
											defaultWidth={cmp.defaultWidth}
											group={group}
											board={board}
											dates={getGroupDateSummary(group)}
										/>
									)}
								</div>
							)
						case COLLABORATOR_PICKER:
							return (
								<div
									style={{ width: cmp.defaultWidth, maxWidth: cmp.defaultWidth }}
									key={cmp.id}
									className="group-summary-data"
								>
									<MemberSummary defaultWidth={cmp.defaultWidth} group={group} />
								</div>
							)
						case TIMELINE_PICKER:
							return (
								<div
									key={cmp.id}
									className="group-summary-data flex align-center"
									style={{ width: cmp.defaultWidth, maxWidth: cmp.defaultWidth }}
								>
									<TimelineSummary defaultWidth={cmp.defaultWidth} group={group} board={board} />
								</div>
							)
						default:
							return null
					}
				})}
			</div>
		</div>
	)
}
