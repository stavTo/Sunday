import { useEffect, useState } from 'react'
import { utilService } from '../../services/util.service'
import { boardService } from '../../services/board.service'
import { ICON_CLOCK } from '../../assets/icons/icons'
// import { BTN_ARROW } from '../../assets/icons/icons'
import { ICON_EXPAND_ARROW } from '../../assets/icons/icons'
const CREATED_TASK = 'Created task'
const DELETED_TASK = 'Deleted task'
const DUPLICATE_TASK = 'Duplicated task'
const RENAME_TASK = 'Rename task'
const LABEL_TASK = 'Label'


const CREATED_GROUP = 'Created group'
const DELETED_GROUP = 'Deleted group'

const RENAME_GROUP = 'Rename group'
const CHANGE_COLOR_GROUP = 'Group color changed'
const DUPLICATE_GROUP = 'Group duplicated'

export function ActivityPreview({ activity, board }) {
    // const [task, setTask] = useState({})

    useEffect(() => {
        // getTaskById()
    }, [])

    // function getTaskById() {
    // const group = boardService.getGroupByTask(board, activity.taskId)
    // console.log("group:", group)
    // const task = board.groups.find(g= > g.tasks)
    // setTask(task)
    // }

    console.log("activity.action:", activity.action, activity.action.type)
    return (
        <div className="activity-preview clean-list flex align-center fs14">
            <div className="timesince flex">
                {ICON_CLOCK}
                <span className="flex align-center">{utilService.timeSince(activity.createdAt)}</span>
            </div>
            <div className="activity-and-user flex align-center gap-1">
                <img className="user-img" src={activity.by.imgUrl} />
                {activity.action.type.toLowerCase().includes('group') ?
                    // {activity.action.type === CHANGE_COLOR_GROUP ?
                    <span style={{ 'color': activity.action.groupColor }}>{activity.action.description}</span>
                    :
                    <span>{activity.action.description}</span>
                }
            </div>
            <div className="action-type">
                <span>{activity.action.type}</span>
            </div>
            <DynamicCmp action={activity.action} />
        </div>
        // <ul className="activity-preview clean-list flex gap-1 align-center">
        //     <li className="timesince">{ICON_CLOCK} {utilService.timeSince(activity.createdAt)}</li>
        //     <li className="activity-and-user">
        //         <img className="user-img" src={activity.by.imgUrl} />
        //         <span>{activity.action.taskTitle}</span>
        //         </li>
        //     <li className="action-type">{activity.action.type}</li>
        //     <DynamicCmp action={activity.action} />
        // </ul>
    )
}

export function DynamicCmp({ action }) {
    // "groupTitle" : "Marketing",
    // "groupColor" : "#579BFC",
    switch (action.type) {
        case CREATED_TASK:
        case DELETED_TASK:
        case CREATED_GROUP:
        case DELETED_GROUP:
            return (
                <li className="dynamic-cmp">Group: <span style={{ 'color': action.groupColor }}>{action.groupTitle}</span></li>
            )
        case RENAME_TASK:
            return (
                <li className="dynamic-cmp">{action.oldTaskTitle} {'>'} {action.nameTaskTitle}</li>
            )
        case DUPLICATE_TASK:
            return (
                <li className="dynamic-cmp">Group: <span style={{ 'color': action.groupColor }}>{action.groupTitle}</span></li>
            )
        case LABEL_TASK:
            return (
                <li className="dynamic-cmp flex align-center">
                    <div className="old-label flex align-center" style={{ 'backgroundColor': action.fromLabel.color, 'color': '#fff' }}>
                        <span>{action.fromLabel.title}</span>
                    </div>
                    <div className="arrow">
                        {ICON_EXPAND_ARROW}
                    </div>
                    <div className="new-label flex align-center" style={{ 'backgroundColor': action.toLabel.color, 'color': '#fff' }}>
                        <span>{action.toLabel.title}</span>
                    </div>
                </li>
            )
        case RENAME_GROUP:
            return (
                <li className="dynamic-cmp">
                    <span>
                        {action.description}
                    </span> {'>'}
                    <span>
                        {action.newGroupTitle}
                    </span>
                </li>
            )
        case CHANGE_COLOR_GROUP:
            return (
                <li className="dynamic-cmp">
                    <span style={{ 'color': action.groupColor }}>
                        {action.description}
                    </span> {'>'}
                    <span style={{ 'color': action.newGroupColor }}>
                        {action.description}
                    </span>
                </li>
            )
        case DUPLICATE_GROUP:
            return (
                <li className="dynamic-cmp">
                    <span style={{ 'color': action.groupColor }}>{action.groupTitle}</span>
                </li>
            )
    }
}

// {board.cmpsOrder.map(cmp => {
//     switch (cmp.cmpName) {
//         case STATUS_PICKER:
//         case PRIORITY_PICKER:
//             return (
//                 <LabelPicker
//                     defaultWidth={cmp.defaultWidth}
//                     key={cmp.id}
//                     groupId={group.id}
//                     type={cmp.cmpName}
//                     task={task}
//                 />
//             )
//         case DATE_PICKER:
//             return (
//                 <DatePicker
//                     defaultWidth={cmp.defaultWidth}
//                     key={cmp.id}
//                     groupId={group.id}
//                     task={task}
//                 />
//             )
//         case OWNER_PICKER:
//         case COLLABORATOR_PICKER:
//             return (
//                 <MemberPicker
//                     defaultWidth={cmp.defaultWidth}
//                     key={cmp.id}
//                     type={cmp.cmpName}
//                     groupId={group.id}
//                     task={task}
//                 />
//             )
//         case TIMELINE_PICKER:
//             return (
//                 <TimelinePicker
//                     defaultWidth={cmp.defaultWidth}
//                     key={cmp.id}
//                     type={cmp.cmpName}
//                     groupId={group.id}
//                     task={task}
//                 />
//             )
//         default:
//             return null
//     }