import { useEffect, useState } from "react"
import { timeStampToDate, darkenHexColor, millisecondsToDays } from "../../services/util.service"

export function TimelineSummary({ board, group, defaultWidth, dates }) {
    const [isHovered, setIsHovered] = useState(false)
    const [groupHasTimeline, setGroupHasTimeline] = useState(getGroupTimelines())
    const [timeline, setTimeline] = useState({})

    useEffect(() => {
        // if (!group.timeline?.startDate) return
        // if (!group.timeline?.endDate) return
        calculateGroupTimeline()
        // if (timeline.startDate && timeline.endDate) {
        //     calculateTimelineProgress()
        // }
    }, [board])

    function getGroupTimelines() {
        return group?.tasks?.some(task => {
            return task?.timeline?.startDate || task?.timeline?.endDate
        })
    }

    function calculateGroupTimeline() {
        let startDates = []
        let endDates = []

        if (!groupHasTimeline) return

        else {
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
        const { startDate, endDate } = timeline

        const startTimestamp = startDate
        const endTimestamp = endDate

        if (currentDate >= endTimestamp) {
            return `100%`
        }

        const totalDuration = endTimestamp - startTimestamp
        const timePassedSinceStart = currentDate - startTimestamp
        const progress = (timePassedSinceStart / totalDuration) * 100

        const result = Math.round(progress)
        return `${result}%`
    }

    function calculateDateProgress() {
        if (!dates) return 0
        const { startDate, endDate } = dates
        if (isNaN(startDate) || isNaN(endDate)) return
        const currentDate = Date.now()

        const startTimestamp = startDate
        const endTimestamp = endDate

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
        return millisecondsToDays(estTime)
    }

    function getTimelineRange(dates) {
        // For date summary
        if (dates) {
            const { startDate, endDate } = dates

            if (isNaN(startDate) || isNaN(endDate)) return
            
            const startMonth = timeStampToDate(startDate).slice(0, 3)
            const endMonth = timeStampToDate(endDate).slice(0, 3)

            // console.log("startMonth:", startMonth)
            // console.log("endMonth:", endMonth)

            const startDay = timeStampToDate(startDate).slice(4)
            const endDay = timeStampToDate(endDate).slice(4)


            if (startMonth === endMonth) {
                return ` ${startMonth} ${startDay}-${endDay}`
            } else {
                // console.log(`${startMonth} ${startDay} - ${endMonth} ${endDay}`)
                return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
            }
        } 

        // This is for timeline summary
        else {
            const startMonth = timeStampToDate(timeline.startDate).slice(0, 3)
            const endMonth = timeStampToDate(timeline.endDate).slice(0, 3)

            const startDay = timeStampToDate(timeline.startDate).slice(4)
            const endDay = timeStampToDate(timeline.endDate).slice(4)

            if (startMonth === endMonth) {
                return ` ${startMonth} ${startDay}-${endDay}`
            } else {
                return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
            }
        }
    }

    // console.log("dates:", dates)

    return (
        <div
            className="timeline-picker flex align-center justify-center pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ width: defaultWidth }}
        >
            <div className="timeline-container">
                {dates ? (
                    <div className="span-container flex align-center justify-center">
                        {/* {console.log("calculateDateProgress():", calculateDateProgress())} */}
                        <div className='progress' style={{ background: `linear-gradient(to right, ${isHovered ? darkenHexColor(group.style.color) : group.style.color} ${calculateDateProgress()}, #333333 ${calculateDateProgress()})` }} >
                            <span style={{ 'width': '50%' }}></span>
                        </div>
                        <span className="range-preview flex row justify-center">
                            {(isHovered ? (
                                <h3>{getTimestampInDays()}d</h3>
                            ) : (
                                <span>
                                    {getTimelineRange(dates)}
                                    {console.log("getTimelineRange(dates):", getTimelineRange(dates))}
                                </span>
                            ))}
                        </span>
                    </div>
                ) : groupHasTimeline && (
                    <div className="span-container flex align-center justify-center">
                        <div className='progress' style={{ background: `linear-gradient(to right, ${isHovered ? darkenHexColor(group.style.color) : group.style.color} ${calculateTimelineProgress()}, #333333 ${calculateTimelineProgress()})` }} >
                            <span style={{ 'width': '50%' }}></span>
                        </div>
                        <span className="range-preview flex row justify-center">
                            {groupHasTimeline &&
                                (isHovered ? (
                                    <span>{getTimestampInDays()}d</span>
                                ) : (
                                    <span>
                                        {/* Invalid date for some reason */}
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

// return (
//     <div
//         className="timeline-picker flex align-center justify-center pointer"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         style={{ width: defaultWidth }}
//     >
//         <div className="timeline-container">
//             {groupHasTimeline && (
//                 <div className="span-container flex align-center justify-center">
//                     <div className='progress' style={{ background: `linear-gradient(to right, ${isHovered ? darkenHexColor(group.style.color) : group.style.color} ${calculateTimelineProgress()}, #333333 ${calculateTimelineProgress()})` }} >
//                         {/* <div className={`${isHovered ?  'progress darken' : 'progress'}`} style={{ background: `linear-gradient(to right, ${group.style.color} ${calculateTimelineProgress()}, #333333 ${calculateTimelineProgress()})` }} > */}
//                         <span style={{ 'width': '50%' }}></span>
//                     </div>
//                     <span className="range-preview flex row justify-center">
//                         {/* <span>{getTimelineRange()}d</span> */}
//                         {groupHasTimeline &&
//                             (isHovered ? (
//                                 <span>{getTimestampInDays()}d</span>
//                             ) : (
//                                 <span>
//                                     {/* Invalid date for some reason */}
//                                     {getTimelineRange()}
//                                 </span>
//                             ))}
//                     </span>
//                 </div>
//             )}
//         </div >
//     </div >
// )