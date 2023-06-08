import { useEffect, useState } from 'react'
import { utilService } from '../../services/util.service'
import { boardService } from '../../services/board.service'
import { ICON_CLOCK } from '../../assets/icons/icons'

const CREATED = 'Created'

export function ActivityPreview({ activity, board }) {
    const [task, setTask] = useState({})

    useEffect(() => {
        getTaskById()
    }, [])

    function getTaskById() {
        const group = boardService.getGroupByTask(board, activity.taskId)
        console.log("group:", group)
        const task = boardService.getTaskById(board, group.id, activity.taskId)
        setTask(task)
    }

    return (
        <ul className="clean-list flex gap-1 align-center">
            <li>{ICON_CLOCK} {utilService.timeSince(activity.createdAt)}</li>
            <li><img className="user-img" src={activity.by.imgUrl} /></li>
            <li>{task.title}</li>
            <li>{activity.action.type}</li>
            <DynamicCmp action={activity.action}/>
        </ul>
    )
}

export function DynamicCmp({action}) {
    
    // "groupTitle" : "Marketing",
    // "groupColor" : "#579BFC",

    switch(action.type) {
        case CREATED:
            return (
                <li style={{'color': action.groupColor}}>Group: {action.groupTitle}</li>
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