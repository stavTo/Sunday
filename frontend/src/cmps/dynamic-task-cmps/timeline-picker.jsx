import { saveTask } from '../../store/selected-board.actions'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { usePopper } from 'react-popper'
import { DayPicker } from 'react-day-picker'
import { addDays, format } from 'date-fns'
import { ICON_CLOSE } from '../../assets/icons/icons'
import { utilService } from '../../services/util.service'
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

	function getEstTime() {
		const { timeline } = task
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

	const { timeline } = task
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
