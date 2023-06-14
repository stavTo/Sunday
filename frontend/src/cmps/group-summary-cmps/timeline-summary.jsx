import { useEffect, useState } from 'react'
import { timeStampToDate, darkenHexColor, millisecondsToDays } from '../../services/util.service'

export function TimelineSummary({ board, group, defaultWidth }) {
	const [isHovered, setIsHovered] = useState(false)
	const [groupHasTimeline, setGroupHasTimeline] = useState(getGroupTimelines())
	const [timeline, setTimeline] = useState({})

	useEffect(() => {
		setGroupHasTimeline(getGroupTimelines())
		calculateGroupTimeline()
		// eslint-disable-next-line
	}, [board, group])

	function getGroupTimelines() {
		return group?.tasks?.some(task => task?.timeline?.startDate && task?.timeline?.endDate)
	}

	function calculateGroupTimeline() {
		let startDates = []
		let endDates = []
		if (!groupHasTimeline) return

		group.tasks.forEach(task => {
			const { timeline } = task
			if (!timeline || !timeline.startDate || !timeline.endDate) return
			if (startDates.includes(timeline.startDate)) return
			startDates.push(timeline.startDate)
			if (endDates.includes(timeline.endDate)) return
			endDates.push(timeline.endDate)
		})
		if (!startDates.length || !endDates.length) return
		const earliestDate = Math.min(...startDates)
		const latestDate = Math.max(...endDates)
		if (!earliestDate || !latestDate) return

		setTimeline(prevTimeline => ({ ...prevTimeline, startDate: earliestDate, endDate: latestDate }))
	}

	function calculateTimelineProgress() {
		if (!groupHasTimeline) return 0
		const currentDate = Date.now()
		const { startDate, endDate } = timeline

		if (currentDate >= endDate) {
			return `100%`
		}
		const totalDuration = endDate - startDate
		const timePassedSinceStart = currentDate - startDate
		const progress = (timePassedSinceStart / totalDuration) * 100
		const result = Math.round(progress)
		return `${result}%`
	}

	function getTimestampInDays() {
		if (!timeline) return
		const estTime = timeline.endDate - timeline.startDate
		return millisecondsToDays(estTime) || 1
	}

	function getTimelineRange() {
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
	return (
		<div
			className="timeline-picker flex align-center justify-center pointer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{ width: defaultWidth }}
		>
			<div className="timeline-container">
				<div className="span-container flex align-center justify-center">
					<div
						className="progress"
						style={
							groupHasTimeline
								? {
										background: `linear-gradient(to right, ${
											isHovered ? darkenHexColor(group.style.color) : group.style.color
										} ${calculateTimelineProgress()}, #333333 ${calculateTimelineProgress()})`,
								  }
								: { backgroundColor: '#ABABAB' }
						}
					>
						<span style={{ width: '50%' }}></span>
					</div>
					<span className="range-preview flex row justify-center">
						{!groupHasTimeline && <span>-</span>}
						{groupHasTimeline &&
							(isHovered ? <span>{getTimestampInDays()}d</span> : <span>{getTimelineRange()}</span>)}
					</span>
				</div>
			</div>
		</div>
	)
}
