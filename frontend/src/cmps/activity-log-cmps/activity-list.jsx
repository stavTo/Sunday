import { useEffect, useState } from "react"
import { ActivityPreview } from "./activity-preview"
import { ActivityFilter } from "./activity-filter"
import { boardService } from '../../services/board.service'

export function ActivityList({ board }) {
    const [activities, setActivities] = useState([])
    const [filter, setFilter] = useState(boardService.getActivityFilter())
    
    useEffect(() => {
        setActivities(boardService.loadActivities(board, filter))
    }, [filter, board])

    function onSetFilter(filter) {
        setFilter(prev => ({ ...prev, ...filter }))
    }

    return (
        <div className="activity-list">
            <ul className="clean-list">
                <ActivityFilter filter={filter} onSetFilter={onSetFilter} />
                {activities.map(activity => {
                    return <li key={activity.id}>
                        <ActivityPreview activity={activity} filter={filter} />
                    </li>
                })}
            </ul>
        </div>
    )
}