import { useSelector } from "react-redux"

const STATUS_PICKER = 'statusPicker'
const PRIORITY_PICKER = 'priorityPicker'
const DATE_PICKER = 'datePicker'
const TIMELINE_PICKER = 'timelinePicker'
const OWNER_PICKER = 'ownerPicker'
const COLLABORATOR_PICKER = 'collaboratorPicker'

export function GroupSummary({ group }) {

    const board = useSelector(storeState => storeState.selectedBoardModule.selectedBoard)


    return (
        <div className="group-summary flex task-row">

            {board.cmpsOrder.map(cmp => {
                switch (cmp.cmpName) {
                    case STATUS_PICKER:
                    case PRIORITY_PICKER:
                        return <h1>{cmp.cmpName}</h1>
                    case DATE_PICKER:
                        return <h1>{cmp.cmpName}</h1>
                    case COLLABORATOR_PICKER:
                        return <h1>{cmp.cmpName}</h1>
                    case TIMELINE_PICKER:
                        return <h1>{cmp.cmpName}</h1>
                    default:
                        return null
                }
            })}
        </div>
    )
}