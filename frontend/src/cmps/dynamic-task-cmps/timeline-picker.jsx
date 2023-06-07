import { timeStampToDate, darkenHexColor, millisecondsToDays } from '../../services/util.service'
import { boardService } from '../../services/board.service'
import { saveTask } from '../../store/selected-board.actions'
import { useState, useEffect } from 'react'
import { useEffectUpdate } from '../../customHooks/useEffectUpdate'
import { useSelector } from 'react-redux'
import { usePopper } from 'react-popper'
import { DayPicker, useNavigation } from 'react-day-picker'
import { addDays, format } from 'date-fns'
import { ICON_CLOSE } from '../../assets/icons/icons'
import 'react-day-picker/dist/style.css'
import { NEXT_BTN } from '../../assets/icons/daypicker/timeline-btns.js'
import { PREV_BTN } from '../../assets/icons/daypicker/timeline-btns.js'
import { showErrorMsg } from '../../services/event-bus.service'

const pastMonth = new Date() // Define your past month date here

const defaultSelected = {
	from: pastMonth,
	to: addDays(pastMonth, 4),
}

export function TimelinePicker({ task, groupId, defaultWidth }) {
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [groupColor, setGroupColor] = useState(boardService.getGroupById(board, groupId).style.color)
	const [toggle, setToggle] = useState(false)
	const [isHovered, setIsHovered] = useState(false)
	const [hasTimeline, setHasTimeline] = useState(task.timeline && true)
	const [range, setRange] = useState(defaultSelected)
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
		try {
			await saveTask(board._id, groupId, taskToEdit, '')
		} catch {
			showErrorMsg('Something went wrong')
		}
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

	function calculateTimelineProgress() {
		if (!timeline.startDate || !timeline.endDate) return 0

		// Get the current date
		const currentDate = Date.now()

		// Convert the start and end dates to timestamps
		const startTimestamp = timeline.startDate
		const endTimestamp = timeline.endDate

		// Check if the current date is after the end date
		if (currentDate >= endTimestamp) {
			// If so, the progress is 100%
			return `100%`
		}

		const totalDuration = endTimestamp - startTimestamp

		// Calculate the elapsed time from the start date to the current date
		const timePassedSinceStart = currentDate - startTimestamp

		// Calculate the progress as a percentage of time passed
		const progress = (timePassedSinceStart / totalDuration) * 100

		// Round the progress to two decimal places and return as a whole number
		const result = Math.round(progress)
		return `${result}%`
	}

	function getTimestampInDays() {
		const estTime = timeline.endDate - timeline.startDate
		return millisecondsToDays(estTime)
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

	async function clearTaskTimeline() {
		const taskToEdit = { ...task, timeline: null }
		setHasTimeline(false)
		try {
			await saveTask(board._id, groupId, taskToEdit, '')
		} catch {
			showErrorMsg('Something went wrong')
		}
	}

	function NavButtons(props) {
		const { goToMonth, nextMonth, previousMonth } = useNavigation()
		return (
			<div className="nav-buttons-container flex align-center space-evenly">
				<span
					className="month-btn-prev"
					disabled={!previousMonth}
					onClick={() => previousMonth && goToMonth(previousMonth)}
				>
					{PREV_BTN}
				</span>

				<h2>{format(props.displayMonth, 'MMM yyy')}</h2>

				<span
					className="month-btn-next"
					disabled={!nextMonth}
					onClick={() => nextMonth && goToMonth(nextMonth)}
				>
					{NEXT_BTN}
				</span>
			</div>
		)
	}

	return (
		<li
			className="timeline-picker flex align-center justify-center pointer"
			ref={setReferenceElement}
			onClick={ev => onToggleModal(ev)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{ width: defaultWidth }}
		>
			<div className="timeline-container">
				<div className="span-container flex align-center justify-center">
					<div
						className="progress"
						style={!hasTimeline ? { backgroundColor: "#ABABAB" } : {
							background: `linear-gradient(to right, ${isHovered ? darkenHexColor(groupColor) : groupColor
								} ${calculateTimelineProgress()}, #333333 ${calculateTimelineProgress()})`,
						}}>
						<span></span>
					</div>
					<span className="range-preview flex row justify-center">
						{!hasTimeline && (isHovered ?
							(<span>Set Dates</span>) :
							<span>-</span>)
						}
						{hasTimeline &&
								(isHovered ? (
									<span>{getTimestampInDays()}d</span>
								) : (
									<span>{getTimelineRange(timeline)}</span>
								))}
						{isHovered && hasTimeline && (
							<div className="reset-date-btn flex align-center" onClick={() => clearTaskTimeline()}>
								{ICON_CLOSE}
							</div>
						)}
					</span>
				</div>
				{toggle && (
					<div
						className="timeline-popup-container"
						ref={setPopperElement}
						style={styles.popper}
						{...attributes.popper}
					>
						<div className="modal-up-arrow" ref={setArrowElement} style={styles.arrow}></div>
						<DayPicker
							numberOfMonths={2}
							mode="range"
							defaultMonth={pastMonth}
							selected={range}
							// footer={modalFooter}
							onSelect={setRange}
							showOutsideDays
							fixedWeeks
							modifiersClassNames={{
								today: 'my-today',
							}}
							components={{
								Caption: NavButtons,
							}}
						/>
					</div>
				)}
			</div>
		</li>
	)
}
