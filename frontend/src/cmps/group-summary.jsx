import { object } from "prop-types"
import { useSelector } from "react-redux"
import { LabelsProgressBar } from "./group-summary-calc"

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
            {/* <div style={{ width: 400 + 'px' }}></div> */}
            {board.cmpsOrder.map(cmp => {
                switch (cmp.cmpName) {
                    case STATUS_PICKER:
                    case PRIORITY_PICKER:
                        return <LabelsProgressBar key={cmp.id} group={group} type={cmp.cmpName} board={board} />
                    case DATE_PICKER:
                        return <h1 key={cmp.id}>{cmp.cmpName}</h1>
                    case COLLABORATOR_PICKER:
                        return <h1 key={cmp.id}>{cmp.cmpName}</h1>
                    case TIMELINE_PICKER:
                        return <h1 key={cmp.id}>{cmp.cmpName}</h1>
                    default:
                        return null
                }
            })}
        </div>
    )
}