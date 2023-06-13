import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { useSelector } from 'react-redux'
import { saveTask } from '../../store/selected-board.actions'

import { usePopper } from 'react-popper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { ICON_CLOSE, ICON_ADD_DATE } from '../../assets/icons/icons'
import 'react-day-picker/dist/style.css'
import { showErrorMsg } from '../../services/event-bus.service'

export function DatePicker({ task, groupId, defaultWidth }) {
	const [selected, setSelected] = useState()
	const [toggle, setToggle] = useState(false)
	const board = useSelector(({ selectedBoardModule }) => selectedBoardModule.selectedBoard)
	const [hasDate, setHasDate] = useState(task.dueDate)

	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)
	const [arrowElement, setArrowElement] = useState(null)
	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		modifiers: [
			{ name: 'arrow', options: { element: arrowElement } },
			{ name: 'offset', options: { offset: [0, 8] } },
		],
	})

	useEffect(() => {
		if (selected) {
			onChangeDueDate()
			setHasDate(task)
			setToggle(!toggle)
		}

		document.addEventListener('mousedown', onClosePicker)
		return () => {
			document.removeEventListener('mousedown', onClosePicker)
		}
	}, [selected])

	function onClosePicker(ev) {
		if (ev.target.closest('.date-picker-container')) return
		setToggle(false)
	}

	function onToggleModal(ev) {
		if (ev.target.closest('.date-picker-container')) return
		ev.stopPropagation()
		setToggle(prev => !prev)
	}

	async function onChangeDueDate() {
		const timestamp = selected.getTime()
		const taskToEdit = { ...task, dueDate: timestamp }
		try {
			const action = {
				description: taskToEdit.title,
				fromDate: task.dueDate,
				toDate: taskToEdit.dueDate,
				type: 'Date',
			}
			await saveTask(board._id, groupId, taskToEdit, action)
		} catch {
			showErrorMsg('Cant change date')
		}
	}

	async function clearTaskDueDate() {
		const taskToEdit = { ...task, dueDate: null }
		setHasDate(taskToEdit.dueDate)
		try {
			await saveTask(board._id, groupId, taskToEdit, '')
		} catch {
			showErrorMsg('Something went wrong')
		}
	}

	let footer = <p>Please pick a day.</p>
	if (selected) {
		footer = <p>You picked {format(selected, 'PP')}.</p>
	}

	return (
		<li style={{ width: defaultWidth }} className="date-picker flex align-center" ref={setReferenceElement}>
			<div className={`date-container ${hasDate ? 'has-date' : ''}`}>
				{hasDate && <div className="start-margin"></div>}
				<div
					className="date-preview-container flex align-center justify-center"
					onClick={ev => onToggleModal(ev)}
				>
					{!hasDate && (
						<>
							<div className="add-date-btn flex align-center justify-center">
								<FontAwesomeIcon icon={faCirclePlus} style={{ color: '#0073ea' }} />
								{ICON_ADD_DATE}
							</div>
						</>
					)}
					{task.dueDate && (
						<div className="span-container flex align-center justify-center">
							<span className="date-preview">
								{new Date(task.dueDate).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
								})}
							</span>
						</div>
					)}
				</div>
				{hasDate && (
					<div className="reset-date-btn pointer flex align-center" onClick={() => clearTaskDueDate()}>
						{ICON_CLOSE}
					</div>
				)}
			</div>
			{toggle && (
				<div
					className="date-picker-container"
					ref={setPopperElement}
					style={styles.popper}
					{...attributes.popper}
				>
					<div className="modal-up-arrow date-arrow" ref={setArrowElement} style={styles.arrow}></div>
					<DayPicker mode="single" selected={selected} onSelect={setSelected} footer={footer} />
				</div>
			)}
		</li>
	)
}
