import { useEffect, useState } from "react"
import { ActivityPreview } from "./activity-preview"
import { ActivityFilter } from "./activity-filter"

export function ActivityList({ board }) {
    const [activities, setActivities] = useState(board.activities)

    return (
        <div className="activity-list">
            <ul className="clean-list">
                <ActivityFilter />
                {activities.map(activity => {
                    return <li key={activity.id}>
                        <ActivityPreview activity={activity} board={board} />
                    </li>
                })}
            </ul>
        </div>
    )
}