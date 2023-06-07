import { useEffect, useState } from "react"
import { timeStampToDate, darkenHexColor, millisecondsToDays, isValidTimestamp } from "../../services/util.service"
import { getGroupDateSummary, groupHasDate } from '../../services/board.service'

export function DateSummary({ defaultWidth, group, board }) {
    const [isHovered, setIsHovered] = useState(false)
    const [dates, setDates] = useState(getGroupDateSummary(group))

    useEffect(() => {
        setDates(getGroupDateSummary(group))
    }, [board])

    useEffect(() => {
        calculateDateProgress()
        getTimelineRange(dates)
    }, [dates])

    function calculateDateProgress() {
        if (!dates) return 0
        const { earliestDate, latestDate } = dates
        if (isNaN(earliestDate) || isNaN(latestDate)) return
        const currentDate = Date.now()

        const startTimestamp = earliestDate
        const endTimestamp = latestDate

        if (currentDate >= endTimestamp) {
            return `100%`
        }

        const totalDuration = endTimestamp - startTimestamp
        const timePassedSinceStart = currentDate - startTimestamp
        const progress = (timePassedSinceStart / totalDuration) * 100

        const result = Math.round(progress)
        return `${result}%`
    }

    function getTimelineRange(dates) {
        if (!dates) return
        const { earliestDate, latestDate } = dates

        if (!isValidTimestamp(earliestDate) || !isValidTimestamp(latestDate)) return

        const startMonth = timeStampToDate(earliestDate).slice(0, 3)
        const endMonth = timeStampToDate(latestDate).slice(0, 3)

        const startDay = timeStampToDate(earliestDate).slice(4)
        const endDay = timeStampToDate(latestDate).slice(4)

        if (startMonth === endMonth) {
            return ` ${startMonth} ${startDay}-${endDay}`
        } else {
            return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
        }
    }

    function getTimestampInDays() {
        if (!dates) return
        const { earliestDate, latestDate } = dates
        const estTime = latestDate - earliestDate 
        return millisecondsToDays(estTime)
    }

    return (
        <div
            className="timeline-picker flex align-center justify-center pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ width: defaultWidth }}
        >
            <div className="timeline-container">
                <div className="span-container flex align-center justify-center">
                    <div className='progress' style={{ background: `linear-gradient(to right, ${isHovered ? darkenHexColor(group.style.color) : group.style.color} ${calculateDateProgress()}, #333333 ${calculateDateProgress()})` }} >
                        <span style={{ 'width': '50%' }}></span>
                    </div>
                    <span className="range-preview flex row justify-center">
                        {(isHovered ? (
                            <span>{getTimestampInDays()}d</span>
                        ) : (
                            <span>
                                {getTimelineRange(dates)}
                            </span>
                        ))}
                    </span>
                </div>
            </div >
        </div >
    )
}