import { useEffect, useState } from "react"
import { ActivityPreview } from "./activity-preview"

export function ActivityList({ board }) {
    const [activities, setActivities] = useState(board.activities)

    useEffect(() => {
        // console.log("activities:", activities)
    }, [])

    return (
        <div className="activity-list">
            <ul className="clean-list">
                {activities.map(activity => {
                    return <li key={activity.id}>
                        <ActivityPreview activity={activity} board={board} />
                    </li>
                })}
            </ul>
        </div>
    )
}