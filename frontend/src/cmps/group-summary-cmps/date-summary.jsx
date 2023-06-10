import { useEffect, useState } from 'react'
import { timeStampToDate, darkenHexColor, millisecondsToDays, isValidTimestamp } from '../../services/util.service'
import { boardService } from '../../services/board.service'

export function DateSummary({ defaultWidth, group, board }) {
	const [isHovered, setIsHovered] = useState(false)
	const [dates, setDates] = useState(boardService.getGroupDateSummary(group))

	useEffect(() => {
		setDates(boardService.getGroupDateSummary(group))
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

		if (currentDate >= latestDate) {
			return `100%`
		}

		const totalDuration = latestDate - earliestDate || 1
		const timePassedSinceStart = currentDate - earliestDate
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
			if (startDay === endDay) {
				return `${startMonth} ${startDay}`
			}
			return ` ${startMonth} ${startDay}-${endDay}`
		} else {
			return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
		}
	}

	function getTimestampInDays() {
		if (!dates) return
		const { earliestDate, latestDate } = dates
		const estTime = latestDate - earliestDate
		const days = millisecondsToDays(estTime)
		return days === 0 ? 1 : days
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
							!dates
								? { backgroundColor: '#ABABAB' }
								: {
										background: `linear-gradient(to right, ${
											isHovered ? darkenHexColor(group.style.color) : group.style.color
										} ${calculateDateProgress()}, #333333 ${calculateDateProgress()})`,
								  }
						}
					>
						<span style={{ width: '50%' }}></span>
					</div>
					<span className="range-preview flex row justify-center">
						{!dates && <span>-</span>}
						{dates &&
							(isHovered ? <span>{getTimestampInDays()}d</span> : <span>{getTimelineRange(dates)}</span>)}
					</span>
				</div>
			</div>
		</div>
	)
}
