import { saveTask } from '../../store/selected-board.actions'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { usePopper } from 'react-popper'
import { DayPicker } from 'react-day-picker'
import { addDays, format } from 'date-fns'
import { ICON_CLOSE } from '../../assets/icons/icons'
import { utilService } from '../../services/util.service'
import { boardService } from '../../services/board.service.local'
import 'react-day-picker/dist/style.css'
import { useEffectUpdate } from '../../customHooks/useEffectUpdate'

const pastMonth = new Date() // Define your past month date here

const defaultSelected = {
	from: pastMonth,
	to: addDays(pastMonth, 4),
}

export function TimelinePicker({ task, groupId }) {
	const [toggle, setToggle] = useState(false)
	const [isHovered, setIsHovered] = useState(false)
	const [hasTimeline, setHasTimeline] = useState(task.timeline && true)
	const [range, setRange] = useState(defaultSelected)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [modalFooter, setModalFooter] = useState(<p>Please pick the first day.</p>)
	const { timeline } = task

	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)
	const [arrowElement, setArrowElement] = useState(null)
	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		modifiers: [
			{ name: 'arrow', options: { element: arrowElement } },
			{ name: 'offset', options: { offset: [0, 8] } },
		],
	})

	useEffectUpdate(() => {
		if (range) {
			onChangeTimelineRange()
			onSetFooter()
		}
		// eslint-disable-next-line
	}, [range])

	useEffect(() => {
		document.addEventListener('mousedown', onClosePicker)
		return () => {
			document.removeEventListener('mousedown', onClosePicker)
		}
	}, [])

	async function onChangeTimelineRange() {
		if (!range.from || !range.to) return
		const startDate = new Date(range.from).getTime()
		const endDate = new Date(range.to).getTime()
		const timeline = { startDate, endDate }
		const taskToEdit = { ...task, timeline }
		await saveTask(board._id, groupId, taskToEdit, '')
		setHasTimeline(true)
	}

	function onClosePicker(ev) {
		if (ev.target.closest('.timeline-container')) return
		setToggle(false)
	}

	function onToggleModal(ev) {
		if (ev.target.closest('.timeline-container')) return
		ev.stopPropagation()
		setToggle(prev => !prev)
	}

	calculateTimelineProgress()

	function calculateTimelineProgress() {
		// Get the current date
		const currentDate = Date.now()

		// Convert the start and end dates to timestamps
		const startTimestamp = timeline.startDate
		const endTimestamp = timeline.endDate
		// 1685884857617 - current day (4 june) (timeline.startDate first task)

		// Check if the current date is after the end date
		if (currentDate >= endTimestamp) {
			// If so, the progress is 100%
			return 100
		}
		// Calculate the total duration of the timeline
		const totalDuration = endTimestamp - startTimestamp
		// console.log("totalDuration, task:", totalDuration, task)

		// Calculate the elapsed time from the start date to the current date
		const timePassedSinceStart = currentDate - startTimestamp
		// console.log("elapsedTime:", elapsedTime)

		// TOTAL DURATION - ELAPSED TIME = how much progress made
		const progressMade = (totalDuration - timePassedSinceStart)
		// 				 NUMERATOR   /   DENOMINATOR
		const result = Math.round(((totalDuration / progressMade) * 100).toFixed(2)) / 2

		// Round the progress percentage to the nearest whole number
		// 113942383 - 29094
		// totalDuration - 

		return Math.round(progressMade).toFixed(2);
	}


	// function calculateTimelineProgress() {
	// 	// if (!timeline || !timeline.startDate || !timeline.endDate || currentDate >= timeline.endDate) {
	// 	// 	return 0
	// 	// }

	// 	const currentDate = Date.now()

	// 	// if (currentDate >= timeline.endDate) {
	// 	// 	return 100
	// 	// }

	// 	const totalDuration = timeline.endDate - timeline.startDate
	// 	// console.log("totalDuration:", totalDuration)
	// 	// 259200000 - 3 days, 345600000 - 4 days
	// 	const elapsedTime = currentDate - timeline.startDate
	// 	console.log("elapsedTime:", elapsedTime, task.title)
	// 	// const progressPercentage = (totalDuration / elapsedTime) * 100

	// 	// console.log("totalDuration/ elapsedTime:", totalDuration / elapsedTime)

	// 	const taskToDisplay = boardService.getGroupByTask(board, task.id)
	// 	// taskToDisplay.style.color
	// 	// return Math.round(progressPercentage)
	// }


	function getEstTime() {
		const estTime = timeline.endDate - timeline.startDate
		return utilService.millisecondsToDays(estTime)
	}

	function onSetFooter() {
		if (range?.from) {
			if (!range.to) {
				setModalFooter(<p>{format(range.from, 'PPP')}</p>)
			} else if (range.to) {
				setModalFooter(
					<p>
						{format(range.from, 'PPP')}-{format(range.to, 'PPP')}
					</p>
				)
			}
		}
	}

	async function clearTaskTimeline() {
		const taskToEdit = { ...task, timeline: null }
		setHasTimeline(false)
		await saveTask(board._id, groupId, taskToEdit, '')
	}

	return (
		<li
			className="timeline-picker flex align-center justify-center pointer"
			ref={setReferenceElement}
			onClick={ev => onToggleModal(ev)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<div className="timeline-container">
				{task.timeline && (
					<div className="span-container flex align-center justify-center">
						<div className="progress">
							<span style={{ 'width': '50%' }}></span>
						</div>
						<span className="range-preview flex row justify-center">
							{hasTimeline &&
								(isHovered ? (
									<span>{getEstTime()}d</span>
								) : (
									<span>
										{utilService.timeStampToDate(timeline.startDate)} -
										{utilService.timeStampToDate(timeline.endDate)}
									</span>
								))}
							{isHovered && hasTimeline && (
								<div className="reset-date-btn flex align-center" onClick={() => clearTaskTimeline()}>
									{ICON_CLOSE}
								</div>
							)}
						</span>
					</div>
				)}
				{toggle && (
					<div
						className="timeline-popup-container"
						ref={setPopperElement}
						style={styles.popper}
						{...attributes.popper}>
						<div className="modal-up-arrow" ref={setArrowElement} style={styles.arrow}></div>
						<DayPicker
							numberOfMonths={2}
							mode="range"
							defaultMonth={pastMonth}
							selected={range}
							footer={modalFooter}
							onSelect={setRange}
						/>
					</div>
				)}
			</div>
		</li>
	)
}
