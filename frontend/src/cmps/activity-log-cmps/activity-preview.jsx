import { utilService } from '../../services/util.service'
import { ICON_CLOCK } from '../../assets/icons/icons'
import { ICON_EXPAND_ARROW } from '../../assets/icons/icons'
import { TippyContainer } from '../tippy-container'
import Tippy from '@tippyjs/react'
const CREATED_TASK = 'Created task'
const DELETED_TASK = 'Deleted task'
const DUPLICATE_TASK = 'Duplicated task'
const RENAME_TASK = 'Rename task'
const LABEL_TASK = 'Label'
const TIMELINE_TASK = 'Timeline'
const DATE_TASK = 'Date'
const OWNER_TASK = 'Added owner'
const COLLABORATOR_TASK = 'People'

const CREATED_GROUP = 'Created group'
const DELETED_GROUP = 'Deleted group'

const RENAME_GROUP = 'Rename group'
const CHANGE_COLOR_GROUP = 'Group color changed'
const DUPLICATE_GROUP = 'Group duplicated'

export function ActivityPreview({ activity, board }) {
	if (!activity.action.type) return

    const { action } = activity
    return (
        <div className="activity-preview clean-list flex align-center fs14">
            <div className="timesince flex">
                {ICON_CLOCK}
                <span className="flex align-center">{utilService.timeSince(activity.createdAt)}</span>
            </div>
            <div className="activity-and-user flex align-center gap-1">
                <img className="user-img" src={activity.by.imgUrl} />
                {action.type.toLowerCase().includes('group') ?
                    <span style={{ 'color': action.groupColor }}>{action.description}</span>
                    :
                    <span>{action.description}</span>
                }
            </div>
            <div className="action-type">
                <span>{action.type}</span>
            </div>
            <DynamicCmp action={action} />
        </div>
    )
}

export function DynamicCmp({ action }) {
    switch (action.type) {
        case CREATED_TASK:
        case DELETED_TASK:
        case CREATED_GROUP:
        case DELETED_GROUP:
            return (
                <div className="dynamic-cmp">Group: <span style={{ 'color': action.groupColor }}>{action.groupTitle}</span></div>
            )
        case RENAME_TASK:
            return (
                <div className="dynamic-cmp">{action.oldTaskTitle}
                    <div className="arrow">
                        {ICON_EXPAND_ARROW}
                    </div> {action.nameTaskTitle}
                </div>
            )
        case DUPLICATE_TASK:
            return (
                <div className="dynamic-cmp">
                    Group: <span style={{ 'color': action.groupColor }}>{action.groupTitle}</span></div>
            )
        case LABEL_TASK:
            return (
                <div className="dynamic-cmp flex align-center">
                    <TippyContainer txt={action.fromLabel.title}>
                        <div className="old-label flex align-center justify-center" style={{ 'backgroundColor': action.fromLabel.color }}>
                            <span>{action.fromLabel.title}</span>
                        </div>
                    </TippyContainer>
                    <div className="arrow">
                        {ICON_EXPAND_ARROW}
                    </div>
                    <TippyContainer txt={action.toLabel.title}>
                        <div className="new-label flex align-center justify-center" style={{ 'backgroundColor': action.toLabel.color }}>
                            <span>{action.toLabel.title}</span>
                        </div>
                    </TippyContainer>
                </div>
            )
        case TIMELINE_TASK:
            return (
                <div className="dynamic-cmp">
                    <div className="timeline-container">
                        <div className="span-container flex align-center justify-center">
                            {/*  From timeline ---> */}
                            <div
                                className="progress fs12 flex align-center justify-center"
                                style={{ backgroundColor: action.groupColor, 'borderRadius': '5em', 'width': '80px', 'height': '20px' }}>
                                <div className="timeline-wrapper">
                                    <TippyContainer txt={utilService.getTimelineRange(action.fromTimeline)}>
                                        <span className="span-color" style={{ 'color': '#fff' }}>
                                            {utilService.getTimelineRange(action.fromTimeline)}
                                        </span>
                                    </TippyContainer>
                                </div>
                            </div>
                            <div className="arrow">
                                {ICON_EXPAND_ARROW}
                            </div>
                            {/*  ---> To timeline */}
                            <div
                                className="progress fs12 flex align-center justify-center"
                                style={{ backgroundColor: action.groupColor, 'borderRadius': '5em', 'width': '80px', 'height': '20px' }}>
                                <div className="timeline-wrapper">
                                    <TippyContainer txt={utilService.getTimelineRange(action.fromTimeline)}>
                                        <span className="span-color" style={{ 'color': '#fff' }}>
                                            {utilService.getTimelineRange(action.toTimeline)}
                                        </span>
                                    </TippyContainer>
                                </div>
                            </div>
                            <span className="range-preview flex row justify-center">
                            </span>
                        </div>
                    </div>
                </div>
            )
        case DATE_TASK:
            return (
                <div className="dynamic-cmp">
                    {/* <div className="flex align-center justify-center"> */}
                        <span>
                            {new Date(action.fromDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                        <div className="arrow">
                            {ICON_EXPAND_ARROW}
                        </div>
                        <span>
                            {new Date(action.toDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    {/* </div> */}
                </div>
            )
        case OWNER_TASK:
            return (
                <div className="dynamic-cmp">
                    <div className="flex align-center gap-1">
                        {console.log("reached OWNER_TASK:", OWNER_TASK)}
                        <img className="user-img pointer" src={action.member.imgUrl} />
                        <span>{action.member.fullname}</span>
                    </div>
                </div>
            )
        case COLLABORATOR_TASK:
            return (
                <div className="dynamic-cmp">
                    <div className="flex align-center gap-1">
                        <span>Added</span>
                        <TippyContainer txt={action.member.fullname}>
                            <img className="user-img pointer" src={action.member.imgUrl} />
                        </TippyContainer>
                    </div>
                </div>
            )
        case RENAME_GROUP:
            return (
                <div className="dynamic-cmp">
                    <TippyContainer txt={action.description}>
                        <span>
                            {action.description}
                        </span>
                    </TippyContainer>
                    <div className="arrow">
                        {ICON_EXPAND_ARROW}
                    </div>
                    <TippyContainer txt={action.newGroupTitle}>
                        <span>
                            {action.newGroupTitle}
                        </span>
                    </TippyContainer>
                </div>
            )
        case CHANGE_COLOR_GROUP:
            return (
                <div className="dynamic-cmp">
                    <span style={{ 'color': action.groupColor }}>
                        {action.description}
                    </span>
                    <div className="arrow">
                        {ICON_EXPAND_ARROW}
                    </div>
                    <span style={{ 'color': action.newGroupColor }}>
                        {action.description}
                    </span>
                </div>
            )
        case DUPLICATE_GROUP:
            return (
                <div className="dynamic-cmp">
                    <span style={{ 'color': action.groupColor }}>{action.groupTitle}</span>
                </div>
            )
    }
}
