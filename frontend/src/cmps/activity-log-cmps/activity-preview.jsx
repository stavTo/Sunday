import { utilService } from '../../services/util.service'
import { ICON_CLOCK } from '../../assets/icons/icons'
import { ICON_EXPAND_ARROW } from '../../assets/icons/icons'
import { TippyContainer } from '../tippy-container'
import {
	faBarsStaggered,
	faCalendarDays,
	faCirclePlus,
	faCircleUser,
	faCopy,
	faCrown,
	faPencil,
	faTags,
	faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CREATED_TASK = 'Created task'
const DELETED_TASK = 'Deleted task'
const DUPLICATE_TASK = 'Duplicated task'
const RENAME_TASK = 'Rename task'
const LABEL_TASK = 'Label'
const TIMELINE_TASK = 'Timeline'
const DATE_TASK = 'Date'
const OWNER_TASK = 'Added owner'
const COLLABORATOR_TASK = 'Collaborator'

const CREATED_GROUP = 'Created group'
const DELETED_GROUP = 'Deleted group'

const RENAME_GROUP = 'Rename group'
const CHANGE_COLOR_GROUP = 'Group color changed'
const DUPLICATE_GROUP = 'Group duplicated'

export function ActivityPreview({ activity }) {
	const { action } = activity
	if (!action.type) return

	return (
		<div className="activity-preview clean-list flex align-center fs14">
			<div className="user-action-wrapper flex row">
				<div className="timesince flex">
					{ICON_CLOCK}
					<span className="flex align-center">{utilService.timeSince(activity.createdAt)}</span>
				</div>
				<div className="activity-and-user flex align-center gap-1">
					<TippyContainer txt={activity.by?.fullname}>
						<img className="user-img" src={activity.by?.imgUrl} alt="user" />
					</TippyContainer>
				</div>
			</div>
			<div className="action-and-type-wrapper">
				<TippyContainer txt={action.description}>
					{action.type.toLowerCase().includes('group') ? (
						<span style={{ color: action.groupColor }}>{action.description}</span>
					) : (
						<span>{action.description}</span>
					)}
				</TippyContainer>
				<div className="action-type flex gap-half">
					<div className="type-icon">
						<DynamicSVG type={action.type} />
					</div>
					<TippyContainer txt={action.type}>
						<span>{action.type}</span>
					</TippyContainer>
				</div>
			</div>
			<DynamicCmp action={action} />
		</div>
	)
}

function DynamicSVG({ type }) {
	switch (type) {
		case DATE_TASK:
			return <FontAwesomeIcon icon={faCalendarDays} />
		case TIMELINE_TASK:
			return <FontAwesomeIcon icon={faBarsStaggered} />
		case OWNER_TASK:
			return <FontAwesomeIcon icon={faCrown} />
		case COLLABORATOR_TASK:
			return <FontAwesomeIcon icon={faCircleUser} />
		case CREATED_GROUP:
		case CREATED_TASK:
			return <FontAwesomeIcon icon={faCirclePlus} />
		case LABEL_TASK:
			return <FontAwesomeIcon icon={faTags} />
		case DUPLICATE_GROUP:
		case DUPLICATE_TASK:
			return <FontAwesomeIcon icon={faCopy} />
		case RENAME_GROUP:
		case RENAME_TASK:
		case CHANGE_COLOR_GROUP:
			return <FontAwesomeIcon icon={faPencil} />
		case DELETED_GROUP:
		case DELETED_TASK:
			return <FontAwesomeIcon icon={faTrashCan} />
		default:
			return
	}
}

function DynamicCmp({ action }) {
	const {
		description,
		type,
		groupColor,
		groupTitle,
		oldTaskTitle,
		nameTaskTitle,
		fromLabel,
		toLabel,
		fromTimeline,
		toTimeline,
		fromDate,
		toDate,
		member,
		newGroupTitle,
		newGroupColor,
	} = action

	switch (type) {
		case CREATED_TASK:
		case DELETED_TASK:
		case CREATED_GROUP:
		case DELETED_GROUP:
			return (
				<div className="dynamic-cmp">
					<div className="flex">
						Group: <span style={{ color: groupColor }}>{groupTitle}</span>
					</div>
				</div>
			)
		case RENAME_TASK:
			return (
				<div className="dynamic-cmp">
					<div className="flex">
						<TippyContainer txt={oldTaskTitle}>
							<span>{oldTaskTitle}</span>
						</TippyContainer>
						<div className="arrow">{ICON_EXPAND_ARROW}</div>
						<TippyContainer txt={nameTaskTitle}>
							<span>{nameTaskTitle}</span>
						</TippyContainer>
					</div>
				</div>
			)
		case DUPLICATE_TASK:
			return (
				<div className="dynamic-cmp">
					<div className="flex">
						Group: <span style={{ color: groupColor }}>{groupTitle}</span>
					</div>
				</div>
			)
		case LABEL_TASK:
			return (
				<div className="dynamic-cmp flex align-center">
					<TippyContainer txt={fromLabel.title}>
						<div
							className="old-label flex align-center justify-center"
							style={{ backgroundColor: fromLabel.color }}
						>
							<span>{fromLabel.title}</span>
						</div>
					</TippyContainer>
					<div className="arrow">{ICON_EXPAND_ARROW}</div>
					<TippyContainer txt={toLabel.title}>
						<div
							className="new-label flex align-center justify-center"
							style={{ backgroundColor: toLabel.color }}
						>
							<span>{toLabel.title}</span>
						</div>
					</TippyContainer>
				</div>
			)
		case TIMELINE_TASK:
			return (
				<div className="dynamic-cmp">
					<div className="timeline-container">
						<div className="span-container flex align-center space-between">
							{/*  From timeline ---> */}
							<div
								className="progress fs12 flex align-center justify-center"
								style={{
									backgroundColor: groupColor,
									borderRadius: '5em',
									width: '80px',
									height: '20px',
								}}
							>
								<div className="timeline-wrapper">
									<TippyContainer txt={utilService.getTimelineRange(fromTimeline)}>
										<span className="span-color" style={{ color: '#fff' }}>
											{utilService.getTimelineRange(fromTimeline)}
										</span>
									</TippyContainer>
								</div>
							</div>
							<div className="arrow">{ICON_EXPAND_ARROW}</div>
							{/*  ---> To timeline */}
							<div
								className="progress fs12 flex align-center justify-center"
								style={{
									backgroundColor: groupColor,
									borderRadius: '5em',
									width: '80px',
									height: '20px',
								}}
							>
								<div className="timeline-wrapper">
									<TippyContainer txt={utilService.getTimelineRange(fromTimeline)}>
										<span className="span-color" style={{ color: '#fff' }}>
											{utilService.getTimelineRange(toTimeline)}
										</span>
									</TippyContainer>
								</div>
							</div>
							<span className="range-preview flex row justify-center"></span>
						</div>
					</div>
				</div>
			)
		case DATE_TASK:
			return (
				<div className="dynamic-cmp">
					<div className="flex">
						<span>
							{new Date(fromDate).toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric',
							})}
						</span>
						<div className="arrow">{ICON_EXPAND_ARROW}</div>
						<span>
							{new Date(toDate).toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric',
							})}
						</span>
					</div>
				</div>
			)
		case OWNER_TASK:
			return (
				<div className="dynamic-cmp">
					<div className="flex align-center gap-1">
						<img className="user-img pointer" src={member.imgUrl} alt="user" />
						<span>{member.fullname}</span>
					</div>
				</div>
			)
		case COLLABORATOR_TASK:
			return (
				<div className="dynamic-cmp">
					<div className="collabortor flex align-center gap-1 space-between">
						<span>Added</span>
						<TippyContainer txt={member.fullname}>
							<img className="user-img pointer" src={member.imgUrl} alt="user" />
						</TippyContainer>
					</div>
				</div>
			)
		case RENAME_GROUP:
			return (
				<div className="dynamic-cmp">
					<div className="flex">
						<TippyContainer txt={description}>
							<span>{description}</span>
						</TippyContainer>
						<div className="arrow">{ICON_EXPAND_ARROW}</div>
						<TippyContainer txt={newGroupTitle}>
							<span>{newGroupTitle}</span>
						</TippyContainer>
					</div>
				</div>
			)
		case CHANGE_COLOR_GROUP:
			return (
				<div className="dynamic-cmp">
					<div className="flex">
						<span style={{ color: groupColor }}>{description}</span>
						<div className="arrow">{ICON_EXPAND_ARROW}</div>
						<span style={{ color: newGroupColor }}>{description}</span>
					</div>
				</div>
			)
		case DUPLICATE_GROUP:
			return (
				<div className="dynamic-cmp">
					<div className="flex">
						<span style={{ color: groupColor }}>{groupTitle}</span>
					</div>
				</div>
			)
		default:
			return
	}
}
