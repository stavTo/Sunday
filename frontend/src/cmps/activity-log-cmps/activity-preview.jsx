import { useEffect, useState } from 'react'
import { utilService } from '../../services/util.service'
import { boardService } from '../../services/board.service'
import { ICON_CLOCK } from '../../assets/icons/icons'

const CREATED_TASK = 'Created task'
const DELETED_TASK = 'Deleted task'

const CREATED_GROUP = 'Created group'
const DELETED_GROUP = 'Deleted group'

const RENAME = 'Rename'


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

    return (
        <ul className="clean-list flex gap-1 align-center">
            <li>{ICON_CLOCK} {utilService.timeSince(activity.createdAt)}</li>
            <li><img className="user-img" src={activity.by.imgUrl} /></li>
            <li>{activity.action.taskTitle}</li>
            <li>{activity.action.type}</li>
            <DynamicCmp action={activity.action} />
        </ul>
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
                <li style={{ 'color': action.groupColor }}>Group: {action.groupTitle}</li>
            )
        case RENAME:
            return (
                <li>{action.oldTaskTitle} > {action.nameTaskTitle}</li>
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