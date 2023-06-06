import { useEffect, useState } from "react"
import { utilService } from "../../services/util.service"

export function TimelineSummary({ board, group, defaultWidth }) {
    const [isHovered, setIsHovered] = useState(false)
    const [groupHasTimeline, setGroupHasTimeline] = useState(group.tasks[0].timeline)
    const [timeline, setTimeline] = useState({})

    useEffect(() => {
        calculateGroupTimeline()
        if (timeline.startDate && timeline.endDate) {
            calculateTimelineProgress()
        }
    }, [])

    function calculateGroupTimeline() {
        let startDates = []
        let endDates = []

        console.log("groupHasTimeline:", groupHasTimeline)
        if (!groupHasTimeline) return

        if (group.tasks.length === 1) {
            startDates.push((group.tasks[0].startDate))
            endDates.push((group.tasks[0].endDate))
        } else {
            group.tasks.map(task => {
                const { timeline } = task
                
                if (!timeline) return
                if (startDates[timeline.startDate]) return
                startDates.push(timeline.startDate)
                if (endDates[timeline.endDate]) return
                endDates.push(timeline.endDate)
            })
        }



        const earliestDate = Math.min(...startDates)
        const latestDate = Math.max(...endDates)
        setTimeline(prevTimeline => ({ ...prevTimeline, startDate: earliestDate, endDate: latestDate }))
    }

    function calculateTimelineProgress() {
        if (!groupHasTimeline) return 0
        const currentDate = Date.now()

        const startTimestamp = timeline.startDate
        const endTimestamp = timeline.endDate

        if (currentDate >= endTimestamp) {
            return `100%`
        }

        const totalDuration = endTimestamp - startTimestamp

        const timePassedSinceStart = currentDate - startTimestamp

        const progress = (timePassedSinceStart / totalDuration) * 100

        const result = Math.round(progress)
        return `${result}%`
    }


    function getTimestampInDays() {
        const estTime = timeline.endDate - timeline.startDate
        return utilService.millisecondsToDays(estTime)
    }


    function getTimelineRange() {
        const startMonth = utilService.timeStampToDate(timeline.startDate).slice(0, 3)
        const endMonth = utilService.timeStampToDate(timeline.endDate).slice(0, 3)

        const startDay = utilService.timeStampToDate(timeline.startDate).slice(4)
        const endDay = utilService.timeStampToDate(timeline.endDate).slice(4)

        if (startMonth === endMonth) {
            return ` ${startMonth} ${startDay}-${endDay}`
        } else {
            return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
        }
    }

    return (
        <div
            className="timeline-picker flex align-center justify-center pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ width: defaultWidth }}
        >
            <div className="timeline-container">
                {groupHasTimeline && (
                    <div className="span-container flex align-center justify-center">
                        <div className="progress" style={{ background: `linear-gradient(to right, ${group.style.color} ${calculateTimelineProgress()}, #333333 ${calculateTimelineProgress()})` }} >
                            <span style={{ 'width': '50%' }}></span>
                        </div>
                        <span className="range-preview flex row justify-center">
                            {/* <span>{getTimelineRange()}d</span> */}
                            {groupHasTimeline &&
                                (isHovered ? (
                                    <span>{getTimestampInDays()}d</span>
                                ) : (
                                    <span>
                                        {getTimelineRange()}
                                    </span>
                                ))}
                        </span>
                    </div>
                )}
            </div >
        </div >
    )
}